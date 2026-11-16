# NITYA visual asset reference

Runtime asset paths are maintained in `src/config/assets.ts`. These files are local to the application; no remote image host is required.

## Brand artwork

| File | Dimensions | Use | Origin / treatment |
|---|---:|---|---|
| `brand/nitya-logo-master.png` | 640 × 640 | Untouched source of truth | Original logo supplied by the product owner. Preserve byte-for-byte. |
| `brand/nitya-logo-lockup.webp` | 440 × 308 | Full logo in the desktop ivory sidebar | Faithful crop of the master. The white paper background was removed into alpha; gold lotus, NITYA wordmark, proportions and tagline remain in their original arrangement. Lossless WebP derivative. |
| `brand/nitya-symbol.png` | 245 × 203 | Compact tablet/mobile emblem | Faithful crop of the gold lotus from the master; no redraw or recolouring. |
| `brand/favicon.png` | 64 × 64 | Browser favicon | Crop derived from the original lotus emblem. |

## Brand placement rules

- Desktop (for example, 1440px and 1024px): use the complete transparent lockup in a generously sized brand area at the top of the ivory sidebar. Keep the full lotus, wordmark and tagline together.
- Compact tablet widths: use the faithful emblem crop when the sidebar becomes icon-only.
- Mobile (for example, 390px): use the faithful emblem in the light topbar. Do not squeeze the full lockup into a small header tile.
- The desktop top header carries only the restrained text descriptor “Ancient Wisdom. Modern Living.”; do not add a second miniature logo there.
- Never recolour, retype, rearrange or regenerate the master logo.

## Landscape and learning artwork

| File | Dimensions | Use | Origin |
|---|---:|---|---|
| `landscapes/morning.webp` | 1440 × 810 | Home, 05:00–11:59 | Original NITYA-generated landscape photograph. |
| `landscapes/afternoon.webp` | 1440 × 810 | Home, 12:00–16:59 | Original NITYA-generated landscape photograph. |
| `landscapes/evening.webp` | 1440 × 810 | Home, 17:00–20:59 | Original NITYA-generated landscape photograph. |
| `landscapes/night.webp` | 1440 × 810 | Home, 21:00–04:59 | Original NITYA-generated landscape photograph. |
| `lessons/wisdom-lotus.webp` | 960 × 540 | Wisdom Card feature image | Original NITYA-generated, text-free lotus photograph. No filename label, watermark, frame or caption is embedded. |

## Lotus growth stages

All stage photographs are NITYA-generated assets cropped to square 320 × 320 WebP files. The five files are intentionally separate so each stage can be replaced independently.

| File | Dimensions | Stage |
|---|---:|---|
| `lotus/seed.webp` | 320 × 320 | Seed |
| `lotus/sprout.webp` | 320 × 320 | Sprout |
| `lotus/early-bloom.webp` | 320 × 320 | Early Bloom |
| `lotus/full-bloom.webp` | 320 × 320 | Full Bloom |
| `lotus/radiant-bloom.webp` | 320 × 320 | Radiant Bloom |

The four greeting labels are live React text, never baked into landscape images. Lotus animation is CSS-driven and respects `prefers-reduced-motion`. Achievement motion is triggered only by the persisted, one-time milestone event.
