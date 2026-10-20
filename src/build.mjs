import { ensureFonts } from './fetch-fonts.mjs';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildSync } from 'esbuild';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'dist');
await ensureFonts(root);
const brandLogo = readFileSync(join(root, 'src', 'brand-logo.html'), 'utf8').trim();
const homeHero = readFileSync(join(root, 'src', 'home-hero.html'), 'utf8');
const mascotColorFilter = readFileSync(join(root, 'src', 'mascot-color-filter.html'), 'utf8');
const serviceJourney = readFileSync(join(root, 'src', 'service-journey.html'), 'utf8');
const paymentPhone = readFileSync(join(root, 'src', 'payment-phone.html'), 'utf8').replaceAll('{{brandLogo}}', brandLogo);
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
    <div class="container main-nav"><a class="brand" href="/" aria-label="Cloud Payment Group, home">${brandLogo}</a>
      <a class="mobile-pay mobile-login" href="/client-login/">Client login</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span><span></span><span></span></button>
      <nav id="primary-nav" class="primary-nav" aria-label="Main navigation">
        <div class="nav-links">${navLink('/about-us/', 'About', 'about')}
        <details class="nav-dropdown"${['collection', 'payment', 'legal'].includes(active) ? ' data-current="true"' : ''}><summary>Services <span aria-hidden="true">⌄</span></summary><div class="nav-dropdown__panel">${navLink('/debt-collection/', 'Debt collection', 'collection')}${navLink('/payment-management/', 'Payment management', 'payment')}${navLink('/legal-services/', 'Legal services', 'legal')}</div></details>
        ${navLink('/industries/', 'Industries', 'industries')}${navLink('/blog/', 'Insights', 'blog')}
        <a class="nav-cta" href="/contact-us/">Contact ${arrow}</a></div>
        <div class="nav-actions"><details class="nav-dropdown nav-dropdown--client"><summary>Client tools <span aria-hidden="true">⌄</span></summary><div class="nav-dropdown__panel"><a href="/debt-placement/">Debt placement</a></div></details>
        <a class="nav-login" href="/client-login/">Client login ${arrow}</a>
        <a class="nav-payment" href="${paymentUrl}"${external}>Make a payment ${arrow}</a>
        </div>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer footer-editorial" aria-label="Cloud Payment Group footer"><div class="footer-motion" data-footer-motion><div class="footer-editorial__inner footer-motion__stage">
    <div class="footer-editorial__main">
      <nav class="footer-editorial__nav" aria-label="Explore Cloud"><h2>Explore</h2><a href="/about-us/">About Cloud</a><a href="/debt-collection/">Debt collection</a><a href="/payment-management/">Payment management</a><a href="/legal-services/">Legal services</a><a href="/industries/">Industries</a><a href="/blog/">Insights</a></nav>
      <nav class="footer-editorial__nav" aria-label="Client tools"><h2>Here to help</h2><a href="/contact-us/">Contact us</a><a href="/debt-placement/">Debt placement</a><a href="${paymentUrl}"${external}>Make a payment ${arrow}</a><a href="/client-login/">Client login ${arrow}</a></nav>
      <div class="footer-editorial__invite"><p class="footer-editorial__eyebrow">A LITTLE UNDERSTANDING. A BETTER NEXT STEP.</p><h2>Good conversations.<br><em>Clearer outcomes.</em></h2><a class="footer-editorial__cta" href="/contact-us/">Let’s talk about what’s next</a><p class="footer-editorial__intro">Debt collection and payment management.<br>Practical for business. Considerate of people.</p></div>
    </div>
    <div class="footer-editorial__details">
      <div><h3>Call our team</h3><a href="tel:1300549192">1300 549 192</a><a href="mailto:info@cloudpg.com.au">info@cloudpg.com.au</a></div>
      <section aria-labelledby="footer-perth"><h3 id="footer-perth">Perth</h3><address>Level 2, 2 Edward Street<br>East Perth WA 6004<br><span>PO Box 8229 Perth WA 6849</span></address></section>
      <section aria-labelledby="footer-sydney"><h3 id="footer-sydney">Sydney</h3><address>Suite 14.03, Level 14<br>9 Hunter Street, Sydney NSW 2000</address><p>Also in Melbourne, Queensland and Auckland.</p></section>
    </div>
    <div class="footer-editorial__signature" aria-label="Cloud Payment Group"><img class="footer-editorial__mascot" src="/assets/mascot/cloudpg-31-footer-recline.png" width="1536" height="1024" alt="" loading="lazy" decoding="async" aria-hidden="true"><div class="footer-editorial__brandline"><span>PEOPLE. PAYMENTS. PERSPECTIVE.</span><span>AUSTRALIA & NEW ZEALAND</span></div><div class="footer-motion__mask"><div class="footer-motion__rail"><svg class="footer-editorial__wordmark" viewBox="0 0 1200 253" preserveAspectRatio="none" aria-hidden="true" focusable="false"><text x="-7" y="248" textLength="1210" lengthAdjust="spacingAndGlyphs">CLOUD</text></svg><span class="footer-motion__divider" aria-hidden="true"></span><span class="footer-motion__statement">A clearer path forward.</span></div></div><div class="footer-editorial__brandline footer-editorial__brandline--bottom"><span>PAYMENT GROUP</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></div></div>
    <div class="footer-editorial__legal"><a class="footer-editorial__logo" href="/" aria-label="Cloud Payment Group, home">${brandLogo}</a><span>© ${new Date().getFullYear()} Cloud Payment Group.</span><a href="${privacyUrl}"${external}>Privacy policy ${arrow}</a></div>
  </div></div></footer>`;
}

const loaderMarkup = `<div class="page-loader" aria-hidden="true"><div class="page-loader__frame">
  <div class="page-loader__top"><span class="page-loader__logo">${brandLogo}</span><span>AUSTRALIA & NEW ZEALAND</span></div>
  <div class="page-loader__content"><span class="page-loader__eyebrow">CLOUD PAYMENT GROUP <i>/</i> A CLEARER PATH FORWARD</span><p class="page-loader__headline"><span>A clearer path</span><span><em>forward.</em></span></p><p class="page-loader__subline">Making the next step clearer.</p></div>
  <svg class="page-loader__path" viewBox="0 0 1300 340" preserveAspectRatio="none" aria-hidden="true"><path pathLength="100" d="M -40 278 C 165 307 230 105 425 162 S 685 278 805 157 S 1075 157 1340 20" fill="none" stroke="#e75e2c" stroke-width="62"/><path pathLength="100" d="M -40 278 C 165 307 230 105 425 162 S 685 278 805 157 S 1075 157 1340 20" fill="none" stroke="#85d1e8" stroke-width="54"/></svg>
  <div class="page-loader__bottom"><span>FINDING THE WAY FORWARD</span><div class="page-loader__track"><span></span></div><span class="page-loader__arrow" aria-hidden="true">↗</span></div>
