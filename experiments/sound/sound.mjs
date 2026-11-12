// Quiet FX v0.4.1, MIT: gentle procedural interface cues.
import { CUES, DEFAULTS, makePatch } from './quietfx/catalog.js';
import { renderPatch, SoundPlayer } from './quietfx/engine.js';

const player = new SoundPlayer();
player.setVolume(.65);
const sounds = new Map();
const lastPlayed = new Map();
let soundEnabled = false;
let awaitingFirstInteraction = true;
let lastScrollAt = -Infinity;

function render(id) {
  if (!sounds.has(id)) {
    if (id === 'intro-gather') {
      const forward = render('intro-dive');
      sounds.set(id, { ...forward, data: Float32Array.from(forward.data).reverse() });
      return sounds.get(id);
    }
    if (id === 'intro-dive') {
      sounds.set(id, renderPatch({
        seed: 27, masterGain: .55,
        layers: [
          { kind: 'tone', waveform: 'sine', frequency: 392, glideTo: 440, glideTime: .065, attack: .012, decay: .16, peak: .06, offset: .015 },
          { kind: 'tone', waveform: 'sine', frequency: 523.25, glideTo: 587.33, glideTime: .065, attack: .004, decay: .16, peak: .075, offset: .065 },
          { kind: 'tone', waveform: 'sine', frequency: 659.25, glideTo: 783.99, glideTime: .07, attack: .004, decay: .2, peak: .06, offset: .115 },
          { kind: 'tone', waveform: 'sine', frequency: 1046.5, attack: .006, decay: .1, peak: .025, offset: .17 },
        ],
      }));
      return sounds.get(id);
    }
    const cue = CUES.find(item => item.id === (id === 'footer-stop' ? 'soft-impact' : id));
    if (!cue) return null;
    const settings = id === 'footer-stop'
      ? { ...DEFAULTS, voice: 'Felt', variant: 'Normal', brightness: 30 }
      : { ...DEFAULTS, voice: 'Soft', variant: 'Light' };
    sounds.set(id, renderPatch(makePatch(cue, settings)));
  }
  return sounds.get(id);
}
function play(id, { gesture = false, cooldown = 0 } = {}) {
  if (!soundEnabled || document.hidden) return;
  const now = performance.now();
  if (now - (lastPlayed.get(id) ?? -Infinity) < cooldown) return;
  lastPlayed.set(id, now);
  const sound = render(id);
  if (!sound) return;
  if (player.context?.state === 'running' && !player.muted) {
    player.play(sound);
  } else if (gesture) {
    player.enable().then(enabled => {
      if (enabled && soundEnabled && !document.hidden) player.play(sound);
    }).catch(() => {});
  }
}

// A quiet, ascending pentatonic palette gives each skill its own note.
const skillNotes = [392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];
function playSkill(index) {
  if (!soundEnabled || document.hidden || player.context?.state !== 'running' || player.muted) return;
  const frequency = skillNotes[index];
  if (!frequency) return;
  const key = `skill-${index}`;
  if (!sounds.has(key)) {
    sounds.set(key, renderPatch({
      seed: index + 1, masterGain: .5,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency, attack: .008, decay: .16, peak: .07 },
        { kind: 'tone', waveform: 'sine', frequency: frequency * 2, attack: .004, decay: .08, peak: .015 },
      ],
    }));
  }
  player.play(sounds.get(key), 0, false, .75);
}
document.addEventListener('portfolio-skill-reveal', event => playSkill(event.detail.index));
document.addEventListener('portfolio-story-change', () => play('card-flip', { cooldown: 180 }));
document.addEventListener('portfolio-footer-arrive', () => play('footer-stop', { cooldown: 1200 }));

