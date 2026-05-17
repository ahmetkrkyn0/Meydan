# Meydan — UI/UX Audit Report

**Audited:** 2026-05-17  
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md found)  
**Screenshots:** Not captured — no dev server detected at localhost:3000 or :5173. Audit is code-only.  
**Scope:** Landing page, fan dashboard, athlete profile, discovery (Keşfet), live matches (Canlı), messages (Mesajlar), AppShell

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Visual Hierarchy & Layout | 🟢 3/4 | Strong asymmetric grid and editorial section numbering; hero height on mobile has no explicit max-height cap |
| 2. Typography & Readability | 🟡 2/4 | 11 distinct font-size steps in active use; sub-11px text (`text-[10px]`, `text-[9px]`) appears in critical UI labels |
| 3. Color & Brand Consistency | 🟢 3/4 | Cohesive dark/light dual-theme; `Athletes.tsx` mixes dark-theme `foreground` tokens on a light landing page |
| 4. Interaction & Motion | ✅ 4/4 | Excellent framer-motion choreography with proper `reducedMotion` support; entry, hover, and counter animations all present |
| 5. Component Consistency | 🟡 2/4 | `chip`, `soft-card`, `btn-primary-light` are well-defined, but icon-only buttons lack `aria-label` in 6+ places; duplicate `* 2.tsx` files signal copy-paste drift |
| 6. Accessibility & Responsiveness | 🟡 2/4 | Focus rings missing on most interactive elements in app shell nav; fixed `h-[640px]` messages panel clips on short screens; hardcoded athlete avatar in AppShell |

**Overall: 16/24**

---

## Top 5 Priority Fixes

1. **Sub-11px unreadable label text** (`text-[10px]`, `text-[9px]`) — Used for scores, "LIVE" badge, eyebrows, and momentum labels across `canli/index.tsx` line 244, `dashboard.tsx` line 277, `AppShell.tsx` line 117. 10px is below WCAG-recommended minimum (12px) and will fail on non-retina screens. Raise all labels to minimum `text-[11px]` / `text-xs` (12px).

2. **Focus ring absent on sidebar nav links and mobile bottom nav** — `AppShell.tsx` lines 128–149 (sidebar `<Link>`) and lines 284–295 (mobile nav `<Link>`) have hover styles but zero `focus-visible:` utilities. Keyboard users cannot see active navigation position. Add `focus-visible:ring-2 focus-visible:ring-violet/40 focus-visible:outline-none` to every nav item.

3. **"Destek Ol" CTA navigates to `/dashboard` instead of a support/donation flow** (`sporcu/$slug/index.tsx` line 397–402). This is the primary conversion action for the platform. It currently routes users back to the dashboard — a dead-end. Wire to a `/sporcu/$slug/destek` route or open a support modal.

4. **Hardcoded `okculukImg` as user avatar in AppShell** (`AppShell.tsx` lines 192, 240) — Every user in every role sees the same archery woman photo instead of their own profile picture. This breaks perceived personalisation of the platform across all authenticated contexts.

5. **`mesajlar.tsx` fixed `h-[640px]` panel** (line 183) — On screens shorter than ~740px (common on small phones and landscape orientation), the chat layout clips and the input bar disappears below the fold. Replace with `min-h-0 flex-1` in a parent flexbox that respects viewport height, e.g., `h-[calc(100vh-theme(spacing.36))]`.

---

## Detailed Findings

### Pillar 1: Visual Hierarchy & Layout (3/4) 🟢

**Strengths**

- `dashboard.tsx` uses a strong asymmetric hero grid (`grid-cols-[1fr_45%]`, line 122) that immediately draws the eye to the athlete image while keeping copy scannable — a deliberate editorial choice that works well.
- Section numbering pattern (`01`, `02`, `03`… `font-mono text-[11px]`) creates a clear reading spine across dashboard, Keşfet, and Canlı pages. This is consistent and adds visual rhythm.
- `AppShell.tsx` properly uses `sticky top-0` for the topbar (line 206) and `fixed bottom-3` for mobile nav (line 280), establishing clear z-plane separation.

**Issues**

