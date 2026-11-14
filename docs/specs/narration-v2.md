# Juno onboarding: narration spec (v2)

Status: final (auto). Decisions log at the end.

This replaces the earlier narration brief. Read it after `JUNO_ONBOARDING_V0_PLAN.md`. Where the two disagree, this spec wins. Where this spec is silent, the plan stands.

**Your job is to build exactly what is written here.** Do not add facts, copy, screens, charts or animations that are not in this file. If something is unclear or cannot be built as written, stop and report it. Do not guess.

---

## 1. What this pass does

The questions stay the same. The way they are told changes. Four things are added:

1. **A story** on screen 2: why Juno exists.
2. **Insights**: one sourced fact after each block of questions.
3. **A promise** on screen 17: a small, gentle commitment.
4. **Progress**: the user always sees what they have built so far and what it becomes.

## 2. Words used in this spec

| Word | Exact meaning |
| --- | --- |
| **Insight** | One fact shown to the user. It always has three parts: a **stat** (big), a **label** (one sentence), a **source** (small). "Fact" and "insight" mean the same thing. All insights are listed in section 6. There are no others. |
| **Kind line** | One short sentence under an insight that says what it means for the user. Listed in section 6. |
| **Known-so-far list** | A short ticked list of what the user has told Juno so far. It is the progress element on insight cards. Spec in section 7.2. |
| **Segment** | A named group of screens. There are six. Listed in section 4. |
| **Flow bar** | The thin progress bar and segment label at the top. Spec in section 7.1. |
| **Projection** | The timeline on screen 20 that shows what the doctor page becomes. Spec in section 7.3. |
| **Week dots** | A row of seven dots showing day 1 of 7. Spec in section 7.4. |

## 3. Hard rules

- Use only the insights in section 6, word for word. Never round, reword or add a number.
- Every insight shows its source line.
- Insights comfort. They never mention death, prognosis, cures or treatment.
- Progress and projection describe the user's record only. Never write that the user will feel better, or that Juno finds patterns after a number of days.
- All copy is in section 8, word for word. No em dashes. Sentence case.
- Build new screens from existing Figma layouts, tokens, components, icons and mascot poses. Use the PNGs in `docs/reference/` first. No new illustration style, font or colour.
- If copy does not fit at the largest font size, let it wrap. Do not shrink type or cut words.

---

## 4. The flow: 25 screens, 6 segments

| # | Screen | Segment | Story beat (what this screen tells the user) | New or changed |
| --- | --- | --- | --- | --- |
| 1 | Welcome | none | "You are tired of repeating yourself. This fixes that." | Changed: one line added |
| 2 | Why we built Juno | none | "The people who made this have been where you are." | **New** |
| 3 | Privacy promise | none | "Before you say anything, here is how we protect it." | Unchanged (was 2) |
| 4 | How do you feel today? | Today | "Just tell me, in your own words." | Unchanged (was 3) |
| 5 | Juno heard you | Today | "I listened, and I kept it." | Changed: two lines added (was 4) |
| 6 | Goals | Your health | "What do you want from this?" | Changed: limit of 3 (was 5) |
| 7 | Conditions | Your health | "What have you been told so far?" | Unchanged (was 6) |
| 8 | Symptoms | Your health | "What is your body doing?" | Unchanged (was 7) |
| 9 | Medicines | Your health | "What are you taking?" | Unchanged (was 8) |
| 10 | Health insight card | Your health | "You are not the only one. Look what I know already." | **New** |
| 11 | Next appointment | Your days | "When do you next need this?" | Unchanged (was 9) |
| 12 | Energy | Your days | "How much do you have to spend?" | Unchanged (was 10) |
| 13 | Support | Your days | "Who is with you?" | Unchanged (was 11) |
| 14 | Days insight card | Your days | "Appointments are short. Your page will speak first." | **New** |
| 15 | About you | You | "Who am I talking to?" | Changed: reason line removed (was 12) |
| 16 | Health data | You | "Let me do some of the logging for you." | Unchanged (was 13) |
| 17 | A small promise | You | "Give me one line a day. Bad days count." | **New** |
| 18 | Building your snapshot | Your snapshot | "Watch me put it together." | Unchanged (was 14) |
| 19 | Your snapshot | Your snapshot | "Here is everything you told me, in one place." | Changed: button text (was 15) |
| 20 | Doctor page and projection | Your snapshot | "This is what your doctor sees, and what it grows into." | Changed: projection added (was 16) |
| 21 | Save your snapshot | Your snapshot | "Keep what you built." | Unchanged (was 17) |
| 22 | How Juno works, free week | Your plan | "Here is the deal, plainly." | Unchanged (was 18) |
| 23 | Plans | Your plan | "Choose. Free is a real choice." | Unchanged (was 19) |
| 24 | Stay in touch | Your plan | "I'll check in when you said." | Changed: uses chosen time (was 20) |
| 25 | Welcome, first chat | none | "Day 1 is done. Here is where we talk." | Changed: week dots added (was 21) |

