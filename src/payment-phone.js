// Illustrative portal sequence from the supplied recording. No form submission.
{
  const demo = document.querySelector('[data-hubb-motion]');
  if (demo) {
    const section = demo.closest('.payment-highlight');
    const toggle = demo.querySelector('.hubb-motion__toggle');
    const pages = [...demo.querySelectorAll('[data-phone-page]')];
    const nav = [...demo.querySelectorAll('[data-phone-nav]')];
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const sequence = ['account', 'payment', 'review', 'options', 'arrangement', 'support'];
    let visible = false, paused = false, frame = 0, elapsed = 0, last = null, current = -1;
    const render = (time) => {
      const step = Math.floor(time / 6000) % sequence.length;
      const local = time % 6000;
      const name = sequence[step];
      if (step !== current) {
        current = step;
        demo.dataset.demoStep = String(step);
        pages.forEach(page => page.classList.toggle('is-active', page.dataset.phonePage === name));
        nav.forEach(item => item.classList.toggle('is-active', item.dataset.phoneNav === (step < 3 ? 'account' : step === 5 ? 'support' : 'options')));
      }
      const page = pages.find(item => item.dataset.phonePage === name);
      demo.classList.toggle('hubb-typing', name === 'payment' && local > 900 && local < 3600);
      demo.style.setProperty('--hubb-type', `${name === 'payment' ? Math.max(0, 100 - (local - 1000) / 18) : 0}%`);
      if (name === 'arrangement') {
        const plans = [...page.querySelectorAll('.hubb-plan')];
        const choice = local < 2700 ? 0 : 1;
        plans.forEach((plan, index) => plan.classList.toggle('hubb-plan--selected', index === choice));
        page.querySelector('.hubb-plan-summary strong').textContent = choice ? 'Fortnightly · $148.00' : 'Weekly · $74.00';
      }
      const target = page.querySelector('[data-tap-target]');
      if (target) {
        demo.style.setProperty('--tap-x', `${target.offsetLeft + target.offsetWidth / 2}px`);
        demo.style.setProperty('--tap-y', `${page.offsetTop + target.offsetTop + target.offsetHeight / 2}px`);
      }
      demo.classList.toggle('hubb-tapping', Boolean(target) && local >= 4400 && local < 5300);
    };
    const tick = (now) => {
      if (last !== null) elapsed += now - last;
      last = now;
      render(elapsed);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); last = null;
      const playing = visible && !paused && !document.hidden && !preference.matches;
      demo.classList.toggle('hubb-playing', playing);
      section.classList.toggle('hubb-section-playing', playing);
      if (preference.matches) { elapsed = 0; render(0); }
      if (playing) frame = requestAnimationFrame(tick);
    };
    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', `${paused ? 'Resume' : 'Pause'} Payment Hubb animation`);
      toggle.innerHTML = `${paused ? 'Resume' : 'Pause'} motion <span aria-hidden="true">${paused ? '▶' : 'Ⅱ'}</span>`;
      sync();
    });
    demo.classList.add('hubb-ready');
    render(0);
    if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold:.15 }).observe(demo);
    else { visible = true; sync(); }
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);
  }
}
