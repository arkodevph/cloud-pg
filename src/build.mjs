import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'dist');
const homeHero = readFileSync(join(root, 'src', 'home-hero.html'), 'utf8');
const paymentUrl = 'https://www.debtview.net.au/DebtrakCustomer/Login/Login';
const clientUrl = 'https://www.debtview.net.au/DebtrakClient/Login/Login';
const liveContact = 'https://cloudpg.com.au/contact-us/';
const livePlacement = 'https://cloudpg.com.au/debt-placement/';
const privacyUrl = 'https://cloudpg.com.au/wp-content/uploads/2023/07/OM009-Privacy.pdf';

const arrow = '<span aria-hidden="true">↗</span>';
const external = ' target="_blank" rel="noopener noreferrer"';
const button = (href, label, variant = 'primary', attrs = '') => `<a class="button button--${variant}" href="${href}"${attrs}>${label}${arrow}</a>`;
const eyebrow = (number, text) => `<p class="eyebrow"><span class="eyebrow__dot"></span>${number} / ${text}</p>`;
const sectionTitle = (number, label, title, text = '') => `<div class="section-heading">${eyebrow(number, label)}<div class="section-heading__row"><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}</div></div>`;

function header(active) {
  const navLink = (href, label, key) => `<a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" id="top">
    <div class="container main-nav"><a class="brand" href="/" aria-label="Cloud Payment Group, home"><img src="/assets/cloudpg-logo-transparent.png" width="2169" height="725" alt="Cloud Payment Group"></a>
      <a class="mobile-pay" href="${paymentUrl}"${external}>Make a payment</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span><span></span><span></span></button>
      <nav id="primary-nav" class="primary-nav" aria-label="Main navigation">
        ${navLink('/about-us/', 'About', 'about')}
        <details class="nav-dropdown"${['collection', 'payment', 'legal'].includes(active) ? ' data-current="true"' : ''}><summary>Services <span aria-hidden="true">⌄</span></summary><div class="nav-dropdown__panel">${navLink('/debt-collection/', 'Debt collection', 'collection')}${navLink('/payment-management/', 'Payment management', 'payment')}${navLink('/legal-services/', 'Legal services', 'legal')}</div></details>
        ${navLink('/industries/', 'Industries', 'industries')}${navLink('/blog/', 'Insights', 'blog')}
        <details class="nav-dropdown nav-dropdown--client"><summary>Client tools <span aria-hidden="true">⌄</span></summary><div class="nav-dropdown__panel"><a href="/debt-placement/">Debt placement</a><a href="${clientUrl}"${external}>Client login ${arrow}</a></div></details>
        <a class="nav-payment" href="${paymentUrl}"${external}>Make a payment ${arrow}</a>
        <a class="nav-cta" href="/contact-us/">Talk to our team ${arrow}</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container">
    <div class="footer-top"><div>${eyebrow('NEXT', 'LET’S TALK')}<h2>Find a clearer way forward.</h2></div>${button('/contact-us/', 'Talk to our team', 'dark')}</div>
    <div class="footer-grid"><div class="footer-brand"><img src="/assets/cloudpg-logo-transparent.png" width="2169" height="725" alt="Cloud Payment Group"><p>Debt collection and payment management for organisations across Australia and New Zealand.</p></div>
      <div><h3>Explore</h3><a href="/about-us/">About us</a><a href="/debt-collection/">Debt collection</a><a href="/payment-management/">Payment management</a><a href="/legal-services/">Legal services</a><a href="/industries/">Industries</a></div>
      <div><h3>Get things done</h3><a href="/contact-us/">Contact us</a><a href="/debt-placement/">Debt placement</a><a href="${paymentUrl}"${external}>Make a payment</a><a href="${clientUrl}"${external}>Client login</a><a href="/blog/">Insights</a></div>
      <div><h3>Contact</h3><a href="tel:1300549192">1300 549 192</a><a href="mailto:info@cloudpg.com.au">info@cloudpg.com.au</a><p>Perth · Sydney · Melbourne · Queensland · Auckland</p></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Cloud Payment Group.</span><div><a href="${privacyUrl}"${external}>Privacy policy</a><a href="#top">Back to top ↑</a></div></div>
  </div></footer>`;
}

