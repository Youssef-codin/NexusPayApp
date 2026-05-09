import { useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { gsap } from 'gsap';
import type { UserSearchResult } from '#/types';
import { RecipientChip } from '../RecipientChip';
import { CATS, fmtEGP } from '../constants';

interface AmountStepProps {
  recipient: UserSearchResult;
  onClearRecipient: () => void;
  balanceInPiastres: number;
  amountField: { value: string; onChange: (v: string) => void; onBlur: () => void; name: string };
  categoryField: { value: string; onChange: (v: string) => void };
  noteField: { value: string; onChange: (v: string) => void };
  animClass: string;
}

export function AmountStep({
  recipient,
  onClearRecipient,
  balanceInPiastres,
  amountField,
  categoryField,
  noteField,
  animClass,
}: AmountStepProps) {
  const amountBoxRef = useRef<HTMLDivElement>(null);
  const balanceEGP = balanceInPiastres / 100;
  const numericAmount = parseFloat(amountField.value) || 0;
  const isOverBalance = numericAmount > balanceEGP;
  const isBelowMin = numericAmount > 0 && numericAmount < 10;
  const isEmpty = numericAmount === 0;
  const [touched, setTouched] = useState(false);
  const hasError = touched && (isEmpty || isBelowMin || isOverBalance);

  const handleAmountChange = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    amountField.onChange(clean);
  };

  const handleBlur = () => {
    setTouched(true);
    amountField.onBlur();
    if (isEmpty || isBelowMin || isOverBalance) {
      if (amountBoxRef.current) {
        gsap.to(amountBoxRef.current, {
          keyframes: { x: [-8, 8, -4, 4, 0] },
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    }
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <div className={`${animClass} flex flex-col`}>
      <RecipientChip recipient={recipient} onClear={onClearRecipient} />

      <div className="mb-1">
        <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.2em] text-[#888]">
          AMOUNT
        </div>
        <div
          ref={amountBoxRef}
          className={`flex items-baseline gap-2.5 bg-[#111] px-5 py-4.5 transition-colors ${
            hasError
              ? 'border-4 border-[#ba1a1a] shadow-[4px_4px_0_#ba1a1a]'
              : 'border-2 border-[#444]'
          }`}
          style={{
            boxShadow: hasError
              ? '4px 4px 0 #ba1a1a'
              : touched && !hasError && numericAmount > 0
                ? '4px 4px 0 #00ff87'
                : 'none',
          }}
        >
          <span
            className={`text-[22px] font-bold transition-colors ${
              hasError ? 'text-[#ba1a1a]' : 'text-[#666]'
            }`}
          >
            EGP
          </span>
          <input
            name={amountField.name}
            type="text"
            inputMode="decimal"
            value={amountField.value}
            onChange={(e) => handleAmountChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="0.00"
            className="flex-1 min-w-0 border-none bg-transparent text-[56px] font-bold leading-none tracking-tight text-white outline-none placeholder:text-[#333]"
            style={{
              color: hasError ? '#ff4444' : '#fff',
            }}
          />
        </div>

        {hasError && (
          <div className="animate-in fade-in-0 duration-150 mt-2 flex items-center gap-2.5 py-2.5 px-3.5 bg-[#1a0000] border-2 border-[#ba1a1a] border-t-none">
            <span className="text-[#ff4444] shrink-0">
              <AlertTriangle size={15} strokeWidth={2.5} />
            </span>
            <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-[#ff4444]">
              {isEmpty
                ? 'ENTER AN AMOUNT'
                : isBelowMin
                  ? 'MINIMUM AMOUNT IS EGP 10.00'
                  : `EXCEEDS BALANCE BY EGP ${fmtEGP(numericAmount - balanceEGP)}`}
            </span>
          </div>
        )}

        <div className="mt-2.5 mb-3.5 flex items-center justify-between">
          <span
            className={`font-mono text-[11px] tracking-[0.14em] font-bold ${
              isOverBalance && touched ? 'text-[#ff4444]' : 'text-[#666]'
            }`}
          >
            BAL · EGP {fmtEGP(balanceEGP)}
          </span>
          <div className="flex gap-1.5">
            {quickAmounts.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  amountField.onChange(String(v));
                  setTouched(true);
                }}
                className={`px-2.5 py-1 font-mono text-[11px] font-bold tracking-[0.1em] transition-all ${
                  numericAmount === v
                    ? 'bg-[#00ff87] text-black'
                    : 'bg-[#1a1a1a] text-[#999] border-2 border-[#444] hover:border-[#555]'
                }`}
              >
                {v}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                amountField.onChange(String(balanceEGP));
                setTouched(true);
              }}
              className="px-2.5 py-1 border-2 border-[#444] bg-[#1a1a1a] font-mono text-[11px] font-bold tracking-[0.1em] text-[#999] hover:border-[#555] hover:text-[#bbb]"
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4.5">
        <div className="mb-2.5 font-mono text-[11px] font-bold tracking-[0.2em] text-[#888]">
          CATEGORY
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {CATS.map((c) => {
            const active = categoryField.value === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => categoryField.onChange(active ? '' : c.id)}
                className={`py-2 px-1 font-mono text-[10px] font-bold tracking-[0.1em] transition-all ${
                  active
                    ? 'bg-[#00ff87] text-black border-2 border-[#00ff87] shadow-[3px_3px_0_#00e478]'
                    : 'bg-[#111] text-[#888] border-2 border-[#2a2a2a] hover:border-[#444]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between">
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#888]">
            NOTE · OPTIONAL
          </span>
          <span className="font-mono text-[10px] text-[#555]">{noteField.value.length} / 120</span>
        </div>
        <textarea
          value={noteField.value}
          onChange={(e) => noteField.onChange(e.target.value.slice(0, 120))}
          placeholder="What's this for? (e.g. splitting rent, dinner, cab ride…)"
          rows={2}
          className="w-full border-2 border-[#2a2a2a] bg-[#111] px-3.5 py-3 text-[14px] font-medium leading-relaxed tracking-tight text-[#ccc] placeholder:text-[#444] outline-none resize-y font-inherit"
        />
      </div>
    </div>
  );
}
