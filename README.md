# Cloud Payment Group redesign concept

## Design instructions — required

Read this section before any layout, styling, illustration, or motion change.

- Follow the user's selected reference strictly. Use one reference for the requested change; never combine references unless the user explicitly authorizes it.
- The agent has no authority to invent its own design, reinterpret the reference, or add unrequested visual ideas. Ask the user before making a design choice the reference does not establish.
- When no reference is selected, ask the user for one or find concrete references and present them for selection before implementation.
- Inspect the selected reference before editing. For recordings, analyze the motion frame by frame and record the observed layout, overlap, timing, scale, perspective, and transitions. Identify anything unverified rather than guessing it.
- Apply only the feature and scope the user requests. A motion reference authorizes its motion, not a new interface, system demo, container, palette, or page redesign. Preserve the user's explicit layout requirements.
- Compare the rendered result with the selected reference at matching viewport sizes and states. A passing build does not establish design fidelity. Report verification limits and remaining differences plainly.

A standalone static implementation of the public Cloud Payment Group site. It is a local concept, not a replacement for the live site. The client login uses Three.js for its rotating 3D logo, bundled locally with esbuild.

```sh
npm install
npm run build
npm run serve
```

Open `http://localhost:4173/`. Payment and debt placement link to the existing live services. The contact form and `/client-login/` are mockups with no backend. The login page keeps a separate link to the existing client portal; it does not authenticate users or store credentials.

The build generates twelve routes: `/`, `/about-us/`, `/debt-collection/`, `/payment-management/`, `/legal-services/`, `/industries/`, `/contact-us/`, `/debt-placement/`, `/blog/`, `/blog/debt-recovery-in-modern-business/`, `/client-login/`, and `/admin/`.

On `/client-login/`, **Enter admin demo** opens `/admin/` without entering credentials. The admin preview has eight distinct screens, in-memory sample records, working filters and menus, receipt previews, CSV downloads, support replies and settings. Refreshing resets demo edits. No backend is connected. The per-screen Dribbble references and composition mapping are in [the admin reference map](design-sources/admin-reference-map.md).

The editable logo asset is `public/assets/3d/cloudpg-ribbon-globe.glb`. Regenerate it with `npm run build:logo`. The transparent rendered fallback and its Imagegen prompt are in the same directory.

Mascot colours are applied at render time through the shared CSS filter in `src/mascot.css` and inline SVG colour definition in `src/mascot-color-filter.html`: Cloud blue body, orange scarf, original white eyes and transparency. The original PNG poses remain unchanged.

The homepage uses original Cloud-colored line illustrations and a curved ribbon. Its visual scene is a placeholder for the planned Google Flow film; frame and motion prompts are in [GOOGLE_FLOW_PROMPTS.md](GOOGLE_FLOW_PROMPTS.md).

Screenshots are in `previews/`. The design was checked at 1440 px desktop and 390/320 px mobile widths. The external live forms remain outside this project and must be integrated into any future production implementation.

See `DESIGN_NOTES.md` for source links, design decisions, and publication checks.

Vercel can import this repository with the **Other** framework preset. `vercel.json` runs the build and serves the generated `dist/` directory.