</div></div><span class="page-loader__status" id="page-load-status" role="status" aria-live="polite" aria-atomic="true"></span>`;
const loaderScript = `<script>
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  let intro = !reducedMotion;
  try {
    intro = !reducedMotion && (reload || !sessionStorage.getItem('cloud-loader-seen'));
    if (intro) sessionStorage.setItem('cloud-loader-seen', '1');
  } catch {}
  if (!intro) return;
  root.classList.add('is-loading');
  const startedAt = performance.now();
  let done = false, fallback = 0, finishTimer = 0, exitTimer = 0;
  const dismiss = () => {
    done = true;
    clearTimeout(fallback);
    clearTimeout(finishTimer);
    clearTimeout(exitTimer);
    root.classList.remove('is-loading', 'is-exiting');
  };
  const finish = (ready) => {
    if (done) return;
    done = true;
    clearTimeout(fallback);
    finishTimer = setTimeout(() => {
      const status = document.getElementById('page-load-status');
      if (status) status.textContent = ready ? 'Page ready' : 'Page available while remaining items load';
      root.classList.add('is-exiting');
      exitTimer = setTimeout(dismiss, 780);
    }, Math.max(0, 950 - (performance.now() - startedAt)));
  };
  const ready = () => finish(true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once:true });
  else ready();
  window.addEventListener('pageshow', event => event.persisted ? dismiss() : finish(true));
  window.addEventListener('pagehide', dismiss);
  fallback = setTimeout(() => finish(false), 1800);
})();
</script>`;

function page({ title, description, active = '', body, slug = '' }) {
  const canonical = `https://cloudpg.com.au/${slug ? `${slug}/` : ''}`;
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f7f4"><meta name="description" content="${description}"><title>${title} | Cloud Payment Group</title>${loaderScript}<link rel="icon" href="/assets/cloudpg-cloud-mark-cutout.png" type="image/png"><link rel="preload" href="/assets/fonts/fontshare/boska-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/fontshare/switzer-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/modern.css?v=original-loader-20261020"><link rel="stylesheet" href="/assets/photography.css?v=people-mascot-20261020"><link rel="stylesheet" href="/assets/contact-paper.css?v=holding-paper-20261020"><link rel="stylesheet" href="/assets/footer.css?v=reclining-mascot-20261020">${slug && slug !== 'client-login' ? '<link rel="stylesheet" href="/assets/inner-pages.css?v=1">' : ''}${slug === 'client-login' ? '<link rel="stylesheet" href="/assets/client-login.css?v=cloud-brand-palette">' : ''}${slug ? '' : '<link rel="stylesheet" href="/assets/hero-parallax.css"><link rel="stylesheet" href="/assets/hero-mascots.css?v=20261020"><link rel="stylesheet" href="/assets/home-start.css?v=slash-scenes-20261019"><link rel="stylesheet" href="/assets/service-journey.css"><link rel="stylesheet" href="/assets/industry-motion.css?v=pastel-mascots-20261020"><link rel="stylesheet" href="/assets/payment-phone.css?v=gripping-mascot-20261020">'}<link rel="stylesheet" href="/assets/reference-motion.css?v=globe-mascot-20261020"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/brand.css?v=original-logo-20261020"><link rel="canonical" href="${canonical}"></head><body class="${slug ? 'page-inner' : 'page-home'}${slug === 'client-login' ? ' page-login' : ''}">${!slug || slug === 'contact-us' ? mascotColorFilter : ''}${loaderMarkup}${slug === 'client-login' ? '' : header(active)}<main id="main">${body}</main>${slug === 'client-login' ? '' : footer()}<script src="/assets/site.js?v=slash-scenes-20261019" defer></script>${!slug ? '<script type="module" src="/assets/contact-globe.js"></script>' : ''}${slug === 'client-login' ? '<script type="module" src="/assets/client-login.js?v=cloud-brand-palette"></script>' : ''}${slug ? '' : '<script src="/assets/payment-phone.js?v=floating-phone-restored-20261019" defer></script>'}</body></html>`;
}

function industryArt(sector) {
  const labels = { commercial:'Account review', government:'Community context', medical:'Considered care', education:'Fee documentation', insurance:'Claims review' };
  const mascots = { commercial:'20-commercial', government:'21-community', medical:'28-medical-bed', education:'23-education', insurance:'24-insurance' };
  return `<span class="industry-panel-art" aria-hidden="true"><img src="/assets/mascot/cloudpg-${mascots[sector]}.png" width="1142" height="1378" alt="" loading="lazy"><span class="industry-scene-signal"><span class="industry-scene-signal__dot"></span><span>${labels[sector]}<small>PEOPLE + PERSPECTIVE</small></span></span></span>`;
}

function innerHero(kicker, title, intro, className = '', art = '') {
  const actions = {
    'DEBT COLLECTION': ['/contact-us/', 'Discuss recovery support', '/debt-placement/', 'Place an account'],
    'PAYMENT MANAGEMENT': ['/contact-us/', 'Ask about Payment Hubb', paymentUrl, 'Manage your account'],
    'LEGAL SERVICES': ['/contact-us/', 'Discuss your account'],
    'INDUSTRIES': ['#sectors', 'Find your sector', '/contact-us/', 'Talk to our team'],
    'CONTACT': ['#contact-form', 'Send an enquiry', 'tel:1300549192', 'Call 1300 549 192'],
    'DEBT PLACEMENT': [livePlacement, 'Open placement form', '/contact-us/', 'Ask a question'],
    'INSIGHTS': ['#featured', 'Explore the articles'],
  };
  const [href, label, secondaryHref, secondaryLabel] = actions[kicker] || ['/contact-us/', 'Talk to our team'];
  const attrs = href.startsWith('https:') ? external : '';
  const secondaryAttrs = secondaryHref?.startsWith('https:') ? external : '';
  return `<section class="inner-hero ${className}"><div class="container inner-hero__grid"><div class="inner-hero__copy">${eyebrow('CLOUD PAYMENT GROUP', kicker)}<h1>${title}</h1><p>${intro}</p><div class="inner-hero__actions">${button(href, label, 'dark', attrs)}${secondaryHref ? `<a class="inner-hero__secondary" href="${secondaryHref}"${secondaryAttrs}>${secondaryLabel}</a>` : ''}</div></div>${art ? `<div class="service-hero__art"><img class="inner-photo" src="/assets/${art}" width="1536" height="1024" alt="" fetchpriority="high"></div>` : ''}</div><div class="container inner-hero__rule"><span>AUSTRALIA & NEW ZEALAND</span><span>${kicker}</span></div></section>`;
}

function contactBand(title = 'Let’s make the next step clearer.', text = 'Tell us what your organisation needs. We’ll help you find the right starting point.') {
  return `<section class="contact-band"><div class="container contact-band__inner"><div>${eyebrow('GET IN TOUCH', 'START A CONVERSATION')}<h2>${title}</h2><p>${text}</p></div>${button('/contact-us/', 'Talk to our team', 'light')}</div></section>`;
}

function contactPaper(photo = 'home-contact') {
  return `<section class="section contact-paper" id="contact-form" aria-labelledby="contact-paper-title"><div class="container contact-paper__stage">
    <div class="contact-paper__character" aria-hidden="true"></div>
    <div class="contact-paper__sheet"><img class="contact-paper__mascot" src="/assets/mascot/cloudpg-29-paper-carrier.png" width="1142" height="1377" alt="" loading="lazy" decoding="async" aria-hidden="true"><span class="contact-paper__fold" aria-hidden="true"></span>
      <div class="contact-paper__heading">${eyebrow('LET’S TALK', 'CONTACT US')}<h2 id="contact-paper-title">${photo === 'home-contact' ? 'A little note.<br><em>A clearer next step.</em>' : 'Talk to Cloud.<br><em>Tell us what you need.</em>'}</h2><p>Get in touch to see how we can help.</p></div>
      <form class="contact-paper__form" data-contact-preview>
        <div class="contact-paper__fields">
          <label for="contact-first-name">First name <span aria-hidden="true">*</span><input id="contact-first-name" name="firstName" autocomplete="given-name" required></label>
          <label for="contact-last-name">Last name <span class="contact-paper__optional">Optional</span><input id="contact-last-name" name="lastName" autocomplete="family-name"></label>
          <label for="contact-email">Email <span aria-hidden="true">*</span><input id="contact-email" name="email" type="email" autocomplete="email" required></label>
          <label for="contact-phone">Phone number <span aria-hidden="true">*</span><input id="contact-phone" name="phone" type="tel" autocomplete="tel" required></label>
          <label class="contact-paper__message" for="contact-message">Message <span class="contact-paper__optional">Optional</span><textarea id="contact-message" name="message" rows="3" placeholder="Tell us a little about what you need."></textarea></label>
        </div>
        <div class="contact-paper__actions"><p id="contact-paper-note">Design preview only. No enquiry is sent.<br><span>* Required fields</span></p><button class="button button--dark" type="submit" aria-describedby="contact-paper-note" disabled>Send enquiry ${arrow}</button></div>
        <p class="contact-paper__status" role="status" aria-live="polite"></p>
      </form><div class="contact-paper__signoff" aria-hidden="true"><span>CLOUD PAYMENT GROUP</span><span>Here to help. ↗</span></div>
    </div>
  </div></section>`;
}

const home = page({ title: 'A clearer path to payment', description: 'Debt collection and payment management services for organisations in Australia and New Zealand.', body: `
  ${homeHero}
  ${readFileSync(join(root, 'src', 'home-start.html'), 'utf8')}
  ${serviceJourney}
  <section class="section feature-dark"><div class="container feature-dark__grid"><div>${eyebrow('03', 'THE WAY WE WORK')}<h2>Practical for business.<br><em>Considerate of people.</em></h2><p>Cloud combines experienced people with digital tools to help organisations manage overdue accounts. The experience should remain clear for the people being contacted, too.</p>${button('/about-us/', 'Get to know Cloud', 'dark')}</div><div class="feature-dark__right"><div class="feature-dark__art"><span class="mini-label">PEOPLE + TOOLS</span><div class="feature-people"><img class="feature-photo" src="/assets/photos/unique-v2/home-feature.webp" width="1536" height="1024" alt="Customer support colleagues collaborating in a bright office" loading="lazy"><img class="feature-people__mascot" src="/assets/mascot/cloudpg-31-people-point.png" width="1142" height="1377" alt="" loading="lazy" decoding="async" aria-hidden="true"></div><div class="feature-dark__chips"><span>Experienced people</span><span>Digital tools</span><span>Payment options</span></div></div><aside class="feature-note"><span>OUR APPROACH</span><h3>Context comes first.</h3><p>Clear information and practical choices can make a difficult account easier to navigate.</p><a href="/about-us/">How Cloud works ↗</a></aside></div></div></section>
  <section class="section sectors" id="industry-motion"><div class="container"><div class="industry-stack-track" data-industry-track><div class="industry-stack-stage"><div class="industry-stage-image" aria-hidden="true"><img class="industry-stage-photo is-active" src="/assets/photos/unique-v2/home-commercial.webp" width="1536" height="1024" alt="" loading="lazy"><img class="industry-stage-photo" src="/assets/photos/unique-v2/home-government.webp" width="1536" height="1024" alt="" loading="lazy"><img class="industry-stage-photo" src="/assets/photos/unique-v2/home-medical.webp" width="1536" height="1024" alt="" loading="lazy"><img class="industry-stage-photo" src="/assets/photos/unique-v2/home-education.webp" width="1536" height="1024" alt="" loading="lazy"><img class="industry-stage-photo" src="/assets/photos/unique-v2/home-insurance.webp" width="1536" height="1024" alt="" loading="lazy"></div><div class="industry-stack-intro">${sectionTitle('04', 'INDUSTRIES', 'Built around different needs.', 'Cloud works with organisations in several sectors, each with its own context and customers.')}</div><div class="sector-list industry-stack-viewport"><a data-industry-panel href="/industries/#commercial"><span class="industry-panel-number">(01)</span>${industryArt('commercial')}<div class="industry-panel-copy"><strong>Commercial</strong><p class="industry-panel-description">Credit management support intended to help businesses protect cash flow and manage overdue accounts.</p><span class="sector-list__detail">Credit management and cash flow</span><span class="industry-panel-link">Explore commercial <span aria-hidden="true">↗</span></span></div></a><a data-industry-panel href="/industries/#government"><span class="industry-panel-number">(02)</span>${industryArt('government')}<div class="industry-panel-copy"><strong>Local government</strong><p class="industry-panel-description">Services shaped around organisations and communities, with attention to respectful customer interactions.</p><span class="sector-list__detail">Community-aware service</span><span class="industry-panel-link">Explore local government <span aria-hidden="true">↗</span></span></div></a><a data-industry-panel href="/industries/#medical"><span class="industry-panel-number">(03)</span>${industryArt('medical')}<div class="industry-panel-copy"><strong>Medical</strong><p class="industry-panel-description">Recovery support for outstanding fees where sensitivity and context matter.</p><span class="sector-list__detail">Sensitive account recovery</span><span class="industry-panel-link">Explore medical <span aria-hidden="true">↗</span></span></div></a><a data-industry-panel href="/industries/#education"><span class="industry-panel-number">(04)</span>${industryArt('education')}<div class="industry-panel-copy"><strong>Education</strong><p class="industry-panel-description">Fee recovery support for primary, secondary, and tertiary education providers.</p><span class="sector-list__detail">Flexible fee recovery</span><span class="industry-panel-link">Explore education <span aria-hidden="true">↗</span></span></div></a><a data-industry-panel href="/industries/#insurance"><span class="industry-panel-number">(05)</span>${industryArt('insurance')}<div class="industry-panel-copy"><strong>Insurance</strong><p class="industry-panel-description">Collections support informed by the requirements of general insurance claims.</p><span class="sector-list__detail">Specialist claims knowledge</span><span class="industry-panel-link">Explore insurance <span aria-hidden="true">↗</span></span></div></a></div></div></div>${button('/industries/', 'Explore industries', 'text')}</div></section>
  ${readFileSync(join(root, 'src', 'process-globe.html'), 'utf8')}
  <section class="section payment-highlight" id="payment-hubb"><div class="container payment-highlight__grid"><div class="payment-highlight__art">${paymentPhone}</div><div class="payment-highlight__copy">${eyebrow('05', 'PAYMENT HUBB')}<h2>Payment options that meet people where they are.</h2><p>Cloud’s Payment Hubb gives people access to their account through a smart device. They can pay in full, propose an arrangement, update details, or request support for financial hardship.</p>${button('/payment-management/', 'See payment management', 'dark')}</div></div></section>
  ${contactPaper()}
