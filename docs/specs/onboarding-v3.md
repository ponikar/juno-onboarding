# Spec: Juno onboarding v3 (narration, commitment, progress, alive)
Status: final (auto)        Owner: Darshan        Created: 2026-11-14

Builds on `narration-v2.md`. Where they disagree, this spec wins. Copy marked NEW is drafted here; facts come only from the sources in section 9.

## 1. Problem
Testing v2 on the phone: the flow still reads like a survey. The story names the founders but never says the problem. The commitment is one crowded screen, there is no demo of what the user will do each day, and notifications are asked after the price. Progress is a 13 pt label over a 3 pt line. Buttons give no haptic on touch, and motion is too faint to notice, so the app does not feel alive.

## 2. Users and flows
- A new user hears the problem and why Juno exists, logs today, answers questions in short parts, sees what Juno already knows, commits to a daily check-in, rehearses tomorrow's check-in, allows reminders for that habit, sees the doctor page and its forecast, then saves, sees plans and lands in the first chat knowing what to do tomorrow.

## 3. Requirements

### Narration
- R-01 WHEN the user taps "Try it now", THE SYSTEM SHALL show the story as 3 beats on one route, one beat at a time, advanced by a primary button, with a 3-dot pager:
  - Beat 1, the problem: title `story.b1.title`, line `story.b1.body`, source `story.b1.source`.
  - Beat 2, the founders: title `story.b2.title`, lines `story.b2.isaac`, `story.b2.marshall`.
  - Beat 3, the fix: title `story.b3.title`, line `story.b3.body`, and the button `story.cta` (goes to consent).
- R-02 Back on beat 2 or 3 SHALL return to the previous beat; back on beat 1 leaves the story.

### Commitment (replaces the single promise screen)
- R-03 Screen "Commit" SHALL ask `commit.q` with `commit.sub` and the three options from v2 (most days, good days, not sure). Nothing else is on this screen except Juno's reply. Picking an option shows the reply; the button reads `commit.cta` for most or good, `card.cta` for unsure.
- R-04 Screen "When" (shown only for most or good) SHALL ask `when.q` with three full-width option rows: Morning, Afternoon, Evening, each with its hint line (`when.morningHint` etc.). The button stays disabled until a time is picked.
- R-05 Screen "Demo" SHALL rehearse tomorrow's check-in in 3 automatic steps (about 5 s total, each step tappable to skip ahead):
  1. A reminder card slides down like a lock-screen notification: title "Juno", body `demo.notification` with the chosen time (or "tomorrow" for unsure).
  2. The card opens into a mini chat: Juno asks `demo.ask`; three one-tap replies (`demo.reply1..3`) appear; the first is auto-tapped after a pause (the user may tap any).
  3. Juno answers `demo.logged`; the week dots fill day 2 of 7; caption `demo.caption`.
  Button `demo.cta`.
- R-06 Screen "Reminders" (notification permission) SHALL come right after the demo, with the bell art, question `notify.withTime` (or `notify.free` when no time) and the line `notify.why`. "Turn on reminders" opens the mocked system prompt; "Not now" continues. The old screen 24 (after plans) is removed.

### Progress
- R-07 The flow bar SHALL show the part name and "Part {n} of 7" (`flow.part`) at 15 pt semibold, above a 6 pt bar that fills from the previous screen's value. Parts: Today, Your health, Your days, You, Your routine, Your snapshot, Your plan.
- R-08 The insight cards (health, days) and the Demo screen SHALL show a "Your doctor page" meter: a card with the page title `meter.title`, a row of filled/empty section ticks (Today, Health, Days, Routine) and the forecast line `meter.forecast` ("Up to {entries} entries by {date}" or "7 entries by next {weekday}" with no appointment). Ticks that became filled since the last meter animate in.

### Alive
- R-09 Every pressable SHALL give a light haptic on press-in (once per press), except chips and option rows, which keep their selection haptic on pick. Disabled buttons give none.
- R-10 Picking a chip or option SHALL pop it (scale 0.96 to 1 with a soft spring) in addition to the colour change; reduced motion keeps the colour change only.
- R-11 Before each JunoReply appears, THE SYSTEM SHALL show Juno's typing dots for 450 ms, then fade the reply in. Continue is never blocked.
- R-12 The mascot on story, commit, demo and insight screens SHALL breathe (scale 1 to 1.015, 3.2 s loop, ease in-out); reduced motion shows it still.
- R-13 Screen entrances follow the choreograph rules: the title is the lead (fades in and rises 12 pt over 320 ms), the rest fades in together 60 ms later; nothing else staggers except list rows on insight cards and the story beats.
- R-14 Primary buttons that become enabled SHALL animate their colour over 200 ms and give no haptic.

