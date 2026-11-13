# Juno onboarding v0: build plan for Claude Code

This file is the brief for building a working prototype of a redesigned onboarding flow for Juno, an AI health assistant for people with chronic illness. It is a trial task for a founding-engineer role. The reviewers will judge the thinking, the UX and the micro-interactions more than polish, and they asked for a GitHub repository plus a video walkthrough.

Read sections 1 to 3 before writing any code. They explain what we are changing and why, so you can make sensible calls where this file is silent.

---

## 1. What we are building, and why

Juno's current onboarding is about 65 screens and takes a median of 11.7 minutes. Their own funnel data (30,435 new users, 30 Oct to 12 Nov 2026) shows where people leave:

| Where | Share of starters lost | Detail |
| --- | --- | --- |
| Welcome screen and sign-up | 17.3% | 11.1% tap nothing; 6.2% tap "Get started" and never finish an account |
| The 54 screens in the middle | 9.2% in total | No single screen loses more than 0.9% |
| The paywall stretch | 23.7% | About 1 in 3 people who arrive there |

People leave when the app asks for something (an account, money, a permission) and stay when it gives something. 71% choose to try the logging demo when offered, while about 13% skip the story slides.

So v0 makes three moves:

1. **Value before account.** The user logs how they feel and sees Juno respond on screens 3 and 4. Sign-up moves to screen 17 and is framed as saving what they built.
2. **A real result before the price.** The generic "Your plan is ready" screen becomes a snapshot made from the user's own answers, followed by a preview of their doctor report.
3. **An honest ask.** The plans screen states the billed amount and charge date plainly, and the free plan is a visible choice.

The result is 21 screens in four acts: Try, Tell, See, Choose.

**What success looks like for v0:** someone can run the app on a phone and go from the welcome screen to the first chat in about 5 minutes, with every screen looking like Juno's existing design and the sentence they typed on screen 3 visibly carried through screens 4, 7, 15 and 16.

---

## 2. Ground rules

These matter more than any individual screen spec.

- **Keep Juno's visual design as it is.** Do not restyle. Each screen in section 6 names the existing Figma screen it is built from; match that screen's layout, colours, type, spacing, mascot and components. We are changing order, content and copy, not the look.
- **Pull real assets from Figma first** (Phase 0). Do not substitute placeholder illustrations, icons or fonts when the real ones are available. If an asset cannot be exported, say so in your report and use the closest neutral stand-in.
- **Do not invent claims.** No made-up statistics, testimonials or medical statements. Juno does not diagnose or treat; the copy uses "log", "notice" and "prepare".
- **No dark patterns.** No fake loading timers, countdown urgency, or hidden routes. The "building" screen shows real items and lasts about 4 seconds.
- **Mock what is out of scope**, and label it in code and in the README: the AI reply on screen 4, authentication, the purchase, the health-data permission and notifications.
- **Accessibility is part of v0.** Touch targets at least 44 pt, font scaling left on, reduced motion honoured.
- **Motion needs a purpose.** Follow section 8. If you cannot name the purpose of an animation in one word (feedback, state, spatial, explanation, delight), leave it out.
- **When the Figma file and this plan disagree about how something looks, Figma wins.** When they disagree about order or copy, this plan wins.

---

## 3. Inputs

### Figma

