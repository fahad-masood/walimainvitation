# Validation record

The matching design update was checked with Node.js 24, Astro 7.3.8, and Chromium.

## Production and content checks

- `npm ci`, static production build, and all eight Node tests pass without skipped tests.
- A baseline captured before the update records the text of every original invitation section and the existing social metadata. Browser checks compare those sections exactly, including the host wording, name order, both Quran excerpts and attributions, and all seven RSVP names in order.
- SHA-256 comparisons verify that `src/data/invitation.ts`, `public/walima.ics`, and the shipped calendar retain their original bytes. The event remains Sunday, 15 November 2026, 6:00 PM IST onwards, at Regal Palace, Asopur, Tanda, Ambedkar Nagar, Uttar Pradesh, India.
- The existing calendar uses Asia/Kolkata and has no invented end time. Directions and calendar links retain their original destinations and work without JavaScript.
- The new social PNG is 1200 × 630 and retains the original preview wording, event date, names, and venue.

## Browser checks

Chromium checks cover 320×568, 360×740, 375×812, 390×844, 430×932, 768×1024, and 1440×1000. No horizontal overflow, console errors, or third-party requests occurred. The couple’s names and date fit the first invitation viewport after the door opens. The four rose clusters and couple illustration decode successfully.

With the production Content Security Policy injected, the door starts closed, the recording remains paused without an audio download, and the opening tap reveals the invitation and starts playback. Pause works. Reduced motion skips the door transition and heart animation; ordinary motion blinks the heart on 15 November each second. Native disclosure, directions, and the calendar download remain functional with JavaScript disabled.

Mobile and desktop screenshots were inspected for the hero, family invitation, date/calendar section, closing passage, and social preview. The existing Amiri subset is retained for all three Arabic passages. Short phone screens use a compact music control positioned clear of the hero date.

## Performance scope

All artwork, fonts, audio, styles, and scripts are local. The decorative rose clusters reuse one 48 KB image, content needs no hydration, and the audio does not download before opening. No backend, map iframe, third-party fonts, video, or sharing SDK is introduced. The earlier Lighthouse record described the previous design; no new Lighthouse score is claimed for this update. Hosting and the actual WhatsApp preview should be checked after deployment.
