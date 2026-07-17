// ==========================================================================
//  ROUTER.JS
//
//  Простой роутинг без библиотек, на основе History API браузера.
//  Задача: каждый раздел сайта открывается по своему адресу (/works,
//  /notes, /photos, /about, /contacts, /cases, /cases/<slug>), но
//  переключение между ними происходит БЕЗ перезагрузки страницы —
//  так же, как это было устроено и раньше, просто теперь ещё и
//  меняется URL в адресной строке.
//
//  Как это работает, по шагам:
//
//  1. Пользователь кликает по кнопке навигации. Вместо старого
//     showBlock('sectionWorks') кнопка теперь вызывает navigate(['works']).
//
//  2. navigate() кладёт новый адрес в адресную строку с помощью
//     history.pushState (это не перезагружает страницу) и сразу вызывает
//     renderRoute() — функцию, которая смотрит на текущий адрес и
//     показывает нужный раздел, используя уже существующие функции
//     showBlock / showProject / openContacts и т.д. из index.js.
//
//  3. Когда пользователь нажимает "Назад"/"Вперёд" в браузере, срабатывает
//     событие popstate. Мы на него подписаны и просто заново вызываем
//     renderRoute() — она прочитает уже изменённый браузером адрес.
//
//  4. При самой первой загрузке страницы тоже вызывается renderRoute(),
//     чтобы сразу открыть тот раздел, который указан в адресной строке
//     (это и называется "прямой доступ по ссылке").
// ==========================================================================

// Сайт сейчас размещён на GitHub Pages по адресу
// https://<username>.github.io/Personal-Website/ — то есть не в корне
// домена, а в подпапке "/Personal-Website". Поэтому все адреса вида
// /works на самом деле должны быть /Personal-Website/works.
//
// Если в будущем сайт переедет на свой домен (например myachkov.ru) —
// достаточно поменять эту константу на '' (пустую строку), и весь роутинг
// продолжит работать без других изменений.
const BASE_PATH = '/Personal-Website';

// "/Personal-Website/cases/dom" -> ["cases", "dom"]
// "/Personal-Website/works"     -> ["works"]
// "/Personal-Website/" (или "/Personal-Website") -> []
function parsePath(pathname) {
  let path = pathname;
  if (BASE_PATH && path.indexOf(BASE_PATH) === 0) {
    path = path.slice(BASE_PATH.length);
  }
  path = path.replace(/^\/+|\/+$/g, '');
  return path.length ? path.split('/') : [];
}

// ["cases", "dom"] -> "/Personal-Website/cases/dom"
function buildPath(parts) {
  const clean = parts.filter(Boolean).join('/');
  return BASE_PATH + (clean ? '/' + clean : '/');
}

// Главная функция для перехода между разделами.
// Пример использования: navigate(['cases', 'dom'])
function navigate(parts) {
  const path = buildPath(parts);
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  renderRoute();
}

// Показывает нужный раздел исходя из текущего адреса в браузере.
function renderRoute() {
  const parts = parsePath(window.location.pathname);

  // "/" — главная страница
  if (parts.length === 0) {
    ensureContactsClosed();
    showBlock('sectionHome');
    return;
  }

  if (parts[0] === 'works') {
    ensureContactsClosed();
    showBlock('sectionWorks');
    ensureCasesClosed();
    return;
  }

  if (parts[0] === 'notes') {
    ensureContactsClosed();
    showBlock('sectionNotes');
    return;
  }

  if (parts[0] === 'photos') {
    ensureContactsClosed();
    showBlock('sectionPhotos');
    return;
  }

  if (parts[0] === 'about') {
    ensureContactsClosed();
    showBlock('sectionAbout');
    return;
  }

  if (parts[0] === 'contacts') {
    if (titleName.textContent !== 'instagram') {
      openContacts();
    }
    return;
  }

  // "/cases" — сетка кейсов, "/cases/<slug>" — конкретный кейс
  if (parts[0] === 'cases') {
    ensureContactsClosed();
    showBlock('sectionWorks');
    ensureCasesOpen();

    const slug = parts[1];
    if (slug) {
      const found = CASES.find(function (c) {
        return c.slug === slug && c.elementId;
      });
      if (found) {
        showProject(found.elementId);
      } else {
        // такого кейса нет — остаёмся на сетке кейсов, но чистим адрес
        window.history.replaceState({}, '', buildPath(['cases']));
      }
    }
    return;
  }

  // Неизвестный адрес — отправляем на главную и поправляем URL
  window.history.replaceState({}, '', buildPath([]));
  ensureContactsClosed();
  showBlock('sectionHome');
}

// Кнопка "Contacts" внизу экрана — открыть/закрыть контакты через адрес.
function toggleContactsRoute() {
  if (titleName.textContent === 'instagram') {
    navigate([]);
  } else {
    navigate(['contacts']);
  }
}

// Кнопка "Go to Cases →" / "← Go To Shots".
function toggleCasesRoute() {
  if (sectionProjects.style.display === 'flex') {
    navigate(['works']);
  } else {
    navigate(['cases']);
  }
}

// Клик по карточке кейса (вызывается из cases-data.js)
function openCaseRoute(slug) {
  navigate(['cases', slug]);
}

// Кнопка "Close" внутри открытого кейса — назад к сетке кейсов.
function closeCaseRoute() {
  navigate(['cases']);
}

window.addEventListener('popstate', renderRoute);
document.addEventListener('DOMContentLoaded', renderRoute);
