# Juno onboarding v0: evals

A set of checks for testing the redesigned onboarding flow once it is built. Use it with `JUNO_ONBOARDING_V0_PLAN.md`. Screen numbers refer to the 21-screen flow in that plan.

Each check has an ID, what to test, how to test it, the pass line, and what the pass line is based on. Be honest when scoring: a check that cannot be run yet is "not tested", not "pass".

## How to read the "Basis" column

| Label | Meaning |
| --- | --- |
| Standard | A published accessibility or platform standard (WCAG 2.2, Apple and Android guidelines) |
| Juno data | Juno's own funnel board (30,435 new users, 30 Oct to 12 Nov 2026); the number shown is today's baseline |
| Research | Something we found in an article, report or founder thread; single-source unless stated |
| House rule | Our own threshold. Reasonable, but untested. Adjust after the first user tests |

## Severity

| Level | Meaning | Rule for v0 |
| --- | --- | --- |
| Blocker | The user cannot finish, is misled, or is excluded | Zero allowed |
| Major | The user can finish but is slowed, confused or loses trust | Three at most, each with a note |
| Minor | Polish | Log and move on |

## One assumption to flag

The 30 to 40+ age focus is our working assumption. We found no public data on the age of Juno's users. Ask Juno, and loosen or tighten section B when you know.

---

## A. User journey