`, slug: '' });

const about = page({ title: 'About us', description: 'Learn about Cloud Payment Group and its approach to debt collection and payment management.', active: 'about', slug: 'about-us', body: `
  <section class="about-hero" aria-labelledby="about-title"><div class="container about-hero__grid"><div class="about-hero__copy">${eyebrow('ABOUT CLOUD', 'PEOPLE + PAYMENT')}<h1 id="about-title">Built on experience.<br><em>Focused on people.</em></h1><p>Debt collection and payment management for organisations across Australia and New Zealand, led by a team that puts customer service first.</p><div class="about-hero__actions">${button('/contact-us/', 'Talk to our team', 'dark')}<a href="#about-services">Explore our services <span aria-hidden="true">↓</span></a></div></div><div class="about-hero__visual"><div class="about-hero__visual-label">THE PEOPLE BEHIND THE PROCESS <span aria-hidden="true">✳</span></div><img class="inner-photo" src="/assets/photos/unique-v2/about-hero.webp" width="1536" height="1024" alt="Business professionals walking through an office atrium"><div class="about-hero__visual-foot"><strong>50+ years</strong><span>of credit-industry experience</span></div></div></div><div class="container about-hero__rail"><span>DEBT COLLECTION</span><span>CUSTOMER SERVICE</span><span>PAYMENT MANAGEMENT</span><span>AUSTRALIA + NEW ZEALAND</span></div></section>
  <section class="section about-intro"><div class="container about-intro__grid"><div>${eyebrow('01', 'WHAT WE DO')}<h2>Let us handle your payments, while you focus on your business.</h2></div><div class="about-intro__copy"><p>Cloud Payment Group brings more than half a century of credit-industry experience to two connected services: debt collection and payment management.</p><p>Collecting overdue payments can be challenging. Cloud combines experienced people, practical advice and modern tools to help organisations find an appropriate way forward.</p><a href="/contact-us/">Get to know how we can help <span aria-hidden="true">↗</span></a></div></div></section>
  <section class="section section--cream about-approach"><div class="container">${sectionTitle('02', 'OUR APPROACH', 'Service starts with understanding.', 'A team with varied experience, supported by tools that make the next step clearer.')}<div class="about-approach__grid"><article><span>01 / PEOPLE</span><h3>Customer service first.</h3><p>Cloud describes itself as a customer service-driven business. The way an account is handled matters to the organisation and to the person managing it.</p></article><article><span>02 / PERSPECTIVE</span><h3>Experience from different angles.</h3><p>Dedicated professionals bring distinct skill sets and industry perspectives to the accounts they manage.</p></article><article><span>03 / SOLUTIONS</span><h3>Practical ways forward.</h3><p>Debt collection expertise and digital payment options can work together, shaped around each organisation’s needs.</p></article></div></div></section>
  <section class="section about-services" id="about-services"><div class="container">${sectionTitle('03', 'WHAT WE OFFER', 'Two connected services.', 'Explore the service that fits your organisation and the people you serve.')}<div class="service-grid"><a class="service-card" href="/debt-collection/"><div class="service-card__image service-card__image--collection"><span>01 / DEBT COLLECTION</span><img class="card-photo" src="/assets/photos/unique-v2/about-collection-service.webp" width="1536" height="1024" alt="Credit manager reviewing an account during a phone call" loading="lazy"></div><div class="service-card__bottom"><div><span class="mini-label">FOR ORGANISATIONS</span><h3>Debt<br>collection</h3><p>Experienced recovery support, from early contact to account management and further options where appropriate.</p></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a><a class="service-card" href="/payment-management/"><div class="service-card__image service-card__image--payment"><span>02 / PAYMENT MANAGEMENT</span><img class="card-photo" src="/assets/photos/unique-v2/about-payment-service.webp" width="1536" height="1024" alt="Business owner checking a payment on her phone at a cafe" loading="lazy"></div><div class="service-card__bottom"><div><span class="mini-label">FOR ORGANISATIONS + CUSTOMERS</span><h3>Payment<br>management</h3><p>Digital account access through Payment Hubb, with ways to pay, propose arrangements and request support.</p></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a></div></div></section>
  <section class="section about-contact"><div class="container about-contact__grid"><div>${eyebrow('04', 'START A CONVERSATION')}<h2>Tell us what your organisation needs.</h2><p>Cloud can help you find the right person and the right service.</p>${button(liveContact, 'Open contact form', 'dark', external)}<small>The form opens on Cloud’s current website.</small></div><div class="about-contact__details"><span>REACH THE TEAM</span><a href="tel:1300549192">1300 549 192 <span aria-hidden="true">↗</span></a><a href="mailto:info@cloudpg.com.au">info@cloudpg.com.au <span aria-hidden="true">↗</span></a><p>Perth · Sydney · Melbourne · Queensland · Auckland</p><a class="about-contact__locations" href="/contact-us/">See contact details and locations <span aria-hidden="true">↗</span></a></div></div></section>
