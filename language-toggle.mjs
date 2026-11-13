import { renderLanguage } from './language.mjs?v=8';

const toggle = document.querySelector('.language-toggle');
const label = toggle.querySelector('span');
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [...document.querySelectorAll('main > :is(.intro-runway, .approach, .skills-section), .skills-section > .footer-runway')];
const railSelector = '.shots-rail, .cases-desktop-rail, .cases-mobile-rail';
const copySelector = [
  '.intro-copy p', '.portrait-caption > div', '.approach-inner p', '.story-slide h2',
  '.skills-list', '.experience-list', '.work-copy', '.shots-tabs',
  '.case-desktop-copy', '.cases-mobile > .case-date', '.case-mobile-copy', '.case-mobile-item .case-link',
  '[data-scroll-time-text]', '.works-close-label', '.study-copy', '.case-study-close',
  '.language-toggle > span', '.sound-toggle > span',
].join(', ');
let switching = false;

function alternateLanguage() {
  return root.lang === 'ru' ? 'en' : 'ru';
}

function syncToggle() {
  const target = alternateLanguage();
  const url = new URL(location.href);
  url.searchParams.set('lang', target);
  toggle.href = url.href;
  toggle.hreflang = target;
  label.lang = target;
  label.textContent = target === 'ru' ? 'Русский' : 'English';
}

function rememberSection() {
  const section = [...sections].reverse().find(item => item.getBoundingClientRect().top <= .5);
  if (!section) return () => {};
  const top = section.getBoundingClientRect().top;
  return () => {
    const bounds = section.getBoundingClientRect();
    const offset = Math.min(-top, bounds.height - 1);
    const change = bounds.top + offset;
    if (Math.abs(change) > .5) scrollTo({ top: scrollY + change, behavior: 'instant' });
  };
}

function rememberRails() {
  const positions = [];
  for (const rail of document.querySelectorAll(railSelector)) {
    if (!rail.clientWidth || rail.scrollLeft <= 0) continue;
    const left = rail.getBoundingClientRect().left;
    for (const card of rail.children) {
      const bounds = card.getBoundingClientRect();
      if (!bounds.width || bounds.right <= left + .5) continue;
      positions.push({ rail, card, offset: (left - bounds.left) / bounds.width });
      break;
    }
  }
  return () => {
    for (const { rail, card, offset } of positions) {
      const bounds = card.getBoundingClientRect();
      if (!bounds.width) continue;
      const delta = bounds.left + bounds.width * offset - rail.getBoundingClientRect().left;
      if (Math.abs(delta) > .5) rail.scrollLeft += delta;
    }
  };
}

function fadeCopy(out) {
  const scope = document.querySelector('dialog[open]') || document;
  const animations = [];
  for (const element of scope.querySelectorAll(copySelector)) {
    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height || bounds.bottom <= 0 || bounds.top >= innerHeight ||
        bounds.right <= 0 || bounds.left >= innerWidth) continue;
    const style = getComputedStyle(element);
    const opacity = Number(style.opacity);
    if (style.visibility !== 'visible' || !opacity) continue;
    const keyframes = out ? [{ opacity }, { opacity: 0 }] : [{ opacity: 0 }, { opacity }];
    animations.push(element.animate(keyframes, {
      duration: out ? 75 : 155, easing: out ? 'ease-in' : 'ease-out', fill: out ? 'forwards' : 'none',
    }));
  }
  return animations;
}

async function switchLanguage(language) {
  if (switching || language === root.lang) return;
  switching = true;
  const animate = !reduceMotion.matches && typeof toggle.animate === 'function';
  const outgoing = animate ? fadeCopy(true) : [];
  try {
    if (outgoing.length) await Promise.allSettled(outgoing.map(animation => animation.finished));
    const restoreSection = rememberSection();
    const restoreRails = rememberRails();
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(history.state, '', url);

    root.lang = window.portfolioLanguage = language;
    renderLanguage(language);
    syncToggle();
    restoreSection();
    document.dispatchEvent(new Event('portfolio-language-change'));
    restoreRails();
    // Case card widths settle after their rail's ResizeObserver has run.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (root.lang === language) restoreRails();
    }));

    outgoing.forEach(animation => animation.cancel());
    if (animate) await Promise.allSettled(fadeCopy(false).map(animation => animation.finished));
  } finally {
    outgoing.forEach(animation => animation.cancel());
    switching = false;
  }
}

toggle.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  switchLanguage(alternateLanguage());
});

function placeToggle() {
  const modal = root.classList.contains('case-study-open') ? document.querySelector('.case-study-dialog')
    : root.classList.contains('works-open') ? document.querySelector('.works-dialog') : null;
  (modal || document.body).append(toggle);
}

document.addEventListener('works-visibility', placeToggle);
document.addEventListener('case-study-visibility', placeToggle);
syncToggle();
toggle.hidden = false;