The entry typed on screen 4 must appear on screens 5, 8, 19, 20 and 25. Update the debug menu to the new numbers.

**Give-back rule, already satisfied by this table:** screens 4 then 5; 6 to 9 then 10; 11 to 13 then 14; 15 to 17 then 18 to 20. Do not reorder.

The one-line `JunoReply` after each answer on question screens stays exactly as in the plan.

---

## 5. Screen specs (new and changed screens only)

Each spec lists the elements **top to bottom**. Build them in that order. Copy keys are in section 8.

### Screen 1. Welcome (changed)

Built from 01 splash (`1:330`), as in the plan. One change: add `welcome.time` as a third text line, directly under `welcome.sub`, in the secondary text style. Nothing else moves. No flow bar.

### Screen 2. Why we built Juno (new)

Built from the existing welcome story slide layout (09 story-report, `1:516`): sky background, mascot, text block, one button.

1. Back arrow, top left.
2. Mascot, in the calm standing pose already exported.
3. Title: `story.title`.
4. Line: `story.body1`.
5. Line: `story.body2`.
6. Closing line, in the emphasised text style: `story.close`.
7. Primary button: `story.cta`. Goes to screen 3.

No flow bar. No skip link. No insight card. The fact on this screen is insight F7, used inside `story.body1`.

### Screen 5. Juno heard you (changed)

As in the plan (was screen 4). Add two lines under Juno's reply, in this order:

1. Progress line: `heard.progress`, with a small tick icon to its left.
2. Next line: `heard.next`, in the secondary text style.

Button text becomes `card.cta`.

### Screen 6. Goals (changed)

Add the helper text `goals.limit` under the question. After three goals are picked, the remaining chips are dimmed and cannot be picked. Unpicking one re-enables them. Do not add a limit to conditions, symptoms or medicines.

### Screens 10 and 14. Insight cards (new)

One shared layout. Built from the full-screen reply layout (15 goal-recognition, `1:660`). If that frame does not fit, use 46 reply-support (`1:1370`) and report it.

1. Flow bar, with the segment label in its "done" state (section 7.1).
2. Mascot, small, in the reply pose.
3. **Insight block**, inside one card:
   - Stat, in the largest heading style.
   - Label, body style, directly under the stat.
   - Source, smallest secondary style.
4. Kind line, body style, outside the card, centred.
5. **Known-so-far list** (section 7.2), with its heading.
6. Next line, secondary style.
7. Primary button: `card.cta`.

Which insight shows is decided by the rules in section 6. Exactly one insight per card. No carousel, no "see more".

### Screen 15. About you (changed)

Remove the reason line (`about.why` is deleted). Name, age and sex at birth stay. Age and sex at birth must now appear in the header of the doctor page on screen 20, next to the name. If either was not given, leave it out of the header.

