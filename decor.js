// Decorative enhancements only — booking, language and menu logic stay in app.js.
// Everything here is progressive: without this file the page is complete and usable.
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const raf = fn => { let id = 0; return (...args) => { cancelAnimationFrame(id); id = requestAnimationFrame(() => fn(...args)); }; };

  // 1. Hero name: letters rise from behind a mask (first line), the accessible name stays intact.
  const title = document.querySelector('#hero-title');
  if (title && !reduced) {
    const lines = [...title.querySelectorAll('.hero-line')];
    if (lines.length) {
      title.setAttribute('aria-label', lines.map(line => line.textContent.trim()).join(' '));
      const first = lines[0];
      const letters = [...first.textContent];
      first.textContent = '';
      letters.forEach((letter, i) => {
        const outer = document.createElement('span');
        const inner = document.createElement('span');
        outer.className = 'char';
        outer.setAttribute('aria-hidden', 'true');
        inner.style.setProperty('--i', i);
        inner.textContent = letter;
        outer.append(inner);
        first.append(outer);
      });
    }
  }

  // 2. Line drawings draw themselves when they scroll into view.
  const drawings = [...document.querySelectorAll('.draw')];
  if (reduced || !('IntersectionObserver' in window)) drawings.forEach(el => el.classList.add('is-drawn'));
  else {
    const drawObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-drawn'); drawObserver.unobserve(entry.target); }
    }, { threshold: 0.25 });
    drawings.forEach(el => drawObserver.observe(el));
  }

  // 3. Slow parallax inside the hero (uses the independent `translate` property,
  //    so it never fights the CSS float/entrance animations on `transform`).
  const layers = [...document.querySelectorAll('[data-parallax]')];
  const hero = document.querySelector('.hero-reference');
  if (layers.length && hero && !reduced) {
    const update = raf(() => {
      const y = window.scrollY;
      if (y > hero.offsetTop + hero.offsetHeight) return;
      for (const layer of layers) layer.style.translate = `0 ${(y * parseFloat(layer.dataset.parallax)).toFixed(1)}px`;
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  if (finePointer && !reduced) {
    // 4. Magnetic buttons: they lean towards the pointer.
    for (const button of document.querySelectorAll('.button')) {
      const move = raf(event => {
        const box = button.getBoundingClientRect();
        const x = (event.clientX - box.left - box.width / 2) * 0.22;
        const y = (event.clientY - box.top - box.height / 2) * 0.35;
        button.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      button.addEventListener('pointermove', move);
      button.addEventListener('pointerleave', () => { button.style.translate = ''; });
    }

    // 5. Service cards: 3D tilt plus a highlight that follows the pointer.
    for (const card of document.querySelectorAll('.service-card > a')) {
      const move = raf(event => {
        const box = card.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width;
        const py = (event.clientY - box.top) / box.height;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    }

    // 6. Cursor ring that trails the pointer (the system cursor stays visible).
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(ring);
    let tx = -100, ty = -100, cx = -100, cy = -100, running = false;
    const step = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      ring.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3) requestAnimationFrame(step); else running = false;
    };
    const interactive = 'a, button, summary, select, input, label, [role="button"]';
    document.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      tx = event.clientX; ty = event.clientY;
      ring.classList.add('is-visible');
      ring.classList.toggle('is-hover', Boolean(event.target.closest?.(interactive)));
      if (!running) { running = true; requestAnimationFrame(step); }
    }, { passive: true });
    document.addEventListener('pointerdown', () => ring.classList.add('is-down'));
    document.addEventListener('pointerup', () => ring.classList.remove('is-down'));
    document.documentElement.addEventListener('pointerleave', () => ring.classList.remove('is-visible'));
    new MutationObserver(() => ring.classList.toggle('is-visible', !document.body.classList.contains('modal-open') && ring.classList.contains('is-visible')))
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // 7. FAQ: smooth open/close for the <details> accordion.
  if (!reduced) {
    for (const details of document.querySelectorAll('.faq-list details')) {
      const summary = details.querySelector('summary');
      let animation = null;
      summary.addEventListener('click', event => {
        event.preventDefault();
        animation?.cancel();
        const start = details.offsetHeight;
        const closing = details.open;
        if (!closing) details.open = true;
        const end = closing ? summary.offsetHeight + parseFloat(getComputedStyle(details).paddingTop) + parseFloat(getComputedStyle(details).paddingBottom) : details.offsetHeight;
        animation = details.animate({ height: [start + 'px', end + 'px'] }, { duration: 520, easing: 'cubic-bezier(.22,.7,.2,1)' });
        animation.onfinish = () => { animation = null; if (closing) details.open = false; };
        animation.oncancel = () => { animation = null; };
      });
    }
  }
})();