### Layout
- R-15 Insight cards SHALL sit on the sky: mascot (110 pt) top, stat card below with the stat at 34 pt, then the kind line in white, then the meter, then the next line, then the button.
- R-16 No screen asks two questions. The When screen is the only place time is picked.

### Process
- R-17 A project skill `.claude/skills/juno-onboarding/SKILL.md` SHALL capture the rules above (narration arc, commitment chain, progress, alive levers, checks) for future builds.

## 4. Edge cases
| Case | Expected behaviour | Covers |
|---|---|---|
| "Not sure yet" | When is skipped; demo says "tomorrow"; reminders asks `notify.free` | R-04..R-06 |
| Notifications denied | Continue to building; chat still shows the week dots | R-06 |
| No appointment | Meter forecast uses 7 days | R-08 |
| Appointment today or tomorrow | Meter forecast reads `meter.soon` | R-08 |
| Back from Demo | Returns to When (or Commit for unsure), choices kept | R-05 |
| Resume on Demo | Demo restarts from step 1 | R-05 |
| Tap during demo step | Jumps to the next step; no double reply | R-05 |
| Reduce Motion on | Opacity only, no breathing, no pop, no slide | R-10..R-13 |
| Largest font | Text wraps; demo card grows | all |
| Haptics unavailable | No-op, no error | R-09 |
| Double tap on a primary button | One navigation (existing guard), one haptic | R-09 |

## 5. Out of scope
Real notifications, real voice input, real sign-in or purchase, analytics backend, new illustrations.

## 6. Constraints
No new dependencies. Reuse tokens, components, mascot art (`mascotPeekSky` on sky screens), motion tokens. Copy in `src/copy/strings.ts`; facts in `src/copy/facts.ts`. No em dashes. Never claim patterns, improvement or cures. 25 words or fewer per line.

