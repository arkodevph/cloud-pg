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
