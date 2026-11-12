// Warm optional images after the eager scroll media has loaded.
export function preloadGallery(worksRows, caseCovers, caseStudyImages) {
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;

  const responsive = 'assets/optimized/268e2-768.webp 768w, assets/optimized/268e2-1536.webp 1536w, assets/optimized/268e2-3072.webp 3072w, assets/optimized/268e2.webp 4096w';
  const sizes = '(max-width: 700px) calc(100vw - 20px), calc(50vw - 15px)';
  const seen = new Set();
  const gallery = worksRows.flatMap(row => row.cards).map(work => {
    const src = work.video ? 'assets/optimized/' + work.poster + '.webp' : work.source || 'assets/optimized/' + work.id + '.webp';
    return { src, responsive: !!work.responsive };
  });
  const queue = [
    ...caseCovers.map(src => ({ src })),
    ...gallery,
    ...caseStudyImages.map(src => ({ src })),
  ].filter(item => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
  let active = 0, timer = 0, started = false;
  let lastScroll = 0;
  const pending = new Set();
  function schedule(delay = 200) {
    if (timer || !queue.length) return;
    timer = window.setTimeout(() => {
      timer = 0;
      if ('requestIdleCallback' in window) window.requestIdleCallback(pump, { timeout: 2500 });
      else pump();
    }, delay);
  }
  function pump() {
    if (!started || document.hidden || document.documentElement.classList.contains('works-open')) return;
    const wait = 500 - (performance.now() - lastScroll);
    if (wait > 0) {
      schedule(wait);
      return;
    }
    while (active < 2 && queue.length) {
      const item = queue.shift();
      const image = new Image();
      pending.add(image);
      active++;
      image.fetchPriority = 'low';
      image.decoding = 'async';
      image.onload = image.onerror = () => {
        image.onload = image.onerror = null;
        pending.delete(image);
        active--;
        schedule();
      };
      if (item.responsive) { image.sizes = sizes; image.srcset = responsive; }
      image.src = item.src;
    }
  }
  const begin = () => { started = true; schedule(); };
  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin, { once: true });
  window.addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
  document.addEventListener('works-visibility', () => { if (!document.documentElement.classList.contains('works-open')) schedule(); });
}
