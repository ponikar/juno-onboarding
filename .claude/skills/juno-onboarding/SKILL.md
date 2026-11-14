---
name: juno-onboarding
description: Rules for building or changing the Juno onboarding flow (src/app screens, src/ui components, src/copy strings, scripts/eval). Load before touching any onboarding screen, copy, motion or eval. Covers the narrative arc, give-back, commitment chain, visible progress, alive levers, copy rules and the checks to run.
---

# Juno onboarding

Source of truth: `docs/specs/onboarding-v3.md` (wins over `narration-v2.md`). Route order lives in `src/flow.ts`. Read both before changing a screen.

## 1. Narrative arc: problem, founders, fix
- Open with the problem, then the founders, then the fix. Story is 3 beats on one route (`/story`).
- Use only sourced facts. Facts live in `src/copy/facts.ts`; story copy is quoted from Juno's YC launch page (spec section 9).
- Never invent a number, quote, study or user count. No source, no claim.
- The daily check-in is this onboarding's design, not a claim about Juno. Do not present it as a Juno feature fact.

## 2. Give back after each block
- After every block of questions, show what Juno now knows before asking more.
- Insight cards (`/insight-health`, `/insight-days`) sit on the sky: mascot (110 pt), white stat card (stat 34 pt, label, source), kind line in white, the "What I know so far" list in a white panel, the doctor page meter, the next line, then the button.
- Every stat carries its source line.

## 3. Commitment chain
- Order: commit (`/promise`) -> when (`/when`) -> demo (`/demo`) -> reminders permission (`/notify`). All of it comes before sign-up and before the price.
- "Not sure yet" skips `/when` in both directions; the demo then says "tomorrow" and reminders ask `notify.free`.
- One question per screen. `/when` is the only place a time is picked.
- The demo rehearses tomorrow's check-in; chat still shows "Day 1 of 7".

## 4. Visible progress
- Flow bar: part name left, "Part n of 7" right, bar below. Parts: Today, Your health, Your days, You, Your routine, Your snapshot, Your plan.
- Doctor page meter (`src/ui/DoctorPageMeter.tsx`, logic in `src/lib/meter.ts`) on both insight cards and the demo.
  - Ticks: Today always; Health from the health card; Days from the days card; Routine once a commitment answer exists.
  - Forecast follows `src/lib/projectionTimeline.ts`: no or past appointment -> `meter.week`; day 0 -> `meter.soon`; N days -> `meter.forecast` with N + 1 entries. The health card always shows the week forecast.
  - Only ticks newly filled on this screen pop in.

## 5. Alive levers
- Press haptic: light, on press-in, PrimaryButton / TextLink / NavButton only, behind the 700 ms guard. Disabled buttons give none.
- Selection: chips and option rows keep their selection haptic and pop (scale 0.96 to 1, soft spring).
- Typing dots: 450 ms before each JunoReply, then fade in. Never block Continue.
- Breathing mascot: use `Mascot` from `src/ui/Mascot.tsx` (scale 1 to 1.015, 3.2 s loop) on story, commit, demo and insight screens. Use `mascotPeekSky` on sky screens.
- Entrances: the title leads (fade + rise 12 pt, 320 ms), the rest fades in together 60 ms later. Only list rows, story beats, demo steps, meter ticks and the report timeline stagger.
- Insight card: success haptic once, when the card lands.
- Every animation has a reduced-motion branch: opacity only, no breathing, no pop, no slide. Read `useReducedMotion()`.
- Use motion tokens from `src/motion/tokens.ts`. Do not hardcode new durations when a token fits.

## 6. Copy rules
- All copy in `src/copy/strings.ts` (`S`), facts in `src/copy/facts.ts`. Use it word for word; never inline a string in a screen.
- No em dashes.
- No invented numbers. No claims about patterns, improvement or cures.
- 25 words or fewer per line.
- Every `Text` sets `maxFontSizeMultiplier` (`FONT_CAP` for body, `TITLE_CAP` for titles) and wraps at the largest font.

## 7. Build rules
- No new dependencies, colours or fonts. Reuse `src/theme/tokens.ts`, `src/ui/*` components and art in `src/ui/art.ts`.
- Expo SDK 58, Reanimated 4, bun: use `bunx`, install with `bunx expo install` only after asking.
- State shape beyond `commitment` and `checkInTime`: ask first.
- Never touch `src/conditions/*`.

## 8. Checks before calling it done
Run all of these and read the output. A check you did not run is "not run", not "passed".
1. `bunx tsc --noEmit`
2. `bunx expo lint`
3. Unit evals, each must print ALL PASS: `bun scripts/eval/unit.ts`, `bun scripts/eval/meter.ts`, plus `insights.ts`, `projection.ts`, `timeline.ts` in `scripts/eval/` when you touch their area.
4. Maestro full flow: open `exp://127.0.0.1:8082/--/welcome?preset=empty&fresh=1` on the simulator, then `JAVA_HOME=/opt/homebrew/opt/openjdk@17 maestro --device <UDID> test scripts/eval/maestro/full_flow.yaml`.
5. Layout-shift eval: `EVAL_UDID=<UDID> EVAL_HOST=127.0.0.1:8082 python3 scripts/eval/layout_shift.py` (all scenarios in `scripts/eval/shift_scenarios.json`).
6. Screenshot every screen you touched: `xcrun simctl openurl <UDID> "exp://127.0.0.1:8082/--/<route>?preset=demo&fresh=1&variant=current&exp=off"`, then `xcrun simctl io <UDID> screenshot /private/tmp/<name>.png`, and look at it. Check it fits an iPhone 17 Pro with at most one short scroll and the button stays fixed.
7. When you add or reorder a route, update `full_flow.yaml`, `shift_scenarios.json` and `screens.json` in the same change.