const loaderMarkup = `<div class="page-loader" aria-hidden="true"><div class="page-loader__frame">
  <div class="page-loader__top"><img class="page-loader__logo" src="/assets/cloudpg-logo-transparent.png" width="2169" height="725" alt=""><span>AUSTRALIA & NEW ZEALAND</span></div>
  <div class="page-loader__content"><span class="page-loader__eyebrow">CLOUD PAYMENT GROUP <i>/</i> A CLEARER PATH FORWARD</span><p class="page-loader__headline"><span>A clearer path</span><span><em>forward.</em></span></p><p class="page-loader__subline">Making the next step clearer.</p></div>
  <svg class="page-loader__path" viewBox="0 0 1300 340" preserveAspectRatio="none" aria-hidden="true"><path pathLength="100" d="M -40 278 C 165 307 230 105 425 162 S 685 278 805 157 S 1075 157 1340 20" fill="none" stroke="#e75e2c" stroke-width="62"/><path pathLength="100" d="M -40 278 C 165 307 230 105 425 162 S 685 278 805 157 S 1075 157 1340 20" fill="none" stroke="#85d1e8" stroke-width="54"/></svg>
  <div class="page-loader__bottom"><span>FINDING THE WAY FORWARD</span><div class="page-loader__track"><span></span></div><span class="page-loader__arrow" aria-hidden="true">↗</span></div>
</div></div><span class="page-loader__status" id="page-load-status" role="status" aria-live="polite" aria-atomic="true"></span>`;
const loaderScript = `<script>
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let intro = !reducedMotion;
  try {
    intro = !reducedMotion && (performance.getEntriesByType('navigation')[0]?.type === 'reload' || !sessionStorage.getItem('cloud-loader-seen'));
    if (intro) sessionStorage.setItem('cloud-loader-seen', '1');
  } catch {}
  if (intro) root.classList.add('is-loading');
  let shownAt = performance.now();
  let shown = intro;
  let done = false;
  const showTimer = intro || reducedMotion ? null : setTimeout(() => {
    if (document.readyState === 'complete') return;
    shown = true;
    shownAt = performance.now();
    root.classList.add('is-loading');
    const status = document.getElementById('page-load-status');
    if (status) status.textContent = 'Loading page';
  }, 180);
  document.addEventListener('DOMContentLoaded', () => {
    if (shown) document.getElementById('page-load-status').textContent = 'Loading page';
  }, { once: true });
  const finish = (ready) => {
    if (done) return;
    done = true;
    clearTimeout(showTimer);
    const wait = shown ? Math.max(0, (intro ? 950 : 500) - (performance.now() - shownAt)) : 0;
    setTimeout(() => {
      if (shown) document.getElementById('page-load-status').textContent = ready ? 'Page ready' : 'Page available while remaining items load';
      if (shown) root.classList.add('is-exiting');
      setTimeout(() => root.classList.remove('is-loading', 'is-exiting'), shown && !reducedMotion ? 780 : 0);
    }, wait);
  };
  window.addEventListener('load', () => finish(true), { once: true });
  window.addEventListener('pageshow', () => finish(true));
  setTimeout(() => finish(false), 5000);
})();
</script>`;

