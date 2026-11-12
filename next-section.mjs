import { worksRows } from './works-data.mjs?v=6';
import { attachCardTilt } from './card-tilt.mjs?v=4';
import { caseCoverImages, mountCases } from './cases.mjs?v=24';
import { caseStudyImages } from './case-study.mjs?v=13';
import { preloadGallery } from './gallery-preload.mjs?v=3';

const section = document.querySelector('.skills-section');
const stage = section.querySelector('.skills-stage');
const card = section.querySelector('.skills-card');
const slides = [...card.querySelectorAll('[data-story-slide]')];
const skills = [...card.querySelectorAll('.skills-list li')];
const bars = [...card.querySelectorAll('.skills-progress > span')];
const fills = bars.map(bar => bar.querySelector('i'));
const follow = section.querySelector('.skills-follow');
const rail = section.querySelector('.shots-rail');
const companies = [...card.querySelectorAll('.experience-list li')];
const logos = card.querySelector('.company-logos img');
const experiencePhotos = card.querySelector('.experience-photos');
const blurredPhotos = experiencePhotos.cloneNode(true);
blurredPhotos.classList.add('experience-photos--blurred');
for (const image of blurredPhotos.querySelectorAll('.experience-photo')) {
  image.src = `assets/experience/${image.dataset.company}-blur.webp`;
}
experiencePhotos.after(blurredPhotos);
const experiencePhotoLayers = [experiencePhotos, blurredPhotos];
const footer = document.querySelector('.site-footer');
const footerRunway = document.querySelector('.footer-runway');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const mobileQuery = matchMedia('(max-width: 700px)');
preloadGallery(worksRows, caseCoverImages(mobileQuery.matches), caseStudyImages());
const nativeFooterMotion = CSS.supports('animation-timeline', 'view()') &&
  CSS.supports('timeline-scope', '--footer-motion') &&
  CSS.supports('animation-range', 'contain 0% contain 100%');
const workIntro = follow.querySelector('.work-intro');
mountCases(follow.querySelector('.shots'), showCases => {
  stage.classList.toggle('has-cases', showCases);
  if (!showCases) stage.scrollTop = 0;
  syncShotVideos();
  invalidateGeometry();
});
const clamp = n => Math.max(0, Math.min(1, n));
const REVEAL_END = 1.65;
const SHRINK_END = 2.65;
const EXPERIENCE_STEP = .8;
const SCENE_END = SHRINK_END + EXPERIENCE_STEP * 4;
let frame;
let lastReady = '';
let lastCompany = -1;
let previousReveal = null;
let previousExperience = null;
let footerSoundArmed = null;
let geometry = null;
let geometryDirty = true;
let lastUnits = null;
let lastFooterProgress = null;
let lastLayoutTransition = null;
let lastBlend = null;
let lastActiveBar = -1;

// Keep all descriptions in the same grid cell, so switching companies does
// not change the height of the surrounding layout on narrow screens.
const descriptions = {
  ru: [
    "Сделал личный кабинет Росгосстраха. Продумал, как клиенты будут управлять полисами, подавать заявления и получать выплаты.",
    "Создал сайт, личный кабинет студента и учебную платформу для нового курса английского в Яндекс Практикуме. С методистами продумывал, как поддерживать интерес студентов во время обучения.",
    "Занимался функциями нового приложения Афиши и развивал его дизайн-систему. Делал рекламные материалы и интерфейсы Афиши Daily.",
    "Вёл проекты от первой встречи с клиентом до передачи в разработку: создавал брендинг, презентации, сайты и мобильные приложения для разных компаний."
  ],
  en: [
    'I worked on Rosgosstrakh’s customer account and defined how customers manage policies, file claims, and receive payouts.',
    'I worked on the website, student dashboard, and learning platform for a new English course at Yandex Practicum. I worked with educators on ways to keep students engaged throughout the course.',
    'I worked on features for Afisha’s new mobile app and developed its design system. I also created marketing materials and worked on interfaces for Afisha Daily.',
    'I led projects from the first client meeting to developer handoff, designing brand identities, presentations, websites, and mobile apps.',
  ],
};
const originalDescription = follow.querySelector('.work-intro p');
const descriptionsBox = document.createElement('div');
descriptionsBox.className = 'work-copy';
originalDescription.replaceWith(descriptionsBox);
const descriptionNodes = descriptions.en.map((_, index) => {
  const paragraph = index === 0 ? originalDescription : document.createElement('p');
  paragraph.classList.toggle('is-active', index === 0);
  paragraph.setAttribute('aria-hidden', String(index !== 0));
  descriptionsBox.append(paragraph);
  return paragraph;
});

