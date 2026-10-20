---
name: Obsidian Aura
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#9a9b9b'
  on-tertiary-container: '#313333'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: '0'
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies a dark-mode-first aesthetic calibrated for high-precision digital products, developer tools, financial dashboards, and modern productivity suites. It projects quiet confidence, executive polish, and technological refinement. 

The visual style blends **Neo-Minimalism** with tactile **Atmospheric Layering**. Instead of stark pure blacks or unmodulated greys, surfaces rely on subtle luminance shifts (`#0d0d0e` base canvassing layered against `#161619` and `#1f1f23` containers). Visual sharpness is reinforced through whisper-quiet boundary strokes (`rgba(255, 255, 255, 0.08)`), generous perimeter rounding, and a deliberate, high-energy warm orange accent that commands visual attention without inducing fatigue. Secondary functional micro-signals use pure white and saturated emerald green to indicate real-time status and active interaction states.

## Colors

The color architecture is built around deep monochromatic values punctuated by high-chroma functional accents.

- **Canvas & Background (`#0d0d0e`)**: Deep obsidian dark, calibrated to prevent eye fatigue while preserving absolute contrast for foreground elements.
- **Surface Elevation 1 (`#141416`)**: First level of card stratification.
- **Surface Elevation 2 (`#1b1b1f`)**: Floating controls, inner modules, list rows, and sub-panels.
- **Surface Elevation 3 / Hover (`#24242a`)**: Interactive hover states and active control backings.
- **Primary Accent (`#f97316` / `#fb923c`)**: Warm solar orange used strategically for primary call-to-actions, active progress nodes, selected tabs, and key interactive focal points.
- **Secondary Accent (`#10b981`)**: Vivid emerald green reserved for confirmation badges, verified states, and positive telemetry.
- **Tertiary Accent (`#ffffff`)**: High-contrast white for high-importance highlights, modal primary trigger states, and focused indicator dots.
- **Outlines & Dividers**: `rgba(255, 255, 255, 0.08)` for container borders, scaling up to `rgba(255, 255, 255, 0.16)` on active or focused states.
- **Text Layers**: Primary text (`#f4f4f5`), Muted/Secondary text (`#a1a1aa`), and Tertiary text (`#71717a`).

## Typography

The type scale combines **Plus Jakarta Sans** for prominent headers with **Geist** for precise data, narrative body copy, and UI controls. 

- **Display & Headlines (Plus Jakarta Sans)**: Crafted with geometric curvature, negative tracking, and medium-to-bold weights to convey contemporary craft and structural balance.
- **Body & Labels (Geist)**: Designed for screens with extreme legibility at small sizes in dark-mode environments. Slight letter spacing adjustments and precise line-height pairings prevent optical vibration against dark surfaces.
- **Monospace Numerical Support**: Geist’s tabular numerals must be enabled via `font-variant-numeric: tabular-nums` across timestamps, metrics, prices, and tracking data.

## Layout & Spacing

The layout model is governed by an adaptive 12-column grid container flanked by structured margins.

- **Desktop (>= 1024px)**: 12-column grid with `2rem` gutters and minimum `3rem` canvas margins. Floating modular utility cards have a standard width between 440px (compact notifications / action dialogs) and 920px (multi-pane scheduling and analytics widgets).
- **Tablet (768px - 1023px)**: 8-column layout with `1.25rem` gutters. Panels reflow from three columns into two columns or full-width stacked views.
- **Mobile (< 768px)**: 4-column layout with fluid 100% width, dynamic safe area padding, and `1rem` outer margins. Modals convert into bottom sheets pinned with rounded top edges.

Internal component rhythm follows a strict 4px/8px modular scale. Spacers (`space-sm`, `space-md`, `space-lg`) are applied to maintain an airy, uncluttered breathing room inside dense dark cards.

## Elevation & Depth

Depth is established primarily through **Tonal Layering** and **Subtle Boundary Strokes**, eschewing heavy drop shadows that introduce visual mud in dark interfaces.