## 7. Boundaries for the agents
- Always: `bunx tsc --noEmit`, `bunx expo lint`, the unit evals, screenshots of every screen you touch.
- Ask first: new dependency, state shape beyond `commitment`, `checkInTime`.
- Never: invent a number or quote; touch src/conditions/*.

## 8. Done means
- R-01, R-02, R-03..R-06, R-16 -> ui -> Maestro end-to-end flow walks every new screen and asserts the copy.
- R-07, R-08 -> unit (part numbers, meter ticks and forecast for none / today / 3 / 12 days) + screenshots.
- R-09..R-14 -> code check (every pressable path calls the haptic; reduced-motion branches) + screen recording frames on the simulator.
- R-15 -> screenshots of both cards.
- R-17 -> file exists and lists every rule.
- Layout-shift eval passes on all scenarios, including the new screens.

## 9. Copy (NEW unless stated)
| Key | Text |
|---|---|
| story.b1.title | Months to get an appointment. Then 15 minutes. |
| story.b1.body | That is all the time you get to explain years of symptoms. |
| story.b1.source | From Juno's founders, YC launch |
| story.b2.title | We know because we lived it. |
| story.b2.isaac | Isaac waited 14 years for an eosinophilic bronchitis diagnosis. |
| story.b2.marshall | Marshall lives with ME/CFS and is still searching for something that helps. |
| story.b3.title | So we built Juno to keep the record. |
| story.b3.body | Tell Juno how you feel, by text or voice. It turns your days into a summary your doctor can understand quickly. |
| story.next | Next |
| story.cta | Show me how |
| commit.q | Can you tell me one line a day? (v2) |
| commit.sub | Like the one you wrote earlier. (v2) |
| when.q | When should I check in? |
| when.sub | One short message you can answer in a tap. |
| when.morningHint | Before the day gets going |
| when.afternoonHint | A quick pause midday |
| when.eveningHint | Looking back on the day |
| when.cta | Show me |
| demo.title | Here's tomorrow's check-in |
| demo.notification | How are you today? Tap to tell me in a few words. |
| demo.ask | Morning. How are you feeling today? (the greeting follows the chosen time: Morning / Afternoon / Evening / Hi) |
| demo.reply1 | Better than yesterday |
| demo.reply2 | About the same |
| demo.reply3 | Rough day |
| demo.logged | Logged. That's day 2 on your doctor page. |
| demo.caption | That's it. One line a day. |
| demo.cta | Got it |
| notify.why | So I can check in at the time you picked, and you can change it any time. |
| flow.part | Part {n} of 7 |
| seg.routine | Your routine |
| meter.title | Your doctor page |
| meter.today | Today |
| meter.health | Health |
| meter.days | Days |
| meter.routine | Routine |
| meter.forecast | Up to {entries} entries by {date} |
| meter.week | 7 entries by {date} |
| meter.soon | Today's entry is already on it |

Sources: Juno YC launch page (https://www.ycombinator.com/launches/QT7-juno-ai-health-assistant-for-chronic-illness), quoted: "Patients spend months waiting for appointments, then get 15 minutes to explain years worth of symptoms"; "Isaac waited 14 years for an eosinophilic bronchitis diagnosis."; "Marshall lives with ME/CFS and is still searching for something that helps."; "symptoms logged automatically through natural conversation, by text or voice"; "Appointment-ready PDFs - turn months of data into a summary your doctor can instantly understand". The page says nothing about a daily check-in: the daily habit is this onboarding's design, not a claim about Juno.

## 10. Flow (28 routes)
1 welcome, 2 story (3 beats), 3 consent, 4 try, 5 heard, 6 goals, 7 conditions, 8 symptoms, 9 meds, 10 insight-health, 11 appointment, 12 energy, 13 support, 14 insight-days, 15 about, 16 health, 17 commit, 18 when, 19 demo, 20 reminders, 21 building, 22 snapshot, 23 report, 24 save, 25 how, 26 plans, 27 done + chat.
Parts: Today 4-5, Your health 6-10, Your days 11-14, You 15-16, Your routine 17-20, Your snapshot 21-24, Your plan 25-26. Bar fill = (n - 3) / 23.

## Decisions log (auto)
- Notifications move from after the price to right after the demo (the user's ask: commitment, then demo, then permission). `notify.trialLine` is dropped there because the trial is not chosen yet; the plans terms already state the reminder date.
- "Part N of 7" replaces v2's "no Step X of Y" rule because the user asked for visible progress.
- The story stays on one route with 3 beats so the welcome-to-consent path keeps one back target.
- Build runs past the 2-hour cap; the user replied --auto to that question.
- Reduce Motion on the user's phone is unknown; every new animation has a reduced-motion branch.

### Spec check round 1 (resolved, auto)
1. Unsourced copy removed: b3 title "So we built Juno to keep the record.", b3 body "...a summary your doctor can understand quickly." (source: "instantly understand"), demo caption "That's it. One line a day."
2. The notification card shows the time in its timestamp line ("Tomorrow evening"); `meter.week` uses {date}.
3. Meter ticks: Today = after screen 5; Health = screen 10 reached; Days = screen 14 reached; Routine = any commitment answer. The health card shows the no-appointment forecast because the appointment comes later.
4. Meter forecast reuses `projectionTimeline` rules: day 0 = `meter.soon`; past date = none; otherwise entries = N + 1.
5. Sponsor claim goes to /done. Back from Building goes to /notify. "Not sure yet" skips /when in both directions (explicit push and back fallback). Route names stay /promise and /notify.
6. Press-in haptic (light) on PrimaryButton, TextLink and NavButton only, behind the same 700 ms guard. Chips, option rows, calendar days, plan cards and other pressables that already fire a selection haptic get no press-in haptic.
7. Insight cards keep the known-so-far list (v2 check 6). R-13 exempts: list rows, story beats, demo steps, meter ticks, the report timeline.
8. Flow bar: one row, part name left, "Part n of 7" right, bar below; done state with tick kept on 10 and 14; FLOW_BAR_ROW recomputed.
9. Typing dots replace the reply's 200 ms delay (reduced motion: no dots, plain fade). Health auto-advance waits the extra 450 ms. In the demo, a reply tap picks that reply; `demo.cta` is always enabled. The demo is a rehearsal of tomorrow, so chat keeps "Day 1 of 7". Story and demo have swipe-back off; the story's back button steps back a beat, the demo's back returns to When (or Commit for unsure), as section 4 says.
10. Update full_flow.yaml, shift_scenarios.json and screens.json for the new order; create the skill file.

### Copy check (after build, auto)
- Health data bullet 2 claimed pattern finding ("find what's really driving your flares"): now "Juno keeps them next to your symptoms, so your doctor page shows both".
- Plans headline for "Manage flare days" claimed prediction ("See your flare days coming"): now "Keep track of your flare days".
- Reminders shows `notify.why` only when a time was picked.
- `notify.why` and `when.sub` rewritten as one sentence each (eval D-02).
- Open for Juno: welcome "#1 App for chronic illness" and "300K Happy users" (Juno's YC page says "Over 80,000 people already use Juno"); plans "Full refund, no questions asked"; how "The kind of read a health coach gives, at a fraction of the cost". All come from Juno's Figma; none has a source here.
