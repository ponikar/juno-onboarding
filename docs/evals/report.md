# Visual eval report

REVIEW when mean diff > 18.0 or SSIM < 0.75. Mean diff is 0-255 per pixel at 134x291. Bands are diff/SSIM.

| id | reference | mean diff | SSIM | top | mid | bottom | result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| welcome | 01-splash.png | 8.39 | 0.774 | 13.4/0.66 | 3.6/0.87 | 8.2/0.79 | PASS |
| consent | 12-consent.png | 7.52 | 0.824 | 7.0/0.86 | 0.0/1.00 | 15.6/0.61 | PASS |
| try | 36-try-logging.png | 8.39 | 0.829 | 18.6/0.74 | 4.6/0.77 | 2.0/0.97 | PASS |
| heard | 35-tracking-demo.png | 24.91 | 0.595 | 31.0/0.57 | 33.4/0.42 | 10.3/0.80 | REVIEW |
| goals | 14-goals.png | 30.38 | 0.253 | 36.5/0.37 | 37.3/0.00 | 17.3/0.38 | REVIEW |
| goals-demo | 14-more-goals--selected.png | 31.07 | 0.255 | 34.7/0.38 | 38.1/0.01 | 20.4/0.38 | REVIEW |
| conditions | 17-conditions.png | 15.97 | 0.532 | 23.3/0.57 | 14.4/0.39 | 10.1/0.63 | REVIEW |
| conditions-demo | 17-more-conditions--selected.png | 14.30 | 0.603 | 23.3/0.57 | 11.6/0.51 | 7.9/0.72 | REVIEW |
| symptoms | 20-symptoms.png | 16.00 | 0.533 | 24.3/0.55 | 13.8/0.39 | 9.9/0.66 | REVIEW |
| symptoms-demo | 20-more-symptoms--selected.png | 18.01 | 0.486 | 24.3/0.55 | 18.1/0.28 | 11.6/0.62 | REVIEW |
| meds | 19-meds.png | 14.71 | 0.577 | 23.1/0.56 | 14.0/0.39 | 7.1/0.78 | REVIEW |
| meds-demo | 19-more-meds--selected.png | 13.73 | 0.549 | 14.0/0.63 | 17.9/0.30 | 9.3/0.71 | REVIEW |
| appointment | 28-appointment.png | 22.06 | 0.623 | 21.5/0.64 | 7.6/0.62 | 37.1/0.61 | REVIEW |
| conditions-skipped | 17-conditions.png | 26.38 | 0.464 | 23.3/0.57 | 14.4/0.39 | 41.4/0.43 | REVIEW |
| appointment-empty | 28-appointment.png | 10.84 | 0.721 | 21.5/0.64 | 7.0/0.62 | 4.0/0.90 | REVIEW |
| energy | 37-energy-slider.png | 80.93 | 0.450 | 107.3/0.24 | 53.0/0.63 | 82.5/0.48 | REVIEW |
| energy-empty | 37-energy-slider.png | 9.86 | 0.819 | 23.0/0.64 | 2.8/0.90 | 3.8/0.92 | PASS |
| support | 46-reply-support.png | 51.51 | 0.434 | 100.3/0.29 | 37.7/0.34 | 16.5/0.67 | REVIEW |
| support-empty | 45-support-circle.png | 13.24 | 0.676 | 24.8/0.58 | 10.1/0.54 | 4.8/0.91 | REVIEW |
| about | 21-more-name--typed.png | 39.11 | 0.413 | 23.6/0.52 | 42.2/0.48 | 51.6/0.23 | REVIEW |
| about-empty | 21-name.png | 25.71 | 0.462 | 14.4/0.57 | 11.1/0.59 | 51.6/0.23 | REVIEW |
| health | 42-wearables.png | 26.07 | 0.542 | 28.4/0.49 | 36.4/0.42 | 13.5/0.72 | REVIEW |
| building | 54-analyzing.png | 22.63 | 0.616 | 35.6/0.52 | 20.8/0.48 | 11.5/0.85 | REVIEW |
| building-skipped | 54-analyzing.png | 22.52 | 0.633 | 34.6/0.55 | 21.4/0.49 | 11.6/0.86 | REVIEW |
| snapshot | 55-journey-ready.png | 38.62 | 0.573 | 37.1/0.58 | 61.7/0.34 | 17.1/0.81 | REVIEW |
| snapshot-skipped | 55-journey-ready.png | 37.98 | 0.590 | 41.4/0.52 | 61.2/0.35 | 11.2/0.91 | REVIEW |
| report | 09-story-report.png | 45.42 | 0.552 | 75.9/0.41 | 38.2/0.59 | 22.2/0.66 | REVIEW |
| save | 01b-auth.png | 25.03 | 0.539 | 40.4/0.49 | 25.0/0.44 | 9.7/0.68 | REVIEW |
| plans | 62-pw-price.png | 35.98 | 0.442 | 9.2/0.69 | 25.9/0.30 | 72.9/0.34 | REVIEW |
| sponsor | 62b-sponsor-sheet.png | 34.14 | 0.540 | 41.9/0.57 | 45.6/0.48 | 14.9/0.57 | REVIEW |
| notify | 61-bell.png | 27.15 | 0.709 | 18.0/0.52 | 0.0/1.00 | 63.4/0.61 | REVIEW |
| done | 64-subscribe-success.png | 19.02 | 0.681 | 21.8/0.62 | 26.8/0.59 | 8.4/0.84 | REVIEW |
| chat | next-first-chat.png | 15.23 | 0.650 | 25.1/0.57 | 14.8/0.56 | 5.8/0.82 | REVIEW |
