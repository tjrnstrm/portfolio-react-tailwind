# Design Log

Running record of the portfolio's design iterations so work can continue across
machines / chat sessions without re-deriving context.

**Keep this updated with every design change.** New entries go at the bottom of
the Changelog. The "Current state" section is always rewritten to match reality.

- **Live dev:** `npm run dev` → http://localhost:5173/
- **Stack:** Vite + React 19 + TypeScript + Tailwind v4, `react-icons`
- **Fonts:** Inter (body/UI, `--font-display`), Geist (headings, `--font-heading`),
  Geist Mono (`--font-mono`) — all via Google Fonts `@import` in `src/index.css`
- **Theme:** class-based dark mode (`.dark` on `<html>`). It follows the
  visitor's system preference (`prefers-color-scheme`), including live changes,
  until they use the toggle in the navbar; that choice is saved in
  `localStorage['theme-choice']` and wins from then on. (The old `'theme'` key
  is ignored: the previous code saved its "dark" default into it on every first
  visit, so it can't tell a choice from a default.)

---

## Current state

### Code structure (since 2026-09-26)

- `pages/` — one file per route (`Home`, `AboutPage`, `Contact`): page state and
  layout only, assembled from components.
- `components/layout/` — `Navbar` (picks `ContactNav` or `SiteNav`), `NavControls`
  (theme toggle, sound toggle, back arrow), `Footer`, `ScrollManager`.
- `components/ui/` — shared pieces: `CtaPill`, `TransitionLink`, `CodeRain` (was
  `HeroBackground`), `Eyebrow`, `ExternalRow`, `RedArrow`.
- `components/home/`, `about/`, `contact/` — per-page components. The brief's
  six steps are `components/contact/steps/*`; they share `Question`,
  `Choices`/`Chip`, `Fold` and `Field`/`TextField`.
- `data/` — content: `site.ts` (email and profile links), `brief.ts` (form
  options, services), `about.ts` (skills, experience, education), `projects.ts`.
- `lib/` — logic and shared class strings: `brief.ts` (Brief type, summary,
  mailto, validation), `sound.ts`, `type.ts` (`PAGE_HEADING`, `EYEBROW`,
  `PILL_FOCUS`).
- `hooks/` — `useTheme`, `useScrolled`, `useNavHeight`, `useHeightVar`,
  `useDocumentTitle`.
- The split was checked pixel for pixel: 20 page states (home, About, contact,
  contact with errors, the sent view; dark and light; desktop and mobile) were
  identical before and after.

### Hero (`src/components/Hero.tsx`) — "Airy wordmark" (Surname Study take two, A)

- Centered, fills exactly one viewport (`h-full` inside a
  `calc(100dvh - var(--nav-h))` wrapper in `pages/Home.tsx`; `--nav-h` is
  measured from the real navbar height in a `useLayoutEffect` in `App.tsx`).
  Content is centred on the true viewport middle with
  `paddingBottom: var(--nav-h)`. There is no marquee under the hero any more;
  the code rain fades out at the bottom instead (see Hero background).
- **Kicker:** `FULLSTACK DEVELOPER · STOCKHOLM`, Geist Mono, `tracking-[0.26em]`,
  muted.
- **Name (`<h1>`):** `TJERNSTROM` — Geist `font-extralight` (200), uppercase,
  `tracking-[0.3em]` with `-mr-[0.3em]` to keep it optically centered,
  `text-[clamp(2rem,6.5vw,4.25rem)]`. Inherits `text-zinc-900/100`. No red
  period (looked off-centre). Plain `o`, not `ö` — a deliberate call for now
  (rest of the site keeps `Tjernström`). `aria-label="Alexander Tjernström"`
  for the full name. Geist `@import` widened to `wght@100..900` for weight 200.
- **Status row:** `● Open to work` (green dot with an expanding ring ripple) +
  `Tell me what to build →` (underlined, red arrow; a `TransitionLink` to
  `/contact`) — Geist Mono. The status text is `Taking new projects` (edited
  by hand; it used to say `Open to work`).
- The vertical `SCROLL` indicator was removed (2026-09-25) and so was the bottom
  `See the work ↓` link: there is no Work section to point at any more.
- Motion (ripple, scroll line, rain) is disabled under
  `prefers-reduced-motion`.

### Hero background (`src/components/HeroBackground.tsx`)

- Code rain **scoped to the hero `<section>`** (canvas `absolute inset-0`,
  `isolate` on the section) — it scrolls away with the hero rather than staying
  pinned. Site-wide was tried (fixed viewport canvas) and rejected: it felt
  bolted to the glass, and a full-page-height animated canvas is too heavy.
- Faint falling Geist-Mono glyphs (`0 1 { } ( ) < > / * ; = …`), brighter head
  char, indigo-white on dark / indigo on light. Head alpha ~0.34 dark. A
  vertical CSS mask dims it to ~12% behind the headline band, brings it back in
  the lower third, then fades it to transparent at the bottom edge.
- `variant="page"` is a fixed, viewport-sized layer (no hero scoping) with
  softer top/bottom mask edges and 2.4x alpha; the contact page uses it behind
  its glass cards, so it stays put while the cards scroll over it.
- Pauses off-screen (`IntersectionObserver`); resizes via `ResizeObserver`;
  static sparse frame under `prefers-reduced-motion`.
- The static `body` `background-image` glow was removed earlier and stays gone.

### Navbar (`src/components/Navbar.tsx`)

- Left: **`Tjernstrom`** wordmark (plain `o`, matching the hero) — styled like
  the hero name: `font-heading text-sm font-extralight uppercase
  tracking-[0.3em]` (a step up from the `text-xs` menu links so it reads as the
  logo). **Not** a `.nav-link` (no padding box / hover rectangle) — hover just
  fades to `opacity-70`. Flush at the nav's left padding edge. Stays as-is when
  the bar collapses to a pill (no `AT` morph).
- Right: `WORK / ABOUT` menu (sm+) using the borderless `.nav-link`
  treatment (`:focus-visible` outline via `index.css`). Theme toggle is now a
  bare **icon-only** button — `FiSun` / `FiMoon` at 15px, tight `p-1.5`, no
  `.nav-link` box, hover = colour shift only (no background rectangle),
  `-mr-1` to line the icon up with the nav's right edge, own `focus-visible`
  outline.
- The bordered-pill "BACK TO TOP" button was removed (menu + the clickable
  wordmark cover it).
- Pill-on-scroll animation (border-radius / max-width / offset). On mobile the
  scrolled pill uses `calc(100% - 1rem)` side margins + `px-6` inner padding so
  the wordmark clears the ~22px rounded cap (was hugging it). Small ~8px
  rightward settle vs the unscrolled `px-6` nav.

- **The wordmark and the Work link are gone** (2026-09-25). The home navbar is
  now just `About` (a `TransitionLink` to `/about`, `tracking-[0.3em]`, no hover
  background: the text softens to zinc-600 / zinc-400; plays `scan`), the
  `Start a project` glass pill (`CtaPill`, red arrow) and the theme toggle, all
  on the right. On `/about` the About link is hidden and a back arrow (like the
  contact page's) sits on the left. The nav has `view-transition-name:
  site-nav` so it stays put during page transitions. The `Start a project`
  button is the "quiet pill" (`CtaPill quiet`): sentence case, Geist 13px
  medium, no arrow at rest, the red arrow slides in on hover or focus (chosen
  from the "Nav CTA Options" artifact; the closing band keeps the uppercase
  pill).
- **On `/contact` the navbar has different contents and one extra shape.** At
  the top it is the same full-width bar as on the home page, with a back arrow
  (`FiArrowLeft`, a `TransitionLink` to `/`) instead of the wordmark, no menu,
  and a sound toggle (`FiVolume2` / `FiVolumeX`) next to the theme toggle.
  Scrolling morphs it (1s, like the home pill) into a glass pill (the cards'
  `glass` utility, `rounded-[100px]`) as wide as the pitch panel, i.e. the left
  grid column: `(100% - 7.5rem) * 5/12` at lg, full content width below, 1.25rem
  from the top with a 1.25rem gap above the panel. Both shapes have the same
  footprint in the page flow (the pill's `mt-4` makes up its shorter height),
  so the content doesn't shift; `--nav-h` includes that margin and is
  re-measured on every route change. It is a separate keyed `<nav>`, so
  switching pages remounts it, and `App` resets `scrolled` in the same render as
  the route change so it never mounts as a pill after leaving a scrolled page.

### Pages

- `/` is now just the hero, exactly one screen and not scrollable: the footer
  lies over the bottom of the hero (`<Footer overlay />`), transparent and
  without its separator line (other pages keep the normal footer), and the
  navbar never turns into a pill here. The **Work section was removed** (`Projects.tsx` and `ProjectCard.tsx` are
  deleted, they are in git history; `data/projects.ts` stays, the contact page
  uses `clientProjects`).
- `/about` is the About section on its own page (`pages/AboutPage.tsx`, sets
  the document title), followed by the closing "Tell me what to build" band
  (`ContactCta`) and the footer. Its navbar still turns into a pill on scroll. Reached from the navbar's About link; `TransitionLink`
  gives it the fade-out / rise transition.
- `ScrollManager` still scrolls to a hash after a route change, or to the top
  for a fresh page (back/forward is left to the browser). Nothing links to an
  anchor any more.
- `html { scroll-behavior: smooth }` (auto under reduced motion)

### Routing, dark default and transitions

- `react-router-dom` v7, `BrowserRouter useTransitions={false}` (state updates
  must commit synchronously inside a view transition). Routes: `/`, `/contact`,
  anything else redirects home. **The host must serve `index.html` for unknown
  paths** (Vercel / Netlify / Cloudflare do; GitHub Pages does not).
- The theme is resolved before first paint by a small script in `index.html`
  (saved `theme-choice`, else the system preference) so there's no flash;
  `App.tsx` starts from that class, follows system changes while there is no
  saved choice, and only saves on a toggle click.
- `TransitionLink` wraps `Link` and uses the View Transitions API for page
  changes (same-page hash links, modified clicks, reduced motion and browsers
  without the API fall through to a plain `Link`). To `/contact`: the old page
  fades out (240ms), then the contact cards stagger in (`.reveal`, 110ms
  apart, 700ms each). Back home: the old page fades out, the home page rises
  12px into place. **Gotcha:** the cards' start delay lives in a class on
  `<html>` (`reveal-delay`) that must stay until they finish; removing it
  mid-run shortens every remaining delay and the stagger jumps ahead.

### Sounds (`src/lib/sound.ts`)

- [Cuelume](https://github.com/Danilaa1/cuelume): synthesized interaction
  sounds, no audio files. On by default at volume 0.6; the choice is saved in
  `localStorage['sound']` (`'off'` = muted) since Cuelume doesn't persist
  anything. `useSoundEnabled()` / `setSoundEnabled()` drive the mute button in
  the contact navbar. Used so far: `toggle` on every chip, `success` on Send and
  Copy brief, `arrival` when navigating to the contact page, `bloom` on the
  contact navbar's back arrow (and the About page's), `scan` on the About link, `page` on the theme toggle (volume 0.35), `error` when Send is
  pressed with a mandatory field missing, and a quiet `tick` (volume 0.1) when
  the mouse enters a button (`startHoverSounds()`: one delegated
  `pointerover` listener over `button`, `.glass-pill`, `.chip` and `nav a`;
  mouse only, deliberately no cooldown, so sweeping a row of chips ticks once per chip). Cuelume's own `data-cuelume-hover`
  binding can't set a per-element volume, hence the listener. **Note:** Cuelume ignores `play()` until the page has had a
  real user gesture (`navigator.userActivation`), so scripted clicks in tests
  need `userGesture: true`.

### Glass ("Frost") surfaces (`src/index.css`)

- Frosted cards and controls from the Frost design: `@utility glass`
  (translucent fill, sheen, inset top highlight, `backdrop-filter`), tokens in
  `:root` / `.dark`. No borders on buttons or chips; the edge is a top
  highlight plus a soft shadow. The blobs from the original Frost mock were
  removed; the code rain is the only thing behind the glass.
- `.glass-pill` (all buttons and CTAs, via `CtaPill`): a slight tint, darker than
  the card in light mode and lighter in dark, red arrow. `.chip`: same tint;
  the selected chip is the brightest thing (bright glass in dark, solid white
  and lifted 1px in light) and shows a bare check (no circle, no colour).
- `.fold`: follow-up questions open with a height + fade animation and their
  chips fan out (`.fold-item`); closed folds are `inert` and take no space.

### Contact page (`src/pages/Contact.tsx`)

- "Tell me what to build." A six-step project brief in the Frost style: what
  are we building (with follow-up kinds), about you, what goes on it, how should
  it feel (style / theme / language, each with a "Both" option), the practical
  bits (domain, email, timing), anything else.
- Mandatory fields are name and email, marked with a grey `*` after the
  label. The form has `noValidate` and validates itself: Send with either
  missing (or the email malformed) plays `error`, turns that field's `*` red,
  focuses the first one and doesn't send; after the first attempt the stars
  follow the fields live.
- There is no backend. Send builds a `mailto:` to `tjernstrom@proton.me` with
  the answered questions only, then shows "Hit send." with Open mail app /
  Copy brief / Edit brief. Copy is honest about it being a draft.
- Desktop: the left glass panel holds the pitch, "What I build", recent client
  work, GitHub ("More work") and the plain-email line. It follows the scroll on
  screens >= 900px tall (`.pitch-sticky`); it is taller than the screen, so it
  pins by its bottom edge (`--panel-h` is set from a `ResizeObserver`). The
  same content sits below the form on mobile.

### Type / label system (page-wide)

**Update 2026-09-25: no more capitals.** Everything is now sentence case (a
capital first letter, the rest as you'd write it): no `uppercase`, and the wide
letter-spacing that suited capitals is gone. Display type (hero name, headings)
has a hair of negative tracking (`-0.01em` to `-0.02em`); the small Geist Mono
labels have `0.03em` and are 11 to 12px (was 10 to 11px in capitals). The hero
name reads "tjrnstrm" (the brand, lowercase, with a red dot). Where this section
below says "uppercase" or `tracking-[0.3em]`, read it as superseded.

**Sora for the big type only.** `--font-headline` (`font-headline`) is Sora, used
for the hero name, the About and closing-band headings, the contact headline
and question titles, and "Hit send.". Buttons, chips, the navbar and
paragraphs stay Geist / Inter, and the small labels Geist Mono. Sora is wide, so
those headings are sized a little smaller than the Geist ones were (the
contact headline is `clamp(2.5rem, 3.7vw, 3.75rem)` on wide screens).

**Red.** The accent is used sparingly: the small arrows on actions, and the
asterisk of a required field left empty (as an error). Not on headings, not on
the hero name.

**Hero centring.** The red dot after "tjrnstrm" is a zero-width inline-block
that hangs past the word, so the word itself is centred (measured: word,
kicker and status row all centre on the viewport centre). The name is lifted
`-0.09em` so the space above and below the lowercase letters is equal
(measured 66 / 68px on desktop); lowercase sits low in its line box, which made
the name look pushed toward the status row.

Deliberate split so the chrome reads technical and the prose reads human:

- **Geist** (`font-heading`) — the display voice, now uniformly **thin + wide**
  to match the hero wordmark: hero name `font-extralight` / `tracking-[0.3em]`;
  section headings `WORK.` `ABOUT.` at
  `font-light` / `tracking-[0.15em]` / `clamp(2rem,5.5vw,3.5rem)` (was
  `font-black text-8xl`), each ending in a red `.` — the site's one spot of
  colour. The `.` span carries no margin fix, so it inherits the heading's
  `tracking-[0.15em]` and the gap before it matches every other letter gap.
  Project card titles: Geist `font-medium`.
- **Geist Mono** (`font-mono`) — every label and every piece of data: section
  eyebrows, sub-labels (Skills / Experience / Education), date ranges, skill
  pills, project URLs + tags, the footer, the
  CV / LinkedIn / GitHub / email links in About.
- **Inter** (`font-display`) — body copy only (paragraphs).

### About (`src/components/About.tsx`)

- **Experience** block above Education: `Barrion · Fullstack Developer Intern`,
  `2026 – Present`, one-line stack description (Turborepo monorepo, Next.js,
  Express + Hono, PostgreSQL + Drizzle, Google Cloud, AI-assisted with Claude).
  Entry-title separators are `·` (were em dashes — Alex dislikes em dashes).
- Skills list gained `PostgreSQL & Drizzle`, `Turborepo`, `Google Cloud`,
  `Stripe`; pills are Geist Mono.
- Intro prose (Alex-authored, lightly cleaned): opens "Hi, I'm **Alexander
  Tjernström**, a fullstack developer based in Stockholm." — main on-page home
  for the full name now that the hero is surname-only. No frontend-preference
  line; para 3 mentions Barrion + "AI-assisted workflow". **No em dashes in
  copy.**
- Heading `<h2>` `ABOUT.` (thin Geist + red period). Eyebrow + all sub-labels +
  date ranges are Geist Mono.
- **Contact info lives here now** — there is no Contact section. Under the
  CV / LinkedIn / GitHub row in the bio column there's a `mailto:` link showing
  `tjernstrom@proton.me` (`tracking-normal` so the address isn't spread; was
  a hotmail address until 2026-09-25). The bio already closes with "feel free
  to reach out". The old Contact *section* and the `#contact` nav item were
  deleted; the separate `/contact` *page* (below) is a different thing.

**Full name lives in:** the About intro line (above), the footer copyright
(`© 2026 Alexander Tjernström`), the `<h1 aria-label>` in the hero, and
`index.html` `<title>` (`Alexander Tjernström — Fullstack Developer`) + meta
description. The visible hero stays surname-only by design.

### Section rhythm (Projects / About)

Unified so the sections read as one document, not floating islands:

- Every section: `py-14` (About had `pt-8 sm:pt-16` and **no bottom padding** —
  that asymmetry was the "About floating in space" bug).
- Heading block (eyebrow + `H2.` + `border-b`): `pb-5 mb-8 sm:mb-12`
  (was `mb-15` / `mb-6 sm:mb-15`).
- About's content grid lost its `my-6 sm:my-12` — it was stacking on top of the
  heading's `mb`, leaving ~108px of void between the rule and the content. The
  heading `mb` alone sets that gap now.

### Other

- `Projects.tsx`: heading `<h2>` `WORK.`; eyebrow + `SectionLabel` (`<h3>`) +
  "see more" link are Geist Mono. Dropped a stray `{" "}` text node.
- `ProjectCard.tsx`: title is Geist `font-medium tracking-wide`; project URL +
  tag pills are Geist Mono.
- `index.html`: `<title>` = `Alexander Tjernström · Fullstack Developer`
  (name first, `·` not em dash). Open Graph + Twitter Card tags added with
  `og:title` / `twitter:title` = **`Alexander Tjernström`** so shared links
  (Vercel URL in Slack/iMessage/etc.) lead with the name, role in the
  description. No OG image yet (`summary` card); `og:url` not set — add the
  real Vercel URL when known.
- `Marquee.tsx` was deleted (2026-09-25, changelog 26). The hero now ends with
  a fade instead of a strip.
- `Footer.tsx`: left-aligned (was centered), `border-t`, Geist Mono, two items —
  `© 2026 Alexander Tjernström` / `Built with React + Tailwind`.

---

## Open questions / pending decisions

### Slogan wording — "works" vs "looks"

Current: *"Software should feel as good as it works."*
Candidate: *"…as good as it looks."*

**Recommendation: keep "works".** Reasoning:

- "feel as good as it **looks**" pairs two surface qualities (feel + looks) — it's
  close to tautological and it's the thing every design portfolio says.
- "feel as good as it **works**" assumes competence and *adds* that craft/feel
  matters — a stronger, less expected claim, and it's lifted from the About copy.
- For a **fullstack** role, "works" signals more range; "looks" can pigeonhole as
  visual-only. The UI/UX skill is already evidenced by the site itself and the
  About text, so the slogan doesn't need to carry it.
- If design-forward positioning is the goal, a non-tautological alternative:
  *"Software should work as well as it looks."* (leads with looks, still claims
  it works).

_Status: undecided — Alex leaning "looks" for UI/UX emphasis._

---

## Artifacts (design explorations)

These are Claude artifacts (hosted on claude.ai). Full source for Cold Open is
embedded below so it survives without the link.

### Cold Open — first-screen directions

<https://claude.ai/code/artifact/3a56963c-8420-42fc-8913-ebd4508d48cc>

Three from-scratch landing-screen directions in the site's visual language:

- **A — Lead with the line.** Centered thesis sentence, name/role as a kicker,
  red period, marquee at the bottom. → **This is what shipped in the Hero.**
- **B — Open on the index.** Name as masthead + a ruled, numbered index of every
  section with live meta (`03 Currently — Barrion · Fullstack`). Idea kept in
  reserve for the section just below the fold.
- **C — Name at full volume.** Name edge-to-edge, second word as an outline
  wordmark, small `Status` panel in the corner. (Was prototyped in the Hero
  earlier with Geist + a live clock, then replaced by A.)

### Backdrop — animated background options

<https://claude.ai/code/artifact/7335a210-e51f-4b8c-a5fc-eb1c97e491e6>

Four faint animated backgrounds for the first screen:

- **A — Aurora drift.** CSS blurred colour fields drifting. Zero JS.
  → Shipped briefly as `.hero-bg`, then replaced by the code-rain canvas.
- **B — Dot grid + pointer glow.** Faint dot matrix lit under the cursor.
- **C — Constellation.** Drifting nodes + proximity lines (kept very dim).
- **D — Flow field.** ~500 particles on a warping current. Heaviest.

### Surname Study — hero built around just "TJERNSTRÖM"

<https://claude.ai/code/artifact/22772658-5d49-4fc8-ac5d-22ce719fa001>

**Take one** (rejected — too loud, and the outline version ran off-screen):
hollow monument wall / left baseline lockup / red Ö / two-row solid+outline
stack.

**Take two** (current) — minimal + readable, thin Geist weight (200), name fits
on one line, code rain faint behind:

- **A — Airy wordmark.** Thin, wide letter-spacing (~0.34em), centered, calm
  size. Mono kicker + CTA. The site's own thin/spaced label style at display
  size. Optional red period.
- **B — Full-width band.** The 10 letters distributed edge-to-edge across the
  content width (`display:flex; justify-content:space-between`). Always fits by
  construction. Least forgiving on narrow screens.
- **C — Identity lockup.** Thin name + role directly under it in Geist Mono,
  locked as one centered block. Says who + what without a sentence.
- **D — Left masthead.** Thin name, left-aligned, hairline rule under it (same
  divider as every section heading). Treats the hero as the page's first
  section.

_Status: **A picked and shipped** (take two) — airy wordmark, no red period
("made the name look off-centre"). See Hero in Current state._

---

## Changelog

### 2026-08-29

1. **About:** added Barrion internship (Experience block), updated skills + intro
   prose. Pulled the real stack from `github.com/barrionhq/barrion`.
2. **Explorations:** published *Cold Open* (3 first-screen directions) and, after
   picking a font direction, *Backdrop* (4 animated backgrounds).
3. **Fonts:** added Geist + Geist Mono. Geist for the big display headings
   (`Hero` name experiment, `WORK`, `ABOUT`), Geist Mono for spec-style labels.
   Inter stays for body and the final Hero statement.
4. **Hero — direction C prototype:** giant `ALEXANDER / TJERNSTRÖM` wordmark
   (Geist Black, second word outlined) + glass `Status` panel with a live
   Stockholm clock. Superseded in step 6.
5. **Navbar:** full name `Alexander Tjernström` in the left slot, collapsing to
   `AT` on scroll; added `WORK / ABOUT / CONTACT` menu; section anchors + smooth
   scroll; removed "BACK TO TOP".
6. **Hero — switched to direction A** ("Lead with the line"): centered statement
   *"Software should feel as good as it works."*, kicker, CTA. Reverted the
   statement to Inter 800 to match the mock. Restored the vertical scroll
   indicator on the right.
7. **Layout:** Hero + Marquee share one `100dvh` flex column so the marquee is
   visible on load. First cut used a `- 74px` guess; replaced with a measured
   `--nav-h` CSS variable (`useLayoutEffect` + resize + `fonts.ready`).
8. **Navbar polish:** name → just `Tjernström`, bigger (`text-lg`); tried
   `tracking-[0.2em]` (too wide) → settled near `tracking-widest`. Name now
   stays unchanged when the bar becomes a pill (no `AT` morph).
9. **Theme toggle restyle:** dropped the bordered pill; now matches the
   `.nav-link` menu items (borderless, snappy hover), `FiSun`/`FiMoon`,
   uppercase label, `aria-label`, `:focus-visible` outline.
10. **Status ripple:** rebuilt as a crisp `box-shadow` ring (blur radius 0) that
    starts tight and bright and expands + fades — no soft glow.
11. **Hero background:** added `.hero-bg` — three super-faded blurred blobs
    drifting slowly (Backdrop direction A, animated). Removed the static `body`
    background-image glow.
12. Created this file.
13. **Hero background v2:** blobs were too slow to read as motion — replaced with
    a canvas **code-rain** effect (`src/components/HeroBackground.tsx`): faint
    falling Geist Mono glyphs, masked to stay quiet behind the headline,
    off-screen-paused, reduced-motion static frame. `.hero-bg` CSS removed.
14. **Page-wide cohesion pass** to match the hero:
    - Established the Geist / Geist Mono / Inter split (see Type / label system).
      Every label + data point on the page is now Geist Mono; headings Geist;
      body Inter.
    - Red `.` added after `WORK` / `ABOUT` / `CONTACT`, echoing the hero period.
    - `Projects` / `About` headings downgraded `<h1>` → `<h2>` (`SectionLabel`
      → `<h3>`); Hero keeps the only `<h1>`.
    - **Contact extracted into its own `Contact.tsx` section** (was a cramped
      `text-[11px]` block tacked on the end of About with a stray bottom border
      — the "feels super off" problem). Now a full section with a spec-list
      layout that matches the hero status panel.
    - `Footer` restyled: left-aligned, `border-t`, mono, two items.

### 2026-08-30

15. **Exploration:** published *Surname Study* — 4 hero treatments built around
    just `TJERNSTRÖM`, code rain running behind each (hollow outline wall /
    left baseline lockup / centered with a red Ö / two-row solid+outline stack).
16. **Surname Study take two:** all four rejected (too loud; the outline wall ran
    off-screen). Re-cut as 4 **minimal + thin** options — airy wordmark /
    full-width letter band / name+role lockup / left masthead with a rule.
17. **Hero → "Airy wordmark" (A), shipped.** Replaced the statement with a thin
    (`font-extralight` / Geist 200) uppercase `TJERNSTRÖM`, `tracking-[0.3em]`
    (`-mr-[0.3em]` to recentre), kicker → `FULLSTACK DEVELOPER · STOCKHOLM`
    (mono), CTA → mono, `gap-10 sm:gap-12`. No red period. Geist `@import`
    widened to `100..900`. Code rain + scroll indicator unchanged.
18. **Post-hero cohesion pass** (display type had gone thin in the hero but the
    sections were still `font-black text-8xl`):
    - Section headings `WORK.` / `ABOUT.` / `CONTACT.` → `font-light` /
      `tracking-[0.15em]` / `clamp(2rem,5.5vw,3.5rem)`; red period tightened
      with `-ml-[0.15em]`.
    - Nav wordmark `font-semibold` → `font-light`.
    - Project card titles → Geist `font-medium`.
    - **Full name placement:** About intro now opens "I'm **Alexander
      Tjernström**, …"; `<title>` → `Alexander Tjernström — Fullstack
      Developer` + meta description. (Footer copyright already carried it.)
19. Hero `<h1>` set to `TJERNSTROM` (plain `o`) on purpose, for now.
20. **Theme toggle → icon-only.** Dropped the `LIGHT`/`DARK` text and the
    `.nav-link` box; tight `p-1.5`, colour-only hover, 15px icon, `-mr-1`
    alignment, own `focus-visible`. (Hover rectangle + tiny icon read as
    clunky.)
21. **Red heading period:** removed the `-ml-[0.15em]` tuck so the `.` sits at
    the same `tracking-[0.15em]` rhythm as the letters in the word.
22. **Code rain → site-wide, then reverted.** Tried a fixed viewport canvas in
    `App.tsx` (`SiteBackground.tsx`); it read as pinned to the glass and a
    full-page animated canvas is too heavy. Back to hero-scoped
    `HeroBackground.tsx` (original alpha + mask). `SiteBackground.tsx` deleted.
23. **Nav wordmark → matches the hero name.** `font-heading font-extralight
    uppercase tracking-[0.3em]`. Not a `.nav-link` (logo, not a menu item): no
    padding box, hover fades to `opacity-70`. Text `Tjernstrom` (plain `o`) to
    match the hero. Bumped to `text-sm` (vs `text-xs` links) so it stands out.
24. **Section rhythm pass.** All sections → `py-14` (About was asymmetric —
    the cause of "About floating in space"); heading blocks → `mb-8 sm:mb-12`;
    removed the redundant `my-*` on the About/Contact content grids. See
    *Section rhythm*.
25. **Contact section removed.** Deleted `Contact.tsx` + the `#contact` nav
    item. The email is now a `mailto:` link under the CV/LinkedIn/GitHub row
    in the About bio (which already ends with "feel free to reach out"). Nav
    menu is `WORK / ABOUT`.

### 2026-09-25

26. **Marquee removed.** The hero stays one viewport; the code-rain mask now
    fades to transparent at the bottom so nothing needs to cap it, and the hero
    content is centred on the true viewport middle.
27. **Nav menu** letter-spacing matches the wordmark (`0.3em`); contact email
    is now `tjernstrom@proton.me`.
28. **Contact page** at `/contact` (react-router), plus CTAs: `Start a project`
    pill in the nav, `Tell me what to build →` in the hero (`See the work ↓`
    moved to the bottom), and a closing band on the home page.
29. **Frost glass** applied to the contact page and all buttons; dark is the
    default theme.
30. **Chip and button states** iterated: bordered chips with a red check were
    replaced by borderless tinted chips with a bare check; selected = brightest.
31. **Unfold options** for follow-up questions; Both options for theme and
    language; six steps (added domain / email / timing to Frost's five).
32. **Sticky pitch panel** on the contact page (>= 900px tall), with services,
    client work, GitHub and email inside it.
33. **Page transition:** tried a slide-over (looked cheap), then chose the
    staggered fade (see Routing, dark default and transitions).
34. **Contact navbar:** back arrow instead of the wordmark, no menu, plus a
    sound toggle beside the theme toggle. Full-width bar at the top, turning
    into a glass pill as wide as the pitch panel (same gap as the cards) on
    scroll.
35. **Feedback sounds** with Cuelume and a persisted mute switch (see Sounds).
36. **Contact page:** mandatory name and email with red stars on a failed Send;
    removed the "Taking new projects" tag (the home page already says it) and
    its `.glass-tag` styles; hover tick on buttons.
37. **Home page simplified:** removed the Work section, moved About to its own
    `/about` page, removed the wordmark and the Work link from the navbar,
    removed the Scroll indicator (and the now dead `See the work ↓` link and
    the unused `scroll-line` / `marquee` keyframes).
38. **Contact page:** 40px between the content and the footer line (the form
    used to end flush with it, then 20px looked too tight); the sticky panel's
    bottom margin is the same 40px.
39. **Home is one screen:** the closing "Tell me what to build" band moved to
    the About page; the footer now lies transparently over the hero (no
    separator, home only); the navbar no longer pills on scroll on home.
40. **Navbar buttons:** `Start a project` is the quiet pill; the About link lost
    its hover background (text softens instead) and plays `arrival`.
41. **Theme follows the system** unless the visitor toggles it (saved as
    `theme-choice`).
42. **Sentence case site-wide** (was uppercase with 0.1 to 0.3em tracking): hero,
    headings, labels, navbar, footer, buttons, contact page. The contact page
    footer gap is 40px.
43. **Sora for the big type only**, the red dot after the lowercase "tjrnstrm",
    hero centring fixes (hanging dot, optical lift), and `scan` on the About link.
44. **Red is now only for action arrows and error stars.** The red full stops on
    headings are gone (they were plain periods now), and so is the hero dot. The
    About and contact headings share one class string (`PAGE_HEADING` in
    `src/lib/type.ts`), so they are the same size at every width.

---

## Appendix — Cold Open full source

<details>
<summary>cold-open.html (self-contained artifact)</summary>

```html
<title>Cold Open</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,400..600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap">

<style>
  :root {
    --bg: #f4f3f1;
    --surface: #ffffff;
    --surface-2: #ececef;
    --border: #e0dfe4;
    --border-strong: #cbcad2;
    --text: #17171b;
    --muted: #67666f;
    --faint: #9896a1;
    --accent: #d83a3f;

    --font-ui: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
    --font-display: "Newsreader", Georgia, "Times New Roman", serif;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #0c0c0f;
      --surface: #141418;
      --surface-2: #1c1c22;
      --border: rgba(255, 255, 255, 0.09);
      --border-strong: rgba(255, 255, 255, 0.17);
      --text: #ececed;
      --muted: #9a99a3;
      --faint: #6c6b76;
      --accent: #f0595e;
    }
  }
  :root[data-theme="dark"] {
    --bg: #0c0c0f;
    --surface: #141418;
    --surface-2: #1c1c22;
    --border: rgba(255, 255, 255, 0.09);
    --border-strong: rgba(255, 255, 255, 0.17);
    --text: #ececed;
    --muted: #9a99a3;
    --faint: #6c6b76;
    --accent: #f0595e;
  }

  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-ui);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .wrap {
    max-width: 1120px;
    margin: 0 auto;
    padding: clamp(2rem, 5vw, 4rem) clamp(1.1rem, 4vw, 2.75rem) 6rem;
  }

  /* ---------- doc header ---------- */
  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: clamp(2.25rem, 5vw, 3.5rem);
  }
  .eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--faint);
    font-weight: 600;
    margin: 0 0 1rem;
  }
  h1 {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(2.3rem, 6vw, 3.5rem);
    line-height: 1.04;
    letter-spacing: -0.015em;
    margin: 0 0 1.3rem;
    text-wrap: balance;
  }
  .lede {
    font-size: clamp(1rem, 1.5vw, 1.16rem);
    max-width: 62ch;
    margin: 0;
    color: var(--muted);
  }
  .lede b { color: var(--text); font-weight: 600; }

  .themebtn {
    flex: none;
    font-family: var(--font-ui);
    font-size: 0.64rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--muted);
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 100px;
    padding: 0.42rem 0.85rem;
    cursor: pointer;
    transition: border-color 150ms ease, color 150ms ease;
  }
  .themebtn:hover { border-color: var(--accent); color: var(--accent); }
  .themebtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  /* ---------- direction block ---------- */
  .dir {
    border-top: 1px solid var(--border);
    margin-top: clamp(3rem, 7vw, 4.5rem);
    padding-top: clamp(1.5rem, 3.5vw, 2.25rem);
  }
  .dir-head {
    display: flex;
    align-items: baseline;
    gap: 0.85rem;
    margin-bottom: 1.4rem;
  }
  .tag {
    font-family: var(--font-ui);
    font-weight: 700;
    font-size: 0.74rem;
    letter-spacing: 0.05em;
    color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 4px;
    padding: 0.13rem 0.48rem;
    line-height: 1;
    flex: none;
    position: relative;
    top: -0.12em;
  }
  .dir-head h2 {
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 500;
    font-size: clamp(1.45rem, 3vw, 1.95rem);
    letter-spacing: -0.01em;
    margin: 0;
  }

  /* ---------- the mock screen ---------- */
  .screen {
    container-type: inline-size;
    width: 100%;
    aspect-ratio: 16 / 10;
    border: 1px solid var(--border-strong);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    background: #09090b;
    color: #ededee;
    font-family: var(--font-ui);
    display: grid;
  }
  .screen::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 48%, rgba(30, 27, 75, 0.42) 0%, transparent 60%),
      radial-gradient(ellipse at 82% 16%, rgba(22, 33, 62, 0.5) 0%, transparent 60%);
    pointer-events: none;
  }
  .screen > * { position: relative; z-index: 1; }

  /* shared nav */
  .scr-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2.4cqw 3cqw;
    font-size: 1.15cqw;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #d9d9dd;
  }
  .scr-nav .mark { font-weight: 300; letter-spacing: 0.25em; }
  .scr-nav .scr-links { display: flex; gap: 1.6cqw; color: #8f8f99; }
  .scr-nav .scr-links b { color: #d9d9dd; font-weight: 500; }

  /* shared marquee strip */
  .scr-marquee {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5cqw 0;
    display: flex;
    gap: 2.4cqw;
    white-space: nowrap;
    font-size: 1.05cqw;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7f7f8a;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
            mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  }
  .scr-marquee > div {
    display: flex;
    gap: 2.4cqw;
    padding-left: 2.4cqw;
    animation: scrl 22s linear infinite;
  }
  .scr-marquee .sep { color: #45454e; }
  @keyframes scrl { to { transform: translateX(-100%); } }

  .c-green {
    display: inline-flex;
    align-items: center;
    gap: 0.7cqw;
    color: #5cd08a;
  }
  .c-green::before {
    content: "";
    width: 0.9cqw; height: 0.9cqw;
    border-radius: 50%;
    background: #5cd08a;
    box-shadow: 0 0 0 0.7cqw rgba(92, 208, 138, 0.16);
  }

  /* ===== Direction A — Statement ===== */
  .s-statement { grid-template-rows: auto 1fr auto; }
  .s-statement .scr-mid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 8cqw;
    gap: 3.4cqw;
  }
  .s-statement .scr-kicker {
    margin: 0;
    font-size: 1.2cqw;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #9a9aa4;
  }
  .s-statement .scr-statement {
    margin: 0;
    font-weight: 800;
    font-size: 6.1cqw;
    line-height: 1.03;
    letter-spacing: -0.02em;
    max-width: 15ch;
    text-wrap: balance;
    color: #f3f3f4;
  }
  .s-statement .scr-statement .dot { color: var(--accent); }
  .s-statement .scr-cta {
    display: flex;
    gap: 2.4cqw;
    font-size: 1.15cqw;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #9a9aa4;
  }

  /* ===== Direction B — Masthead index ===== */
  .s-index { grid-template-rows: auto 1fr; padding-bottom: 3cqw; }
  .s-index .scr-body {
    padding: 2cqw 5cqw 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4cqw;
  }
  .s-index .scr-namebLock { display: flex; align-items: flex-end; justify-content: space-between; gap: 3cqw; }
  .s-index .scr-name {
    margin: 0;
    font-weight: 800;
    font-size: 7cqw;
    line-height: 0.92;
    letter-spacing: -0.02em;
    color: #f2f2f3;
  }
  .s-index .scr-meta {
    text-align: right;
    font-size: 1.05cqw;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #8a8a94;
    line-height: 1.9;
    white-space: nowrap;
  }
  .s-index .scr-list { display: flex; flex-direction: column; }
  .s-index .scr-list .row {
    display: grid;
    grid-template-columns: 3cqw 1fr auto;
    align-items: baseline;
    gap: 2cqw;
    padding: 1.7cqw 0;
    border-top: 1px solid rgba(255, 255, 255, 0.11);
    font-size: 1.75cqw;
  }
  .s-index .scr-list .row:last-child { border-bottom: 1px solid rgba(255, 255, 255, 0.11); }
  .s-index .scr-list .num { color: var(--accent); font-size: 1.1cqw; font-weight: 600; letter-spacing: 0.1em; }
  .s-index .scr-list .label { color: #e6e6e8; font-weight: 500; letter-spacing: -0.005em; }
  .s-index .scr-list .val {
    color: #8a8a94;
    font-size: 1.15cqw;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
  }

  /* ===== Direction C — Type wall + status ===== */
  .s-wall { grid-template-rows: auto 1fr auto; }
  .s-wall .scr-stage {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 3cqw;
    overflow: hidden;
  }
  .s-wall .scr-name {
    margin: 0;
    font-weight: 900;
    font-size: 13.5cqw;
    line-height: 0.86;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .s-wall .scr-name .l2 {
    display: block;
    color: transparent;
    -webkit-text-stroke: 0.12cqw #6a6a76;
  }
  .s-wall .scr-status {
    position: absolute;
    right: 3cqw;
    bottom: 3cqw;
    width: 33cqw;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 1cqw;
    background: rgba(10, 10, 12, 0.6);
    backdrop-filter: blur(4px);
    padding: 2cqw 2.2cqw;
    display: flex;
    flex-direction: column;
    gap: 1.15cqw;
    font-size: 1.15cqw;
    letter-spacing: 0.04em;
  }
  .s-wall .scr-status .st-h {
    font-size: 0.95cqw;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #6c6c77;
    margin-bottom: 0.4cqw;
  }
  .s-wall .scr-status .st-row { color: #c9c9d0; }
  .s-wall .scr-status .st-row .k { color: #7c7c87; display: inline-block; width: 8cqw; }
  .s-wall .scr-status .st-row b { color: #f0f0f2; font-weight: 600; }

  /* entrance */
  .screen .anim {
    opacity: 0;
    transform: translateY(0.5em);
    animation: rise 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
  }
  .screen .anim.d1 { animation-delay: 0.12s; }
  .screen .anim.d2 { animation-delay: 0.26s; }
  .screen .anim.d3 { animation-delay: 0.4s; }
  @keyframes rise { to { opacity: 1; transform: translateY(0); } }

  /* ---------- rationale row ---------- */
  .why {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(1rem, 3vw, 2.25rem);
  }
  @media (max-width: 760px) { .why { grid-template-columns: 1fr; gap: 1.3rem; } }
  .why h3 {
    font-size: 0.66rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--faint);
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
  .why p { margin: 0; font-size: 0.92rem; color: var(--muted); }
  .why p b { color: var(--text); font-weight: 600; }

  /* ---------- recommendation ---------- */
  .rec {
    border-top: 1px solid var(--border);
    margin-top: clamp(3rem, 7vw, 4.5rem);
    padding-top: clamp(1.5rem, 3.5vw, 2.25rem);
  }
  .rec .eyebrow { color: var(--accent); }
  .rec h2 {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(1.35rem, 3vw, 1.85rem);
    margin: 0 0 1rem;
  }
  .rec p { max-width: 66ch; margin: 0 0 0.9rem; color: var(--muted); }
  .rec p:last-child { margin-bottom: 0; }
  .rec b, .rec .pick { color: var(--text); font-weight: 700; }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
    .screen .anim { opacity: 1; transform: none; }
    .scr-marquee > div { animation: none; }
  }
</style>

<div class="wrap">

  <header>
    <div class="top">
      <div>
        <p class="eyebrow">Portfolio &middot; landing screen</p>
        <h1>Cold Open</h1>
        <p class="lede">
          Three ways to build the first screen from scratch &mdash; not tweaks to the
          current hero. Same world as the rest of the site (Inter, near&#8209;black,
          indigo haze, one red accent, the marquee), but each takes a different
          <b>first move</b>: a line, an index, or the name at full volume.
        </p>
      </div>
      <button class="themebtn" id="themebtn" type="button">Theme</button>
    </div>
  </header>

  <!-- ========== A ========== -->
  <section class="dir">
    <div class="dir-head"><span class="tag">A</span><h2>Lead with the line</h2></div>

    <div class="screen s-statement">
      <div class="scr-nav">
        <span class="mark">AT</span>
        <span class="scr-links"><b>Work</b><span>About</span><span>Contact</span></span>
      </div>
      <div class="scr-mid">
        <p class="scr-kicker anim d1">Alexander Tjernstr&ouml;m &mdash; Fullstack Developer, Stockholm</p>
        <h3 class="scr-statement anim d2">Software should feel as good as it works<span class="dot">.</span></h3>
        <div class="scr-cta anim d3">
          <span class="c-green">Open to work</span>
          <span>See the work &darr;</span>
        </div>
      </div>
      <div class="scr-marquee">
        <div>
          <span>Clean, scalable frontends</span><span class="sep">&bull;</span>
          <span>React &amp; TypeScript</span><span class="sep">&bull;</span>
          <span>Design &times; development</span><span class="sep">&bull;</span>
          <span>AI-assisted workflows</span><span class="sep">&bull;</span>
          <span>Pixel-perfect UI</span><span class="sep">&bull;</span>
          <span>Clean, scalable frontends</span><span class="sep">&bull;</span>
          <span>React &amp; TypeScript</span><span class="sep">&bull;</span>
          <span>Design &times; development</span><span class="sep">&bull;</span>
          <span>AI-assisted workflows</span><span class="sep">&bull;</span>
          <span>Pixel-perfect UI</span><span class="sep">&bull;</span>
        </div>
      </div>
    </div>

    <div class="why">
      <div><h3>What you land on</h3><p>A centred thesis sentence, name and role shrunk to a kicker above it. The period is the only spot of red. Marquee still anchors the bottom.</p></div>
      <div><h3>Why it fits</h3><p>You already have a point of view &mdash; <b>&ldquo;as good as it works&rdquo;</b> is pulled straight from your About text. Leading with it says <b>taste</b> before it says <b>name</b>.</p></div>
      <div><h3>Watch out</h3><p>The line has to earn the space. It needs to be genuinely yours and stay short; a weak slogan here is worse than no slogan.</p></div>
    </div>
  </section>

  <!-- ========== B ========== -->
  <section class="dir">
    <div class="dir-head"><span class="tag">B</span><h2>Open on the index</h2></div>

    <div class="screen s-index">
      <div class="scr-nav">
        <span class="mark">AT</span>
        <span class="scr-links"><span>SWE &middot; ENG</span><span>14:32 CET</span></span>
      </div>
      <div class="scr-body">
        <div class="scr-namebLock">
          <h3 class="scr-name anim d1">Alexander<br>Tjernstr&ouml;m</h3>
          <p class="scr-meta anim d1">Fullstack Developer<br>Frontend&#8209;leaning<br>Stockholm, Sweden</p>
        </div>
        <div class="scr-list">
          <div class="row anim d2"><span class="num">01</span><span class="label">Selected Work</span><span class="val">4 projects &middot; 2023&mdash;25</span></div>
          <div class="row anim d2"><span class="num">02</span><span class="label">About &amp; Approach</span><span class="val">Design &times; Dev</span></div>
          <div class="row anim d3"><span class="num">03</span><span class="label">Currently</span><span class="val">Barrion &middot; Fullstack</span></div>
          <div class="row anim d3"><span class="num">04</span><span class="label">Get in touch</span><span class="val">Open to work</span></div>
        </div>
      </div>
    </div>

    <div class="why">
      <div><h3>What you land on</h3><p>The whole site's shape at once: name as masthead, then a ruled, numbered index of every section with live meta on the right.</p></div>
      <div><h3>Why it fits</h3><p>Reads like a design studio's site. Rewards the visitor who wants to navigate &mdash; recruiters scanning fast see <b>Currently: Barrion</b> and <b>Open to work</b> without scrolling.</p></div>
      <div><h3>Watch out</h3><p>Less emotional impact on entry. The index has to stay honest &mdash; four real rows, not padded to look busier.</p></div>
    </div>
  </section>

  <!-- ========== C ========== -->
  <section class="dir">
    <div class="dir-head"><span class="tag">C</span><h2>Name at full volume</h2></div>

    <div class="screen s-wall">
      <div class="scr-nav">
        <span class="mark">AT</span>
        <span class="scr-links"><b>Work</b><span>About</span><span>Contact</span></span>
      </div>
      <div class="scr-stage">
        <h3 class="scr-name anim d1">Alexander<span class="l2">Tjernstr&ouml;m</span></h3>
        <div class="scr-status anim d3">
          <p class="st-h">Status</p>
          <p class="st-row c-green">Open to work</p>
          <p class="st-row"><span class="k">Now</span><b>Fullstack intern @ Barrion</b></p>
          <p class="st-row"><span class="k">Base</span>Stockholm &middot; 14:32 CET</p>
          <p class="st-row"><span class="k">Stack</span>React &middot; TS &middot; Node</p>
        </div>
      </div>
      <div class="scr-marquee">
        <div>
          <span>Clean, scalable frontends</span><span class="sep">&bull;</span>
          <span>React &amp; TypeScript</span><span class="sep">&bull;</span>
          <span>Design &times; development</span><span class="sep">&bull;</span>
          <span>AI-assisted workflows</span><span class="sep">&bull;</span>
          <span>Pixel-perfect UI</span><span class="sep">&bull;</span>
          <span>Clean, scalable frontends</span><span class="sep">&bull;</span>
          <span>React &amp; TypeScript</span><span class="sep">&bull;</span>
          <span>Design &times; development</span><span class="sep">&bull;</span>
          <span>AI-assisted workflows</span><span class="sep">&bull;</span>
          <span>Pixel-perfect UI</span><span class="sep">&bull;</span>
        </div>
      </div>
    </div>

    <div class="why">
      <div><h3>What you land on</h3><p>The name set edge to edge, second word as an outline so it reads as one graphic mark. A small <b>Status</b> panel pins the real facts in the corner.</p></div>
      <div><h3>Why it fits</h3><p>Closest to your current instinct but committed: if the name is going to be huge, make it <i>the</i> thing and let a data panel carry the substance so it isn't all surface.</p></div>
      <div><h3>Watch out</h3><p>Boldest and the easiest to misjudge &mdash; the type craft has to be tight (kerning, the crop, the outline weight) or it looks like a placeholder.</p></div>
    </div>
  </section>

  <!-- ========== recommendation ========== -->
  <section class="rec">
    <p class="eyebrow">Our take</p>
    <h2>Lead with the line (A), borrow the index from B</h2>
    <p>
      <span class="pick">A</span> is the one that sounds like you rather than like a
      template. It puts your actual position &mdash; craft, feel, restraint &mdash; on the
      first screen, and the single red period is the whole personality budget spent well.
    </p>
    <p>
      Then steal <span class="pick">B</span>'s numbered index for the section
      <i>below</i> the fold, so the calm opening is backed by a fast way in. That pairing
      gives you a first screen with a point of view and a second screen that's all utility.
    </p>
    <p>
      <span class="pick">C</span> only if you want to commit hard to the name as a
      wordmark and you're willing to sweat the type. It's the highest ceiling and the
      highest risk of the three.
    </p>
  </section>

</div>

<script>
  (function () {
    var root = document.documentElement;
    var btn = document.getElementById("themebtn");
    var mq = window.matchMedia("(prefers-color-scheme: dark)");

    var stored = null;
    try { stored = localStorage.getItem("coldopen-theme"); } catch (e) {}
    if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

    btn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      if (current !== "light" && current !== "dark") {
        current = mq.matches ? "dark" : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("coldopen-theme", next); } catch (e) {}
    });
  })();
</script>
```

</details>