function page({ title, description, active = '', body, slug = '' }) {
  const canonical = `https://cloudpg.com.au/${slug ? `${slug}/` : ''}`;
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f7f4"><meta name="description" content="${description}"><title>${title} | Cloud Payment Group</title>${loaderScript}<link rel="icon" href="/assets/favicon.svg?v=2" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/modern.css"><link rel="canonical" href="${canonical}"></head><body class="${slug ? 'page-inner' : 'page-home'}">${loaderMarkup}${header(active)}<main id="main">${body}</main>${footer()}<script src="/assets/site.js" defer></script></body></html>`;
}

function innerHero(kicker, title, intro, className = '', art = '') {
  return `<section class="inner-hero ${className}"><div class="container inner-hero__grid"><div>${eyebrow('CLOUD PAYMENT GROUP', kicker)}<h1>${title}</h1></div><p>${intro}</p>${art ? `<div class="service-hero__art"><img src="/assets/${art}" width="1536" height="1024" alt="" fetchpriority="high"></div>` : ''}</div><div class="container inner-hero__rule"><span>DISCOVER MORE</span><span aria-hidden="true">↓</span></div></section>`;
}

function contactBand(title = 'Let’s make the next step clearer.', text = 'Tell us what your organisation needs. We’ll help you find the right starting point.') {
  return `<section class="contact-band"><div class="container contact-band__inner"><div>${eyebrow('GET IN TOUCH', 'START A CONVERSATION')}<h2>${title}</h2><p>${text}</p></div>${button('/contact-us/', 'Talk to our team', 'light')}</div></section>`;
}

const home = page({ title: 'A clearer path to payment', description: 'Debt collection and payment management services for organisations in Australia and New Zealand.', body: `
  ${homeHero}
  <section class="intro-statement"><div class="container intro-statement__grid">${eyebrow('WHO WE ARE', 'A DIFFERENT PERSPECTIVE')}<p>Better payment outcomes start with <em>understanding both sides.</em></p></div></section>
  <section class="section solutions" id="solutions"><div class="container">${sectionTitle('02', 'WHAT WE DO', 'Two connected services.', 'Practical support for organisations, with clear payment options for their customers.')}<div class="service-grid"><a class="service-card" href="/debt-collection/"><div class="service-card__image service-card__image--collection"><span>01 / DEBT COLLECTION</span><img src="/assets/collection-line.webp" width="1536" height="1024" alt="" loading="lazy"></div><div class="service-card__bottom"><div><span class="mini-label">01 / SERVICE</span><h3>Debt<br>collection</h3><p>Tailored recovery support, from early contact and account management to specialist options where appropriate.</p></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a><a class="service-card" href="/payment-management/"><div class="service-card__image service-card__image--payment"><span>02 / PAYMENT MANAGEMENT</span><img src="/assets/payment-line.webp" width="1536" height="1024" alt="" loading="lazy"></div><div class="service-card__bottom"><div><span class="mini-label">02 / SERVICE</span><h3>Payment<br>management</h3><p>Digital self-service through Payment Hubb, including payments, arrangements and account updates.</p></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a></div></div></section>
  <section class="proof-section" aria-labelledby="proof-title"><div class="container proof-section__grid"><div class="proof-section__copy"><p class="eyebrow"><span class="eyebrow__dot"></span>AT A GLANCE / CLOUD PAYMENT GROUP</p><h2 id="proof-title">Built for different account journeys.</h2><p>Connected support for organisations and clear options for the people managing an account.</p></div><div class="proof-grid" aria-label="Service scope"><div><strong>02</strong><span>Connected services</span></div><div><strong>05</strong><span>Sectors served</span></div><div><strong>AU + NZ</strong><span>Regional presence</span></div></div></div></section>
  <section class="section feature-dark"><div class="container feature-dark__grid"><div>${eyebrow('03', 'THE WAY WE WORK')}<h2>Practical for business.<br><em>Considerate of people.</em></h2><p>Cloud combines experienced people with digital tools to help organisations manage overdue accounts. The experience should remain clear for the people being contacted, too.</p>${button('/about-us/', 'Get to know Cloud', 'dark')}</div><div class="feature-dark__right"><div class="feature-dark__art"><span class="mini-label">PEOPLE + TOOLS</span><img src="/assets/team-line.webp" width="1536" height="1024" alt="Illustrated team reviewing account information and payment options" loading="lazy"><div class="feature-dark__chips"><span>Experienced people</span><span>Digital tools</span><span>Payment options</span></div></div><aside class="feature-note"><span>OUR APPROACH</span><h3>Context comes first.</h3><p>Clear information and practical choices can make a difficult account easier to navigate.</p><a href="/about-us/">How Cloud works ↗</a></aside></div></div></section>
  <section class="section sectors"><div class="container">${sectionTitle('04', 'INDUSTRIES', 'Built around different needs.', 'Cloud works with organisations in several sectors, each with its own context and customers.')}<div class="sector-list"><a href="/industries/#commercial"><span>01</span><strong>Commercial</strong><span class="sector-list__detail">Credit management and cash flow</span><span aria-hidden="true">↗</span></a><a href="/industries/#government"><span>02</span><strong>Local government</strong><span class="sector-list__detail">Community-aware service</span><span aria-hidden="true">↗</span></a><a href="/industries/#medical"><span>03</span><strong>Medical</strong><span class="sector-list__detail">Sensitive account recovery</span><span aria-hidden="true">↗</span></a><a href="/industries/#education"><span>04</span><strong>Education</strong><span class="sector-list__detail">Flexible fee recovery</span><span aria-hidden="true">↗</span></a><a href="/industries/#insurance"><span>05</span><strong>Insurance</strong><span class="sector-list__detail">Specialist claims knowledge</span><span aria-hidden="true">↗</span></a></div>${button('/industries/', 'Explore industries', 'text')}</div></section>
  <section class="section payment-highlight"><div class="container payment-highlight__grid"><div class="payment-highlight__art"><div class="payment-demo"><div class="payment-demo__header"><span>PAYMENT HUBB / ILLUSTRATIVE VIEW</span><span class="payment-demo__spark" aria-hidden="true">✳</span></div><div class="payment-demo__body"><div class="payment-demo__main"><span class="mini-label">AVAILABLE PATHS</span><div><span>01</span><strong>Pay in full</strong><span aria-hidden="true">↗</span></div><div><span>02</span><strong>Propose an arrangement</strong><span aria-hidden="true">↗</span></div><div><span>03</span><strong>Ask for support</strong><span aria-hidden="true">↗</span></div></div><div class="payment-demo__side"><span>OPTIONS THAT FIT</span><strong>Choose a clearer next step.</strong><p>Account information and available actions in one place.</p><span class="payment-demo__side-mark" aria-hidden="true">↗</span></div></div></div></div><div class="payment-highlight__copy">${eyebrow('05', 'PAYMENT HUBB')}<h2>Payment options that meet people where they are.</h2><p>Cloud’s Payment Hubb gives people access to their account through a smart device. They can pay in full, propose an arrangement, update details, or request support for financial hardship.</p>${button('/payment-management/', 'See payment management', 'dark')}</div></div></section>
  ${contactBand('Ready to find a better way forward?', 'Talk with Cloud about your organisation, your accounts, and the support you need.')}
`, slug: '' });

const about = page({ title: 'About us', description: 'Learn about Cloud Payment Group and its approach to debt collection and payment management.', active: 'about', slug: 'about-us', body: `
  <section class="about-hero" aria-labelledby="about-title"><div class="container about-hero__grid"><div class="about-hero__copy">${eyebrow('ABOUT CLOUD', 'PEOPLE + PAYMENT')}<h1 id="about-title">Built on experience.<br><em>Focused on people.</em></h1><p>Debt collection and payment management for organisations across Australia and New Zealand, led by a team that puts customer service first.</p><div class="about-hero__actions">${button('/contact-us/', 'Talk to our team', 'dark')}<a href="#about-services">Explore our services <span aria-hidden="true">↓</span></a></div></div><div class="about-hero__visual"><div class="about-hero__visual-label">THE PEOPLE BEHIND THE PROCESS <span aria-hidden="true">✳</span></div><img src="/assets/about-team.webp" width="1536" height="1024" alt="Illustration of three team members discussing an account together"><div class="about-hero__visual-foot"><strong>50+ years</strong><span>of credit-industry experience</span></div></div></div><div class="container about-hero__rail"><span>DEBT COLLECTION</span><span>CUSTOMER SERVICE</span><span>PAYMENT MANAGEMENT</span><span>AUSTRALIA + NEW ZEALAND</span></div></section>
  <section class="section about-intro"><div class="container about-intro__grid"><div>${eyebrow('01', 'WHAT WE DO')}<h2>Let us handle your payments, while you focus on your business.</h2></div><div class="about-intro__copy"><p>Cloud Payment Group brings more than half a century of credit-industry experience to two connected services: debt collection and payment management.</p><p>Collecting overdue payments can be challenging. Cloud combines experienced people, practical advice and modern tools to help organisations find an appropriate way forward.</p><a href="/contact-us/">Get to know how we can help <span aria-hidden="true">↗</span></a></div></div></section>
  <section class="section section--cream about-approach"><div class="container">${sectionTitle('02', 'OUR APPROACH', 'Service starts with understanding.', 'A team with varied experience, supported by tools that make the next step clearer.')}<div class="about-approach__grid"><article><span>01 / PEOPLE</span><h3>Customer service first.</h3><p>Cloud describes itself as a customer service-driven business. The way an account is handled matters to the organisation and to the person managing it.</p></article><article><span>02 / PERSPECTIVE</span><h3>Experience from different angles.</h3><p>Dedicated professionals bring distinct skill sets and industry perspectives to the accounts they manage.</p></article><article><span>03 / SOLUTIONS</span><h3>Practical ways forward.</h3><p>Debt collection expertise and digital payment options can work together, shaped around each organisation’s needs.</p></article></div></div></section>
  <section class="section about-services" id="about-services"><div class="container">${sectionTitle('03', 'WHAT WE OFFER', 'Two connected services.', 'Explore the service that fits your organisation and the people you serve.')}<div class="service-grid"><a class="service-card" href="/debt-collection/"><div class="service-card__image service-card__image--collection"><span>01 / DEBT COLLECTION</span><img src="/assets/about-collection.webp" width="1536" height="1024" alt="" loading="lazy"></div><div class="service-card__bottom"><div><span class="mini-label">FOR ORGANISATIONS</span><h3>Debt<br>collection</h3><p>Experienced recovery support, from early contact to account management and further options where appropriate.</p></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a><a class="service-card" href="/payment-management/"><div class="service-card__image service-card__image--payment"><span>02 / PAYMENT MANAGEMENT</span><img src="/assets/about-payment.webp" width="1536" height="1024" alt="" loading="lazy"></div><div class="service-card__bottom"><div><span class="mini-label">FOR ORGANISATIONS + CUSTOMERS</span><h3>Payment<br>management</h3><p>Digital account access through Payment Hubb, with ways to pay, propose arrangements and request support.</p></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a></div></div></section>
  <section class="section about-contact"><div class="container about-contact__grid"><div>${eyebrow('04', 'START A CONVERSATION')}<h2>Tell us what your organisation needs.</h2><p>Cloud can help you find the right person and the right service.</p>${button(liveContact, 'Open contact form', 'dark', external)}<small>The form opens on Cloud’s current website.</small></div><div class="about-contact__details"><span>REACH THE TEAM</span><a href="tel:1300549192">1300 549 192 <span aria-hidden="true">↗</span></a><a href="mailto:info@cloudpg.com.au">info@cloudpg.com.au <span aria-hidden="true">↗</span></a><p>Perth · Sydney · Melbourne · Queensland · Auckland</p><a class="about-contact__locations" href="/contact-us/">See contact details and locations <span aria-hidden="true">↗</span></a></div></div></section>
` });

const collection = page({ title: 'Debt collection', description: 'Explore Cloud Payment Group debt collection services and account management options.', active: 'collection', slug: 'debt-collection', body: `
  ${innerHero('DEBT COLLECTION', 'Recovery support<br><em>with perspective.</em>', 'Cloud tailors debt collection to the needs of different organisations and sectors, using experienced people and account-management tools.', 'service-hero service-hero--collection', 'service-collection.webp')}
  <section class="section"><div class="container split-feature"><div>${eyebrow('01', 'THE SERVICE')}<h2>Early action. Clear information. Appropriate next steps.</h2><p>Cloud describes pre-action account checks, communication across several channels, payment arrangements, reporting, and further specialist options where suitable. The approach depends on the account and your organisation’s requirements.</p>${button('/contact-us/', 'Discuss your needs', 'dark')}</div><img class="split-feature__photo" src="/assets/account-editorial.webp" alt="Unbranded account letter and reply card on a desk" loading="lazy" width="1122" height="1402"></div></section>
  <section class="section section--cream"><div class="container">${sectionTitle('02', 'CAPABILITIES', 'Support across the account journey.', 'Ask Cloud which capabilities apply to your organisation and accounts.')}<div class="capability-grid"><div><span>01</span><h3>Contact & communication</h3><p>Demand letters, phone, SMS, email, written communication, and field contact are among the channels described by Cloud.</p></div><div><span>02</span><h3>Account visibility</h3><p>DebtView provides clients with account reporting and access to relevant documentation.</p></div><div><span>03</span><h3>Ways to pay</h3><p>Customers can use the payment portal to pay in full or discuss an instalment arrangement, subject to client settings.</p></div><div><span>04</span><h3>Specialist options</h3><p>Cloud also describes credit documentation support, legal action, insolvency proceedings, and general advice where appropriate.</p></div></div></div></section>
  <section class="section"><div class="container decision-panel"><div>${eyebrow('03', 'EXISTING CLIENTS')}<h2>Ready to place an account?</h2><p>Use Cloud’s existing secure debt placement form. Account and debtor information is entered on Cloud’s live site.</p></div>${button('/debt-placement/', 'Go to debt placement', 'dark')}</div></section>${contactBand('Let’s talk about recovery support.', 'Tell Cloud about the type of accounts you manage and what you need help with.')}
` });

const payment = page({ title: 'Payment management', description: 'Explore Payment Hubb, Cloud Payment Group’s digital payment management service.', active: 'payment', slug: 'payment-management', body: `
  ${innerHero('PAYMENT MANAGEMENT', 'More ways to<br><em>move forward.</em>', 'Payment Hubb gives people digital access to account information and payment options, while helping organisations manage arrangements.', 'service-hero service-hero--payment', 'service-payment.webp')}
  <section class="section"><div class="container split-feature split-feature--reverse"><div>${eyebrow('01', 'PAYMENT HUBB')}<h2>A simpler way to manage an account.</h2><p>Cloud describes Payment Hubb as a white-label solution for businesses and local governments. People can access account details on a smart device and manage payments at a time that works for them.</p>${button('/contact-us/', 'Ask about Payment Hubb', 'dark')}</div><div class="option-panel option-panel--large"><span class="mini-label">PAYMENT HUBB / AVAILABLE PATHS</span><div><span>01</span><strong>Pay in full</strong></div><div><span>02</span><strong>Propose an arrangement</strong></div><div><span>03</span><strong>Ask for support</strong></div></div></div></section>
  <section class="section section--cream"><div class="container">${sectionTitle('02', 'WHAT IT SUPPORTS', 'Choice with clarity.')}<div class="capability-grid"><div><span>01</span><h3>Pay in full</h3><p>Customers can pay their account through the existing digital portal.</p></div><div><span>02</span><h3>Propose an arrangement</h3><p>Eligible customers can propose instalment arrangements within client-set parameters.</p></div><div><span>03</span><h3>Ask for hardship support</h3><p>The platform offers a way to lodge a financial-hardship request.</p></div><div><span>04</span><h3>Keep details current</h3><p>Customers can update contact information and receive reminders by email or SMS.</p></div></div></div></section>
  <section class="section"><div class="container decision-panel"><div>${eyebrow('03', 'FOR ACCOUNT HOLDERS')}<h2>Looking to manage your account?</h2><p>Use Cloud’s existing customer portal to view the options available for your account.</p></div>${button(paymentUrl, 'Open customer portal', 'dark', external)}</div></section>${contactBand('Bring simpler payment options to your customers.', 'Talk with Cloud about Payment Hubb for your organisation.')}
` });

const legal = page({ title: 'Legal services', description: 'Learn how Cloud Payment Group considers legal options in debt recovery.', active: 'legal', slug: 'legal-services', body: `
  ${innerHero('LEGAL SERVICES', 'The right next step<br><em>for the situation.</em>', 'Where initial demands are unsuccessful, further action may need consideration. Cloud can discuss the options relevant to your accounts.', 'service-hero service-hero--legal', 'service-legal.webp')}
  <section class="section"><div class="container narrative-grid"><div>${eyebrow('01', 'APPROACH')}<h2>Consider the account before the action.</h2></div><div class="prose"><p>Cloud says its services are tailored to different industries and organisations. Legal proceedings may be considered when demands for payment have not worked.</p><p>Any action depends on the circumstances. Speak with Cloud about your account and obtain appropriate professional advice before making a decision.</p>${button('/contact-us/', 'Discuss an account', 'dark')}</div></div></section>${contactBand('Need to discuss a complex account?', 'Cloud can help you identify the appropriate starting point for a conversation.')}
` });

const industries = page({ title: 'Industries', description: 'See the sectors Cloud Payment Group serves with debt collection and payment management.', active: 'industries', slug: 'industries', body: `
  ${innerHero('INDUSTRIES', 'Different sectors.<br><em>Different needs.</em>', 'Cloud works with organisations across commercial, government, medical, education, and insurance settings.')}
  <section class="section"><div class="container industry-stack"><article id="commercial"><span>01 / COMMERCIAL</span><div><h2>Commercial</h2><p>Credit management support intended to help businesses protect cash flow and manage overdue accounts.</p></div></article><article id="government"><span>02 / LOCAL GOVERNMENT</span><div><h2>Local government</h2><p>Services shaped around organisations and communities, with attention to respectful customer interactions.</p></div></article><article id="medical"><span>03 / MEDICAL</span><div><h2>Medical</h2><p>Recovery support for outstanding fees where sensitivity and context matter.</p></div></article><article id="education"><span>04 / EDUCATION</span><div><h2>Education</h2><p>Fee recovery support for primary, secondary, and tertiary education providers.</p></div></article><article id="insurance"><span>05 / INSURANCE</span><div><h2>Insurance</h2><p>Collections support informed by the requirements of general insurance claims.</p></div></article></div></section>${contactBand('Tell us about your sector.', 'Cloud can discuss an approach that fits your organisation and its customers.')}
` });

const contact = page({ title: 'Contact us', description: 'Contact Cloud Payment Group about debt collection or payment management services.', active: 'contact', slug: 'contact-us', body: `
  ${innerHero('CONTACT', 'Let’s find a<br><em>clearer way forward.</em>', 'Tell Cloud what your organisation needs. The team can help you find the right person and the right service.')}
  <section class="section"><div class="container contact-grid"><div>${eyebrow('01', 'START HERE')}<h2>How can we help?</h2><p>Use Cloud’s existing contact form to send an enquiry securely, or reach the team by phone or email.</p>${button(liveContact, 'Open contact form', 'dark', external)}<p class="handoff-note">The form opens on Cloud’s current website. This concept does not collect your details.</p></div><div class="contact-methods"><a href="tel:1300549192"><span>CALL</span><strong>1300 549 192</strong><span aria-hidden="true">↗</span></a><a href="mailto:info@cloudpg.com.au"><span>EMAIL</span><strong>info@cloudpg.com.au</strong><span aria-hidden="true">↗</span></a><a href="${paymentUrl}"${external}><span>ACCOUNT HOLDER</span><strong>Make a payment</strong><span aria-hidden="true">↗</span></a></div></div></section>
  <section class="section section--cream"><div class="container">${sectionTitle('02', 'LOCATIONS', 'Across Australia and New Zealand.')}<div class="office-grid"><div><h3>Perth</h3><p>Level 2, 2 Edward Street<br>East Perth WA 6004</p><p>PO Box 8229<br>Perth WA 6849</p></div><div><h3>Sydney</h3><p>Suite 14.03, Level 14<br>9 Hunter Street<br>Sydney NSW 2000</p></div><div><h3>Melbourne</h3><p>Contact the team on<br><a href="tel:1300549192">1300 549 192</a></p></div><div><h3>Queensland</h3><p>Contact the team on<br><a href="tel:1300549192">1300 549 192</a></p></div><div><h3>Auckland</h3><p>Floor 26, 188 Quay Street<br>Central Auckland 1010 NZ</p></div></div></div></section>
` });

const placement = page({ title: 'Debt placement', description: 'Start a debt placement using Cloud Payment Group’s existing secure form.', slug: 'debt-placement', body: `
  ${innerHero('DEBT PLACEMENT', 'Place an account<br><em>with confidence.</em>', 'Existing clients can submit a debt for review through Cloud’s current placement form.')}
  <section class="section"><div class="container handoff-grid"><div>${eyebrow('01', 'BEFORE YOU BEGIN')}<h2>Prepare the account details.</h2><p>The current form asks for debtor and contact information, account details, relevant dates and amount, optional documents, and your organisation’s details.</p><p>Please enter sensitive information only in Cloud’s existing form. This redesign concept does not collect or store debt information.</p>${button(livePlacement, 'Open Cloud placement form', 'dark', external)}<p class="handoff-note">Opens cloudpg.com.au in a new tab.</p></div><aside><span class="mini-label">ALSO AVAILABLE</span><h3>Need to talk first?</h3><p>If you are unsure what to provide, contact Cloud before placing an account.</p><a href="/contact-us/">Contact Cloud ${arrow}</a></aside></div></section>
` });

const blog = page({ title: 'Insights', description: 'Articles and perspectives from Cloud Payment Group.', active: 'blog', slug: 'blog', body: `
  ${innerHero('INSIGHTS', 'Perspectives on<br><em>better payment.</em>', 'Explore Cloud’s articles on debt recovery, payment management, and the wider credit landscape.')}
  <section class="section"><div class="container">${sectionTitle('01', 'FEATURED', 'Ideas worth exploring.')}<div class="article-grid"><a class="article-card" href="/blog/debt-recovery-in-modern-business/"><span class="article-card__art article-card__art--blue"><span>CLARITY<br>IN ACTION</span></span><span class="mini-label">DEBT RECOVERY</span><h3>Debt recovery in modern business</h3><p>A concise look at how organisations can approach overdue accounts and payment management.</p><span class="article-card__link">Read summary ${arrow}</span></a><a class="article-card" href="https://cloudpg.com.au/justin-smiley/"${external}><span class="article-card__art article-card__art--orange"><span>EXPERT<br>PERSPECTIVE</span></span><span class="mini-label">PEOPLE & PRACTICE</span><h3>Justin Smiley on legal debt recovery</h3><p>Read an existing Cloud article on the complexity of legal recovery.</p><span class="article-card__link">Read original ${arrow}</span></a><a class="article-card" href="https://cloudpg.com.au/how-are-we-managing-this-much-debt/"${external}><span class="article-card__art article-card__art--dark"><span>THE BIGGER<br>PICTURE</span></span><span class="mini-label">INDUSTRY</span><h3>How are we managing this much debt?</h3><p>Visit Cloud’s original article for its view on current debt pressures.</p><span class="article-card__link">Read original ${arrow}</span></a></div></div></section>${contactBand()}
` });

const article = page({ title: 'Debt recovery in modern business', description: 'A summary of Cloud Payment Group’s article on modern debt recovery.', active: 'blog', slug: 'blog/debt-recovery-in-modern-business', body: `
  <article><section class="article-hero"><div class="container"><a class="back-link" href="/blog/">← Back to insights</a>${eyebrow('INSIGHTS', 'DEBT RECOVERY')}<h1>Debt recovery in<br><em>modern business.</em></h1><p>A short introduction to Cloud’s perspective on managing overdue accounts.</p></div></section><div class="container article-body"><div class="article-body__meta">CLOUD PAYMENT GROUP<br>ARTICLE SUMMARY</div><div class="prose"><p>Overdue accounts can put pressure on an organisation’s cash flow and its customer relationships. Cloud presents debt collection and payment management as connected ways to address those accounts.</p><h2>Technology supports a clearer process</h2><p>The company describes digital reporting and customer payment options alongside experienced staff. Its services are tailored to different sectors rather than presented as one approach for every account.</p><h2>Keep the next step practical</h2><p>Organisations can speak with Cloud about their specific situation, while people managing an account can use the existing customer portal to review available payment options.</p><p class="article-source">This is a short design-concept summary. Read the full article on <a href="https://cloudpg.com.au/debt-recovery-in-modern-business/"${external}>Cloud’s current website ${arrow}</a>.</p></div></div></article>${contactBand()}
` });

const pages = new Map([
  ['', home], ['about-us', about], ['debt-collection', collection], ['payment-management', payment],
  ['legal-services', legal], ['industries', industries], ['contact-us', contact], ['debt-placement', placement],
  ['blog', blog], ['blog/debt-recovery-in-modern-business', article],
]);

mkdirSync(out, { recursive: true });
cpSync(join(root, 'public', 'assets'), join(out, 'assets'), { recursive: true });
cpSync(join(root, 'src', 'styles.css'), join(out, 'assets', 'styles.css'));
cpSync(join(root, 'src', 'modern.css'), join(out, 'assets', 'modern.css'));
cpSync(join(root, 'src', 'site.js'), join(out, 'assets', 'site.js'));
for (const [slug, html] of pages) {
  const dir = join(out, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}
console.log(`Built ${pages.size} pages in ${out}`);