### Screen 17. A small promise (new)

Built from 45 support-circle (`1:1349`), the single-select layout.

1. Flow bar.
2. Mascot.
3. Question: `commit.q`.
4. Sub-line: `commit.sub`.
5. Three single-select options, stacked: `commit.opt.most`, `commit.opt.good`, `commit.opt.unsure`.
6. After "most" or "good" is picked, a second question appears below: `commit.whenQ`, with three single-select chips in one row: `commit.when.morning`, `commit.when.afternoon`, `commit.when.evening`. It does not appear for "unsure".
7. `JunoReply`: `commit.reply` for "most" or "good"; `commit.replyUnsure` for "unsure".
8. Primary button: `commit.cta` for "most" or "good"; `card.cta` for "unsure". Enabled as soon as an option in step 5 is picked. The time chips are optional.

Every interaction is a single tap. No press-and-hold, no swipe, no streak counter. Save `commitment` and `checkInTime`.

### Screen 19. Your snapshot (changed)

As in the plan (was 15). Button text becomes `snapshot.cta`.

### Screen 20. Doctor page and projection (changed)

As in the plan (was 16), plus the projection.

1. Flow bar.
2. Title: `report.title`, with the `report.badge` tag.
3. The doctor page preview, as in the plan. Header shows name, then age and sex at birth if given.
4. Section title: `project.title`.
5. The projection timeline (section 7.3).
6. Note line, smallest secondary style: `project.note`.
7. Primary button: `project.cta`. Goes to screen 21.

The whole screen scrolls. The button stays fixed at the bottom.

### Screen 24. Stay in touch (changed)

- If `checkInTime` is set: the question is `notify.withTime`.
- If it is not set: use `notify.free`.
- For users who started the trial, add `notify.trialLine` under the question in both cases. Delete the old `notify.trial` string.

### Screen 25. Welcome, first chat (changed)

As in the plan (was 21). Add the week dots (section 7.4) with the caption `chat.day` directly under the chat header.

---

## 6. Insights: the complete list

Store these in `src/copy/facts.ts`, each with its source URL as a code comment. Checked on 14 Nov 2026.

### On screen 2 (inside the story)

| ID | Used as | Source |
| --- | --- | --- |
| F7 | `story.body1` | Juno's YC launch page |

### On screen 10 (health insight card). Show the first row whose rule is true.

| Order | ID | Show when | Stat | Label | Source line | Kind line |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | F3 | "Endometriosis" is among the picked conditions | 8 years 10 months | is the average wait for an endometriosis diagnosis in the UK. | Source: Endometriosis UK, 2024 | A long wait is common. It is not your fault. |
| 2 | F4 | Any picked condition matches the autoimmune list below | 4 doctors | is the average seen before an autoimmune diagnosis. | Source: Autoimmune Association | A long road is common. It is not your fault. |
| 3 | F8 | "Still looking for answers" is picked | 14 years | is how long Isaac, who co-built Juno, waited for his diagnosis. | Source: Juno's founders | Still looking is common. It is not your fault. |
| 4 | F2 | Device region is GB | 1 in 4 | adults in England live with two or more long-term conditions. | Source: Richmond Group of Charities | You are far from the only one. |
| 5 | F1 | Always (default) | 6 in 10 | US adults live with at least one chronic condition. | Source: CDC | You are far from the only one. |

Autoimmune list for row 2. Match these names against Juno's condition list from Figma, ignoring case. Use only names that exist in Juno's list. Do not add conditions to Juno's list: Lupus, Rheumatoid arthritis, Multiple sclerosis, Crohn's disease, Ulcerative colitis, Hashimoto's, Psoriatic arthritis, Sjögren's, Coeliac disease, Type 1 diabetes.

### On screen 14 (days insight card). Show the first row whose rule is true.

