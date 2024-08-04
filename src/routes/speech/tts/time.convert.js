export function convertTimeToWords(lang, input) {
  // Объект для сопоставления чисел с текстовыми представлениями
  // Регулярное выражение для поиска времени в формате HH:MM
  const timePattern = /(\d{2}):(\d{2})/;

  // Функция для замены времени на текстовое представление
  return input.replace(timePattern, (match, p1, p2) => {
    // Преобразование часов и минут в текст
    let hours = parseInt(p1);
    let minutes = parseInt(p2);
      if (p2 !== '00') {        
        return formatTime(lang,{hours:hours,minutes:minutes});
    } else {
        return `${hours}`;
    }
  });
}

  function formatTime(lang, time) {
    const hours = time.hours;
    const minutes = time.minutes;

    switch (lang) {
      case 'nl':
        if (minutes === 0) {
          return `${hours} uur`;
        } else if (minutes < 15) {
          return `${minutes} over ${hours}`;
        } else if (minutes === 15) {
          return `kwart over ${hours}`;
        } else if (minutes > 15 && minutes < 30) {
          return `${30 - minutes} voor half ${hours + 1}`;
        } else if (minutes === 30) {
          return `half ${hours === 1 ? 'twee' : hours + 1}`;
        } else if (minutes > 30 && minutes < 45) {
          return `${minutes - 30} over half ${hours + 1}`;
        } else if (minutes === 45) {
          return `kwart voor ${hours === 1 ? 'tien' : hours + 1}`;
        } else if (minutes > 45) {
          return `${60 - minutes} voor  ${hours + 1}`;
        } else {
          return `${minutes} minuten over ${hours}`;
        }
        break;

      case 'en':
        if (minutes === 0) {
          return `${hours} o'clock`;
        } else if (minutes < 15) {
          return `${minutes} past ${hours}`;
        } else if (minutes === 15) {
          return `quarter past ${hours}`;
        } else if (minutes < 30) {
          return `${30 - minutes} minutes past ${hours}`;
        } else if (minutes === 30) {
          return `half past ${hours}`;
        } else if (minutes < 45) {
          return `${minutes - 30} minutes to ${hours + 1}`;
        } else if (minutes === 45) {
          return `quarter to ${hours + 1}`;
        } else {
          return `${60 - minutes} minutes to ${hours + 1}`;
        }
        break;

      case 'fr':
        if (minutes === 0) {
          return `${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes < 15) {
          return `${minutes} minute${
            minutes > 1 ? 's' : ''
          } après ${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes === 15) {
          return `quart après ${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes < 30) {
          return `${30 - minutes} minute${
            30 - minutes > 1 ? 's' : ''
          } avant la demi de ${hours + 1} heure`;
        } else if (minutes === 30) {
          return `demie après ${hours} heure`;
        } else if (minutes < 45) {
          return `${minutes - 30} minute${
            minutes - 30 > 1 ? 's' : ''
          } après la demi de ${hours + 1} heure`;
        } else if (minutes === 45) {
          return `quart avant ${hours + 1} heure`;
        } else {
          return `${60 - minutes} minute${60 - minutes > 1 ? 's' : ''} avant ${
            hours + 1
          } heure`;
        }
        break;

      case 'de':
        if (minutes === 0) {
          return `${hours} Uhr`;
        } else if (minutes < 15) {
          return `${minutes} nach ${hours}`;
        } else if (minutes === 15) {
          return `Viertel nach ${hours}`;
        } else if (minutes > 15 && minutes < 30) {
          return `${30 - minutes} vor halb ${hours + 1}`;
        } else if (minutes === 30) {
          return `halb ${hours + 1}`;
        } else if (minutes > 30 && minutes < 45) {
          return `${minutes - 30} nach halb ${hours + 1}`;
        } else if (minutes === 45) {
          return `Viertel vor ${hours + 1}`;
        } else if (minutes > 45) {
          return `${60 - minutes} vor ${hours + 1}`;
        } else {
          return `${minutes} Minuten nach ${hours}`;
        }

      case 'es':
        if (minutes === 0) {
          return `${hours === 1 ? 'La una' : hours} en punto`;
        } else if (minutes === 15) {
          return `Son las ${hours} y cuarto`;
        } else if (minutes === 30) {
          return `Son las ${hours} y media`;
        } else if (minutes === 45) {
          return `Son las ${hours + 1} menos cuarto`;
        } else if (minutes < 30) {
          return `Son las ${hours} y ${minutes} minutos`;
        } else {
          return `Son las ${hours + 1} menos ${60 - minutes} minutos`;
        }
        break;

      case 'it':
        if (minutes === 0) {
          return `${hours} ${hours === 1 ? 'ora' : 'ore'}`;
        } else if (minutes < 15) {
          return `${minutes} minuti dopo l'ora ${hours}`;
        } else if (minutes === 15) {
          return `un quarto dopo l'ora ${hours}`;
        } else if (minutes < 30) {
          return `${30 - minutes} minuti prima della mezz'ora ${hours + 1}`;
        } else if (minutes === 30) {
          return `mezz'ora ${hours + 1}`;
        } else if (minutes < 45) {
          return `${minutes - 30} minuti dopo la mezz'ora ${hours + 1}`;
        } else if (minutes === 45) {
          return `un quarto prima dell'ora ${hours + 1}`;
        } else {
          return `${60 - minutes} minuti prima dell'ora ${hours + 1}`;
        }
        break;
    }
  }
