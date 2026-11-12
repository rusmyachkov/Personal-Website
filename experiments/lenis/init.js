// A separate experiment: smooth wheel and touch scrolling while preserving
// native interaction inside the story carousel.
if (window.Lenis) {
  window.portfolioLenis = new window.Lenis({
    autoRaf: true,
    smoothWheel: true,
    syncTouch: true,
    syncTouchLerp: 0.1,
    lerp: 0.12,
    anchors: true,
    prevent: node => node.id === 'skills-stories',
  });
}
