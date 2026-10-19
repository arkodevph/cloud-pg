# User-supplied motion references, 19 October 2026

The user assigned these three recordings to separate features and confirmed that the globe section belongs immediately after the industry cards. Original files are under `/home/nami/Videos/`. No external references were combined.

## Text: recording_2026-10-19_20.12.21.mp4

1920 × 1080, 60000/1001 fps, 9.408 seconds. Overview sampled at 2 fps; the transition sheet samples 1.7–2.7 seconds at 12 fps (its labels are relative to 1.7 seconds). These sheets are selected-frame analysis, not an inspection of every source frame.

- 0.0: completed centered heading, two lines, above phone images.
- 0.5–1.0: rapid navigation/scroll clears the section. This is recording interaction, not a text exit animation.
- 1.7–2.0: a thin orange leading block grows left to right on each heading line; the lower line starts shortly after the upper.
- 2.1–2.6: letters emerge from the left behind the advancing block. The orange remainder shrinks toward the right end, leaving a short caret-like segment before disappearing. Text stays in place; no scaling, perspective or vertical entrance.
- 4.0–4.8: the same behavior on a left-aligned two-line heading.
- 6.0–7.1: the same behavior on dark text inside a light panel. Layout/color changes belong to the reference site, not this requested motion adaptation.

Implementation: actual font-loaded line geometry, orange cover growth then rightward clearing, clipped word reveals along that same sweep, 300 ms per line and 30 ms line stagger after the user explicitly requested a faster text wipe. These are estimates from screen capture, not recovered source easing values. Custom inline motion-word elements avoid the existing broad sector-list span:first-child rule, which otherwise shrinks and recolors the first word. Semantic headings, fonts, links and copy remain; reduced motion displays completed text.

## Industry cards: recording_2026-10-19_20.26.44.mp4

1920 × 1080, 60000/1001 fps, 7.029 seconds. Overview 3 fps; transition sheet 1.1–1.9 seconds at 15 fps, with relative labels.

- 0.67–1.0: left heading/copy stays stationary. Compact coral card at right has a small symbol, medium heading, short supporting text and rounded corners.
- 1.23–1.57: next pale green card enters from below, in front of the coral card. Both are opaque. The old card stays mostly stationary and becomes covered; there is no upward exit, rotation or perspective flip.
- 1.67–2.0: green card settles in the same right-hand position.
- 2.0–2.67: blue card repeats the upward overlap.
- 3.0–3.67: lavender card repeats it.
- 4.33 onward: section scrolls away, revealing the next numbered circular section.

Final implementation after user corrections: use the recording's fixed intro at left and rising opaque cards at right, with Cloud's existing pale palette, dark typography and visual style. The central photographic layer sits outside the cards, behind the entire stage; the cards overlap it. Each card contains a large distinct Phosphor duotone SVG, replacing the small badges and hand-drawn paths. Original assets and their MIT license are stored in `public/assets/icons/phosphor/`; `icons.json` records the exact upstream commit. The incoming card now completes its swipe in the last 35% of each scroll segment, leaving a longer hold and a faster handoff. Mobile places the intro above the cards, clips the external photo to the section width, and retains readable type. Reduced motion lays out all five links normally.

## Globe: recording_2026-10-19_20.27.43.mp4

1920 × 1080, 120 fps, 7.460 seconds. Overview 2 fps; transition 2.25–3.0 seconds at 16 fps, with relative labels.

- 0.0–2.3: centered heading above a thin circular track, three numbered positions, active orange number at twelve o'clock. A fine vertical stem ends in a small diamond/star above the centered label and short paragraph.
- 2.4–2.7: the track/numbers rotate counterclockwise. Previous active number moves left, next number arrives from the right. The heading stays still. Copy blurs and dims during the handoff.
- 2.8–3.5: step 2 is settled at top, new copy sharp.
- 3.8–4.4: next rotation/blur handoff to step 3.
- 5.0 onward: user scrolls the section upward; OS overlays appear near the end and are not part of the effect.

