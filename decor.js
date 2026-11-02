// Decorative and navigation enhancements only — booking, language and menu logic stay in app.js.
// Without this file the page is complete: content visible, links work, the sticky bar is always shown.
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raf = fn => { let id = 0; return (...args) => { cancelAnimationFrame(id); id = requestAnimationFrame(() => fn(...args)); }; };

  // 1. The hero name rises letter by letter from behind a mask; the accessible name stays whole.
  const title = document.querySelector('#hero-title');
  if (title && !reduced) {
    const lines = [...title.querySelectorAll('.hero-line')];
    if (lines.length) {
      title.setAttribute('aria-label', lines.map(line => line.textContent.trim()).join(' '));
      let index = 0;
      for (const line of lines) {
        const letters = [...line.textContent];
        line.textContent = '';
        for (const letter of letters) {
          const outer = document.createElement('span');
          const inner = document.createElement('span');
          outer.className = 'char';
          outer.setAttribute('aria-hidden', 'true');
          inner.style.setProperty('--i', index++);
          inner.textContent = letter;
          outer.append(inner);
          line.append(outer);
        }
      }
    }
  }

  // 2. Line drawings draw themselves when they come into view.
  const drawings = [...document.querySelectorAll('.draw')];
  if (reduced || !('IntersectionObserver' in window)) drawings.forEach(el => el.classList.add('is-drawn'));
  else {
    const drawObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-drawn'); drawObserver.unobserve(entry.target); }
    }, { threshold: 0.25 });
    drawings.forEach(el => drawObserver.observe(el));
  }

  // 3. A slow drift of the portrait while the hero scrolls away (independent `translate` property).
  const stage = document.querySelector('[data-parallax]');
  const hero = document.querySelector('.hero-reference');
  if (stage && hero && !reduced) {
    const factor = parseFloat(stage.dataset.parallax) || 0;
    const update = raf(() => {
      const y = window.scrollY;
      if (y > hero.offsetTop + hero.offsetHeight) return;
      stage.style.translate = `0 ${(y * factor).toFixed(1)}px`;
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // 4. Phones: the floating "Naročite se" bar appears once the hero button has scrolled away,
  //    so the first screen never shows two identical buttons.
  const heroButton = document.querySelector('.hero-reference-copy [data-book]');
  if (heroButton && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      document.body.classList.toggle('show-sticky', past);
    }).observe(heroButton);
  } else document.body.classList.add('show-sticky');

  // 5. Service cards and "Celoten cenik" point at #storitve (unchanged); take the visitor to the
  //    matching part of the price list instead of leaving them where they already are.
  const priceList = document.querySelector('#cenik');
  const goTo = target => {
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    target.classList.remove('is-highlight'); void target.offsetWidth; target.classList.add('is-highlight');
    const heading = target.querySelector('h3') || target;
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  };
  if (priceList) {
    document.querySelectorAll('.service-card > a').forEach((card, i) => card.addEventListener('click', event => {
      const group = document.querySelector('#cenik-' + i);
      if (!group) return;
      event.preventDefault();
      goTo(group);
    }));
    document.querySelector('.full-prices-link a')?.addEventListener('click', event => { event.preventDefault(); goTo(priceList); });
  }

  // 6. FAQ: smooth open and close for the <details> accordion.
  if (!reduced) {
    for (const details of document.querySelectorAll('.faq-list details')) {
      const summary = details.querySelector('summary');
      let animation = null;
      summary.addEventListener('click', event => {
        event.preventDefault();
        animation?.cancel();
        const style = getComputedStyle(details);
        const start = details.offsetHeight;
        const closing = details.open;
        if (!closing) details.open = true;
        const end = closing ? summary.offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) : details.offsetHeight;
        animation = details.animate({ height: [start + 'px', end + 'px'] }, { duration: 480, easing: 'cubic-bezier(.22,.7,.2,1)' });
        animation.onfinish = () => { animation = null; if (closing) details.open = false; };
        animation.oncancel = () => { animation = null; };
      });
    }
  }
})();
