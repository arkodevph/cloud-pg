# Design notes

## Current visual direction

The current homepage uses a light editorial layout, Cloud blue and orange, a curved ribbon derived from the logo colors, and original matching line illustrations. The ribbon scene is a static placeholder for a future Google Flow film; its frame prompts are in [GOOGLE_FLOW_PROMPTS.md](GOOGLE_FLOW_PROMPTS.md). The earlier hero concepts below record the first exploration and are superseded by this direction.

## Scope and verified source

The live [Cloud Payment Group site](https://cloudpg.com.au/) describes debt collection and payment management for organisations in Australia and New Zealand. Its public navigation includes About, Debt Collection, Payment Management, Legal Services, Industries, Blog, Contact, Debt Placement, Make a Payment, and Client Login. The live source links the payment route to `https://www.debtview.net.au/DebtrakCustomer/Login/Login` and the client route to `https://www.debtview.net.au/DebtrakClient/Login/Login`. The [debt placement page](https://cloudpg.com.au/debt-placement/) collects sensitive personal and account data in a two-step form. Its existing form remains the destination in this concept. The [Payment Management page](https://cloudpg.com.au/payment-management/) describes Payment Hubb, instalment arrangements, hardship requests, and account updates. The [Industries page](https://cloudpg.com.au/industries/) identifies commercial, local government, medical, education, and insurance sectors. These are content sources, not design references.

## Behavioural goal and flow map

| Visitor | Goal | Information and action | Likely hesitation | Recovery and signal |
|---|---|---|---|---|
| Organisation evaluating services | Understand fit and contact Cloud | Service overview, industries, contact route | Unsure whether collection or payment management fits | Compare services, then reach the live contact form or phone |
| Existing client placing a debt | Submit account details safely | Debt placement route and explanation of what to expect | Concern about sensitive data and destination | Clear handoff to the existing Cloud form; no local data collection |
| Person managing an account | Make a payment or discuss an arrangement | Dedicated payment link in utility bar and footer | May mistake business enquiry for account help | Distinct customer portal link and phone; no pressure language |

## Hero concepts considered

| Concept | Draft copy and CTA | Desktop and mobile layout | Asset plan and decision |
|---|---|---|---|
| **Clear path — selected** | “A clearer path to payment.” “Talk to our team.” | Desktop: oversized editorial type beside a sculptural route illustration. Mobile: type and enquiry action first, then illustration; payment stays visible in the header. | Original blue/orange SVG route based on the logo. Connects visual drama to Cloud’s services without implying a specific account workflow. |
| **Two perspectives** | “Better outcomes for both sides.” “Explore our services.” | Desktop: two adjacent panels for organisation and account holder. Mobile: stacked panels with explicit task labels. | Paired documentary-style assets or restrained diagrams. Clear segmentation, but equal visual weight would compete with the selected service-enquiry goal. |
| **Human conversation** | “Payment support starts with people.” “Talk to our team.” | Desktop: concise headline over approved staff photography; mobile: text above a close crop of the image. | Approved real staff photography only. This could build familiarity, but no approved staff imagery was provided and fictional people would misrepresent Cloud. |

## Evidence ledger

| Source | Task or population and finding | Confidence and limits | Decision | Falsifier |
|---|---|---|---|---|
| [Tuch et al., 2012](https://www.sciencedirect.com/science/article/pii/S1071581912001127) | Experimental website first-impression studies found effects of visual complexity and prototypicality on aesthetic judgement | Promising for first impressions; does not prove trust, usability, or conversion | Keep recognisable navigation and concentrate novelty in the hero artwork | Visitors cannot identify the service or action in a five-second static view |
| [Scheibehenne et al., 2010](https://doi.org/10.1086/651235) | Meta-analysis found a near-zero average choice-overload effect with variation across contexts | Corrective finding; not a rule for the number of options | Keep all necessary actions, label and group them by task | Visitors repeatedly pick the wrong portal or cannot find a task |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Web accessibility standard for perceivable and operable content | Strong normative standard; conformance still needs testing | Semantic links, focus, reflow, contrast, reduced motion, and visible labels | Any relevant AA criterion fails in manual or automated review |
| [ACCC debt collection rules](https://www.accc.gov.au/business/debt/debt-collection-rules) | Guidance says people who owe money should be treated with fairness, respect, and courtesy | Applies to Australian debt collection; legal copy needs business review | Calm account-help wording; no false urgency or shame | Reviewer finds coercive, misleading, or unsupported copy |

## Dribbble references

These are visual concepts, not operational or content sources. No assets, palettes, or layouts were copied.

| Reference | Adapted idea | Boundary |
|---|---|---|
| [Architecture Studio editorial](https://dribbble.com/shots/27108818-Architecture-Studio-Editorial-Web-Design) | Strong grid, large type, deliberate section pacing | Cloud needs distinct account actions, not a portfolio |
| [Architecture Studio landing](https://dribbble.com/shots/26372102-Architecture-Studio-Website-Landing-Page) | Spatial breathing room around the main claim | Avoid architecture imagery |
| [Architecture & design studio](https://dribbble.com/shots/27711876-Architecture-design-studio-Website) | Blue/orange scale and bold headline | Final color comes from Cloud's logo |
| [Creative Agency hero](https://dribbble.com/shots/27325398-Creative-Agency-Website-Hero-Bold-Typography-Landing-Page-Desi) | Typography as a hero asset | Keep the service explanation explicit |
| [Logistics Website](https://dribbble.com/shots/27438367-Logistics-Website-Design) | A route as a visual metaphor | Do not imply an unverified Cloud process |
| [Modern Corporate Hero](https://dribbble.com/shots/27214943-Modern-Corporate-Hero-Section-UI) | Clear message and CTA placement | Skip glass effects and generic statistics |
| [RCVR fintech](https://dribbble.com/shots/25406073-RCVR-Fintech-Website-Design-Project) | Controlled contrast in a sensitive finance subject | No fictional dispute platform UI |
| [Finpay landing](https://dribbble.com/shots/24820686-Finpay-Fintech-Landing-Page) | Full-page story from offer to action | Cloud's services differ from invoicing software |
| [Debty](https://dribbble.com/shots/25120263-Debty-Landing-page) | Balance business outcomes and customer relationships | No unsupported recovery claims |

## About page design review

The [current Cloud About page](https://cloudpg.com.au/about-us/) verifies the 50+ years claim, customer-service emphasis, two service areas, and Australia/New Zealand scope. The [current contact page](https://cloudpg.com.au/contact-us/) supplies the live form, phone, email, and office details. The redesign uses a direct link to that form because this static project has no submission backend.

For a new business visitor, the flow is: identify Cloud and its experience → understand its approach → compare the two services → contact the team. Existing clients and account holders can still reach their task links in the shared header and footer. The key unknown is whether actual visitors understand the difference between the two service offerings; a short usability test should ask them to choose the relevant page for a described need.

Nine individual About-page references were opened and reviewed. They are visual concepts, not evidence of conversion performance:

| Reference | Relevant pattern | Applied here |
|---|---|---|
| [EternaCloud](https://dribbble.com/shots/26678980-About-Us-Page-Design-for-EternaCloud) | Clear, structured, human-centred company story | Editorial hero followed by a scannable company statement |
| [Apex Consulting](https://dribbble.com/shots/26769364-Apex-Consulting-About-Us-Page-Design) | Warm imagery and a journey from expertise to contact | Existing Cloud-style illustration and contact destination |
| [AI-vans](https://dribbble.com/shots/27263875-AI-vans-Agency-About-Page-Design) | Strong hero and visible proof points | Verified experience figure in the hero image panel |
| [Lumetsa](https://dribbble.com/shots/27240729-Lumetsa-Agency-about-page-design) | Whitespace and concise credibility cues | One proof figure and three short approach cards |
| [Pixel Hive](https://dribbble.com/shots/26068644-Pixel-Hive-About-Page-Design) | Distinct sections for a company story | Separate story, approach, services, and contact sections |
| [Produce UI About](https://dribbble.com/shots/23071221-About-Us-Page-Design-of-Digital-Agency) | Prominent typography | Large claim in the About hero |
| [Triloe](https://dribbble.com/shots/26604151-About-Page-UI-UX-Design-Website-Development) | Expertise cards and a contact close | Three approach cards and a contact panel |
| [Topnotch](https://dribbble.com/shots/19253477-Topnotch-About-and-Careers-page) | Simple company introduction | Brief opening copy rather than a long unbroken paragraph |
| [Hellion Studios](https://dribbble.com/shots/25923097-Hellion-Studios-About-us-page-design) | Restrained layout | Familiar service cards and Cloud palette instead of visual effects |

| Evidence | Task, finding and confidence | About-page decision | Falsifier |
|---|---|---|---|
| [Tuch et al., 2012](https://research.google.com/pubs/pub38315.html) | Two experiments rated website screenshots at very short exposures; low complexity and familiar structure scored well for perceived aesthetics. **Promising** for first impressions only; conversion and trust were not measured | Use a recognisable About-page sequence with one expressive hero | Visitors cannot identify the company or service within a brief first view |
| [Scheibehenne et al., 2010](https://doi.org/10.1086/651235) | Meta-analysis of 50 experiments (5,036 participants) found a near-zero mean choice-overload effect with substantial variance. **Contested/contextual** for this B2B service decision; no universal option-count rule follows | Keep service, payment, and client paths available while grouping the two About-page services | Visitors repeatedly choose the wrong service or miss a required task |
| [W3C WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) | Normative web accessibility guidance specifies 24 CSS px minimum targets or defined exceptions. **Strong as a conformance floor**, not a guarantee of usability | Use full-card service links and at least 44px high key actions | Any About-page action fails target size, focus, or reflow checks |

## Brand and assets

## Hero detail pass

The payment navigation pill now has explicit horizontal padding and a contained arrow. The previous generic nav-link rule was more specific and had reduced its padding to zero. The homepage hero adds three small journey labels along the illustrated path and a 50+ years experience fact in the lower rail. The fact reflects the About page's existing credit-industry claim; the labels describe the visual journey rather than implying new product capabilities. The visible "Flow film placeholder" production label was removed from the page.

`ui-design-index` routes this work to `ui-landing-patterns`. Nine finance hero references were reviewed for feature labels, trust cues, and CTA restraint; they informed the hierarchy, not the site's assets or claims:

| Reference | Relevant idea |
|---|---|
| [Roohi Koohi: Finance landing page](https://dribbble.com/shots/25537436-Finance-landing-page-web-UI-design) | Small credibility cues near a primary message |
| [Fixoria: Finance landing page](https://dribbble.com/shots/26899722-Finance-Landing-Page-Design) | Calm hero hierarchy with supporting proof |
| [Mahatir MD Ayat: Fintech hero](https://dribbble.com/shots/27150677-Modern-Fintech-Website-Hero-Section-UI-Design) | Compact feature highlights around a central claim |
| [CC Creative: Fintech landing page](https://dribbble.com/shots/26865836-Fintech-Landing-Page-Design) | Guided feature flow without crowding the CTA |
| [Stephan: Finance hero header](https://dribbble.com/shots/15387063-Finance-Landing-Page-Hero-Header) | Hero component spacing |
| [Myroslava Tanasiichuk: Fintech dashboard hero](https://dribbble.com/shots/26258569--Hero-Section-Dark-Fintech-Dashboard-Landing-Page) | Clear CTA and small supporting cards |
| [James: Finance app hero](https://dribbble.com/shots/26369223-Finance-App-Hero-Section-Clean-Modern-UI-for-Dashboard-Landing) | White space around copy and action |
| [Fixoria: Finance hero section](https://dribbble.com/shots/26903565-Finance-Landing-Page-Hero-Section) | Trust signals following the value proposition |
| [Shakuro: Digital banking landing page](https://dribbble.com/shots/24768485-Fintech-Website-UI-Design) | Restrained metrics and concise product cues |

## Site loader: references and behavior

Flow: a visitor first opens the site or refreshes a page → the exact Cloud logo image and indeterminate blue/orange line appear immediately for at least 900 ms → a short upward reveal shows the page once loading completes. Later navigation in the same tab shows the loader only if resources are still loading after 180 ms. The indicator closes after five seconds even if a resource stalls, leaving the available page usable. The brief intro is an intentional branding pause requested for visibility; production analytics should check whether it affects task starts or abandonment.

`ui-design-index` routes this marketing site to `ui-landing-patterns`. The selected patterns are a branded logo moment, a restrained motion line, and a clean transition into the page. Ten individual examples were opened; they are visual references, not evidence of usability or assets to copy:

| Reference | Relevant idea |
|---|---|
| [Maxym: Simple preloader for site](https://dribbble.com/shots/24224709-Simple-preloader-for-site-5options) | Brand mark as the focal point |
| [Gustavo Youngberg: Animated Logo](https://dribbble.com/shots/2237304-Animated-Logo-for-a-preloader) | Let the existing mark carry the introduction |
| [Scott Jensen: Website Preloader](https://dribbble.com/shots/1704692-Website-Preloader) | CSS-scale implementation |
| [Mariia Vlodarchuk: Simple Crypto](https://dribbble.com/shots/25014975-Preloader-First-Screen-Simple-Crypto) | Loader belongs to the first-screen transition |
| [Gil: Service page loading animation](https://dribbble.com/shots/16600907-Service-page-loading-animation) | Visible progress cue; Cloud uses indeterminate movement because no real percentage exists |
| [Lazarev: Smooth preloader and home](https://dribbble.com/shots/19518297-Smooth-preloader-home-for-the-design-agency-website-Lazarev) | Cohesive page entry |
| [Chris Gannon: Ribbon Loader](https://dribbble.com/shots/19920694-Ribbon-Loader) | A line can connect motion to a ribbon identity |
| [Niccolò Miranda: Cobo preloader](https://dribbble.com/shots/18883343-Cobo-Pre-Loader) | Explore a branded transition while keeping Cloud's simpler timing |
| [Mart: Fintech loading screen](https://dribbble.com/shots/10694191-Fintech-loading-screen) | Finance-sector loading reference |
| [Awwwards: SO.WHAT logo loading animation](https://www.awwwards.com/inspiration/modular-homepage-overview-animated-dropdown-navigation-footer-with-subscribe-form-so-what-fashion-brand) | Logo loading as a distinct element in a larger site |

| Evidence | Finding, confidence, and limit | Decision and falsifier |
|---|---|---|
| [W3C WCAG 2.2 status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | **Strong normative guidance:** waiting and completion messages should be programmatically exposed without moving focus. This does not require adding a status message where none exists. | A polite status reports “Loading page” then readiness. A screen reader that misses the waiting state falsifies the implementation. |
| [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) | **Strong platform guidance:** users can request fewer nonessential animations; it does not imply that all visible feedback must disappear. | Replace the moving line with a static blue/orange line. Motion still running under the preference is a failure. |
| [Study of wait indicators in a mobile app](https://www.sciencedirect.com/science/article/pii/S0141938218300076) | **Promising, contextual:** feedback type affected perceived waiting in a mixed-factorial experiment. A mobile app waiting task does not prove that an overlay helps this site. | Use a small status cue only during a real wait, then test real task completion and perceived delay. |
| [Google web.dev on LCP](https://web.dev/articles/lcp) | **Corrective performance guidance:** a splash or indicator can be a poor proxy for when useful content appears. | The requested 900 ms opening intro is a known tradeoff; keep it short, avoid a fake percentage, and remove it if task data shows harm. |

The loader displays the site's existing `cloudpg-logo-transparent.png` without redrawing its mark or wordmark. Its bordered light panel, small status, and blue/orange rule carry the transition. It has no controls, no fabricated progress value, no extra dependency, and no blocked no-JavaScript state. Verification covered first opening, every refresh, later navigation, delayed asset load, five-second fallback, reduced motion, and no JavaScript at desktop and 390px widths. Current desktop and mobile captures are `previews/loader-refined-desktop.png` and `previews/loader-refined-mobile.png`.

The About page now has three separate generated scenes: a team discussion in its hero, an adviser and business representative for debt collection, and a customer using digital payment choices for payment management. Each scene uses the existing Cloud blue/orange cartoon language, while the service headings and card links remain the source of meaning and action. The card illustrations are decorative in markup; the hero illustration has a descriptive alternative. This addresses the service-comparison step without asking visitors to infer a service from color or art alone. The three final prompts and output paths are recorded in [ABOUT_ASSET_PROMPTS.md](ABOUT_ASSET_PROMPTS.md). Desktop and 390px screenshots are in `previews/about-unique-assets-*.png`.

Each dedicated service page also has its own hero scene: ordered account documents for Debt Collection, self-service choices on a phone for Payment Management, and measured document review for Legal Services. These images are decorative; the service name and explanation stay before the art in reading order. This follows the familiar landing-page pattern of a clear claim beside a relevant visual, with the existing task options left in place below. Distinct scenes may help visitors recognise which service they are reading about, but visual novelty alone does not establish comprehension or task success; a focused service-selection test remains the check. Final prompts and asset paths are in [SERVICE_ASSET_PROMPTS.md](SERVICE_ASSET_PROMPTS.md); desktop and 390px previews are in `previews/*-service-*.png`.

The logo was downloaded from [Cloud's current site](https://cloudpg.com.au/wp-content/uploads/2023/06/logo.png). Its blue and orange sampled approximately `#30A7D3` and `#E75E2C`. The website uses darker tonal derivatives for text and actions to meet contrast requirements. The route illustration, service line art, and favicon are original SVGs in `public/assets/`.

Core roles: deep ink `#0D2934` for dark surfaces, ink `#143440` for text, paper `#F8F8F4` for reading surfaces, brand blue `#30A7D3` for feature surfaces, brand orange `#E75E2C` for the main action, and deep orange `#AF3D1B` for small text on light surfaces. Computed WCAG contrast ratios: ink on paper 12.37:1, soft ink `#45616B` on paper 6.21:1, deep orange on paper 5.63:1, near-black `#061A21` on the orange action 5.13:1, and deep ink on brand blue 5.49:1. These checked pairs exceed 4.5:1 for normal text; every final use still needs visual and assistive-technology review.

## Publication decisions

This is a local redesign concept. Confirm current business claims, office details, final copy, legal wording, and approved imagery before publishing. No live payment or debt data is collected locally. The contact action goes to Cloud's existing live form; the debt-placement action goes to Cloud's existing live form. The article template is a concise summary linking to the original article, pending approved article content.
