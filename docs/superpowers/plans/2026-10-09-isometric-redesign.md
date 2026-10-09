# Isometric Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Digital Nurse from the dark neon "cockpit" look to a pastel isometric identity: an interactive SVG hospital on Home, an illustrated header in every section, and automatic day/night theming.

**Architecture:**
- **Theme:** CSS variables in `src/index.css` drive both themes. `PreferencesContext` resolves `auto | light | dark` into the `.light` or `.dark` class.
- **Illustrations:** inline-SVG React components under `src/components/iso/`, built on pure projection helpers in `iso.ts` and coloured only through `--iso-*` CSS variables.
- **Section data:** one registry, `src/lib/sections.ts`, feeds the Home grid, the "More" drawer, the hospital map and the section headers.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind 3, shadcn/ui (Radix + vaul Drawer), lucide-react, Vitest (new dev dependency).

**Spec:** `docs/superpowers/specs/2026-10-09-isometric-redesign-design.md`

## Global Constraints

- **Day palette:** background `#FBF7F2`, card `#FFFFFF`, foreground `#1E2340`, muted-foreground `#5D6382`, border `#ECE3D6`, primary `#6F80E8`, accent `#3BA99C`.
- **Night palette:** background `#11142B`, card `#1A1E3D`, foreground `#ECEEFA`, muted-foreground `#A3A9CC`, border `#2A2F57`, primary `#A3B0FF`, accent `#4FC1B3`.
- **Auto theme:** dark when the hour is ≥ 19 or < 7. Re-check every 60 s and on `visibilitychange`.
- **Theme storage:** `localStorage.theme` accepts `"auto" | "light" | "dark"`. When it is missing, use `"auto"`.
- **`<meta name="theme-color">`:** `#FBF7F2` in day, `#11142B` in night.
- **Fonts:** IBM Plex Sans Arabic for `[dir=rtl]`, IBM Plex Sans for LTR. No Space Grotesk, no `font-mono` on titles. `letter-spacing` and `uppercase` only under `[dir=ltr]`.
- **Header height:** ≤ 96 px at 390 px width when there is no illustration.
- **Illustration size:** ≤ 160 px tall on mobile and ≤ 220 px on desktop.
- **Bottom nav:** exactly 5 items: Home, Drugs, Labs, Calculators, More.
- **Motion:** lift of −6 px over 150–250 ms with `cubic-bezier(.2,.8,.2,1)`. Everything is disabled under `prefers-reduced-motion: reduce`. No infinite animation on people.
- **Bundle:** all `iso` code together ≤ 60 KB gzip.
- **Lint:** `npm run lint` must not exceed today's baseline of 3 errors and 11 warnings.
- **Characters:** nurse with navy hijab and teal scrubs, doctor/pharmacist in a white coat, elder in dishdasha with red shemagh and agal, patient in a hospital gown, child.

## Review Focus

1. **Stored theme from the old version** (`"light"`/`"dark"` already in localStorage) must keep working and must not be forced to auto. Test owner: Task 1.
2. **Auto mode across the 19:00 and 07:00 boundaries while the app stays open** must flip without a reload (interval). Test owner: Task 1 (pure function). The interval is checked manually in Task 12.
3. **Keyboard users on the hospital map:** Tab must reach every room in visual order, and Enter/Space must navigate. Test owner: Task 9 (Playwright check in Task 12).
4. **A route inside "More"** (for example `/atlas`) must highlight the More tab, and `/drugs/:id` must highlight Drugs. Test owner: Task 6 (`activeNavKey` unit test).
5. **Arabic text inside SVG** must render left-to-right inside the drawing and must not mirror. Every `<svg>` sets `direction: ltr`. Test owner: Task 8.

---

## Phase 1: Theme, shell and navigation

