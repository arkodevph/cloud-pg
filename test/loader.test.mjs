import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/build.mjs', import.meta.url), 'utf8');
const script = source.match(/const loaderScript = `<script>([\s\S]*?)<\/script>`;/)[1];

function loader({ seen = false, reload = false, reduced = false, blockedStorage = false } = {}) {
  let now = 0, id = 0;
  const timers = new Map(), classes = new Set();
  const document = new EventTarget(), window = new EventTarget();
  const status = { textContent:'' };
  const video = { play:() => Promise.resolve(), pause() {} };
  document.readyState = 'loading';
  document.documentElement = { classList: {
    add:(...names) => names.forEach(name => classes.add(name)),
    remove:(...names) => names.forEach(name => classes.delete(name)),
  } };
  document.querySelector = () => document.readyState === 'loading' ? null : video;
  document.getElementById = () => document.readyState === 'loading' ? null : status;
  window.matchMedia = () => ({ matches:reduced });
  runInNewContext(script, {
    document, window,
    performance:{ now:() => now, getEntriesByType:() => [{ type:reload ? 'reload' : 'navigate' }] },
    sessionStorage:{
      getItem() { if (blockedStorage) throw Error('Unavailable'); return seen ? '1' : null; },
      setItem() { if (blockedStorage) throw Error('Unavailable'); seen = true; },
    },
    setTimeout(fn, delay = 0) { timers.set(++id, { fn, at:now + delay }); return id; },
    clearTimeout:timer => timers.delete(timer),
  });
  return {
    visible:() => classes.has('is-loading'),
    ready() { document.readyState = 'interactive'; document.dispatchEvent(new Event('DOMContentLoaded')); },
    restore() { const event = new Event('pageshow'); event.persisted = true; window.dispatchEvent(event); },
    tick(ms) {
      const end = now + ms;
      while (true) {
        const next = [...timers].sort((a,b) => a[1].at - b[1].at)[0];
        if (!next || next[1].at > end) break;
        now = next[1].at; timers.delete(next[0]); next[1].fn();
      }
      now = end;
    },
  };
}

test('refresh replays the loader and then releases the page', () => {
  const page = loader({ seen:true, reload:true });
  page.tick(200);
  assert.equal(page.visible(), true);
  page.ready(); page.tick(1800);
  assert.equal(page.visible(), false);
});
test('internal navigation skips a completed session intro', () => {
  const page = loader({ seen:true });
  assert.equal(page.visible(), false);
});
test('page becomes usable when markup is ready even with video still loading', () => {
  const page = loader();
  assert.equal(page.visible(), true);
  page.ready(); page.tick(1800);
  assert.equal(page.visible(), false);
});
test('stalled resources cannot keep the overlay active indefinitely', () => {
  const page = loader();
  page.tick(3000);
  assert.equal(page.visible(), false);
});
test('back-forward restoration clears an in-progress intro immediately', () => {
  const page = loader();
  page.ready(); page.restore();
  assert.equal(page.visible(), false);
});
test('reduced motion bypasses the loader', () => {
  const page = loader({ reduced:true });
  page.ready(); page.tick(3000);
  assert.equal(page.visible(), false);
});
test('unavailable session storage still permits the page to open', () => {
  const page = loader({ blockedStorage:true });
  page.ready(); page.tick(1800);
  assert.equal(page.visible(), false);
});