- File key: `upqz9qm8iyQjNys8tIQt3y` (a duplicate of Juno's board; the Figma MCP server needs edit access, which this copy has).
- The board is one page with a section named "Juno onboarding today — where people leave". Each current screen is a card frame named like `36 · try-logging — How do you feel today?`. Inside each card, the child frame named `screen / <slug>` is the actual phone screen (402 x 874). The other children are labels and funnel numbers; ignore them.

Card node IDs for every screen this build uses:

| Current screen | Card node ID | Used for proposed screen |
| --- | --- | --- |
| 01 splash | `1:330` | 1 |
| 01b auth (sign-up sheet) | `1:354` | 17 |
| 09 story-report | `1:516` | 16 |
| 12 consent | `1:594` | 2 |
| 14 goals | `1:639` | 5 |
| 15 goal-recognition | `1:660` | 5 (reply wording) |
| 17 conditions | `1:705` | 6 |
| 19 meds | `1:750` | 8 |
| 20 symptoms | `1:771` | 7 |
| 21 name | `1:792` | 12 |
| 28 appointment | `1:954` | 9 |
| 29 reply-care-team | `1:975` | 16 |
| 31 sex | `1:1020` | 12 |
| 33 age | `1:1062` | 12 |
| 35 tracking-demo | `1:1117` | 4 |
| 36 try-logging | `1:1138` | 3 |
| 37 energy-slider | `1:1162` | 10 |
| 42 wearables | `1:1270` | 13 |
| 43 health-connect | `1:1291` | 13 |
| 45 support-circle | `1:1349` | 11 |
| 46 reply-support | `1:1370` | 11 |
| 54 analyzing | `1:1547` | 14 |
| 55 journey-ready | `1:1569` | 15 |
| 56 honesty | `1:1603` | 18 |
| 60 pw-trial | `1:1725` | 18 |
| 61 bell | `1:1751` | 20 |
| 62 pw-price | `1:1777` | 19 |
| 62b sponsor-sheet | `1:1804` | 19 (linked sheet) |
| 63 bell-after-plans | `1:1838` | 20 |
| 64 subscribe-success | `1:1865` | 21 |
| 65 how-to-use-juno | `1:1886` | 21 |
| first-chat | `1:1922` | 21 (destination) |

Selected and filled states of some screens are in the section "More states of the same screens": email sign-up sheet `1:1935`, goals selected `1:1955`, conditions selected `1:1965`, medicines selected `1:1975`, symptoms selected `1:1985`, name typed `1:1995`, system notification prompt `1:2015`, free-plan welcome `1:2025`.

### Stack (assumption: confirm with Darshan if unsure)

React Native with Expo and TypeScript, Expo Router, `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`. Install with `npx expo install` so versions match the SDK. If the repository already uses a different stack, keep that stack and adapt the motion section.

### Animation guidance

Install Emil Kowalski's skills and use `animate-expo` when writing motion:

```bash
npx skills@latest add emilkowalski/skills
```

---

## 4. Phases

Work through the phases in order. Commit at the end of each one, and stop to report if a phase's checks fail.

### Phase 0: Assets and reference

1. For every card in the table above, export the `screen / <slug>` frame as a PNG to `docs/reference/<current-number>-<slug>.png`. These are the visual targets.
2. Export the reusable assets to `assets/`: the mascot in each pose used, the cloud and sky background, icons, the key illustration on the plans screen, laurels, and any logos.
3. Read the design values from Figma (variables if present, otherwise from the frames) and write `src/theme/tokens.ts`: colours, the sky gradient stops, font families and sizes, spacing, radii, shadows.
4. Identify the fonts and load them with `expo-font`.
5. Write `docs/ASSETS.md` listing what was exported, what could not be, and what stands in for it.

Checks: every reference PNG exists; `tokens.ts` has no guessed values without a comment saying so.

### Phase 1: Shell and shared components

Build these once; every screen uses them.

| Component | Built from | Notes |
| --- | --- | --- |
| `ScreenShell` | Any screen | Sky-gradient or plain background variant, safe areas, back button, optional close button |
| `ProgressBar` | The segmented bar with dots on question screens | Four segments, one per act; fill animates |
| `PrimaryButton` | "Continue" and "Get started" | Enabled and disabled states; press scale |
| `Chip` | Symptom and goal chips | Single and multi select; pre-ticked state |
| `SearchField`, `TextField` | Symptoms search, "Type how you feel" | 16 pt minimum text |
| `Mascot` | The red-haired character | Poses as exported; optional idle blink |
| `JunoReply` | New | One line of text beside or under the mascot; fades in |
| `Card` | Cards on the snapshot and plans screens | |

Also set up:

- `src/state/onboarding.ts`: one store (Zustand or React context) with the model in section 7.
- `src/copy/strings.ts`: every user-facing string from section 9. No literals in screens.
- `src/motion/tokens.ts`: the values in section 8.
- Navigation: an Expo Router stack with the platform's default push transition.

Checks: a scratch screen shows every component in each state and matches the reference PNGs side by side.

### Phase 2: Act 1, Try (screens 1 to 4)

Reviewers see this first. Finish it completely, including motion, before moving on.

### Phase 3: Act 2, Tell (screens 5 to 13)

### Phase 4: Act 3, See (screens 14 to 17)

### Phase 5: Act 4, Choose (screens 18 to 21)

### Phase 6: Motion and accessibility pass

Apply section 8 to anything not yet animated. Then switch on the system's reduced-motion setting and walk the whole flow; then set the largest system font size and walk it again.

### Phase 7: README and walkthrough support

Write the README (section 11) and add a debug menu on the welcome screen (long-press the logo) that jumps to any screen, so the video can be recorded cleanly.

---

## 5. How answers carry through

This is the heart of the prototype. One thing the user says should visibly travel through the flow.

- Screen 3 captures a free-text entry (typed, dictated or picked from a suggestion).
- Screen 4 extracts symptoms from it and shows them as a log card.
- Screen 7 arrives with those symptoms already ticked.
- Screen 15 lists them under "Today".
- Screen 16 shows them as the first entry in the doctor report.
- Screen 21 lands in the first chat with that entry already logged.

For v0 the extraction on screen 4 is a local keyword match, not a model call. Put it in `src/mocks/extractSymptoms.ts`:

| Words in the entry | Symptom chip |
| --- | --- |
| tired, exhausted, fatigue, drained, wiped | Fatigue |
| head, headache, migraine | Headaches |
| dizzy, lightheaded | Dizziness |
| sick, nausea, nauseous | Nausea |
| fog, foggy, can't think | Brain fog |
| heart racing, palpitations | Palpitations |
| breath, breathless | Breathlessness |
| faint, fainted | Fainting |

If nothing matches, show the entry as written with the reply "Thanks for telling me. I've saved that for today." Use the chip names exactly as they appear on Figma screen 20.

---

## 6. Screen specs

For each screen: what it is built from, what stays, what changes, and how you know it is done. Copy keys refer to section 9.

### Act 1: Try

**1. Welcome** (from 01 splash, `1:330`)
- Keep: layout, sky and clouds, mascot peeking over the cloud, the two proof items with laurels, "I have an account", terms line.
- Change: headline and sub-line (`welcome.*`); primary button reads `welcome.cta` and goes to screen 2, not to a sign-up sheet.
- Why: 11.1% of starters tap nothing here. The current headline names the product; the new one names the user's problem.
- Done when: it matches the reference apart from the text, and no sign-up appears.

**2. Privacy promise and consent** (from 12 consent, `1:594`)
- Keep: layout and the tick box.
- Change: headline and body (`consent.*`), adding the "never sold, no ads" lines that currently sit on screen 56.
- Why: health data is collected on the next screen, so consent must come first. It also builds trust before the first ask.
- Done when: Continue is disabled until the box is ticked.

**3. How do you feel today?** (from 36 try-logging, `1:1138`)
- Keep: the question, the text field, the suggestion chip.
- Change: add two more suggestion chips (`try.suggestions`) and a microphone button that starts dictation if available. No account is needed.
- Done when: typing or tapping a suggestion enables Continue, and the entry is saved to state.

**4. Juno heard you** (from 35 tracking-demo, `1:1117`; new content)
- Show the user's sentence, then a log card for today containing the extracted symptom chips, then one reply line from Juno (`heard.reply` with the symptoms filled in).
- This is the signature moment. See section 8 for its motion.
- Done when: the chips shown match the entry, and an entry with no matches still produces a sensible card and reply.

### Act 2: Tell

Every question screen has the same structure: the question, an optional reason line beneath it, the input, and a `JunoReply` that fades in after an answer is chosen. Continue is usable as soon as there is an answer; the reply never blocks it.

| # | Built from | Question key | Reason key | Reply key | Input | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 5 | 14 goals `1:639` | `goals.q` | none | `goals.reply` | Multi-select chips | Store the first goal picked; it personalises screens 15 and 19 |
| 6 | 17 conditions `1:705` | `conditions.q` | `conditions.why` | `conditions.reply` or `conditions.replyNone` | Search plus multi-select | Add the option "Still looking for answers"; it replaces the old screen 18 |
| 7 | 20 symptoms `1:771` | `symptoms.q` | `symptoms.why` | `symptoms.reply` | Search plus multi-select | Pre-tick what screen 4 extracted; keep "None right now" |
| 8 | 19 meds `1:750` | `meds.q` | `meds.why` | `meds.reply` | Search plus multi-select | Add "Add later" |
| 9 | 28 appointment `1:954` | `appt.q` | `appt.why` | `appt.reply` or `appt.replyNone` | Date picker | Add "None booked"; compute days from today |
| 10 | 37 energy-slider `1:1162` | `energy.q` | `energy.why` | `energy.reply` | Slider | |
| 11 | 45 support-circle `1:1349` and 46 `1:1370` | `support.q` | none | `support.reply` | Single select | The reply is the existing "You're not alone in this" line, shown on the same screen |
| 12 | 21 name `1:792`, 31 sex `1:1020`, 33 age `1:1062` | `about.q` | `about.why` | `about.reply` | Three short inputs on one screen | Sex at birth offers "Prefer not to say" |
| 13 | 42 wearables `1:1270`, 43 health-connect `1:1291` | `health.q` | `health.why` | `health.reply` | Connect and Later buttons | Mock the permission; store the choice |

Use the condition, symptom and medicine lists exactly as they appear in the Figma frames. Do not add medical items of your own.

### Act 3: See

**14. Building your snapshot** (from 54 analyzing, `1:1547`)
- About 4 seconds. The user's real answers appear one after another (name, conditions, today's symptoms, medicines, appointment). It then moves on by itself.
- Why: the current flow has three pauses that show nothing. This keeps one and makes it show real work.

