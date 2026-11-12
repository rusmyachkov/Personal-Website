// Keep the fixed controls easy to reach while the page or an open gallery scrolls.
const root = document.documentElement;
const mobile = matchMedia('(max-width: 700px)');
let compact = false;

function enhance(control) {
  if (!control || control.dataset.compactEnhanced) return;
  control.dataset.compactEnhanced = 'true';

  function wrapIcon() {
    const icon = control.querySelector(':scope > svg');
    if (icon) {
      const slot = document.createElement('i');
      slot.className = 'toggle-icon-slot';
      slot.setAttribute('aria-hidden', 'true');
      icon.replaceWith(slot);
      slot.append(icon);
    }
    if (!control.querySelector(':scope > .toggle-surface')) {
      const surface = document.createElement('i');
      surface.className = 'toggle-surface';
      surface.setAttribute('aria-hidden', 'true');
      control.prepend(surface);
    }
  }

  wrapIcon();
  // The sound control replaces its icon and label when its state changes.
  new MutationObserver(wrapIcon).observe(control, { childList: true });
}

function findControls() {
  enhance(document.querySelector('.language-toggle'));
  const sound = document.querySelector('.sound-toggle');
  enhance(sound);
  return Boolean(sound);
}

if (!findControls()) {
  const observer = new MutationObserver(() => {
    if (findControls()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
root.classList.add('controls-enhanced');

function updateLanguageLabel() {
  const toggle = document.querySelector('.language-toggle');
  if (!toggle) return;
  toggle.setAttribute('aria-label', root.lang === 'ru'
    ? 'Переключить язык на английский' : 'Switch language to Russian');
}
document.addEventListener('portfolio-language-change', updateLanguageLabel);
updateLanguageLabel();

function syncCompactState() {
  const modalScroll = document.querySelector('dialog[open] :is(.works-scroll, .case-study-scroll)');
  const distance = Math.max(window.scrollY, modalScroll?.scrollTop || 0);
  const next = mobile.matches && (compact ? distance > 16 : distance > 48);
  if (next !== compact) {
    compact = next;
    root.classList.toggle('controls-compact', compact);
  }
}

addEventListener('scroll', syncCompactState, { passive: true, capture: true });
mobile.addEventListener('change', syncCompactState);
document.addEventListener('works-visibility', syncCompactState);
document.addEventListener('case-study-visibility', syncCompactState);
syncCompactState();
requestAnimationFrame(() => root.classList.add('controls-motion-ready'));
