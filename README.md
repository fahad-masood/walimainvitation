# Daawat-e-Walima · Fahad & Rahnuma

A static, mobile-first invitation for Sunday, 15 November 2026 at 6:00 PM IST onwards, hosted by Mr. & Mrs. Masood Alam at Regal Palace, Asopur, Tanda. Built with Astro 7.3.8, self-hosted fonts, local SVG artwork, and no client JavaScript.

## Develop and verify

Use Node.js 22.12 or newer; Node.js 24 is recommended. From the existing checkout:

```sh
npm ci
npm run dev
```

Development serves on port 4321. Build and validate the production output before publishing:

```sh
npm run build
npm test
npm run preview
```

In a restricted cloud shell where the home configuration directory is unavailable, prefix Astro commands with `ASTRO_TELEMETRY_DISABLED=1` and use `npm ci --cache /tmp/walima-npm-cache`. These overrides are not needed on ordinary developer machines.

`npm test` checks the generated `dist/` output, so run it after a build. `npm run preview` serves that output locally on port 4321. The deployable site is the `dist/` directory; no server, database, secret, or external font service is required.

## Deploy

Set **`SITE_URL` to the actual public HTTPS origin** in your hosting project's build environment before building, then publish `dist/`. This produces absolute canonical, Open Graph, and social image URLs. No public site URL has been assumed. Netlify's `URL` or Vercel's `VERCEL_PROJECT_PRODUCTION_URL` also supplies the origin automatically; explicit `SITE_URL` takes precedence.

- **Netlify:** import this repository. `netlify.toml` sets `npm run build`, `dist`, and Node.js 24. The build copies `public/_headers` into the output to configure security, caching, and calendar downloads.
- **Vercel:** import this repository and use Node.js 24. `vercel.json` declares the build/output settings and response headers. Set `SITE_URL` for a custom domain, then redeploy.
- **Other static hosts:** run the same production commands, upload `dist/`, and apply the equivalent headers from `public/_headers`. Serve `.ics` as `text/calendar; charset=utf-8`.

After deployment, confirm the actual page and `/og-preview.png` respond successfully, metadata uses the intended origin, **Get Directions** opens the supplied Maps destination, and **Add to Calendar** downloads the event. The calendar starts at 18:00 in `Asia/Kolkata` (12:30 UTC) and leaves the unspecified end time unset. Both actions work with JavaScript disabled. There is no invitation-sharing control.

The invitation requests that search engines do not index or archive it. This is a polite indexing directive, **not authentication**: anyone possessing the URL can access the invitation. Share the URL with invited guests accordingly.

## Content and visual identity

- Event data and all seven official RSVP names: `src/data/invitation.ts`.
- Page composition and metadata: `src/pages/index.astro`.
- Portable colors, fonts, spacing, and controls: `src/styles/theme.css`.
- Invitation layout and responsive styling: `src/styles/invitation.css`.
- Reusable architecture and ornaments: `src/components/` and `public/art/`.
- Calendar: `public/walima.ics`; social image: `public/og-preview.png`.

[Design system](docs/design-system.md) documents the shared identity for a separately developed companion invitation. No companion implementation is present to compare; reuse the documented assets and components unchanged to preserve the identity. [Content verification](docs/content-verification.md) records wording, Quran references, and calendar details. [Font licenses](docs/font-licenses/README.md) include redistribution notices and the exact Arabic font subset coverage.

[Validation results](docs/validation.md) record production tests, responsive browser checks, and the measured mobile performance profile.

Keep event data, the static calendar, and social preview synchronized when changing supplied details. If Arabic wording changes, regenerate the font subset with the complete new text as documented in the font notes.

To regenerate the preview, run `node scripts/generate-preview.mjs` with Chromium installed (`CHROMIUM_BIN` can specify its executable). The generator uses Node's built-in browser protocol support and the same local fonts/artwork; no extra npm package is needed.
