import { worksRows } from '../../works-data.mjs?v=6';
import { fadeGallery, flyCard, isCardVisible } from '../../gallery-motion.mjs?v=3';

const hint = document.querySelector('.scroll-hint');
const dialog = document.querySelector('.works-dialog');
const scroller = dialog.querySelector('.works-scroll');
const grid = dialog.querySelector('.works-grid');
const close = dialog.querySelector('.works-close');
const surface = close.querySelector('.works-close-surface');
const icon = close.querySelector('.works-close-icon');
const label = close.querySelector('.works-close-label');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const works = new Map(worksRows.flatMap(row => row.cards.map(work => [work.id, work])));
const homeCards = new Map();
let session;

function makeCard(work) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'works-card';
  button.dataset.work = work.id;
  if (work.layout) button.classList.add('works-card-' + work.layout);
  button.setAttribute('aria-label', work.title + ' — back to home');

  const media = document.createElement(work.video ? 'video' : 'img');
  media.setAttribute('aria-hidden', 'true');
  if (work.video) {
    media.muted = true;
    media.defaultMuted = true;
    media.playsInline = true;
    media.loop = true;
    media.preload = 'none';
    media.disablePictureInPicture = true;
    media.disableRemotePlayback = true;
  } else {
    media.alt = '';
    media.setAttribute('nopin', 'nopin');
    media.draggable = false;
    media.decoding = 'async';
  }
  button.append(media);
  return button;
}

function renderGrid() {
  const cards = new Map();
  for (const row of worksRows) {
    const element = document.createElement('div');
    element.className = 'works-row';
    element.style.setProperty('--works-columns', row.columns ?? `repeat(${row.cards.length}, minmax(0, 1fr))`);
    if (row.ratio) {
      element.classList.add('works-row-sized');
      element.style.setProperty('--works-ratio', row.ratio);
    }
    if (row.stack) element.classList.add('works-row-stacked');
    for (const work of row.cards) {
      const card = makeCard(work);
      cards.set(work.id, card);
      element.append(card);
    }
    grid.append(element);
  }
  return cards;
}

function startMedia(card, priority = 'auto') {
  const work = works.get(card.dataset.work);
  const media = card.firstElementChild;
  if (media.hasAttribute('src')) return;

  if (work.video) {
    media.poster = 'assets/optimized/' + work.poster + '.webp';
    const useLargeVideo = work.large && matchMedia('(min-width: 1100px)').matches;
    media.src = 'assets/' + (useLargeVideo ? work.id + '-gallery' : work.id) + '.mp4';
    media.preload = 'auto';
  } else {
    media.fetchPriority = priority;
    if (work.responsive) {
      media.sizes = '(max-width: 700px) calc(100vw - 20px), calc(50vw - 15px)';
      media.srcset = 'assets/optimized/268e2-768.webp 768w, assets/optimized/268e2-1536.webp 1536w, assets/optimized/268e2-3072.webp 3072w, assets/optimized/268e2.webp 4096w';
    }
    media.src = 'assets/optimized/' + work.id + '.webp';
  }
}

function waitForSelected(media) {
  return new Promise(resolve => {
    const events = new AbortController();
    const finish = () => {
      clearTimeout(timeout);
      events.abort();
      resolve();
    };
    const timeout = setTimeout(finish, 2500);
    if (media instanceof HTMLImageElement) {
      media.decode().then(finish, finish);
    } else if (media.readyState >= 2) {
      finish();
    } else {
      media.addEventListener('loadeddata', finish, { signal: events.signal });
      media.addEventListener('error', finish, { signal: events.signal });
    }
  });
}

