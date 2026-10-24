// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';
import { Display } from '../components/Display';
import {
  NumberBase,
  WordSize,
  formatBaseRepresentations,
  clampToWordSize,
  isCharValidForBase,
  executeProgrammerOp,
} from '../utils/programmerEngine';

export const ProgrammerPage: React.FC = () => {
  const [activeBase, setActiveBase] = useState<NumberBase>('DEC');
  const [wordSize, setWordSize] = useState<WordSize>('QWORD');
  const [currentVal, setCurrentVal] = useState<bigint>(0n);
  const [prevVal, setPrevVal] = useState<bigint | null>(null);
  const [activeOp, setActiveOp] = useState<string | null>(null);
  const [formula, setFormula] = useState<string>('');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cycle Word Size: QWORD -> DWORD -> WORD -> BYTE -> QWORD
  const cycleWordSize = () => {
    const sizes: WordSize[] = ['QWORD', 'DWORD', 'WORD', 'BYTE'];
    const nextIdx = (sizes.indexOf(wordSize) + 1) % sizes.length;
    const nextSize = sizes[nextIdx];
    setWordSize(nextSize);
    setCurrentVal((v) => clampToWordSize(v, nextSize));
    if (prevVal !== null) {
      setPrevVal((v) => (v !== null ? clampToWordSize(v, nextSize) : null));
    }
  };

  // Convert current value to 4 bases
  const bases = formatBaseRepresentations(currentVal, wordSize);

  // Input Digit for active base
  const handleDigit = useCallback(
    (char: string) => {
      setErrorMsg(null);
      if (!isCharValidForBase(char, activeBase)) return;

      if (isCalculated) {
        setIsCalculated(false);
        setFormula('');
        const radix = activeBase === 'HEX' ? 16 : activeBase === 'DEC' ? 10 : activeBase === 'OCT' ? 8 : 2;
        const parsed = BigInt(parseInt(char, radix));
        setCurrentVal(clampToWordSize(parsed, wordSize));
        return;
      }

      const radix = activeBase === 'HEX' ? 16 : activeBase === 'DEC' ? 10 : activeBase === 'OCT' ? 8 : 2;
      const baseMultiplier = BigInt(radix);
      const digitVal = BigInt(parseInt(char, radix));

      setCurrentVal((prev) => {
        const next = prev * baseMultiplier + (prev >= 0n ? digitVal : -digitVal);
        return clampToWordSize(next, wordSize);
      });
    },
    [activeBase, isCalculated, wordSize]
  );

  // Backspace ⌫
  const handleBackspace = useCallback(() => {
    setErrorMsg(null);
    if (isCalculated) {
      setCurrentVal(0n);
      setIsCalculated(false);
      return;
    }

    const radix = activeBase === 'HEX' ? 16 : activeBase === 'DEC' ? 10 : activeBase === 'OCT' ? 8 : 2;
    const baseMultiplier = BigInt(radix);
    setCurrentVal((prev) => {
      const next = prev / baseMultiplier;
      return next;
    });
  }, [activeBase, isCalculated]);

  // Clear All C
  const handleClear = useCallback(() => {
    setCurrentVal(0n);
    setPrevVal(null);
    setActiveOp(null);
    setFormula('');
    setIsCalculated(false);
    setErrorMsg(null);
  }, []);

  // Negate ±
  const handleNegate = useCallback(() => {
    setErrorMsg(null);
    setCurrentVal((prev) => clampToWordSize(-prev, wordSize));
  }, [wordSize]);

  // Bitwise NOT
  const handleNot = useCallback(() => {
    setErrorMsg(null);
    setCurrentVal((prev) => clampToWordSize(~prev, wordSize));
    setIsCalculated(true);
    setFormula(`NOT(${bases[activeBase]})`);
  }, [bases, activeBase, wordSize]);

  // Operator
  const handleOperator = useCallback(
    (op: string) => {
      setErrorMsg(null);
      if (prevVal === null) {
        setPrevVal(currentVal);
        setActiveOp(op);
        setFormula(`${bases[activeBase]} ${op}`);
        setCurrentVal(0n);
        setIsCalculated(false);
      } else if (activeOp) {
        try {
          const res = executeProgrammerOp(activeOp, prevVal, currentVal, wordSize);
          setPrevVal(res);
          setActiveOp(op);
          setFormula(`${res.toString()} ${op}`);
          setCurrentVal(0n);
          setIsCalculated(false);
        } catch (err: unknown) {
          setErrorMsg(err instanceof Error ? err.message : 'Galat');
        }
      }
    },
    [prevVal, currentVal, activeOp, wordSize, bases, activeBase]
  );

  // Equals =
  const handleEquals = useCallback(() => {
    if (errorMsg) return;
    if (activeOp && prevVal !== null) {
      try {
        const res = executeProgrammerOp(activeOp, prevVal, currentVal, wordSize);
        setFormula(`${prevVal.toString()} ${activeOp} ${currentVal.toString()}`);
        setCurrentVal(res);
        setPrevVal(null);
        setActiveOp(null);
        setIsCalculated(true);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Galat');
      }
    }
  }, [errorMsg, activeOp, prevVal, currentVal, wordSize]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const keyUpper = e.key.toUpperCase();
      if (isCharValidForBase(keyUpper, activeBase)) {
        handleDigit(keyUpper);
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*') {
        handleOperator('*');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('/');
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
  }, [activeBase, handleDigit, handleOperator, handleEquals, handleBackspace, handleClear]);

  // Determine if a button is enabled for active base
  const isKeyActive = (char: string) => isCharValidForBase(char, activeBase);

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[520px] flex flex-col">
        {/* Display */}
        <Display
          formula={formula}
          result={errorMsg || bases[activeBase]}
          showMemory={false}
        />

        {/* 4 Base Rows (HEX, DEC, OCT, BIN) - Tapping one activates that base */}
        <div className="w-full bg-white rounded-2xl border border-[#CCEBE7] p-2.5 my-2 space-y-1 shadow-xs">
          {(['HEX', 'DEC', 'OCT', 'BIN'] as NumberBase[]).map((base) => {
            const isActive = activeBase === base;
            return (
              <button
                key={base}
                type="button"
                onClick={() => setActiveBase(base)}
                className={`w-full px-3 py-1.5 rounded-lg text-left text-xs sm:text-sm font-num flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#CCFBF1] text-[#0F766E] font-bold border-l-4 border-[#0D9488]'
                    : 'text-[#3F6F6B] hover:bg-[#F0FDFA]'
                }`}
              >
                <span className="w-10 font-bold uppercase">{base}</span>
                <span className="truncate text-right flex-1 ml-2 font-mono">
                  {bases[base]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls Bar: Word Size button, Clear, Backspace */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <button
            type="button"
            onClick={cycleWordSize}
            className="min-h-[44px] px-4 bg-[#CCFBF1] text-[#0F766E] font-bold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all shadow-xs"
          >
            {wordSize}
          </button>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClear}
              className="min-h-[44px] px-4 bg-[#FEF2F2] text-[#DC2626] font-bold text-sm rounded-[14px] hover:bg-[#FEE2E2] active:scale-95 transition-all shadow-xs"
            >
              C
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              aria-label="Hapus Satu Karakter"
              className="min-h-[44px] px-4 bg-[#CCFBF1] text-[#0F766E] font-bold text-sm rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all shadow-xs flex items-center justify-center"
            >
              <Delete size={18} />
            </button>
          </div>
        </div>

        {/* Programmer Keypad: 5 Columns */}
        <div className="grid grid-cols-5 gap-1.5 w-full">
          {/* Row 1: Bitwise logic */}
          <button
            type="button"
            onClick={() => handleOperator('AND')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            AND
          </button>
          <button
            type="button"
            onClick={() => handleOperator('OR')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            OR
          </button>
          <button
            type="button"
            onClick={() => handleOperator('XOR')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            XOR
          </button>
          <button
            type="button"
            onClick={handleNot}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            NOT
          </button>
          <button
            type="button"
            onClick={() => handleOperator('NAND')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            NAND
          </button>

          {/* Row 2: Shift, NOR, mod */}
          <button
            type="button"
            onClick={() => handleOperator('NOR')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            NOR
          </button>
          <button
            type="button"
            onClick={() => handleOperator('<<')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            onClick={() => handleOperator('>>')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            &gt;&gt;
          </button>
          <button
            type="button"
            onClick={() => handleOperator('mod')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-semibold text-xs rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            mod
          </button>
          <button
            type="button"
            onClick={() => handleOperator('/')}
            className="min-h-[46px] bg-[#CCFBF1] text-[#0F766E] font-bold text-lg rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ÷
          </button>

          {/* Row 3: A B 7 8 9 */}
          {['A', 'B'].map((hexChar) => {
            const enabled = isKeyActive(hexChar);
            return (
              <button
                key={hexChar}
                type="button"
                disabled={!enabled}
                onClick={() => handleDigit(hexChar)}
                className={`min-h-[48px] font-num font-bold text-lg rounded-[14px] transition-all flex items-center justify-center shadow-xs ${
                  enabled
                    ? 'bg-white text-[#0F2E2C] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95'
                    : 'bg-white/40 text-[#CCEBE7] border border-[#CCEBE7]/40 cursor-not-allowed'
                }`}
              >
                {hexChar}
              </button>
            );
          })}
          {['7', '8', '9'].map((d) => {
            const enabled = isKeyActive(d);
            return (
              <button
                key={d}
                type="button"
                disabled={!enabled}
                onClick={() => handleDigit(d)}
                className={`min-h-[48px] font-num font-bold text-lg rounded-[14px] transition-all flex items-center justify-center shadow-xs ${
                  enabled
                    ? 'bg-white text-[#0F2E2C] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95'
                    : 'bg-white/40 text-[#CCEBE7] border border-[#CCEBE7]/40 cursor-not-allowed'
                }`}
              >
                {d}
              </button>
            );
          })}

          {/* Row 4: C D 4 5 6 */}
          {['C', 'D'].map((hexChar) => {
            const enabled = isKeyActive(hexChar);
            return (
              <button
                key={hexChar}
                type="button"
                disabled={!enabled}
                onClick={() => handleDigit(hexChar)}
                className={`min-h-[48px] font-num font-bold text-lg rounded-[14px] transition-all flex items-center justify-center shadow-xs ${
                  enabled
                    ? 'bg-white text-[#0F2E2C] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95'
                    : 'bg-white/40 text-[#CCEBE7] border border-[#CCEBE7]/40 cursor-not-allowed'
                }`}
              >
                {hexChar}
              </button>
            );
          })}
          {['4', '5', '6'].map((d) => {
            const enabled = isKeyActive(d);
            return (
              <button
                key={d}
                type="button"
                disabled={!enabled}
                onClick={() => handleDigit(d)}
                className={`min-h-[48px] font-num font-bold text-lg rounded-[14px] transition-all flex items-center justify-center shadow-xs ${
                  enabled
                    ? 'bg-white text-[#0F2E2C] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95'
                    : 'bg-white/40 text-[#CCEBE7] border border-[#CCEBE7]/40 cursor-not-allowed'
                }`}
              >
                {d}
              </button>
            );
          })}

          {/* Row 5: E F 1 2 3 */}
          {['E', 'F'].map((hexChar) => {
            const enabled = isKeyActive(hexChar);
            return (
              <button
                key={hexChar}
                type="button"
                disabled={!enabled}
                onClick={() => handleDigit(hexChar)}
                className={`min-h-[48px] font-num font-bold text-lg rounded-[14px] transition-all flex items-center justify-center shadow-xs ${
                  enabled
                    ? 'bg-white text-[#0F2E2C] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95'
                    : 'bg-white/40 text-[#CCEBE7] border border-[#CCEBE7]/40 cursor-not-allowed'
                }`}
              >
                {hexChar}
              </button>
            );
          })}
          {['1', '2', '3'].map((d) => {
            const enabled = isKeyActive(d);
            return (
              <button
                key={d}
                type="button"
                disabled={!enabled}
                onClick={() => handleDigit(d)}
                className={`min-h-[48px] font-num font-bold text-lg rounded-[14px] transition-all flex items-center justify-center shadow-xs ${
                  enabled
                    ? 'bg-white text-[#0F2E2C] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95'
                    : 'bg-white/40 text-[#CCEBE7] border border-[#CCEBE7]/40 cursor-not-allowed'
                }`}
              >
                {d}
              </button>
            );
          })}

          {/* Row 6: ± 0 * - + */}
          <button
            type="button"
            onClick={handleNegate}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-bold text-base rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ±
          </button>
          <button
            type="button"
            disabled={!isKeyActive('0')}
            onClick={() => handleDigit('0')}
            className="min-h-[48px] bg-white text-[#0F2E2C] font-num font-bold text-lg rounded-[14px] border border-[#CCEBE7] hover:bg-[#F0FDFA] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleOperator('*')}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-bold text-lg rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => handleOperator('-')}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-bold text-lg rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => handleOperator('+')}
            className="min-h-[48px] bg-[#CCFBF1] text-[#0F766E] font-bold text-lg rounded-[14px] hover:bg-[#99F6E4] active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            +
          </button>

          {/* Row 7: Equals spans full or right aligned */}
          <div className="col-span-3" />
          <button
            type="button"
            onClick={handleEquals}
            className="col-span-2 min-h-[48px] bg-[#0F766E] text-white font-bold text-xl rounded-[14px] hover:bg-[#0D9488] active:scale-95 transition-all flex items-center justify-center shadow-md"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