| Order | ID | Show when | Stat | Label | Source line | Kind line |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | F6 | `FACT_F6_APPROVED` is true **and** the support answer is the lowest or second-lowest option | 3 in 4 | people starting Juno said the same about support. | Source: Juno onboarding data | You have one more now. |
| 2 | F5 | Always (default) | 11 seconds | is how long patients spoke before the doctor cut in, in one US study. | Source: Journal of General Internal Medicine | Your page speaks first, so you don't have to rush. |

`FACT_F6_APPROVED` is a constant set to `false`. It stays false until Juno approves publishing its own data.

### Not allowed

- Juno's "7.6 years average diagnosis" and "over 1 billion people" figures. No source was found.
- Any other number, on any screen, that is not the user's own data, a price, a date, or in the tables above.

---

## 7. Progress: the four elements

### 7.1 Flow bar (where the user is)

- Shown on screens 4 to 24. Hidden on 1, 2, 3 and 25.
- Two parts: the segment label, left-aligned, above a thin bar (3 pt high, full width, rounded ends).
- Bar fill = (screen number minus 3) divided by 21. Screen 4 is 1/21. Screen 24 is 21/21.
- Label text is the segment name from section 4: `seg.today`, `seg.health`, `seg.days`, `seg.you`, `seg.snapshot`, `seg.plan`.
- "Done" state, only on screens 10 and 14: the label reads `seg.health.done` or `seg.days.done`, with a tick icon to its left.
- No "Step X of Y". No percentage. No dots or four-part segmented bar; this replaces the plan's segmented bar.

### 7.2 Known-so-far list (what the user has built)

Shown on screens 10 and 14 only. Heading: `known.title`. Each row is an icon plus one line. A filled tick means given. An open grey circle means not given yet. Rows are not tappable.

Screen 10 rows, in this order:

| Row | Text when given | Text when not given |
| --- | --- | --- |
| 1 | Today's entry | (always given) |
| 2 | Conditions: {n} | Conditions: still looking |
| 3 | Symptoms: {n} | Symptoms: none right now |
| 4 | Medicines: {n} | Medicines: add later |

Screen 14 rows, in this order:

| Row | Text when given | Text when not given |
| --- | --- | --- |
| 1 | Next appointment: {date} | Next appointment: none booked |
| 2 | Energy on a normal day | (always given) |

`{n}` is the count picked. `{date}` is formatted like "12 Dec".

### 7.3 Projection timeline (what it becomes)

Shown on screen 20 only. A **vertical timeline**, in the style of the trial timeline on 60 pw-trial (`1:1725`): a line down the left, a round node per point, a title and one sub-line to the right of each node. No chart, no graph, no percentages.

- The first node is filled with a tick. Later nodes are outlined, and their text is in the secondary style.
- `N` = whole days from today to the appointment. Entries by the appointment = N + 1.

Which nodes show:

| Case | Node 1 | Node 2 | Node 3 |
| --- | --- | --- | --- |
| No appointment | `project.today` | `project.week` + week dots | `project.month` |
| Appointment today (N = 0) | `project.todayAppt` | `project.week` + week dots | `project.month` |
| Appointment in 1 to 6 days | `project.today` | `project.appt` | none |
| Appointment in 7 days or more | `project.today` | `project.week` + week dots | `project.appt` |

Under the `project.week` node, show the week dots (section 7.4).

### 7.4 Week dots (day 1 of 7)

A single row of seven equal dots. The first is filled in the brand colour. The other six are outlined. Not tappable. Shown in two places only: under the `project.week` node on screen 20, and under the chat header on screen 25 with the caption `chat.day`.

---

## 8. Copy: every new or changed string

Add to `src/copy/strings.ts`. Strings not listed here stay as in the plan.