async function loadWorks(active, selected) {
  await active.opening;
  if (session !== active || active.closing) return;
  await new Promise(resolve => { active.revealTimer = setTimeout(resolve, 500); });
  if (session !== active || active.closing) return;
  for (const card of selected.parentElement.children) {
    if (card !== selected) startMedia(card);
  }
  grid.classList.remove('is-intro');
  active.observer = new IntersectionObserver(entries => {
    if (session !== active || active.closing) return;
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) startMedia(target);
      const media = target.firstElementChild;
      if (!(media instanceof HTMLVideoElement)) continue;
      if (isIntersecting) media.play().catch(() => {});
      else media.pause();
    }
  }, { root: scroller });
  for (const card of active.cards.values()) active.observer.observe(card);
}

function animateButton(from, reverse = false) {
  const to = close.getBoundingClientRect();
  const x = from.left + from.width / 2 - to.left - to.width / 2;
  const y = from.top - to.top;
  const move = {
    duration: reduceMotion.matches ? 220 : 511,
    easing: 'cubic-bezier(.2, .8, .2, 1)',
    fill: 'both',
    direction: reverse ? 'reverse' : 'normal',
  };
  return [
    close.animate(reduceMotion.matches
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [{ transform: `translate(${x}px, ${y}px)` }, { transform: 'none' }], move),
    surface.animate([{ width: `${from.width}px`, boxShadow: 'none' }, { width: `${to.width}px` }], move),
    icon.animate([{ opacity: 1 }, { opacity: 0, offset: .46 }, { opacity: 0 }], move),
    label.animate([{ opacity: 0 }, { opacity: 0, offset: .48 }, { opacity: 1 }], move),
  ];
}

async function finishOpening(active, selected) {
  await Promise.all([
    waitForSelected(selected.firstElementChild),
    Promise.allSettled(active.animations.map(animation => animation.finished)),
  ]);
  if (session !== active || active.closing) return;
  selected.classList.remove('is-transition-card');
  if (active.flight) {
    const flight = active.flight;
    for (const animation of flight.animations) animation.cancel();
    active.animations = active.animations.filter(animation => !flight.animations.includes(animation));
    flight.layer.remove();
    active.flight = null;
  }
  active.phase = 'open';
}

function openWorks(origin, id) {
  if (session || !works.has(id)) return;
  const hintRect = hint.getBoundingClientRect();
  const cards = renderGrid();
  const selected = cards.get(id);
  grid.classList.add('is-intro');
  selected.classList.add('is-selected');
  const active = { origin, cards, selected, animations: [], observer: null, closing: false, phase: 'opening',
    fromShot: origin.classList.contains('shot-card'), scrollY: window.scrollY,
    rail: origin.closest('.shots-rail'), railScroll: origin.closest('.shots-rail')?.scrollLeft ?? 0 };
  session = active;
  window.portfolioLenis?.stop();
  root.classList.add('works-open');
  document.dispatchEvent(new Event('works-visibility'));
  dialog.showModal();
  close.focus({ preventScroll: true });
  scroller.scrollTop += selected.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 10;
  startMedia(selected, 'high');
  const sourceVideo = origin.querySelector('video');
  const targetVideo = selected.querySelector('video');
  if (sourceVideo && targetVideo) {
    const synchronize = () => {
      if (Number.isFinite(targetVideo.duration) && targetVideo.duration > 0) {
        targetVideo.currentTime = sourceVideo.currentTime % targetVideo.duration;
      }
    };
    if (targetVideo.readyState >= 1) synchronize();
    else targetVideo.addEventListener('loadedmetadata', synchronize, { once: true });
  }
  const duration = reduceMotion.matches ? 220 : 480;
  active.flight = reduceMotion.matches ? null : flyCard(dialog, origin, selected, duration);
  if (active.flight) selected.classList.add('is-transition-card');
  origin.classList.add('is-transition-source');
  active.animations = [
    ...(active.fromShot ? [fadeGallery(close, true, duration)] : animateButton(hintRect)),
    fadeGallery(scroller, true, duration),
    ...(active.flight?.animations ?? []),
  ];
  active.opening = finishOpening(active, selected);
  loadWorks(active, selected);
}

