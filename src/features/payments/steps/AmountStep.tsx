import { useState } from 'react';

const PRESETS = [100, 500, 1000, 2000, 5000] as const;

function calcFee(egp: number) {
  return Math.round((egp * 0.029 + 9) * 100) / 100;
}

function fmtEGP(egp: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(egp);
}

interface AmountStepProps {
  amountEGP: number;
  onAmountChange: (egp: number) => void;
  onContinue: () => void;
  isLoading: boolean;
}

export function AmountStep({ amountEGP, onAmountChange, onContinue, isLoading }: AmountStepProps) {
  const [customInput, setCustomInput] = useState('');

  const displayAmount = customInput ? parseFloat(customInput) || 0 : amountEGP;
  const fee = calcFee(displayAmount);
  const total = displayAmount + fee;
  const canContinue = displayAmount >= 10 && !isLoading;

  function handlePreset(preset: number) {
    setCustomInput('');
    onAmountChange(preset);
  }

  function handleCustom(value: string) {
    setCustomInput(value);
    onAmountChange(parseFloat(value) || 0);
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
        Deposit Amount
      </p>

      {/* Big amount input */}
      <label className="flex cursor-text items-baseline gap-2 border-2 border-[#00ff87] bg-[#111] p-4 shadow-[3px_3px_0_#00ff87]">
        <span className="text-lg font-bold text-neutral-500">EGP</span>
        <input
          type="number"
          min={10}
          value={customInput}
          onChange={(e) => handleCustom(e.target.value)}
          onBlur={() => {
            if (!customInput) onAmountChange(amountEGP || 500);
          }}
          placeholder={String(amountEGP || 500)}
          className="w-full bg-transparent text-6xl font-bold tracking-tighter text-white caret-[#00ff87] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </label>

      {/* Quick-pick presets */}
      <div className="flex gap-2">
        {PRESETS.map((v) => {
          const isActive = v === amountEGP && !customInput;
          return (
            <button
              type="button"
              key={v}
              onClick={() => handlePreset(v)}
              className={`flex-1 border-2 py-2 text-xs font-bold tracking-wider transition-colors ${
                isActive
                  ? 'border-[#00ff87] bg-[#00ff87] text-black'
                  : 'border-[#2a2a2a] bg-[#141414] text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
              }`}
            >
              {v >= 1000 ? `${v / 1000}K` : v}
            </button>
          );
        })}
      </div>

      {/* Fee breakdown */}
      <div className="border border-[#191919] bg-[#080808]">
        {[
          { label: 'Deposit', value: fmtEGP(displayAmount) },
          { label: 'Stripe Fee (2.9% + EGP 9)', value: fmtEGP(fee) },
          { label: 'Total Charged', value: fmtEGP(total), accent: true },
        ].map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-2.5 ${i < 2 ? 'border-b border-[#151515]' : ''}`}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-600">
              {row.label}
            </span>
            <span
              className={`text-xs font-bold font-mono ${row.accent ? 'text-[#00ff87]' : 'text-neutral-400'}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className={`flex w-full items-center justify-center gap-3 border-4 border-black py-4 text-sm font-bold uppercase tracking-widest transition-all ${
          canContinue
            ? 'cursor-pointer bg-[#00ff87] text-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000]'
            : 'cursor-not-allowed bg-[#1a2e22] text-[#3a5a44]'
        }`}
      >
        {isLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#00ff87]/30 border-t-[#00ff87]" />
            <span className="text-[#00ff87]">Requesting session…</span>
          </>
        ) : (
          'Continue →'
        )}
      </button>

      <p className="text-center text-[9px] font-bold uppercase tracking-[0.12em] text-[#2a2a2a]">
        🔒 Secured by Stripe · PCI DSS
      </p>
    </div>
  );
}
