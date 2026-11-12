const easing = 'cubic-bezier(.23, 1, .32, 1)';

export function fadeGallery(scroller, entering, duration) {
  return scroller.animate(
    [{ opacity: entering ? 0 : 1 }, { opacity: entering ? 1 : 0 }],
    { duration, easing, fill: 'both' },
  );
}

export function isCardVisible(card) {
  if (!card) return false;
  const rect = card.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0
    && rect.bottom > 0 && rect.top < innerHeight
    && rect.right > 0 && rect.left < innerWidth;
}

function bounds(rect) {
  return { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` };
}

function placement(card, cardRect, width, height) {
  const media = card.querySelector('img, video');
  const rect = media.getBoundingClientRect();
  const style = getComputedStyle(media);
  const fit = style.objectFit === 'contain' ? Math.min : Math.max;
  const scale = fit(rect.width / width, rect.height / height);
  const x = rect.left - cardRect.left + (rect.width - width * scale) / 2;
  const y = rect.top - cardRect.top + (rect.height - height * scale) / 2;
  const transform = style.transform;
  const flipped = transform !== 'none' && new DOMMatrix(transform).a < 0;
  return flipped
    ? `matrix(${-scale}, 0, 0, ${scale}, ${x + width * scale}, ${y})`
    : `matrix(${scale}, 0, 0, ${scale}, ${x}, ${y})`;
}

function background(card) {
  return getComputedStyle(card.querySelector('.tile-surface') ?? card).backgroundColor;
}

// Capture the currently visible frame so a playing video never turns black
// while the full-size gallery video is loading.
export function flyCard(container, from, to, duration) {
  const media = from.querySelector('img, video');
  const width = media.naturalWidth || media.videoWidth;
  const height = media.naturalHeight || media.videoHeight;
  if (!width || !height) return null;
  const bitmap = document.createElement('canvas');
  bitmap.width = width;
  bitmap.height = height;
  const context = bitmap.getContext('2d');
  if (!context) return null;
  try {
    context.drawImage(media, 0, 0, width, height);
  } catch {
    return null;
  }
  bitmap.style.width = width + 'px';
  bitmap.style.height = height + 'px';
  if (from.matches('.phone-mockup, .shot-card-dimmed, .works-card-dimmed')) {
    bitmap.style.filter = 'brightness(.9)';
  }
  const layer = document.createElement('div');
  layer.className = 'works-flight';
  layer.setAttribute('aria-hidden', 'true');
  layer.append(bitmap);
  container.append(layer);
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  const options = { duration, easing, fill: 'both' };
  const animations = [
    layer.animate([
      { ...bounds(fromRect), backgroundColor: background(from) },
      { ...bounds(toRect), backgroundColor: background(to) },
    ], options),
    bitmap.animate([
      { transform: placement(from, fromRect, width, height) },
      { transform: placement(to, toRect, width, height) },
    ], options),
  ];
  return { layer, animations };
}