function resetHome() {
  if (window.portfolioLenis) window.portfolioLenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

function restorePosition(active) {
  if (!active.fromShot) { resetHome(); return; }
  if (window.portfolioLenis) window.portfolioLenis.scrollTo(active.scrollY, { immediate: true, force: true });
  else window.scrollTo({ top: active.scrollY, behavior: 'instant' });
  if (active.rail) active.rail.scrollLeft = active.railScroll;
}

async function closeWorks(clickedCard) {
  const active = session;
  if (!active || active.closing) return;
  active.closing = true;
  document.dispatchEvent(new Event('works-closing'));
  clearTimeout(active.revealTimer);
  active.observer?.disconnect();
  grid.querySelectorAll('video').forEach(video => video.pause());
  let destination = active.origin;
  if (active.phase === 'opening') {
    for (const animation of active.animations) animation.reverse();
    await Promise.allSettled(active.animations.map(animation => animation.finished));
  } else {
    // The gallery can be closed far from the row where it originally opened.
    // Use a currently visible work with a visible counterpart on the home grid.
    const needsReset = active.fromShot ? Math.abs(window.scrollY - active.scrollY) > 1 : window.scrollY > 0;
    restorePosition(active);
    if (needsReset) await new Promise(resolve => setTimeout(resolve, 240));
    const candidates = [clickedCard, active.selected, ...active.cards.values()].filter(Boolean);
    const targets = active.fromShot
      ? new Map([...active.rail.querySelectorAll('.shot-card')].map(shot => [shot.dataset.work, shot]))
      : homeCards;
    const returningCard = candidates.find(card =>
      isCardVisible(card) && isCardVisible(targets.get(card.dataset.work)));
    destination = returningCard ? targets.get(returningCard.dataset.work) : active.origin;
    for (const animation of active.animations) animation.cancel();
    const duration = reduceMotion.matches ? 220 : 420;
    active.flight = !reduceMotion.matches && returningCard
      ? flyCard(dialog, returningCard, destination, duration) : null;
    if (active.flight) {
      returningCard.classList.add('is-transition-card');
      destination.classList.add('is-transition-source');
    }
    active.animations = [
      ...(active.fromShot ? [fadeGallery(close, false, duration)] : animateButton(hint.getBoundingClientRect(), true)),
      fadeGallery(scroller, false, duration),
      ...(active.flight?.animations ?? []),
    ];
    await Promise.allSettled(active.animations.map(animation => animation.finished));
  }
  dialog.close();
  for (const animation of active.animations) animation.cancel();
  active.flight?.layer.remove();
  active.origin.classList.remove('is-transition-source');
  destination.classList.remove('is-transition-source');
  grid.replaceChildren();
  grid.classList.remove('is-intro');
  root.classList.remove('works-open');
  window.portfolioLenis?.start();
  restorePosition(active);
  destination.focus({ preventScroll: true });
  session = null;
  document.dispatchEvent(new Event('works-visibility'));
}

for (const tile of document.querySelectorAll('.mosaic .tile')) {
  const src = tile.querySelector('img, video').getAttribute('src');
  const id = src.split('/').pop().split('.')[0];
  const work = works.get(id);
  if (!work) continue;
  homeCards.set(id, tile);
  tile.setAttribute('aria-haspopup', 'dialog');
  tile.setAttribute('aria-controls', dialog.id);
  tile.setAttribute('aria-label', 'View work: ' + work.title);
  tile.addEventListener('click', () => openWorks(tile, id));
}


document.addEventListener('click', event => {
  const shot = event.target.closest('.shot-card[data-work]');
  if (shot) openWorks(shot, shot.dataset.work);
});

close.addEventListener('click', () => closeWorks());
grid.addEventListener('click', event => {
  const card = event.target.closest('.works-card');
  if (card) closeWorks(card);
});
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeWorks();
});
