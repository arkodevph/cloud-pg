// Aceternity's depth offsets and spring, applied to the original film composition.
const parallaxHero = document.querySelector('[data-hero-parallax]');
if (parallaxHero) {
  const layers = [...parallaxHero.querySelectorAll('[data-hero-depth]')];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  let visible = true, frame = 0, previous = 0;
  let x = 0, y = 0, velocityX = 0, velocityY = 0, targetX = 0, targetY = 0;
  const enabled = () => !preference.matches && pointer.matches && visible && !document.hidden;
  const paint = () => layers.forEach(layer => {
    const depth = Number(layer.dataset.heroDepth);
    layer.style.translate = `${x * 40 * depth}px ${y * 40 * depth}px`;
  });
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = previous = x = y = velocityX = velocityY = targetX = targetY = 0;
    paint();
  };
  const tick = time => {
    frame = 0;
    if (!enabled()) { reset(); return; }
    const dt = Math.min((time - previous) / 1000 || 1 / 60, 1 / 30);
    previous = time;
    velocityX += ((targetX - x) * 120 - velocityX * 25) * dt;
    velocityY += ((targetY - y) * 120 - velocityY * 25) * dt;
    x += velocityX * dt;
    y += velocityY * dt;
    if (Math.max(Math.abs(targetX - x), Math.abs(targetY - y), Math.abs(velocityX), Math.abs(velocityY)) < .001) {
      x = targetX;
      y = targetY;
      velocityX = velocityY = previous = 0;
      paint();
      return;
    }
    paint();
    frame = requestAnimationFrame(tick);
  };
  const schedule = () => { if (!frame && enabled()) frame = requestAnimationFrame(tick); };
  parallaxHero.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType === 'touch') return;
    const bounds = parallaxHero.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    schedule();
  });
  parallaxHero.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); });
  preference.addEventListener('change', reset);
  pointer.addEventListener('change', reset);
  document.addEventListener('visibilitychange', reset);
  window.addEventListener('resize', reset);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) reset();
  }).observe(parallaxHero);
}