` });

const collection = page({ title: 'Debt collection', description: 'Explore Cloud Payment Group debt collection services and account management options.', active: 'collection', slug: 'debt-collection', body: `
  ${innerHero('DEBT COLLECTION', 'Recovery support<br><em>with perspective.</em>', 'Cloud tailors debt collection to the needs of different organisations and sectors, using experienced people and account-management tools.', 'service-hero service-hero--collection', 'photos/unique-v2/collection-hero.webp')}
  <section class="section"><div class="container split-feature"><div>${eyebrow('01', 'THE SERVICE')}<h2>Early action. Clear information. Appropriate next steps.</h2><p>Cloud describes pre-action account checks, communication across several channels, payment arrangements, reporting, and further specialist options where suitable. The approach depends on the account and your organisation’s requirements.</p>${button('/contact-us/', 'Discuss your needs', 'dark')}</div><img class="split-feature__photo review-photo" src="/assets/photos/unique-v2/collection-review.webp" alt="Account specialist organising correspondence in a folder" loading="lazy" width="1536" height="1024"></div></section>
  <section class="section section--cream"><div class="container">${sectionTitle('02', 'CAPABILITIES', 'Support across the account journey.', 'Ask Cloud which capabilities apply to your organisation and accounts.')}<div class="capability-grid"><div><span>01</span><h3>Contact & communication</h3><p>Demand letters, phone, SMS, email, written communication, and field contact are among the channels described by Cloud.</p></div><div><span>02</span><h3>Account visibility</h3><p>DebtView provides clients with account reporting and access to relevant documentation.</p></div><div><span>03</span><h3>Ways to pay</h3><p>Customers can use the payment portal to pay in full or discuss an instalment arrangement, subject to client settings.</p></div><div><span>04</span><h3>Specialist options</h3><p>Cloud also describes credit documentation support, legal action, insolvency proceedings, and general advice where appropriate.</p></div></div></div></section>
  <section class="section"><div class="container decision-panel"><div>${eyebrow('03', 'EXISTING CLIENTS')}<h2>Ready to place an account?</h2><p>Use Cloud’s existing secure debt placement form. Account and debtor information is entered on Cloud’s live site.</p></div>${button('/debt-placement/', 'Go to debt placement', 'dark')}</div></section>${contactBand('Let’s talk about recovery support.', 'Tell Cloud about the type of accounts you manage and what you need help with.')}