| Key | Text |
| --- | --- |
| `welcome.title` | Tired of explaining your illness again and again? |
| `welcome.sub` | Tell Juno once. It remembers. |
| `welcome.time` | About 5 minutes. Be as honest as you like. |
| `welcome.cta` | Try it now |
| `story.title` | We built Juno because we needed it. |
| `story.body1` | Isaac waited 14 years for a diagnosis. |
| `story.body2` | Marshall lives with ME/CFS. |
| `story.close` | So Juno listens first. |
| `story.cta` | Show me how |
| `seg.today` | Today |
| `seg.health` | Your health |
| `seg.health.done` | Your health, done |
| `seg.days` | Your days |
| `seg.days.done` | Your days, done |
| `seg.you` | You |
| `seg.snapshot` | Your snapshot |
| `seg.plan` | Your plan |
| `heard.progress` | That's entry 1 on your doctor page. |
| `heard.next` | Next: your health. |
| `goals.limit` | Pick up to 3 |
| `known.title` | What I know so far |
| `card.health.next` | Next: your days. |
| `card.days.next` | Next: a little about you. |
| `card.cta` | Keep going |
| `commit.q` | Can you tell me one line a day? |
| `commit.sub` | Like the one you wrote earlier. |
| `commit.opt.most` | Yes, most days |
| `commit.opt.good` | On good days |
| `commit.opt.unsure` | Not sure yet |
| `commit.whenQ` | When suits you? |
| `commit.when.morning` | Morning |
| `commit.when.afternoon` | Afternoon |
| `commit.when.evening` | Evening |
| `commit.reply` | Deal. Bad days count too. Miss one and nothing breaks. |
| `commit.replyUnsure` | That's fine. I'll be here when you are. |
| `commit.cta` | I'm in |
| `snapshot.cta` | See my doctor page |
| `project.title` | What this page becomes |
| `project.today` | Today · 1 entry |
| `project.todayAppt` | Today, your appointment · Your first entry is on the page |
| `project.week` | Day 7 · 7 entries, side by side |
| `project.appt` | {date}, your appointment · Up to {entries} entries on one page |
| `project.month` | Day 30 · A month on one page |
| `project.note` | Counts assume one entry a day. Miss a day and nothing breaks. |
| `project.cta` | Save my snapshot |
| `notify.withTime` | Can I check in each {time}? |
| `notify.trialLine` | I'll also remind you before your trial ends. |
| `chat.day` | Day 1 of 7 |

In the `project.*` strings, the text before " · " is the node title and the text after it is the sub-line. `{time}` is "morning", "afternoon" or "evening" in lower case.

Deleted keys: `about.why`, `notify.trial`.

Insight stats, labels, source lines and kind lines are in section 6 and live in `facts.ts`, not `strings.ts`.

---

## 9. State additions

```ts
commitment: 'most_days' | 'good_days' | 'unsure' | null;
checkInTime: 'morning' | 'afternoon' | 'evening' | null;
```

---

## 10. Motion

Use the plan's motion tokens. Reduced motion keeps opacity changes only.

| Where | Moment | Motion | Haptic |
| --- | --- | --- | --- |
| Screens 1 to 25 | Moving between screens | New screen fades in and rises 8 pt over 280 ms, ease-out. Back plays the reverse. This replaces the native push | None |
| Flow bar | Screen change | Fill grows over 250 ms | None |
| Flow bar | Segment label changes | Old label fades out, new fades in, 150 ms | None |
| Screen 2 | Arrival | Title, body1, body2, close appear in that order with 0, 50, 90, 120 ms delays | None |
| Screens 10, 14 | Arrival | Insight card fades in from 95% size over 300 ms. Then the kind line. Then list rows one by one, 50 ms apart, each tick scaling from 90% | Success, once, when the card lands |
| Screen 17 | Option picked | Option fills over 150 ms. Mascot nods once. Reply fades in | Success, once |
| Screen 17 | Time chip picked | Chip fills over 150 ms | Selection |
| Screen 20 | Projection scrolls into view | Node 1 appears, then the line draws down to node 2, then node 3. 400 ms in total. Plays once | None |
| Screens 20, 25 | Week dots | First dot fills over 150 ms | None |