- **Level 0 (App Canvas)**: Ground layer `#0d0d0e`.
- **Level 1 (Structural Cards)**: Background `#141416`, bounded by an ultra-thin border `1px solid rgba(255, 255, 255, 0.08)`. Subtle ambient shadow: `0 12px 32px -8px rgba(0, 0, 0, 0.65)`.
- **Level 2 (Interactive Floating Surfaces / Overlays)**: Background `#1b1b1f`, boundary stroke `1px solid rgba(255, 255, 255, 0.12)`, shadow `0 20px 48px -12px rgba(0, 0, 0, 0.85)`.
- **Level 3 (Popovers, Flyouts & Tooltips)**: Background `#24242a`, border `1px solid rgba(255, 255, 255, 0.16)`.
- **Inner Rim Highlighting**: Selected items, primary buttons, and floating indicator badges utilize a subtle inner top highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.15)`) to mimic precision-machined beveling.

## Shapes

The design system embraces generous, organic contours that soften dense technical layouts:

- **Primary Cards & Modals**: `rounded-2xl` (1.25rem to 1.5rem / 20px - 24px) delivering a smooth container aesthetic as seen in modern native device cards.
- **Controls & Time Slots**: `rounded-xl` (0.75rem / 12px) for calendar day buttons, schedule slots, and notification rows.
- **Pills & Badges**: Fully pill-shaped (`9999px`) for category pills, notification counters, and filter chips.
- **Action Icons**: Squircles and rounded circles (`rounded-full`) for notification bells, user avatars, and status icons.

## Components

### Buttons
- **Primary (Solar Accent)**: Background `#f97316`, text `#ffffff` or `#0d0d0e`, font-weight 600, border radius `rounded-xl` (or `rounded-full` for compact triggers). Hover states transition to `#ea580c` with subtle brightness increase.
- **Secondary / High-Contrast White**: Solid `#ffffff` background with `#0d0d0e` text for confirming major decisions.
- **Ghost / Outline**: Surface `#1b1b1f` with border `1px solid rgba(255, 255, 255, 0.1)`, text `#f4f4f5`. Hover triggers background `#24242a`.

### Cards & Dialog Panels
- Built with `#141416` or `#18181b` surface fills, bounded by `1px solid rgba(255, 255, 255, 0.08)`.
- Dividers between sections use border top/bottom with `rgba(255, 255, 255, 0.06)`.
- Padding conforms strictly to `space-lg` (20px) or `space-xl` (32px).

### Chips & Navigation Tabs
- Grouped tab bars rest inside an elevated pill container (`#141416`).
- Active tabs feature a contrast pill surface (`#1f1f23` or `#ffffff` with dark text) or an orange active bar (`2px` height) underneath the label.
- Counter badges display with solid white or emerald indicators, with counts in bold tabular font.

### Lists & Notifications
- List items feature hover reveals: background transitions to `#1c1c20`, presenting contextual actions (e.g., mark as read, delete).
- Status icons (e.g., payment verified, video call, alert) are nested inside rounded squares (`36px × 36px`) with low-saturation colored backdrops (emerald tint `#064e3b` at 20% opacity for success, rose `#4c0519` for overdue items).
- Unread status is signaled by a pure white or warm orange `6px` dot on the right margin.

### Calendar & Scheduling Elements
- Day tiles: Rounded circles (`40px × 40px`). Current selected date features solid white backing with pure black text or high-energy orange highlight. Dot indicators below dates denote active booking slots.
- Time Slot Selectors: Wide horizontal pills (`#18181b` with border `1px solid rgba(255, 255, 255, 0.08)`), expanding inline with a confirmed primary trigger button upon selection.

### Progress & Stepper Trackers
- Node trackers display joined segments using `2px` paths. Completed and current nodes are marked with distinct filled rings (`#ffffff` or `#f97316`) enclosing iconography, while upcoming nodes maintain muted grey states (`#27272a`).