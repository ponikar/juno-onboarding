# Static eval report

Run: `bun scripts/eval/static/<file>.ts` for `copy.ts`, `screens.ts`, `contrast.ts`, `targets.ts`, `fonts.ts`, `dates.ts`, `state.ts`. Each prints PASS/FAIL per item and exits 1 on any failure. Ran 2026-11-14 on branch onboarding-v0 (working tree).

| ID | Result | Severity | Evidence |
| --- | --- | --- | --- |
| D-01 | FAIL | Major | `notify.trial` = "Can I remind you before your trial ends, and check in once a day?" (14 words, 65 chars). All other q/title/headline keys pass. |
| D-02 | FAIL | Major | `symptoms.why` = "I’ve ticked what you just told me. Add anything I missed." (2 sentences). `welcome.sub` = "Tell Juno once. It remembers." (2 sentences; a tagline, flagged because the brief scopes `sub` keys). |
| D-03 | FAIL | Major | `chat.replies.flare` = "I’m sorry today is hard. I’ve marked it as a flare day. What’s worst right now?" (16 words, 3 sentences). |
| D-04 | FAIL | Major | Screen 13 `src/app/health.tsx` 55/40 words (health.bullet1 16 + bullet2 13). Screen 18 `src/app/how.tsx` 94/60 words (how.rows 60). Others pass; approximate count of every `S.*` key a route references, longest alternative per family, options/a11y/legal excluded. |
| D-05 | PASS | Minor | No sentence over 20 words across all strings (longest: health.bullet1, 16). |
| D-06 | PASS | Major | conditions.why, meds.why, about.why, health.why all present. |
| D-08 | NOT TESTED | Blocker | Banned words: none found (PASS). Not verifiable statically: `welcome.proof1Big`/`proof1Small` "#1 App for chronic illness" and `welcome.proof2Big`/`proof2Small` "300K Happy users" need a source to prove they are not invented. |
| D-10 | PASS | Major | No "don’t miss", "last chance", "you should", hurry/expires/limited-time phrase in any string. |
| D-11 | FAIL | Minor | Replies switch to "we/let’s": `goals.reply` "That’s a realistic goal. Let’s build around it.", `conditions.replyNone` "… We’ll track it anyway.", `energy.reply` "Thanks. We’ll plan around that, not against it." Screen 4 mixes third person (`heard.title` "Juno heard you", `heard.sub` "Juno logs it for you.") with "I" in `heard.reply`. |
| D-12 | FAIL | Blocker | Dates are computed from today (`trialDates(new Date())` in plans.tsx:31, how.tsx:26; month-end test 2026-11-28 → remind Dec 3, charge Dec 5 PASS). Format FAIL: `src/lib/dates.ts` `formatDate` uses a hard-coded English month array ("Nov 28" on every device), used by plans.tsx:80, how.tsx:29-30, building.tsx:25. |
| T-02 | FAIL | Major | Screen 20 `src/app/notify.tsx:37` main button `notify.allow` = "Continue". Screens 1/17/19 pass ("Try it now"; save uses "Continue with Google/Apple", "Sign up with email"; "Start 7 days free"). |
| A-02 | FAIL | Blocker | 26 of 35 pairs fail. Worst: white title on palest sky stop 1.07:1 (tokens.ts:44, worst case; actual title position not measured); snapshot white on glass over pale sky 1.66:1 (snapshot.tsx:96); building items white on glass 1.59–2.08:1 (building.tsx:88); sky why/sub 90% white on sky top 3.43:1 (ScreenShell.tsx:107); placeholder `muted` on surface 3.64:1 (Fields.tsx:16); muted on bg 3.38:1; disabled label on disabled fill 2.21:1 (PrimaryButton.tsx:31); white on orange badges 2.61–2.92:1 (report.tsx:100, plans.tsx:191); calendar today orange 2.61:1 (Calendar.tsx:95); user bubble white on #0A7AFF 4.01:1 (heard.tsx:151); welcome grey #868485 3.45:1. Outlines below 3:1: chip hairline 1.36, field orangeBorder 1.53, tick ring 1.90. Full list: `bun scripts/eval/static/contrast.ts`. |
| A-01 | FAIL | Blocker | `src/app/chat.tsx:176` attach button: 20x20 icon + hitSlop 8 = 36x36 (below 44). `src/ui/Calendar.tsx:56` day cell 42 tall + hitSlop 2 = 46 (meets iOS 44, misses Android 48). `src/app/welcome.tsx:52` logo long-press 40 tall, no hitSlop (debug-only gesture). All others ≥ 48 effective (PressableScale default hitSlop 6). |
| G-01 | FAIL | Major | `src/app/report.tsx:101` label 12pt (below 13). Body and input text are 16–18pt. |
| J-05 | FAIL | Major | Never read by any screen: `medicinesSkipped`, `healthAnswered`, `signedIn`, `paywallExitReason`, `notificationsAllowed`. Read only on their own screen, unused later: `support` (support.tsx), `sexAtBirth` (about.tsx), `healthDataConnected` (health.tsx). |

## Not verified

- A-02 positions: which sky stop sits behind each white text line needs screenshots; welcome/consent art backgrounds were assumed to be `colors.bg`.
- A-01 sizes are from StyleSheet values, not rendered layout; calendar cell width (~48) and plan card height are estimates.
- D-04 is approximate: counts every string key a route file references, not what renders at once.
- D-08 numeric claims need a source.
- J-05 counts `state.x`/`s.x` reads in src/app, src/ui, src/lib; analytics `track()` use was not counted as a read.
- G-01 regex only reads single-line style objects.
