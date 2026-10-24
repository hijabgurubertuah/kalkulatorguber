// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';
import { Display } from '../components/Display';
import { MemoryBar } from '../components/MemoryBar';
import { HistorySheet } from '../components/HistorySheet';
import { useCalculator } from '../context/CalculatorContext';
import {
  AngleUnit,
  evaluateExpression,
} from '../utils/calculatorEngine';
import {
  formatIndonesianNumber,
  parseIndonesianNumber,
  cleanFloat,
} from '../utils/numberFormat';

export const IlmiahPage: React.FC = () => {
  const { addHistory, ans, setAns } = useCalculator();

  const [expr, setExpr] = useState<string>('0');
  const [formula, setFormula] = useState<string>('');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [is2nd, setIs2nd] = useState<boolean>(false);
  const [isHyp, setIsHyp] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cycle angle unit: DEG -> RAD -> GRAD -> DEG
  const cycleAngleUnit = () => {
    setAngleUnit((prev) => {
      if (prev === 'DEG') return 'RAD';
      if (prev === 'RAD') return 'GRAD';
      return 'DEG';
    });
  };

  // Append token to expression
  const appendToken = useCallback(
    (token: string, isFunc = false) => {
      setErrorMsg(null);
      setExpr((prev) => {
        if (isCalculated) {
          setIsCalculated(false);
          setFormula('');
          if (isFunc) return `${token}(`;
          if (['+', '−', '×', '÷', '^', 'mod'].includes(token)) {
            return `${prev}${token}`;
          }
          return token;
        }

        if (prev === '0') {
          return isFunc ? `${token}(` : token;
        }

        return isFunc ? `${prev}${token}(` : `${prev}${token}`;
      });
    },
    [isCalculated]
  );

  // Handle Digit
  const handleDigit = useCallback(
    (d: string) => {
      setErrorMsg(null);
      setExpr((prev) => {
        if (isCalculated) {
          setIsCalculated(false);
          setFormula('');
          return d;
        }
        if (prev === '0') return d;
        return prev + d;
      });
    },
    [isCalculated]
  );

  // Handle Comma / Decimal
  const handleComma = useCallback(() => {
    setErrorMsg(null);
    setExpr((prev) => {
      if (isCalculated) {
        setIsCalculated(false);
        setFormula('');
        return '0.';
      }
      return `${prev}.`;
    });
  }, [isCalculated]);

  // Backspace ⌫
  const handleBackspace = useCallback(() => {
    setErrorMsg(null);
    if (isCalculated) {
      setExpr('0');
      setIsCalculated(false);
      return;
    }
    setExpr((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  }, [isCalculated]);

  // Clear All C
  const handleClear = useCallback(() => {
    setExpr('0');
    setFormula('');
    setIsCalculated(false);
    setErrorMsg(null);
  }, []);

  // Clear Entry CE
  const handleClearEntry = useCallback(() => {
    setErrorMsg(null);
    setExpr('0');
  }, []);

  // Equals =
  const handleEquals = useCallback(() => {
    if (errorMsg) return;

    try {
      // Auto close unclosed parentheses
      const openCount = (expr.match(/\(/g) || []).length;
      const closeCount = (expr.match(/\)/g) || []).length;
      let balancedExpr = expr;
      if (openCount > closeCount) {
        balancedExpr += ')'.repeat(openCount - closeCount);
      }

      const res = evaluateExpression(balancedExpr, angleUnit, ans);
      const resFormatted = formatIndonesianNumber(res);

      setFormula(balancedExpr);
      setExpr(resFormatted);
      setAns(res);
      setIsCalculated(true);
      addHistory(balancedExpr, resFormatted);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Masukan tidak valid');
    }
  }, [errorMsg, expr, angleUnit, ans, setAns, addHistory]);

  // Random (0 - 1)
  const handleRand = () => {
    const r = cleanFloat(Math.random(), 6);
    appendToken(r.toString());
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleComma();
      } else if (e.key === '+') {
        appendToken('+');
      } else if (e.key === '-') {
        appendToken('−');
      } else if (e.key === '*') {
        appendToken('×');
      } else if (e.key === '/') {
        e.preventDefault();
        appendToken('÷');
      } else if (e.key === '(' || e.key === ')') {
        appendToken(e.key);
      } else if (e.key === '^') {
        appendToken('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleComma, appendToken, handleEquals, handleBackspace, handleClear]);

  // Determine trig function labels based on 2nd and Hyp
  const getTrigLabels = () => {
    if (isHyp) {
      if (is2nd) return { sin: 'sinh⁻¹', cos: 'cosh⁻¹', tan: 'tanh⁻¹' };
      return { sin: 'sinh', cos: 'cosh', tan: 'tanh' };
    }
    if (is2nd) return { sin: 'sin⁻¹', cos: 'cos⁻¹', tan: 'tan⁻¹' };
    return { sin: 'sin', cos: 'cos', tan: 'tan' };
  };

  const trig = getTrigLabels();

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[520px] flex flex-col">
        {/* Display */}
        <Display
          formula={formula}
          result={errorMsg || expr}
          showMemory={true}
        />

        {/* Memory Bar */}
        <MemoryBar
          currentDisplayValue={expr}
          onRecallMemory={(val) => {
            appendToken(val.toString());
          }}
        />

        {/* Scientific Keypad: 5-column layout */}
        <div className="grid grid-cols-5 gap-1.5 w-full mt-1">
          {/* Row 1: Mode Switches */}
          <button
            type="button"
            onClick={() => setIs2nd(!is2nd)}
            className={`min-h-[46px] rounded-[14px] text-xs font-bold transition-all shadow-xs flex items-center justify-center ${
              is2nd ? 'bg-[#0D9488] text-white' : 'bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]'
            }`}
          >
            2nd
          </button>
          <button
            type="button"
            onClick={() => setIsHyp(!isHyp)}
            className={`min-h-[46px] rounded-[14px] text-xs font-bold transition-all shadow-xs flex items-center justify-center ${
              isHyp ? 'bg-[#0D9488] text-white' : 'bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]'
            }`}
          >
            Hyp
          </button>
          <button
            type="button"
            onClick={cycleAngleUnit}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-bold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            {angleUnit}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[46px] bg-[#FEF2F2] text-[#DC2626] font-bold text-sm rounded-[14px] hover:bg-[#FEE2E2] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            C
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Hapus Satu Karakter"
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-bold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            <Delete size={18} />
          </button>

          {/* Row 2: Trig & Log */}
          <button
            type="button"
            onClick={() => appendToken(trig.sin, true)}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            {trig.sin}
          </button>
          <button
            type="button"
            onClick={() => appendToken(trig.cos, true)}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            {trig.cos}
          </button>
          <button
            type="button"
            onClick={() => appendToken(trig.tan, true)}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            {trig.tan}
          </button>
          <button
            type="button"
            onClick={() => appendToken(is2nd ? 'log2' : 'log', true)}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            {is2nd ? 'log₂' : 'log'}
          </button>
          <button
            type="button"
            onClick={() => (is2nd ? appendToken('e^') : appendToken('ln', true))}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            {is2nd ? 'eˣ' : 'ln'}
          </button>

          {/* Row 3: Powers & Roots */}
          <button
            type="button"
            onClick={() => appendToken('^')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            xʸ
          </button>
          <button
            type="button"
            onClick={() => appendToken('^2')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            x²
          </button>
          <button
            type="button"
            onClick={() => appendToken('^3')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            x³
          </button>
          <button
            type="button"
            onClick={() => appendToken('√', true)}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            √x
          </button>
          <button
            type="button"
            onClick={() => (is2nd ? appendToken('10^') : appendToken('^(-1)'))}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            {is2nd ? '10ˣ' : '1/x'}
          </button>

          {/* Row 4: Parentheses, Factorial & EXP */}
          <button
            type="button"
            onClick={() => appendToken('(')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-bold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            (
          </button>
          <button
            type="button"
            onClick={() => appendToken(')')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-bold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            )
          </button>
          <button
            type="button"
            onClick={() => appendToken('!')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            n!
          </button>
          <button
            type="button"
            onClick={() => appendToken(is2nd ? 'nCr' : 'nPr')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            {is2nd ? 'nCr' : 'nPr'}
          </button>
          <button
            type="button"
            onClick={() => appendToken('EXP')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            EXP
          </button>

          {/* Row 5: Constants & Mod */}
          <button
            type="button"
            onClick={() => appendToken('π')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-bold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            π
          </button>
          <button
            type="button"
            onClick={() => appendToken('e')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-bold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            e
          </button>
          <button
            type="button"
            onClick={handleRand}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            Rand
          </button>
          <button
            type="button"
            onClick={() => appendToken('Ans')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            Ans
          </button>
          <button
            type="button"
            onClick={() => appendToken('mod')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            mod
          </button>

          {/* Row 6: 7 8 9 CE ÷ */}
          <button
            type="button"
            onClick={() => handleDigit('7')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleDigit('8')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleDigit('9')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            9
          </button>
          <button
            type="button"
            onClick={handleClearEntry}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-bold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            CE
          </button>
          <button
            type="button"
            onClick={() => appendToken('÷')}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-bold text-lg rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ÷
          </button>

          {/* Row 7: 4 5 6 |x| × */}
          <button
            type="button"
            onClick={() => handleDigit('4')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleDigit('5')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleDigit('6')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => appendToken('abs', true)}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            |x|
          </button>
          <button
            type="button"
            onClick={() => appendToken('×')}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-bold text-lg rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ×
          </button>

          {/* Row 8: 1 2 3 % − */}
          <button
            type="button"
            onClick={() => handleDigit('1')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleDigit('2')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleDigit('3')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => {
              const cur = parseIndonesianNumber(expr);
              appendToken((cur / 100).toString());
            }}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => appendToken('−')}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-bold text-lg rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            −
          </button>

          {/* Row 9: ± 0 . = + */}
          <button
            type="button"
            onClick={() => {
              setExpr((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
            }}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-bold text-sm rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ±
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleComma}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ,
          </button>
          <button
            type="button"
            onClick={handleEquals}
            className="min-h-[48px] bg-[#0F766E] text-white font-bold text-xl rounded-[14px] hover:bg-[#0D9488] active:scale-95 transition-all flex items-center justify-center shadow-md"
          >
            =
          </button>
          <button
            type="button"
            onClick={() => appendToken('+')}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-bold text-lg rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            +
          </button>
        </div>

        {/* History Bottom Sheet */}
        <HistorySheet
          onSelectResult={(selected) => {
            setExpr(selected);
            setIsCalculated(false);
          }}
        />
      </div>
    </div>
  );
};
