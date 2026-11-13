# Shared brief for screen builders (read fully before coding)

Repo /Users/darshan/juno/JunoOnboarding. Expo SDK 58, Expo Router (routes in src/app/, one file per screen, route = file name), Reanimated 4, TypeScript strict. Bun project: use `bunx`. Do NOT add dependencies.

## Sources of truth
- Plan (order, copy, behaviour, motion): docs/JUNO_ONBOARDING_V0_PLAN.md sections 5–9.
- Look: docs/reference/<screen>.png (3x renders of 402x874 pt, 3 px frame border). Figma wins on look; plan wins on copy/order. Measure with: `python3 /private/tmp/claude-501/-Users-darshan-juno-JunoOnboarding/f5093694-a490-4f45-8543-d20d143cdc08/scratchpad/crop.py <ref.png> x y w h out.png` (pt units; draws a 10 pt ruler), then Read out.png. Divide pixels by 3.
- Spec + requirement ids: docs/specs/juno-onboarding-v0.md.

## Use these, don't rebuild them
- `@/copy/strings` → `S`, `fill(template, values)`, `joinList(items)`. EVERY user-facing string comes from here. If you need a new string, add it to strings.ts in YOUR section only, marked `// NEW`.
- `@/state/onboarding` → `useOnboarding()` gives `{ state, set }` (set takes a patch). Model in that file.
- `@/flow` → `nextRoute(route)`, `FLOW`.
- `@/theme/tokens` → colors, type, space, size, radius, shadow. `@/motion/tokens` → EASE_OUT, STATE_MS, ENTER_MS, ENTER_FROM_SCALE, STAGGER_MS/staggerAt, SPRING_SETTLE.
- `@/ui/ScreenShell` → `<ScreenShell variant="plain|sky" route="/goals" footer={...} back close background backgroundHeight>` (+ `Title` with `sub`/`why`, `NavButton`, `SKY_GRADIENT`). Gives nav row (back circle, progress bar), scroll body, footer with safe area.
- `@/ui/PrimaryButton` → `PrimaryButton` (label, onPress, disabled, loading), `TextLink`.
- `@/ui/Chip` → `Chip` (label, selected, onToggle, preTicked), `ChipWrap`, `Tick`.
- `@/ui/OptionCard` → full-width option row with icon + tick (goals/sex/age/support).
- `@/ui/Fields` → `TextField`, `SearchField`.
- `@/ui/JunoReply` → `<JunoReply text={...} id={...} />` fades in ~200 ms after an answer; pass null to reserve space. Never block Continue.
- `@/ui/PressableScale` (every custom pressable), `@/ui/haptics` (`haptic.selection/light/success`), `@/ui/Icon` (SF Symbols name), `@/ui/art` (all images cut from Figma; see docs/ASSETS.md for sizes).
- `@/lib/dates` (trialDates, daysUntil, formatDate, toISODate, addDays), `@/lib/track` → call `track('answer', {screen, ...})` on each answer.

## Rules
- Each screen: `export default function`, wrap in ScreenShell, Continue → `router.push(nextRoute('/x'))`. Back keeps answers (state is global).
- Motion (plan section 8): only `transform`/`opacity`; EASE_OUT for enter; under 300 ms; one entrance per screen; question screens' content does NOT animate on arrival; under `useReducedMotion()` keep opacity, drop translate/scale/spring. Haptic only with a visual.
- Touch targets ≥ 44 pt (use hitSlop). Don't set allowFontScaling=false. Long content must scroll (ScreenShell scrolls by default).
- No medical claims, no invented stats. No literals in JSX text.
- Empty/skipped answers must render a sensible state (see spec section 4).

## Verify every screen (required — this is how you are judged)
1. `bunx tsc --noEmit` clean for your files.
2. Simulator: you get your OWN simulator UDID (in your task). First time: `xcrun simctl boot <UDID>; xcrun simctl install <UDID> ~/.expo/ios-simulator-app-cache/Expo-Go-58.0.7.tar.app`. Metro already runs on port 8082 (do not start/stop Metro). Deep link: `xcrun simctl openurl <UDID> "exp://127.0.0.1:8082/--/goals?preset=demo"` (presets: empty, demo, skipped). First open may show an Expo Go dialog: take a screenshot and tap through it with `xcrun simctl` if needed or reopen the link.
3. Shoot + compare: `EVAL_UDID=<UDID> EVAL_HOST=127.0.0.1:8082 EVAL_WAIT=4 bash scripts/eval/shoot.sh <id>` then `python3 -I scripts/eval/compare.py <id>`; Read docs/evals/compare/<id>.png and LOOK: alignment, spacing, colours, type size, clipping, ugly gaps. Fix and repeat (max 3 rounds per screen). Ids are in scripts/eval/screens.json (you may add ids for extra states to that file).
4. Also check one empty/skipped state per screen by screenshot.
5. Differences that are intentional (new copy, new elements from the plan) → list them in your report.
