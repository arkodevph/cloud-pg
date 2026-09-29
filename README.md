# Cloud Payment Group redesign concept

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