The reference itself shows a circle, not a geographic globe. The user explicitly requested substituting a globe and confirmed its placement after the cards. Implementation uses the existing local COBE globe dependency, three numbered positions projected over its upper surface, an active marker/stem, and blurred copy swaps. Three new Cloud approach labels adapt the sequence to the site's account-management content. The user explicitly confirmed scroll mapping, then clarified that each scroll stop must hold a complete step. The pinned section has three scroll zones; selecting a new zone performs a 360 ms numbered/globe handoff and a 330 ms blurred copy reveal, then stays still. There is no automatic step cycle and no continuous numbered-track rotation through intermediate scroll positions. After a further user clarification, the geographic Earth rotates gently during each hold; the numbered marker and copy stay fixed until the next scroll stop. Reverse scrolling selects the previous stop; number buttons scroll to the corresponding zone. Reduced motion uses static manual step selection.

## Verification scope

Compare static states and overlaps in a browser at desktop and mobile sizes; test numbered controls and reverse scrolling. A passing build alone does not establish motion fidelity. The projected globe track, large in-card SVGs and faster transitions are explicit user adaptations. The recording supplies neither a globe nor mobile states, so mobile geometry remains an adaptation.

The first browser preview introduced a dark section and compact cards; the user rejected that design change and reported unreadable text. The final correction retains the recording layout and motion in Cloud styling, with photos outside the cards and large official open-source SVGs inside. The new globe also uses the existing light Cloud palette.

## Final typography request

User requested distinctive free downloadable fonts and exactly two font families. Syne is used for display text and Hanken Grotesk for body text and controls, with regular variable files and Hanken italic served locally. Their original SIL OFL 1.1 files ship beside them. All previous Archivo, DM Sans and Instrument Serif declarations and remote Google Fonts imports were removed, including the admin and phone mockup styles. `fonts.json` records the official source and commit. The requested text wipe is now 300 ms per line with a 30 ms stagger.

## Final card-transition correction

The user subsequently selected the original upward transition in place of the incoming-card overlap. Final card motion restores the old outgoing upward peel: the current card translates upward with a small perspective tilt, revealing the next scaled card underneath. The fixed left intro, shared center image outside the cards, large official SVGs, two local font families, and faster 300 ms text wipe remain. Earth rotation continues gently while the numbered steps hold at their scroll stops.

## Verified final implementation

Build and JavaScript syntax checks pass. A separate Chromium process controlled through its DevTools protocol (without gstack) checked nine card states including reverse scrolling, seven globe stop states, 390/320 px mobile layouts, and reduced motion. No page exceptions occurred. Both local font families loaded and no remote font resources were requested. All cards remain available in reduced motion, and the numbered stop stays unchanged without scrolling while the Earth has its independent gentle rotation. Selected screenshots are in `previews/industry-reference-final-desktop.png`, `previews/industry-upward-transition-final.png`, `previews/industry-reference-final-mobile.png`, and `previews/globe-scroll-stops-final-desktop.png`. Full temporary browser evidence is under `/tmp/cloudpg-motion-review/`; the structured final results are copied to `verification.json` beside this note.

## Latest user correction: remove text wipe and use foundry downloads

The user rejected the orange wipe and the Syne/Hanken pair. The wipe implementation and its word-wrapping markup were removed completely. The final font pair is Boska (display) and Switzer (body/controls), downloaded directly from Fontshare rather than GitHub. Boska’s quieter display weight and a reduced Payment Hubb heading size replace the oversized expanded headline. Original variable regular and italic WOFF2 files are self-hosted under ITF FFL 2.0. Font files are ignored by Git because the license permits own-site hosting but restricts redistribution through repositories; the build obtains missing originals directly from Fontshare and checks file hashes. Earlier font/wipe descriptions above document superseded drafts, not final behavior.

The final held-rotation pixel check passed: Earth pixels changed across a 1.2-second hold while numbered marker transforms, step and copy remained identical. No text-wipe markup/animation or page exceptions were present. Payment Hubb’s updated Boska/Switzer screenshot was inspected on desktop.
