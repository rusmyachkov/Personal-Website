import { accountStudyContent, accountStudyImages } from './case-account.mjs?v=4';

const asset = name => `assets/case-inspection/${name}.webp`;
const image = (name, extra = '') => `<div class="study-media ${extra}"><img src="${asset(name)}" alt="" loading="lazy" decoding="async"></div>`;
const phone = name => `<div class="study-media study-phone"><img src="${asset(name)}" alt="" loading="lazy" decoding="async"></div>`;
const row = (content, copy = '', extra = '') => `<section class="study-row ${extra}">${content}<div class="study-copy study-desktop-copy">${copy}</div></section>`;
const video = () => `<div class="study-media study-video"><video muted loop playsinline preload="none" poster="assets/poster-onboarding.png" data-src="assets/onboarding-transparent.webm"></video></div>`;
const mobileCopy = text => `<div class="study-copy study-mobile-copy">${text}</div>`;
const pair = (a, b) => `<div class="study-pair">${image(a)}${image(b)}</div>`;
const phonePair = (a, b, middle = '') => `<div class="study-pair study-phone-pair${middle ? ' study-phone-pair-with-copy' : ''}">${phone(a)}${middle ? mobileCopy(middle) : ''}${phone(b)}</div>`;
const mobileAfter = text => mobileCopy(text);

function inspectionContent(language) {
  const isRu = language === 'ru';
  const introMobile = isRu ? `<p><span class="muted">Самоосмотр в Росгосстрахе.</span> Я продумал, как водитель сможет сам сфотографировать повреждения после ДТП и отправить снимки через приложение.</p>` : `<p><span class="muted">Rosgosstrakh’s vehicle self-inspection.</span> I worked out how drivers could photograph damage after an accident and submit the photos through the app.</p>`;
  const intro = isRu ? `<p><span class="muted">Самоосмотр в Росгосстрахе.</span> Я продумал, как водитель сможет сам сфотографировать повреждения после ДТП и отправить снимки через приложение.</p><p class="date">С 2022 по 2023</p>` : `<p><span class="muted">Rosgosstrakh’s vehicle self-inspection.</span> I worked out how drivers could photograph damage after an accident and submit the photos through the app.</p><p class="date">From 2022 to 2023</p>`;
  const challenge = isRu ? `<p>Я сделал экран, на котором водитель отмечает повреждённые части автомобиля. От выбранных зон зависит, какие фотографии попросит приложение.</p>` : `<p>I created a screen where drivers mark the damaged parts of the vehicle. The areas they select determine which photos the app asks for.</p>`;
  const process = isRu ? `<p>На основе исследований клиентского пути и анализа других сервисов я разложил регламент на шаги по принципу «один экран — одно действие». Сделал подсказки для съёмки автомобиля, повреждений, колёс, салона и пробега. Концепции проверили в десятках модерируемых UX-тестов. После запуска сценарий уточняли по обратной связи и результатам исследований.</p>` : `<p>I used customer journey research and a review of other services to break the procedure into one action per screen. I created visual guides for photographing the vehicle, damage, wheels, interior, and odometer. The concepts went through dozens of moderated usability tests, and the flow was refined after launch based on customer feedback and research.</p>`;
  const results = isRu ? "<p>Оценка самоосмотра по CES достигла 8,7 из 10. В рамках цифрового урегулирования 44% страховых случаев уже решаются онлайн, а затраты на каждый случай в цифровом канале на 24% ниже. В 2024 году аудитория личного кабинета выросла на 89,6 тысячи активных пользователей в месяц.</p>" : '<p>Vehicle self-inspection achieved a CES score of 8.7 out of 10. As part of the broader digital claims experience, 44% of insurance cases are now handled online, while the average cost per case in the digital channel is 24% lower. In 2024, the personal account’s monthly active user base grew by 89,600 customers.</p>';
  const ending = isRu ? `<p>В результате водитель получает подсказки в момент съёмки и видит, какие кадры ещё нужно сделать. Отметить повреждения и отправить снимки можно в одном сценарии.</p>` : `<p>Drivers get guidance as they take photos and can see which shots are still needed. They can mark the damage and submit the photos in the same flow.</p>`;
  return `
    ${row(`<button type="button" class="study-media study-hero" aria-label="${isRu ? 'Закрыть кейс самоосмотра' : 'Close case: Self-examination at Rosgosstrakh'}"><picture><source media="(max-width: 700px)" srcset="assets/cases/5021c.webp"><img src="assets/cases/d45db.webp" alt=""></picture></button>`, intro)}${mobileAfter(introMobile)}
    ${row(image('e0733'))}
    ${row(video())}
    ${row(pair('2fefd', '4cfc5'))}
    ${row(phonePair('39768','57acd',challenge), challenge)}
    ${row(image('20eeb'))}
    ${row(`<div class="study-media study-phone study-phone-single"><img src="${asset('5b73b')}" alt="" loading="lazy" decoding="async"></div>`,process)}${mobileAfter(process)}
    ${row(image('car-details'))}
    ${row(image('f68c9'))}
    ${row(video())}
    ${row(phonePair('96c57','265c2'))}
    ${row(image('1bdb7'))}
    ${row(image('2c409'))}
    ${row(phonePair('91fe1','582a2'))}
    ${row(image('58203'),results)}${mobileAfter(results)}
    ${row(video())}
    ${row('<div class="study-media"><img src="assets/optimized/268e2.webp" alt="" loading="lazy" decoding="async"></div>')}
    ${row(`<div class="study-media study-phone study-phone-single"><img src="${asset('95e48')}" alt="" loading="lazy" decoding="async"></div>`)}
    ${row(`<div class="study-pair study-phone-pair study-feedback-pair"><div class="study-media study-graphic"><img src="${asset('8d6cf')}" alt="" loading="lazy" decoding="async"></div>${phone('9d9ad')}</div>`)}
    ${row(image('c6abd'),ending)}${mobileAfter(ending)}
  `;
}

