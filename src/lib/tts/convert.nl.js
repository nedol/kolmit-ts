

export function Number2Words(num) {
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  const ten = Math.floor(num / 10);
  const rest = num % 10;
  return rest === 0 ? tens[ten] : ones[rest] + 'en' + tens[ten];
}

export function GroupNumber2Word(num, unit) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    let result = '';

    if (hundred > 0) {
      result += ones[hundred] + 'honderd';
      if (rest > 0) result += 'en';
    }

    if (rest > 0) {
      result += convertToWords(rest);
    }

    if (unit) {
      result += unit;
    }

    return result;

    if (number === 0) return 'nul';

    let unitIndex = 0;

    while (number > 0) {
      const group = number % 1000;
      if (group > 0) {
        const groupResult = convertGroup(
          group,
          unitIndex === 1 ? 'duizend' : ''
        );
        result = groupResult + (result ? 'en' : '') + result;
      }
      number = Math.floor(number / 1000);
      unitIndex++;
    }

    return result.trim();
  }