**15. Your snapshot** (from 55 journey-ready, `1:1569`; new content)
- Keep: the screen's layout and the four-row card style.
- Change: headline `snapshot.title` with their name. The rows become: their conditions; today's symptoms from screen 3; medicines (or "None added yet"); energy baseline; and one line of what Juno will watch this week (`snapshot.watch`, built from their first goal and a logged symptom).
- Do not claim Juno has found any pattern. It has one day of data.
- Done when: every row reflects what was entered, and skipped answers show a sensible empty state.

**16. Your doctor report, in preview** (from 09 story-report `1:516` and 29 reply-care-team `1:975`; new content)
- A sheet showing a sample one-page summary: their name, conditions, medicines, and a "Recent days" list whose first row is today's entry. If an appointment date was given, show "Ready for your appointment in N days".
- Label it clearly as a preview.

**17. Save your snapshot** (from 01b auth, `1:354`; email sheet state `1:1935`)
- Keep: the Apple, Google and email options.
- Change: title `save.title` and sub-line `save.sub`.
- Mock: any option succeeds after a short delay and marks the user as signed in.
- Why: 6.2% of starters abandon sign-up when it comes first. Here they have something to save.

### Act 4: Choose

**18. How Juno works, and your free week** (from 56 honesty `1:1603` and 60 pw-trial `1:1725`)
- Keep: the honesty screen's layout and its four rows.
- Change: add the trial timeline beneath with three points and real dates computed from today: today (free), day 5 (reminder), day 7 (first charge).

