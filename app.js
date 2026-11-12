import { measureScene, wrapIntroWords } from './scene-layout.mjs?v=figma-components-6';

const runway = document.querySelector('.intro-runway');
const stage = document.querySelector('.intro-stage');
const columns = [...document.querySelectorAll('.column')];
const portrait = document.querySelector('.portrait');
const caption = document.querySelector('.portrait-caption');
const captionText = caption.querySelector('div');
const monogram = document.querySelector('.portrait-caption .monogram');
const intro = document.querySelector('.intro-copy');
const socials = document.querySelector('.socials');
const hint = document.querySelector('.scroll-hint');
const portraitSlot = document.querySelector('.portrait-slot');
const mosaic = document.querySelector('.mosaic');
const centralTop = [...document.querySelectorAll('.central-top')];
const columnTiles = columns.map(column => [...column.querySelectorAll('.tile')]);

const paragraph = intro.querySelector('p');
let words = wrapIntroWords(paragraph);
const clamp = (v, min=0, max=1) => Math.min(max, Math.max(min, v));
const ease = p => p * p * (3 - 2 * p);
let queued = false;
let measureQueued = false;
let geometry;
let lastProgress = null;

// Layout only changes on resize or when fonts finish loading. Keep these
// measurements out of the scroll handler so each frame does not force layout.
function measure() {
  measureQueued = false;
  const layout = measureScene({ stage, intro, mosaic, portraitSlot });
  const { h, socialY } = layout;
  const range = Math.max(1, runway.offsetHeight - h);
  geometry = { ...layout, range, runwayTop: runway.getBoundingClientRect().top + window.scrollY };
  socials.style.top = socialY + 'px';
  lastProgress = null;
  schedule();
}

function scheduleMeasure() {
  if (!measureQueued) { measureQueued = true; requestAnimationFrame(measure); }
}

function render() {
  queued = false;
  if (!geometry) return;
  const { w, h, mobile, col, range, runwayTop, startW, startH, startX, startY, endW, endX, endY, endH } = geometry;
  const p = clamp((window.scrollY - runwayTop) / range);
  // Once the opening animation has finished, scrolling the rest of the page
  // should not continue updating its cards and text.
  if (p === lastProgress) return;
  lastProgress = p;
  // Clear the center first. The upper card and the scroll hint move apart,
  // while each surrounding card gets its own vertical trajectory.
  const scatter = ease(clamp(p / .82));
  const fade = 1 - ease(clamp((p - .65) / .3));
  columns.forEach((el, i) => {
    if (i === 3) return;
    const side = Math.sign(i - 3);
    const distance = (mobile ? col * 1.3 : w * .2) * (1 + (Math.abs(i - 3) - 1) * .12);
    el.style.transform = `translate3d(${side * distance * scatter}px,0,0)`;
    el.style.opacity = String(fade);
    const tiles = columnTiles[i];
    tiles.forEach((tile, index) => {
      const direction = tiles.length === 2 ? (index === 0 ? -.55 : .55)
        : index === 0 ? -.55 : index === tiles.length - 1 ? .55 : (i % 2 ? -.16 : .16);
      tile.style.transform = `translate3d(0,${direction * h * scatter}px,0)`;
    });
  });
  centralTop.forEach(tile => {
    tile.style.transform = `translate3d(0,${-h * .95 * scatter}px,0)`;
    tile.style.opacity = String(fade);
  });
  hint.style.transform = `translate3d(0,${h * .65 * scatter}px,0)`;
  hint.style.opacity = String(fade);

  // The portrait grows in sync with the surrounding cards as they scatter.
  const moving = scatter;
  const mix = (a,b) => a + (b-a)*moving;
  portrait.style.left = mix(startX,endX) + 'px';
  portrait.style.top = mix(startY,endY) + 'px';
  portrait.style.width = mix(startW,endW) + 'px';
  portrait.style.height = mix(startH,endH) + 'px';
  const endCaption = geometry.caption;
  caption.style.fontSize = mix(18, endCaption.fontSize) + 'px';
  caption.style.lineHeight = mix(22, parseFloat(endCaption.lineHeight)) + 'px';
  caption.style.letterSpacing = mix(-.4, parseFloat(endCaption.letterSpacing)) + 'px';
  caption.style.gap = mix(12, endCaption.gap) + 'px';
  captionText.style.transform = '';
  captionText.style.marginTop = '0';
  caption.style.bottom = mix(20, endCaption.bottom) + 'px';
  caption.style.left = caption.style.right = mix(20, endCaption.left) + 'px';
  monogram.style.width = monogram.style.height = mix(32, geometry.logoSize) + 'px';
  const reveal = clamp((p - .22) / .52);
  intro.style.visibility = reveal > 0 ? 'visible' : 'hidden';
  intro.style.opacity = reveal > 0 ? '1' : '0';
  words.forEach((word, i) => {
    const v = ease(clamp(reveal * 1.8 - i / Math.max(words.length - 1, 1) * .8));
    word.style.opacity = String(v);
    word.style.transform = `translate3d(0,${(1-v)*25}px,0)`;
  });
  const social = ease(clamp((p - .52) / .3));
  socials.style.transform = `translate3d(-50%,${(1-social)*25}px,0)`;
  socials.style.opacity = String(social);
  socials.style.visibility = social > .02 ? 'visible' : 'hidden';
}
function schedule(){ if (!queued) { queued = true; requestAnimationFrame(render); } }
addEventListener('scroll', schedule, {passive:true});
addEventListener('resize', scheduleMeasure, {passive:true});
document.addEventListener('portfolio-language-change', () => {
  words = wrapIntroWords(paragraph);
  scheduleMeasure();
});
if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(scheduleMeasure);
  observer.observe(stage);
  observer.observe(intro);
}
hint.addEventListener('click', () => {
  const destination = runway.offsetHeight - stage.offsetHeight;
  if (window.portfolioLenis) window.portfolioLenis.scrollTo(destination);
  else window.scrollTo({top: destination, behavior: 'smooth'});
});
document.fonts.ready.then(scheduleMeasure);
measure();

// Decode and play only videos whose cards are actually on screen. Preserve
// their playback position when the visitor scrolls away and back.
const videos = [...document.querySelectorAll('.mosaic video')];
const visibleVideos = new Set();
function syncVideo(video) {
  const shouldPlay = visibleVideos.has(video) && !document.hidden && !document.documentElement.classList.contains('works-open');
  if (shouldPlay && video.paused) {
    const promise = video.play();
    if (promise) promise.catch(() => {});
  } else if (!shouldPlay && !video.paused) video.pause();
}
if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
      syncVideo(entry.target);
    });
  }, { threshold: [0, .001] });
  videos.forEach(video => videoObserver.observe(video));
} else {
  videos.forEach(video => { visibleVideos.add(video); syncVideo(video); });
}
document.addEventListener('visibilitychange', () => videos.forEach(syncVideo));
document.addEventListener('works-visibility', () => videos.forEach(syncVideo));
