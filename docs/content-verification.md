# Walima content verification

The invitation is exclusively for **Daawat-e-Walima**.

| Detail | Approved content |
| --- | --- |
| Couple | Fahad Masood & Rahnuma Zarrin |
| Hosts | Mr. & Mrs. Masood Alam |
| Groom’s father | Mr. Masood Alam |
| Bride’s mother | Mrs. Shamshad Begum |
| Date | Sunday, 15 November 2026 |
| Start | 6:00 PM IST onwards |
| Venue | Regal Palace, Asopur, Tanda, Ambedkar Nagar, Uttar Pradesh, India |
| Directions | https://maps.app.goo.gl/p95MyD74HWYwa48u8 |

The RSVP names, in the supplied order, are **Afroz Alam · Anwar Alam · Masood Alam · Shahzad Alam · Shahnawaz Alam · Mohd Monis · Shahmeer Alam**. No contact numbers, contact links, or additional contacts were supplied.

## Religious text

Opening: **بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ** — “In the Name of Allah, the Most Gracious, the Most Merciful.”

- **Surah Ar-Rum (30:21)**: **وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً** — “And He placed between you affection and mercy.” This is an excerpt, so the English attribution must say **“An excerpt from the translation of Surah Ar-Rum (30:21)”**. Reference: https://quran.com/30/21.
- **Surah An-Naba (78:8)**: **وَخَلَقْنَاكُمْ أَزْوَاجًا** — “And We created you in pairs.” Attribute the English to **“Translation of Surah An-Naba (78:8)”**. Reference: https://quran.com/78/8.

The invitation’s gratitude, welcome, closing, and blessing prose must remain distinct from Quranic quotations. These are standard Arabic passages and English renderings; live source retrieval was unavailable because the environment’s network proxy returned HTTP 403 for the reference sites.

## Calendar verification

`public/walima.ics` is a UTF-8 RFC 5545 calendar with CRLF line endings, escaped text fields, and physical lines no longer than 75 octets. Its explicit `Asia/Kolkata` timezone uses the fixed `+0530` offset. The event starts at `20261115T180000` in that timezone, equivalent to **15 November 2026 at 12:30 UTC**. Python’s `datetime` and `zoneinfo` confirm the date is a Sunday.

The event has no `DTEND` or `DURATION` because only the start time was supplied. Calendar applications may display a default duration; the file does not specify one. The summary contains the occasion and both full names, and the description contains the hosts and directions. No organizer email or attendee addresses are invented.

Serve the file as `text/calendar; charset=utf-8` and offer it through the visible **Add to Calendar** download link. It is fully functional without JavaScript.
