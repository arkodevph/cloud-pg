// 20.27.43: scroll controls the globe, numbered positions, and copy in both directions.
const processGlobe = document.querySelector('.process-globe');
if (processGlobe) {
  const nodes = [...processGlobe.querySelectorAll('[data-process-step]')];
  const copies = [...processGlobe.querySelectorAll('[data-process-copy]')];
  const orbit = processGlobe.querySelector('.process-globe__orbit');
  const pin = processGlobe.querySelector('.container');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false, active = -1, rotation = 0, frame = 0;
  const placeNodes = degrees => {
    const radius = orbit.clientWidth / 2;
    nodes.forEach((node, index) => {
      const angle = (index * 120 + degrees) * Math.PI / 180;
      node.style.transform = `translate(${Math.sin(angle) * radius * .83}px,${-radius + radius * .35 * (1 - Math.cos(angle))}px)`;
    });
  };
  const select = index => {
    if (index === active) return;
    cancelAnimationFrame(frame);
    const previous = rotation;
    const initial = active < 0;
    active = index;
    nodes.forEach((node, i) => {
      node.classList.toggle('is-active', i === active);
      node.setAttribute('aria-pressed', String(i === active));
    });
    copies.forEach((copy, i) => {
      copy.getAnimations().forEach(animation => animation.cancel());
      copy.hidden = i !== active;
      copy.classList.toggle('is-active', i === active);
      if (i === active && !initial && !preference.matches) copy.animate([
        { opacity:0, filter:'blur(6px)' },
        { opacity:0, filter:'blur(6px)', offset:.25 },
        { opacity:1, filter:'blur(0)' },
      ], { duration:330, easing:'ease-out' });
    });
    processGlobe.dataset.activeStep = String(active);
    processGlobe.dataset.position = String(active);
    const target = -index * 120;
    const draw = degrees => {
      rotation = degrees;
      placeNodes(degrees);
      processGlobe.dispatchEvent(new CustomEvent('process-globe:change', { detail:{ position:-degrees / 120 } }));
    };
    if (initial || preference.matches) { draw(target); return; }
    const start = performance.now();
    const tick = time => {
      const progress = Math.min(1, (time - start) / 360);
      const eased = progress * progress * (3 - 2 * progress);
      draw(previous + (target - previous) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };
  const scrollPosition = () => {
    const top = parseFloat(getComputedStyle(pin).top) || 0;
    const travel = Math.max(1, processGlobe.offsetHeight - pin.offsetHeight - top);
    return { top, travel, progress:Math.max(0, Math.min(1, (top - processGlobe.getBoundingClientRect().top) / travel)) };
  };
  const update = () => {
    scheduled = false;
    if (preference.matches) return;
    const { progress } = scrollPosition();
    select(Math.min(nodes.length - 1, Math.floor(progress * nodes.length)));
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  nodes.forEach((node, index) => node.addEventListener('click', () => {
    if (preference.matches) { select(index); return; }
    const { top, travel } = scrollPosition();
    scrollTo({ top:scrollY + processGlobe.getBoundingClientRect().top - top + travel * (index + .5) / nodes.length, behavior:'smooth' });
  }));
  preference.addEventListener('change', () => { active = -1; select(0); schedule(); });
  window.addEventListener('scroll', schedule, { passive:true });
  window.addEventListener('resize', () => { placeNodes(rotation); schedule(); });
  window.addEventListener('load', schedule, { once:true });
  select(0);
  schedule();
}