Do not animate numbers counting up. Do not add any other animation to these screens.

---

## 11. Acceptance checks

Report pass or fail for each, with a screenshot where it applies.

1. The flow has 25 screens in the order of section 4.
2. Screen 2 shows exactly the four lines and one button in section 5.
3. Screen 10 shows the right insight for each of these test cases: endometriosis picked; an autoimmune condition picked; "Still looking for answers" picked; region GB with none of those; region US with none of those.
4. Screen 14 shows F5 with the flag off. With the flag on and a low support answer, it shows F6.
5. Every insight on screen matches section 6 character for character and shows its source line.
6. The known-so-far list shows the correct text for given and not-given answers on both cards.
7. The flow bar shows on screens 4 to 24 only, with the right label on each, and the "done" state on 10 and 14 only.
8. Screen 17: time chips appear for "most" and "good", not for "unsure". The button label changes as specified.
9. Screen 20 shows the right nodes for: no appointment; appointment today; in 3 days; in 12 days. The entry count for 12 days reads 13.
10. Screen 20 and all cards contain no words about patterns, improvement or feeling better.
11. Age and sex at birth show in the doctor page header when given, and are absent when not given.
12. Screen 24 uses the chosen time. Trial users see the extra line.
13. Screen 25 shows week dots with "Day 1 of 7".
14. No string contains an em dash. No button outside question screens reads "Continue", "Get started" or "Submit".
15. All four new screens work at the largest font size and with reduced motion on.
16. `node icon-eval.mjs` exits 0.
17. The report lists, for each new screen, the Figma frame it was built from.

---

## 12. Decisions waiting on Juno (build the default now)

| Question | Default to build |
| --- | --- |
| May the app name Isaac and Marshall (screen 2, insight F8)? | Yes. Flag it in the README |
| May the app show the 3-in-4 support figure (F6)? | No. Flag stays false |
| Is 25 screens acceptable against "around 20"? | Build 25 |
| How many logs before patterns appear? | Say nothing about patterns |

## Sources

- F1. CDC, Chronic Diseases in America: https://www.cdc.gov/chronicdisease/resources/infographic/chronic-diseases.htm
- F2. Richmond Group of Charities: https://richmondgroupofcharities.org.uk/mltcs
- F3. Endometriosis UK, March 2024: https://endometriosis-uk.org/node/1118
- F4. Autoimmune Association: https://autoimmune.org/blog/meet-dawn-green-turning-my-pain-into-purpose/
- F5. Singh Ospina et al., authors' letter restating the finding (112 recorded visits): https://pmc.ncbi.nlm.nih.gov/articles/PMC6816596
- F6. Juno funnel board (Figma), support-circle answers, about 75%
- F7, F8. Juno YC launch page: https://www.ycombinator.com/launches/QT7-juno-ai-health-assistant-for-chronic-illness

## Decisions log (auto, 2026-11-14)

- `node icon-eval.mjs` (check 16): no such file exists in the repo. Not run; reported.
- Screen 2 mascot: no "calm standing pose" is exported (assets: mascot-peek, mascot-card-peek, juno-avatar). Uses mascot-peek, the welcome pose.
- Screen 20 becomes a pushed screen instead of a form sheet, so the flow bar, scrolling and fixed button match section 5.
- Screen transitions: the native stack fades over 280 ms and each screen's content rises 8 pt as it enters. A back step fades only (the native stack cannot reverse a JS rise).
- Region for F2: read from the device locale (`Intl`), so no new dependency.
- Earlier experiments that clash with this spec (snapshot projection line and day markers, sleep replies in chat) default to off; they stay in the debug menu. The conditions variants stay on "Now".
- Screen 25 trial button read "Continue", which check 14 forbids; it uses `card.cta` ("Keep going").
