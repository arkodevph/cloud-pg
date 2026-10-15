# Admin mockup reference map

The user requested a fresh reference for every admin screen and distinct compositions, while retaining Cloud Payment Group branding and a frontend-only, fixed-viewport demo. Research included live Dribbble pages and full-size image inspection; source artwork is not shipped in the UI.

| Screen | Primary reference | Composition preserved | Cloud adaptation |
|---|---|---|---|
| Overview | [Efficia — Chapter 24](https://dribbble.com/shots/25387576-SaaS-CRM-Dashboard-UX-UI-Design-Efficia) | Four metrics above a wide horizontal chart; narrow summary column; activity and task regions below | Account status distribution, clickable next steps, session checklist. No floating presentation card. |
| Accounts | [Nukta CRM dashboard — Asif Mahmud](https://dribbble.com/shots/26800791) | Fixed sidebar and top search; four metrics; full-width register with toolbar and pagination | Account organisations, balance, office, status and details dialog. |
| Payments | [TrustVest — Alamin Hossen](https://dribbble.com/shots/27708592-Fintech-Dashboard-UI-Payment-Management) | Four balance metrics; wide financial chart left; narrow transaction workspace right; recent transactions underneath | Six labelled sample processing batches and a selected receipt preview replace currency transfers. |
| Arrangements | [nCino payment schedule — Ray Mills](https://dribbble.com/shots/25182663-nCino-Banking-UX-Escrows-Payment-Schedule) | Narrow context navigation alongside a wide detail workspace; summary values before a dated payment schedule | Selectable plans, fortnightly instalments, payment progress and five schedule rows. Salesforce-specific navigation omitted. |
| Clients | [Clovo client list — Arounda](https://dribbble.com/shots/25940899-Clovo-CRM-Client-List-Design) | Category navigation, spacious contact directory, circular initials, contact metadata in columns | Categories are offices. Selected client context appears in an adjacent profile panel; smaller viewports open details in a dialog. |
| Reports | [CRM analytics — Kanij Riya](https://dribbble.com/shots/25965131-CRM-Dashboard-Design) | Four metrics, wide grouped bar chart, narrow composition donut, reporting region below | Office balances versus receipts, account status composition, downloadable sample CSVs. |
| Support | [Customer support inbox — AJ Abbasi](https://dribbble.com/shots/23470844-Customer-support-inbox) | Conversation list beside a larger thread; assignee context, opposing message bubbles and bottom composer | Considerate payment-support copy; replies and request resolution stored only in memory. |
| Settings | [Untitled UI account settings — Jordan Hughes](https://dribbble.com/shots/22070897-Account-settings-Untitled-UI) | Section tabs, workspace banner, labelled rows with help text left and inputs right, separated with hairlines | Cloud light palette replaces the source’s dark theme. Profile, notification and workspace sections. |

## Other reviewed candidates

- [Payment tracking — Akash](https://dribbble.com/shots/26811081-Payment-Tracking-Dashboard-Banking-UI): reviewed client lists and progress rows; not selected over the schedule-specific source.
- [Payment dashboard — Kawsar Hossain](https://dribbble.com/shots/24719242-Payment-Dashboard-Design): chart-focused composition, insufficient arrangement scheduling detail.
- [Support collaboration — Keitoto](https://dribbble.com/shots/26778695-Customer-Support-Dashboard-Inbox-Thread-Collaboration): mobile composition; rejected for the desktop inbox.
- [Orbitly client dashboard — Ofspace](https://dribbble.com/shots/25690190-Orbitly-Modern-CRM-AI-Dashboard-Clients): page reviewed, full-size artwork unavailable through the retrieval route; not used as a visual source.
- [CRM dashboard — Rayhan Nasir](https://dribbble.com/shots/25226377-CRM-Dashboard-Design): retrieval did not expose a usable primary image; not selected.

## Shared presentation and practical differences

All screens use Cloud teal, neutral continuous card borders, a single icon family, DM Sans, and the same navigation shell. The source screenshots are design compositions rather than specifications for complete interactions. This implementation supplies accessible buttons, focus states, dialogs, keyboard menus, filters, pagination and empty states.

Desktop compositions are adapted to fit 1440 × 900 and 1366 × 768 without page scrolling. At 390 × 844, secondary summary panels collapse; receipt and client details use dialogs. Smaller screens preserve access to the records rather than squeezing every desktop panel into view. The public marketing website retains normal scrolling.

The sample snapshot is October 2026. No authentication, enquiries, support messages or payments are sent. Refreshing resets demo edits. CSV exports contain illustrative records.

## Motion and presentation polish

The layouts retain their primary references. Native View Transitions animate only the workspace and title; the navigation stays live. A sliding active indicator, staggered panel and metric reveals, chart draw-ins, subtle row feedback, and short menu/dialog transitions provide feedback without delaying required actions. Searching and filtering do not replay the entrance sequence. Reduced-motion preferences disable these animations and the login's 3D rotation. Key desktop text is enlarged for presentation readability; compact layouts keep every action inside the viewport.
