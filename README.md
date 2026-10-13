# Cloud Payment Group redesign concept

## Design instructions — required

Read this section before any layout, styling, illustration, or motion change.

- Follow the user's selected reference strictly. Use one reference for the requested change; never combine references unless the user explicitly authorizes it.
- The agent has no authority to invent its own design, reinterpret the reference, or add unrequested visual ideas. Ask the user before making a design choice the reference does not establish.
- When no reference is selected, ask the user for one or find concrete references and present them for selection before implementation.
- Inspect the selected reference before editing. For recordings, analyze the motion frame by frame and record the observed layout, overlap, timing, scale, perspective, and transitions. Identify anything unverified rather than guessing it.
- Apply only the feature and scope the user requests. A motion reference authorizes its motion, not a new interface, system demo, container, palette, or page redesign. Preserve the user's explicit layout requirements.
- Compare the rendered result with the selected reference at matching viewport sizes and states. A passing build does not establish design fidelity. Report verification limits and remaining differences plainly.

A standalone, dependency-free static implementation of the public Cloud Payment Group site. It is a local concept, not a replacement for the live site.

```sh
npm run build
npm run serve
```

Open `http://localhost:4173/`. The site contains original SVG artwork and uses the current Cloud Payment Group logo. Payment, client login, debt placement, and contact submission link to the existing live services because no authenticated portal or secure form backend was provided.

The build generates ten routes: `/`, `/about-us/`, `/debt-collection/`, `/payment-management/`, `/legal-services/`, `/industries/`, `/contact-us/`, `/debt-placement/`, `/blog/`, and `/blog/debt-recovery-in-modern-business/`.

The homepage uses original Cloud-colored line illustrations and a curved ribbon. Its visual scene is a placeholder for the planned Google Flow film; frame and motion prompts are in [GOOGLE_FLOW_PROMPTS.md](GOOGLE_FLOW_PROMPTS.md).

Screenshots are in `previews/`. The design was checked at 1440 px desktop and 390/320 px mobile widths. The external live forms remain outside this project and must be integrated into any future production implementation.

See `DESIGN_NOTES.md` for source links, design decisions, and publication checks.

Vercel can import this repository with the **Other** framework preset. `vercel.json` runs the build and serves the generated `dist/` directory.
