# Cloud Payment Group redesign concept

## Design instructions — required

Read this section before any layout, styling, illustration, or motion change.

- Follow the user's selected reference strictly. Use one reference for the requested change; never combine references unless the user explicitly authorizes it.
- The agent has no authority to invent its own design, reinterpret the reference, or add unrequested visual ideas. Ask the user before making a design choice the reference does not establish.
- When no reference is selected, ask the user for one or find concrete references and present them for selection before implementation.
- Inspect the selected reference before editing. For recordings, analyze the motion frame by frame and record the observed layout, overlap, timing, scale, perspective, and transitions. Identify anything unverified rather than guessing it.
- Apply only the feature and scope the user requests. A motion reference authorizes its motion, not a new interface, system demo, container, palette, or page redesign. Preserve the user's explicit layout requirements.
- Compare the rendered result with the selected reference at matching viewport sizes and states. A passing build does not establish design fidelity. Report verification limits and remaining differences plainly.

A standalone static implementation of the public Cloud Payment Group site. It is a local concept, not a replacement for the live site. The client login uses the user-provided blue and orange cloud mark.

```sh
npm install
npm run build
npm run serve
```

Open `http://localhost:4173/`. Payment and debt placement link to the existing live services. The contact form and `/client-login/` are mockups with no backend. The login page keeps a separate link to the existing client portal; it does not authenticate users or store credentials.

The build generates twelve routes: `/`, `/about-us/`, `/debt-collection/`, `/payment-management/`, `/legal-services/`, `/industries/`, `/contact-us/`, `/debt-placement/`, `/blog/`, `/blog/debt-recovery-in-modern-business/`, `/client-login/`, and `/admin/`.

On `/client-login/`, **Enter admin demo** opens `/admin/` without entering credentials. The admin preview has eight distinct screens, in-memory sample records, working filters and menus, receipt previews, CSV downloads, support replies and settings. Refreshing resets demo edits. No backend is connected. The per-screen Dribbble references and composition mapping are in [the admin reference map](design-sources/admin-reference-map.md).

The editable logo asset is `public/assets/3d/cloudpg-ribbon-globe.glb`. Regenerate it with `npm run build:logo`. The transparent rendered fallback and its Imagegen prompt are in the same directory.

Site imagery pairs the original corporate photography with Cloud mascots in the hero, industry cards, Payment Hubb phone, process globe, contact form and footer. A new pointing pose introduces the people in the “People + Tools” photo. The original photography sources remain in `design-sources/corporate-photos-v1/` and `design-sources/corporate-photos-unique-v2/`. Mascot generation prompts and browser checks are recorded in the dated `design-sources/` folders. The contact mascot grips the paper’s edge, and the phone mascot shares the device’s tilt and motion.

The logo uses the supplied full-colour artwork and original lettering without CSS recolouring or replacement fonts. The earlier ribbon loader is restored; refresh replays it while DOM-ready completion and a timeout prevent slow assets from keeping the page covered. Run `npm test` for loader regression checks.

The homepage hero uses the supplied eight-second Google Flow handshake film in `public/assets/video/cloudpg-idle-handshake.mp4`, with its audio track removed and fast-start metadata. It loops muted and inline, has a pause/play control, and shows the matching JPEG poster when reduced motion is enabled or playback is unavailable. The frame and generation prompt are in `design-sources/hero-real-people-v2/`; the original video remains in `/home/nami/Videos/Create_idle_handshake_animation_1080p_20261019135503.mp4`.

Screenshots are in `previews/`. The design was checked at 1440 px desktop and 390/320 px mobile widths. The external live forms remain outside this project and must be integrated into any future production implementation.

See `DESIGN_NOTES.md` for source links, design decisions, and publication checks.

Vercel can import this repository with the **Other** framework preset. `vercel.json` runs the build and serves the generated `dist/` directory.

### Corporate photography

Each photographic placement uses a distinct original image under `public/assets/photos/unique-v2/`. The homepage industry stage and the Industries page use separate images, as do both contact forms. The homepage photographs sit in a shared central layer outside the overlapping cards. The build rejects repeated photographic references across routes. Generation prompts and source-file provenance are recorded in `design-sources/corporate-photos-unique-v2/manifest.json`.

### October motion references

The industry section uses Cloud’s existing colors and typography with the fixed intro and original upward card peel from `recording_2026-10-19_20.26.44.mp4`. Immediately after them, a numbered globe with three held scroll stops adapts `recording_2026-10-19_20.27.43.mp4`, with the globe replacing its circular track as requested. The text-wipe reference was analyzed, then the effect was removed at the user’s request. Timings, observed transitions and verification limits are in [the frame analysis](design-sources/motion-2026-10-19/ANALYSIS.md).

The five large sector SVGs are original Phosphor duotone assets, used under the MIT license included at `public/assets/icons/phosphor/LICENSE`. Their source commit and mapping are recorded in `design-sources/motion-2026-10-19/icons.json`.

### Typography

Exactly two families are used: **Boska** for display headings and **Switzer** for body text, navigation and controls, downloaded directly from [Fontshare](https://www.fontshare.com/). Original variable WOFF2 files are served locally with regular and italic styles. Both use the ITF Free Font License 2.0, included in `public/assets/fonts/`.

Fontshare permits self-hosting for the website and restricts redistribution through repositories. The font binaries are therefore ignored by Git; `src/fetch-fonts.mjs` obtains the original files directly from Fontshare when a build lacks them and verifies their hashes. Source URLs are in `public/assets/fonts/fontshare-sources.json` and `design-sources/motion-2026-10-19/fonts.json`. The site makes no runtime request to a remote font service.
