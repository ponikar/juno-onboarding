# Spec: personal projection, action ending, activation tracking
Status: final (auto)        Owner: Darshan        Created: 2026-11-14

## 1. Problem
The snapshot (screen 15) repeats the user's answers but computes nothing from them, and onboarding ends on a static chat (screen 21) with nothing to do. We also do not name or measure the activation moment.

## 2. Users and flows
- A new user with an appointment sees how many days of logs their doctor will get, and a row of day markers on the report preview.
- A new user without an appointment sees a 7-day plan for their main symptom.
- At the first chat, the user answers "How did you sleep last night?" with one tap and gets one reply.
- Product reads `activation` and `second_log` events.

## 3. Requirements
- R-01 WHEN the projection flag is on and an appointment is N >= 2 days away, THE SYSTEM SHALL replace the snapshot's last line with "Your appointment is in {N} days. Log once a day and your doctor sees {N} days of how you've felt, not just what you remember."
- R-02 WHEN the projection flag is on and there is no appointment (or its date has passed), THE SYSTEM SHALL use N = 7 and the line "Log once a day this week and I'll have 7 days to look for what affects your {symptom}." ({symptom} = first symptom from screen 4, else from screen 7; with none: "…what affects how you feel.").
- R-03 WHEN the appointment is today or tomorrow (N = 0 or 1), THE SYSTEM SHALL show "Your appointment is very soon. Today's entry is already in your summary." and 1 marker.
- R-04 WHEN the projection flag is on, THE SYSTEM SHALL show on the report preview a row of N day markers (today filled, the rest empty) labelled "1 of {N} days logged" ("1 of 1 day logged" for N = 1). Above 14 days it shows 14 markers and "+{rest} more".
- R-05 WHEN the markers appear, THE SYSTEM SHALL fade them in with a 30 ms stagger and scale today's marker from 0.9; with reduced motion, opacity only.
- R-06 WHEN the action-ending flag is on, THE SYSTEM SHALL replace the first chat's three suggestions with "Badly", "Okay", "Well", reachable without scrolling on a 375x667 screen.
- R-07 WHEN a sleep reply is tapped, THE SYSTEM SHALL store it, show it as the user's message, hide the three replies, and have Juno reply once: "Logged. That's two entries today. I'll check in tomorrow."
- R-08 WHEN a sleep reply is tapped, THE SYSTEM SHALL fire track('second_log') and leave the day markers at one logged day.
- R-09 WHEN screen 4 has fully settled with a logged entry and the tracking flag is on, THE SYSTEM SHALL fire track('activation', { secondsSinceOpen, symptomCount }) once per install, never again on Back or resume.
- R-10 WHEN a flag is switched off in the debug menu, THE SYSTEM SHALL show that screen exactly as before this change.

## 4. Edge cases
| Case | Expected behaviour | Covers |
|---|---|---|
| Appointment today | very-soon line, 1 marker, "1 of 1 day logged" | R-03, R-04 |
| Appointment tomorrow | same as today | R-03 |
| Appointment in 12 days | N = 12 line, 12 markers | R-01, R-04 |
| No appointment | 7-day line, 7 markers | R-02, R-04 |
| No appointment, no symptom | "…what affects how you feel." | R-02 |
| Date in the past after resuming later | treated as no appointment | R-02 |
| 60 days away | 14 markers + "+46 more" | R-04 |
| Back to screen 4, or resume | no second activation event | R-09 |
| Sleep reply tapped twice | impossible: replies hide after the first tap | R-07 |
| User types in chat before tapping | sleep reply still counts as the second entry | R-07 |
| Largest font | markers wrap; copy wraps | R-04 |
| Reduced motion | opacity only | R-05 |

## 5. Out of scope
Real persistence of logs beyond the onboarding store; an analytics backend; reminders; changing the copy of other screens.

## 6. Constraints
No new dependencies. Reuse ScreenShell, JunoReply, tokens, motion tokens, Tick look. Copy lines 25 words or fewer, no banned words (eval D-08). Numbers come only from the user's answers.

## 7. Boundaries for the agents
- Always: run `bunx tsc --noEmit`, `bunx expo lint`, `bun scripts/eval/unit.ts`.
- Ask first: new dependency, store shape changes beyond the two new fields.
- Never: touch src/conditions/* (another experiment in progress).

## 8. Done means
- R-01..R-04 -> unit (`scripts/eval/projection.ts`) -> copy, N and marker counts for today, tomorrow, 12 days, none, past, 60 days; word counts <= 25.
- R-04..R-07 -> ui -> simulator screenshots of 15, 16, 21 with flags on and off, and on the 375x667 simulator for 21.
- R-08, R-09 -> ui -> Metro log shows each event exactly once in a run, including after Back to screen 4.
- R-10 -> ui -> screenshots with flags off match the previous screens.

## 9. Pointers
src/app/snapshot.tsx, src/app/report.tsx, src/app/chat.tsx, src/app/heard.tsx, src/app/debug.tsx, src/lib/dates.ts, src/lib/track.ts, src/state/onboarding.tsx, src/copy/strings.ts, src/experiments/

## Decisions log (auto)
- More than 14 days: 14 markers + "+N more", so the row fits one or two lines.
- Sleep replies replace the three suggestions (they do not answer the sleep question).
- No appointment and no symptom: "…what affects how you feel."
- Flags default on (new behaviour); the debug menu turns each one off for comparison.
- The projection line replaces "This week I'll watch…", which said the same thing with less.
- A past appointment date is treated as no appointment.
- Activation fires once per install (stored `activated` flag); secondsSinceOpen counts from JS start of the current session.
- Built in the main session (3 agents are already running for the conditions experiment); the review uses one agent afterwards.