// Keep the original rail crops where they differ from the works grid.
const ratios = {
  'office-card-short-loop': 636 / 800, c8b32: 705 / 886.7924,
  '971b8': 780 / 1068, fc14a: 745.5533 / 775.2679, 'health-icon': 7 / 5,
  'portfolio-carousel': 1, '26a84': 892 / 1184, b547c: 705 / 736.8844,
  'travel-card-figma-export': 705 / 736.8844, '60c88': 860 / 1864,
  '419c4': 860 / 1864, '268e2': 705 / 1156.9231, '44d3d': 705 / 1156.9231,
  bb7e4: 705 / 674.6774, '7e86d': 705 / 674.6774, 'home-icon': 7 / 5,
  '37f3a': 860 / 1864, '35eff': 430 / 932, 'rgs-download-app': 864 / 1080,
  '778b8': 705 / 666.4179, '2e309': 705 / 666.4179, 'auto-icon': 7 / 5,
  '929e2': 1, '7f350': 1, bc8e2: 859 / 1538,
};
const shotVideos = [];
const shotCards = [];
const shotWorks = worksRows.flatMap(row => row.cards);
for (const [id, after] of [
  ['cad70', 'health-icon'],
  ['68d20', 'ecb6d'],
  ['a74ad', 'e7124'],
  ['7e86d', '16f22'],
  ['bcbdd', '4b2fa'],
]) {
  const index = shotWorks.findIndex(work => work.id === id);
  const anchor = shotWorks.find(work => work.id === after);
  if (index < 0 || !anchor) continue;
  const [work] = shotWorks.splice(index, 1);
  shotWorks.splice(shotWorks.indexOf(anchor) + 1, 0, work);
}
// Reuse the same project assets and identifiers as the existing works gallery.
for (const [index, work] of shotWorks.entries()) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'shot-card';
  button.dataset.work = work.id;
  button.style.aspectRatio = work.layout === 'onboarding'
    ? '780 / 1690'
    : ratios[work.id] || work.shotAspect || work.aspect;
  if (work.layout) button.classList.add(`shot-card-${work.layout}`);
  shotCards.push({ button, title: work.title });
  const media = document.createElement(work.video ? 'video' : 'img');
  if (work.video) {
    media.poster = `assets/optimized/${work.poster}.webp`;
    media.dataset.src = work.preview || work.source || `assets/${work.id}.mp4`;
    media.muted = true;
    media.defaultMuted = true;
    media.playsInline = true;
    media.loop = true;
    media.preload = 'none';
    media.disablePictureInPicture = true;
    media.disableRemotePlayback = true;
    media.setAttribute('aria-hidden', 'true');
    shotVideos.push(media);
  } else {
    // Load the opening strip with the main scroll, then let the rail load as browsed.
    media.loading = index < (mobileQuery.matches ? 3 : 8) ? 'eager' : 'lazy';
    media.fetchPriority = 'low';
    media.decoding = 'async';
    media.src = work.source || `assets/optimized/${work.id}.webp`;
    media.alt = '';
  }
  media.draggable = false;
  media.setAttribute('nopin', 'nopin');
  button.append(media);
  rail.append(button);
}
attachCardTilt(rail.querySelectorAll('.shot-card'));

const visibleShotVideos = new Set();
function syncShotVideos() {
  const canPlay = !document.hidden && !rail.hidden && !follow.inert && !stage.inert &&
    !document.documentElement.classList.contains('works-open');
  for (const video of shotVideos) {
    if (!canPlay || !visibleShotVideos.has(video)) {
      if (!video.paused) video.pause();
      continue;
    }
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    if (video.paused) video.play().catch(() => {});
  }
}
const shotVideoObserver = new IntersectionObserver(entries => {
  for (const { target, intersectionRatio } of entries) {
    if (intersectionRatio >= .2) visibleShotVideos.add(target);
    else visibleShotVideos.delete(target);
  }
  syncShotVideos();
}, { threshold: .2 });
shotVideos.forEach(video => shotVideoObserver.observe(video));
document.addEventListener('visibilitychange', syncShotVideos);
document.addEventListener('works-visibility', syncShotVideos);

