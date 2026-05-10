import { useState, useEffect, useRef, Fragment } from 'react';
import { gsap } from 'gsap';
import { Check, Search, X, AlertTriangle } from 'lucide-react';
import { useUserSearch } from '#/hooks/use-user';
import type { UserSearchResult } from '#/types';

export const CATS = [
  { id: 'subscription', label: 'SUBSCRIPTION' },
  { id: 'rent', label: 'RENT' },
  { id: 'shopping', label: 'SHOPPING' },
  { id: 'food', label: 'FOOD' },
  { id: 'transport', label: 'TRANSPORT' },
  { id: 'utilities', label: 'UTILITIES' },
  { id: 'entertainment', label: 'ENTERTAINMENT' },
  { id: 'other', label: 'OTHER' },
];

const AVATAR_PALETTES = [
  { bg: '#00ff87', fg: '#000' },
  { bg: '#000', fg: '#00ff87' },
  { bg: '#e4e1e9', fg: '#000' },
  { bg: '#1a1a1a', fg: '#fff' },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const { bg, fg } = AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.36,
        letterSpacing: '0.02em',
      }}
    >
      {getInitials(name)}
    </div>
  );
}

export function StepIndicator({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {labels.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: done || active ? '#00ff87' : '#2a2a2a',
                  border: done || active ? '3px solid #00ff87' : '2px solid #444',
                  color: done || active ? '#000' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: 13,
                  boxShadow: active ? '3px 3px 0 #00e478' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {done ? <Check size={14} strokeWidth={3} /> : `0${num}`}
              </div>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  fontWeight: 700,
                  color: done || active ? '#00ff87' : '#555',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: '0 8px',
                  marginBottom: 22,
                  background: step > num ? '#00ff87' : '#2a2a2a',
                  transition: 'background 0.3s',
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export function RecipientChip({
  recipient,
  onClear,
}: {
  recipient: UserSearchResult;
  onClear?: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        border: '2px solid #00ff87',
        background: '#001a0a',
        marginBottom: 20,
      }}
    >
      <Avatar name={recipient.full_name} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.1 }}>
          {recipient.full_name}
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#00ff87',
            letterSpacing: '0.08em',
            marginTop: 2,
          }}
        >
          @{recipient.full_name.toLowerCase().replace(/\s+/g, '')}
        </div>
      </div>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          style={{
            border: '2px solid #444',
            background: 'transparent',
            color: '#999',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0,
          }}
        >
          <X size={12} strokeWidth={3} />
        </button>
      ) : (
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 10,
            letterSpacing: '0.18em',
            fontWeight: 700,
            color: '#00ff87',
            border: '1px solid #00ff87',
            padding: '2px 7px',
          }}
        >
          VERIFIED
        </div>
      )}
    </div>
  );
}

