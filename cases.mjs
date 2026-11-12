import { openCaseStudy } from './case-study.mjs?v=13';

const BEHANCE_PLACEHOLDER = 'https://www.behance.net/';

const cases = [
  {
    id: 'account', study: true, title: 'Rosgosstrakh’s customer account.',
    description: 'I updated the account so customers can check coverage, manage policies, and get help in one place.',
    date: 'From 2024 to 2026', action: 'View case study',
    covers: { desktop: 'assets/case-account/cover-desktop.webp', mobile: 'assets/case-account/cover-mobile.webp' },
  },
  {
    id: 'inspection', study: true, title: 'Rosgosstrakh’s vehicle self-inspection.',
    description: 'I worked out how drivers could photograph damage after an accident and send the photos through the app.',
    date: 'From 2022 to 2023', desktop: 'd45db', mobile: '5021c', action: 'View case study',
  },
  {
    id: 'home', href: 'https://www.behance.net/gallery/160957293/My_Service-Home', title: 'My Service Dom',
    description: 'helps to deal with household issues: change or repair bathroom facilities and electricity, schedule annual control of utility systems throughout, control the repair works and order cleaning services.',
    date: 'From 2021 to 2022', desktop: '4ee14', mobile: '79bf6', action: 'View on Behance',
  },
  {
    id: 'auto', href: 'https://www.behance.net/gallery/161122283/My_Service-Auto', title: 'My Service Auto',
    description: 'takes care of a car or a motorcycle: technical or legal consultations, repair works maintenance, evacuation, seasonal service, assistance with a car sale or purchase.',
    date: 'From 2021 to 2022', desktop: '0de24', mobile: '09d7a', action: 'View on Behance',
  },
  {
    id: 'med', href: 'https://www.behance.net/gallery/160934969/My_Service-Med', title: 'My Service Med',
    description: 'takes care of all medical requests: a clinic search, making doctor’s appointments, online-consultations, keeping general medical records.',
    date: 'From 2021 to 2022', desktop: 'eb0dc', mobile: 'dd8c9', action: 'View on Behance',
  },
];

const russianCopy = {
  account: ['Личный кабинет Росгосстраха.', 'Я обновил личный кабинет. В нём клиенты могут проверить покрытие, управлять полисами и обратиться за помощью.'],
  inspection: ['Самоосмотр в Росгосстрахе.', 'Я продумал, как водитель сам фотографирует повреждения после ДТП и отправляет снимки через приложение.'],
  home: ['Мой сервис Дом', 'помогает решать бытовые вопросы: ремонтировать сантехнику и электрику, следить за состоянием инженерных систем, контролировать ремонт и заказывать уборку.'],
  auto: ['Мой сервис Авто', 'помогает заботиться об автомобиле или мотоцикле: консультации, ремонт, обслуживание, эвакуация, сезонный сервис и помощь при покупке или продаже.'],
  med: ['Мой сервис Медицина', 'помогает решать медицинские вопросы: найти клинику, записаться к врачу, получить онлайн-консультацию и хранить медицинские документы.'],
};
const russianDates = { account: 'С 2024 по 2026', inspection: 'С 2022 по 2023' };

function caseCopy(item, isRu) {
  if (!isRu) return item;
  const [title, description] = russianCopy[item.id];
  return {
    title, description,
    date: russianDates[item.id] || 'С 2021 по 2022',
    action: item.study ? 'Смотреть' : 'Смотреть на Behance',
  };
}

function link(label, href = BEHANCE_PLACEHOLDER) {
  const anchor = document.createElement('a');
  anchor.className = 'case-link';
  anchor.href = href;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.textContent = label;
  return anchor;
}

function description() {
  const paragraph = document.createElement('p');
  const title = document.createElement('span');
  title.className = 'case-title';
  paragraph.append(title, document.createTextNode(''));
  return paragraph;
}

function updateDescription(paragraph, copy) {
  paragraph.firstElementChild.textContent = copy.title;
  paragraph.lastChild.data = ` ${copy.description}`;
}

const cover = (item, viewport) => item.covers?.[viewport] || `assets/cases/${item[viewport]}.webp`;
const desktopCases = ['account', 'inspection', 'home', 'med', 'auto'].map(id => cases.find(item => item.id === id));

