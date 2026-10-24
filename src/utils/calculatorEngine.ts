// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { cleanFloat, formatDisplayTyping, formatIndonesianNumber } from './numberFormat';

export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

export interface HistoryItem {
  id: string;
  formula: string;
  result: string;
  timestamp: number;
}

// Factorial helper (0 to 170)
export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new Error('Masukan tidak valid');
  if (n > 170) throw new Error('Terlalu besar');
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Permutation nPr
export function permutation(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error('Masukan tidak valid');
  }
  return factorial(n) / factorial(n - r);
}

// Combination nCr
export function combination(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error('Masukan tidak valid');
  }
  return factorial(n) / (factorial(r) * factorial(n - r));
}

// Angle conversion to Radians
export function toRadians(angle: number, unit: AngleUnit): number {
  if (unit === 'RAD') return angle;
  if (unit === 'GRAD') return (angle * Math.PI) / 200;
  // DEG
  return (angle * Math.PI) / 180;
}

export function fromRadians(rad: number, unit: AngleUnit): number {
  if (unit === 'RAD') return rad;
  if (unit === 'GRAD') return (rad * 200) / Math.PI;
  // DEG
  return (rad * 180) / Math.PI;
}

// Exact trig calculation for special angles in DEG
export function calcSin(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    const norm = ((x % 360) + 360) % 360;
    if (norm === 0 || norm === 180 || norm === 360) return 0;
    if (norm === 90) return 1;
    if (norm === 270) return -1;
    if (norm === 30 || norm === 150) return 0.5;
    if (norm === 210 || norm === 330) return -0.5;
  }
  return cleanFloat(Math.sin(toRadians(x, unit)), 14);
}

export function calcCos(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    const norm = ((x % 360) + 360) % 360;
    if (norm === 90 || norm === 270) return 0;
    if (norm === 0 || norm === 360) return 1;
    if (norm === 180) return -1;
    if (norm === 60 || norm === 300) return 0.5;
    if (norm === 120 || norm === 240) return -0.5;
  }
  return cleanFloat(Math.cos(toRadians(x, unit)), 14);
}

export function calcTan(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    const norm = ((x % 360) + 360) % 360;
    if (norm === 90 || norm === 270) throw new Error('Masukan tidak valid');
    if (norm === 0 || norm === 180 || norm === 360) return 0;
    if (norm === 45 || norm === 225) return 1;
    if (norm === 135 || norm === 315) return -1;
  }
  const res = Math.tan(toRadians(x, unit));
  return cleanFloat(res, 14);
}

export function calcAsin(x: number, unit: AngleUnit): number {
  if (x < -1 || x > 1) throw new Error('Masukan tidak valid');
  return cleanFloat(fromRadians(Math.asin(x), unit), 14);
}

export function calcAcos(x: number, unit: AngleUnit): number {
  if (x < -1 || x > 1) throw new Error('Masukan tidak valid');
  return cleanFloat(fromRadians(Math.acos(x), unit), 14);
}

export function calcAtan(x: number, unit: AngleUnit): number {
  return cleanFloat(fromRadians(Math.atan(x), unit), 14);
}

/**
 * Tokenizer & Shunting-Yard based Evaluator for standard & scientific math
 */