**19. Plans** (from 62 pw-price `1:1777`)
- Keep: layout, key illustration, the two plan cards, "Full refund, no questions asked", restore and terms links.
- Change:
  - Yearly card leads with `$99.99 a year`; `$8.33 a month` becomes the smaller line.
  - The line above the button is `plans.terms` with real dates.
  - The button reads `plans.cta`.
  - Add a text link under the button, `plans.free`, that continues on the free plan.
  - Add a second quiet link, `plans.cost`, that opens the sponsored-plan sheet (from `1:1804`).
  - Headline uses the user's first goal where a mapping exists (`plans.headline.*`), otherwise the default.
  - The close button behaves the same as `plans.free`.
- Prices in v0 are fixed strings taken from the Figma screen: yearly $99.99 with a 7-day free trial, monthly $14.99 with no trial.
- Mock: the purchase succeeds after a short delay.
- If the user leaves without choosing (system back), show a one-question sheet, `plans.exitQ`, with three options. Store the answer.
- Why: the current card leads with $8.33 a month while the store will charge $99.99, and the free plan is reachable only through the close button.

**20. Stay in touch** (from 61 bell `1:1751` and 63 bell-after-plans `1:1838`)
- One notification ask, after the plan choice. Trial users see `notify.trial`; free users see `notify.free`.
- Mock the system prompt (reference `1:2015`).

