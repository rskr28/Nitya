# NITYA visual asset reference

Runtime image paths are maintained in `src/config/assets.ts`. Assets are served locally by the application.

## Brand artwork

| File | Dimensions | Use | Origin / treatment |
|---|---:|---|---|
| `brand/nitya-logo-master.png` | 640 × 640 | Untouched source of truth | Original logo supplied by the product owner. Preserve byte-for-byte. |
| `brand/nitya-logo-lockup.webp` | 320 × 224 | Complete desktop sidebar masthead | Transparent RGBA WebP derived faithfully from the master. Only the flat white paper background and outer whitespace are removed; lotus, wordmark, original proportions and tagline remain together. Displayed at a maximum width of 188px in the 244px ivory rail. |
| `brand/nitya-symbol.png` | 245 × 203 | Compact tablet/mobile emblem | Faithful crop of the gold lotus from the master; no redraw or recolouring. |
| `brand/favicon.png` | 64 × 53 | Browser favicon | Crop derived from the original lotus emblem. |

## Responsive brand placement

- Desktop: complete transparent lockup centred directly on the ivory sidebar surface, maximum artwork width 188px within a 168px masthead zone. Keep the logo at its natural aspect ratio with generous top, bottom and side breathing room. The anchor has no card, shadow, border, opaque tile or decorative frame; the first navigation item follows after a deliberate whitespace gap.
- Tablet widths where the sidebar becomes icon-only: use the faithful transparent emblem crop.
- Mobile: use the faithful emblem in the light topbar, optically aligned with the header actions.
- Desktop top header: restrained text descriptor “Ancient Wisdom. Modern Living.” only.
- Never recolour, retype, rearrange, stretch or regenerate the supplied logo. The master remains untouched.

## Landscape and learning artwork

| File | Dimensions | Use | Origin |
|---|---:|---|---|
| `landscapes/morning.webp` | 1440 × 810 | Home, 05:00–11:59 | Original NITYA-generated landscape photograph. |
| `landscapes/afternoon.webp` | 1440 × 810 | Home, 12:00–16:59 | Original NITYA-generated landscape photograph. |
| `landscapes/evening.webp` | 1440 × 810 | Home, 17:00–20:59 | Original NITYA-generated landscape photograph. |
| `landscapes/night.webp` | 1440 × 810 | Home, 21:00–04:59 | Original NITYA-generated landscape photograph. |
| `lessons/wisdom-lotus.webp` | 960 × 540 | Wisdom Card feature image | Original NITYA-generated lotus photograph. |

## Lotus growth stages

All stage photographs are separate NITYA-generated 320 × 320 WebP assets so that each stage can be replaced independently.

| File | Dimensions | Stage |
|---|---:|---|
| `lotus/seed.webp` | 320 × 320 | Seed |
| `lotus/sprout.webp` | 320 × 320 | Sprout |
| `lotus/early-bloom.webp` | 320 × 320 | Early Bloom |
| `lotus/full-bloom.webp` | 320 × 320 | Full Bloom |
| `lotus/radiant-bloom.webp` | 320 × 320 | Radiant Bloom |

Greeting labels are rendered as React text, not embedded in photographs. Lotus movement is CSS-driven and respects `prefers-reduced-motion`. The achievement transition is tied to a persisted, one-time milestone event.
