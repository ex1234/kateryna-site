// Decorative enhancements only — no booking, language or menu logic lives here.
// A soft highlight follows the pointer across the arched service cards.
(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const card of document.querySelectorAll('.service-card > a')) {
    let frame = 0;
    card.addEventListener('pointermove', event => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((event.clientX - box.left) / box.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((event.clientY - box.top) / box.height * 100).toFixed(1) + '%');
      });
    }, { passive: true });
  }
})();
