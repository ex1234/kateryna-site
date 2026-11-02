import { composeBooking, contactLinks } from './booking-utils.mjs?v=9';
const locale = JSON.parse(document.querySelector('#locale-data').textContent);
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const languageMenu = document.querySelector('.language-menu');
function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', locale.menuOpen); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; mobileNav.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? locale.menuClose : locale.menuOpen); languageMenu.open = false; });
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); languageMenu.open = false; } });
document.addEventListener('click', event => { if (!languageMenu.contains(event.target)) languageMenu.open = false; });
const bookingDialog = document.querySelector('#booking-dialog');
const serviceSelect = document.querySelector('#booking-service');
const dateInput = document.querySelector('#booking-date');
const errorText = document.querySelector('#booking-error');
const now = new Date();
const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
dateInput.min = today;
function updateLinks(showError = false) {
  const option = serviceSelect.selectedOptions[0];
  const context = option.parentElement.tagName === 'OPTGROUP' ? option.parentElement.label + ' — ' : '';
  const service = serviceSelect.value ? context + option.textContent : '';
  const result = composeBooking(locale, { service, date: dateInput.value, today });
  const invalid = result.error || dateInput.validity.badInput || !dateInput.validity.valid;
  dateInput.setAttribute('aria-invalid', String(Boolean(invalid)));
  errorText.textContent = invalid ? locale.dateError : '';
  errorText.hidden = !invalid || !showError;
  const links = contactLinks(result.message, /iPhone|iPad|iPod/.test(navigator.userAgent));
  for (const channel of ['telegram', 'whatsapp', 'sms']) {
    const link = document.querySelector('#booking-' + channel);
    link.href = invalid ? '#booking-date' : links[channel];
    link.setAttribute('aria-disabled', String(Boolean(invalid)));
  }
  return !invalid;
}
function openDialog(dialog) { closeMenu(); languageMenu.open = false; dialog.showModal(); document.body.classList.add('modal-open'); }
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => { serviceSelect.value = button.dataset.service || ''; updateLinks(); openDialog(bookingDialog); }));
serviceSelect.addEventListener('change', () => updateLinks());
dateInput.addEventListener('input', () => updateLinks());
dateInput.addEventListener('blur', () => updateLinks(true));
for (const channel of ['telegram', 'whatsapp', 'sms']) document.querySelector('#booking-' + channel).addEventListener('click', event => { if (!updateLinks(true)) { event.preventDefault(); dateInput.focus(); } });
document.querySelector('[data-privacy]').addEventListener('click', () => openDialog(document.querySelector('#privacy-dialog')));
document.querySelectorAll('dialog').forEach(dialog => { dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close()); dialog.addEventListener('close', () => document.body.classList.remove('modal-open')); dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); }); });
const search = document.querySelector('#service-search');
const clear = document.querySelector('#clear-search');
const categories = [...document.querySelectorAll('.service-category')];
const normalize = value => value.toLocaleLowerCase(locale.lang).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
function filter() {
  const query = normalize(search.value); let results = 0;
  for (const category of categories) {
    let categoryResults = 0; const categoryName = category.querySelector('.category-title strong').textContent;
    for (const group of category.querySelectorAll('.treatment-group')) {
      let count = 0; const name = group.getAttribute('aria-label');
      for (const row of group.querySelectorAll('li')) { const match = !query || normalize(categoryName + ' ' + name + ' ' + row.textContent).includes(query); row.hidden = !match; if (match) count++; }
      group.hidden = count === 0; categoryResults += count;
    }
    category.hidden = categoryResults === 0; category.open = query ? categoryResults > 0 : locale.pricePage || category.id === 'category-0'; results += categoryResults;
  }
  clear.hidden = !query; document.querySelector('#no-results').hidden = results > 0;
}
search?.addEventListener('input', filter);
clear?.addEventListener('click', () => { search.value = ''; filter(); search.focus(); });
document.querySelectorAll('[data-open-category]').forEach(link => link.addEventListener('click', () => { if (search?.value) { search.value = ''; filter(); } const section = document.getElementById(link.dataset.openCategory); section.open = true; }));
updateLinks();

// Match the reference's compact navigation while keeping one language menu.
const referenceHeader = document.querySelector('.site-header');
const referenceHeaderInner = document.querySelector('.header-inner');
const languageSlot = document.querySelector('.language-slot');
function updateReferenceHeader() {
  const compact = window.scrollY > 228 && window.innerWidth > 1100;
  referenceHeader.classList.toggle('is-compact', compact);
  if (compact && languageMenu.parentElement !== referenceHeaderInner) referenceHeaderInner.append(languageMenu);
  else if (!compact && languageMenu.previousElementSibling !== languageSlot) languageSlot.after(languageMenu);
}
window.addEventListener('scroll', updateReferenceHeader, { passive: true });
window.addEventListener('resize', updateReferenceHeader);
updateReferenceHeader();

// Motion is progressive enhancement; all content is visible without JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero-video');
const motionButton = document.querySelector('.motion-toggle');
const backgroundVideo = document.querySelector('.hero-background-video');
let motionPaused = false;
let explicitlyStarted = false;
let autoplayBlocked = false;
let playPending = false;
function shouldPauseMotion() { return motionPaused || (motionPreference.matches && !explicitlyStarted) || document.hidden; }
function renderMotionControl() {
  if (!hero || !motionButton) return;
  const paused = shouldPauseMotion() || autoplayBlocked;
  hero.classList.toggle('is-paused', paused);
  motionButton.hidden = false;
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? locale.playMotion : locale.pauseMotion);
  motionButton.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
}
function syncMotion() {
  if (!hero || !motionButton) return;
  if (backgroundVideo) {
    backgroundVideo.muted = true;
    backgroundVideo.defaultMuted = true;
    backgroundVideo.playsInline = true;
    if (shouldPauseMotion()) backgroundVideo.pause();
    else if (backgroundVideo.paused && !playPending) {
      playPending = true;
      backgroundVideo.play().then(() => { playPending = false; autoplayBlocked = false; if (shouldPauseMotion()) backgroundVideo.pause(); renderMotionControl(); })
        .catch(() => { playPending = false; autoplayBlocked = true; renderMotionControl(); });
    }
  }
  renderMotionControl();
}
motionButton?.addEventListener('click', () => {
  const wantsPlay = shouldPauseMotion() || autoplayBlocked || backgroundVideo?.paused;
  motionPaused = !wantsPlay;
  if (wantsPlay) { explicitlyStarted = true; autoplayBlocked = false; }
  syncMotion();
});
backgroundVideo?.addEventListener('loadeddata', syncMotion);
backgroundVideo?.addEventListener('canplay', syncMotion);
window.addEventListener('pageshow', syncMotion);
document.addEventListener('pointerdown', () => {
  if (autoplayBlocked && !motionPaused && !motionPreference.matches) syncMotion();
}, { once: true, passive: true });
const revealElements = [...document.querySelectorAll('[data-reveal]')];
let revealObserver;
function finishReveals() {
  revealObserver?.disconnect();
  revealElements.forEach(element => { element.classList.remove('reveal-pending'); element.classList.add('reveal-visible'); });
}
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('reveal-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
  revealElements.forEach(element => { element.classList.add('reveal-pending'); revealObserver.observe(element); });
}
motionPreference.addEventListener('change', () => { explicitlyStarted = false; syncMotion(); if (motionPreference.matches) finishReveals(); });
document.addEventListener('visibilitychange', syncMotion);
window.addEventListener('beforeprint', finishReveals);
syncMotion();