` });

const payment = page({ title: 'Payment management', description: 'Explore Payment Hubb, Cloud Payment Group’s digital payment management service.', active: 'payment', slug: 'payment-management', body: `
  ${innerHero('PAYMENT MANAGEMENT', 'More ways to<br><em>move forward.</em>', 'Payment Hubb gives people digital access to account information and payment options, while helping organisations manage arrangements.', 'service-hero service-hero--payment', 'photos/unique-v2/payment-hero.webp')}
  <section class="section"><div class="container split-feature split-feature--reverse"><div>${eyebrow('01', 'PAYMENT HUBB')}<h2>A simpler way to manage an account.</h2><p>Cloud describes Payment Hubb as a white-label solution for businesses and local governments. People can access account details on a smart device and manage payments at a time that works for them.</p>${button('/contact-us/', 'Ask about Payment Hubb', 'dark')}</div><div class="option-panel option-panel--large"><span class="mini-label">PAYMENT HUBB / AVAILABLE PATHS</span><div><span>01</span><strong>Pay in full</strong></div><div><span>02</span><strong>Propose an arrangement</strong></div><div><span>03</span><strong>Ask for support</strong></div></div></div></section>
  <section class="section section--cream"><div class="container">${sectionTitle('02', 'WHAT IT SUPPORTS', 'Choice with clarity.')}<div class="capability-grid"><div><span>01</span><h3>Pay in full</h3><p>Customers can pay their account through the existing digital portal.</p></div><div><span>02</span><h3>Propose an arrangement</h3><p>Eligible customers can propose instalment arrangements within client-set parameters.</p></div><div><span>03</span><h3>Ask for hardship support</h3><p>The platform offers a way to lodge a financial-hardship request.</p></div><div><span>04</span><h3>Keep details current</h3><p>Customers can update contact information and receive reminders by email or SMS.</p></div></div></div></section>
  <section class="section"><div class="container decision-panel"><div>${eyebrow('03', 'FOR ACCOUNT HOLDERS')}<h2>Looking to manage your account?</h2><p>Use Cloud’s existing customer portal to view the options available for your account.</p></div>${button(paymentUrl, 'Open customer portal', 'dark', external)}</div></section>${contactBand('Bring simpler payment options to your customers.', 'Talk with Cloud about Payment Hubb for your organisation.')}
