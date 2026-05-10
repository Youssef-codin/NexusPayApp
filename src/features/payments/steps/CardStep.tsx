import { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import type { StripeCardNumberElementChangeEvent } from '@stripe/stripe-js';

function fmtEGP(egp: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(egp);
}

function calcFee(egp: number) {
  return Math.round((egp * 0.029 + 9) * 100) / 100;
}

interface CardStepProps {
  amountEGP: number;
  onBack: () => void;
  onPay: (cardholderName: string) => void;
}

const wrapClass =
  'w-full bg-[#111] border-2 border-[#252525] px-3 py-3 transition-colors focus-within:border-[#00ff87] focus-within:shadow-[0_0_0_2px_rgba(0,255,135,0.15)]';

const inputClass =
  'w-full bg-[#111] border-2 border-[#252525] px-3 py-3 font-mono text-sm font-medium text-white outline-none transition-colors focus:border-[#00ff87] focus:shadow-[0_0_0_2px_rgba(0,255,135,0.15)]';

const elOptions = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: 'monospace, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      '::placeholder': { color: '#555555' },
    },
    invalid: { color: '#ff6b6b' },
  },
};

export function CardStep({ amountEGP, onBack, onPay }: CardStepProps) {
  const [name, setName] = useState('');
  const [cardNumComplete, setCardNumComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fee = calcFee(amountEGP);
  const total = amountEGP + fee;

  function handlePay() {
    if (!cardNumComplete || !cardExpiryComplete || !cardCvcComplete || !name.trim()) {
      setError('Please complete all card details.');
      return;
    }
    setError(null);
    onPay(name);
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Amount summary strip */}
      <div className="flex items-center justify-between border border-[#1e1e1e] bg-[#111] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-[#00ff87]" />
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              Depositing
            </p>
            <p className="text-lg font-bold text-white">{fmtEGP(amountEGP)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="border border-[#2a2a2a] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-300"
        >
          ← Edit
        </button>
      </div>

      {/* Card number */}
      <div>
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          Card Number
        </p>
        <div className={wrapClass}>
          <CardNumberElement
            options={elOptions}
            onChange={(e: StripeCardNumberElementChangeEvent) => setCardNumComplete(e.complete)}
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          Name on Card
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="JOHN DOE"
          className={`${inputClass} uppercase`}
        />
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            Expiry
          </p>
          <div className={wrapClass}>
            <CardExpiryElement
              options={elOptions}
              onChange={(e) => setCardExpiryComplete(e.complete)}
            />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            CVC
          </p>
          <div className={wrapClass}>
            <CardCvcElement options={elOptions} onChange={(e) => setCardCvcComplete(e.complete)} />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-[#ba1a1a] bg-[#ba1a1a]/10 px-3 py-2">
          <p className="text-[10px] font-bold text-[#ff6b6b]">{error}</p>
        </div>
      )}

      {/* Total recap */}
      <div className="flex items-center justify-between border border-[#191919] bg-[#080808] px-4 py-3">
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">
          Total Charged Today
        </span>
        <span className="font-mono text-sm font-bold text-[#00ff87]">{fmtEGP(total)}</span>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handlePay}
        className="flex w-full cursor-pointer items-center justify-center gap-3 border-4 border-black bg-[#00ff87] py-4 text-sm font-bold uppercase tracking-widest text-black shadow-[4px_4px_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000]"
      >
        {`Pay ${fmtEGP(total)} →`}
      </button>

      <p className="text-center text-[9px] font-bold uppercase tracking-[0.12em] text-[#2a2a2a]">
        🔒 Secured by Stripe · PCI DSS
      </p>
    </div>
  );
}
