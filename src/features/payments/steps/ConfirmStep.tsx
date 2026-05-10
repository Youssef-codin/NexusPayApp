interface ConfirmStepProps {
  amountEGP: number;
  onBack: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  error: string | null;
}

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

export function ConfirmStep({ amountEGP, onBack, onConfirm, isLoading, error }: ConfirmStepProps) {
  const fee = calcFee(amountEGP);
  const total = amountEGP + fee;

  const rows = [
    { label: 'Deposit amount', value: fmtEGP(amountEGP) },
    { label: 'Stripe fee', value: fmtEGP(fee) },
    { label: 'Total charged', value: fmtEGP(total), accent: true },
  ];

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
          Confirm Deposit
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-white">{fmtEGP(amountEGP)}</p>
      </div>

      <div className="border border-[#1e1e1e] bg-[#0d0d0d]">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-3 ${i < rows.length - 1 ? 'border-b border-[#1e1e1e]' : ''}`}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-600">
              {row.label}
            </span>
            <span
              className={`font-mono text-sm font-bold ${row.accent ? 'text-[#00ff87]' : 'text-neutral-300'}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-neutral-600">
        By confirming, you authorise NexusPay to charge your card{' '}
        <span className="text-neutral-400">{fmtEGP(total)}</span> via Stripe. This action cannot be
        undone.
      </p>

      {error && (
        <div className="border border-[#ba1a1a] bg-[#ba1a1a]/10 px-3 py-2">
          <p className="text-[10px] font-bold text-[#ff6b6b]">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex w-full items-center justify-center gap-3 border-4 border-black py-4 text-sm font-bold uppercase tracking-widest transition-all ${
            isLoading
              ? 'cursor-not-allowed bg-[#1a2e22] text-[#3a5a44]'
              : 'cursor-pointer bg-[#00ff87] text-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000]'
          }`}
        >
          {isLoading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#00ff87]/30 border-t-[#00ff87]" />
              <span className="text-[#00ff87]">Processing…</span>
            </>
          ) : (
            'Confirm & Pay →'
          )}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full border border-[#2a2a2a] py-3 text-sm font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-300"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