// Mouse drags pan the rail, while a stationary press remains a card click.
let drag = null;
let suppressDragClick = false;
rail.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  drag = { x: event.clientX, left: rail.scrollLeft, moved: false };
});
addEventListener('pointermove', event => {
  if (!drag || event.pointerType !== 'mouse') return;
  const distance = event.clientX - drag.x;
  if (!drag.moved && Math.abs(distance) < 6) return;
  drag.moved = true;
  rail.classList.add('is-dragging');
  rail.scrollLeft = drag.left - distance;
  event.preventDefault();
});
function endDrag() {
  if (!drag) return;
  suppressDragClick = drag.moved;
  drag = null;
  rail.classList.remove('is-dragging');
  if (suppressDragClick) setTimeout(() => { suppressDragClick = false; }, 0);
}
addEventListener('pointerup', endDrag);
addEventListener('pointercancel', endDrag);
rail.addEventListener('click', event => {
  if (!suppressDragClick || event.detail === 0) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  suppressDragClick = false;
}, true);

function update() {
  frame = null;
  // The stage follows the visible viewport; the scroll track stays anchored to svh.
  // visualViewport can report toolbar changes before dvh catches up on mobile.
  const visual = window.visualViewport;
  const visibleHeight = mobileQuery.matches && visual && Math.abs(visual.scale - 1) < .01
    ? `${Math.min(window.innerHeight, visual.height)}px` : '';
  if (stage.style.height !== visibleHeight) stage.style.height = visibleHeight;
  const viewport = mobileQuery.matches ? stage.clientHeight : window.innerHeight;
  const width = window.innerWidth;
  const forceUpdate = geometryDirty || !geometry || geometry.viewport !== viewport || geometry.width !== width;
  if (forceUpdate) {
    const storyHeight = parseFloat(getComputedStyle(footerRunway).top);
    const stableViewport = mobileQuery.matches ? storyHeight / 7.8 : viewport;
    geometry = {
      viewport, width,
      stableViewport,
      sectionTop: section.getBoundingClientRect().top + window.scrollY,
      footerTop: footerRunway.getBoundingClientRect().top + window.scrollY,
      distance: Math.max(1, storyHeight - stableViewport),
      footerDistance: Math.max(1, footerRunway.offsetHeight - document.documentElement.clientHeight),
      infoHeight: workIntro.offsetHeight,
      followGap: parseFloat(getComputedStyle(follow).gap) || 0,
      mobile: mobileQuery.matches,
    };
    geometryDirty = false;
  }
  // Layout is measured only when geometry changes, not on every scroll frame.
  const units = clamp((window.scrollY - geometry.sectionTop) / geometry.distance) * SCENE_END;
  const footerScroll = window.scrollY - geometry.footerTop;
  const footerProgress = clamp(footerScroll / geometry.footerDistance);
  if (!forceUpdate && units === lastUnits && footerProgress === lastFooterProgress) return;
  const storyUnchanged = !forceUpdate && units === lastUnits;
  lastUnits = units;
  lastFooterProgress = footerProgress;
  footer.classList.toggle('is-revealing', footerScroll > 1);
  if (!nativeFooterMotion) {
    const footerTransform = `translateY(${(1 - footerProgress) * 100}%)`;
    if (footer.style.transform !== footerTransform) footer.style.transform = footerTransform;
    const stageTransform = footerProgress
      ? `translate3d(0, calc(var(--footer-background-travel) * ${footerProgress}), 0)` : '';
    if (stage.style.transform !== stageTransform) stage.style.transform = stageTransform;
  }
  const footerInert = footerProgress <= .95;
  if (footer.inert !== footerInert) {
    footer.inert = footerInert;
    stage.inert = !footerInert;
    syncShotVideos();
  }
  if (footerSoundArmed === null) footerSoundArmed = footerProgress < .995;
  else if (footerProgress < .94) footerSoundArmed = true;
  if (footerSoundArmed && footerProgress >= .995) {
    footerSoundArmed = false;
    document.dispatchEvent(new CustomEvent('portfolio-footer-arrive'));
  }
  if (storyUnchanged) return;
  const reveal = clamp(units / REVEAL_END);
  const transition = clamp((units - REVEAL_END) / (SHRINK_END - REVEAL_END));
  const experienceProgress = Math.max(0, Math.min(4, (units - SHRINK_END) / EXPERIENCE_STEP));
  const companyIndex = Math.min(3, Math.floor(experienceProgress));
  const companyFill = experienceProgress >= 4 ? 1 : experienceProgress - companyIndex;
  if (companyIndex !== lastCompany) {
    if (lastCompany >= 0 && previousExperience) {
      document.dispatchEvent(new CustomEvent('portfolio-story-change', { detail: { experience: true, companyIndex } }));
    }
    descriptionNodes.forEach((paragraph, index) => {
      paragraph.classList.toggle('is-active', index === companyIndex);
      paragraph.setAttribute('aria-hidden', String(index !== companyIndex));
    });
    for (const layer of experiencePhotoLayers) {
      layer.children[lastCompany]?.classList.remove('is-active');
      layer.children[companyIndex].classList.add('is-active');
    }
    lastCompany = companyIndex;
  }
  const cardViewport = geometry.stableViewport;
  const cardHeight = Math.min(800, cardViewport - 20, (width - 20) / .8);
  const mobile = geometry.mobile;
  const gap = geometry.followGap;
  const infoHeight = geometry.infoHeight;
  const slotHeight = Math.max(cardViewport / 3, (cardViewport - 20 - 2 * gap - infoHeight) / 2);
  // Reserve a little more room for the work content on short mobile screens,
  // regardless of which tab is active.
  const shortScreenInset = mobile ? Math.min(40, Math.max(0, (740 - cardViewport) * .5)) : 0;
  const finalHeight = Math.min(cardHeight, Math.max(185, Math.min(cardHeight, slotHeight) - shortScreenInset));
  // The expanded mobile card can be taller while following the same width and
  // compact dimensions through the transition.
  const expandedHeight = mobile ? Math.min(800, cardViewport - 20, cardHeight * 1.2) : cardHeight;
  const baseHeight = cardHeight + (finalHeight - cardHeight) * transition;
  const currentHeight = baseHeight + (expandedHeight - cardHeight) * (1 - transition);
  // Both story titles share one position. Animate the remaining layout rather
  // than switching padding and type size at a scroll threshold.
  const endFont = mobile ? Math.max(22, Math.min(36, currentHeight * .15)) : 36;
  const logoSize = mobile && cardViewport <= 740 ? Math.max(36, Math.min(56, currentHeight * .22)) : 56;
  const heightValue = `${currentHeight}px`;
  const widthValue = `${baseHeight * .8}px`;
  const initialTop = Math.max(10, (viewport - expandedHeight) / 2);
  const cardTop = initialTop + (10 - initialTop) * transition;
  const cardInfoGap = mobile ? 16 : 20;
  const tabsGap = mobile ? 16 : 24;
  if (forceUpdate || transition !== lastLayoutTransition) {
    stage.style.setProperty('--story-padding-top', `${mobile ? 40 : 60}px`);
    stage.style.setProperty('--story-padding-side', `${mobile ? 24 : 32 - 8 * transition}px`);
    stage.style.setProperty('--story-padding-bottom', `${mobile ? 24 : 32 - 8 * transition}px`);
    stage.style.setProperty('--story-heading-size', `${36 + (endFont - 36) * transition}px`);
    stage.style.setProperty('--story-heading-line', `${40 + (endFont * 1.1 - 40) * transition}px`);
    stage.style.setProperty('--case-logo-size', `${logoSize}px`);
    if (card.style.height !== heightValue) card.style.height = heightValue;
    if (card.style.width !== widthValue) card.style.width = widthValue;
    card.style.transform = `translateY(${cardTop - 10}px)`;
    if (stage.style.getPropertyValue('--story-height') !== heightValue) stage.style.setProperty('--story-height', heightValue);
    const cardTopValue = `${cardTop}px`;
    if (stage.style.getPropertyValue('--card-top') !== cardTopValue) stage.style.setProperty('--card-top', cardTopValue);
    const shotsHeight = viewport - 20 - finalHeight - cardInfoGap - infoHeight - gap - 40 - tabsGap;
    const shotsHeightValue = `${Math.max(0, shotsHeight)}px`;
    if (stage.style.getPropertyValue('--shots-height') !== shotsHeightValue) stage.style.setProperty('--shots-height', shotsHeightValue);
    const followProgress = clamp((transition - .2) / .6);
    follow.style.opacity = reduced.matches ? Number(transition >= .5) : followProgress;
    const followTravel = Math.max(40, viewport - cardTop - currentHeight - cardInfoGap);
    follow.style.transform = `translateY(${reduced.matches ? 0 : (1 - followProgress) * followTravel}px)`;
    const followInert = followProgress < .5;
    if (follow.inert !== followInert) {
      follow.inert = followInert;
      syncShotVideos();
    }
    lastLayoutTransition = transition;
  }
  if (forceUpdate || reveal !== previousReveal) {
    skills.forEach((item, index) => {
      const value = clamp(reveal * (skills.length + 1) - index);
      item.style.opacity = value;
      item.style.transform = `translateY(${reduced.matches ? 0 : (1 - value) * 10}px)`;
    });
  }
  const blend = reduced.matches ? Number(transition > .5) : clamp((transition - .12) / .4);
  const experience = blend >= .5;
  if (previousReveal !== null && reveal !== previousReveal) {
    const indices = skills.map((_, index) => index);
    if (reveal < previousReveal) indices.reverse();
    indices.forEach(index => {
      const threshold = (index + .25) / (skills.length + 1);
      if ((previousReveal < threshold && reveal >= threshold) ||
          (previousReveal >= threshold && reveal < threshold)) {
        document.dispatchEvent(new CustomEvent('portfolio-skill-reveal', { detail: { index } }));
      }
    });
  }
  if (previousExperience !== null && previousExperience !== experience) {
    document.dispatchEvent(new CustomEvent('portfolio-story-change', { detail: { experience } }));
  }
  previousReveal = reveal;
  previousExperience = experience;
  if (forceUpdate || blend !== lastBlend) {
    slides.forEach(slide => { slide.hidden = false; });
    slides[0].style.opacity = 1 - blend;
    slides[1].style.opacity = blend;
    slides[0].style.visibility = blend >= 1 ? 'hidden' : 'visible';
    slides[1].style.visibility = blend <= 0 ? 'hidden' : 'visible';
    card.dataset.story = experience ? 'experience' : 'skills';
    lastBlend = blend;
  }
  const activeBar = transition < 1 ? 0 : companyIndex + 1;
  if (activeBar !== lastActiveBar) {
    bars.forEach((bar, index) => bar.classList.toggle('is-active', index === activeBar));
    lastActiveBar = activeBar;
  }
  fills[0].style.transform = `scaleX(${reveal})`;
  for (let i = 0; i < companies.length; i++) {
    fills[i + 1].style.transform = `scaleX(${i < companyIndex ? 1 : i === companyIndex && transition >= 1 ? companyFill : 0})`;
    if (companies[i].hidden !== (i !== companyIndex)) companies[i].hidden = i !== companyIndex;
  }
  const logoTransform = `translateX(-${companyIndex * 75.5 * logoSize / 56}px)`;
  if (logos.style.transform !== logoTransform) logos.style.transform = logoTransform;
  const label = experience ? `${window.portfolioLanguage === 'ru' ? 'Опыт' : 'Experience'}: ${companies[companyIndex].innerText}` : (window.portfolioLanguage === 'ru' ? 'Навыки' : 'Skills');
  if (lastReady !== label) {
    card.querySelector('#story-status').textContent = label;
    lastReady = label;
  }
}

