import createGlobe from 'cobe';

const preference = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-contact-globe]').forEach(canvas => {
  const stage = canvas.closest('.contact-globe');
  const sphere = stage.querySelector('.contact-globe__sphere');
  let globe;
  let frame = 0;
  let previous = 0;
  let visible = false;
  let phi = 4.1;

  const render = time => {
    frame = 0;
    if (!globe || !visible || document.hidden || preference.matches) return;
    phi += Math.min((time - (previous || time)) / 1000, .05) * .14;
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
      phi, theta:.22, dark:0, diffuse:1.3, scale:.98,
      mapSamples:20000, mapBrightness:5, mapBaseBrightness:0,
      baseColor:[.2, .553, .667], glowColor:[.75, .86, .9],
      markerColor:[.875, .624, .384], markers:[], arcs:[],
    });
    stage.classList.add('is-ready');
    // Refresh once after COBE's embedded map texture has decoded, including reduced motion.
    setTimeout(() => globe.update({}), 250);
    new ResizeObserver(resize).observe(sphere);
  };
  canvas.addEventListener('webglcontextlost', () => {
    cancelAnimationFrame(frame);
    stage.classList.remove('is-ready', 'is-active');
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) initialise();
    sync();
  }, { rootMargin:'120px' }).observe(stage);
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
});
