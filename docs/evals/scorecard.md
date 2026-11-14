# Eval scorecard (2026-11-14)

Checks from `JUNO_ONBOARDING_V0_EVALS.md`, run on the iOS simulator (iPhone 17 Pro, iOS 26.5). Evidence:

- Static checks: `scripts/eval/static/*.ts`, report in `static-report.md`.
- End-to-end Maestro run: `scripts/eval/maestro/full_flow.yaml`, screenshots in `e2e/`.
- Code and screenshot review: `review-report.md`.
- Layout shift: `layout-shift.md`.

"Fixed" means it failed on the first run and passes after this round. "Not tested" means nobody ran it, and it does not count as a pass.

## Scorecard

| Section | Checks | Pass | Fail | Not tested | Blockers open |
| --- | --- | --- | --- | --- | --- |
| A. Journey | 12 | 8 | 1 | 3 | 0 (J-07 not tested) |
| B. Age 30 to 40+ | 7 | 3 | 2 | 2 | 0 (G-07 needs testers) |
| C. Accessibility | 14 | 7 | 3 | 4 | 1 (A-02); A-03, A-04 and A-05 not tested |
| D. Copy length | 12 | 8 | 2 | 2 | 0 (D-08 needs a source) |
| E. Calls to action | 11 | 4 | 3 | 4 | 0 (T-09 waits for real purchases) |
| F. Overwhelm | 11 | 4 | 3 | 4 | 0 |

**Verdict: not ready to record by the spec's rule.**

- One blocker is open: A-02, white subtitles on the sky.
- Six blocker checks are not tested: J-07, G-07, A-03, A-04, A-05 and D-08. T-09 also stays untested until real purchases are wired.
- Eight majors fail, and the limit is three: J-05, G-02, A-11, D-04, T-01, T-04, O-02 and O-05.

## Results