### Task 1: Vitest and the pure theme/greeting logic

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/lib/theme.test.ts`
- Modify: `package.json` (add `vitest` devDependency and the `"test": "vitest run"` script)
- Modify: `vite.config.ts` (add a `test: { environment: "node" }` block)

**Interfaces:**
- Produces:
  - `type ThemeMode = "auto" | "light" | "dark"`
  - `type ResolvedTheme = "light" | "dark"`
  - `resolveTheme(mode: ThemeMode, now: Date): ResolvedTheme`
  - `parseStoredTheme(value: string | null): ThemeMode`
  - `greetingKey(now: Date): "morning" | "evening" | "night"` (morning is 05–11, evening is 12–18, night is 19–04)
  - `THEME_COLOR: Record<ResolvedTheme, string>`

- [ ] **Step 1: Write the failing tests** in `theme.test.ts`:
  - `resolveTheme("auto", at(6,59))` → `"dark"`
  - `resolveTheme("auto", at(7,0))` → `"light"`
  - `resolveTheme("auto", at(18,59))` → `"light"`
  - `resolveTheme("auto", at(19,0))` → `"dark"`
  - `resolveTheme("light", at(23,0))` → `"light"`
  - `resolveTheme("dark", at(12,0))` → `"dark"`
  - `parseStoredTheme(null)` → `"auto"`
  - `parseStoredTheme("dark")` → `"dark"`
  - `parseStoredTheme("light")` → `"light"`
  - `parseStoredTheme("garbage")` → `"auto"`
  - `greetingKey(at(5,0))` → `"morning"`
  - `greetingKey(at(12,0))` → `"evening"`
  - `greetingKey(at(19,0))` → `"night"`
  - `greetingKey(at(4,59))` → `"night"`
  - `THEME_COLOR.light === "#FBF7F2"` and `THEME_COLOR.dark === "#11142B"`
- [ ] **Step 2:** Run `npx vitest run src/lib/theme.test.ts`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement `theme.ts`.
- [ ] **Step 4:** Run `npm test`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat(theme): add auto day/night theme resolution with tests`.

### Task 2: Auto theme in PreferencesContext, and settings opened from the header

**Files:**
- Modify: `src/contexts/PreferencesContext.tsx`
- Modify: `src/components/PreferencesDrawer.tsx`
- Modify: `src/lib/i18n.ts` (add keys `autoTheme`, `moreLabel`, `greetingMorning`, `greetingEvening`, `greetingNight`, `greetingPrompt`, `openSettings`, `noResults`, `offlineTitle` in en and ar)
- Modify: `index.html` (theme-color `#FBF7F2`; add IBM Plex Sans Arabic and IBM Plex Sans to a Google Fonts `<link>`)
- Modify: `public/manifest.json` (`background_color` and `theme_color` set to `#FBF7F2`)

**Interfaces:**
- Consumes: Task 1.
- Produces, on the context value:
  - `themeMode: ThemeMode` and `setThemeMode(m)`
  - `theme: ResolvedTheme` (kept, read-only meaning)
  - `preferencesOpen: boolean` and `setPreferencesOpen(b)`
  - `toggleTheme` keeps working and sets an explicit mode.

- [ ] **Step 1:** Replace the `theme` state with `themeMode`, initialised from `parseStoredTheme`. Add a `now` tick: `setInterval` every 60 000 ms plus a `visibilitychange` listener, both only when the mode is `"auto"`. Derive `theme = resolveTheme(themeMode, now)`. The effect toggles the `.dark`/`.light` classes, writes `localStorage.theme = themeMode`, and updates the `meta[name=theme-color]` content to `THEME_COLOR[theme]`.
- [ ] **Step 2:** In `PreferencesDrawer`, remove `DrawerTrigger` and the fixed button. Make it controlled by `preferencesOpen`. Replace the Switch with a three-button segmented control (Auto / Day / Night) using `aria-pressed`.
- [ ] **Step 3:** Run `npm run build`. Expected: success.
- [ ] **Step 4:** Commit: `feat(theme): auto/day/night mode and header-controlled settings drawer`.

### Task 3: Design tokens, fonts and base styles

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.ts` (add `pastel: { peach, sand, pink }` colours via CSS vars; add `fontFamily.sans`)

- [ ] **Step 1:** Rewrite the `:root` and `.light` blocks with the day palette and the `.dark` block with the night palette (HSL triplets of the hex values in Global Constraints).
  - Add `--pastel-peach #F6A97A`, `--pastel-sand #F7D58B`, `--pastel-pink #F48FB1`.
  - Keep `--medical-*`, with day values that reach ≥ 4.5:1 on `#FFFFFF` for text use: red `#C8324B`, green `#1F8A5B`, yellow `#9A6A00`, blue `#3F56C9`.
  - Night values: red `#FF7A8A`, green `#4FD39A`, yellow `#F7C948`, blue `#A3B0FF`.