export function caseCoverImages(mobile) {
  const viewport = mobile ? 'mobile' : 'desktop';
  return desktopCases.map(item => cover(item, viewport));
}

function image(item, viewport) {
  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.src = cover(item, viewport);
  img.draggable = false;
  img.setAttribute('nopin', 'nopin');
  return img;
}

function addMouseDrag(rail) {
  let drag = null;
  let suppressClick = false;
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, left: rail.scrollLeft, moved: false };
  });
  window.addEventListener('pointermove', event => {
    if (!drag || event.pointerType !== 'mouse') return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 6) return;
    drag.moved = true;
    rail.classList.add('is-dragging');
    rail.scrollLeft = drag.left - distance;
    event.preventDefault();
  });
  const end = () => {
    if (!drag) return;
    suppressClick = drag.moved;
    drag = null;
    rail.classList.remove('is-dragging');
    if (suppressClick) setTimeout(() => { suppressClick = false; }, 0);
  };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  rail.addEventListener('click', event => {
    if (!suppressClick || event.detail === 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }, true);
}

export function mountCases(section, onChange = () => {}) {
  if (!section) return;
  const tabs = section.querySelector('.shots-tabs');
  const shots = section.querySelector('.shots-rail');
  if (!tabs || !shots) return;
  tabs.setAttribute('role', 'tablist');
  tabs.innerHTML = '<button type="button" role="tab" id="shots-tab" aria-controls="shots-panel" aria-selected="true"></button><button type="button" role="tab" id="cases-tab" aria-controls="cases-panel" aria-selected="false" tabindex="-1"></button>';
  const [shotsTab, casesTab] = tabs.querySelectorAll('button');
  shots.id = 'shots-panel';
  shots.setAttribute('role', 'tabpanel');
  shots.setAttribute('aria-labelledby', 'shots-tab');

  const panel = document.createElement('div');
  panel.className = 'cases-panel';
  panel.id = 'cases-panel';
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', 'cases-tab');
  panel.tabIndex = 0;
  panel.hidden = true;
  const desktop = document.createElement('div');
  desktop.className = 'cases-desktop-rail';
  desktop.setAttribute('role', 'region');
  desktop.tabIndex = 0;
  const desktopCards = [];
  for (const item of desktopCases) {
    const article = document.createElement('article');
    article.className = 'case-desktop';
    const copy = document.createElement('div');
    copy.className = 'case-desktop-copy';
    const top = document.createElement('div');
    const paragraph = description();
    const date = document.createElement('p');
    date.className = 'case-date';
    top.append(paragraph, date);
    const trigger = document.createElement(item.study ? 'button' : 'a');
    const action = item.study ? document.createElement('button') : link('', item.href);
    if (item.study) {
      trigger.type = 'button';
      trigger.className = 'case-desktop-trigger';
      trigger.setAttribute('aria-haspopup', 'dialog');
      action.type = 'button';
      action.className = 'case-link';
      action.addEventListener('click', () => openCaseStudy(action, article, desktop, item.id));
      trigger.addEventListener('click', () => openCaseStudy(trigger, article, desktop, item.id));
    } else {
      trigger.className = 'case-desktop-image-link';
      trigger.href = item.href;
      trigger.target = '_blank';
      trigger.rel = 'noopener noreferrer';
    }
    trigger.append(image(item, 'desktop'));
    copy.append(top, action);
    article.append(trigger, copy);
    desktop.append(article);
    desktopCards.push({ item, paragraph, date, trigger, action });
  }
  addMouseDrag(desktop);

  const mobile = document.createElement('div');
  mobile.className = 'cases-mobile';
  const date = document.createElement('p');
  date.className = 'case-date';
  const rail = document.createElement('div');
  rail.className = 'cases-mobile-rail';
  rail.setAttribute('role', 'region');
  const copy = document.createElement('div');
  copy.className = 'case-mobile-copy';
  const cards = [];
  let selectedIndex = 0;
  let tappedCase = null;
  for (const [index, item] of cases.entries()) {
    const wrapper = document.createElement('div');
    wrapper.className = 'case-mobile-item';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'case-mobile-button';
    button.append(image(item, 'mobile'));
    const more = item.study ? document.createElement('button') : link('', item.href);
    if (item.study) {
      more.type = 'button';
      more.className = 'case-link';
      button.dataset.caseOpen = 'true';
      button.setAttribute('aria-haspopup', 'dialog');
      more.addEventListener('click', () => openCaseStudy(more, wrapper, rail, item.id));
    }
    wrapper.append(button, more);
    const paragraph = description();
    rail.append(wrapper);
    copy.append(paragraph);
    cards.push({ item, wrapper, button, more, paragraph });
    button.addEventListener('click', event => {
      if (item.study && wrapper.classList.contains('is-active') && (tappedCase === item.id || event.detail === 0)) {
        // Let the opening cue play without also triggering the selection tap.
        event.preventDefault();
        openCaseStudy(button, wrapper, rail, item.id);
      } else {
        tappedCase = item.id;
        selectCase(index, true);
      }
    });
  }
  function updateSelectionLabels(isRu) {
    date.textContent = caseCopy(cases[selectedIndex], isRu).date;
    cards.forEach(({ item, button }, index) => {
      const canOpen = index === selectedIndex && item.study && tappedCase === item.id;
      const action = isRu ? (canOpen ? 'Открыть' : 'Выбрать') : (canOpen ? 'Open' : 'Select');
      button.setAttribute('aria-label', `${action} ${caseCopy(item, isRu).title}`);
    });
  }

  function translateCases() {
    const isRu = window.portfolioLanguage === 'ru';
    tabs.setAttribute('aria-label', isRu ? 'Разделы работ' : 'Work categories');
    shotsTab.textContent = isRu ? 'Работы' : 'Shots';
    casesTab.textContent = isRu ? 'Кейсы' : 'Cases';
    desktop.setAttribute('aria-label', casesTab.textContent);
    rail.setAttribute('aria-label', isRu ? 'Выберите кейс' : 'Choose a case');
    for (const entry of desktopCards) {
      const copy = caseCopy(entry.item, isRu);
      updateDescription(entry.paragraph, copy);
      entry.date.textContent = copy.date;
      entry.action.textContent = copy.action;
      const label = entry.item.study
        ? `${isRu ? 'Открыть' : 'Open'} ${copy.title}`
        : isRu ? `Смотреть ${copy.title} на Behance` : `View ${copy.title} on Behance`;
      entry.trigger.setAttribute('aria-label', label);
    }
    for (const { item, more, paragraph } of cards) {
      const copy = caseCopy(item, isRu);
      updateDescription(paragraph, copy);
      more.textContent = isRu ? 'Подробнее' : 'More';
      more.setAttribute('aria-label', isRu ? `Подробнее: ${copy.title}` : `More about ${copy.title}`);
    }
    updateSelectionLabels(isRu);
  }

  function selectCase(index, reveal = false) {
    selectedIndex = index;
    cards.forEach(({ wrapper, button, paragraph }, i) => {
      const selected = i === index;
      wrapper.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
      paragraph.classList.toggle('is-active', selected);
      paragraph.setAttribute('aria-hidden', String(!selected));
    });
    updateSelectionLabels(window.portfolioLanguage === 'ru');
    if (reveal) requestAnimationFrame(() => {
      const chosen = cards[index].wrapper.getBoundingClientRect();
      const bounds = rail.getBoundingClientRect();
      const delta = chosen.right > bounds.right ? chosen.right - bounds.right : chosen.left < bounds.left ? chosen.left - bounds.left : 0;
      if (delta) rail.scrollBy({ left: delta, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  }
  translateCases();
  document.addEventListener('portfolio-language-change', translateCases);
  selectCase(0);
  mobile.append(date, rail, copy);
  panel.append(desktop, mobile);
  section.append(panel);
  if ('ResizeObserver' in window) {
    new ResizeObserver(entries => {
      const height = entries[0].contentRect.height;
      if (height) rail.style.setProperty('--case-rail-height', `${height}px`);
    }).observe(rail);
  }

  function setTab(tab) {
    const showCases = tab === casesTab;
    shots.hidden = showCases;
    panel.hidden = !showCases;
    for (const button of [shotsTab, casesTab]) {
      const active = button === tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    }
    onChange(showCases);
  }
  shotsTab.addEventListener('click', () => setTab(shotsTab));
  casesTab.addEventListener('click', () => setTab(casesTab));
  tabs.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? shotsTab : event.key === 'End' ? casesTab : document.activeElement === shotsTab ? casesTab : shotsTab;
    setTab(next);
    next.focus();
  });
  return panel;
}