- `stage-bleed` utility (styles.css lines 311–326) attempts full-bleed layout using negative margins, but at `lg` breakpoint it calculates `calc(50% + 8rem - 50vw)` which only works when the content column is exactly 50vw wide. If the sidebar pushes the content column narrower, the calculation bleeds incorrectly into the sidebar. No unit tests or visual regression catches this.
- Hero section (`dashboard.tsx` line 120) uses `-mt-6 sm:-mt-8` to overlap the AppShell's `pt-6` padding, but on mobile the layout collapses to a two-column grid at full viewport width with no minimum column width on the image column. At 375px the image column (`45%`) is ~168px, which may leave the athlete photo too narrow to read.
- The `kesfet` page spotlight section (`kesfet/index.tsx` line 207) uses `-mt-14` negative margin overlap with no guard for smaller screens, risking a hero+spotlight visual pile-up on narrow viewports.

**Recommendation**

Add `min-h-[320px]` and `min-w-[120px]` guards on the image column in the two-column hero grid to prevent the photo from collapsing below a legible threshold on narrow screens.

---

### Pillar 2: Typography & Readability (2/4) 🟡

**Strengths**

- `font-display` (Sora) vs `font-sans` (Inter) is used purposefully: Sora for all headings and numeric displays, Inter for body. The distinction is consistent across every audited file.
- Line-height on hero headings uses `leading-[0.95]` for display text and `leading-relaxed` for body paragraphs — correct editorial contrast.

**Issues**

- **Scale explosion**: 11 distinct font-size steps are in active use (text-xs through text-8xl). Standard discipline is 4–6 for app UIs. The presence of `text-8xl` (1 occurrence), `text-7xl` (10), and `text-[9px]` (several) means no coherent type scale exists. Micro-labels at 9–10px and display text at 80px exist in the same view.
- **Sub-minimum text**: `text-[9px]` appears at `canli/index.tsx` lines 222 and 243 (score/momentum labels), and the "LIVE" badge on `canli/index.tsx` line 320 uses `text-[8px]`. At 96dpi this renders at 8–9 CSS pixels — below legible threshold on any screen, and a guaranteed WCAG 1.4.4 violation at normal zoom.
- `font-display` (Sora) is not loaded with the `800` weight that `font-extrabold` and `font-black` (each used once) would require — the Google Fonts URL in `__root.tsx` line 90 only loads `wght@500;600;700;800`. This is fine, but the one `font-extrabold` instance expects 800, and the `font-black` expects 900 which is missing. The 900-weight will fall back silently to 800 with no visible error.

**Recommendation**

Establish a formal 6-step type scale: 10px (labels only via `text-[10px]`), 11px, 12px (xs), 14px (sm), 16px (base), and display sizes for headings only. Remove `text-[8px]` and `text-[9px]` entirely — replace with `text-[10px]` minimum. Use `text-[10px]` as the floor, never below.

---

### Pillar 3: Color & Brand Consistency (3/4) 🟢

**Strengths**

- Dual-theme architecture is well-conceived: the dark landing palette (navy + electric blue + coral) is fully isolated in `:root` and the light app palette lives under `.app-surface`. Context-switch is clean.
- Semantic color tokens are correctly named and used. `--app-ink`, `--app-ink-soft`, `--app-ink-mute` provide a three-level text hierarchy that is applied consistently across all app routes.
- The `chip-violet`, `chip-sky`, `chip-coral`, `chip-emerald` variants (styles.css lines 411–414) provide consistent semantic tagging — violet for platform/brand, sky for geo/city, coral for live/trend, emerald for status.

**Issues**

- **`Athletes.tsx` dark-theme palette leak**: `Athletes.tsx` (landing page component) uses `text-foreground`, `text-muted-foreground`, `border-foreground/8`, and the gradient `from-[oklch(0.14_0.04_258)]` (lines 35, 46, 62, 78, 92, 93). These tokens resolve to the dark navy theme because `Athletes` sits on the dark landing page. But the card gradient `from-[oklch(0.14_0.04_258)]` is the near-black navy value hardcoded — if the landing page theme ever shifts this breaks silently.
- **English label in live badge**: `dashboard.tsx` line 267 renders `Canlı · Featured` — "Featured" is English in a fully Turkish UI. Minor but inconsistent. `canli/index.tsx` line 320 similarly uses `LIVE` (all-caps English).
- **`emerald-500` direct Tailwind color** (`mesajlar.tsx` line 219): `bg-emerald-500` is used for online status indicator. All other greens in the system use `oklch(0.70 0.16 152)` via `chip-emerald`. This creates a two-shade green inconsistency.

**Recommendation**