export function RecipientStep({
  selectedRecipient,
  onSelect,
  onClear,
  animClass,
  recentRecipients,
}: {
  selectedRecipient: UserSearchResult | null;
  onSelect: (r: UserSearchResult) => void;
  onClear: () => void;
  animClass: string;
  recentRecipients: UserSearchResult[];
}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results = [] } = useUserSearch(debouncedQuery);

  if (selectedRecipient) {
    return (
      <div className={animClass} style={{ display: 'flex', flexDirection: 'column' }}>
        <RecipientChip
          recipient={selectedRecipient}
          onClear={() => {
            setQuery('');
            setDebouncedQuery('');
            onClear();
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            background: '#00ff87',
            border: '2px solid #00ff87',
          }}
        >
          <Check size={16} strokeWidth={3} />
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.06em' }}>
            {selectedRecipient.full_name} selected — click Next to continue.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={animClass} style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '2px solid #444',
          borderBottom: 'none',
          background: '#111',
          padding: '12px 14px',
        }}
      >
        <span style={{ color: '#666', flexShrink: 0 }}>
          <Search size={18} strokeWidth={2.5} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            outline: 'none',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <X size={14} strokeWidth={3} />
          </button>
        )}
      </div>

      <div
        style={{
          border: '2px solid #444',
          background: '#0d0d0d',
          maxHeight: 300,
          overflowY: 'auto',
        }}
      >
        {debouncedQuery.length < 2 ? (
          recentRecipients.length > 0 ? (
            <>
              <div
                style={{
                  padding: '8px 14px 6px',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  color: '#444',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                RECENT
              </div>
              {recentRecipients.map((r, i) => (
                <UserRow
                  key={r.id}
                  user={r}
                  isLast={i === recentRecipients.length - 1}
                  onSelect={onSelect}
                />
              ))}
            </>
          ) : (
            <EmptyState label="TYPE TO SEARCH" />
          )
        ) : results.length === 0 ? (
          <EmptyState label="NO USERS FOUND" />
        ) : (
          (Array.isArray(results) ? results : []).map((r, i) => (
            <UserRow key={r.id} user={r} isLast={i === results.length - 1} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '24px 16px',
        textAlign: 'center',
        color: '#555',
        fontFamily: 'monospace',
        fontSize: 12,
        letterSpacing: '0.14em',
      }}
    >
      {label}
    </div>
  );
}

function UserRow({
  user,
  isLast,
  onSelect,
}: {
  user: UserSearchResult;
  isLast: boolean;
  onSelect: (r: UserSearchResult) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 14px',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'inherit',
        border: 'none',
        borderBottom: isLast ? 'none' : '1px solid #1a1a1a',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'background 0.1s',
        borderLeft: '4px solid transparent',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <Avatar name={user.full_name} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{user.full_name}</div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#666',
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          ID · {user.id.slice(0, 8)}…
        </div>
      </div>
      <span
        style={{ fontFamily: 'monospace', fontSize: 10, color: '#444', letterSpacing: '0.14em' }}
      >
        SELECT
      </span>
    </button>
  );
}

export function AmountStep({
  recipient,
  onClearRecipient,
  balanceInPiastres,
  amountField,
  categoryField,
  animClass,
}: {
  recipient: UserSearchResult;
  onClearRecipient: () => void;
  balanceInPiastres: number;
  amountField: { value: string; onChange: (v: string) => void; onBlur: () => void; name: string };
  categoryField: { value: string; onChange: (v: string) => void };
  animClass: string;
}) {
  const amountBoxRef = useRef<HTMLDivElement>(null);
  const balanceEGP = balanceInPiastres / 100;
  const numericAmount = parseFloat(amountField.value) || 0;
  const isOverBalance = numericAmount > balanceEGP;
  const isBelowMin = numericAmount > 0 && numericAmount < 10;
  const isEmpty = numericAmount === 0;
  const [touched, setTouched] = useState(false);
  const hasError = touched && (isEmpty || isBelowMin || isOverBalance);

  const fmtEGP = (n: number) =>
    n.toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
          keyframes: { x: [0, -8, 8, -4, 4, 0] },
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    }
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <div className={animClass} style={{ display: 'flex', flexDirection: 'column' }}>
      <RecipientChip recipient={recipient} onClear={onClearRecipient} />

      <div style={{ marginBottom: 4 }}>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 700,
            color: '#888',
            marginBottom: 8,
          }}
        >
          AMOUNT
        </div>
        <div
          ref={amountBoxRef}
          style={{
            border: hasError ? '4px solid #ba1a1a' : '2px solid #444',
            background: '#111',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            boxShadow: hasError
              ? '4px 4px 0 #ba1a1a'
              : touched && !hasError && numericAmount > 0
                ? '4px 4px 0 #00ff87'
                : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: hasError ? '#ba1a1a' : '#666',
              transition: 'color 0.15s',
            }}
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
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: hasError ? '#ff4444' : '#fff',
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              padding: 0,
              width: 0,
              minWidth: 0,
              outline: 'none',
            }}
          />
        </div>

        {hasError && (
          <div
            className="animate-in fade-in-0 duration-150"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              background: '#1a0000',
              border: '2px solid #ba1a1a',
              borderTop: 'none',
            }}
          >
            <span style={{ color: '#ff4444', flexShrink: 0 }}>
              <AlertTriangle size={15} strokeWidth={2.5} />
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                letterSpacing: '0.12em',
                fontWeight: 700,
                color: '#ff4444',
              }}
            >
              {isEmpty
                ? 'ENTER AN AMOUNT'
                : isBelowMin
                  ? 'MINIMUM AMOUNT IS EGP 10.00'
                  : `EXCEEDS BALANCE BY EGP ${fmtEGP(numericAmount - balanceEGP)}`}
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              letterSpacing: '0.14em',
              fontWeight: 700,
              color: isOverBalance && touched ? '#ff4444' : '#666',
            }}
          >
            BAL · EGP {fmtEGP(balanceEGP)}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {quickAmounts.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  amountField.onChange(String(v));
                  setTouched(true);
                }}
                style={{
                  border: '2px solid #444',
                  background: numericAmount === v ? '#00ff87' : '#1a1a1a',
                  color: numericAmount === v ? '#000' : '#999',
                  padding: '4px 10px',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                }}
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
              style={{
                border: '2px solid #444',
                background: '#1a1a1a',
                color: '#999',
                padding: '4px 10px',
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 700,
            color: '#888',
            marginBottom: 10,
          }}
        >
          CATEGORY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {CATS.map((c) => {
            const active = categoryField.value === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => categoryField.onChange(active ? '' : c.id)}
                style={{
                  border: active ? '2px solid #00ff87' : '2px solid #2a2a2a',
                  background: active ? '#00ff87' : '#111',
                  color: active ? '#000' : '#888',
                  padding: '8px 4px',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  boxShadow: active ? '3px 3px 0 #00e478' : 'none',
                  transition: 'all 0.12s',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
