// Layout shared by the native, Lenis and GSAP versions. Values come from
// Figma's First Screen desktop/mobile components and responsive examples.
export function measureScene({ stage, intro, mosaic, portraitSlot }) {
  const w = stage.clientWidth;
  const mobile = w <= 700;
  const styles = getComputedStyle(stage);
  const inset = parseFloat(styles.getPropertyValue('--hero-inset'));
  const gap = parseFloat(styles.getPropertyValue('--hero-gap'));
  const minPhotoHeight = mobile ? 160 : 248;
  const textHeight = intro.offsetHeight;
  stage.style.minHeight = `${inset * 2 + textHeight + gap * 2 + 20 + minPhotoHeight}px`;
  const h = stage.clientHeight;
  const col = mobile ? Math.min(226, w * .48) : w * 226 / 1440;
  stage.style.setProperty('--col-width', `${col}px`);
  stage.style.setProperty('--col-gap', '10px');
  intro.style.top = `${inset}px`;
  const startW = col;
  const startH = portraitSlot.offsetHeight;
  const startX = (w - startW) / 2;
  const startY = mosaic.offsetTop + portraitSlot.offsetTop;
  const endW = Math.min(640, w - (mobile ? 20 : inset * 2));
  const endX = (w - endW) / 2;
  const endY = inset + textHeight + gap;
  const endH = h - endY - inset - gap - 20;
  return { w, h, mobile, col, startW, startH, startX, startY, endW, endX, endY, endH,
    socialY: endY + endH + gap,
    caption: mobile
      ? { fontSize: 18, lineHeight: '22px', letterSpacing: '-0.2px', bottom: 24, left: 24, right: 24, gap: 12 }
      : { fontSize: 36, lineHeight: '40px', letterSpacing: '-1.1px', bottom: 40, left: 40, right: 40, gap: 16 },
    logoSize: mobile ? 32 : 72 };
}

export function wrapIntroWords(paragraph) {
  for (const node of [...paragraph.childNodes]) {
    const text = node.nodeType === Node.TEXT_NODE ? node : node.firstChild;
    if (text?.nodeType !== Node.TEXT_NODE) continue;
    const fragment = document.createDocumentFragment();
    for (const part of text.textContent.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        fragment.append(part);
      } else {
        const word = document.createElement('span');
        word.className = 'reveal-word';
        word.textContent = part;
        fragment.append(word);
      }
    }
    text.replaceWith(fragment);
  }
  return [...paragraph.querySelectorAll('.reveal-word')];
}