export function caseStudyImages() {
  const template = document.createElement('template');
  template.innerHTML = inspectionContent('en');
  const inspection = [...template.content.querySelectorAll('.study-row:not(:first-child) img, video[poster]')]
    .map(media => media.getAttribute('src') || media.getAttribute('poster'));
  return [...accountStudyImages(), ...inspection];
}

let dialog, scroller, content, closer, layer, active, observer, revealRows, revealFrame = 0, viewportFrame = 0;
const mobile = matchMedia('(max-width: 700px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const wait = animations => Promise.allSettled(animations.map(a => a.finished));
function setup() {
  if (dialog) return;
  dialog = document.createElement('dialog');
  dialog.className = 'case-study-dialog';
  dialog.innerHTML = `<div class="case-study-scroll" data-lenis-prevent><div class="case-study-content"></div></div>
    <div class="case-study-flight-layer" aria-hidden="true"></div><button class="case-study-close" type="button"></button>`;
  document.body.append(dialog);
  scroller = dialog.querySelector('.case-study-scroll');
  content = dialog.querySelector('.case-study-content');
  closer = dialog.querySelector('.case-study-close');
  layer = dialog.querySelector('.case-study-flight-layer');
  closer.addEventListener('click', closeCase);
  content.addEventListener('click', event => {
    if (event.target.closest('.study-hero')) closeCase();
  });
  dialog.classList.add('has-scroll-reveals');
  scroller.addEventListener('scroll', scheduleReveals, { passive:true });
  window.addEventListener('resize', scheduleReveals, { passive:true });
  window.addEventListener('resize', scheduleCaseViewport, { passive:true });
  window.visualViewport?.addEventListener('resize', scheduleCaseViewport, { passive:true });
  window.visualViewport?.addEventListener('scroll', scheduleCaseViewport, { passive:true });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeCase(); });
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const video = entry.target;
      const shouldAnimate = !reduced.matches || video.dataset.reducedMotion !== 'poster';
      if (entry.isIntersecting && active && !active.closing && !document.hidden && shouldAnimate) {
        if (!video.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else video.pause();
    }
  }, { root:scroller, rootMargin:'100px' });
}
function studyContent(caseId, language) {
  return caseId === 'account' ? accountStudyContent(language) : inspectionContent(language);
}

function translateLabels(caseId, language) {
  const isRu = language === 'ru';
  const titles = isRu
    ? { account: 'Личный кабинет Росгосстраха', inspection: 'Самоосмотр в Росгосстрахе' }
    : { account: 'Rosgosstrakh’s customer account', inspection: 'Self-examination at Rosgosstrakh' };
  closer.textContent = isRu ? 'Закрыть' : 'Close';
  dialog.setAttribute('aria-label', titles[caseId]);
}

