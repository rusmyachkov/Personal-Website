import { measureScene, wrapIntroWords } from '../../scene-layout.mjs?v=figma-components-4';

// Windows wheel events arrive in larger steps than trackpad scrolling. Smooth
// those steps without taking over touch input or the case/gallery scroll areas.
if (/Windows/i.test(navigator.userAgent) && matchMedia('(pointer: fine)').matches && window.Lenis) {
  window.portfolioLenis = new window.Lenis({
    autoRaf: true,
    smoothWheel: true,
    syncTouch: false,
    lerp: 0.16,
    respectReducedMotion: false,
    prevent: node => node.id === 'skills-stories' || !!node.closest?.('.works-scroll, .case-study-scroll'),
  });
  window.portfolioLenis.on('scroll', () => window.ScrollTrigger?.update());
}

// Standalone comparison: native scroll with a scrubbed GSAP timeline.
if (!window.gsap || !window.ScrollTrigger) {
  import('../../app.js?v=works-2');
} else {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

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
  let timeline;
  let trigger;
  let resizeFrame = null;
  let measuredWidth = 0;
  let measuredHeight = 0;
  let introMostlyGone = false;
  let syncMosaicVideos = () => {};

  function buildScene() {
    resizeFrame = null;
    measuredWidth = stage.clientWidth;
    measuredHeight = stage.clientHeight;
    if (trigger) trigger.kill(false);
    if (timeline) timeline.kill();

    const { w, h, mobile, col, startW, startH, startX, startY, endW, endX, endY, endH,
      socialY, caption: endCaption, logoSize } = measureScene({ stage, intro, mosaic, portraitSlot });

    gsap.set(columns, { x: 0, y: 0, opacity: 1 });
    gsap.set(columnTiles.flat(), { x: 0, y: 0, opacity: 1 });
    gsap.set(hint, { x: 0, y: 0, opacity: 1 });
    gsap.set(portrait, { autoRound: false, left: startX, top: startY, width: startW, height: startH });
    gsap.set(caption, { autoRound: false, fontSize: 18, lineHeight: '22px', letterSpacing: '-0.2px', bottom: 20, left: 20, right: 20, gap: 12 });
    gsap.set(captionText, { scale: 1, marginTop: 0, transformOrigin: 'center bottom' });
    gsap.set(monogram, { width: 32, height: 32 });
    gsap.set(intro, { autoAlpha: 0 });
    gsap.set(words, { opacity: 0, y: 25 });
    gsap.set(socials, { top: socialY, x: 0, xPercent: -50, y: 25, autoAlpha: 0 });

    timeline = gsap.timeline({ paused: true });
    // One unit represents the complete scroll through the introduction.
    timeline.to({}, { duration: 1 }, 0);
    columns.forEach((column, i) => {
      if (i === 3) return;
      const side = Math.sign(i - 3);
      const distance = (mobile ? col * 1.3 : w * .2) * (1 + (Math.abs(i - 3) - 1) * .12);
      timeline.to(column, { x: side * distance, duration: .82, ease: 'sine.inOut' }, 0);
      timeline.to(column, { opacity: 0, duration: .3, ease: 'sine.inOut' }, .65);
      const tiles = columnTiles[i];
      tiles.forEach((tile, index) => {
        const direction = tiles.length === 2 ? (index === 0 ? -.55 : .55)
          : index === 0 ? -.55 : index === tiles.length - 1 ? .55 : (i % 2 ? -.16 : .16);
        timeline.to(tile, { y: direction * h, duration: .82, ease: 'sine.inOut' }, 0);
      });
    });
    timeline.to(centralTop, { y: -h * .95, duration: .82, ease: 'sine.inOut' }, 0);
    timeline.to(hint, { y: h * .65, duration: .82, ease: 'sine.inOut' }, 0);
    timeline.to([...centralTop, hint], { opacity: 0, duration: .3, ease: 'sine.inOut' }, .65);
    timeline.to(portrait, { autoRound: false, left: endX, top: endY, width: endW, height: endH, duration: .82, ease: 'sine.inOut' }, 0);
    timeline.to(caption, { ...endCaption, autoRound: false, duration: .82, ease: 'sine.inOut' }, 0);
    timeline.to(monogram, { width: logoSize, height: logoSize, duration: .82, ease: 'sine.inOut' }, 0);
    timeline.set(intro, { autoAlpha: 1 }, .22);
    words.forEach((word, i) => {
      const delay = .22 + .52 * .8 / 1.8 * i / Math.max(words.length - 1, 1);
      timeline.to(word, { opacity: 1, y: 0, duration: .52 / 1.8, ease: 'sine.inOut' }, delay);
    });
    timeline.set(socials, { visibility: 'visible' }, .52);
    timeline.to(socials, { opacity: 1, y: 0, duration: .3, ease: 'sine.inOut' }, .52);

    trigger = ScrollTrigger.create({
      trigger: runway,
      start: 'top top',
      end: () => `+=${Math.max(1, runway.offsetHeight - stage.clientHeight)}`,
      animation: timeline,
      scrub: .2,
      onUpdate(self) {
        const hidden = self.progress >= .96;
        if (hidden !== introMostlyGone) {
          introMostlyGone = hidden;
          syncMosaicVideos();
        }
      },
    });
    ScrollTrigger.refresh();
  }

  function scheduleBuild(force = false) {
    if (!force && stage.clientWidth === measuredWidth && stage.clientHeight === measuredHeight) return;
    if (resizeFrame === null) resizeFrame = requestAnimationFrame(buildScene);
  }
  addEventListener('resize', () => scheduleBuild(), { passive: true });
  document.addEventListener('portfolio-language-change', () => {
    words = wrapIntroWords(paragraph);
    if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
    buildScene();
    timeline.progress(trigger.progress);
  });
  hint.addEventListener('click', () => {
    window.scrollTo({ top: runway.offsetHeight - stage.offsetHeight, behavior: 'smooth' });
  });
  buildScene();
  document.fonts.ready.then(() => scheduleBuild(true));

  const videos = [...document.querySelectorAll('.mosaic video')];
  const visibleVideos = new Set();
  function syncVideo(video) {
    const shouldPlay = visibleVideos.has(video) && !introMostlyGone && !document.hidden && !document.documentElement.classList.contains('works-open');
    if (shouldPlay && video.paused) {
      const promise = video.play();
      if (promise) promise.catch(() => {});
    } else if (!shouldPlay && !video.paused) video.pause();
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) visibleVideos.add(entry.target);
        else visibleVideos.delete(entry.target);
        syncVideo(entry.target);
      });
    }, { threshold: [0, .001] });
    videos.forEach(video => observer.observe(video));
  } else {
    videos.forEach(video => { visibleVideos.add(video); syncVideo(video); });
  }
  syncMosaicVideos = () => videos.forEach(syncVideo);
  syncMosaicVideos();
  document.addEventListener('visibilitychange', () => videos.forEach(syncVideo));
  document.addEventListener('works-visibility', () => videos.forEach(syncVideo));
}
