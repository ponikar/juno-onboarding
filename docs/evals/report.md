# Visual eval report

REVIEW when mean diff > 18.0 or SSIM < 0.75. Mean diff is 0-255 per pixel at 134x291. Bands are diff/SSIM.

| id | reference | mean diff | SSIM | top | mid | bottom | result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| welcome | 01-splash.png | 8.70 | 0.765 | 14.3/0.64 | 3.6/0.87 | 8.2/0.79 | PASS |
| consent | 12-consent.png | 7.82 | 0.816 | 7.9/0.83 | 0.0/1.00 | 15.6/0.61 | PASS |
| try | 36-try-logging.png | 9.15 | 0.810 | 20.6/0.70 | 4.8/0.76 | 2.0/0.97 | PASS |
| heard | 35-tracking-demo.png | 25.02 | 0.597 | 31.5/0.57 | 33.2/0.42 | 10.3/0.80 | REVIEW |
| goals | 14-goals.png | 30.67 | 0.245 | 37.4/0.35 | 37.3/0.00 | 17.3/0.38 | REVIEW |
| goals-demo | 14-more-goals--selected.png | 31.36 | 0.247 | 35.6/0.35 | 38.1/0.01 | 20.4/0.38 | REVIEW |
| conditions | 17-conditions.png | 16.65 | 0.518 | 25.4/0.53 | 14.4/0.39 | 10.1/0.63 | REVIEW |
| conditions-demo | 17-more-conditions--selected.png | 14.97 | 0.590 | 25.4/0.53 | 11.6/0.51 | 7.9/0.72 | REVIEW |
| symptoms | 20-symptoms.png | 16.68 | 0.520 | 26.3/0.51 | 13.8/0.39 | 9.9/0.66 | REVIEW |
| symptoms-demo | 20-more-symptoms--selected.png | 18.69 | 0.473 | 26.3/0.51 | 18.1/0.28 | 11.6/0.62 | REVIEW |
| meds | 19-meds.png | 15.39 | 0.563 | 25.1/0.52 | 14.0/0.39 | 7.1/0.78 | REVIEW |
| meds-demo | 19-more-meds--selected.png | 14.41 | 0.535 | 16.0/0.59 | 17.9/0.30 | 9.3/0.71 | REVIEW |
| appointment | 28-appointment.png | 22.74 | 0.610 | 23.5/0.60 | 7.6/0.62 | 37.1/0.61 | REVIEW |
| conditions-skipped | 17-conditions.png | 27.06 | 0.451 | 25.4/0.53 | 14.4/0.39 | 41.4/0.43 | REVIEW |
| appointment-empty | 28-appointment.png | 11.52 | 0.708 | 23.5/0.60 | 7.0/0.62 | 4.0/0.90 | REVIEW |
| meds-skipped | 19-meds.png | 15.39 | 0.563 | 25.1/0.52 | 14.0/0.39 | 7.1/0.78 | REVIEW |
| energy | 37-energy-slider.png | 11.06 | 0.782 | 23.0/0.64 | 3.2/0.90 | 6.9/0.81 | PASS |
| energy-empty | 37-energy-slider.png | 9.86 | 0.819 | 23.0/0.64 | 2.8/0.90 | 3.8/0.92 | PASS |
| support | 46-reply-support.png | 51.51 | 0.434 | 100.3/0.29 | 37.7/0.34 | 16.5/0.67 | REVIEW |
| support-empty | 45-support-circle.png | 13.24 | 0.676 | 24.8/0.58 | 10.1/0.54 | 4.8/0.91 | REVIEW |
| about | 21-more-name--typed.png | 39.11 | 0.413 | 23.6/0.52 | 42.2/0.48 | 51.6/0.23 | REVIEW |
| about-empty | 21-name.png | 25.71 | 0.462 | 14.4/0.57 | 11.1/0.59 | 51.6/0.23 | REVIEW |
| health | 42-wearables.png | 26.07 | 0.542 | 28.4/0.49 | 36.4/0.42 | 13.5/0.72 | REVIEW |
| building | 54-analyzing.png | 46.89 | 0.528 | 40.5/0.52 | 51.3/0.48 | 48.9/0.58 | REVIEW |
| building-skipped | 54-analyzing.png | 45.97 | 0.552 | 41.9/0.50 | 50.7/0.51 | 45.3/0.65 | REVIEW |
| snapshot | 55-journey-ready.png | 23.09 | 0.563 | 33.8/0.58 | 24.2/0.28 | 11.4/0.83 | REVIEW |
| snapshot-skipped | 55-journey-ready.png | 37.98 | 0.590 | 41.4/0.52 | 61.2/0.35 | 11.2/0.91 | REVIEW |
| report | 09-story-report.png | 45.93 | 0.385 | 68.6/0.34 | 44.2/0.34 | 25.0/0.47 | REVIEW |
| save | 01b-auth.png | 20.08 | 0.570 | 25.5/0.58 | 25.0/0.44 | 9.7/0.68 | REVIEW |
| how | 60-pw-trial.png | 17.34 | 0.585 | 13.5/0.66 | 23.6/0.44 | 14.9/0.65 | REVIEW |
| plans | 62-pw-price.png | 37.07 | 0.422 | 10.1/0.65 | 28.2/0.27 | 72.8/0.34 | REVIEW |
| sponsor | 62b-sponsor-sheet.png | 33.78 | 0.484 | 44.4/0.56 | 44.1/0.34 | 12.8/0.56 | REVIEW |
| notify | 61-bell.png | 40.97 | 0.544 | 27.3/0.42 | 14.6/0.78 | 81.1/0.44 | REVIEW |
| done | 64-subscribe-success.png | 30.84 | 0.603 | 32.1/0.60 | 32.9/0.56 | 27.5/0.65 | REVIEW |
| chat | next-first-chat.png | 24.73 | 0.560 | 50.3/0.47 | 16.5/0.46 | 7.3/0.76 | REVIEW |
| report-skipped | 09-story-report.png | 48.08 | 0.441 | 79.8/0.31 | 44.4/0.36 | 20.0/0.66 | REVIEW |
| plans-skipped | 62-pw-price.png | 43.88 | 0.370 | 26.4/0.54 | 32.0/0.23 | 73.3/0.34 | REVIEW |
| notify-free | 63-bell-after-plans.png | 39.63 | 0.593 | 24.9/0.51 | 13.0/0.84 | 81.1/0.44 | REVIEW |
| done-free | 64-more-subscribe-success--free-plan.png | 26.78 | 0.634 | 21.8/0.69 | 31.8/0.55 | 26.7/0.66 | REVIEW |
| chat-skipped | next-first-chat.png | 22.57 | 0.638 | 49.5/0.50 | 12.6/0.60 | 5.6/0.82 | REVIEW |
| debug | 01-splash.png | 51.76 | 0.449 | 74.8/0.32 | 45.5/0.57 | 35.0/0.46 | REVIEW |
