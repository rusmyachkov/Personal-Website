// ==========================================================================
//  CASES-DATA.JS
//
//  Здесь и только здесь описан список карточек в разделе "Go to Cases".
//  Чтобы ДОБАВИТЬ НОВЫЙ КЕЙС, нужно сделать 2 шага:
//
//  Шаг 1. Добавить новый объект в массив CASES ниже (скопируйте один из
//         существующих объектов как шаблон и поменяйте значения).
//
//  Шаг 2. Если у кейса есть отдельная страница с подробным описанием —
//         добавить в index.html блок вида:
//           <div class="project project__<slug>" id="project__<slug>">
//             ... содержимое кейса (картинки, видео, текст) ...
//           </div>
//         внутрь <section class="projects" id="sectionProjects">,
//         рядом с остальными такими же блоками (project__first,
//         project__dom и т.д. — можно скопировать один из них как образец
//         вёрстки и просто заменить содержимое).
//
//  Всё остальное — карточка в сетке, адрес /cases/<slug>, переключение
//  между кейсами — подключится само, ничего в JS трогать не нужно.
//
//  Поле "slug" — это то, что будет в адресе сайта: /cases/slug
//  Поле "elementId" — id блока с полным описанием кейса в index.html.
//                     Если детальной страницы пока нет (кейс "Soon") —
//                     оставьте elementId: null.
// ==========================================================================

const CASES = [
  {
    slug: 'nda',
    elementId: null,
    comingSoon: true,
    cardModifier: 'project__card_nda',
    cover: { type: 'image', src: 'images/projects/covers/NDA.webp', hover: false },
    title: 'NDA',
    meta: '2023, Soon',
  },
  {
    slug: 'flow-one',
    elementId: null,
    comingSoon: true,
    cardModifier: 'project__card_flow-one',
    cover: { type: 'image', src: 'images/projects/covers/flowone.png', hover: false },
    title: 'Flow-One',
    meta: '2023, Soon',
  },
  {
    slug: 'samoosmotr',
    elementId: 'project__samoosmotr',
    cardModifier: 'project__card_samoosmotr',
    cover: {
      type: 'video',
      poster: 'images/placeholder/SM-SamoosmotrCover.webp',
      src: 'https://www.dropbox.com/s/uz5f1ymajkabull/samoosmotr_compressed.mp4?raw=1',
    },
    title: 'NDA Client',
    meta: 'Product Design, 2022',
  },
  {
    slug: 'first',
    elementId: 'project__first',
    cardModifier: 'project__card_first',
    cover: { type: 'image', src: 'images/projects/covers/first.webp', hover: true },
    title: 'First',
    meta: 'Identity, Website, 2022',
  },
  {
    slug: 'dom',
    elementId: 'project__dom',
    cardModifier: 'project__card_dom',
    cover: {
      type: 'video',
      poster: 'images/placeholder/dom-cover.webp',
      src: 'https://www.dropbox.com/s/vp1lossmt7j7zoe/dom.mp4?raw=1',
    },
    title: 'Moi Servis Home',
    meta: 'Product Design, 2022',
  },
  {
    slug: 'auto',
    elementId: 'project__auto',
    cardModifier: 'project__card_auto',
    cover: {
      type: 'video',
      poster: 'images/placeholder/auto-cover.webp',
      src: 'https://www.dropbox.com/s/p7pkq5vozzj71on/auto.mp4?raw=1',
    },
    title: 'Moi Servis Auto',
    meta: 'Product Design, 2022',
  },
  {
    slug: 'practicum',
    elementId: 'project__practicum',
    cardModifier: 'project__card_practicum',
    cover: { type: 'image', src: 'images/projects/covers/practicum.webp', hover: true },
    title: 'English by Yandex Practicum',
    meta: 'Product Design, 2020-2022',
  },
  {
    slug: 'teko',
    elementId: 'project__teko',
    cardModifier: 'project__card_teko',
    cover: { type: 'image', src: 'images/projects/covers/teko.webp', hover: true },
    title: 'Teko',
    meta: 'Website, 2021',
  },
  {
    slug: 'easymusic',
    elementId: 'project__easymusic',
    cardModifier: 'project__card_easymusic',
    textModifier: 'project__text-easymusic',
    cover: {
      type: 'video',
      poster: 'images/placeholder/easymusic_compressed.webp',
      src: 'https://www.dropbox.com/s/xj8046pbbdzp8ot/easymusic_compressed.mp4?raw=1',
    },
    title: 'Easymusic',
    meta: 'Identity, Website, 2021',
  },
  {
    slug: 'afisha',
    elementId: 'project__afisha',
    cardModifier: 'project__card_afisha',
    textModifier: 'project__text-afisha',
    cover: { type: 'image', src: 'images/projects/covers/afisha.webp', hover: true },
    title: 'Afisha',
    meta: 'Concept, 2019',
  },
];

// --------------------------------------------------------------------------
// Ниже — техническая часть, которую обычно трогать не нужно.
// Она строит HTML-карточки в сетке "Go to Cases" из массива CASES выше,
// в точности повторяя разметку и классы, которые были в старой версии
// сайта — поэтому все стили и анимации карточек продолжают работать.
// --------------------------------------------------------------------------

function renderCaseCard(item) {
  const card = document.createElement('div');
  card.className = 'project__card ' + item.cardModifier;

  let coverHtml;
  if (item.cover.type === 'video') {
    coverHtml =
      '<video class="project__cover lazy" width="100%" autoplay playsinline loop muted ' +
      'poster="' + item.cover.poster + '">' +
      '<source data-src="' + item.cover.src + '" type="video/mp4">' +
      '</video>';
  } else {
    const coverClass = item.cover.hover ? 'project__cover' : 'project__cover_nohover';
    coverHtml = '<img src="' + item.cover.src + '" alt="" class="' + coverClass + '">';
  }

  const textClass = 'project__text' + (item.textModifier ? ' ' + item.textModifier : '');

  card.innerHTML =
    coverHtml +
    '<p class="' + textClass + '">' + item.title + ',<br/>' +
    '<span class="project__text_span">' + item.meta + '</span></p>';

  // Кликабельны только кейсы, у которых уже есть страница с описанием.
  if (item.elementId && !item.comingSoon) {
    card.addEventListener('click', function () {
      openCaseRoute(item.slug);
    });
  }

  return card;
}

function renderCaseCards() {
  const grid = document.getElementById('projects__grid');
  if (!grid) return;
  grid.innerHTML = '';
  CASES.forEach(function (item) {
    grid.appendChild(renderCaseCard(item));
  });
}

// Рендерим карточки сразу же — этот скрипт подключён в конце <body>,
// поэтому #projects__grid уже существует в разметке к этому моменту.
renderCaseCards();