- [ ] **Step 2:** Add the `--iso-*` scene tokens: every token from the spike page's `.scene` block with day values in `:root`/`.light` and night values in `.dark`.
- [ ] **Step 3:** Remove `--app-shell-gradient` and its uses, the body `letter-spacing`, and the Space Grotesk heading rule.
  - Set the body font to `"IBM Plex Sans", system-ui, sans-serif` for LTR and `"IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif` for `[dir=rtl]`.
  - Add `[dir=rtl] .tracking-*` overrides that reset `letter-spacing: 0` and `text-transform: none`.
- [ ] **Step 4:** Remove the `@import` line for Space Grotesk.
- [ ] **Step 5:** Run `npm run build`. Expected: success.
- [ ] **Step 6:** Commit: `feat(design): pastel day and indigo night tokens, Plex Arabic`.

### Task 4: Replace hard-coded dark-only colour classes

**Files:**
- Modify: every `.tsx` file listed by `grep -rlE "text-white|bg-white/|border-white/|slate-(100|200|300|900|950)|bg-\[#0" src`

- [ ] **Step 1:** Apply these mechanical replacements:

  | From | To |
  |---|---|
  | `border-white/N` | `border-foreground/N` |
  | `bg-white/N` | `bg-foreground/N` |
  | `from-white/N`, `via-white/N` | `from-foreground/N`, `via-foreground/N` |
  | `text-white/N` | `text-foreground/N` |
  | `text-slate-100` | `text-foreground` |
  | `text-slate-200` | `text-foreground/90` |
  | `text-slate-300` | `text-muted-foreground` |
  | `bg-slate-950/N`, `bg-slate-900/N` | `bg-card/N` |
  | `bg-slate-950`, `bg-slate-900` | `bg-card` |
  | `bg-[#04070f]`, `bg-[#050912]`, `bg-[#061427]` | `bg-background` |

- [ ] **Step 2:** For each bare `text-white`, keep it only when the same `className` carries a solid saturated background (`bg-primary`, `bg-red-*`, `bg-emerald-*`, `bg-gradient-*` with ≥ /60 stops). Otherwise change it to `text-foreground`.
- [ ] **Step 3:** Run `npm run build`, then `npm run lint`, and compare the lint count with the baseline (3 errors).
- [ ] **Step 4:** Commit: `refactor(theme): replace dark-only colour classes with tokens`.

### Task 5: Section registry and the compact AppLayout header

**Files:**
- Create: `src/lib/sections.ts`
- Create: `src/lib/sections.test.ts`
- Modify: `src/components/layout/AppLayout.tsx`
- Modify: `src/components/layout/SecureShell.tsx` (`bg-background text-foreground`, padding `pt-4`)
- Modify: `src/pages/DocsHub.tsx` (drop `badgeLabel`/`subBadgeLabel`)

**Interfaces:**
- Produces:
  - `type SceneKey = "pharmacy" | "lab" | "ecg" | "icu" | "triage" | "station" | "library" | "iv" | "ai" | "docs" | "infection" | "atlas" | "pathways" | "pharma" | "terms" | "mindmaps"`
  - `interface AppSection { key: SceneKey; path: string; icon: LucideIcon; title: { en: string; ar: string }; description: { en: string; ar: string }; inHospital: boolean }`
  - `SECTIONS: AppSection[]` (16 entries — the 15 rooms of the spec plus Mind Maps; paths exactly the routes in `App.tsx`)
  - `sectionForPath(pathname: string): AppSection | undefined` (prefix match, so `/drugs/12` → pharmacy and `/procedure/3` → icu)
  - `AppLayout` gains `illustration?: SceneKey` and loses `badgeLabel`/`subBadgeLabel`.

- [ ] **Step 1:** Write tests in `sections.test.ts`:
  - every `SECTIONS[i].path` is in the `ROUTES` list, which is copied from `App.tsx`;
  - `sectionForPath("/drugs/abc")?.key === "pharmacy"`;
  - `sectionForPath("/procedure/x")?.key === "icu"`;
  - `sectionForPath("/calculator/bmi")?.key === "station"`;
  - `sectionForPath("/scale/gcs")?.key === "triage"`;
  - `sectionForPath("/home") === undefined`;
  - exactly 9 sections have `inHospital: true`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement `sections.ts`. Hospital rooms (spec §7.2): pharmacy `/drugs`, lab `/labs`, ecg `/ecg`, icu `/procedures`, triage `/assessments`, station `/calculators`, library `/flashcards`, iv `/fluids`, ai `/ai-assistant`. The others are docs `/docs`, infection `/infection`, terms `/terminology`, atlas `/atlas`, pathways `/pathways`, pharma `/pharma`, mindmaps `/mind-maps`. Use the titles and descriptions currently in `Home.tsx`.
