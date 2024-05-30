export function NumberString(lang, number) {
  switch (lang) {
    case 'nl':
      let ones = [
        '',
        'een',
        'twee',
        'drie',
        'vier',
        'vijf',
        'zes',
        'zeven',
        'acht',
        'negen',
      ];
      let teens = [
        'tien',
        'elf',
        'twaalf',
        'dertien',
        'veertien',
        'vijftien',
        'zestien',
        'zeventien',
        'achttien',
        'negentien',
      ];
      let tens = [
        '',
        '',
        'twintig',
        'dertig',
        'veertig',
        'vijftig',
        'zestig',
        'zeventig',
        'tachtig',
        'negentig',
      ];

      break;

    case 'en':
      ones = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
      ];
      teens = [
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
      ];
      tens = [
        '',
        '',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
      ];
      if (number < 10) {
        return ones[number];
      } else if (number < 20) {
        return teens[number - 10];
      } else if (number < 100) {
        return (
          tens[Math.floor(number / 10)] +
          (number % 10 !== 0 ? '-' + ones[number % 10] : '')
        );
      } else {
        return 'Number out of range';
      }
      break;

    case 'fr':
      ones = [
        '',
        'un',
        'deux',
        'trois',
        'quatre',
        'cinq',
        'six',
        'sept',
        'huit',
        'neuf',
      ];
      teens = [
        'dix',
        'onze',
        'douze',
        'treize',
        'quatorze',
        'quinze',
        'seize',
        'dix-sept',
        'dix-huit',
        'dix-neuf',
      ];
      tens = [
        '',
        '',
        'vingt',
        'trente',
        'quarante',
        'cinquante',
        'soixante',
        'soixante-dix',
        'quatre-vingt',
        'quatre-vingt-dix',
      ];
      if (number < 10) {
        return ones[number];
      } else if (number < 20) {
        return teens[number - 10];
      } else if (number < 70 || number % 10 === 0) {
        return (
          tens[Math.floor(number / 10)] +
          (number % 10 !== 0 ? '-' + ones[number % 10] : '')
        );
      } else if (number < 80) {
        return 'soixante-' + ones[(number % 10) + 10];
      } else if (number < 90) {
        return 'quatre-vingt-' + ones[(number % 10) + 10];
      } else {
        return 'quatre-vingt-dix-' + ones[number % 10];
      }
      break;

    case 'es':
      ones = [
        '',
        'uno',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
      ];
      teens = [
        'diez',
        'once',
        'doce',
        'trece',
        'catorce',
        'quince',
        'dieciséis',
        'diecisiete',
        'dieciocho',
        'diecinueve',
      ];
      tens = [
        '',
        '',
        'veinte',
        'treinta',
        'cuarenta',
        'cincuenta',
        'sesenta',
        'setenta',
        'ochenta',
        'noventa',
      ];
      if (number < 10) {
        return ones[number];
      } else if (number < 20) {
        return teens[number - 10];
      } else if (number < 100) {
        return (
          tens[Math.floor(number / 10)] +
          (number % 10 !== 0 ? ' y ' + ones[number % 10] : '')
        );
      } else {
        return 'Número fuera de rango';
      }
      break;

    case 'it':
      ones = [
        '',
        'uno',
        'due',
        'tre',
        'quattro',
        'cinque',
        'sei',
        'sette',
        'otto',
        'nove',
      ];
      teens = [
        'dieci',
        'undici',
        'dodici',
        'tredici',
        'quattordici',
        'quindici',
        'sedici',
        'diciassette',
        'diciotto',
        'diciannove',
      ];
      tens = [
        '',
        '',
        'venti',
        'trenta',
        'quaranta',
        'cinquanta',
        'sessanta',
        'settanta',
        'ottanta',
        'novanta',
      ];
      if (number < 10) {
        return ones[number];
      } else if (number < 20) {
        return teens[number - 10];
      } else if (number < 100) {
        return (
          tens[Math.floor(number / 10)] +
          (number % 10 !== 0 ? 'uno' + ones[number % 10].substring(1) : '')
        );
      } else {
        return 'Numero fuori dal range';
      }
      break;

    case 'de':
      ones = [
        '',
        'eins',
        'zwei',
        'drei',
        'vier',
        'fünf',
        'sechs',
        'sieben',
        'acht',
        'neun',
      ];
      teens = [
        'zehn',
        'elf',
        'zwölf',
        'dreizehn',
        'vierzehn',
        'fünfzehn',
        'sechzehn',
        'siebzehn',
        'achtzehn',
        'neunzehn',
      ];
      tens = [
        '',
        '',
        'zwanzig',
        'dreißig',
        'vierzig',
        'fünfzig',
        'sechzig',
        'siebzig',
        'achtzig',
        'neunzig',
      ];
      if (number < 10) {
        return ones[number];
      } else if (number < 20) {
        return teens[number - 10];
      } else if (number < 100) {
        return (
          tens[Math.floor(number / 10)] +
          (number % 10 !== 0 ? 'und' + ones[number % 10] : '')
        );
      } else {
        return 'Zahl außerhalb des Bereichs';
      }
      break;
  }
}