function renderCase(caseId) {
  if (dialog.dataset.study === caseId) return;
  const language = window.portfolioLanguage;
  dialog.dataset.study = caseId;
  content.innerHTML = studyContent(caseId, language);
  translateLabels(caseId, language);
  revealRows = [...content.querySelectorAll('.study-row:not(:first-child) > .study-desktop-copy')]
    .filter(copy => copy.querySelector('p'));
  revealRows.forEach(copy => copy.dataset.reveal = '');
}

function translateCase() {
  if (!dialog?.dataset.study) return;
  const caseId = dialog.dataset.study;
  const language = window.portfolioLanguage;
  const top = scroller.getBoundingClientRect().top;
  const anchor = dialog.open && [...content.querySelectorAll('.study-media, .study-mobile-copy')].find(block => {
    const bounds = block.getBoundingClientRect();
    return bounds.height && bounds.bottom > top;
  });
  const anchorTop = anchor && anchor.getBoundingClientRect().top;
  const atEnd = dialog.open && scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop < 1;

  // Extract the translated captions without replacing the case's media or scroll container.
  const template = document.createElement('template');
  template.innerHTML = studyContent(caseId, language);
  const captions = template.content.querySelectorAll('.study-copy');
  content.querySelectorAll('.study-copy').forEach((copy, index) => {
    copy.replaceChildren(...captions[index].childNodes);
  });
  const hero = template.content.querySelector('.study-hero');
  content.querySelector('.study-hero').setAttribute('aria-label', hero.getAttribute('aria-label'));
  translateLabels(caseId, language);
  if (atEnd) scroller.scrollTop = scroller.scrollHeight;
  else if (anchor) scroller.scrollTop += anchor.getBoundingClientRect().top - anchorTop;
  scheduleReveals();
}
document.addEventListener('portfolio-language-change', translateCase);

