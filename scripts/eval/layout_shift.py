#!/usr/bin/env python3
"""Layout-shift eval: finds on-screen elements that move without the user moving them.

For each scenario in shift_scenarios.json it opens the screen in the iOS simulator, then samples the
accessibility tree (element frames) through a warm `maestro mcp` session:
  load: frames sampled for ~3 s after the screen settles in; any element that moves is a shift.
  tap:  after the scenario's taps, every element that was already on screen is compared with its
        position before the tap; any element that moved is a shift (new or relabelled elements are not).
Fails (exit 1) when any element moves more than THRESHOLD_PT.

Usage: EVAL_UDID=<sim> EVAL_HOST=127.0.0.1:8082 python3 scripts/eval/layout_shift.py [scenario-id ...]
Needs: maestro on PATH, JAVA_HOME pointing at Java 17, Metro serving the app, Expo Go on the simulator.
"""
import json
import os
import re
import signal
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
UDID = os.environ.get('EVAL_UDID', '7941EA3B-CE7C-4395-958E-B3EC17B7672A')
HOST = os.environ.get('EVAL_HOST', '127.0.0.1:8082')
THRESHOLD_PT = 2
SETTLE_S = 2.2
LOAD_WINDOW_S = 3.0
TAP_WINDOW_S = 2.0
STATUS_BAR_BOTTOM = 60
NOISE = {'Expo Go', 'gearshape.fill', 'Horizontal scroll bar, 1 page', 'Vertical scroll bar, 1 page'}
BOUNDS = re.compile(r'\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]')


class Maestro:
    def __init__(self):
        env = dict(os.environ)
        if not Path(env.get('JAVA_HOME', '/missing')).exists():
            env['JAVA_HOME'] = '/opt/homebrew/opt/openjdk@17'
        self.p = subprocess.Popen(['maestro', 'mcp'], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                  stderr=subprocess.DEVNULL, text=True, env=env, start_new_session=True)
        self.n = 0
        self._rpc('initialize', {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'layout-shift', 'version': '1'}})
        self._send({'jsonrpc': '2.0', 'method': 'notifications/initialized'})

    def _send(self, msg):
        self.p.stdin.write(json.dumps(msg) + '\n')
        self.p.stdin.flush()

    def _rpc(self, method, params):
        self.n += 1
        self._send({'jsonrpc': '2.0', 'id': self.n, 'method': method, 'params': params})
        while True:
            line = self.p.stdout.readline()
            if not line:
                raise RuntimeError('maestro mcp exited')
            try:
                msg = json.loads(line)
            except json.JSONDecodeError:
                continue
            if msg.get('id') == self.n:
                return msg

    def call(self, tool, **args):
        res = self._rpc('tools/call', {'name': tool, 'arguments': {'device_id': UDID, **args}})['result']
        if res.get('isError'):
            raise RuntimeError(f'{tool}: {res["content"][0]["text"][:300]}')
        return [c['text'] for c in res['content'] if c.get('type') == 'text']

    def frames(self):
        tree = next(json.loads(t) for t in self.call('inspect_screen') if t.startswith('{'))
        seen, out = {}, {}
        def walk(node):
            key = node.get('a11y') or node.get('rid') or ''
            m = BOUNDS.match(node.get('b', ''))
            if key and m and key not in NOISE and len(key) > 1:
                x1, y1, x2, y2 = map(int, m.groups())
                if y1 >= STATUS_BAR_BOTTOM and x2 > x1 and y2 > y1:
                    seen[key] = seen.get(key, 0) + 1
                    out[key] = (x1, y1, x2, y2)
            for c in node.get('c', []):
                walk(c)
        for el in tree['elements']:
            walk(el)
        # Duplicated labels (a Text inside a Pressable with the same label) collapse to their outermost frame;
        # labels used by unrelated elements are ambiguous and skipped.
        return {k: v for k, v in out.items() if seen[k] <= 2}

    def run(self, yaml):
        self.call('run', yaml=yaml)

    def close(self):
        try:
            os.killpg(self.p.pid, signal.SIGTERM)  # also stops the simulator driver maestro started
        except ProcessLookupError:
            pass


def keyboard_up(frames):
    return any(k in frames for k in ('Dictate', 'Emoji', 'delete'))


def moved(a, b):
    dx, dy = abs(a[0] - b[0]), abs(a[1] - b[1])
    if dy <= THRESHOLD_PT and dx >= 100:  # a screen sliding in or out of the navigation stack, not a layout shift
        return 0
    return max(dx, dy)


def sample(m, seconds):
    shots, end = [], time.time() + seconds
    while time.time() < end:
        shots.append(m.frames())
    return shots


def shifts_against(base, shots, ignore):
    worst = {}
    for shot in shots:
        if keyboard_up(shot):
            continue
        for k, f in shot.items():
            if k in base and k not in ignore:
                d = moved(base[k], f)
                if d > THRESHOLD_PT and d > worst.get(k, (0,))[0]:
                    worst[k] = (d, base[k][1], f[1])
    return worst


def run_scenario(m, sc):
    url = f'exp://{HOST}/--/{sc["route"].lstrip("/")}?preset={sc.get("preset", "demo")}&fresh=1&exp=off&variant={sc.get("variant", "current")}'
    subprocess.run(['xcrun', 'simctl', 'openurl', UDID, url], check=True)
    time.sleep(SETTLE_S)
    tapped = set(re.findall(r'tapOn: "([^"]+)"', sc.get('actions', '')))  # press feedback scales the tapped element
    ignore = set(sc.get('ignore', [])) | tapped
    first = m.frames()
    load = shifts_against(first, sample(m, LOAD_WINDOW_S), ignore)
    tap = {}
    if sc.get('actions'):
        before = m.frames()
        m.run('appId: host.exp.Exponent\n---\n' + sc['actions'])
        tap = shifts_against(before, sample(m, TAP_WINDOW_S), ignore)
    return load, tap


def main():
    scenarios = json.loads((ROOT / 'scripts/eval/shift_scenarios.json').read_text())
    only = set(sys.argv[1:])
    if only:
        scenarios = [s for s in scenarios if s['id'] in only]
    m = Maestro()
    rows, results, failed = [], {}, False
    try:
        for sc in scenarios:
            try:
                try:
                    load, tap = run_scenario(m, sc)
                except RuntimeError:  # the simulator driver drops now and then: one retry
                    time.sleep(3)
                    load, tap = run_scenario(m, sc)
            except Exception as e:
                rows.append(f'| {sc["id"]} | ERROR | {str(e)[:120]} |')
                print(rows[-1], flush=True)
                failed = True
                continue
            results[sc['id']] = {'load': load, 'tap': tap}
            bad = {**{f'load: {k}': v for k, v in load.items()}, **{f'tap: {k}': v for k, v in tap.items()}}
            failed |= bool(bad)
            detail = '<br>'.join(f'{k} moved {d} pt (y {y0}→{y1})' for k, (d, y0, y1) in sorted(bad.items(), key=lambda i: -i[1][0])[:6])
            rows.append(f'| {sc["id"]} | {"FAIL" if bad else "PASS"} | {detail or "no element moved"} |')
            print(rows[-1], flush=True)
    finally:
        m.close()
    out = ROOT / 'docs/evals'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'layout-shift.json').write_text(json.dumps(results, indent=1))
    (out / 'layout-shift.md').write_text(
        '# Layout shift\n\nElements that moved more than '
        f'{THRESHOLD_PT} pt without the user moving them (`scripts/eval/layout_shift.py`).\n\n'
        '| Scenario | Result | Moved |\n| --- | --- | --- |\n' + '\n'.join(rows) + '\n')
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
