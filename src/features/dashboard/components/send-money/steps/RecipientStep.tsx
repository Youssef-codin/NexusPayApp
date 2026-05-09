import { useEffect, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { useAuthStore } from '#/store/auth-store';
import { useUserSearch } from '#/hooks/use-user';
import type { UserSearchResult } from '#/types';
import { Avatar } from '../Avatar';

interface RecipientStepProps {
  selectedRecipient: UserSearchResult | null;
  onSelect: (r: UserSearchResult) => void;
  onClear: () => void;
  animClass: string;
  walletLoading: boolean;
  walletError: boolean;
}

export function RecipientStep({
  selectedRecipient,
  onSelect,
  onClear,
  animClass,
  walletLoading,
  walletError,
}: RecipientStepProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data: rawResults = [] } = useUserSearch(debouncedQuery);
  const results = rawResults.filter((r) => r.id !== currentUserId);

  const hasSelection = !!selectedRecipient;

  const handleToggle = (r: UserSearchResult) => {
    if (selectedRecipient?.id === r.id) {
      onClear();
    } else {
      onSelect(r);
    }
  };

  return (
    <div className={`${animClass} flex flex-col`}>
      <div className="flex items-center gap-2.5 border-2 border-[#444] border-b-none bg-[#111] px-3.5 py-3">
        <span className={`shrink-0 ${hasSelection ? 'text-[#00ff87]' : 'text-[#666]'}`}>
          <Search size={18} strokeWidth={2.5} />
        </span>
        <input
          value={query}
          onChange={(e) => !hasSelection && setQuery(e.target.value)}
          placeholder={hasSelection ? 'Search locked' : 'Search by name...'}
          disabled={hasSelection}
          className={`flex-1 border-none bg-transparent text-base font-medium tracking-tight outline-none placeholder:text-[#444] ${
            hasSelection ? 'text-[#00ff87] cursor-not-allowed' : 'text-white'
          }`}
        />
        {hasSelection ? (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 border-2 border-[#00ff87] bg-[#00ff87]/10 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.1em] text-[#00ff87] cursor-pointer hover:bg-[#00ff87]/20"
          >
            <X size={12} strokeWidth={3} /> CLEAR
          </button>
        ) : query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="bg-none border-none text-[#666] cursor-pointer p-0 hover:text-[#888]"
          >
            <X size={14} strokeWidth={3} />
          </button>
        ) : null}
      </div>

      <div className="border-2 border-[#444] bg-[#0d0d0d] max-h-[300px] overflow-y-auto">
        {debouncedQuery.length < 2 ? (
          <div className="py-6 px-4 text-center font-mono text-[12px] tracking-[0.14em] text-[#555]">
            TYPE TO SEARCH
          </div>
        ) : results.length === 0 ? (
          <div className="py-7 px-4 text-center font-mono text-[12px] tracking-[0.14em] text-[#555]">
            NO USERS FOUND
          </div>
        ) : (
          (Array.isArray(results) ? results : []).map((r, i) => {
            const isSelected = selectedRecipient?.id === r.id;
            return (
              <button
                type="button"
                key={r.id}
                onClick={() => handleToggle(r)}
                className={`flex w-full items-center gap-3.5 px-3.5 py-3 border-l-4 text-left transition-colors ${
                  isSelected
                    ? 'border-l-[#00ff87] bg-[#001a0a]'
                    : 'border-l-transparent hover:bg-[#1a1a1a]'
                }`}
                style={{
                  borderBottom: i < results.length - 1 ? '1px solid #1a1a1a' : 'none',
                  borderTop: 'none',
                  borderRight: 'none',
                }}
              >
                <Avatar name={r.full_name} size={42} />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold text-white">{r.full_name}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-[#666] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                    ID · {r.id.slice(0, 8)}…
                  </div>
                </div>
                {isSelected ? (
                  <div className="flex size-7 shrink-0 items-center justify-center bg-[#00ff87] text-black">
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[#444]">
                    SELECT
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {selectedRecipient &&
        (walletLoading ? (
          <div className="mt-4 py-2.5 px-3.5 bg-[#111] border-2 border-[#444] font-mono text-[12px] tracking-[0.14em] text-[#888]">
            LOOKING UP WALLET…
          </div>
        ) : walletError ? (
          <div className="mt-4 py-2.5 px-3.5 bg-[#1a0000] border-2 border-[#ba1a1a] font-mono text-[12px] tracking-[0.12em] text-[#ff4444]">
            WALLET NOT FOUND FOR THIS USER
          </div>
        ) : (
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200 mt-4 flex items-center gap-2.5 py-2.5 px-3.5 bg-[#00ff87] border-2 border-[#00ff87]">
            <Check size={16} strokeWidth={3} />
            <span className="text-[14px] font-bold tracking-[0.06em]">
              {selectedRecipient.full_name} selected — click Next to continue.
            </span>
          </div>
        ))}
    </div>
  );
}
