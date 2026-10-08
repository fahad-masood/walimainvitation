# Self-hosted typefaces

These fonts are redistributed under the SIL Open Font License 1.1. The complete, unmodified license and copyright notices for each family are included beside this file.

| Typeface | Author | Source package | Included variants |
| --- | --- | --- | --- |
| Cormorant Garamond | The Cormorant Project Authors | `@fontsource/cormorant-garamond@5.3.0` | Latin 400 normal, 500 normal, 400 italic |
| Inter | The Inter Project Authors | `@fontsource/inter@5.3.0` | Latin 400 normal, 500 normal |
| Amiri | The Amiri Project Authors | `@fontsource/amiri@5.3.0` | Arabic 400 normal |

The WOFF2 files in `src/assets/fonts` are served locally so the invitation makes no requests to an external font service. Downloaded package archives were checked against their npm registry SHA-512 integrity values before copying the assets.

The original language subsets were further optimized using FontTools 4.66.1 and Brotli 1.2.0. Latin subsets retain printable ASCII and the supplied invitation's typographic punctuation, including curly quotes, em and en dashes, and the middle dot. Amiri retains these exact Arabic passages:

- بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
- وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً
- وَخَلَقْنَاكُمْ أَزْوَاجًا

All shaping features and scripts were retained during subsetting, with glyph closure, `GDEF`, `GSUB`, and `GPOS` tables preserved. HarfBuzz comparisons against the original files confirmed identical rendered outlines, ligatures, diacritics, advances, and positioning for all three Arabic passages and representative invitation text. The original font name, copyright, and license metadata are retained.

| File | Bytes |
| --- | ---: |
| `cormorant-latin-400-normal.woff2` | 13,752 |
| `cormorant-latin-500-normal.woff2` | 14,012 |
| `cormorant-latin-400-italic.woff2` | 14,364 |
| `inter-latin-400-normal.woff2` | 13,592 |
| `inter-latin-500-normal.woff2` | 14,140 |
| `amiri-arabic-400-normal.woff2` | 30,772 |
| **Total** | **100,632** |

If Arabic wording changes, generate a new subset from the original package with the complete updated text before deployment; do not assume an additional passage is covered. Latin fonts contain English invitation text and common punctuation, rather than a full multilingual character set.

Original projects:

- Cormorant Garamond: https://github.com/CatharsisFonts/Cormorant
- Inter: https://github.com/rsms/inter
- Amiri: https://github.com/aliftype/amiri

Arabic coverage includes all letters, vowel marks, shadda, and superscript alef needed by the three passages above. For production CSS, use `font-display: swap` and a serif fallback; keep Arabic text in elements with `lang="ar"` and `dir="rtl"`.
