# Evals
1. Shoot: `bash scripts/eval/shoot.sh [id|all]` -> docs/evals/shots/<id>.png. Env: `EVAL_LINK=expogo|dev` (default expogo, `exp://$EVAL_HOST/--/route`; dev uses `junoonboarding:///route`), `EVAL_HOST=127.0.0.1:8081`, `EVAL_WAIT=2.5`, `EVAL_ROUTE=/x` (override route for one id).
2. Compare: `python3 -I scripts/eval/compare.py [id|all] [--grid]` -> docs/evals/compare/<id>.png (reference | app | diff), docs/evals/report.md, docs/evals/scores.json.
3. REVIEW when mean diff > 18 or SSIM < 0.75 (constants at top of compare.py). Bands = top/mid/bottom thirds.
4. Unit: `bun scripts/eval/unit.ts` (extractSymptoms + date helpers, exit 1 on any FAIL).
5. Screens and their Figma references: scripts/eval/screens.json.