| ID | Check | How to test | Pass | Severity | Basis |
| --- | --- | --- | --- | --- | --- |
| J-01 | Value comes before any account, payment or system permission | Walk screens 1 to 4 | The user logs an entry and sees Juno's reply before any sign-up, price or OS prompt. The consent tick on screen 2 is allowed | Blocker | Juno data: 17.3% leave at Welcome and sign-up; 71% choose the demo when offered |
| J-02 | Time to first value | Time from app open to screen 4 fully shown, 5 testers | Median 60 seconds or less | Major | House rule (the three screens before it total about 40 s on Juno's medians) |
| J-03 | Total time | Time from app open to first chat, 5 testers | Median 5 minutes or less | Major | Juno data: 11.7 minutes today |
| J-04 | The first entry carries through | Type "tired and my head hurts" on screen 3 | Fatigue and Headaches appear on screens 4, 7 (pre-ticked), 15, 16 and 21 | Blocker | Plan section 5; founder thread: people pay after seeing their own data |
| J-05 | Every question earns its place | For each field in the state model, find a later screen that reads it | No stored answer is unused | Major | Research: ask a question only if the answer visibly changes what comes next |
| J-06 | Each ask is explained and comes after value | List the asks in order: consent, health data, account, plan, notifications | Each has a reason on the same screen, and none appears before screen 4 except consent | Major | Juno data: exits cluster on asks (money 8.7% and 6.9%, account 6.2%, notifications 1.7%) |
| J-07 | No dead ends | Go forward and back through every screen; kill the app mid-flow and reopen | Back always works and keeps answers; the app resumes on the same screen | Blocker | House rule |
| J-08 | Skipping is safe | Choose every escape option: "None right now", "Add later", "None booked", "Later", "Prefer not to say" | Screens 15 and 16 still read sensibly, with no blank rows or broken sentences | Blocker | Research: always offer a way out (Noom teardown) |
| J-09 | The result is true | Read screens 15 and 16 after several different runs | Only facts the user gave are shown. No pattern, diagnosis or prediction is claimed | Blocker | Juno's own disclaimer: it does not diagnose or treat |
| J-10 | Reassurance after hard answers | Answer conditions with "Still looking for answers"; answer support with "no one" | A supportive reply appears on the same screen | Major | Research: reassure straight after a vulnerable answer (Noom teardown) |
| J-11 | Progress is always visible | Look at screens 3 to 17 | A progress bar shows on each, has four segments or fewer, and never moves backwards | Minor | Research: progress cues make long sections feel manageable |
| J-12 | No more than three screens in a row without input | Walk the flow | Screens 14, 15, 16 are the only such run | Minor | Juno data: about 13% skip the eight story slides |

**If it ships: funnel targets against today's baseline**

| ID | Metric | Baseline | Target | Basis |
| --- | --- | --- | --- | --- |
| M-01 | Starters who tap the first button | 87.9% | Higher | Juno data |
| M-02 | Starters who tap nothing on Welcome | 11.1% | Lower | Juno data |
| M-03 | Starters who create an account | 80.9% | Watch closely: sign-up is now later, so compare per starter | Juno data |
| M-04 | Starters who reach the plans screen | 68.6% | 80% minimum, 90 to 95% ideal | Research: Adapty's benchmark |
| M-05 | Paywall viewers who choose nothing | 24.6% | Lower | Juno data |
| M-06 | Starters who start a trial or buy | 18.2% | Not lower. Judge on paying users per starter after the trial ends | Juno data |
| M-07 | Median time to finish | 11.7 min | 5 min or less | Juno data |
| M-08 | Slowest single screen | 84 s (symptoms) | 30 s or less | Juno data |

---

## B. Age group 30 to 40+

| ID | Check | How to test | Pass | Severity | Basis |
| --- | --- | --- | --- | --- | --- |
| G-01 | Text is comfortable to read | Inspect every text style | Body and input text 16 pt or larger; nothing below 13 pt | Major | Standard: Apple's default body size is 17 pt; 16 pt also prevents input zoom |
| G-02 | Works one-handed | Use the flow with one thumb on a large phone | The main button sits in the bottom third of every screen | Major | House rule |
| G-03 | No hidden gestures | Walk the flow using taps only | Nothing requires a swipe, long-press or pinch. The debug menu is exempt | Major | House rule |
| G-04 | Plain language | Run all strings through a reading-level check | Grade 8 or lower; no slang; no abbreviation other than condition names | Major | House rule |
| G-05 | Familiar controls | Look at date, sign-in and slider controls | Native date picker and native sign-in buttons; every control has a visible label | Minor | House rule |
| G-06 | Adult tone | Read every screen aloud | No streak pressure, no baby talk, celebration on screens 15 and 21 only | Minor | Research: match motion and tone to mood (animation skill) |
| G-07 | Money is clear to a careful reader | Ask 5 testers after screen 19: "What will you be charged, and when?" | At least 4 of 5 answer correctly without looking again | Blocker | Research: store-sheet thread; Blinkist's honest trial screen |

---

## C. Accessibility

| ID | Check | How to test | Pass | Severity | Basis |
| --- | --- | --- | --- | --- | --- |
| A-01 | Touch targets | Measure every pressable, including chips, back and close | At least 44 x 44 pt on iOS and 48 x 48 dp on Android, using hit slop if the visual is smaller | Blocker | Standard: Apple and Android guidelines; WCAG 2.5.8 sets 24 px as the floor |
| A-02 | Text contrast | Check each text and background pair, especially white text on the sky gradient, placeholder text and the disabled button | 4.5:1 for normal text, 3:1 for large text and control outlines | Blocker | Standard: WCAG 1.4.3 and 1.4.11 |
| A-03 | Large text | Set system text to the largest size and walk the flow | No clipped or overlapping text; every button reachable; cards grow with content | Blocker | Standard: WCAG 1.4.4 |
| A-04 | Reduced motion | Turn on the system setting and walk the flow | No sliding, scaling or springs. Fades and colour changes remain | Blocker | Standard: WCAG 2.3.3; Juno's own symptom list includes dizziness |
| A-05 | Screen reader | Walk the flow with VoiceOver and TalkBack | Every control has a name, role and state; chips announce "selected"; Juno's reply is announced; the mascot is skipped | Blocker | Standard: WCAG 4.1.2 and 1.1.1 |
| A-06 | Not colour alone | View selected and unselected chips and plan cards in greyscale | Selection is still obvious from a tick or border | Major | Standard: WCAG 1.4.1 |
| A-07 | Typing is never required | Complete the flow without the keyboard, except for the name | Possible, using suggestions, chips and voice | Major | Juno data: typing screens are the slowest. Juno's paper: 19% of messages are voice |
| A-08 | Nothing essential disappears | Watch screen 14, which moves on by itself | Everything it shows is repeated on screen 15 | Major | Standard: WCAG 2.2.1 |
| A-09 | Haptics are never the only feedback | Turn haptics off and walk the flow | Every event still has a visible change | Major | Research: animation skill |
| A-10 | Keyboard does not hide the task | Open the keyboard on screens 3 and 12 on a small phone | The field and the main button stay visible | Major | House rule |
| A-11 | Errors are kind and specific | Trigger each error: empty name, failed sign-in, failed purchase | The message says what happened and what to do, and does not clear the input | Major | Standard: WCAG 3.3.1 and 3.3.3 |
| A-12 | Readable at night | Use the flow in a dark room at low brightness, and in dark mode if supported | No glare from white screens; text still meets A-02 | Minor | Juno's paper: 31% of chats happen between 10 PM and 6 AM |
| A-13 | Nothing flashes | Watch every animation | Nothing flashes more than three times a second | Blocker | Standard: WCAG 2.3.1 |
| A-14 | Can stop and come back | Leave mid-flow for an hour and return | The flow resumes where it stopped, with answers kept | Major | House rule: fatigue and brain fog make one sitting unrealistic for some users |

---

## D. Length of copy

Count words in `src/copy/strings.ts`. Legal and price lines are exempt from D-01 to D-04 but covered by D-09.

| ID | Check | Pass | Severity | Basis |
| --- | --- | --- | --- | --- |
| D-01 | Headlines and questions | 12 words or fewer, and 60 characters or fewer | Major | House rule |
| D-02 | Reason lines under a question | One sentence, 12 words or fewer | Major | House rule |
| D-03 | Juno's reply lines | Two sentences at most, 15 words or fewer | Major | House rule; Juno's study found one concrete next step works best |
| D-04 | Words per screen, excluding options | 40 or fewer on question screens; 60 or fewer on screens 15, 16 and 18 | Major | House rule |
| D-05 | Sentence length | No sentence over 20 words | Minor | House rule |
| D-06 | Sensitive questions carry a reason | Conditions, medicines, age and sex, and health data each have a reason line | Major | Research: Noom teardown |
| D-07 | Outcomes, not features | Benefit lines on screens 18 and 19 say what the user gets | Major | Research: single-source claim of up to 54% lift |
| D-08 | Words Juno must not use | No "diagnose", "treat", "cure", "guarantee"; no "we found a pattern" before there is data; no invented numbers or testimonials | Blocker | Juno's own disclaimer |
| D-09 | Price and legal lines are readable | 13 pt or larger, meeting A-02, on screen without scrolling | Blocker | Research: store-sheet thread |
| D-10 | No pressure or shame | No "don't miss out", "last chance", "you should", or countdowns | Major | Research: Noom's non-shaming tone |
| D-11 | One voice | Juno says "I" in replies throughout; the tense and person do not switch | Minor | House rule |
| D-12 | Dates and amounts are real | Charge and reminder dates are computed from today and shown in the device's format | Blocker | Research: founders reported lifts from real dates |

**Known fail in the current copy deck.** `notify.trial` is 14 words, over the D-01 limit. Suggested fix: "Can I remind you before your trial ends?"

---

## E. Calls to action

| ID | Check | How to test | Pass | Severity | Basis |
| --- | --- | --- | --- | --- | --- |
| T-01 | One main button per screen | Look at each screen | Exactly one filled button; anything else is a text link | Major | House rule |
| T-02 | The label says what happens | Read each main button | Starts with a verb, 4 words or fewer. Screens 1, 17, 19 and 20 do not say just "Continue" | Major | Research: Noom frames its buttons around what the user gets next |
| T-03 | Same place every time | Flip through screens quickly | The main button stays in the same position and size | Minor | House rule |
| T-04 | Ready when the user is | Answer a question | The button enables the moment there is a valid answer; Juno's reply never delays it | Major | Research: animation skill, choreography never blocks interaction |
| T-05 | Press feedback | Record a tap at high frame rate | Visible response on touch-down within 100 to 160 ms | Major | Research: animation skill |
| T-06 | A quieter way out exists | Look at screens 8, 9, 13, 19 and 20 | Each has a visible secondary option | Major | Research: Noom teardown; dismissible paywalls called non-negotiable in two threads |
| T-07 | Paywall terms sit with the button | Look at screen 19 without scrolling | The billed amount, period, first charge date and reminder date are visible next to the button | Blocker | Research: store-sheet thread |
| T-08 | Free plan is visible | Look at screen 19 | "Continue with the free plan" is on screen; the close button does the same thing | Blocker | Juno data: 24.6% of paywall viewers choose nothing; screen 56 already promises a free version |
| T-09 | Paywall matches the store sheet | When real purchases are wired, compare screen 19 with the store's payment sheet | Same amount, period and date | Blocker (later) | Research: store-sheet thread |
| T-10 | No trial promise to ineligible users | When real purchases are wired, test with an account that already used a trial | Trial wording is hidden | Major (later) | Research: store-sheet thread |
| T-11 | The first screen has one obvious action | Five-second test on screen 1 with 5 testers | At least 4 of 5 can say what tapping the button will do | Major | Juno data: 11.1% tap nothing |

---

## F. Overwhelming UI

| ID | Check | How to test | Pass | Severity | Basis |
| --- | --- | --- | --- | --- | --- |
| O-01 | One question per screen | Count questions on each screen | One, except screen 12, which has three short inputs | Major | House rule |
| O-02 | Options at first glance | Count chips visible before scrolling on screens 5 to 8 | 12 or fewer; the rest sit behind search | Major | House rule (Juno's symptoms screen shows about 11) |
| O-03 | Five-second test | Show each question screen for 5 seconds | At least 4 of 5 testers can say what it asks | Major | House rule |
| O-04 | The button is reachable without scrolling | Check every screen on a small phone (360 x 640 and 375 x 667) at default text size | The main button is on screen | Major | House rule |
| O-05 | Calm motion | Watch each screen arrive | One entrance per screen; nothing loops except the mascot's idle blink | Major | Research: animation skill |
| O-06 | Restrained type | Count text styles on each screen | Three sizes and two weights at most | Minor | House rule |
| O-07 | No interrupting pop-ups | Walk the flow | One sheet at a time; no confirmation pop-up before sign-up | Major | Research: a founder reported that removing a confirmation pop-up reduced hesitation |
| O-08 | Little typing | Count required free-text fields in the whole flow | Two at most: today's entry and the name | Major | Juno data: the three slowest screens are search-and-type |
| O-09 | No slow screens | Median time per screen across 5 testers | 30 seconds or less on every screen | Major | Juno data: symptoms 84 s, medicines 41 s, conditions 33 s today |
| O-10 | One permission at a time | Count system prompts | At most one per screen, each after an in-app explanation | Major | Juno data: notification and health-data asks lose more than average |
| O-11 | Effort rating | After the flow, ask: "How easy was that?" on a 1 to 7 scale | Median 6 or higher | Major | House rule |

---

## Test personas

These are invented for testing. Run the manual checks once as each.

| Persona | Setup | What to watch |
| --- | --- | --- |
| Flare day | Age 38, has POTS, exhausted, phone in one hand, lying down | G-02, A-07, O-08, O-09, total time |
| Still searching | Age 32, no diagnosis, has seen several doctors | J-08, J-09, J-10, the tone of the conditions reply |
| Careful sceptic | Age 45, Android, has been burned by subscription apps | G-07, T-07, T-08, D-09, D-10 |
| Large text, low motion | Age 41, largest system text, reduced motion on, screen reader for part of the run | A-03, A-04, A-05, O-04 |
| Late night | Any age, 1 a.m., dark room, low brightness | A-12, A-14, D-01 to D-04 |

---

## How to run it

**1. Automated checks (Claude Code can write these)**

| What | Covers |
| --- | --- |
| A unit test over `strings.ts`: word counts, sentence length, banned words, button labels | D-01, D-02, D-03, D-05, D-08, D-10, T-02 |
| A script over `tokens.ts` that computes contrast for each text and background pair | A-02 |
| Component tests asserting minimum pressable size | A-01 |
| An end-to-end run (Maestro or Detox) that types the test entry and checks later screens | J-04, J-07, J-08 |
| A static check that every state field is read somewhere | J-05 |
| Screen-view timestamps from `track()` summed into time per screen | J-02, J-03, O-09 |

**2. Manual walkthrough.** One person, each persona, about 20 minutes each. Covers most of sections B, C, E and F.

**3. Five-person test.** Five people from the target group, thinking aloud, screen recorded. Covers J-02, J-03, G-07, T-11, O-03, O-09, O-11. Five people find most usability problems, but the numbers are directional, not statistics.

## Scorecard

| Section | Checks | Pass | Fail | Not tested | Blockers open |
| --- | --- | --- | --- | --- | --- |
| A. Journey | 12 | | | | |
| B. Age 30 to 40+ | 7 | | | | |
| C. Accessibility | 14 | | | | |
| D. Copy length | 12 | | | | |
| E. Calls to action | 11 | | | | |
| F. Overwhelm | 11 | | | | |

v0 is ready to record when there are no open blockers and three or fewer majors, each with a note.
