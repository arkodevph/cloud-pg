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

Site imagery uses three original generated corporate photographs from `design-sources/corporate-photos-v1/`, served as WebP files in `public/assets/photos/`. They replace the previous character illustrations throughout the public pages. The phone demo retains its interface without decorative characters; the supplied cloud mark also appears on the login page.

The homepage hero uses the supplied eight-second Google Flow handshake film in `public/assets/video/cloudpg-idle-handshake.mp4`, with its audio track removed and fast-start metadata. It loops muted and inline, has a pause/play control, and shows the matching JPEG poster when reduced motion is enabled or playback is unavailable. The frame and generation prompt are in `design-sources/hero-real-people-v2/`; the original video remains in `/home/nami/Videos/Create_idle_handshake_animation_1080p_20261019135503.mp4`.

Screenshots are in `previews/`. The design was checked at 1440 px desktop and 390/320 px mobile widths. The external live forms remain outside this project and must be integrated into any future production implementation.

See `DESIGN_NOTES.md` for source links, design decisions, and publication checks.

Vercel can import this repository with the **Other** framework preset. `vercel.json` runs the build and serves the generated `dist/` directory.

### Corporate photography

Each of the 24 photo placements uses a distinct original image under `public/assets/photos/unique-v2/`. Homepage sector panels and the Industries page have separate images, as do both contact forms. The build rejects repeated photographic references across routes. Generation prompts and source-file provenance are recorded in `design-sources/corporate-photos-unique-v2/manifest.json`.
