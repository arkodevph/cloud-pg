const audiencePanels = document.querySelector('[data-audience-panels]');
if (audiencePanels) {
  const section = audiencePanels.closest('.cloud-start');
  const panels = [...audiencePanels.querySelectorAll('.cloud-start__path')];
  const buttons = panels.map(panel => panel.querySelector('button'));
  const details = buttons.map(button => document.getElementById(button.getAttribute('aria-controls')));
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const select = index => {
    audiencePanels.dataset.active = String(index);
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === index);
      buttons[i].setAttribute('aria-expanded', String(i === index));
      details[i].hidden = i !== index;
    });
  };
  panels.forEach((panel, index) => {
    panel.addEventListener('pointerenter', event => { if (finePointer.matches && event.pointerType !== 'touch') select(index); });
    buttons[index].addEventListener('click', () => select(index));
    buttons[index].addEventListener('focus', () => select(index));
    buttons[index].addEventListener('keydown', event => {
      const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!delta) return;
      event.preventDefault();
      buttons[(index + delta + buttons.length) % buttons.length].focus();
    });
  });
  section.classList.add('is-enhanced');
  select(0);
}
