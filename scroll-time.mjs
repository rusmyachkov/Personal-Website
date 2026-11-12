import { formatElapsed, scrollTimeMessage } from './scroll-time-core.mjs?v=2';

const footer = document.querySelector('[data-scroll-time]');
const content = footer.querySelector('.scroll-time-content');
const text = footer.querySelector('[data-scroll-time-text]');
const startedAt = Number.isFinite(performance.timeOrigin)
  ? performance.timeOrigin : Date.now() - performance.now();
const fastChoice = Math.random();
let category = '';
let language;
let durationNode;
let punctuation = '';
let words = [];
let frame = null;
let lastProgress = -1;
let footerNear = true;
const footerRunway = document.querySelector('.footer-runway');

function renderMessage(message, duration) {
  const link = document.createElement('a');
  link.href = 'https://t.me/rusmyachkov';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  text.replaceChildren();
  words = [];

  function appendWord(parent, value) {
    const word = document.createElement('span');
    word.className = 'scroll-time-word';
    word.textContent = value;
    words.push(word);
    parent.append(word);
    return word;
  }
  function appendWords(parent, value) {
    for (const part of value.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) parent.append(document.createTextNode(part));
      else appendWord(parent, part);
    }
  }

  const index = message.text.indexOf(duration);
  const before = message.text.slice(0, index);
  let after = message.text.slice(index + duration.length);
  punctuation = /^[,.]/.test(after) ? after[0] : '';
  if (punctuation) after = after.slice(1);
  appendWords(text, before);
  durationNode = appendWord(text, duration + punctuation);
  appendWords(text, after);
  appendWords(link, message.link);
  text.append(link);
  footer.dataset.category = category = message.category;
  lastProgress = -1;
}

function updateTime() {
  // Wall-clock time also advances while a tab is in the background or asleep.
  const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const activeLanguage = window.portfolioLanguage || 'en';
  const duration = formatElapsed(seconds, activeLanguage === 'ru' && seconds >= 120);
  const message = scrollTimeMessage(seconds, () => fastChoice);
  if (message.category !== category || language !== activeLanguage) {
    language = activeLanguage;
    renderMessage(message, duration);
  } else {
    durationNode.textContent = duration + punctuation;
  }
  scheduleReveal();
}

function updateReveal() {
  frame = null;
  const bounds = content.getBoundingClientRect();
  const footerBounds = footer.getBoundingClientRect();
  const distance = Math.max(1, footerBounds.bottom - bounds.top);
  const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / distance));
  if (progress === lastProgress) return;
  lastProgress = progress;
  words.forEach((word, index) => {
    const amount = Math.min(1, Math.max(0, progress * 1.8 - index / Math.max(words.length - 1, 1) * .8));
    const eased = amount * amount * (3 - 2 * amount);
    word.style.opacity = eased;
    word.style.transform = `translateY(${(1 - eased) * 25}px)`;
  });
}

function scheduleReveal() {
  if (footerNear && frame === null) frame = requestAnimationFrame(updateReveal);
}

updateTime();
if (footerRunway && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    footerNear = entries[0].isIntersecting;
    if (footerNear) scheduleReveal();
  }, { rootMargin: '200px 0px' });
  observer.observe(footerRunway);
}
addEventListener('scroll', scheduleReveal, { passive: true });
addEventListener('resize', scheduleReveal, { passive: true });
addEventListener('pageshow', updateTime);
document.addEventListener('portfolio-language-change', updateTime);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateTime(); });
setInterval(updateTime, 1000);
