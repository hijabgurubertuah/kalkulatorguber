// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

/**
 * Pemformat angka gaya Indonesia:
 * - Titik (.) sebagai pemisah ribuan
 * - Koma (,) sebagai pemisah desimal
 * - Notasi ilmiah jika angka melebihi batas tampilan
 * - Menghilangkan floating point noise (0.1 + 0.2 = 0.3)
 */

export function cleanFloat(num: number, precision = 12): number {
  if (!isFinite(num)) return num;
  return parseFloat(num.toPrecision(precision));
}

export function formatIndonesianNumber(
  val: number | string,
  options?: { maxDecimals?: number; useGrouping?: boolean }
): string {
  if (typeof val === 'string') {
    const parsed = parseIndonesianNumber(val);
    if (isNaN(parsed)) return val;
    val = parsed;
  }

  if (isNaN(val)) return 'Masukan tidak valid';
  if (!isFinite(val)) {
    return val > 0 ? 'Terlalu besar' : 'Terlalu kecil';
  }

  const { maxDecimals = 10, useGrouping = true } = options || {};

  // For very large or very tiny non-zero numbers, use scientific notation
  const absVal = Math.abs(val);
  if (absVal !== 0 && (absVal >= 1e16 || absVal < 1e-7)) {
    const expStr = val.toExponential(6);
    return expStr.replace('.', ',');
  }

  // Eliminate floating point precision artifact
  const cleaned = cleanFloat(val, 14);

  // Split integer and fractional parts
  const parts = cleaned.toString().split('.');
  let integerPart = parts[0];
  let decimalPart = parts[1] || '';

  if (maxDecimals !== undefined && decimalPart.length > maxDecimals) {
    decimalPart = decimalPart.slice(0, maxDecimals);
  }

  // Remove trailing zeros in decimal
  decimalPart = decimalPart.replace(/0+$/, '');

  if (useGrouping) {
    // Add thousands dot
    const isNegative = integerPart.startsWith('-');
    const digits = isNegative ? integerPart.slice(1) : integerPart;
    const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    integerPart = (isNegative ? '-' : '') + grouped;
  }

  return decimalPart.length > 0 ? `${integerPart},${decimalPart}` : integerPart;
}

/**
 * Format string display while user is typing in calculator
 * Handles intermediate decimal comma "12," -> "12,"
 */
export function formatDisplayTyping(rawInput: string): string {
  if (!rawInput) return '0';
  if (rawInput === '-') return '-';

  const isNeg = rawInput.startsWith('-');
  const pure = isNeg ? rawInput.slice(1) : rawInput;

  const parts = pure.split(',');
  const intDigits = parts[0].replace(/\D/g, '');
  const groupedInt = (intDigits || '0').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const formattedInt = isNeg && intDigits !== '0' ? `-${groupedInt}` : isNeg && intDigits === '0' ? `-${groupedInt}` : groupedInt;

  if (parts.length > 1) {
    return `${formattedInt},${parts[1]}`;
  }
  return formattedInt;
}

/**
 * Parse an Indonesian formatted string into a JavaScript number
 */
export function parseIndonesianNumber(str: string): number {
  if (!str) return 0;
  // Remove thousand dots, convert comma to dot
  const standardized = str
    .trim()
    .replace(/\./g, '')
    .replace(',', '.');
  return Number(standardized);
}

/**
 * Format for clipboard copy: no thousand separators, comma for decimal
 */
export function formatForClipboard(val: number | string): string {
  if (typeof val === 'string') {
    const parsed = parseIndonesianNumber(val);
    if (!isNaN(parsed)) val = parsed;
    else return val;
  }
  if (!isFinite(val)) return String(val);
  const cleaned = cleanFloat(val, 14);
  return cleaned.toString().replace('.', ',');
}