**21. Welcome, and into your first chat** (from 64 subscribe-success `1:1865`, free variant `1:2025`, and first-chat `1:1922`)
- A short welcome with the mascot, then the chat screen with today's entry already shown as logged and one opening line from Juno (`chat.open`).
- The chat itself is static in v0.

---

## 7. State model

```ts
type Plan = 'trial_yearly' | 'monthly' | 'free' | 'sponsored';

interface OnboardingState {
  consentGiven: boolean;
  todayEntry: string;            // screen 3, as typed
  todaySymptoms: string[];       // extracted on screen 4
  goals: string[];               // screen 5; goals[0] drives personalised copy
  conditions: string[];          // screen 6
  seekingDiagnosis: boolean;     // "Still looking for answers"
  symptoms: string[];            // screen 7, starts as todaySymptoms
  medicines: string[];           // screen 8
  medicinesSkipped: boolean;
  nextAppointment: string | null; // ISO date, or null for "None booked"
  energy: number;                // screen 10
  support: 'none' | 'few' | 'several' | null;
  name: string;
  age: number | null;
  sexAtBirth: 'female' | 'male' | 'intersex' | 'undisclosed' | null;
  healthDataConnected: boolean;
  signedIn: boolean;
  plan: Plan | null;
  paywallExitReason: 'price' | 'unsure' | 'try_first' | null;
  notificationsAllowed: boolean | null;
}
```

Persist it with AsyncStorage so closing the app mid-flow resumes at the same screen. Take the actual option values for `support` and `energy` from the Figma screens.

---

## 8. Motion spec

Put these in `src/motion/tokens.ts` and use them everywhere.

```ts
import { Easing } from 'react-native-reanimated';

export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);     // entering, leaving
export const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1); // moving on screen
export const PRESS_SCALE = 0.97;
export const PRESS_MS = 120;
export const STATE_MS = 150;     // chip select, plan select
export const ENTER_MS = 300;     // cards, replies
export const ENTER_FROM_SCALE = 0.95;
export const STAGGER_MS = [0, 50, 90, 120]; // shrinking gaps
export const SPRING_SETTLE = { duration: 400, dampingRatio: 1 };
```

Rules for every screen:

- Press feedback on every pressable: scale to 0.97 in 120 ms on press-in.
- Anything entering or leaving uses `EASE_OUT`. Never ease-in.
- Under 300 ms, except the two delight moments (welcome entrance, snapshot reveal).
- Entrances start from opacity 0 and scale 0.95, never from scale 0.
- One entrance per screen. Do not animate a container and then stagger its children.
- Animate `transform` and `opacity` only. The progress bar fill is the one exception.
- Screen transitions are the native stack default. Do not hand-roll them.
- Haptics: one per real event, fired with the visual, never as the only feedback.

