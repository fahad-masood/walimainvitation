# Validation record

Validated on 9 October 2026 with Node.js 24.19.0, Astro 7.3.8, Chromium 151, and Lighthouse 13.5.0.

## Production checks

- Clean, repeatable `npm ci`, static production build, and all seven Node tests passed. There are no skipped tests.
- Tests exercise the generated HTML/assets, approved event and family details, all seven ordered RSVP names, native guest actions, Arabic passages and attributions, social image dimensions, and calendar encoding/timezone.
- The calendar downloads with JavaScript disabled. It begins Sunday, 15 November 2026 at 18:00 Asia/Kolkata (12:30 UTC), without an invented end time.
- Browser resource inspection found no third-party requests. There is no client JavaScript, hydration, map iframe, or invitation-sharing control.
- The host headers were exercised through a local static server: strict CSP caused no console errors, fonts and CSS loaded, the keyboard skip link worked, and the calendar returned `text/calendar` with an attachment disposition.
- A build with a test-origin fixture produced correct absolute canonical and social image URLs. The final build was restored without that fixture; supply the real `SITE_URL` at deployment.
- npm's dependency audit reported zero known vulnerabilities at validation time.

## Layout checks

Real Chromium renders were inspected at 320, 360, 375, 390, 430, 768, and 1440 pixels. No horizontal overflow or console errors occurred. Names and the date were visible in the initial viewport on the tested phones (320×568, 360×640, 375×667, 390×844, and 430×932). The RSVP names fit individually without wrapping inside the mobile two-column arrangement. Important content and links remained available with JavaScript disabled and with font downloads blocked.

The static social PNG was visually inspected and is exactly 1200×630. Arabic shaping was compared against the source fonts after subsetting; ligatures, diacritics, outlines, and positioning matched.

## Mobile performance

The production preview scored **100 Performance / 100 Accessibility / 100 Best Practices** on the standard simulated mobile Lighthouse profile (4× CPU slowdown and mobile network throttling).

| Metric | Result |
| --- | --- |
| First Contentful Paint | 1.4 s |
| Largest Contentful Paint | 1.7 s |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 0 ms |

These are local production-build measurements. Actual hosting, device, connection, and social-crawler behavior should be checked after deployment. The separate companion implementation is not in this checkout; use the documented portable design system to reproduce this identity there.
