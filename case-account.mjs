const captions = {
  en: [
  [
    "Rosgosstrakh’s customer account.",
    "I updated the customer account and worked out how customers would manage their policies. Customers can now see what their policy covers, update their details, and get help from the same account."
  ],
  [
    "Three ways to sign in.",
    "I brought three ways to sign in onto one screen: phone number, VTB ID, and Gosuslugi."
  ],
  [
    "A home screen for everyday tasks.",
    "I placed active policies and renewal dates on the home screen, alongside tasks that need attention, such as confirming an email address."
  ],
  [
    "The policy is also a place to act.",
    "I brought the main actions onto the motor policy screen. Customers can download documents, get help, update their policy, or add a driver from there."
  ],
  [
    "Coverage and payments at a glance.",
    "I grouped the insured amount, covered risks, and next payment on the policy page. Policy details and documents are available further down."
  ],
  [
    "From incident to claim status.",
    "I made the claim form ask different questions depending on what happened. After submission, customers can check the claim status on the home screen."
  ],
  [
    "A history customers can return to.",
    "I put open requests and past conversations on one screen, with a status on each request so customers can see where it stands."
  ]
],
  ru: [
  [
    "Личный кабинет Росгосстраха.",
    "Я обновил личный кабинет и продумал, как в нём работать с полисами. В одном кабинете клиент может проверить покрытие, изменить данные полиса и обратиться за помощью."
  ],
  [
    "Новый вход в личный кабинет.",
    "Я обновил экран входа и собрал на нём три способа войти. Клиент может использовать номер телефона, ВТБ ID или Госуслуги."
  ],
  [
    "Главная для повседневных задач.",
    "Я вынес на главный экран активные полисы и сроки продления. Рядом разместил задачи, которые требуют внимания, например подтверждение почты."
  ],
  [
    "Действия прямо в полисе.",
    "Я собрал основные действия на экране ОСАГО. С него можно скачать документы, обратиться за помощью, добавить водителя или изменить данные полиса."
  ],
  [
    "Покрытие и платежи под рукой.",
    "Я сгруппировал на странице полиса страховую сумму, покрываемые риски и ближайший платёж. Ниже разместил условия договора и документы."
  ],
  [
    "От происшествия до статуса заявления.",
    "Я продумал форму заявления так, чтобы вопросы менялись в зависимости от того, что случилось. После отправки клиент может проверить статус заявления на главном экране."
  ],
  [
    "История обращений.",
    "Я собрал открытые обращения и завершённые диалоги на одном экране. У каждого обращения показал статус, чтобы клиент мог понять, на каком этапе оно находится."
  ]
],
};

const asset = name => `assets/case-account/${name}.webp`;
const travelPoster = 'assets/optimized/poster-travel.webp';
const travelVideo = 'assets/travel-card-figma-export.mp4?v=lossless-1';
const media = (name, height, width = 1090) => ({ name, width, height });
const phone = name => ({
  ...media(name, 1042, 540), background: 'grey', art: [73.916, 96, 392.167, 850],
});
const photograph = (name, art, dimmed = false, background) => ({
  ...media(name, 1042, 540), art, dimmed, background,
});

const rows = [
  [media('insurance-products', 852.574)],
  [phone('sign-in'), phone('biometric-sign-in')],
  [photograph('family', [-54, .422, 695, 1042], true), phone('home-mobile')],
  [media('mortgage-policy', 935.583)],
  [media('motor-policy-cover', 1042)],
  [{ ...media('navigation', 535.821), background: 'grey', art: [96, 192, 898, 247.821], navigation: true }],
  [phone('policy-actions'), photograph('car', [-369, -.395, 1798, 1200], true, 'light')],
  [media('home-desktop', 681.25)],
  [photograph('parent-and-child', [0, .023, 695, 1042], false, 'light'), phone('policy-details-mobile')],
  [media('coverage-and-payment', 984.028)],
  [phone('notifications'), phone('policy-list')],
  [media('room-inspection', 722.652)],
  [{ ...media('travel-assistance', 1139.297), video: true }],
  [media('design-system', 716.262)],
  [phone('claim-help'), phone('claim-status-mobile')],
  [media('claim-status-desktop', 681.25)],
  [phone('claim-form'), phone('property-damage')],
  [{ ...media('pet-insurance', 1042), background: 'grey', art: [110.844, 96, 868.312, 850] }],
  [phone('service-map'), phone('coverage-mobile')],
  [{ ...media('support-illustration', 525.77), background: 'grey', art: [25.93, 0, 1090, 407.516] }],
  [media('help-centre', 893.194)],
  [phone('account-profile'), phone('account-delete')],
];
const captionRows = [0, 1, 2, 4, 9, 14, 20];

export function accountStudyImages() {
  return rows.flatMap(cards => cards.map(card => card.video ? travelPoster : asset(card.name)));
}

function artPosition(card) {
  if (!card.art) return '';
  const [x, y, width, height] = card.art;
  return ` style="--art-x:${x / card.width * 100}%;--art-y:${y / card.height * 100}%;--art-width:${width / card.width * 100}%;--art-height:${height / card.height * 100}%"`;
}

function artwork(card, eager) {
  if (card.video) {
    return `<span class="account-art"><video muted loop playsinline disablepictureinpicture disableremoteplayback preload="none" poster="${travelPoster}" data-src="${travelVideo}" data-reduced-motion="poster" aria-hidden="true"></video></span>`;
  }
  return `<span class="account-art${card.dimmed ? ' account-art--dimmed' : ''}"${artPosition(card)}><img src="${asset(card.name)}" alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" draggable="false" nopin="nopin"></span>`;
}

function cardMarkup(card, hero, closeLabel) {
  const classes = ['study-media', 'account-card'];
  if (hero) classes.push('study-hero');
  if (card.background) classes.push(`account-card--${card.background}`);
  if (card.navigation) classes.push('account-card--navigation');
  const attributes = `class="${classes.join(' ')}" style="--account-aspect:${card.width} / ${card.height}"`;
  const art = artwork(card, hero);
  return hero
    ? `<button type="button" ${attributes} aria-label="${closeLabel}">${art}</button>`
    : `<div ${attributes}>${art}</div>`;
}

export function accountStudyContent(language) {
  const copy = captions[language] || captions.en;
  const closeLabel = language === 'ru' ? 'Закрыть кейс личного кабинета' : 'Close case: Rosgosstrakh’s customer account';
  return rows.map((cards, index) => {
    const media = cards.map(card => cardMarkup(card, index === 0, closeLabel)).join('');
    const captionIndex = captionRows.indexOf(index);
    const caption = captionIndex < 0 ? '' : `<p><span class="muted">${copy[captionIndex][0]}</span> ${copy[captionIndex][1]}</p>`;
    const rowClass = cards[0].name === 'account-profile' ? ' account-row--profile' : '';
    return `<section class="study-row account-row${rowClass}">
      <div class="account-row-media${cards.length === 2 ? ' account-row-media--pair' : ''}">${media}</div>
      <div class="study-copy study-desktop-copy">${caption}</div>
    </section>${caption ? `<div class="study-copy study-mobile-copy">${caption}</div>` : ''}`;
  }).join('');
}