| Screen | Moment | Purpose | Motion | Haptic |
| --- | --- | --- | --- | --- |
| 1 | First open | Delight | Headline fades up 12 px over 500 ms; mascot rises from the cloud with `SPRING_SETTLE`; proof items fade in at 80 and 140 ms | None |
| 3 | Suggestions appear | Feedback | Chips fade in with a 40 ms stagger | Selection on tap |
| 4 | Words become a log | Explanation | Matched words in the sentence highlight; chips move into the log card, 300 ms each with 60 ms overlap; reply fades in after the card settles | Light impact when the card settles |
| 5 to 8 | Selecting a chip | State | Border and fill change over 150 ms; tick scales from 0.9 | Selection |
| 7 | Pre-ticked chips | Explanation | Fade from 60% to full opacity once | None |
| 5 to 13 | Juno's reply | Feedback | Fade in over 200 ms, no movement, about 200 ms after the answer | None |
| 10 | Slider | Feedback | Thumb tracks the finger exactly; settles with a spring on release | Selection at each step |
| All | Progress bar | State | Fill grows over 250 ms with `EASE_IN_OUT` | None |
| 14 | Building | Explanation | Real items appear one by one over about 4 s | None |
| 15 | Snapshot appears | Delight | Card scales from 0.95 with opacity over 300 ms; rows follow `STAGGER_MS` | Success, once |
| 16 | Report preview | Spatial | Native sheet presentation | Light impact at rest |
| 18 | Trial timeline | Explanation | Three points draw in order over 400 ms, each starting just before the last ends | None |
| 19 | Plan select | State | Border colour over 150 ms | Selection |
| 21 | Finished | Delight | One short mascot celebration, then the chat | Success, once |

Mascot idle: an optional blink that first plays after about 2.5 seconds without touch, repeats about every 6 seconds, and stops when the user touches the screen.

Do not animate: numbers counting up, the content of question screens on arrival, or anything on the plans screen beyond selection.

Reduced motion: when `useReducedMotion()` is true, keep opacity changes and drop translation, scale and springs. The symptom list on Juno's own screen includes dizziness and brain fog, so this is not optional.

---

## 9. Copy deck

Put these in `src/copy/strings.ts`. They are drafts in Juno's voice: short, warm, plain. Do not rewrite them without flagging it. `{name}`, `{symptoms}`, `{condition}`, `{days}`, `{chargeDate}`, `{remindDate}` are filled at runtime.

