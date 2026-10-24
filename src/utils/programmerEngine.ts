// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export type WordSize = 'QWORD' | 'DWORD' | 'WORD' | 'BYTE';
export type NumberBase = 'HEX' | 'DEC' | 'OCT' | 'BIN';

export interface WordSizeConfig {
  bits: number;
  mask: bigint;
  maxSigned: bigint;
  minSigned: bigint;
  label: WordSize;
}

export const WORD_SIZE_CONFIGS: Record<WordSize, WordSizeConfig> = {
  QWORD: {
    bits: 64,
    mask: 0xffffffffffffffffn,
    maxSigned: 0x7fffffffffffffffn,
    minSigned: -0x8000000000000000n,
    label: 'QWORD',
  },
  DWORD: {
    bits: 32,
    mask: 0xffffffffn,
    maxSigned: 0x7fffffffn,
    minSigned: -0x80000000n,
    label: 'DWORD',
  },
  WORD: {
    bits: 16,
    mask: 0xffffn,
    maxSigned: 0x7fffn,
    minSigned: -0x8000n,
    label: 'WORD',
  },
  BYTE: {
    bits: 8,
    mask: 0xffn,
    maxSigned: 0x7fn,
    minSigned: -0x80n,
    label: 'BYTE',
  },
};

/**
 * Normalizes a BigInt to the selected word size using two's complement wrap-around
 */
export function clampToWordSize(val: bigint, size: WordSize): bigint {
  const cfg = WORD_SIZE_CONFIGS[size];
  const unsigned = ((val % (1n << BigInt(cfg.bits))) + (1n << BigInt(cfg.bits))) % (1n << BigInt(cfg.bits));
  // If the high bit is set, treat as negative
  const signBit = 1n << BigInt(cfg.bits - 1);
  if ((unsigned & signBit) !== 0n) {
    return unsigned - (1n << BigInt(cfg.bits));
  }
  return unsigned;
}

/**
 * Convert BigInt to unsigned BigInt for bitwise display
 */
export function toUnsigned(val: bigint, size: WordSize): bigint {
  const cfg = WORD_SIZE_CONFIGS[size];
  return val & cfg.mask;
}

/**
 * Format a value into HEX, DEC, OCT, BIN based on current word size
 */
export function formatBaseRepresentations(val: bigint, size: WordSize) {
  const cfg = WORD_SIZE_CONFIGS[size];
  const clamped = clampToWordSize(val, size);
  const unsigned = toUnsigned(clamped, size);

  // HEX
  const hexRaw = unsigned.toString(16).toUpperCase();
  const hexPadded = hexRaw.padStart(Math.ceil(cfg.bits / 4), '0');
  // Group into 4-char chunks
  const hex = hexPadded.match(/.{1,4}/g)?.join(' ') || hexPadded;

  // DEC (signed)
  const dec = clamped.toString(10);

  // OCT
  const oct = unsigned.toString(8);

  // BIN
  const binRaw = unsigned.toString(2).padStart(cfg.bits, '0');
  const bin = binRaw.match(/.{1,4}/g)?.join(' ') || binRaw;

  return { HEX: hex, DEC: dec, OCT: oct, BIN: bin };
}

/**
 * Check if a character is valid for the given base
 */
export function isCharValidForBase(char: string, base: NumberBase): boolean {
  switch (base) {
    case 'BIN':
      return char === '0' || char === '1';
    case 'OCT':
      return /^[0-7]$/.test(char);
    case 'DEC':
      return /^[0-9]$/.test(char);
    case 'HEX':
      return /^[0-9A-Fa-f]$/.test(char);
    default:
      return false;
  }
}

/**
 * Execute bitwise and arithmetic operations
 */
export function executeProgrammerOp(
  op: string,
  a: bigint,
  b: bigint,
  size: WordSize
): bigint {
  const cfg = WORD_SIZE_CONFIGS[size];
  let res: bigint;

  switch (op) {
    case '+':
      res = a + b;
      break;
    case '-':
      res = a - b;
      break;
    case '*':
      res = a * b;
      break;
    case '/':
      if (b === 0n) throw new Error('Tidak bisa dibagi nol');
      res = a / b;
      break;
    case 'mod':
      if (b === 0n) throw new Error('Tidak bisa dibagi nol');
      res = a % b;
      break;
    case 'AND':
      res = a & b;
      break;
    case 'OR':
      res = a | b;
      break;
    case 'XOR':
      res = a ^ b;
      break;
    case 'NAND':
      res = ~(a & b) & cfg.mask;
      break;
    case 'NOR':
      res = ~(a | b) & cfg.mask;
      break;
    case '<<': {
      const shift = Number(b % BigInt(cfg.bits));
      res = (a << BigInt(shift)) & cfg.mask;
      break;
    }
    case '>>': {
      const shift = Number(b % BigInt(cfg.bits));
      res = a >> BigInt(shift);
      break;
    }
    default:
      res = b;
  }

  return clampToWordSize(res, size);
}
