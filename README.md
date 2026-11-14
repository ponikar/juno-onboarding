# Juno onboarding v0

**Goal:** let a new user feel Juno helping them before it asks for anything, in 21 screens instead of 65.

Juno's own funnel (30,435 starters) shows people leave when the app *asks* (account 17.3%, paywall 23.7%) and stay when it *gives* (71% try the logging demo). v0 makes three moves:

1. **Value before account.** The user logs how they feel and sees Juno respond on screens 3 and 4. Sign-up moves to screen 17 and is framed as saving what they built.
2. **A real result before the price.** "Your plan is ready" becomes a snapshot built from their own answers, then a preview of their doctor report.
3. **An honest ask.** The plans screen states the billed amount and charge date, and the free plan is a visible choice.

The sentence typed on screen 3 travels through screens 4, 7, 15, 16 and 21.

## The 21 screens

| # | Screen | Built from (current flow) |
| --- | --- | --- |
| 1 | Welcome | 01 splash |
| 2 | Privacy promise and consent | 12 consent (+ "never sold, no ads" from 56) |
| 3 | How do you feel today? | 36 try-logging |
| 4 | Juno heard you | 35 tracking-demo (new content) |
| 5 | Goals | 14 goals, 15 goal-recognition (reply) |
| 6 | Conditions | 17 conditions (replaces 18) |
| 7 | Symptoms (pre-ticked from screen 4) | 20 symptoms |
| 8 | Medicines | 19 meds |
| 9 | Next appointment | 28 appointment |
| 10 | Energy | 37 energy-slider |
| 11 | Support circle | 45 support-circle, 46 reply-support |
| 12 | Name, sex at birth, age | 21 name, 31 sex, 33 age |
| 13 | Health data | 42 wearables, 43 health-connect |
| 14 | Building your snapshot (real items, ~4 s) | 54 analyzing |
| 15 | Your snapshot | 55 journey-ready (new content) |
| 16 | Doctor report preview | 09 story-report, 29 reply-care-team |
| 17 | Save your snapshot (sign-up) | 01b auth |
| 18 | How Juno works + trial dates | 56 honesty, 60 pw-trial |
| 19 | Plans (+ sponsored sheet, exit question) | 62 pw-price, 62b sponsor-sheet |
| 20 | Stay in touch | 61 bell, 63 bell-after-plans |
| 21 | Welcome + first chat | 64 subscribe-success, 65 how-to-use-juno, first-chat |

## What was cut and why

- Sign-up as the second screen: 6.2% abandon it before seeing any value; it now saves a snapshot (screen 17).
- Story slides (most of 02–11): ~13% skip them; screens 3–4 show the product instead of describing it.
- Separate reply screens (15, 46 and similar): Juno's reply now appears on the question screen itself.
- 18 diagnosis follow-up: folded into "Still looking for answers" on screen 6.
- Three "thinking" pauses: one remains (screen 14) and it shows the user's real answers.
- Two notification asks (61 and 63): one ask, after the plan choice (screen 20).
- 31 sex and 33 age as separate screens: merged into screen 12.
- Australia-only NDIS screens: out of scope for v0.

## What is mocked (labelled `MOCK` in code)

- Screen 4 reply: local keyword match (`src/mocks/extractSymptoms.ts`), not a model call.
- Authentication (screen 17), the purchase (19), the health-data permission (13) and notifications (20): each succeeds after a short delay.
- First chat: static.
- Analytics: `track(event, props)` logs to the console on every screen view and answer (`src/lib/track.ts`).

## Run it

```bash
bun install
bunx expo start        # press i for the iOS simulator (Expo Go)
```

Long-press the **Juno** logo on the welcome screen to jump to any screen (and to fill demo answers) for recording.

## How the build was checked

- Figma has no layers or variables (each screen is one flat image), so the screens were exported as 3x PNGs (`docs/reference/`), and images were cut out of them (`assets/juno/`, see `docs/ASSETS.md`). Colours and spacing were sampled from the pixels (`src/theme/tokens.ts`).
- Every screen is screenshotted in the iOS simulator and compared side by side with its Figma reference (`scripts/eval/`, results in `docs/evals/compare/` and `docs/evals/report.md`).
- `bun scripts/eval/unit.ts` checks the symptom extraction and trial-date maths.

### Pixel scores, and why most screens say REVIEW

`compare.py` scores each screenshot against the old Figma screen it was built from. PASS (mean colour difference ≤ 18 and SSIM ≥ 0.75) means a near-copy: Welcome, Consent, Try and Energy pass. Most other screens say REVIEW because v0 changes their content on purpose (new questions, Juno's replies, the snapshot and report built from real answers, honest prices). For those, each side-by-side image in `docs/evals/compare/` was looked at for layout, colour, type and clipping instead of trusting the number.

### Intentional differences from Figma

- New copy from the plan's copy deck everywhere; additions the deck did not cover are marked `// NEW` in `src/copy/strings.ts` (for example the screen 4 title, empty-state lines, and the goal-based plan headlines).
- Progress bar: four segments, one per act (Figma shows three).
- Screen 3: two extra suggestion chips and a microphone button (dictation uses the keyboard mic; it focuses the field).
- Screen 4: the chat demo is rebuilt full-width instead of inside a phone mock-up.
- Screen 12 combines name, sex at birth and age; sex and age are chips instead of full-width cards.
- Screen 14 shows the user's real answers instead of the bubbles with "0" counters (they read as fake progress).
- Screen 19: the yearly card leads with $99.99 a year; terms with real dates, the free plan link and "Is cost a problem?" are added, so the cards sit higher than in Figma.
- The Dynamic Island and Expo Go's gear button show in simulator screenshots; neither is part of the app.

### Accessibility

- Font scaling stays on. Body text grows up to 1.6x and large titles up to 1.25x, so the largest system size reflows without overlapping the art (checked at AX5 on Welcome, Conditions, Snapshot and Plans).
- Every animation branches on `useReducedMotion()`: opacity stays, translation, scale and springs drop.
- Touch targets are at least 44 pt (hit slop on the 38 pt back button and small links).

### Not verified

- The whole flow (screens 1–21, the sponsored sheet, the exit question, the mock sign-in, purchase and permission prompts, and the slider drag) was tapped through on the iOS simulator with Maestro. Not tapped: the email sign-up path and the free-plan path to the end.
- Haptics timing, gesture feel and performance on an older Android phone need a real device.
- Android was not run.

## What I'd measure if it shipped

- Accounts per starter.
- Share of starters reaching the snapshot (screen 15).
- Trial starts per starter and paying users per starter.
- Median time from first open to first chat.