| Key | Text |
| --- | --- |
| `welcome.title` | Tired of explaining your illness again and again? |
| `welcome.sub` | Tell Juno once. It remembers. |
| `welcome.cta` | Try it now |
| `consent.title` | Before you tell me anything |
| `consent.body` | Your health data is never sold, and there are no ads. Ever. |
| `try.q` | How do you feel today? |
| `try.placeholder` | Type how you feel |
| `try.suggestions` | "Tired, and my head hurts" · "Dizzy when I stand up" · "Okay today, just foggy" |
| `heard.reply` | That sounds hard. I've logged {symptoms} for today. |
| `heard.replyNone` | Thanks for telling me. I've saved that for today. |
| `goals.q` | What would make the biggest difference for you? |
| `goals.reply` | That's a realistic goal. Let's build around it. |
| `conditions.q` | What have doctors told you so far? |
| `conditions.why` | So I can show what's common with it. |
| `conditions.reply` | {condition} is exhausting. I'll keep a close eye on it. |
| `conditions.replyNone` | Not having a name for it is hard. We'll track it anyway. |
| `symptoms.q` | What has your body been doing lately? |
| `symptoms.why` | I've ticked what you just told me. Add anything I missed. |
| `symptoms.reply` | Got it. I'll look for what sets these off. |
| `meds.q` | Are you taking anything for it? |
| `meds.why` | So I can notice changes when you start or stop something. |
| `meds.reply` | Noted. You can add more any time. |
| `appt.q` | When do you next see a doctor? |
| `appt.why` | So your summary is ready before you walk in. |
| `appt.reply` | That's in {days} days. I'll have it ready. |
| `appt.replyNone` | No problem. Your record will be ready when you need it. |
| `energy.q` | How much energy do you have on a normal day? |
| `energy.why` | This helps me suggest when to rest. |
| `energy.reply` | Thanks. We'll plan around that, not against it. |
| `support.q` | Who really gets what you're going through? |
| `support.reply` | You're not alone in this. |
| `about.q` | What should I call you? |
| `about.why` | Age and sex at birth change what's typical for some conditions. |
| `about.reply` | Good to meet you, {name}. |
| `health.q` | Can I read your sleep and heart rate? |
| `health.why` | So you have less to log. |
| `health.reply` | Connected. I'll fill in the quiet days. |
| `snapshot.title` | Here's what I know so far, {name}. |
| `snapshot.watch` | This week I'll watch what affects your {symptom}. |
| `report.title` | What your doctor will see |
| `report.badge` | Preview |
| `report.countdown` | Ready for your appointment in {days} days |
| `save.title` | Save your snapshot |
| `save.sub` | So it's here next time, on any device. |
| `plans.headline.default` | See what your week is telling you |
| `plans.terms` | Free for 7 days, then $99.99/year from {chargeDate}. We'll remind you on {remindDate}. |
| `plans.cta` | Start 7 days free |
| `plans.free` | Continue with the free plan |
| `plans.cost` | Is cost a problem? |
| `plans.exitQ` | What stopped you? · The price · Not sure it's for me · I want to try it first |
| `notify.trial` | Can I remind you before your trial ends, and check in once a day? |
| `notify.free` | Can I check in with you once a day? |
| `chat.open` | I've saved today's entry. How did you sleep last night? |

Keep any existing Juno wording that this table does not replace, exactly as it appears in Figma.

---

## 10. Out of scope for v0

- Real authentication, purchases, notifications and health-data access (all mocked).
- A live model call on screen 4 (keyword match instead).
- The Australia-only NDIS screens.
- The chat beyond its first static state.
- Analytics. Do add a single `track(event, props)` function that logs to the console and call it on screen view and on each answer, so events are easy to wire later.

---

## 11. README contents

- The goal in one line and the three moves from section 1.
- A table of the 21 screens with the current screen each came from.
- What was cut from the current flow and why (one line each).
- What is mocked.
- How to run it.
- What you would measure if it shipped: accounts per starter, share reaching the snapshot, trial starts and paying users per starter, time to finish.

---

## 12. Definition of done

- The flow runs from screen 1 to screen 21 on iOS and Android without a dead end.
- Back works on every screen and keeps answers.
- The screen-3 entry appears on screens 4, 7, 15, 16 and 21.
- Skipping optional answers (medicines, appointment, health data) never produces an empty or broken screen.
- Each screen has been compared with its reference PNG, and differences are intentional and listed.
- Reduced motion and the largest font size both work.
- No hard-coded user-facing strings outside `strings.ts`.
- TypeScript and lint pass.

---

## 13. What to report back after each phase

Keep it short:

- What was built, with screenshots of each new screen beside its reference.
- Anything in Figma that differed from this plan, and what you did about it.
- Anything mocked or stood in for.
- What you could not verify without a real device (feel of gestures, haptic timing, performance on an older Android phone).

## 14. Open questions (use the default and carry on)

| Question | Default if unanswered |
| --- | --- |
| Which stack? | Expo and React Native, as above |
| Live model call or scripted reply on screen 4? | Scripted keyword match |
| Are any cut screens required for legal or marketing reasons? | Assume no; list the cut screens in the README |
| Exact option lists for goals, conditions, support and energy | Take them from the Figma frames |
