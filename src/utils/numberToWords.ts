/**
 * Convert numbers to Indian English currency words format
 * Example: 33500 -> "Thirty-Three Thousand Five Hundred Rupees Only"
 * Example: 125450.50 -> "One Lakh Twenty-Five Thousand Four Hundred Fifty Rupees and Fifty Paise Only"
 */

const units = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

const convertLessThanThousand = (num: number): string => {
  let str = '';

  if (num >= 100) {
    str += units[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }

  if (num > 0) {
    if (num < 20) {
      str += units[num];
    } else {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      str += tens[ten] + (unit > 0 ? '-' + units[unit] : '');
    }
  }

  return str.trim();
};

export const numberToWordsINR = (amount: number): string => {
  if (isNaN(amount) || amount === 0) {
    return 'Zero Rupees Only';
  }

  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  const integerPart = Math.floor(absoluteAmount);
  const decimalPart = Math.round((absoluteAmount - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) {
    return 'Zero Rupees Only';
  }

  let result = '';

  const crore = Math.floor(integerPart / 10000000);
  let remainder = integerPart % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder %= 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder %= 1000;

  const hundredsAndBelow = remainder;

  if (crore > 0) {
    result += `${convertLessThanThousand(crore)} Crore `;
  }

  if (lakh > 0) {
    result += `${convertLessThanThousand(lakh)} Lakh `;
  }

  if (thousand > 0) {
    result += `${convertLessThanThousand(thousand)} Thousand `;
  }

  if (hundredsAndBelow > 0) {
    result += `${convertLessThanThousand(hundredsAndBelow)} `;
  }

  result = result.trim();

  let finalWords = '';
  if (integerPart > 0) {
    finalWords = `${result} Rupees`;
  }

  if (decimalPart > 0) {
    const paiseWords = convertLessThanThousand(decimalPart);
    if (integerPart > 0) {
      finalWords += ` and ${paiseWords} Paise`;
    } else {
      finalWords = `${paiseWords} Paise`;
    }
  }

  finalWords += ' Only';

  if (isNegative) {
    finalWords = `Minus ${finalWords}`;
  }

  return finalWords.replace(/\s+/g, ' ').trim();
};
