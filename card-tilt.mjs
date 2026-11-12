// Keep pointer motion on an inner surface so scroll animation can move the tile.
export function attachCardTilt(tiles) {
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active;
  let frame;

  function reset() {
    cancelAnimationFrame(frame);
    if (!active) return;
    active.surface.style.transform = '';
    active.surface.style.willChange = '';
    active.tile.classList.remove('is-tilting');
    active.tile.parentElement.style.zIndex = '';
    active = null;
  }

  function move(event) {
    if (!hover.matches || event.pointerType === 'touch') return;
    const tile = event.currentTarget;
    if (active?.tile !== tile) {
      reset();
      active = { tile, surface: tile.firstElementChild, rect: tile.getBoundingClientRect() };
      active.surface.style.willChange = 'transform';
      tile.classList.add('is-tilting');
      tile.parentElement.style.zIndex = '10';
    }
    const { rect, surface } = active;
    const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
    const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
    const angle = reduced.matches ? 4 : 10;
    const lift = reduced.matches ? 0 : 6;
    const scale = reduced.matches ? 1.03 : 1.05;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      surface.style.transform = `perspective(760px) translateY(${-lift}px) rotateX(${-y * angle}deg) rotateY(${x * angle}deg) scale(${scale})`;
    });
  }

  for (const tile of tiles) {
    const surface = document.createElement('span');
    surface.className = 'tile-surface';
    surface.style.backgroundColor = getComputedStyle(tile).backgroundColor;
    surface.append(...tile.childNodes);
    tile.append(surface);
    tile.classList.add('has-tilt-surface');
    tile.addEventListener('pointerenter', move);
    tile.addEventListener('pointermove', move);
    tile.addEventListener('pointerleave', reset);
    tile.addEventListener('pointercancel', reset);
    tile.addEventListener('pointerdown', reset);
  }
  addEventListener('scroll', reset, { passive: true });
  addEventListener('resize', reset, { passive: true });
  document.addEventListener('works-visibility', reset);
  hover.addEventListener('change', reset);
  reduced.addEventListener('change', reset);
}
