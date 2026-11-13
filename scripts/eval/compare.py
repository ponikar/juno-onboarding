"""Usage: python3 -I scripts/eval/compare.py [id|all] [--grid]"""
import json
import os
import site
import sys

if site.getusersitepackages() not in sys.path:
    sys.path.append(site.getusersitepackages())  # -I drops user site, where PIL/numpy live

import numpy as np
from PIL import Image, ImageDraw, ImageFont

MAX_MEAN_DIFF = 18.0
MIN_SSIM = 0.75
SCORE_SIZE = (134, 291)
VIEW_W, VIEW_H = 402, 874
APP_SIZE = (1206, 2622)
GRID_PT = 8
LABEL_H = 28

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REF_DIR = os.path.join(ROOT, "docs", "reference")
SHOT_DIR = os.path.join(ROOT, "docs", "evals", "shots")
CMP_DIR = os.path.join(ROOT, "docs", "evals", "compare")
REPORT = os.path.join(ROOT, "docs", "evals", "report.md")
SCORES = os.path.join(ROOT, "docs", "evals", "scores.json")


def load_ref(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    tw, th = APP_SIZE
    if (w, h) != (tw, th) and w >= tw and h >= th:
        l, t = (w - tw) // 2, (h - th) // 2
        im = im.crop((l, t, l + tw, t + th))
    return im.resize(APP_SIZE, Image.LANCZOS) if im.size != APP_SIZE else im


def load_app(path):
    im = Image.open(path).convert("RGB")
    return im.resize(APP_SIZE, Image.LANCZOS) if im.size != APP_SIZE else im


def ssim(a, b):
    a = a.astype(np.float64)
    b = b.astype(np.float64)
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    k = 7
    def box(x):
        p = np.pad(x, k // 2, mode="reflect")
        s = p.cumsum(0).cumsum(1)
        s = np.pad(s, ((1, 0), (1, 0)))
        return (s[k:, k:] - s[:-k, k:] - s[k:, :-k] + s[:-k, :-k]) / (k * k)
    mu_a, mu_b = box(a), box(b)
    va = box(a * a) - mu_a ** 2
    vb = box(b * b) - mu_b ** 2
    cov = box(a * b) - mu_a * mu_b
    m = ((2 * mu_a * mu_b + c1) * (2 * cov + c2)) / ((mu_a ** 2 + mu_b ** 2 + c1) * (va + vb + c2))
    return m


def score(ref, app):
    r = np.asarray(ref.resize(SCORE_SIZE, Image.BOX), dtype=np.float64)
    a = np.asarray(app.resize(SCORE_SIZE, Image.BOX), dtype=np.float64)
    diff = np.abs(r - a).mean(axis=2)
    smap = ssim(np.asarray(ref.convert("L").resize(SCORE_SIZE, Image.BOX)),
                np.asarray(app.convert("L").resize(SCORE_SIZE, Image.BOX)))
    h = SCORE_SIZE[1]
    cuts = [0, h // 3, 2 * h // 3, h]
    bands = {}
    for name, i in zip(("top", "mid", "bot"), range(3)):
        bands[name] = {"diff": float(diff[cuts[i]:cuts[i + 1]].mean()),
                       "ssim": float(smap[cuts[i]:cuts[i + 1]].mean())}
    return float(diff.mean()), float(smap.mean()), bands


def heatmap(ref, app):
    r = np.asarray(ref.resize((VIEW_W, VIEW_H), Image.LANCZOS), dtype=np.float64)
    a = np.asarray(app.resize((VIEW_W, VIEW_H), Image.LANCZOS), dtype=np.float64)
    d = np.clip(np.abs(r - a).mean(axis=2) * 2, 0, 255)
    g = np.asarray(app.convert("L").resize((VIEW_W, VIEW_H)), dtype=np.float64) * 0.35
    rgb = np.stack([np.clip(g + d, 0, 255), g * (1 - d / 255), g * (1 - d / 255)], axis=2)
    return Image.fromarray(rgb.astype(np.uint8))


def grid(im):
    im = im.copy()
    dr = ImageDraw.Draw(im, "RGBA")
    for x in range(0, VIEW_W, GRID_PT):
        dr.line([(x, 0), (x, VIEW_H)], fill=(0, 160, 255, 110 if x % 32 == 0 else 40))
    for y in range(0, VIEW_H, GRID_PT):
        dr.line([(0, y), (VIEW_W, y)], fill=(0, 160, 255, 110 if y % 32 == 0 else 40))
    return im


def panel(ref, app, heat, labels, with_grid):
    views = [ref.resize((VIEW_W, VIEW_H), Image.LANCZOS), app.resize((VIEW_W, VIEW_H), Image.LANCZOS), heat]
    if with_grid:
        views = [grid(v) for v in views]
    gap = 8
    out = Image.new("RGB", (VIEW_W * 3 + gap * 2, VIEW_H + LABEL_H), (255, 255, 255))
    dr = ImageDraw.Draw(out)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
    except OSError:
        font = ImageFont.load_default()
    for i, (v, lab) in enumerate(zip(views, labels)):
        x = i * (VIEW_W + gap)
        out.paste(v, (x, LABEL_H))
        dr.text((x + 6, 6), lab, fill=(0, 0, 0), font=font)
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    with_grid = "--grid" in sys.argv
    target = args[0] if args else "all"
    screens = json.load(open(os.path.join(ROOT, "scripts", "eval", "screens.json")))
    sel = [s for s in screens if target == "all" or s["id"] == target]
    if not sel:
        sys.exit("unknown id: " + target)
    os.makedirs(CMP_DIR, exist_ok=True)
    results = json.load(open(SCORES)) if os.path.exists(SCORES) else {}
    for s in sel:
        shot = os.path.join(SHOT_DIR, s["id"] + ".png")
        if not os.path.exists(shot):
            print(f"{s['id']}: MISSING shot {shot}")
            results[s["id"]] = {"status": "MISSING", "reference": s["reference"]}
            continue
        ref = load_ref(os.path.join(REF_DIR, s["reference"]))
        app = load_app(shot)
        mean, ss, bands = score(ref, app)
        status = "PASS" if mean <= MAX_MEAN_DIFF and ss >= MIN_SSIM else "REVIEW"
        labels = [f"reference: {s['reference']}", f"app: {s['id']} ({s['route']}?preset={s['preset']})",
                  f"diff  mean {mean:.1f}  ssim {ss:.3f}  {status}"]
        panel(ref, app, heatmap(ref, app), labels, with_grid).save(os.path.join(CMP_DIR, s["id"] + ".png"))
        results[s["id"]] = {"status": status, "mean": round(mean, 2), "ssim": round(ss, 4),
                            "bands": {k: {kk: round(vv, 3) for kk, vv in v.items()} for k, v in bands.items()},
                            "reference": s["reference"]}
        b = " ".join(f"{k}:{v['diff']:.1f}/{v['ssim']:.2f}" for k, v in bands.items())
        print(f"{s['id']}: {status} mean={mean:.2f} ssim={ss:.3f} bands(diff/ssim) {b}")
    json.dump(results, open(SCORES, "w"), indent=1)
    order = [s["id"] for s in screens]
    lines = ["# Visual eval report", "",
             f"REVIEW when mean diff > {MAX_MEAN_DIFF} or SSIM < {MIN_SSIM}. Mean diff is 0-255 per pixel at {SCORE_SIZE[0]}x{SCORE_SIZE[1]}. Bands are diff/SSIM.", "",
             "| id | reference | mean diff | SSIM | top | mid | bottom | result |",
             "| --- | --- | --- | --- | --- | --- | --- | --- |"]
    for i in order:
        r = results.get(i)
        if not r:
            continue
        if r["status"] == "MISSING":
            lines.append(f"| {i} | {r['reference']} | - | - | - | - | - | MISSING |")
            continue
        bs = [f"{r['bands'][k]['diff']:.1f}/{r['bands'][k]['ssim']:.2f}" for k in ("top", "mid", "bot")]
        lines.append(f"| {i} | {r['reference']} | {r['mean']:.2f} | {r['ssim']:.3f} | {' | '.join(bs)} | {r['status']} |")
    open(REPORT, "w").write("\n".join(lines) + "\n")
    print("report:", REPORT)


if __name__ == "__main__":
    main()
