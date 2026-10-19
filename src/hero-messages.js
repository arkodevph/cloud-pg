// Adapted from Remocn message-bubble, imessage-chat-flow and typing-indicator.
// MIT, Copyright (c) 2026 Remocn. License: /assets/remocn-LICENSE.txt.
function createHeroMessageMotion(hero) {
  const outgoing = hero.querySelector('.hero-film__card--one');
  const incoming = hero.querySelector('.hero-film__card--two');
  const content = incoming.querySelector('.hero-message__content');
  const typing = incoming.querySelector('.hero-message__typing');
  const duration = 12000;
  const wordGroups = [outgoing, incoming].map(bubble => {
    const paragraph = bubble.querySelector('p');
    const words = paragraph.textContent.trim().split(/\s+/).map(text => {
      const span = document.createElement('span');
      span.className = 'hero-message__word';
      span.textContent = text;
      return span;
    });
    paragraph.replaceChildren(...words.flatMap((word, index) => index ? [document.createTextNode(' '), word] : [word]));
    const light = document.createElement('div');
    light.className = 'hero-message__light';
    light.setAttribute('aria-hidden', 'true');
    bubble.append(light);
    return { words, light };
  });
  let animations = [];
  let paused = false;
  let reduced = false;
  let elapsed = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  // Remocn's iMessage entrance: damping 16, stiffness 200, mass 0.7.
  const spring = seconds => {
    const decay = 16 / (2 * .7);
    const frequency = Math.sqrt(200 / .7 - decay * decay);
    return 1 - Math.exp(-decay * seconds) * (Math.cos(frequency * seconds) + decay / frequency * Math.sin(frequency * seconds));
  };
  const exit = (time, start) => { const progress = clamp((time - start) / .8); return progress * progress * (3 - 2 * progress); };
  const enter = (time, start) => time < start ? 0 : time - start >= .8 ? 1 : spring(time - start);
  const add = (element, frames, options = {}) => {
    const animation = element.animate(frames, { duration, iterations:Infinity, ...options });
    animations.push(animation);
    return animation;
  };
  const build = () => {
    elapsed = animations[0]?.currentTime ?? elapsed;
    animations.forEach(animation => animation.cancel());
    animations = [];
    if (reduced) return;
    const width = parseFloat(getComputedStyle(incoming).width);
    const height = content.offsetHeight + 30;
    const frames = [[], [], [], []];
    // One deterministic timeline, sampled like Remocn's frame-driven scenes.
    for (let frame = 0; frame <= 600; frame++) {
      const time = frame / 50;
      const offset = frame / 600;
      const sent = enter(time, .65);
      const reply = enter(time, 2.6);
      const expand = clamp(enter(time, 4.1));
      const drift = Math.sin(Math.max(0, time - 1.4) * 1.1) * 1.3;
      const replyLift = 4 * clamp((time - 4.1) / .8);
      const outgoingExit = exit(time, 9.4);
      const incomingExit = exit(time, 9.65);
      frames[0].push({ offset, opacity:clamp(sent) * (1 - outgoingExit), transform:`perspective(700px) translate3d(0,${18 * (1 - sent) - 16 * outgoingExit - replyLift + drift}px,0) rotateY(${-9 * (1 - sent)}deg) scale(${.9 + .1 * sent})`, filter:`blur(${4 * (1 - clamp(sent)) + 3 * outgoingExit}px)`, boxShadow:`0 ${10 + 12 * (1 - clamp(sent))}px ${26 + 12 * (1 - clamp(sent))}px #102b3824` });
      frames[1].push({ offset, opacity:clamp(reply) * (1 - incomingExit), transform:`perspective(700px) translate3d(0,${16 * (1 - reply) - 16 * incomingExit - drift}px,0) rotateY(${9 * (1 - reply)}deg) scale(${.9 + .1 * reply})`, filter:`blur(${4 * (1 - clamp(reply)) + 3 * incomingExit}px)`, borderRadius:`${26 - 4 * expand}px ${26 - 4 * expand}px ${26 - 4 * expand}px 6px`, width:`${74 + (width - 74) * expand}px`, height:`${46 + (height - 46) * expand}px` });
      frames[2].push({ offset, opacity:clamp((time - 4.25) / .4), transform:`translateY(${4 * (1 - expand)}px)` });
      frames[3].push({ offset, opacity:1 - clamp((time - 4.1) / .22) });
    }
    add(outgoing, frames[0]);
    add(incoming, frames[1]);
    add(content, frames[2]);
    add(typing, frames[3]);
    wordGroups.forEach(({ words, light }, group) => {
      const start = group ? 4.35 : .85;
      words.forEach((word, index) => {
        const at = (start + index * .045) * 1000 / duration;
        add(word, [
          { offset:0, opacity:0, transform:'translateY(5px)', filter:'blur(3px)' },
          { offset:at, opacity:0, transform:'translateY(5px)', filter:'blur(3px)', easing:'cubic-bezier(.22,1,.36,1)' },
          { offset:at + .4 * 1000 / duration, opacity:1, transform:'translateY(0)', filter:'blur(0)' },
          { offset:1, opacity:1, transform:'translateY(0)', filter:'blur(0)' },
        ]);
      });
      const at = (group ? 4.2 : .9) * 1000 / duration;
      add(light, [
        { offset:0, opacity:0, transform:'translateX(-120%) skewX(-18deg)' },
        { offset:at, opacity:0, transform:'translateX(-120%) skewX(-18deg)' },
        { offset:at + .02, opacity:.5, transform:'translateX(0) skewX(-18deg)' },
        { offset:at + .11, opacity:0, transform:'translateX(700%) skewX(-18deg)' },
        { offset:1, opacity:0, transform:'translateX(700%) skewX(-18deg)' },
      ]);
    });
    typing.querySelectorAll('i').forEach((dot, index) => {
      const dots = Array.from({ length:31 }, (_, frame) => {
        const phase = (frame / 30 - index / 6) * Math.PI * 2;
        const wave = (Math.sin(phase) + 1) / 2;
        return { opacity:.45 + .55 * wave, transform:`translateY(${-3 * wave}px)` };
      });
      add(dot, dots, { duration:1000 / 1.1 });
    });
    animations.forEach(animation => {
      animation.currentTime = elapsed;
      if (paused) animation.pause();
    });
  };
  hero.classList.add('hero-film--messages');
  build();
  window.addEventListener('resize', build);
  return {
    setPaused(value) {
      paused = value;
      animations.forEach(animation => value ? animation.pause() : animation.play());
    },
    setReduced(value) {
      if (reduced === value) return;
      reduced = value;
      elapsed = 0;
      build();
    },
  };
}