- [ ] **Step 4:** Rewrite the `AppLayout` header as one row in a `header` with `rounded-3xl bg-card border shadow-sm p-4`:
  - back button (if any), then an `h1` (`text-xl font-semibold`) with an optional subtitle (`text-sm text-muted-foreground`), then `actions`, then a Settings icon button (`aria-label={t.openSettings}`) that calls `setPreferencesOpen(true)`;
  - when `illustration` is set, render `<SectionScene scene={illustration} />` below the row. This is a no-op placeholder until Task 10; render nothing before then;
  - remove the grid background, the glow blob and the badges.
- [ ] **Step 5:** Run `npm test`, then `npm run build`. Expected: pass.
- [ ] **Step 6:** Commit: `feat(layout): section registry and compact header`.

### Task 6: Five-item bottom nav with a "More" drawer

**Files:**
- Modify: `src/components/navigation/PrimaryNav.tsx`
- Create: `src/components/navigation/navModel.ts`
- Create: `src/components/navigation/navModel.test.ts`

**Interfaces:**
- Consumes: `SECTIONS` and `sectionForPath` (Task 5).
- Produces:
  - `type NavKey = "home" | "drugs" | "labs" | "calculators" | "more"`
  - `activeNavKey(pathname: string): NavKey`

- [ ] **Step 1:** Tests for `activeNavKey`:
  - `/home` → `home`
  - `/drugs/5` → `drugs`
  - `/labs` → `labs`
  - `/calculator/bmi` → `calculators`
  - `/atlas` → `more`
  - `/ecg` → `more`
- [ ] **Step 2:** Run `npm test`. Expected: FAIL. Then implement and run again. Expected: PASS.
- [ ] **Step 3:** Rewrite `PrimaryNav` as a fixed bar of 5 equal buttons. It has `bg-card/90 backdrop-blur border rounded-3xl` and bottom padding of `env(safe-area-inset-bottom)`, and the active item gets `bg-primary/15 text-primary`. "More" opens a `Drawer` holding a 3-column grid of every `SECTIONS` entry not already in the bar (icon plus localised title).
- [ ] **Step 4:** Run `npm run build`. Expected: success.
- [ ] **Step 5:** Commit: `feat(nav): five-item bottom bar with More drawer`.

## Phase 2: Isometric system and Home

### Task 7: Isometric geometry helpers

**Files:**
- Create: `src/components/iso/iso.ts`
- Create: `src/components/iso/iso.test.ts`

**Interfaces:**
- Produces:
  - `const S = 24`
  - `type Pt = [number, number]`
  - `project(x: number, y: number, z?: number, origin?: Pt): Pt`, which returns `[ox + (x−y)·S·cos30°, oy + (x+y)·S·0.5 − z·S]`
  - `pts(points: Pt[]): string` (one decimal)
  - `boxFaces(x, y, z, w, d, h, origin?): { top: Pt[]; front: Pt[]; side: Pt[] }`. `front` is the +y face and `side` is the +x face.
  - `planeY(x, y, z, origin?): string` returns the `matrix(cos30,0.5,0,1,tx,ty)` transform.
  - `planeX(x, y, z, origin?): string` returns `matrix(cos30,-0.5,0,1,tx,ty)`.
  - `sceneSize(w: number, d: number, h: number, pad?: number): { width: number; height: number; origin: Pt }`

- [ ] **Step 1:** Write tests:
  - `project(0,0,0,[0,0])` → `[0,0]`
  - `project(1,0,0,[0,0])` ≈ `[20.78, 12]`
  - `project(0,1,0,[0,0])` ≈ `[-20.78, 12]`
  - `project(0,0,1,[0,0])` → `[0,-24]`
  - `pts([[1.234,5.678]])` → `"1.2,5.7"`
  - `boxFaces(0,0,0,1,1,1,[0,0]).top` has 4 points, the first equal to `project(0,0,1,[0,0])`
  - `planeX` output starts with `"matrix(0.866,-0.5"`
- [ ] **Step 2:** Run the tests. Expected: FAIL. Implement, then run again. Expected: PASS.
- [ ] **Step 3:** Commit: `feat(iso): projection helpers`.

### Task 8: Primitives and characters

**Files:**
- Create: `src/components/iso/primitives.tsx`
- Create: `src/components/iso/people.tsx`