` });

const legal = page({ title: 'Legal services', description: 'Learn how Cloud Payment Group considers legal options in debt recovery.', active: 'legal', slug: 'legal-services', body: `
  ${innerHero('LEGAL SERVICES', 'The right next step<br><em>for the situation.</em>', 'Where initial demands are unsuccessful, further action may need consideration. Cloud can discuss the options relevant to your accounts.', 'service-hero service-hero--legal', 'photos/unique-v2/legal-hero.webp')}
  <section class="section"><div class="container narrative-grid"><div>${eyebrow('01', 'APPROACH')}<h2>Consider the account before the action.</h2></div><div class="prose"><p>Cloud says its services are tailored to different industries and organisations. Legal proceedings may be considered when demands for payment have not worked.</p><p>Any action depends on the circumstances. Speak with Cloud about your account and obtain appropriate professional advice before making a decision.</p>${button('/contact-us/', 'Discuss an account', 'dark')}</div></div></section>${contactBand('Need to discuss a complex account?', 'Cloud can help you identify the appropriate starting point for a conversation.')}
` });

const industries = page({ title: 'Industries', description: 'See the sectors Cloud Payment Group serves with debt collection and payment management.', active: 'industries', slug: 'industries', body: `
  ${innerHero('INDUSTRIES', 'Different sectors.<br><em>Different needs.</em>', 'Cloud works with organisations across commercial, government, medical, education, and insurance settings.', 'service-hero', 'photos/unique-v2/industries-hero.webp')}
  <section class="section" id="sectors"><div class="container"><nav class="sector-jumps" aria-label="Explore sectors"><a href="#commercial">Commercial</a><a href="#government">Local government</a><a href="#medical">Medical</a><a href="#education">Education</a><a href="#insurance">Insurance</a></nav></div><div class="container industry-stack"><article id="commercial"><span>01 / COMMERCIAL</span><div><h2>Commercial</h2><p>Credit management support intended to help businesses protect cash flow and manage overdue accounts.</p></div><img class="sector-photo" src="/assets/photos/unique-v2/industry-commercial.webp" width="1536" height="1024" alt="Business professionals discussing commercial accounts" loading="lazy"></article><article id="government"><span>02 / LOCAL GOVERNMENT</span><div><h2>Local government</h2><p>Services shaped around organisations and communities, with attention to respectful customer interactions.</p></div><img class="sector-photo" src="/assets/photos/unique-v2/industry-government.webp" width="1536" height="1024" alt="Local government professionals assisting their community" loading="lazy"></article><article id="medical"><span>03 / MEDICAL</span><div><h2>Medical</h2><p>Recovery support for outstanding fees where sensitivity and context matter.</p></div><img class="sector-photo" src="/assets/photos/unique-v2/industry-medical.webp" width="1536" height="1024" alt="Medical practice administrators discussing billing" loading="lazy"></article><article id="education"><span>04 / EDUCATION</span><div><h2>Education</h2><p>Fee recovery support for primary, secondary, and tertiary education providers.</p></div><img class="sector-photo" src="/assets/photos/unique-v2/industry-education.webp" width="1536" height="1024" alt="University student and adviser discussing a fee arrangement" loading="lazy"></article><article id="insurance"><span>05 / INSURANCE</span><div><h2>Insurance</h2><p>Collections support informed by the requirements of general insurance claims.</p></div><img class="sector-photo" src="/assets/photos/unique-v2/industry-insurance.webp" width="1536" height="1024" alt="Customers meeting with an insurance support specialist" loading="lazy"></article></div></section>${contactBand('Tell us about your sector.', 'Cloud can discuss an approach that fits your organisation and its customers.')}