const toggle = document.createElement('button');
toggle.type = 'button';
toggle.className = 'sound-toggle';
function updateToggle() {
  toggle.setAttribute('aria-pressed', String(soundEnabled));
  toggle.setAttribute('aria-label', soundEnabled ? (window.portfolioLanguage === 'ru' ? 'Выключить звук' : 'Mute sounds') : (window.portfolioLanguage === 'ru' ? 'Включить звук' : 'Turn on sounds'));
  toggle.innerHTML = soundEnabled
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a5 5 0 0 1 0 6M19 6a9 9 0 0 1 0 12"/></svg><span>${window.portfolioLanguage === 'ru' ? 'Звук включён' : 'Sound on'}</span>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4ZM17 9l4 6m0-6-4 6"/></svg><span>${window.portfolioLanguage === 'ru' ? 'Звук выключен' : 'Sound off'}</span>`;
}
updateToggle();
document.addEventListener('portfolio-language-change', updateToggle);
document.body.append(toggle);
toggle.addEventListener('click', () => {
  awaitingFirstInteraction = false;
  // A blocked audio context needs activation, not an on → off toggle.
  if (soundEnabled && (!player.context || player.context.state !== 'running' || player.muted)) {
    play('toggle-on', { gesture: true });
    return;
  }
  soundEnabled = !soundEnabled;
  if (soundEnabled) play('toggle-on', { gesture: true });
  else player.mute();
  updateToggle();
});

// A gallery transition is signalled by the existing open/close lifecycle.
let galleryOpen = false;
document.addEventListener('works-visibility', () => {
  const open = document.documentElement.classList.contains('works-open');
  if (open && !galleryOpen) play('expand', { gesture: true, cooldown: 250 });
  galleryOpen = open;
  (open ? document.querySelector('.works-dialog') : document.body).append(toggle);
});
document.addEventListener('works-closing', () => play('collapse', { gesture: true, cooldown: 250 }));
document.addEventListener('case-study-opening', () => play('expand', { gesture: true, cooldown: 250 }));
document.addEventListener('case-study-closing', () => play('collapse', { gesture: true, cooldown: 250 }));
document.addEventListener('case-study-visibility', () => {
  const open = document.documentElement.classList.contains('case-study-open');
  (open ? document.querySelector('.case-study-dialog') : document.body).append(toggle);
});
document.addEventListener('click', event => {
  if (event.target.closest('.sound-toggle')) return;
  if (event.defaultPrevented && event.target.closest('.case-mobile-button[data-case-open]')) return;
  if (event.target.closest('.case-mobile-button, .scroll-hint, .socials a, .footer-socials a, .scroll-time a')) {
    play('tap', { gesture: true, cooldown: 120 });
  }
});
// The first ordinary interaction enables sound; an explicit mute stays muted.
function unlockOnInteraction(event) {
  if (event.target.closest?.('.sound-toggle')) return;
  if (event.type === 'pointerdown' && (event.button !== 0 || !event.isPrimary)) return;
  if (awaitingFirstInteraction) {
    awaitingFirstInteraction = false;
    soundEnabled = true;
    updateToggle();
  }
  if (soundEnabled && (!player.context || player.context.state !== 'running' || player.muted)) {
    player.enable().catch(() => {});
  }
}
document.addEventListener('pointerdown', unlockOnInteraction, { passive: true });
document.addEventListener('keydown', unlockOnInteraction);
function noteScroll() { lastScrollAt = performance.now(); }
addEventListener('scroll', noteScroll, { capture: true, passive: true });
addEventListener('wheel', noteScroll, { passive: true });
document.addEventListener('pointerover', event => {
  if (event.pointerType !== 'mouse') return;
  if (performance.now() - lastScrollAt < 250 || player.active.size > 0) return;
  const target = event.target.closest('.column .tile[aria-haspopup="dialog"], .shot-card, .socials a, .footer-socials a, .scroll-hint');
  if (!target || target.contains(event.relatedTarget)) return;
  if (target.closest('.shots-rail.is-dragging')) return;
  play('hover', { cooldown: 180 });
});
const rail = document.querySelector('.shots-rail');
let railStart = null;
rail.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button === 0) railStart = rail.scrollLeft;
});
addEventListener('pointerup', () => {
  if (railStart !== null && Math.abs(rail.scrollLeft - railStart) > 12) play('swipe', { gesture: true, cooldown: 400 });
  railStart = null;
});
document.addEventListener('visibilitychange', () => { if (document.hidden) player.stop(); });

// Play one playful rising flourish as the opening mosaic disperses.
const introRunway = document.querySelector('.intro-runway');
const introStage = document.querySelector('.intro-stage');
let introTop = 0;
let introRange = 1;
function measureIntro() {
  introTop = introRunway.getBoundingClientRect().top + window.scrollY;
  introRange = Math.max(1, introRunway.offsetHeight - introStage.clientHeight);
}
measureIntro();
addEventListener('resize', measureIntro, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(measureIntro).observe(introStage);
document.fonts?.ready.then(measureIntro);
function introProgress() {
  return Math.max(0, Math.min(1, (window.scrollY - introTop) / introRange));
}
let previousIntroProgress = introProgress();
let introSoundArmed = previousIntroProgress < .04;
let introReturnSoundArmed = previousIntroProgress >= .9;
addEventListener('scroll', () => {
  const progress = introProgress();
  if (progress < .01) introSoundArmed = true;
  if (progress >= .9) introReturnSoundArmed = true;
  if (introSoundArmed && progress >= .04 && !galleryOpen) {
    introSoundArmed = false;
    play('intro-dive', { cooldown: 800 });
  }
  if (introReturnSoundArmed && progress <= .78 && progress < previousIntroProgress && !galleryOpen) {
    introReturnSoundArmed = false;
    play('intro-gather', { cooldown: 800 });
  }
  if (progress < .01) introReturnSoundArmed = false;
  previousIntroProgress = progress;
}, { passive: true });
