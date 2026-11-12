import { StoryPlayer } from './story-player.mjs';

const card = document.querySelector('#skills-stories');
const slides = [...card.querySelectorAll('[data-story-slide]')];
const fills = [...card.querySelectorAll('.skills-progress i')];
const controls = [...card.querySelectorAll('[data-story-direction]')];
const status = card.querySelector('#story-status');
const player = new StoryPlayer(slides.length);
let visible = false;
let gesture = null;
let frame = null;
let previousTime = null;

function renderSlide(announce = false) {
  slides.forEach((slide, index) => { slide.hidden = index !== player.index; });
  const label = slides[player.index].getAttribute('aria-label');
  card.dataset.story = label.toLowerCase();
  status.textContent = announce ? `${label}, story ${player.index + 1} of ${slides.length}` : '';
  renderProgress();
}

function renderProgress() {
  fills.forEach((fill, index) => {
    const value = index < player.index ? 1 : index === player.index ? player.elapsed / player.duration : 0;
    fill.style.transform = `scaleX(${value})`;
  });
}

function canPlay() { return visible && !document.hidden && !gesture; }

function animate(now) {
  frame = null;
  if (!canPlay()) { previousTime = null; return; }
  if (previousTime !== null && player.tick(now - previousTime)) renderSlide();
  else renderProgress();
  previousTime = now;
  frame = requestAnimationFrame(animate);
}

function syncPlayback() {
  if (!canPlay()) {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
  } else if (frame === null) {
    previousTime = null;
    frame = requestAnimationFrame(animate);
  }
}

function navigate(direction) {
  if (direction === 'previous') player.previous();
  else player.next();
  previousTime = null;
  renderSlide(true);
}

card.addEventListener('pointerdown', event => {
  const control = event.target.closest('[data-story-direction]');
  const link = event.target.closest('.experience-list a');
  if (!event.isPrimary || event.button !== 0 || gesture || (!control && !link)) return;
  gesture = {
    id: event.pointerId, x: event.clientX, y: event.clientY,
    started: performance.now(), control, direction: control?.dataset.storyDirection,
  };
  if (control) control.setPointerCapture(event.pointerId);
  syncPlayback();
});

function finishGesture(event, cancelled = false) {
  if (!gesture || event.pointerId !== gesture.id) return;
  const current = gesture;
  gesture = null;
  const distance = Math.hypot(event.clientX - current.x, event.clientY - current.y);
  if (!cancelled && current.control && performance.now() - current.started < 250 && distance < 12) {
    navigate(current.direction);
  }
  if (current.control?.hasPointerCapture(event.pointerId)) current.control.releasePointerCapture(event.pointerId);
  syncPlayback();
}

window.addEventListener('pointerup', finishGesture);
window.addEventListener('pointercancel', event => finishGesture(event, true));
card.addEventListener('lostpointercapture', event => finishGesture(event, true));
card.addEventListener('contextmenu', event => {
  if (event.target.closest('[data-story-direction]')) event.preventDefault();
});
controls.forEach(control => control.addEventListener('click', event => {
  // Pointer taps are handled on release; keyboard and assistive clicks have detail 0.
  if (event.detail === 0) navigate(control.dataset.storyDirection);
}));
document.addEventListener('visibilitychange', syncPlayback);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .5;
    syncPlayback();
  }, { threshold: [0, .5] });
  observer.observe(card);
} else {
  visible = true;
  syncPlayback();
}
renderSlide();
