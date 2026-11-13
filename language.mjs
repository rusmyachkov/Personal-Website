const translations = [];

function bindCopy(element, russian, property = 'textContent') {
  if (!element) return;
  const english = element[property];
  translations.push(isRu => { element[property] = isRu ? russian : english; });
}

function bindLabel(selector, russian) {
  const element = document.querySelector(selector);
  if (!element) return;
  const english = element.getAttribute('aria-label');
  if (english === null) return;
  translations.push(isRu => element.setAttribute('aria-label', isRu ? russian : english));
}

bindCopy(document.querySelector('.intro-copy p'),
  '<span class="muted">Уже 10 лет </span>я занимаюсь дизайном: создаю сайты, приложения, сервисы и бренды. Работаю со стартапами <br class="ru-intro-break" aria-hidden="true">и крупным бизнесом.',
  'innerHTML');
bindCopy(document.querySelector('.portrait-photo'), 'Руслан Мячков у моря', 'alt');
bindCopy(document, 'Руслан Мячков — продуктовый дизайнер', 'title');

const copy = {
  '.portrait-caption div p:first-child': 'Руслан Мячков',
  '.portrait-subtitle': 'Лид продакт дизайнер',
  '.approach-title p': 'Я создаю дизайн, который работает на бизнес.',
  '.approach-inner > p': 'Превращаю запутанные пользовательские сценарии в целостные продукты. Это помогает командам быстрее договариваться, точнее формулировать идеи и выпускать продуманные продукты.',
  '.story-skills h2': 'Навыки',
  '.story-experience h2': 'Опыт',
  '.works-close-label': 'Закрыть',
};
for (const [selector, text] of Object.entries(copy)) bindCopy(document.querySelector(selector), text);

const skills = ['Продуктовый дизайн', 'Продуктовая стратегия', 'Дизайн-системы', 'Дизайн и код',
  'ИИ-продукты', 'Айдентика', 'Креативное руководство', 'Управление дизайном'];
document.querySelectorAll('.skills-list li').forEach((item, i) => bindCopy(item, skills[i]));
const companies = ['Росгосстрах', 'Яндекс Практикум', 'Афиша', 'Artify Agency'];
document.querySelectorAll('.experience-list .company-name').forEach((item, i) => bindCopy(item, companies[i]));

const labels = {
  '.intro-runway': 'Знакомство',
  '.intro-copy': 'Уже 10 лет я занимаюсь дизайном: создаю сайты, приложения, сервисы и бренды. Работаю со стартапами и крупным бизнесом.',
  '.approach': 'Подход',
  '.skills-section': 'Навыки и опыт',
  '.skills-card': 'Навыки и опыт',
  '.story-skills': 'Навыки',
  '.story-experience': 'Опыт',
  '.shots-rail': 'Избранные работы',
  '.scroll-time': 'Время знакомства',
  '.socials': 'Контакты',
  '.footer-socials': 'Контакты',
  '.works-dialog': 'Избранные работы',
  '.scroll-hint': 'Прокрутить к знакомству',
};
for (const [selector, label] of Object.entries(labels)) bindLabel(selector, label);

export function renderLanguage(language) {
  translations.forEach(translate => translate(language === 'ru'));
}

if (window.portfolioLanguage === 'ru') renderLanguage('ru');