` });

const contact = page({ title: 'Contact us', description: 'Contact Cloud Payment Group about debt collection or payment management services.', active: 'contact', slug: 'contact-us', body: `
  ${innerHero('CONTACT', 'Let’s find a<br><em>clearer way forward.</em>', 'Tell Cloud what your organisation needs. The team can help you find the right person and the right service.', 'service-hero', 'photos/unique-v2/contact-hero.webp')}
  ${contactPaper('contact-form')}
  <section class="section"><div class="container contact-grid"><div>${eyebrow('01', 'START HERE')}<h2>How can we help?</h2><p>Use Cloud’s existing contact form to send an enquiry securely, or reach the team by phone or email.</p>${button(liveContact, 'Open contact form', 'dark', external)}<p class="handoff-note">The form opens on Cloud’s current website. This concept does not collect your details.</p></div><div class="contact-methods"><a href="tel:1300549192"><span>CALL</span><strong>1300 549 192</strong><span aria-hidden="true">↗</span></a><a href="mailto:info@cloudpg.com.au"><span>EMAIL</span><strong>info@cloudpg.com.au</strong><span aria-hidden="true">↗</span></a><a href="${paymentUrl}"${external}><span>ACCOUNT HOLDER</span><strong>Make a payment</strong><span aria-hidden="true">↗</span></a></div></div></section>
  <section class="section section--cream"><div class="container">${sectionTitle('02', 'LOCATIONS', 'Across Australia and New Zealand.')}<div class="office-grid"><div><h3>Perth</h3><p>Level 2, 2 Edward Street<br>East Perth WA 6004</p><p>PO Box 8229<br>Perth WA 6849</p></div><div><h3>Sydney</h3><p>Suite 14.03, Level 14<br>9 Hunter Street<br>Sydney NSW 2000</p></div><div><h3>Melbourne</h3><p>Contact the team on<br><a href="tel:1300549192">1300 549 192</a></p></div><div><h3>Queensland</h3><p>Contact the team on<br><a href="tel:1300549192">1300 549 192</a></p></div><div><h3>Auckland</h3><p>Floor 26, 188 Quay Street<br>Central Auckland 1010 NZ</p></div></div></div></section>
` });

const placement = page({ title: 'Debt placement', description: 'Start a debt placement using Cloud Payment Group’s existing secure form.', slug: 'debt-placement', body: `
  ${innerHero('DEBT PLACEMENT', 'Place an account<br><em>with confidence.</em>', 'Existing clients can submit a debt for review through Cloud’s current placement form.', 'service-hero', 'photos/unique-v2/placement-hero.webp')}
  <section class="section"><div class="container handoff-grid"><div>${eyebrow('01', 'BEFORE YOU BEGIN')}<h2>Prepare the account details.</h2><p>The current form asks for debtor and contact information, account details, relevant dates and amount, optional documents, and your organisation’s details.</p><p>Please enter sensitive information only in Cloud’s existing form. This redesign concept does not collect or store debt information.</p>${button(livePlacement, 'Open Cloud placement form', 'dark', external)}<p class="handoff-note">Opens cloudpg.com.au in a new tab.</p></div><aside><span class="mini-label">ALSO AVAILABLE</span><h3>Need to talk first?</h3><p>If you are unsure what to provide, contact Cloud before placing an account.</p><a href="/contact-us/">Contact Cloud ${arrow}</a></aside></div></section>
` });

const blog = page({ title: 'Insights', description: 'Articles and perspectives from Cloud Payment Group.', active: 'blog', slug: 'blog', body: `
  ${innerHero('INSIGHTS', 'Perspectives on<br><em>better payment.</em>', 'Explore Cloud’s articles on debt recovery, payment management, and the wider credit landscape.', 'service-hero', 'photos/unique-v2/insights-hero.webp')}
  <section class="section" id="featured"><div class="container">${sectionTitle('01', 'FEATURED', 'Ideas worth exploring.')}<div class="article-grid"><a class="article-card" href="/blog/debt-recovery-in-modern-business/"><span class="article-card__art article-card__art--blue"><span>CLARITY<br>IN ACTION</span></span><span class="mini-label">DEBT RECOVERY</span><h3>Debt recovery in modern business</h3><p>A concise look at how organisations can approach overdue accounts and payment management.</p><span class="article-card__link">Read summary ${arrow}</span></a><a class="article-card" href="https://cloudpg.com.au/justin-smiley/"${external}><span class="article-card__art article-card__art--orange"><span>EXPERT<br>PERSPECTIVE</span></span><span class="mini-label">PEOPLE & PRACTICE</span><h3>Justin Smiley on legal debt recovery</h3><p>Read an existing Cloud article on the complexity of legal recovery.</p><span class="article-card__link">Read original ${arrow}</span></a><a class="article-card" href="https://cloudpg.com.au/how-are-we-managing-this-much-debt/"${external}><span class="article-card__art article-card__art--dark"><span>THE BIGGER<br>PICTURE</span></span><span class="mini-label">INDUSTRY</span><h3>How are we managing this much debt?</h3><p>Visit Cloud’s original article for its view on current debt pressures.</p><span class="article-card__link">Read original ${arrow}</span></a></div></div></section>${contactBand()}
