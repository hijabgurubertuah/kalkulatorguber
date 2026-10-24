// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Delete } from 'lucide-react';
import { Display } from '../components/Display';
import { MemoryBar } from '../components/MemoryBar';
import { HistorySheet } from '../components/HistorySheet';
import { useCalculator } from '../context/CalculatorContext';
import { formatDisplayTyping, formatIndonesianNumber, parseIndonesianNumber } from '../utils/numberFormat';
import { cleanFloat } from '../utils/numberFormat';

export const StandarPage: React.FC = () => {
  const { addHistory } = useCalculator();

  const [inputStr, setInputStr] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [formula, setFormula] = useState<string>('');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [isWaitingNewOperand, setIsWaitingNewOperand] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Repeat operation state: e.g. 5 + 2 = 7, = 9, = 11
  const lastOpRef = useRef<{ op: string; operand: number } | null>(null);

  // Input Digit
  const handleDigit = useCallback((d: string) => {
    setErrorMsg(null);
    setInputStr((prev) => {
      // If just finished an '=' calculation, start fresh
      if (isCalculated) {
        setIsCalculated(false);
        setFormula('');
        lastOpRef.current = null;
        return d;
      }

      // If waiting for the second operand after pressing an operator (+, −, ×, ÷)
      if (isWaitingNewOperand) {
        setIsWaitingNewOperand(false);
        return d;
      }

      if (prev === '0' || prev === '-0') {
        return prev.startsWith('-') ? `-${d}` : d;
      }

      // Check 16 digits limit
      const digitsOnly = prev.replace(/[^0-9]/g, '');
      if (digitsOnly.length >= 16) return prev;
      return prev + d;
    });
  }, [isCalculated, isWaitingNewOperand]);

  // Input Comma
  const handleComma = useCallback(() => {
    setErrorMsg(null);
    setInputStr((prev) => {
      if (isCalculated) {
        setIsCalculated(false);
        setFormula('');
        lastOpRef.current = null;
        return '0,';
      }
      if (isWaitingNewOperand) {
        setIsWaitingNewOperand(false);
        return '0,';
      }
      if (prev.includes(',')) return prev;
      return `${prev},`;
    });
  }, [isCalculated, isWaitingNewOperand]);

  // Backspace ⌫
  const handleBackspace = useCallback(() => {
    if (errorMsg) {
      setErrorMsg(null);
      setInputStr('0');
      return;
    }
    if (isCalculated) {
      setInputStr('0');
      setIsCalculated(false);
      return;
    }
    setInputStr((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) {
        return '0';
      }
      return prev.slice(0, -1);
    });
  }, [errorMsg, isCalculated]);

  // Clear All C
  const handleClearAll = useCallback(() => {
    setInputStr('0');
    setPrevValue(null);
    setOperator(null);
    setFormula('');
    setIsCalculated(false);
    setIsWaitingNewOperand(false);
    setErrorMsg(null);
    lastOpRef.current = null;
  }, []);

  // Clear Entry CE
  const handleClearEntry = useCallback(() => {
    setErrorMsg(null);
    setInputStr('0');
  }, []);

  // Toggle Sign ±
  const handleToggleSign = useCallback(() => {
    if (errorMsg) return;
    setInputStr((prev) => {
      if (prev === '0') return '0';
      if (prev.startsWith('-')) return prev.slice(1);
      return `-${prev}`;
    });
  }, [errorMsg]);

  // Execute Operator (+, −, ×, ÷)
  const handleOperator = useCallback((nextOp: string) => {
    if (errorMsg) return;
    const curVal = parseIndonesianNumber(inputStr);

    if (isWaitingNewOperand) {
      // User changed operator before typing the next number
      setOperator(nextOp);
      setFormula(`${formatIndonesianNumber(prevValue !== null ? prevValue : curVal)} ${nextOp}`);
      return;
    }

    if (prevValue === null) {
      setPrevValue(curVal);
      setOperator(nextOp);
      setFormula(`${formatIndonesianNumber(curVal)} ${nextOp}`);
      setIsWaitingNewOperand(true);
      setIsCalculated(false);
      lastOpRef.current = null;
    } else if (operator) {
      // Evaluate previous operation first
      try {
        let result = 0;
        if (operator === '+') result = prevValue + curVal;
        else if (operator === '−') result = prevValue - curVal;
        else if (operator === '×') result = prevValue * curVal;
        else if (operator === '÷') {
          if (curVal === 0) throw new Error('Tidak bisa dibagi nol');
          result = prevValue / curVal;
        }

        result = cleanFloat(result, 14);
        if (!isFinite(result)) throw new Error('Terlalu besar');

        setPrevValue(result);
        setOperator(nextOp);
        setFormula(`${formatIndonesianNumber(result)} ${nextOp}`);
        setInputStr(formatIndonesianNumber(result));
        setIsWaitingNewOperand(true);
        setIsCalculated(false);
        lastOpRef.current = null;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Masukan tidak valid';
        setErrorMsg(msg);
      }
    } else {
      setPrevValue(curVal);
      setOperator(nextOp);
      setFormula(`${formatIndonesianNumber(curVal)} ${nextOp}`);
      setIsWaitingNewOperand(true);
      setIsCalculated(false);
      lastOpRef.current = null;
    }
  }, [errorMsg, inputStr, prevValue, operator, isWaitingNewOperand]);

  // Equals =
  const handleEquals = useCallback(() => {
    if (errorMsg) return;

    // Repeating equals: e.g. 5 + 2 = 7, = 9, = 11
    if (isCalculated && lastOpRef.current) {
      const cur = parseIndonesianNumber(inputStr);
      const { op, operand } = lastOpRef.current;
      try {
        let res = 0;
        if (op === '+') res = cur + operand;
        else if (op === '−') res = cur - operand;
        else if (op === '×') res = cur * operand;
        else if (op === '÷') {
          if (operand === 0) throw new Error('Tidak bisa dibagi nol');
          res = cur / operand;
        }
        res = cleanFloat(res, 14);
        const fStr = `${formatIndonesianNumber(cur)} ${op} ${formatIndonesianNumber(operand)}`;
        const rStr = formatIndonesianNumber(res);
        setFormula(fStr);
        setInputStr(rStr);
        addHistory(fStr, rStr);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Masukan tidak valid');
      }
      return;
    }

    if (operator && prevValue !== null) {
      const curVal = parseIndonesianNumber(inputStr);
      try {
        let result = 0;
        if (operator === '+') result = prevValue + curVal;
        else if (operator === '−') result = prevValue - curVal;
        else if (operator === '×') result = prevValue * curVal;
        else if (operator === '÷') {
          if (curVal === 0) throw new Error('Tidak bisa dibagi nol');
          result = prevValue / curVal;
        }

        result = cleanFloat(result, 14);
        if (!isFinite(result)) throw new Error('Terlalu besar');

        const formulaText = `${formatIndonesianNumber(prevValue)} ${operator} ${formatIndonesianNumber(curVal)}`;
        const resultText = formatIndonesianNumber(result);

        lastOpRef.current = { op: operator, operand: curVal };
        setFormula(formulaText);
        setInputStr(resultText);
        setPrevValue(null);
        setOperator(null);
        setIsCalculated(true);
        setIsWaitingNewOperand(false);
        addHistory(formulaText, resultText);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Masukan tidak valid');
      }
    }
  }, [errorMsg, isCalculated, operator, prevValue, inputStr, addHistory]);

  // Percentage %
  const handlePercent = useCallback(() => {
    if (errorMsg) return;
    const curVal = parseIndonesianNumber(inputStr);
    if (operator && prevValue !== null) {
      // 200 + 10% -> 200 + 20
      // 50 * 10% -> 50 * 0.1
      let percentVal = 0;
      if (operator === '+' || operator === '−') {
        percentVal = (prevValue * curVal) / 100;
      } else {
        percentVal = curVal / 100;
      }
      setInputStr(formatIndonesianNumber(percentVal));
    } else {
      const p = curVal / 100;
      setInputStr(formatIndonesianNumber(p));
    }
  }, [errorMsg, inputStr, operator, prevValue]);

  // Square Root √x
  const handleSquareRoot = useCallback(() => {
    if (errorMsg) return;
    const cur = parseIndonesianNumber(inputStr);
    if (cur < 0) {
      setErrorMsg('Masukan tidak valid');
      return;
    }
    const res = cleanFloat(Math.sqrt(cur), 14);
    const f = `√(${formatIndonesianNumber(cur)})`;
    const r = formatIndonesianNumber(res);
    setFormula(f);
    setInputStr(r);
    setIsCalculated(true);
    addHistory(f, r);
  }, [errorMsg, inputStr, addHistory]);

  // Square x²
  const handleSquare = useCallback(() => {
    if (errorMsg) return;
    const cur = parseIndonesianNumber(inputStr);
    const res = cleanFloat(cur * cur, 14);
    const f = `sqr(${formatIndonesianNumber(cur)})`;
    const r = formatIndonesianNumber(res);
    setFormula(f);
    setInputStr(r);
    setIsCalculated(true);
    addHistory(f, r);
  }, [errorMsg, inputStr, addHistory]);

  // Reciprocal 1/x
  const handleReciprocal = useCallback(() => {
    if (errorMsg) return;
    const cur = parseIndonesianNumber(inputStr);
    if (cur === 0) {
      setErrorMsg('Tidak bisa dibagi nol');
      return;
    }
    const res = cleanFloat(1 / cur, 14);
    const f = `1/(${formatIndonesianNumber(cur)})`;
    const r = formatIndonesianNumber(res);
    setFormula(f);
    setInputStr(r);
    setIsCalculated(true);
    addHistory(f, r);
  }, [errorMsg, inputStr, addHistory]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleComma();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('−');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClearAll();
      } else if (e.key === 'Delete') {
        handleClearEntry();
      } else if (e.key === '%') {
        handlePercent();
      }
    };

    // Paste listener (Ctrl+V / Cmd+V)
    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text');
      if (!text) return;
      const clean = text.trim();
      const parsed = parseIndonesianNumber(clean);
      if (!isNaN(parsed)) {
        setInputStr(formatIndonesianNumber(parsed));
        setIsCalculated(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
    };
  }, [
    handleDigit,
    handleComma,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClearAll,
    handleClearEntry,
    handlePercent,
  ]);

  // Active formula showing ongoing expression e.g. "120 × 24"
  const activeFormula = (() => {
    if (isCalculated) return formula;
    if (operator && prevValue !== null) {
      if (isWaitingNewOperand) {
        return `${formatIndonesianNumber(prevValue)} ${operator}`;
      }
      return `${formatIndonesianNumber(prevValue)} ${operator} ${formatDisplayTyping(inputStr)}`;
    }
    return formula;
  })();

  const displayResult = errorMsg || (isCalculated ? inputStr : formatDisplayTyping(inputStr));

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[420px] flex flex-col">
        {/* Display */}
        <Display
          formula={activeFormula}
          result={displayResult}
          showMemory={true}
        />

        {/* Memory Bar */}
        <MemoryBar
          currentDisplayValue={inputStr}
          onRecallMemory={(val) => {
            setInputStr(formatIndonesianNumber(val));
            setIsCalculated(false);
          }}
        />

        {/* Calculator Keypad: 4 Columns */}
        <div className="grid grid-cols-4 gap-2 w-full mt-1">
          {/* Row 1 */}
          <button
            type="button"
            onClick={handlePercent}
            className="min-h-[50px] bg-[#CCFBF1] text-[#0F766E] font-bold text-base rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            %
          </button>
          <button
            type="button"
            onClick={handleClearEntry}
            className="min-h-[50px] bg-[#CCFBF1] text-[#0F766E] font-bold text-base rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            CE
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="min-h-[50px] bg-[#FEF2F2] text-[#DC2626] font-bold text-base rounded-[14px] hover:bg-[#FEE2E2] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            C
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Hapus Satu Angka"
            className="min-h-[50px] bg-[#CCFBF1] text-[#0F766E] font-bold text-base rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            <Delete size={20} />
          </button>

          {/* Row 2 */}
          <button
            type="button"
            onClick={handleReciprocal}
            className="min-h-[50px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            1/x
          </button>
          <button
            type="button"
            onClick={handleSquare}
            className="min-h-[50px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            x²
          </button>
          <button
            type="button"
            onClick={handleSquareRoot}
            className="min-h-[50px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            √x
          </button>
          <button
            type="button"
            onClick={() => handleOperator('÷')}
            className={`min-h-[50px] font-bold text-xl rounded-[14px] active:scale-95 transition-all flex items-center justify-center shadow-xs ${
              operator === '÷' && !isCalculated ? 'bg-[#0D9488] text-white' : 'bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]'
            }`}
          >
            ÷
          </button>

          {/* Row 3 */}
          <button
            type="button"
            onClick={() => handleDigit('7')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleDigit('8')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleDigit('9')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            9
          </button>
          <button
            type="button"
            onClick={() => handleOperator('×')}
            className={`min-h-[50px] font-bold text-xl rounded-[14px] active:scale-95 transition-all flex items-center justify-center shadow-xs ${
              operator === '×' && !isCalculated ? 'bg-[#0D9488] text-white' : 'bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]'
            }`}
          >
            ×
          </button>

          {/* Row 4 */}
          <button
            type="button"
            onClick={() => handleDigit('4')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleDigit('5')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleDigit('6')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => handleOperator('−')}
            className={`min-h-[50px] font-bold text-xl rounded-[14px] active:scale-95 transition-all flex items-center justify-center shadow-xs ${
              operator === '−' && !isCalculated ? 'bg-[#0D9488] text-white' : 'bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]'
            }`}
          >
            −
          </button>

          {/* Row 5 */}
          <button
            type="button"
            onClick={() => handleDigit('1')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleDigit('2')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleDigit('3')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => handleOperator('+')}
            className={`min-h-[50px] font-bold text-xl rounded-[14px] active:scale-95 transition-all flex items-center justify-center shadow-xs ${
              operator === '+' && !isCalculated ? 'bg-[#0D9488] text-white' : 'bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]'
            }`}
          >
            +
          </button>

          {/* Row 6 */}
          <button
            type="button"
            onClick={handleToggleSign}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-bold text-base rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ±
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleComma}
            className="min-h-[52px] bg-white text-[#0F2E2C] font-num font-bold text-xl rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ,
          </button>
          <button
            type="button"
            onClick={handleEquals}
            className="min-h-[52px] bg-[#0F766E] text-white font-bold text-2xl rounded-[14px] hover:bg-[#0D9488] active:scale-95 transition-all flex items-center justify-center shadow-md"
          >
            =
          </button>
        </div>

        {/* History Bottom Sheet */}
        <HistorySheet
          onSelectResult={(selected) => {
            setInputStr(selected);
            setIsCalculated(false);
          }}
        />
      </div>
    </div>
  );
};
