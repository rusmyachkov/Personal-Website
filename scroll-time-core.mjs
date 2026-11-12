export function formatElapsed(seconds, accusative = false) {
  const total = Math.max(0, Math.floor(seconds));
  if (globalThis.window?.portfolioLanguage === 'ru') {
    const form = (n, one, few, many) => { const d=n%10, teen=n%100; return teen>=11 && teen<=14 ? many : d===1 ? one : d>=2 && d<=4 ? few : many; };
    const minutes=Math.floor(total/60), remaining=total%60;
    const parts=[]; if(minutes)parts.push(`${minutes} ${form(minutes,accusative ? 'минуту' : 'минута','минуты','минут')}`);
    if(remaining || !minutes)parts.push(`${remaining} ${form(remaining,accusative ? 'секунду' : 'секунда','секунды','секунд')}`);
    return parts.join(' и ');
  }
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  const amount = (value, unit) => `${value} ${unit}${value === 1 ? '' : 's'}`;
  if (!minutes) return amount(remainder, 'second');
  if (!remainder) return amount(minutes, 'minute');
  return `${amount(minutes, 'minute')} and ${amount(remainder, 'second')}`;
}

export function scrollTimeMessage(seconds, random = Math.random) {
  const time = formatElapsed(seconds, globalThis.window?.portfolioLanguage === 'ru' && seconds >= 120);
  if (globalThis.window?.portfolioLanguage === 'ru') {
    if (seconds < 30) return random() < .5
      ? { category:'fast', text:`Всего ${time} — и мы уже в самом конце. Мне нравится, как быстро всё между нами развивается. `, link:'Что дальше?' }
      : { category:'fast', text:`Всего ${time} — кажется, это самое быстрое знакомство в моей жизни. `, link:'Может, познакомимся по-настоящему?' };
    if (seconds < 120) return { category:'medium', text:`Нашему знакомству уже ${time}. Кажется, теперь моя очередь узнавать тебя. `, link:'Расскажешь что-нибудь о себе?' };
    return { category:'long', text:`Мы провели вместе ${time}, а я до сих пор не знаю, как тебя зовут. `, link:'Давай это исправим.' };
  }
  if (seconds < 30) {
    return random() < .5
      ? { category: 'fast', text: `${time}, and you’re already at the end. I like how quickly things are moving between us. `, link: 'What happens next?' }
      : { category: 'fast', text: `You made it here in ${time}. That might be the quickest introduction I’ve ever had. `, link: 'Shall we make it a proper one?' };
  }
  if (seconds < 120) {
    return { category: 'medium', text: `You’ve spent ${time} getting to know me. I think it’s my turn now. `, link: 'Tell me something about yourself?' };
  }
  return { category: 'long', text: `We’ve spent ${time} together, and I still don’t know your name. `, link: 'Let’s fix that.' };
}