function schedule() { if (!frame) frame = requestAnimationFrame(update); }
function invalidateGeometry() { geometryDirty = true; schedule(); }
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', invalidateGeometry, { passive: true });
window.visualViewport?.addEventListener('resize', invalidateGeometry, { passive: true });
reduced.addEventListener('change', invalidateGeometry);
if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(invalidateGeometry);
  [workIntro, section, footerRunway, footer, document.querySelector('.approach'), document.querySelector('.intro-runway')]
    .filter(Boolean).forEach(element => observer.observe(element));
}
document.fonts?.ready.then(invalidateGeometry);
card.querySelectorAll('[data-story-direction]').forEach(button => button.addEventListener('click', () => {
  const storyDistance = geometry.distance;
  const u = clamp(-section.getBoundingClientRect().top / storyDistance) * SCENE_END;
  const milestones = [0, REVEAL_END, SHRINK_END, SHRINK_END + EXPERIENCE_STEP, SHRINK_END + EXPERIENCE_STEP * 2, SHRINK_END + EXPERIENCE_STEP * 3, SCENE_END];
  const destination = button.dataset.storyDirection === 'next'
    ? milestones.find(value => value > u + .03) ?? SCENE_END
    : [...milestones].reverse().find(value => value < u - .03) ?? 0;
  const target = window.scrollY + section.getBoundingClientRect().top + storyDistance * destination / SCENE_END;
  if (window.portfolioLenis) window.portfolioLenis.scrollTo(target);
  else window.scrollTo({ top: target, behavior: reduced.matches ? 'instant' : 'smooth' });
}));
function translateStories() {
  const isRu = window.portfolioLanguage === 'ru';
  const copy = isRu ? descriptions.ru : descriptions.en;
  descriptionNodes.forEach((paragraph, index) => { paragraph.textContent = copy[index]; });
  for (const { button, title } of shotCards) {
    button.setAttribute('aria-label', isRu ? 'Открыть работу' : `View work: ${title}`);
  }
  if (frame) cancelAnimationFrame(frame);
  geometryDirty = true;
  update();
}
document.addEventListener('portfolio-language-change', translateStories);
translateStories();
