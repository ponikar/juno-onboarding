# Juno onboarding v0: code and screenshot review

Method: read src/app, src/ui, src/copy/strings.ts, src/motion/tokens.ts, src/theme/tokens.ts; opened docs/evals/shots/{conditions,welcome,plans,save}.png. No device walk, no VoiceOver/TalkBack, no reduced-motion or haptics-off run, no fresh screenshots.

Totals: PASS 13 · FAIL 12 · NOT TESTED 1

| ID | Result | Severity | Evidence |
|---|---|---|---|
| J-06 | PASS | Major | Order: consent (2) consent.tsx, health (13) health.tsx, account (17) save.tsx, plan (19) plans.tsx, notifications (20) notify.tsx (flow.ts). Reasons on screen: strings.ts:32, :192, :252, :294, :325. Nothing before screen 4 except consent. |
| J-09 | PASS | Blocker | snapshot.tsx:15-33 and report.tsx:23-80 render only user answers; the only forward line is "This week I'll watch…" (strings.ts:228), an intent, not a finding. Checked by code only, not across live runs. |
| J-10 | PASS | Major | conditions.tsx: "Still looking" sets reply S.conditions.replyNone (strings.ts:73) on the same screen; support.tsx shows "You're not alone in this." (strings.ts:166) for any choice incl. "No one right now". |
| J-12 | PASS | Minor | flow.ts: no-input screens are 4, then 14-16, then 18; longest run is 14-16. |
| G-02 | FAIL | Major | shots/save.png: "Continue with Google" top edge at ~65% of screen height, above the bottom third (sheet height 437, save.tsx:103). Other footers (ScreenShell footer) sit in the bottom third. |
| G-03 | PASS | Major | EnergySlider.tsx:44-46 pan with minDistance 0 sets value on tap; Sheet backdrop is tappable (Sheet.tsx:17); only long-press is the exempt debug logo (welcome.tsx:53). |
| G-05 | FAIL | Minor | Date: custom grid calendar, not a native picker (ui/Calendar.tsx:56-75). Sign-in: custom grey pills, not native Apple/Google buttons (save.tsx:79-97). |
| G-06 | PASS | Minor | strings.ts copy read in full; success haptic and celebration only on snapshot (15) snapshot.tsx:45 and done (21) done.tsx:24. "appear like magic" (strings.ts:194) is hype, not baby talk. |
| A-04 | NOT TESTED | Blocker | Code guards exist (useReducedMotion in heard.tsx:109, building.tsx:55, snapshot.tsx:39, how.tsx:79, done.tsx:18, welcome.tsx:24, PressableScale.tsx:17, Chip.tsx:45, EnergySlider.tsx:71). Not verified: native stack push and formSheet transitions (_layout.tsx) and Reanimated default reduce-motion on Sheet.tsx:20 SlideInDown / notify.tsx:67 Keyframe. Needs a device run with Reduce Motion on. |
| A-05 | FAIL | Blocker | Juno's reply uses accessibilityLiveRegion only (JunoReply.tsx:16), which is Android-only; iOS VoiceOver gets no announcement (no AccessibilityInfo.announceForAccessibility). Plan cards set accessibilityState {selected} on role radio (plans.tsx:155-156) instead of checked. Chips announce checked (Chip.tsx:22-23). Not run with VoiceOver/TalkBack. |
| A-06 | FAIL | Major | Plan cards: selection shown only by border colour change, same width, no tick (plans.tsx:161, :193-194; shots/plans.png). Chips and option cards pass (tick, Chip.tsx:39, OptionCard.tsx:44). |
| A-07 | PASS | Major | Screen 3 suggestions fill the entry without the keyboard (try.tsx:68-83); searches are optional; chat has suggestion chips (chat.tsx:134-142). Mic does not dictate (try.tsx:56-59, strings.ts:43) but is not needed. |
| A-09 | PASS | Major | Every haptic call sits next to a visible change: chip tick (Chip.tsx:26), heard reply (heard.tsx:44-47), snapshot card (snapshot.tsx:44-45), done text (done.tsx:23-24). report.tsx:19 light haptic is decorative. Code only. |
| A-11 | FAIL | Major | No error states exist: sign-in mock always succeeds (save.tsx:29-39), purchase mock always succeeds (plans.tsx:59-67), name is optional with no validation (about.tsx:34). |
| A-12 | FAIL | Minor | No dark mode (StatusBar style "dark" fixed, _layout.tsx; colors.bg light). Light screens (conditions.png, plans.png lower half, report sheet) are near-white full screen. |
| A-13 | PASS | Blocker | No withRepeat/loop in src (grep). Only repeating motion is the ActivityIndicator spinner (building.tsx:42), which rotates, does not flash. |
| T-01 | FAIL | Major | Save (17) has two filled buttons of equal weight, Google and Apple (save.tsx:57-58, :112-121; shots/save.png). |
| T-03 | FAIL | Minor | Main button changes size and position: welcome is narrower navy (shots/welcome.png, y≈1635/2000), plans sits higher under terms text (plans.tsx:91-92, y≈1590), conditions at y≈1860, save has no bottom button. |
| T-04 | FAIL | Major | Health (13): after Allow, progress waits 900 ms for Juno's reply (health.tsx:16, :41). Other screens enable Continue on answer and JunoReply never gates it. |
| T-06 | PASS | Major | 8 "Add later" (meds.tsx footer), 9 "None booked" (appointment.tsx footer), 13 "Maybe later" (health.tsx footer), 19 "Continue with the free plan" + close (plans.tsx:88, :93), 20 "Not now" (notify.tsx:38). |
| O-01 | PASS | Major | One question title per route; screen 12 has name, sex, age (about.tsx). |
| O-02 | FAIL | Major | Screen 6 shows all 13 conditions before scrolling, none behind search (strings.ts:77-91; shots/conditions.png). Goals 7, symptoms 11, meds 8 pass. |
| O-05 | FAIL | Major | Building (14) runs a looping ActivityIndicator spinner (building.tsx:42); no mascot idle blink exists. Heard (4) has three separate entrances: highlight, staggered chips, reply (heard.tsx:39-41, :106-123, :93-95). |
| O-06 | FAIL | Minor | Plans uses sizes 28, 24, 22, 21, 18, 15, 14, 13 and weights 400/600/700 (plans.tsx:191-205, tokens.ts:51-59). Heard uses 26, 18, 16, 15, 13 (heard.tsx:150-175). |
| O-07 | PASS | Major | One modal at a time: exit sheet (plans.tsx:133), mock alerts (health.tsx connect, notify.tsx:44); no confirmation pop-up before sign-up (save.tsx). Report sheet is dismissed before save is pushed (report.tsx:32-35). |
| O-08 | PASS | Major | Required free text: screen 3 entry only (try.tsx:26); name optional (about.tsx). |

## Not verified
- No VoiceOver/TalkBack run (A-05 judged from code).
- No Reduce Motion run (A-04).
- No haptics-off or one-handed physical run (A-09, G-02 judged from code/screenshots).
- J-09 not checked across several live runs; only code paths.
- No fresh screenshots taken; existing shots may predate the current code.