export function evaluateExpression(expr: string, angleUnit: AngleUnit = 'DEG', ans = 0): number {
  // Normalize symbols
  let sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `${Math.PI}`)
    .replace(/\be\b/g, `${Math.E}`)
    .replace(/\bAns\b/g, `${ans}`);

  // Replace EXP notation: e.g. 2E3 or 2e3
  sanitized = sanitized.replace(/(\d+(\.\d+)?)EXP([+-]?\d+)/gi, '($1*(10^$3))');

  // Tokenize regex
  const tokenRegex = /(\d+(\.\d+)?|sin⁻¹|cos⁻¹|tan⁻¹|sinh⁻¹|cosh⁻¹|tanh⁻¹|sinh|cosh|tanh|sin|cos|tan|log2|log|ln|nPr|nCr|mod|\^|√|³√|\+|\-|\*|\/|\(|\)|\!)/g;
  const rawTokens = sanitized.match(tokenRegex) || [];

  // Re-map unary minus
  const tokens: string[] = [];
  for (let i = 0; i < rawTokens.length; i++) {
    const t = rawTokens[i];
    if (t === '-') {
      const prev = tokens[tokens.length - 1];
      if (i === 0 || prev === '(' || ['+', '-', '*', '/', '^', 'mod', 'nPr', 'nCr'].includes(prev)) {
        // Unary minus: combine with next number or treat as 0 - ...
        tokens.push('0');
        tokens.push('-');
        continue;
      }
    }
    tokens.push(t);
  }

  // Precedence
  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    'mod': 2,
    '^': 3,
    'nPr': 3,
    'nCr': 3,
    '√': 4,
    '³√': 4,
  };

  const outputQueue: (number | string)[] = [];
  const opStack: string[] = [];

  const isFunction = (t: string) =>
    ['sin', 'cos', 'tan', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'sinh', 'cosh', 'tanh', 'sinh⁻¹', 'cosh⁻¹', 'tanh⁻¹', 'log', 'ln', 'log2', 'abs'].includes(t);

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (!isNaN(Number(t))) {
      outputQueue.push(Number(t));
    } else if (isFunction(t)) {
      opStack.push(t);
    } else if (t === '!') {
      outputQueue.push('!');
    } else if (t === '(') {
      opStack.push('(');
    } else if (t === ')') {
      while (opStack.length && opStack[opStack.length - 1] !== '(') {
        outputQueue.push(opStack.pop()!);
      }
      if (opStack.length && opStack[opStack.length - 1] === '(') {
        opStack.pop();
      }
      if (opStack.length && isFunction(opStack[opStack.length - 1])) {
        outputQueue.push(opStack.pop()!);
      }
    } else if (precedence[t]) {
      while (
        opStack.length &&
        opStack[opStack.length - 1] !== '(' &&
        (precedence[opStack[opStack.length - 1]] > precedence[t] ||
          (precedence[opStack[opStack.length - 1]] === precedence[t] && t !== '^'))
      ) {
        outputQueue.push(opStack.pop()!);
      }
      opStack.push(t);
    }
  }

  while (opStack.length) {
    const op = opStack.pop()!;
    if (op !== '(') outputQueue.push(op);
  }

  // Evaluate Postfix (RPN)
  const evalStack: number[] = [];

  for (const token of outputQueue) {
    if (typeof token === 'number') {
      evalStack.push(token);
    } else if (token === '!') {
      const a = evalStack.pop();
      if (a === undefined) throw new Error('Masukan tidak valid');
      evalStack.push(factorial(a));
    } else if (isFunction(token)) {
      const a = evalStack.pop();
      if (a === undefined) throw new Error('Masukan tidak valid');
      let res = 0;
      switch (token) {
        case 'sin':
          res = calcSin(a, angleUnit);
          break;
        case 'cos':
          res = calcCos(a, angleUnit);
          break;
        case 'tan':
          res = calcTan(a, angleUnit);
          break;
        case 'sin⁻¹':
          res = calcAsin(a, angleUnit);
          break;
        case 'cos⁻¹':
          res = calcAcos(a, angleUnit);
          break;
        case 'tan⁻¹':
          res = calcAtan(a, angleUnit);
          break;
        case 'sinh':
          res = Math.sinh(a);
          break;
        case 'cosh':
          res = Math.cosh(a);
          break;
        case 'tanh':
          res = Math.tanh(a);
          break;
        case 'sinh⁻¹':
          res = Math.asinh(a);
          break;
        case 'cosh⁻¹':
          if (a < 1) throw new Error('Masukan tidak valid');
          res = Math.acosh(a);
          break;
        case 'tanh⁻¹':
          if (a <= -1 || a >= 1) throw new Error('Masukan tidak valid');
          res = Math.atanh(a);
          break;
        case 'log':
          if (a <= 0) throw new Error('Masukan tidak valid');
          res = Math.log10(a);
          break;
        case 'ln':
          if (a <= 0) throw new Error('Masukan tidak valid');
          res = Math.log(a);
          break;
        case 'log2':
          if (a <= 0) throw new Error('Masukan tidak valid');
          res = Math.log2(a);
          break;
        default:
          throw new Error('Masukan tidak valid');
      }
      evalStack.push(cleanFloat(res, 14));
    } else {
      const b = evalStack.pop();
      const a = evalStack.pop();
      if (b === undefined || a === undefined) throw new Error('Masukan tidak valid');
      let res = 0;
      switch (token) {
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
          if (b === 0) throw new Error('Tidak bisa dibagi nol');
          res = a / b;
          break;
        case 'mod':
          if (b === 0) throw new Error('Tidak bisa dibagi nol');
          res = a % b;
          break;
        case '^':
          res = Math.pow(a, b);
          break;
        case 'nPr':
          res = permutation(a, b);
          break;
        case 'nCr':
          res = combination(a, b);
          break;
        default:
          throw new Error('Masukan tidak valid');
      }
      if (!isFinite(res)) {
        throw new Error(res > 0 ? 'Terlalu besar' : 'Terlalu kecil');
      }
      evalStack.push(cleanFloat(res, 14));
    }
  }

  if (evalStack.length !== 1) throw new Error('Masukan tidak valid');
  return cleanFloat(evalStack[0], 14);
}
