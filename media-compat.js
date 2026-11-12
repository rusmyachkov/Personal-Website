// Picture elements keep PNG fallbacks. Older browsers also get PNG posters.
try {
  const canvas = document.createElement('canvas');
  const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  if (!supportsWebP) {
    document.querySelectorAll('video[data-poster-fallback]').forEach(video => {
      video.poster = video.dataset.posterFallback;
    });
  }
} catch {
  document.querySelectorAll('video[data-poster-fallback]').forEach(video => {
    video.poster = video.dataset.posterFallback;
  });
}
