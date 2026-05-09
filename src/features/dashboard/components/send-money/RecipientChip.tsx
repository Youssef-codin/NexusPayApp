import { X } from 'lucide-react';
import type { UserSearchResult } from '#/types';
import { Avatar } from './Avatar';

interface RecipientChipProps {
  recipient: UserSearchResult;
  onClear?: () => void;
}

export function RecipientChip({ recipient, onClear }: RecipientChipProps) {
  return (
    <div className="flex items-center gap-3 border-2 border-[#00ff87] bg-[#001a0a] px-3.5 py-2.5 mb-5">
      <Avatar name={recipient.full_name} size={38} />
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold leading-tight text-white">{recipient.full_name}</div>
        <div className="mt-0.5 font-mono text-[11px] tracking-[0.08em] text-[#00ff87]">
          ID · {recipient.id.slice(0, 8)}…
        </div>
      </div>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="flex shrink-0 size-7 items-center justify-center border-2 border-[#444] bg-transparent text-[#999] cursor-pointer p-0 hover:border-[#666] hover:text-[#bbb]"
        >
          <X size={12} strokeWidth={3} />
        </button>
      ) : (
        <div className="border border-[#00ff87] px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] text-[#00ff87]">
          VERIFIED
        </div>
      )}
    </div>
  );
}
