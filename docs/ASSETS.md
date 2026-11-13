# Juno image assets

All files live in `assets/juno/` as `<name>@3x.png` (load with `require('../assets/juno/<name>.png')`).
Source: `docs/reference/<screen>.png`, cropped to the inner 1206x2622 px (3 px phone frame removed on every side; rounded corners filled from the nearest pixel in the same row). Positions are in points (pt) on the 402x874 pt source screen: x, y, w, h.

Methods:
- **fill**: removed areas (text, buttons, status bar, back/close buttons) are filled row by row with a linear blend of the pixels left and right of the area, then softly blurred. The status bar (0,0,402,54) is filled from the row below it. This replaced `cv2.inpaint` TELEA, which left hexagon smears and text ghosts on these large smooth gradients.
- **alpha**: transparency = colour distance between the original and a filled (clean) copy; colour is recovered by un-blending the clean background. `solid` = interior made fully opaque (holes filled).
- **crop**: plain rectangle, background kept.

## Backgrounds (opaque)

| File | Source | Position (pt) | Removed / method |
|---|---|---|---|
| bg-welcome | 01-splash | 0,0,402,874 | status bar, "Juno", headline, mascot, laurels + stats, button, "I have an account", legal text. fill. Pink/peach clouds kept. |
| bg-sky-fade | 14-goals | column x=2-3, 1x874 (3x2622 px is 1 px wide) | crop of left edge (px 6-10 averaged), status bar rows set to the first sky row. Stretch horizontally. |
| bg-bell | 61-bell | 0,0,402,874 | status bar, back button, title, Continue button. Bell cloud kept. fill. |
| bg-clouds | 61-bell | 0,0,402,874 | as bg-bell plus the bell cloud (100,385,202,220). fill. |
| bg-lock | 12-consent | 0,0,402,874 | status bar, back button, headline, body, whole consent panel (checkbox row + button, 7,727,388,122). Lock cloud kept. fill. |
| bg-plans | 62-pw-price | 0,0,402,385 | status bar (incl. dynamic island), back, close, key, sparkle, title. fill. Ends at y=385, just above the mascot head over the yearly card. Below y=385 the screen is flat light (#f9f8f6 approx). |
| bg-honesty | 56-honesty | 0,0,402,362 | status bar, back, close, title. Mascot kept. fill. |
| bg-juno-cloud | 64-more-subscribe-success--free-plan | 0,0,402,874 | status bar, "Welcome to Juno" + subtitle, "Let's go" button. "Juno" cloud lettering kept. fill. |
| health-cluster | 43-health-connect | 34,232,334,264 | crop with background. Place at that position on bg-sky-fade. |

bg-sky-fade gradient stops (y in pt, hex): 0 `#3685d4`, 270 `#3684d4`, 420 `#74aae8`, 570 `#a9c6f0`, 720 `#e0e8f5`, 765 `#f9f7f8`, 874 `#f9f8f6`.

## Cut-outs (transparent)

| File | Source | Position (pt) | Method |
|---|---|---|---|
| mascot-peek | 01-splash | 102,418,200,150 | alpha vs bg-welcome, solid, bottom 14 pt fades out. Chin between the hands is faint (it is behind the cloud in the source). |
| laurel-left | 01-splash | 18,583,36,74 | alpha vs bg-welcome. |
| laurel-right | 01-splash | 348,583,36,74 | alpha vs bg-welcome. |
| key | 62-pw-price | 148,94,98,120 | alpha vs bg-plans. Faint blue fringe on some edges (sky colour baked into antialiasing). |
| sparkle | 62-pw-price | 245,109,20,23 | alpha vs bg-plans. |
| mascot-card-peek | 62-pw-price | 298,386,64,43 | alpha vs a row-filled copy, solid. Bottom edge is a hard cut where the yearly card covers it; place it behind/above the card top. |

## Icons (crop with white card background)

| File | Source | Position (pt) |
|---|---|---|
| goal-flare | 14-goals | 34,247,32,32 |
| goal-symptoms | 14-goals | 34,325,32,32 |
| goal-pain | 14-goals | 34,402,32,32 |
| goal-support | 14-goals | 34,480,32,32 |
| goal-triggers | 14-goals | 34,557,32,32 |
| goal-appointments | 14-goals | 34,635,32,32 |
| goal-energy | 14-goals | 34,712,32,32 |

## More icons and cut-outs

Methods: `crop` keeps the card/tile background; `alpha vs flat bg` = alpha from distance to the median border colour; `alpha vs row-filled bg` = alpha vs a row-filled copy. The 3 bubbles are also clipped to their circle + "0" badge; the sponsor ticket alpha is an orange-colour mask with holes filled (bg ignored).

| File | Source | Position (pt) | Method |
|---|---|---|---|
| juno-avatar | 35-tracking-demo | 73.7,422.3,30.0,30.0 | crop + circular alpha |
| google | 01b-auth | 104.0,529.0,20,20 | alpha vs flat bg |
| apple | 01b-auth | 104.0,591.0,20,20 | alpha vs flat bg |
| mail | 01b-auth | 118.0,696.0,20,20 | alpha vs flat bg |
| sex-female | 31-sex | 38.0,251.0,30,30 | crop |
| sex-male | 31-sex | 38.0,341.0,30,30 | crop |
| sex-intersex | 31-sex | 38.0,431.0,30,30 | crop |
| age-16 | 33-age | 37.0,221.0,32,32 | crop |
| age-18 | 33-age | 37.0,311.0,32,32 | crop |
| age-25 | 33-age | 37.0,401.0,32,32 | crop |
| age-35 | 33-age | 37.0,491.0,32,32 | crop |
| age-45 | 33-age | 37.0,581.0,32,32 | crop |
| age-55 | 33-age | 37.0,671.0,32,32 | crop |
| age-65 | 33-age | 37.0,761.0,32,32 | crop |
| support-none | 45-support-circle | 37.0,250.0,32,32 | crop |
| support-one-two | 45-support-circle | 37.0,340.0,32,32 | crop |
| support-three-five | 45-support-circle | 37.0,430.0,32,32 | crop |
| support-lots | 45-support-circle | 37.0,520.0,32,32 | crop |
| shield | 62-pw-price | 98.0,663.0,14,14 | alpha vs flat bg |
| sponsor-ticket | 62b-sponsor-sheet | 92,343,218,66 | alpha vs row-filled bg |
| sponsor-work | 62b-sponsor-sheet | 31.0,528.0,36,36 | crop |
| sponsor-income | 62b-sponsor-sheet | 31.0,608.0,36,36 | crop |
| sponsor-student | 62b-sponsor-sheet | 31.0,688.0,36,36 | crop |
| honesty-1 | 56-honesty | 19.0,383.0,32,32 | crop |
| honesty-2 | 56-honesty | 19.0,477.0,32,32 | crop |
| honesty-3 | 56-honesty | 19.0,554.0,32,32 | crop |
| honesty-4 | 56-honesty | 19.0,629.0,32,32 | crop |
| chat-flare | next-first-chat | 98.0,419.0,34,34 | crop |
| chat-log | next-first-chat | 75.0,483.0,34,34 | crop |
| chat-vent | next-first-chat | 108.0,548.0,34,34 | crop |
| bubble-pill | 54-analyzing | 90,188,130,130 | alpha vs row-filled bg |
| bubble-warning | 54-analyzing | 196,384,130,130 | alpha vs row-filled bg |
| bubble-fingerprint | 54-analyzing | 80,518,182,180 | alpha vs row-filled bg |

Notes:
- juno-avatar is the round avatar from 35-tracking-demo (light-blue circle, mascot over a cloud), circular alpha. The next-first-chat header avatar has a green online dot over it and was not used.
- Bubbles keep a faint sky-blue tint inside the glass (it is translucent in the source); bubble-pill has a faint cloud smear at its bottom edge.