Add `--color-status-online: oklch(0.65 0.18 152)` to the design token set and replace `bg-emerald-500` references with `bg-[color:var(--color-status-online)]`. Replace "Featured" and "LIVE" with "Öne Çıkan" and "CANLI" respectively.

---

### Pillar 4: Interaction & Motion (4/4) ✅

**Strengths**

- `index.tsx` (landing) wraps the entire page in `<MotionConfig reducedMotion="user">` (line 62) — respects `prefers-reduced-motion` at the root level, which is the correct architecture.
- The custom cubic-bezier `EASE = [0.22, 1, 0.36, 1]` is defined as a constant and shared across dashboard, Keşfet, Canlı, and athlete profile — producing uniform deceleration curves throughout the app. Motion language is coherent.
- `canli/index.tsx` `FeaturedCard` and `MatchCard` run live `setInterval` viewer-count updates (lines 158–164, 296–300) with proper cleanup via `return () => clearInterval(t)`. Real-time micro-animations are paired with actual cleanup discipline.
- `CountUp` component in `dashboard.tsx` and `kesfet/index.tsx` uses `framer-motion`'s `animate()` with `useInView` for scroll-triggered entrance — correctly deferred and performant.
- `whileHover={{ y: -3 }}` and `whileHover={{ y: -4 }}` on cards are subtle and consistent — not over-animated.

**Issues**

- None that would drop the score. The only cosmetic note: the `motion.span` `layoutId="app-nav-pill"` in `AppShell.tsx` line 136 is a shared layout animation that will attempt to animate between sidebar nav items. This only works if all nav items are rendered simultaneously (they are), so it should function correctly — but it will not animate on the mobile bottom nav which uses a separate DOM tree without that `layoutId`.

**Recommendation**

Add the `layoutId="app-nav-pill-mobile"` pattern to the mobile bottom nav as well to achieve parity with the sidebar active indicator animation.

---

### Pillar 5: Component Consistency (2/4) 🟡

**Strengths**

- `soft-card`, `soft-card-strong`, `glass`, `glass-strong`, `chip`, `btn-primary-light`, `btn-ghost-light` are all defined in `styles.css` as utility classes — a proper component-level token system rather than per-component inline styles.
- The `SectionHeading` component in `canli/index.tsx` (lines 131–153) is a clean reusable pattern for eyebrow + heading + right-side slot. Identical patterns in other routes (`dashboard.tsx`, `kesfet/index.tsx`) implement this inline without extracting it — missed opportunity for DRY reuse.

**Issues**

- **Duplicate `* 2.tsx` files**: At least 12 files have space-suffixed copies (`mesajlar 2.tsx`, `AppShell 2.tsx`, `kayit 2.tsx`, `desteklerim 2.tsx`, `marka-panel/index 2.tsx`, etc.). These appear to be editor-cloned backups that have been left in `/src` and are likely being picked up by the file-based router (TanStack Router uses file convention), potentially registering duplicate routes. This is a maintenance hazard and a likely source of routing bugs.
- **Icon-only buttons without `aria-label`**: AppShell `topbar` Phone/Video/MoreHorizontal buttons in `mesajlar.tsx` (lines 259–266) and the `ChevronDown` user menu toggle (`AppShell.tsx` line 197–199) have no `aria-label`. Screen readers announce these as unlabelled buttons.
- **`AthleteCard` in `kesfet/index.tsx`** (lines 602–653): The "Takip et" button (line 646) inside a card that is itself a `<Link>` creates a nested interactive element (`<a>` inside `<article>` with `<Link>` inside). While not strictly invalid HTML, it creates an ambiguous click target — clicking "Takip et" will also trigger the parent link navigation due to event bubbling unless `stopPropagation` is called (it is not).

**Recommendation**

1. Delete all `* 2.tsx` files from `/src` immediately — run `find src -name "* 2.tsx" -delete` after verifying they are not active routes.
2. Add `aria-label` to every icon-only interactive element. Minimum: ChevronDown user button in AppShell, Phone/Video/MoreHorizontal in messages header.
3. Add `e.stopPropagation()` on the "Takip et" button inside `AthleteCard`, or restructure so the follow button is outside the link wrapper.

---

### Pillar 6: Accessibility & Responsiveness (2/4) 🟡

**Strengths**

