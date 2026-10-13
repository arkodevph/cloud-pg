const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navigation.classList.toggle('is-open', open);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 1320px)').matches) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
      navigation.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
      navigation.classList.remove('is-open');
      menuButton.focus();
    }
  });
}

const heroScene = document.querySelector('.hero__scene');

if (heroScene && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let frame = 0;

  const updateHeroCards = () => {
    const { top, height } = heroScene.getBoundingClientRect();
    const travel = window.innerHeight * .75 + height;
    const progress = Math.max(0, Math.min(1, (window.innerHeight * .75 - top) / travel));
    const scale = 1 + .16 * Math.sin(progress * Math.PI);
    heroScene.style.setProperty('--hero-card-scale', scale.toFixed(3));
    frame = 0;
  };

  const scheduleHeroCards = () => {
    if (!frame) frame = requestAnimationFrame(updateHeroCards);
  };

  window.addEventListener('scroll', scheduleHeroCards, { passive: true });
  window.addEventListener('resize', scheduleHeroCards);
  scheduleHeroCards();
}

// 18.07.13: pinned visual, active copy, and softly changing illustration.
const journey = document.querySelector('.service-journey');
if (journey) {
  const steps = [...journey.querySelectorAll('[data-step]')];
  const scenes = [...journey.querySelectorAll('[data-scene]')];
  const visual = journey.querySelector('.journey-visual');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  const select = index => {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
  };
  const update = () => {
    scheduled = false;
    const bounds = journey.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) return;
    const target = innerWidth <= 800 ? Math.max(visual.getBoundingClientRect().bottom + 100, innerHeight * .65) : innerHeight * .5;
    let nearest = 0, distance = Infinity;
    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const delta = Math.abs(rect.top + rect.height / 2 - target);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    select(nearest);
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  steps.forEach((step, index) => step.addEventListener('focusin', () => select(index)));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule, { once: true });
  const motion = () => { journey.classList.toggle('journey-enhanced', !reducedMotion.matches); schedule(); };
  reducedMotion.addEventListener('change', motion);
  motion();
}

// 18.11.06: opaque, layered industry panels peel upward in perspective.
const industryTrack = document.querySelector('[data-industry-track]');
if (industryTrack) {
  const panels = [...industryTrack.querySelectorAll('[data-industry-panel]')];
  const viewport = industryTrack.querySelector('.industry-stack-viewport');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  const render = position => {
    const front = Math.min(panels.length - 1, Math.floor(position));
    const progress = Math.max(0, Math.min(1, (position - front - .35) / .65));
    const eased = progress * progress * (3 - 2 * progress);
    const height = viewport.clientHeight;
    panels.forEach((panel, index) => {
      const depth = index - front;
      const past = depth < 0;
      const y = past ? -height * 1.4 : depth === 0 ? -height * 1.4 * eased : 18 * (Math.min(depth, 3) - eased);
      const tilt = depth === 0 ? 14 * Math.sin(progress * Math.PI) : 0;
      const scale = depth <= 0 ? 1 : 1 - .035 * (Math.min(depth, 3) - eased);
      panel.style.transform = `perspective(1100px) translateY(${y}px) rotateX(${tilt}deg) scale(${scale})`;
      panel.style.zIndex = String(panels.length - index);
      panel.style.visibility = past ? 'hidden' : 'visible';
      panel.style.pointerEvents = depth === 0 || (depth === 1 && progress > .8) ? 'auto' : 'none';
    });
  };
  const update = () => {
    scheduled = false;
    if (preference.matches) return;
    const rect = industryTrack.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(viewport).top) || 0;
    const travel = Math.max(1, industryTrack.offsetHeight - viewport.offsetHeight - top);
    const position = Math.max(0, Math.min(1, (top - rect.top) / travel)) * (panels.length - 1);
    render(position);
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  const motion = () => {
    industryTrack.classList.toggle('industry-stack-enhanced', !preference.matches);
    panels.forEach(panel => { panel.style.transform = ''; panel.style.visibility = ''; panel.style.pointerEvents = ''; });
    schedule();
  };
  panels.forEach((panel, index) => panel.addEventListener('focus', () => {
    if (preference.matches) return;
    const top = parseFloat(getComputedStyle(viewport).top) || 0;
    const travel = Math.max(1, industryTrack.offsetHeight - viewport.offsetHeight - top);
    window.scrollTo({ top: scrollY + industryTrack.getBoundingClientRect().top - top + travel * index / (panels.length - 1), behavior: 'instant' });
    render(index);
  }));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule, { once: true });
  preference.addEventListener('change', motion);
  motion();
}

// The account lookup visibly processes, finds a record, and opens its context.
if (journey) {
  const status = journey.querySelector('[data-report-status]');
  const icon = journey.querySelector('[data-report-icon]');
  const notice = journey.querySelector('[data-report-notice]');
  const row = journey.querySelector('[data-report-match]');
  if (status && icon && notice && row) {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false, frame = 0, scene = '', started = 0, lastBeat = -1;
    const beats = ['Searching account records', 'Reviewing client documents', 'Found 1 matching account', 'Account context ready'];
    const renderBeat = beat => {
      if (beat === lastBeat) return;
      lastBeat = beat;
      status.textContent = beats[beat];
      icon.textContent = beat < 2 ? '✳' : '✓';
      notice.classList.toggle('is-complete', beat >= 2);
      row.classList.toggle('is-found', beat >= 2);
    };
    const queue = journey.querySelector('.source-queue');
    const updates = [...journey.querySelectorAll('.source-update')];
    const chart = journey.querySelector('[data-chart-mode]');
    const chartTitle = journey.querySelector('[data-chart-title]');
    const tick = now => {
      const current = journey.querySelector('.journey-scene.is-active')?.dataset.scene;
      if (current !== scene) { scene = current; started = now; lastBeat = -1; }
      if (scene === '2') renderBeat(Math.min(3, Math.floor(((now - started) % 8000) / 2000)));
      if (scene === '1' && queue) {
        const bounds = queue.getBoundingClientRect();
        const center = bounds.top + bounds.height / 2;
        updates.forEach(item => {
          const rect = item.getBoundingClientRect();
          const distance = Math.min(1, Math.abs(rect.top + rect.height / 2 - center) / (bounds.height / 2));
          item.style.setProperty('--source-scale', String(1 - .2 * distance));
          item.style.setProperty('--source-opacity', String(1 - .65 * distance));
          item.style.setProperty('--source-blur', `${Math.max(0, distance - .7) * 4}px`);
        });
      }
      if (scene === '3' && chart) {
        const mode = Math.floor((now - started) / 8000) % 2 ? 'bars' : 'area';
        if (chart.dataset.chartMode !== mode) {
          chart.dataset.chartMode = mode;
          chartTitle.textContent = mode === 'bars' ? 'Account activity by stage' : 'Account activity over time';
        }
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      const playing = visible && !document.hidden && !preference.matches;
      journey.classList.toggle('journey-animating', playing);
      if (playing) { scene = ''; frame = requestAnimationFrame(tick); }
      else if (preference.matches) renderBeat(3);
    };
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold:.05 }).observe(journey);
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);
    sync();
  }
}
