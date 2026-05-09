import { AlertTriangle } from 'lucide-react';
import type { UserSearchResult } from '#/types';
import { CATS, fmtEGP } from '../constants';

interface ConfirmStepProps {
  recipient: UserSearchResult;
  balanceInPiastres: number;
  amount: string;
  category: string;
  note: string;
  animClass: string;
}

export function ConfirmStep({
  recipient,
  balanceInPiastres,
  amount,
  category,
  note,
  animClass,
}: ConfirmStepProps) {
  const numericAmount = parseFloat(amount) || 0;
  const balanceEGP = balanceInPiastres / 100;
  const catLabel = CATS.find((c) => c.id === category)?.label;

  const rows = [
    {
      key: 'SENDING TO',
      val: (
        <span className="font-bold text-white">
          {recipient.full_name}{' '}
          <span className="text-[#00ff87] text-[13px]">ID·{recipient.id.slice(0, 8)}…</span>
        </span>
      ),
    },
    {
      key: 'AMOUNT',
      val: (
        <span className="text-[28px] font-bold tracking-tight text-[#00ff87]">
          EGP {fmtEGP(numericAmount)}
        </span>
      ),
    },
    ...(catLabel
      ? [
          {
            key: 'CATEGORY',
            val: (
              <span className="font-mono text-[12px] tracking-[0.14em] bg-[#00ff87] px-2 py-0.5 font-bold text-black">
                {catLabel}
              </span>
            ),
          },
        ]
      : []),
    {
      key: 'NOTE',
      val: (
        <span className={note ? 'text-[#ccc]' : 'text-[#555] italic'}>
          {note || 'No note added'}
        </span>
      ),
    },
    { key: 'FEE', val: <span className="text-[#00ff87] font-bold">EGP 0.00 — FREE</span> },
    { key: 'ARRIVES', val: <span className="text-white font-bold">INSTANTLY</span> },
    {
      key: 'BAL AFTER',
      val: <span className="font-bold text-[#aaa]">EGP {fmtEGP(balanceEGP - numericAmount)}</span>,
    },
  ];

  return (
    <div className={animClass}>
      <div className="mb-5 border-4 border-[#00ff87] bg-[#001a0a] px-[22px] py-6 text-center shadow-[6px_6px_0_#00e478]">
        <div className="mb-2.5 font-mono text-[11px] font-bold tracking-[0.2em] text-[#00ff87]">
          YOU ARE SENDING
        </div>
        <div className="text-[72px] font-bold leading-none tracking-tight text-[#00ff87]">
          {fmtEGP(numericAmount)}
        </div>
        <div className="mt-1 text-[18px] font-bold tracking-[0.04em] text-[#00c963]">
          EGP · EGYPTIAN POUND
        </div>
      </div>

      <div className="border-2 border-[#2a2a2a] bg-[#0d0d0d]">
        {rows.map((r, i) => (
          <div
            key={r.key}
            className="flex items-center justify-between gap-4 px-4 py-3"
            style={{
              borderBottom: i < rows.length - 1 ? '1px solid #1a1a1a' : 'none',
            }}
          >
            <span className="font-mono text-[10px] shrink-0 font-bold tracking-[0.18em] text-[#555]">
              {r.key}
            </span>
            <span className="text-[14px] font-medium text-right">{r.val}</span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex gap-2 items-start bg-[#0d0d0d] border border-[#1a1a1a] py-2.5 px-3.5">
        <span className="text-[#555] shrink-0 mt-0.5">
          <AlertTriangle size={12} strokeWidth={2.5} />
        </span>
        <span className="font-mono text-[10px] tracking-[0.1em] text-[#555] leading-relaxed">
          TRANSFERS ARE INSTANT AND CANNOT BE REVERSED. VERIFY RECIPIENT BEFORE CONFIRMING.
        </span>
      </div>
    </div>
  );
}