| ID | Result | Evidence |
| --- | --- | --- |
| J-01 | PASS | e2e: entry and Juno's reply on screen 4 before any sign-up, price or system prompt (`e2e/04-heard.png`) |
| J-02, J-03 | NOT TESTED | needs 5 timed testers |
| J-04 | PASS | "tired and my head hurts" gives Fatigue and Headaches on screens 4, 7 (pre-ticked), 15, 16 and 21 (`e2e/04, 07, 15, 16, 21`) |
| J-05 | FAIL (Major) | read only by analytics: `medicinesSkipped`, `healthAnswered`, `signedIn`, `paywallExitReason`, `notificationsAllowed`; `support`, `sexAtBirth` and `healthDataConnected` are never shown later |
| J-06 | PASS | review: each ask has a reason on its screen, and only consent comes before screen 4 |
| J-07 | NOT TESTED | Back was checked on 5 screens only; resume after kill and reopen works (cold start reopened the chat with answers kept) |
| J-08 | PASS (fixed) | e2e with every escape option; screen 16 showed an empty "Patient" label, now hidden (`report.tsx`) |
| J-09 | PASS | screens 15 and 16 show only answers, checked in the demo run and the skip-everything run |
| J-10 | PASS | the "Still looking" reply and the support reply appear on the same screen |
| J-11 | PASS (fixed) | screen 17 had no progress bar; it is added (`save.tsx`) |
| J-12 | PASS | the longest run without input is screens 14 to 16 |
| G-01 | PASS (fixed) | the report label went from 12 to 13 pt |
| G-02 | FAIL (Major) | on Save (17) the sign-in buttons sit above the bottom third (the Figma auth layout) |
| G-03 | PASS | tap-only works; the slider also takes taps |
| G-04 | NOT TESTED | no reading-level tool was run |
| G-05 | FAIL (Minor) | custom calendar grid and custom sign-in pills (both match Figma) |
| G-06 | PASS | |
| G-07 | NOT TESTED | needs 5 testers |
| A-01 | PASS (fixed, iOS) | chat attach button went from 36 to 44 pt; calendar cells are 46 pt; Android not run |
| A-02 | FAIL (Blocker) | **Still failing:** white 15 pt subtitles on Figma's sky (#3685D4) are 3.84:1 against 4.5 needed. **Fixed:** grey text (#6E6867, 5.1:1), empty tick ring (3.4:1), badges and calendar (#C2531E, 4.6:1), chat bubble (#0064D6, 5.5:1), snapshot and building rows on solid blue (4.75:1+). **Disabled button:** exempt under WCAG 1.4.3 |
| A-03 | NOT TESTED | this round; the earlier AX5 check covered 4 screens |
| A-04 | NOT TESTED | the code branches on `useReducedMotion` everywhere; not run with the setting on |
| A-05 | NOT TESTED | **Fixed in code:** Juno's replies are now announced to VoiceOver (`JunoReply.tsx`, `chat.tsx`), and plan cards report "checked". Not run with VoiceOver |
| A-06 | PASS (fixed) | plan cards now show a tick, not only a border colour |
| A-07 | PASS | suggestions and chips complete the flow; the name is optional |
| A-08 | PASS (fixed) | screen 14 showed the appointment and screen 15 did not; screen 15 now has the row |
| A-09 | PASS | every haptic comes with a visible change |
| A-10 | NOT TESTED | no small-phone simulator in this run |
| A-11 | FAIL (Major) | mocks never fail, so no error states exist |
| A-12 | FAIL (Minor) | no dark mode |
| A-13 | PASS | nothing flashes; the only loop is the spinner on screen 14 |
| A-14 | PASS | resume keeps answers |
| D-01 | PASS (fixed) | `notify.trial` is now "Can I remind you before your trial ends?" |
| D-02 | PASS (fixed) | `symptoms.why` is now one sentence; `welcome.sub` is a tagline, not a reason line |
| D-03 | PASS (fixed) | the flare reply is now 2 sentences and 12 words |
| D-04 | FAIL (Major) | Health 55 words against 40; screen 18 94 against 60 (bullets carried over from Figma 43 and 56) |
| D-05, D-06 | PASS | |
| D-07 | NOT TESTED | |
| D-08 | NOT TESTED (Blocker) | no banned words; "#1 App for chronic illness" and "300K Happy users" come from Juno's Figma welcome screen and need a source from Juno |
| D-09 | PASS | the terms line on screen 19 is 13 pt or larger and on screen without scrolling (`e2e/19-plans.png`) |
| D-10 | PASS | |
| D-11 | FAIL (Minor) | **Fixed:** "Let's" and "We'll" replies now say "I'll". **Still failing:** screen 4 keeps the deck's "Juno heard you" and "Juno logs it for you" |
| D-12 | PASS (fixed) | dates are now in the device's format (`toLocaleDateString`) |
| T-01 | FAIL (Major) | Save has two equal sign-in buttons (Figma auth) |
| T-02 | PASS (fixed) | the notify button now says "Turn on reminders" |
| T-03 | FAIL (Minor) | the button size and position differ on welcome, plans and save |
| T-04 | FAIL (Major) | Health moves on 900 ms after Allow so the reply can be seen |
| T-05 | NOT TESTED | needs a high-frame-rate recording |
| T-06 | PASS | |
| T-07 | PASS | amount, period, charge date and reminder date sit next to the button (`e2e/19-plans.png`) |
| T-08 | PASS | "Continue with the free plan" is on screen; Close chooses the free plan (`plans.tsx`) |
| T-09, T-10 | NOT TESTED | need real purchases |
| T-11 | NOT TESTED | needs testers |
| O-01 | PASS | |
| O-02 | FAIL (Major) | Conditions shows 13 chips (as Figma 17 does) |
| O-03 | NOT TESTED | needs testers |
| O-04 | NOT TESTED | no small-phone simulator in this run |
| O-05 | FAIL (Major) | screen 14 has a looping spinner; screen 4 has three staggered entrances |
| O-06 | FAIL (Minor) | Plans uses 8 text sizes |
| O-07, O-08, O-10 | PASS | |
| O-09, O-11 | NOT TESTED | need testers |