- `aria-labelledby` is correctly applied to major dashboard sections (`dashboard.tsx` lines 229, 405, 500) — section headings are properly associated with their landmarks.
- `kesfet/index.tsx` (line 502–510) has a proper empty state with icon + heading + descriptive text when no athletes match filters — correct zero-state UX.
- Login and signup forms (`giris.tsx`, `kayit.tsx`) correctly show/hide password with `aria-label` toggling between "Şifreyi gizle" / "Şifreyi göster" and disable the submit button during `loading` state.

**Issues**

- **Focus ring coverage gap**: `AppShell.tsx` sidebar nav links (lines 128–149) have no `focus-visible` styling. The `hover:` utilities are present but keyboard focus produces no visual ring. Same applies to the mobile bottom nav links (lines 284–295). This is a WCAG 2.4.7 (Focus Visible) failure for keyboard-only users.
- **`h-[640px]` fixed chat panel** (`mesajlar.tsx` line 183): On a 667px-tall screen (iPhone SE in portrait), AppShell's topbar (~64px) + page header (~80px) already consumes 144px, leaving 523px for the panel, which clips the chat input below the fold. The panel needs `max-h-[calc(100vh-theme(spacing.44))]` or a viewport-relative flex approach.
- **Hardcoded avatar** (`AppShell.tsx` lines 192, 240): Both the sidebar user card and topbar user button render `okculukImg` — the female archery athlete photo — as the user avatar for all users in all roles. This is not a real user photo, and no `session.profile?.avatar_url` fallback is wired. For a logged-in brand or male athlete this will render the wrong photo.
- **No loading skeleton on dashboard or Canlı**: `dashboard.tsx` fetches three queries (`profilesQuery`, `eventsQuery`, `followsQuery`) but renders nothing special while `isLoading` is true — followed athlete cards simply render with whatever `athleteList` happens to be (often empty array), which may flash empty towers before data arrives. `canli/index.tsx` has no loading guard at all — `liveMatches` is mock data so it never loads, but when real data is wired this will need skeletons.
- **Hero images on dashboard/kesfet have `alt=""` with `aria-hidden` missing** (`dashboard.tsx` lines 174, 221; `kesfet/index.tsx` lines 123, 211): Decorative images correctly have empty `alt=""` but are missing the paired `aria-hidden="true"` that prevents screen readers from announcing "image" with no content. The athlete profile and Athletes section hero images DO have proper `alt` text — the regression is in dashboard/kesfet.

**Recommendation**

Priority triage:
1. Add `focus-visible:ring-2 focus-visible:ring-violet/50 focus-visible:rounded-xl` to all `<Link>` and `<button>` elements in `AppShell.tsx`.
2. Add `aria-hidden="true"` to all decorative `alt=""` images in dashboard and kesfet routes.
3. Replace `h-[640px]` in mesajlar with `h-[min(640px,calc(100dvh-theme(spacing.40)))]`.

---

## Files Audited

| File | Role |
|------|------|
| `src/styles.css` | Design system tokens, utilities |
| `src/components/meydan/AppShell.tsx` | Sidebar, topbar, mobile nav shell |
| `src/components/meydan/Hero.tsx` | Landing hero section |
| `src/components/meydan/Athletes.tsx` | Landing athlete showcase |
| `src/routes/index.tsx` | Landing page root |
| `src/routes/dashboard.tsx` | Fan dashboard |
| `src/routes/sporcu/$slug/index.tsx` | Athlete profile |
| `src/routes/kesfet/index.tsx` | Discovery page |
| `src/routes/canli/index.tsx` | Live matches list |
| `src/routes/mesajlar.tsx` | Messages/chat |

---

## Additional Notes

**Duplicate file hazard**: The following files with ` 2` suffixes exist under `/src` and may be accidentally registered as routes by TanStack Router's file-based convention. They should be removed or moved to a non-route directory:

```
src/routes/desteklerim 2.tsx
src/routes/kayit 2.tsx
src/routes/mesajlar 2.tsx
src/routes/marka-panel/eslesme 2.tsx
src/routes/marka-panel/index 2.tsx
src/routes/marka-panel/profil 2.tsx
src/routes/marka-panel/profil-olustur 2.tsx
src/routes/sporcu-panel/ihtiyaclar 2.tsx
src/components/meydan/AppShell 2.tsx
src/components/meydan/ActiveAthletePicker 2.tsx
```

**Registry audit**: No `components.json` (shadcn) found. Registry safety audit skipped.
