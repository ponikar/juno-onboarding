# Spec: Juno onboarding v0
Status: final (auto)        Owner: Darshan        Created: 2026-11-14
Detailed source of truth for screens, copy and motion: `docs/JUNO_ONBOARDING_V0_PLAN.md` (the plan). This spec adds requirements and proof.

## 1. Problem
Juno's onboarding is 65 screens / 11.7 min and loses ~50% of starters, mostly at sign-up (17.3%) and the paywall (23.7%).
New users need to get value (log a feeling, see a snapshot) before Juno asks for an account or money.
The repo today is a blank Expo SDK 58 template.

## 2. Users and flows
- New user goes Welcome → consent → logs a feeling → sees Juno log it (screens 1–4, no account).
- New user answers 9 short questions with a Juno reply after each (5–13).
- New user sees a building screen, their snapshot, a doctor-report preview, then saves via sign-up (14–17).
- New user sees how Juno works + trial dates, picks a plan or free, allows notifications, lands in first chat (18–21).

## 3. Requirements
- R-01 WHEN the app opens fresh, THE SYSTEM SHALL show screen 1 with no sign-up sheet; "Try it now" goes to screen 2.
- R-02 WHEN the consent box is unticked, THE SYSTEM SHALL keep Continue disabled on screen 2.
- R-03 WHEN the user types or taps a suggestion on screen 3, THE SYSTEM SHALL enable Continue and save the entry to state.
- R-04 WHEN screen 4 shows, THE SYSTEM SHALL display the entry, a log card with chips from the keyword table (plan §5), and `heard.reply` (or `heard.replyNone` when nothing matches).
- R-05 WHEN screen 7 opens, THE SYSTEM SHALL show the symptoms extracted on screen 4 already ticked.
- R-06 WHEN an answer is chosen on screens 5–13, THE SYSTEM SHALL fade in the matching Juno reply without blocking Continue.
- R-07 WHEN screen 14 shows, THE SYSTEM SHALL list the user's real answers one by one over ~4 s and then move on by itself.
- R-08 WHEN screen 15 shows, THE SYSTEM SHALL show name in the title and rows for conditions, today's symptoms, medicines (or "None added yet"), energy, and the watch line.
- R-09 WHEN screen 16 shows, THE SYSTEM SHALL show a labelled preview report whose first "Recent days" row is today's entry, plus "Ready for your appointment in N days" when a date exists.
- R-10 WHEN any sign-up option on screen 17 is tapped, THE SYSTEM SHALL mark signedIn after a short mocked delay and continue.
- R-11 WHEN screen 18 shows, THE SYSTEM SHALL show trial dates computed from today: today, day 5, day 7.
- R-12 WHEN screen 19 shows, THE SYSTEM SHALL lead the yearly card with "$99.99 a year", show `plans.terms` with real dates, and offer `plans.free` and `plans.cost` links; close = free.
- R-13 WHEN the user goes back from screen 19 without choosing, THE SYSTEM SHALL show the `plans.exitQ` sheet and store the answer.
- R-14 WHEN screen 20 shows, THE SYSTEM SHALL use `notify.trial` for trial users and `notify.free` for free users, with a mocked system prompt.
- R-15 WHEN screen 21 finishes, THE SYSTEM SHALL show the first chat with today's entry logged and `chat.open`.
- R-16 WHEN the user goes back on any screen, THE SYSTEM SHALL keep previous answers.
- R-17 WHEN the app is closed mid-flow and reopened, THE SYSTEM SHALL resume at the same screen with answers (AsyncStorage).
- R-18 WHEN reduced motion is on, THE SYSTEM SHALL keep opacity changes and drop translation, scale and springs.
- R-19 WHEN any screen renders on iPhone 17 Pro, THE SYSTEM SHALL match its Figma reference in layout, colours and type except the documented intentional changes.
- R-20 WHEN the logo on screen 1 is long-pressed, THE SYSTEM SHALL open a debug menu that jumps to any screen.

## 4. Edge cases
| Case | Expected behaviour | Covers |
|---|---|---|
| Entry with no keyword match ("feeling meh") | Card shows entry as written, `heard.replyNone` | R-04 |
| Entry with several matches | All matched chips, in table order, no duplicates | R-04 |
| Empty / whitespace entry | Continue stays disabled | R-03 |
| User unticks pre-ticked symptom on 7 | Stays unticked; `symptoms` updates, `todaySymptoms` unchanged | R-05 |
| No conditions, "Still looking for answers" | `conditions.replyNone`; snapshot row says still looking | R-06, R-08 |
| Medicines "Add later" | Snapshot "None added yet", report omits list cleanly | R-08, R-09 |
| Appointment "None booked" | `appt.replyNone`; no countdown on 16 | R-09 |
| Appointment today | "in 0 days" avoided → computed days ≥ 0, copy uses N as is | R-09 |
| Health data "Later" | No reply claiming connected | R-06 |
| No name typed | Titles drop `{name}` cleanly | R-08 |
| Back from 19 | Exit sheet once, answer stored | R-13 |
| Reopen app on screen 9 | Resumes on 9 | R-17 |
| Largest font size | Text wraps, nothing clipped, buttons still reachable (scroll) | R-19 |
| Double tap Continue | One navigation only | R-16 |

## 5. Out of scope
Real auth, purchases, notifications, health-data access, live model call, NDIS screens, chat beyond first state, analytics backend (console `track` only), Android-specific visual QA.

## 6. Constraints
- Keep Juno's visual design; Figma (flattened screenshots in `docs/reference/`) wins on look, plan wins on order/copy.
- Expo SDK 58, Expo Router, Reanimated 4, gesture-handler; new deps limited to expo-haptics and AsyncStorage (approved). State via React context.
- All user-facing strings in `src/copy/strings.ts`.

## 7. Boundaries for the agents
- Always: use `src/theme/tokens.ts`, `src/motion/tokens.ts`, shared components; run `bunx tsc --noEmit` and `bunx expo lint`.
- Ask first: any further dependency.
- Never: restyle components away from the reference; invent medical claims or stats.

## 8. Done means
- R-01..R-15 -> ui -> simulator screenshot of the screen in the stated state, compared side by side with reference (`docs/evals/compare/`).
- R-04, R-05 -> unit -> `extractSymptoms` cases script.
- R-11, R-12 -> unit -> date helper output for a fixed "today".
- R-16, R-17 -> ui -> navigate back / relaunch and screenshot.
- R-18 -> code check -> every animated style branches on `useReducedMotion`.
- R-19 -> ui -> per-screen pixel diff score + visual review, differences listed in README.
- R-20 -> ui -> screenshot of debug menu.

## 9. Pointers
docs/JUNO_ONBOARDING_V0_PLAN.md
docs/reference/*.png
src/app/
~/.agents/skills/animate-expo/SKILL.md

## 10. Decisions log
2026-11-14 Zustand replaced by React context — avoids a dependency.
2026-11-14 Custom slider and date picker built with gesture-handler/plain views — keeps the Figma look and works in Expo Go.
2026-11-14 Mascot/clouds/key cropped from reference screenshots — Figma has no separate layers.
2026-11-14 Budget 4 h approved by user.
