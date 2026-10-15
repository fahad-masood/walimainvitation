# Invitation visual identity

The Walima now uses the same self-contained maroon-and-green identity as the companion invitation. Its existing event data, name order, host wording, RSVP list, religious passages, directions, calendar, and other invitation copy remain unchanged.

## Palette and typography

`src/styles/tokens.css` is copied from the companion design. The sage paper is `#edf1e8`, burgundy is `#4f181d`, forest green is `#183e34`, sage is `#b8c8ad`, and architectural linework uses `#b28f97`. All visible colors belong to the maroon or green families. Burgundy panels reuse the same local reference-matched velvet texture.

Great Vibes renders the couple’s, host’s, and parents’ names. Cormorant Garamond supplies headings, calendar numerals, and editorial details. Inter supplies controls and labels. All are self-hosted with immediate fallbacks and `font-display: swap`. The existing Amiri Arabic subset is retained because it includes all three existing religious passages; the companion opening-only subset is unsuitable for this page. Font notices live in `docs/font-licenses/` and `public/fonts/`.

## Components and composition

The Mughal doors, arch, rosette separators, four small textured rose clusters, rear-view couple illustration, velvet panels, and closing botanicals match the companion assets. The four hero flowers share one 48 KB transparent WebP. The same November calendar marks this event’s supplied date, the 15th, with a heart that gently blinks each second. Its selected date is derived from the unchanged event data.

The Walima’s original sequence remains: masthead, hero, formal invitation and families, Quran excerpt, celebration details, venue, all seven RSVP names, and the closing passage and family signature. The existing date panel remains alongside the new calendar. Existing directions and calendar links retain their original destinations and filenames. No sharing action is added.

## Interaction and hosting

The door tap opens the invitation and starts the same local recording. Playback can be paused, the audio does not preload, reduced motion skips the animation, and native disclosure opens the invitation without JavaScript. Essential invitation content is static HTML. The music control becomes a compact icon on short phone screens to keep the initial date visible.

Content Security Policy permits local fonts, images, audio, and external local scripts; inline scripts and third-party render resources remain blocked. The hosting files retain the original calendar response headers and add weekly caching for the new fonts and artwork.

Regenerate the matching 1200 × 630 preview with `node scripts/generate-preview.mjs`. Its existing event wording, names, date, and venue remain intact while the artwork, palette, and name typography match the new identity.