` });

const article = page({ title: 'Debt recovery in modern business', description: 'A summary of Cloud Payment Group’s article on modern debt recovery.', active: 'blog', slug: 'blog/debt-recovery-in-modern-business', body: `
  <article><section class="article-hero"><div class="container"><a class="back-link" href="/blog/">← Back to insights</a>${eyebrow('INSIGHTS', 'DEBT RECOVERY')}<h1>Debt recovery in<br><em>modern business.</em></h1><p>A short introduction to Cloud’s perspective on managing overdue accounts.</p></div></section><div class="container article-body"><div class="article-body__meta">CLOUD PAYMENT GROUP<br>ARTICLE SUMMARY</div><div class="prose"><p>Overdue accounts can put pressure on an organisation’s cash flow and its customer relationships. Cloud presents debt collection and payment management as connected ways to address those accounts.</p><h2>Technology supports a clearer process</h2><p>The company describes digital reporting and customer payment options alongside experienced staff. Its services are tailored to different sectors rather than presented as one approach for every account.</p><h2>Keep the next step practical</h2><p>Organisations can speak with Cloud about their specific situation, while people managing an account can use the existing customer portal to review available payment options.</p><p class="article-source">This is a short design-concept summary. Read the full article on <a href="https://cloudpg.com.au/debt-recovery-in-modern-business/"${external}>Cloud’s current website ${arrow}</a>.</p></div></div></article>${contactBand()}
` });

const login = page({ title:'Client login', description:'Preview the Cloud Payment Group client login.', slug:'client-login', body:readFileSync(join(root, 'src', 'client-login.html'), 'utf8').replaceAll('{{brandLogo}}', brandLogo).replace('{{clientUrl}}', clientUrl) });

const admin = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Admin workspace | Cloud Payment Group</title><link rel="icon" href="/assets/cloudpg-cloud-mark-cutout.png"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/brand.css?v=original-logo-20261020"><link rel="stylesheet" href="/assets/admin.css"></head><body class="page-admin">${readFileSync(join(root, 'src', 'admin.html'), 'utf8').replaceAll('{{brandLogo}}', brandLogo)}<script src="/assets/admin.js" defer></script></body></html>`;

const pages = new Map([
  ['', home], ['about-us', about], ['debt-collection', collection], ['payment-management', payment],
  ['legal-services', legal], ['industries', industries], ['contact-us', contact], ['debt-placement', placement],
  ['blog', blog], ['blog/debt-recovery-in-modern-business', article],
  ['client-login', login], ['admin', admin],
]);

// Each photographic placement gets a separate original asset, across all routes.
const photoPlacements = new Map();
for (const [slug, html] of pages) {
  for (const [, photo] of html.matchAll(/src="(\/assets\/photos\/[^"?]+)"/g)) {
    if (photoPlacements.has(photo)) {
      throw new Error(`Photo reused on ${slug || '/'} and ${photoPlacements.get(photo)}: ${photo}`);
    }
    readFileSync(join(root, 'public', photo.slice(1)));
    photoPlacements.set(photo, slug || '/');
  }
}

mkdirSync(out, { recursive: true });
cpSync(join(root, 'public', 'assets'), join(out, 'assets'), { recursive: true });
cpSync(join(root, 'src', 'styles.css'), join(out, 'assets', 'styles.css'));
cpSync(join(root, 'src', 'brand.css'), join(out, 'assets', 'brand.css'));
cpSync(join(root, 'src', 'fonts.css'), join(out, 'assets', 'fonts.css'));
cpSync(join(root, 'src', 'hero-parallax.css'), join(out, 'assets', 'hero-parallax.css'));
cpSync(join(root, 'src', 'hero-mascots.css'), join(out, 'assets', 'hero-mascots.css'));
cpSync(join(root, 'src', 'home-start.css'), join(out, 'assets', 'home-start.css'));
cpSync(join(root, 'src', 'modern.css'), join(out, 'assets', 'modern.css'));
cpSync(join(root, 'src', 'service-journey.css'), join(out, 'assets', 'service-journey.css'));
cpSync(join(root, 'src', 'industry-motion.css'), join(out, 'assets', 'industry-motion.css'));
cpSync(join(root, 'src', 'reference-motion.css'), join(out, 'assets', 'reference-motion.css'));
cpSync(join(root, 'src', 'photography.css'), join(out, 'assets', 'photography.css'));
cpSync(join(root, 'src', 'inner-pages.css'), join(out, 'assets', 'inner-pages.css'));
cpSync(join(root, 'src', 'footer.css'), join(out, 'assets', 'footer.css'));
cpSync(join(root, 'src', 'contact-paper.css'), join(out, 'assets', 'contact-paper.css'));
cpSync(join(root, 'src', 'client-login.css'), join(out, 'assets', 'client-login.css'));
cpSync(join(root, 'src', 'admin.css'), join(out, 'assets', 'admin.css'));
writeFileSync(join(out, 'assets', 'admin.js'), readFileSync(join(root, 'src', 'admin-scenes.js'), 'utf8') + '\n' + readFileSync(join(root, 'src', 'admin.js'), 'utf8'));
buildSync({ entryPoints:[join(root, 'src', 'contact-globe.js')], outfile:join(out, 'assets', 'contact-globe.js'), bundle:true, minify:true, format:'esm', target:'es2022' });
buildSync({ entryPoints:[join(root, 'src', 'client-login.js')], outfile:join(out, 'assets', 'client-login.js'), bundle:true, minify:true, format:'esm', target:'es2022' });
cpSync(join(root, 'src', 'payment-phone.css'), join(out, 'assets', 'payment-phone.css'));
cpSync(join(root, 'src', 'payment-phone.js'), join(out, 'assets', 'payment-phone.js'));
writeFileSync(join(out, 'assets', 'site.js'), readFileSync(join(root, 'src', 'hero-messages.js'), 'utf8') + '\n' + readFileSync(join(root, 'src', 'site.js'), 'utf8') + '\n' + readFileSync(join(root, 'src', 'hero-parallax.js'), 'utf8') + '\n' + readFileSync(join(root, 'src', 'reference-motion.js'), 'utf8') + '\n' + readFileSync(join(root, 'src', 'home-start.js'), 'utf8'));
for (const [slug, html] of pages) {
  const dir = join(out, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html.replace(/<img\b/g, '<img draggable="false"'));
}
console.log(`Built ${pages.size} pages in ${out}`);
