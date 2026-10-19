import createGlobe from 'cobe';

const preference = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-contact-globe], [data-process-globe]').forEach(canvas => {
  const process = canvas.hasAttribute('data-process-globe');
  const stage = canvas.closest(process ? '.process-globe' : '.contact-globe');
  const sphere = canvas.parentElement;
  let globe;
  let frame = 0;
  let previous = 0;
  let visible = false;
  let idlePhi = 0;
  let scrollPhi = process ? Number(stage.dataset.position || 0) * .7 : 0;
  let phi = 4.1 + scrollPhi;

  const render = time => {
    frame = 0;
    if (!globe || !visible || document.hidden || preference.matches) return;
    idlePhi += Math.min((time - (previous || time)) / 1000, .05) * .14;
    phi = 4.1 + scrollPhi + idlePhi;
    previous = time;
    globe.update({ phi });
    frame = requestAnimationFrame(render);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    const active = visible && !document.hidden && !preference.matches;
    stage.classList.toggle('is-active', active);
    if (active && globe) frame = requestAnimationFrame(render);
  };
  const resize = () => {
    const size = Math.round(sphere.getBoundingClientRect().width);
    if (globe && size) globe.update({ width:size, height:size });
  };
  const initialise = () => {
    if (globe) return;
    const context = canvas.getContext('webgl2', { alpha:true, antialias:true }) || canvas.getContext('webgl', { alpha:true, antialias:true });
    if (!context) return;
    const size = Math.round(sphere.getBoundingClientRect().width);
    globe = createGlobe(canvas, {
      width:size, height:size, devicePixelRatio:Math.min(devicePixelRatio, 1.5),
      phi, theta:.22, dark:0, diffuse:1.3, scale:process ? 1.24 : .98,
      mapSamples:20000, mapBrightness:5, mapBaseBrightness:0,
      baseColor:[.2, .553, .667], glowColor:[.75, .86, .9],
      markerColor:[.875, .624, .384], markers:[], arcs:[],
    });
    stage.classList.add('is-ready');
    // Refresh once after COBE's embedded map texture has decoded, including reduced motion.
    setTimeout(() => globe.update({}), 250);
    new ResizeObserver(resize).observe(sphere);
  };
  if (process) stage.addEventListener('process-globe:change', event => {
    scrollPhi = event.detail.position * .7;
    phi = 4.1 + scrollPhi + idlePhi;
    if (globe) globe.update({ phi });
  });
  canvas.addEventListener('webglcontextlost', () => {
    cancelAnimationFrame(frame);
    stage.classList.remove('is-ready', 'is-active');
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) initialise();
    sync();
  }, { rootMargin:'120px' }).observe(process ? stage.querySelector('.process-globe__stage') : stage);
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
});