**Interfaces:**
- Consumes: Task 7.
- Produces:
  - `<IsoBox x y z w d h top front side origin />`. The colours are CSS var names, for example `"--iso-c1"`.
  - `<RoomShell w d h origin wallX wallY floor />` draws the slab, floor tiles and two back walls with caps.
  - `<IsoSvg width height title? decorative?>` is the root `<svg>`. It sets `style={{direction:"ltr"}}` and `role="img"` + `<title>`, or `aria-hidden` when `decorative`.
  - People, each `(props: { at: Pt; pose?: Pose; flip?: boolean })`, where `type Pose = "stand" | "reach" | "sit" | "walk"`:
    - `<Nurse>` supports stand and reach, and carries a clipboard
    - `<Doctor>` (white coat) supports stand and reach
    - `<Elder>` (dishdasha, shemagh pattern, agal, cane) supports stand and walk
    - `<Patient>` (gown) supports sit and stand
    - `<Child>` supports stand

- [ ] **Step 1:** Port the spike shapes into components. Every fill is `var(--iso-…)`, and the shemagh uses a `<pattern>` with an id unique per instance (`useId`). Each person is wrapped in `<g className="iso-person">`.
- [ ] **Step 2:** Add CSS for `.dark .iso-person { filter: brightness(.82) saturate(.85) }`.
- [ ] **Step 3:** Run `npm run build`. Expected: success.
- [ ] **Step 4:** Commit: `feat(iso): primitives and characters`.

### Task 9: The nine hospital rooms, IsometricHospital and the new Home

**Files:**
- Create: `src/components/iso/rooms/{PharmacyRoom,LabRoom,EcgRoom,IcuRoom,TriageRoom,StationRoom,LibraryRoom,IvRoom,AiDeskRoom}.tsx`
- Create: `src/components/iso/IsometricHospital.tsx`
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: Tasks 5, 7 and 8.
- Produces:
  - Each room is a `RoomComponent = (props: { origin: Pt; compact?: boolean }) => JSX.Element` that draws a 6×6×4 room. `compact` drops the people for the icon size.
  - `ROOMS: Record<SceneKey, RoomComponent>` lives in `src/components/iso/rooms/index.ts`.
  - `<IsometricHospital onOpen={(s: AppSection) => void} />`

- [ ] **Step 1:** Implement the rooms. Each one has the props named in spec §7.2 and at least one character:
  - **Pharmacy:** shelves, counter, monitor. Pharmacist and Elder.
  - **Lab:** bench, microscope, tube rack, centrifuge. Doctor.
  - **ECG:** bed, monitor showing a trace. Patient (sit) and Nurse.
  - **ICU:** ICU bed, ventilator, IV pole. Patient and Nurse (reach).
  - **Triage:** chair, BP cuff, scale. Elder and Nurse.
  - **Station:** desk, computer, calculator, files. Nurse.
  - **Library:** bookshelf, table, flashcards. Nurse (sit).
  - **IV:** IV bags rack, recliner. Patient and Nurse.
  - **AI desk:** desk, screen showing a chat bubble, small robot. Child and Nurse.
- [ ] **Step 2:** In `IsometricHospital`, lay out the 9 rooms on a 3×3 iso grid (cell 7 units) on one base slab, drawn back to front.
  - Each room is wrapped in `<g role="link" tabIndex={0} aria-label={title} onClick onKeyDown(Enter|Space)>`, ordered so DOM order = visual reading order.
  - Hover and focus apply `transform: translateY(-6px)` plus a drop-shadow; `:focus-visible` gets an outline in `--primary`.
  - Show a label chip (HTML, absolutely positioned from the room centre in percent) on hover or focus.
  - On activation, flash for 120 ms, then call `onOpen`.
- [ ] **Step 3:** Rewrite `Home`:
  - a greeting from `greetingKey(new Date())` plus `t.greetingPrompt`;
  - the AI card with a mini `<Nurse>`;
  - `<IsometricHospital onOpen={s => navigate(s.path)} />`;
  - a grid of all `SECTIONS` (icon plus title, `title` attribute = description).

  The broken links disappear because the paths now come from `SECTIONS`.
- [ ] **Step 4:** Run `npm run build`, start the dev server, and take a 390 px screenshot of `/home` in day and night.
- [ ] **Step 5:** Commit: `feat(home): interactive isometric hospital`.

