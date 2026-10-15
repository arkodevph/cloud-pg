import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const form = document.querySelector('[data-login-preview]');
const password = form.querySelector('[name="password"]');
const status = form.querySelector('[role="status"]');
const show = form.querySelector('[data-login-show]');
form.querySelector('[data-admin-demo]').addEventListener('click', () => { window.location.href = '/admin/'; });
form.addEventListener('submit', event => {
  event.preventDefault();
  password.value = '';
  status.textContent = 'Login preview complete. No account was accessed.';
});
form.querySelector('[type="submit"]').disabled = false;
show.addEventListener('click', () => {
  const visible = password.type === 'password';
  password.type = visible ? 'text' : 'password';
  show.textContent = visible ? 'Hide' : 'Show';
  show.setAttribute('aria-pressed', String(visible));
});
form.querySelector('[data-login-forgot]').addEventListener('click', () => {
  status.textContent = 'Password reset is a preview only. No reset email has been sent.';
});

const stage = document.querySelector('[data-login-logo]');
const toggle = document.querySelector('.login-motion-toggle');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas:stage.querySelector('canvas'), alpha:true, antialias:true });
} catch {
  // The rendered asset remains visible when WebGL is unavailable.
}
if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0, .1, 5.5);
  scene.add(new THREE.HemisphereLight(0xeafaff, 0x526976, 2.5));
  for (const [color, intensity, position] of [[0xffffff,5,[3,4,5]],[0xd4f2ff,3,[-4,1,2]],[0xffe4cf,3,[0,-2,-3]]]) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...position);
    scene.add(light);
  }
  let logo, paused = false, visible = false;
  let last = performance.now();
  const paint = () => renderer.render(scene, camera);
  const resize = () => {
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    camera.aspect = stage.clientWidth / stage.clientHeight;
    camera.updateProjectionMatrix();
    paint();
  };
  const tick = now => {
    const delta = Math.min((now - last) / 1000, .05);
    last = now;
    logo.rotation.y += delta * Math.PI / 10;
    paint();
  };
  const sync = () => {
    const playing = logo && visible && !paused && !document.hidden && !preference.matches;
    renderer.setAnimationLoop(playing ? tick : null);
    last = performance.now();
    toggle.hidden = !logo || preference.matches;
    if (logo) paint();
  };
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(stage);
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.innerHTML = `${paused ? 'Resume' : 'Pause'} rotation <span aria-hidden="true">${paused ? '▶' : 'Ⅱ'}</span>`;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
  new GLTFLoader().load('/assets/3d/cloudpg-ribbon-globe.glb', asset => {
    logo = new THREE.Group();
    logo.add(asset.scene);
    logo.rotation.y = -.35;
    scene.add(logo);
    stage.classList.add('is-ready');
    resize();
    sync();
  }, undefined, () => { renderer.dispose(); });
}
