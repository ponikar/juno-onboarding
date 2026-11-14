# Spec: onboarding v4 (icons everywhere, cherry-picked Juno-app screens)
Status: final (auto)        Owner: Darshan        Created: 2026-11-15

Builds on `onboarding-v3.md` and the `juno-onboarding` skill. Same look, same arc, minimal copy.

## 1. Problem
The flow reads well but looks plain next to the production Juno app: most option screens have no icons, and a few production screens that show real product value (pacing, community, Health sync) are missing.

## 2. Order (the decision that matters)
1 welcome, 2 story, 3 consent | Today: 4 try, 5 heard | Your health: 6 goals, 7 conditions, 8 symptoms, 9 meds, 10 insight-health | Your days: 11 appointment, 12 energy, 13 pacing (new), 14 support, 15 community (new), 16 insight-days | You: 17 about, 18 health (+ synced state), 19 source (new) | Your routine: 20 commit, 21 demo | Your snapshot: 22 building, 23 snapshot, 24 report, 25 save | Your plan: 26 how, 27 plans | 28 done, 29 check-in, chat.

Why each pick sits where it does:
- **Pacing right after energy:** the user just told Juno their energy, so the next screen shows what Juno does with it. Answer, then give back.
- **Community right after support:** "who gets what you're going through" leads straight into "you're not alone in this". It turns a hard answer into an offer.
- **Health synced on the health screen itself:** confirmation of the action the user just took, not a new screen.
- **Source at the end of "You":** a business question goes after the user has seen value, before the commitment chain, never before screen 5.
- **When removed:** the time is asked once, on the daily check-in screen (it was asked twice). The demo says "Tomorrow" until then.
- **Not picked:** "What feels hardest now?" (repeats goals), mood slider (repeats energy), rating prompt (asks before value), analysing screens (we have building), app tour (in-app, not onboarding), anything with an unsourced number (100,000+, 500k+, 17 frameworks, 50% more insight).

## 3. Requirements
- R-01 Every option row or chip on a choice screen shows an icon: goals, support (already), about (sex and age chips), commit (yes / good days / not sure), community, source, check-in (already).
- R-02 Snapshot rows show a small white icon per row.
- R-03 Pacing: title, an "Example" week card (4 days, task chips, rest days marked), one Juno nudge line, Continue. No new numbers.
- R-04 Community: title, sub, 4 Juno groups as OptionCards with icons (multi-select), primary "Join N groups" (or Continue when none), "Not now" escape label under it. Picks saved in `groups`.
- R-05 Source: title, 3-column grid of icon tiles (single select), Continue enabled on pick, "Skip" label under it. Saved in `foundVia`.
- R-06 Health: after Allow, the illustration area shows "Apple Health connected" with a check, then auto-advances as today.
- R-07 Icons come from Figma assets where they exist, otherwise cut from the Juno app recording (same 3D style). No new illustration style.
- R-08 Copy stays short: no subtitle unless it adds information; no screen gets more than a title, one sub and its options.

## 4. Edge cases
| Case | Behaviour |
|---|---|
| No groups picked | Primary reads Continue; "Not now" also continues |
| Source skipped | foundVia stays null |
| "Not sure yet" on commit | Straight to demo (no When screen any more) |
| Health "Maybe later" | No synced state, continues |
| Largest font | Grid tiles wrap their label; rows grow |
| Reduce Motion | Opacity only |

## 5. Out of scope
Real group join, real attribution analytics, real Health data, the production app's in-app tour.

## Decisions log (auto)
- Figma MCP hit the Starter-plan limit, and the exported frames are flat; icons for answers, groups and sources are cut from the full-resolution production recording.
- /when removed to keep the flow length flat (3 screens in, 1 out).
- Brand logos on the source screen are the same ones Juno's production app shows on its own attribution screen.
