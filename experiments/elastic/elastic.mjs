const mosaic = document.querySelector('.mosaic');
const runway = document.querySelector('.intro-runway');
const stage = document.querySelector('.intro-stage');
const tiles = [...mosaic.querySelectorAll('.column .tile')];
const hover = matchMedia('(hover: hover) and (pointer: fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const grow = 1.08;
let active = null;
let changed = [];

for (const tile of tiles) {
  const surface = document.createElement('span');
  surface.className = 'tile-surface';
  surface.style.backgroundColor = getComputedStyle(tile).backgroundColor;
  surface.append(...tile.childNodes);
  tile.append(surface);
  tile.classList.add('has-tilt-surface');
}

function reset() {
  if (active) active.parentElement.style.zIndex = '';
  for (const surface of changed) {
    surface.style.transform = '';
    surface.style.transformOrigin = '';
  }
  changed = [];
  active = null;
}

function setSurface(tile, transform, origin) {
  const surface = tile.querySelector('.tile-surface');
  surface.style.transformOrigin = origin;
  surface.style.transform = transform;
  changed.push(surface);
}

function overlap(a1, a2, b1, b2) {
  return Math.min(a2, b2) - Math.max(a1, b1) > 1;
}

function enter(event) {
  if (!hover.matches || reduced.matches || event.pointerType !== 'mouse' ||
      document.documentElement.classList.contains('works-open')) return;
  const range = Math.max(1, runway.offsetHeight - stage.clientHeight);
  if (-runway.getBoundingClientRect().top / range > .03) return;
  const tile = event.currentTarget;
  if (active === tile) return;
  reset();
  active = tile;
  const rect = tile.getBoundingClientRect();
  const column = Number(tile.parentElement.dataset.col);
  tile.parentElement.style.zIndex = '10';
  setSurface(tile, `scale(${grow})`, 'center');

  for (const other of tiles) {
    if (other === tile) continue;
    const otherRect = other.getBoundingClientRect();
    const otherColumn = Number(other.parentElement.dataset.col);
    if (Math.abs(otherColumn - column) === 1 && overlap(rect.top, rect.bottom, otherRect.top, otherRect.bottom)) {
      const shrink = Math.max(.85, 1 - rect.width * (grow - 1) / 2 / otherRect.width);
      setSurface(other, `scaleX(${shrink})`, otherColumn < column ? 'left center' : 'right center');
    } else if (otherColumn === column && overlap(rect.left, rect.right, otherRect.left, otherRect.right)) {
      const above = otherRect.bottom <= rect.top && rect.top - otherRect.bottom < 20;
      const below = otherRect.top >= rect.bottom && otherRect.top - rect.bottom < 20;
      if (!above && !below) continue;
      const shrink = Math.max(.85, 1 - rect.height * (grow - 1) / 2 / otherRect.height);
      setSurface(other, `scaleY(${shrink})`, above ? 'center top' : 'center bottom');
    }
  }
}

for (const tile of tiles) {
  tile.addEventListener('pointerenter', enter);
  tile.addEventListener('pointerleave', () => { if (active === tile) reset(); });
  tile.addEventListener('pointerdown', reset);
}
addEventListener('scroll', reset, { passive: true });
addEventListener('resize', reset, { passive: true });
document.addEventListener('works-visibility', reset);
hover.addEventListener('change', reset);
reduced.addEventListener('change', reset);
