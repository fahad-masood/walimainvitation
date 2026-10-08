# Invitation visual identity

This self-contained identity combines an ivory stationery canvas, emerald typography, antique-gold linework, powder-blue botanicals, and a restrained architectural arch. Preserve the tokens, typefaces, ornaments, component proportions, and section sequence when creating another invitation for the same couple. The companion implementation is not present in this repository, so visual parity cannot yet be verified.

## Exact palette

`src/styles/theme.css` owns these portable tokens:

| Token | Color | Purpose |
| --- | --- | --- |
| `--ivory` | `#F7F4EC` | Dominant canvas |
| `--emerald` | `#183B36` | Names, body contrast, verse panel, primary action |
| `--gold` | `#B4965D` | Architectural outlines, ornaments, separators |
| `--powder` | `#E6EFF1` | Botanical accents and venue panel |
| `--white` | `#FFFCF7` | Closing panel and light details |
| `--ink` | `#272C2A` | Dark ink option |

Muted text and translucent divider colors derive from this restrained palette. `--gold-text` blends 55% antique gold with emerald to keep gold-toned words readable; decorative lines retain the exact antique-gold token. Avoid bright gold, saturated accents, strong gradients, shadows, and decorative effects that obscure typography.

## Typography and spacing

- **Cormorant Garamond:** 400/500 normal and 400 italic; large centered names, editorial headings, graceful italic accents. CSS family alias: `Cormorant`.
- **Inter:** 400/500 normal; dates, small letter-spaced labels, addresses, and controls.
- **Amiri:** 400 normal; Arabic religious text. Use `lang="ar"` and `dir="rtl"` with generous line height so vowel marks remain visible.

All font files live in `src/assets/fonts/` and use `font-display: swap` with immediate fallbacks. Preserve the notices in `docs/font-licenses/`. The supplied Arabic subset covers the three documented passages; additional text needs a regenerated subset.

The page caps ordinary wide sections at 1,120px. Section spacing is 100px on wide screens and 68px below 600px. Names scale fluidly; 320px layouts receive a separate compact treatment. Controls have at least 52px height and visible keyboard focus.

## Components and composition

Copy `theme.css`, `invitation.css`, the font files and notices, `Arch.astro`, `Divider.astro`, `Icon.astro`, and `public/art/` together. Keep their paths or update imports consistently. Replace supplied event content through the data module and page text, while preserving the shared composition:

1. Quiet monogram masthead and event date.
2. Immediate invitation hero framed by a thin three-line architectural arch and mirrored ivory/powder botanical sprays.
3. Centered formal invitation and family names with generous spacing.
4. Emerald Quran quotation panel with antique-gold corner rules.
5. An editorial date panel alongside time and venue details.
6. Powder-blue venue panel with original architectural linework and a restrained directions action.
7. Formal, centered RSVP names and an ornamental divider.
8. Soft-white closing panel with a Quran passage, dua, family signature, and monogram.

`Arch` draws decorative SVG linework. `Divider` supplies the thin ornamental separator. `Icon` provides consistent, lightweight strokes for arrow, location, calendar, and downward navigation. Ornaments are hidden from assistive technology; important information remains real HTML text.

The RSVP layout preserves the supplied name order: balanced wrapping on desktop, two columns on mobile, and a centered final name. Names are text, never fabricated contact buttons.

## Motion, accessibility, and assets

All content renders immediately without hydration, loading gates, or reveal-dependent visibility. Motion is limited to subtle CSS botanical opacity and action transitions. `prefers-reduced-motion` disables animation and smooth scrolling. Preserve the skip link, headings, readable Arabic, focus outlines, touch targets, and responsive layout.

Artwork is local SVG; the social preview is a static 1,200 × 630 PNG with the same colors, floral details, and architectural frame. The page uses no remote font requests, map iframe, or client scripts. Keep third-party connections behind guest-initiated direction links.

## Hosting contract

Serve HTML with revalidation (`Cache-Control: no-cache`), hashed `/_astro/` assets with a one-year immutable cache, and unversioned public artwork with shorter caches. The supplied host configurations forbid client scripts and require local CSS/fonts/images through Content Security Policy. Keep styles external and avoid adding inline style attributes, scripts, or remote assets without deliberately updating and testing those headers.