## Phase 3: Section scenes and empty states

### Task 10: Six remaining rooms, SectionScene, and the wiring into every section

**Files:**
- Create: `src/components/iso/rooms/{DocsRoom,InfectionRoom,AtlasRoom,PathwaysRoom,PharmaRoom,TermsRoom,MindMapsRoom}.tsx`
- Create: `src/components/iso/SectionScene.tsx`
- Modify: `src/components/iso/rooms/index.ts`
- Modify: `AppLayout.tsx` (render `SectionScene`)
- Modify: every page in `SECTIONS` (pass `illustration`)

**Interfaces:**
- Produces: `<SectionScene scene: SceneKey />`. It lazy-loads its room through `React.lazy` keyed per room, renders it centred with a max height of 160 px (mobile) or 220 px (≥ 640 px), and sets `decorative` because the page title already names it.

- [ ] **Step 1:** Implement the rooms:
  - **Docs:** desk with a chart clipboard and printer.
  - **Infection:** sink, gloves and gown, isolation sign.
  - **Atlas:** anatomy model and skeleton.
  - **Pathways:** whiteboard with arrows.
  - **Pharma:** IV syringe pump with a concentration curve on screen.
  - **Terms:** dictionary lectern.
  - **Mind maps:** corkboard with strings.
- [ ] **Step 2:** Add `illustration={section.key}` to the `AppLayout` in each section's list page: Drugs, Labs, ECG, Procedures, Assessments, Calculators, Flashcards, Fluids, DocsHub, InfectionGuide, Terminology, BodyAtlas, PathophysiologyMaps, PharmacokineticsVisualizer, MindMaps. `AIAssistant` doesn't use `AppLayout`, so render `<SectionScene scene="ai" />` at the top of its own header.
- [ ] **Step 3:** Run `npm run build`. Expected: success, with one chunk per room.
- [ ] **Step 4:** Commit: `feat(sections): illustrated section headers`.

### Task 11: EmptyState and NotFound

**Files:**
- Create: `src/components/iso/EmptyScene.tsx`
- Create: `src/components/EmptyState.tsx`
- Modify: `src/pages/NotFound.tsx`, `src/pages/ECG.tsx:148`, `src/pages/Terminology.tsx:247`, and the empty-result branches in `Drugs.tsx`, `Labs.tsx`, `Procedures.tsx` (add one where it is missing)
- Modify: `src/components/OfflineBanner.tsx` (small offline glyph)

**Interfaces:**
- Produces:
  - `<EmptyScene variant: "no-results" | "offline" | "not-found" />`
  - `<EmptyState variant title description? action?: ReactNode />`

- [ ] **Step 1:** Implement the scenes:
  - **no-results:** nurse with a magnifier next to an empty shelf.
  - **offline:** a router showing an unplugged cable.
  - **not-found:** an empty room with the nurse pointing at a door.
- [ ] **Step 2:** Wire the scenes into the pages listed above. `NotFound` uses `bg-background` and a `Link` to `/home`.
- [ ] **Step 3:** Run `npm run build`. Expected: success.
- [ ] **Step 4:** Commit: `feat(empty): illustrated empty states and 404`.

## Phase 4: Verification and polish

### Task 12: Verification matrix

**Files:**
- Create: `scripts/contrast-check.mjs`. It reads the hex pairs and asserts ≥ 4.5:1 for:
  - foreground/background and muted-foreground/background, in both themes;
  - primary-foreground on primary;
  - the medical colours on the card.

- [ ] **Step 1:** Run `node scripts/contrast-check.mjs`. Expected: every pair ≥ 4.5. Fix any token that fails.
- [ ] **Step 2:** Run `npm test && npm run build && npm run lint`. Expected: tests pass, build succeeds, lint ≤ baseline. Record the gzip size of the iso chunks from the build output (≤ 60 KB total).
- [ ] **Step 3:** Use Playwright (scratchpad script) to take screenshots of `/home`, `/drugs`, `/labs` and `/nope` across day/night × en/ar × 390/1280 (32 shots), and review them. Then:
  - press Tab on `/home` and assert that the focused element is a hospital room with an `aria-label`;
  - press Enter and assert the URL changed;
  - emulate `reducedMotion: "reduce"` and assert the room transition is `none`.
- [ ] **Step 4:** Fix what the review finds, re-run Step 2, and commit: `chore: verification fixes`.
- [ ] **Step 5:** Push and update the PR description with the screenshot summary.