function updateCaseViewport() {
  viewportFrame = 0;
  if (!active || !dialog.open) return;
  const visual = window.visualViewport;
  if (!mobile.matches || !visual) {
    dialog.style.removeProperty('--case-viewport-height');
    dialog.style.removeProperty('--case-viewport-top');
    return;
  }
  dialog.style.setProperty('--case-viewport-height', `${visual.height}px`);
  dialog.style.setProperty('--case-viewport-top', `${visual.offsetTop}px`);
  scheduleReveals();
}
function scheduleCaseViewport() {
  if (!active || viewportFrame) return;
  viewportFrame = requestAnimationFrame(updateCaseViewport);
}
function scheduleReveals() {
  if (!active || revealFrame) return;
  revealFrame = requestAnimationFrame(() => {
    revealFrame = 0;
    if (!active || !dialog.open) return;
    const middle = scroller.getBoundingClientRect().top + scroller.clientHeight / 2;
    for (const copy of revealRows) {
      const bounds = copy.parentElement.getBoundingClientRect();
      copy.classList.toggle('is-visible', bounds.top <= middle && bounds.bottom > middle);
    }
  });
}
function rect(node) { const r=node.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,width:r.width,height:r.height}; }
function flight(source, destination, reverse, duration) {
  const start = rect(source), end = rect(destination);
  if (!start.width || !start.height || !end.width || !end.height) return [];
  const clone = document.createElement('div');
  clone.className = 'case-study-flight';
  const img = document.createElement('img');
  img.src = source.currentSrc || source.src;
  clone.append(img); layer.append(clone);
  const bounds = ({ left, top, width, height }) => ({
    left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`,
  });
  const initial = bounds(start);
  const final = bounds(end);
  const options = { duration, easing:'cubic-bezier(.23, 1, .32, 1)', fill:'both' };
  const animations = [clone.animate(reverse ? [final, initial] : [initial, final], options)];
  if (dialog.dataset.study === 'account') {
    const artwork = document.createElement('img');
    artwork.className = 'case-study-flight-artwork';
    artwork.src = destination.querySelector('img').src;
    clone.append(artwork);
    const fade = [{ opacity:0 }, { opacity:1 }];
    animations.push(artwork.animate(reverse ? fade.reverse() : fade, options));
  }
  return animations;
}
function neighborFlights(active, reverse, duration) {
  const cards = [...active.rail.children];
  const selected = cards.indexOf(active.card);
  const animations = [];
  for (const [index, card] of cards.entries()) {
    if (index === selected) continue;
    const r = rect(card);
    if (r.right < 0 || r.left > innerWidth || !r.width || !r.height) continue;
    const clone = card.cloneNode(true);
    clone.classList.add('case-study-neighbor'); clone.setAttribute('aria-hidden','true'); clone.inert = true;
    Object.assign(clone.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${r.width}px`,height:`${r.height}px`});
    layer.append(clone);
    const distance = index < selected ? -(r.right + 50) : innerWidth - r.left + 50;
    const from = `translateX(${distance}px)`;
    animations.push(clone.animate(reverse ? [{transform:from},{transform:'translateX(0)'}] : [{transform:'translateX(0)'},{transform:from}],{duration,easing:'cubic-bezier(.23,1,.32,1)',fill:'both'}));
    card.classList.add('case-study-source-hidden'); active.hidden.push(card);
  }
  return animations;
}
function clearFlight(state) {
  layer.replaceChildren();
  for (const node of state.hidden) node.classList.remove('case-study-source-hidden');
  state.hidden.length=0;
}
export async function openCaseStudy(origin, card, rail, caseId = 'inspection') {
  if (active) return;
  setup();
  renderCase(caseId);
  active = {origin,card,rail,hidden:[],closing:false};
  const state=active;
  const source=card.querySelector('img');
  if (!source) { active=null; return; }
  document.dispatchEvent(new Event('case-study-opening'));
  window.portfolioLenis?.stop();
  document.documentElement.classList.add('case-study-open');
  dialog.showModal();
  updateCaseViewport();
  document.dispatchEvent(new Event('case-study-visibility'));
  scroller.scrollTop=0;
  scheduleReveals();
  closer.focus({preventScroll:true});
  const duration = reduced.matches ? 120 : 290;
  const hero=dialog.querySelector('.study-hero');
  const animations=[scroller.animate([{opacity:0},{opacity:1}],{duration,fill:'both'}), closer.animate([{opacity:0},{opacity:1}],{duration,fill:'both'})];
  if (!reduced.matches) {
    animations.push(...neighborFlights(state,false,duration),...flight(source,hero,false,duration));
    source.classList.add('case-study-source-hidden'); state.hidden.push(source);
    hero.style.visibility='hidden';
  }
  state.animations=animations;
  state.phase='opening';
  await wait(animations);
  if (active !== state || state.closing) return;
  animations.forEach(a=>a.cancel()); hero.style.visibility=''; clearFlight(state);
  state.phase='open';
  dialog.querySelectorAll('video').forEach(video=>observer.observe(video));
}
async function closeCase() {
  const state=active;
  if (!state || state.closing) return;
  state.closing=true;
  document.dispatchEvent(new Event('case-study-closing'));
  observer.disconnect(); dialog.querySelectorAll('video').forEach(video=>video.pause());
  if (state.phase === 'opening' && state.animations?.length) {
    state.animations.forEach(animation => animation.reverse());
    await wait(state.animations);
    dialog.close(); state.animations.forEach(animation => animation.cancel());
    dialog.querySelector('.study-hero').style.visibility=''; clearFlight(state);
    document.documentElement.classList.remove('case-study-open');
    window.portfolioLenis?.start(); active=null;
    document.dispatchEvent(new Event('case-study-visibility'));
    state.origin.focus({preventScroll:true});
    return;
  }
  (state.animations||[]).forEach(a=>a.cancel());
  clearFlight(state);
  const duration=reduced.matches ? 120 : 290;
  // Return from any point in the case without flashing the beginning of the page.
  const deep = scroller.scrollTop > 5;
  if (deep) {
    const fade=scroller.animate([{opacity:1},{opacity:0}],{duration:100,fill:'both'});
    await wait([fade]);
    scroller.scrollTop=0;
    fade.cancel();
  }
  const hero=dialog.querySelector('.study-hero');
  const source=state.card.querySelector('img');
  const animations=[scroller.animate(deep ? [{opacity:0},{opacity:0}] : [{opacity:1},{opacity:0}],{duration,fill:'both'}),closer.animate([{opacity:1},{opacity:0}],{duration,fill:'both'})];
  if (!reduced.matches && source) {
    animations.push(...neighborFlights(state,true,duration),...flight(source,hero,true,duration));
    source.classList.add('case-study-source-hidden'); state.hidden.push(source);
    hero.style.visibility='hidden';
  }
  await wait(animations);
  dialog.close(); animations.forEach(a=>a.cancel()); hero.style.visibility=''; clearFlight(state);
  document.documentElement.classList.remove('case-study-open');
  window.portfolioLenis?.start();
  active=null;
  document.dispatchEvent(new Event('case-study-visibility'));
  state.origin.focus({preventScroll:true});
}
