interface SuccessStepProps {
  amountEGP: number;
  newBalanceEGP: number;
  onClose: () => void;
}

function fmtEGP(egp: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(egp);
}

export function SuccessStep({ amountEGP, newBalanceEGP, onClose }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {/* Animated checkmark */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className="mb-7"
        style={{ animation: 'scaleIn 0.3s ease' }}
      >
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="#00ff87"
          strokeWidth="3"
          strokeDasharray="226"
          strokeDashoffset="0"
        />
        <path
          d="M24 40 L35 52 L56 30"
          stroke="#00ff87"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-neutral-500">
        Payment Successful
      </p>
      <p className="mb-1 text-3xl font-bold tracking-tight text-white">{fmtEGP(amountEGP)}</p>
      <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-600">
        Added to your balance
      </p>

      {/* New balance */}
      <div className="mt-8 w-full border-2 border-[#00ff87] bg-[#0d0d0d] px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            New Balance
          </span>
          <span className="text-xl font-bold tracking-tight text-[#00ff87]">
            {fmtEGP(newBalanceEGP)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-8 w-full border-2 border-[#00ff87] px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-[#00ff87] transition-colors hover:bg-[#00ff87]/10"
      >
        Done
      </button>
    </div>
  );
}
