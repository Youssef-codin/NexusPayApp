import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useForm } from '@tanstack/react-form';
import { gsap } from 'gsap';
import { Check, Search, X, ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { useUserSearch } from '#/hooks/use-user';
import { useSendMoney, useTransfers } from '#/hooks/use-transfers';
import type { UserSearchResult } from '#/types';

const CATS = [
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

function Avatar({ name, size = 44 }: { name: string; size?: number }) {
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

function StepIndicator({ step }: { step: number }) {
  const labels = ['RECIPIENT', 'AMOUNT', 'CONFIRM'];
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
            {i < 2 && (
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

function RecipientChip({
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
          ID · {recipient.id.slice(0, 8)}…
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

function Step1({
  selectedRecipient,
  onSelect,
  animClass,
  recentRecipients,
}: {
  selectedRecipient: UserSearchResult | null;
  onSelect: (r: UserSearchResult) => void;
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
              {recentRecipients.map((r, i) => {
                const isSelected = selectedRecipient?.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelect(r)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 14px',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      border: 'none',
                      borderBottom: i < recentRecipients.length - 1 ? '1px solid #1a1a1a' : 'none',
                      background: isSelected ? '#001a0a' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                      borderLeft: isSelected ? '4px solid #00ff87' : '4px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Avatar name={r.full_name} size={42} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>
                        {r.full_name}
                      </div>
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
                        ID · {r.id.slice(0, 8)}…
                      </div>
                    </div>
                    {isSelected ? (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          background: '#00ff87',
                          color: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </div>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 10,
                          color: '#444',
                          letterSpacing: '0.14em',
                        }}
                      >
                        SELECT
                      </span>
                    )}
                  </button>
                );
              })}
            </>
          ) : (
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
              TYPE TO SEARCH
            </div>
          )
        ) : results.length === 0 ? (
          <div
            style={{
              padding: '28px 16px',
              textAlign: 'center',
              color: '#555',
              fontFamily: 'monospace',
              fontSize: 12,
              letterSpacing: '0.14em',
            }}
          >
            NO USERS FOUND
          </div>
        ) : (
          (Array.isArray(results) ? results : []).map((r, i) => {
            const isSelected = selectedRecipient?.id === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelect(r)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 14px',
                  width: '100%',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  border: 'none',
                  borderBottom: i < results.length - 1 ? '1px solid #1a1a1a' : 'none',
                  background: isSelected ? '#001a0a' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  borderLeft: isSelected ? '4px solid #00ff87' : '4px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Avatar name={r.full_name} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{r.full_name}</div>
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
                    ID · {r.id.slice(0, 8)}…
                  </div>
                </div>
                {isSelected ? (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: '#00ff87',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 10,
                      color: '#444',
                      letterSpacing: '0.14em',
                    }}
                  >
                    SELECT
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {selectedRecipient && (
        <div
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
          style={{
            marginTop: 16,
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
      )}
    </div>
  );
}

function Step2({
  recipient,
  onClearRecipient,
  balanceInPiastres,
  amountField,
  categoryField,
  noteField,
  animClass,
}: {
  recipient: UserSearchResult;
  onClearRecipient: () => void;
  balanceInPiastres: number;
  amountField: { value: string; onChange: (v: string) => void; onBlur: () => void; name: string };
  categoryField: { value: string; onChange: (v: string) => void };
  noteField: { value: string; onChange: (v: string) => void };
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

      {/* Amount */}
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

      {/* Category */}
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

      {/* Note */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              letterSpacing: '0.2em',
              fontWeight: 700,
              color: '#888',
            }}
          >
            NOTE · OPTIONAL
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#555' }}>
            {noteField.value.length} / 120
          </span>
        </div>
        <textarea
          value={noteField.value}
          onChange={(e) => noteField.onChange(e.target.value.slice(0, 120))}
          placeholder="What's this for? (e.g. splitting rent, dinner, cab ride…)"
          rows={2}
          style={{
            width: '100%',
            border: '2px solid #2a2a2a',
            background: '#111',
            color: '#ccc',
            padding: '12px 14px',
            fontSize: 14,
            fontWeight: 500,
            resize: 'vertical',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
}

function Step3({
  recipient,
  balanceInPiastres,
  amount,
  category,
  note,
  animClass,
}: {
  recipient: UserSearchResult;
  balanceInPiastres: number;
  amount: string;
  category: string;
  note: string;
  animClass: string;
}) {
  const numericAmount = parseFloat(amount) || 0;
  const balanceEGP = balanceInPiastres / 100;
  const fmtEGP = (n: number) =>
    n.toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const catLabel = CATS.find((c) => c.id === category)?.label;

  const rows = [
    {
      key: 'SENDING TO',
      val: (
        <span style={{ fontWeight: 700, color: '#fff' }}>
          {recipient.full_name}{' '}
          <span style={{ color: '#00ff87', fontSize: 13 }}>ID·{recipient.id.slice(0, 8)}…</span>
        </span>
      ),
    },
    {
      key: 'AMOUNT',
      val: (
        <span style={{ fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', color: '#00ff87' }}>
          EGP {fmtEGP(numericAmount)}
        </span>
      ),
    },
    ...(catLabel
      ? [
          {
            key: 'CATEGORY',
            val: (
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  background: '#00ff87',
                  color: '#000',
                  padding: '2px 8px',
                  fontWeight: 700,
                }}
              >
                {catLabel}
              </span>
            ),
          },
        ]
      : []),
    {
      key: 'NOTE',
      val: (
        <span style={{ color: note ? '#ccc' : '#555', fontStyle: note ? 'normal' : 'italic' }}>
          {note || 'No note added'}
        </span>
      ),
    },
    { key: 'FEE', val: <span style={{ color: '#00ff87', fontWeight: 700 }}>EGP 0.00 — FREE</span> },
    { key: 'ARRIVES', val: <span style={{ color: '#fff', fontWeight: 700 }}>INSTANTLY</span> },
    {
      key: 'BAL AFTER',
      val: (
        <span style={{ fontWeight: 700, color: '#aaa' }}>
          EGP {fmtEGP(balanceEGP - numericAmount)}
        </span>
      ),
    },
  ];

  return (
    <div className={animClass}>
      <div
        style={{
          border: '4px solid #00ff87',
          background: '#001a0a',
          padding: '24px 22px',
          marginBottom: 20,
          boxShadow: '6px 6px 0 #00e478',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 700,
            color: '#00ff87',
            marginBottom: 10,
          }}
        >
          YOU ARE SENDING
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 72,
            letterSpacing: '-0.05em',
            lineHeight: 1,
            color: '#00ff87',
          }}
        >
          {fmtEGP(numericAmount)}
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            color: '#00c963',
            marginTop: 4,
            letterSpacing: '0.04em',
          }}
        >
          EGP · EGYPTIAN POUND
        </div>
      </div>

      <div style={{ border: '2px solid #2a2a2a', background: '#0d0d0d' }}>
        {rows.map((r, i) => (
          <div
            key={r.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: i < rows.length - 1 ? '1px solid #1a1a1a' : 'none',
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                letterSpacing: '0.18em',
                fontWeight: 700,
                color: '#555',
                flexShrink: 0,
              }}
            >
              {r.key}
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>{r.val}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          padding: '10px 14px',
          background: '#0d0d0d',
          border: '1px solid #1a1a1a',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        <span style={{ color: '#555', flexShrink: 0, marginTop: 1 }}>
          <AlertTriangle size={12} strokeWidth={2.5} />
        </span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 10,
            letterSpacing: '0.1em',
            color: '#555',
            lineHeight: 1.6,
          }}
        >
          TRANSFERS ARE INSTANT AND CANNOT BE REVERSED. VERIFY RECIPIENT BEFORE CONFIRMING.
        </span>
      </div>
    </div>
  );
}

// ── Main Modal ───────────────────────────────────────────────────────────────

export interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  balanceInPiastres: number;
}

export function SendMoneyModal({ isOpen, onClose, balanceInPiastres }: SendMoneyModalProps) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [animKey, setAnimKey] = useState(0);
  const [recipient, setRecipient] = useState<UserSearchResult | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const sendMoney = useSendMoney();
  const { data: transfers = [] } = useTransfers();
  const recentRecipients = useMemo<UserSearchResult[]>(() => {
    const seen = new Set<string>();
    const results: UserSearchResult[] = [];
    for (const t of [...transfers].reverse()) {
      if (t.direction === 'debit' && !seen.has(t.to_wallet_id)) {
        seen.add(t.to_wallet_id);
        results.push({ id: t.to_wallet_id, full_name: t.to_user.full_name });
        if (results.length === 5) break;
      }
    }
    return results;
  }, [transfers]);

  const form = useForm({
    defaultValues: {
      to_wallet_id: '',
      amount: '',
      category: '',
      note: '',
    },
    onSubmit: async ({ value }) => {
      const piastres = Math.round((parseFloat(value.amount) || 0) * 100);
      const result = await sendMoney.mutateAsync({
        to_wallet_id: value.to_wallet_id,
        amount_in_piastres: piastres,
        note: value.note || undefined,
      });
      setTxId(result.id);
    },
  });

  const reset = () => {
    setStep(1);
    setDir('fwd');
    setAnimKey(0);
    setRecipient(null);
    setTxId(null);
    sendMoney.reset();
    form.reset();
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const goTo = (next: number) => {
    setDir(next > step ? 'fwd' : 'back');
    setStep(next);
    setAnimKey((k) => k + 1);
  };

  const handleSelectRecipient = (r: UserSearchResult) => {
    setRecipient(r);
    form.setFieldValue('to_wallet_id', r.id);
  };

  const handleClearRecipient = () => {
    setRecipient(null);
    form.setFieldValue('to_wallet_id', '');
    goTo(1);
  };

  const balanceEGP = balanceInPiastres / 100;
  const amountVal = form.state.values.amount;
  const numericAmount = parseFloat(amountVal) || 0;
  const canNext1 = !!recipient;
  const canReview = numericAmount >= 10 && numericAmount <= balanceEGP;

  const animClass =
    dir === 'fwd'
      ? 'animate-in fade-in-0 slide-in-from-right-8 duration-300'
      : 'animate-in fade-in-0 slide-in-from-left-8 duration-300';

  const TITLES = ['SELECT RECIPIENT', 'AMOUNT & CATEGORY', 'CONFIRM TRANSFER'];
  const sent = !!txId;

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="animate-in fade-in-0 slide-in-from-bottom-6 duration-300"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1001,
            width: '100%',
            maxWidth: 620,
            maxHeight: '92vh',
            background: '#0d0d0d',
            border: '4px solid #000',
            boxShadow: '10px 10px 0 #000',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            outline: 'none',
          }}
        >
          <DialogPrimitive.Title
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
            }}
          >
            Send Money
          </DialogPrimitive.Title>

          {/* Header */}
          <div
            style={{
              borderBottom: '4px solid #00ff87',
              padding: '18px 24px 0',
              background: '#000',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 36, background: '#00ff87' }} />
                <div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 10,
                      letterSpacing: '0.22em',
                      fontWeight: 700,
                      color: '#555',
                    }}
                  >
                    NEXUSPAY · TRANSFER
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 22,
                      letterSpacing: '-0.02em',
                      color: '#fff',
                      lineHeight: 1.1,
                    }}
                  >
                    {sent ? 'TRANSFER SENT' : TITLES[step - 1]}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  border: '2px solid #333',
                  background: 'transparent',
                  color: '#666',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
            {!sent && <StepIndicator step={step} />}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', minHeight: 0 }}>
            {sent ? (
              <div
                className="animate-in fade-in-0 slide-in-from-right-8 duration-300"
                style={{ textAlign: 'center', padding: '40px 0' }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    background: '#00ff87',
                    border: '4px solid #00ff87',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <Check size={36} strokeWidth={3} />
                </div>
                <div
                  style={{ fontWeight: 700, fontSize: 32, letterSpacing: '-0.03em', color: '#fff' }}
                >
                  TRANSFER SENT
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 13,
                    color: '#555',
                    marginTop: 8,
                    letterSpacing: '0.1em',
                  }}
                >
                  EGP {numericAmount.toLocaleString('en-EG', { minimumFractionDigits: 2 })} →{' '}
                  {recipient?.full_name}
                </div>
                <div
                  style={{
                    marginTop: 28,
                    padding: '14px 18px',
                    background: '#001a0a',
                    border: '2px solid #00ff87',
                    display: 'inline-block',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      fontWeight: 700,
                      color: '#00ff87',
                    }}
                  >
                    TRANSACTION ID · {txId}
                  </span>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div key={animKey}>
                  {step === 1 && (
                    <Step1
                      selectedRecipient={recipient}
                      onSelect={handleSelectRecipient}
                      animClass={animClass}
                      recentRecipients={recentRecipients}
                    />
                  )}
                  {step === 2 && recipient && (
                    <form.Field name="amount">
                      {(amountF) => (
                        <form.Field name="category">
                          {(categoryF) => (
                            <form.Field name="note">
                              {(noteF) => (
                                <Step2
                                  recipient={recipient}
                                  onClearRecipient={handleClearRecipient}
                                  balanceInPiastres={balanceInPiastres}
                                  amountField={{
                                    value: amountF.state.value,
                                    onChange: amountF.handleChange,
                                    onBlur: amountF.handleBlur,
                                    name: amountF.name,
                                  }}
                                  categoryField={{
                                    value: categoryF.state.value,
                                    onChange: categoryF.handleChange,
                                  }}
                                  noteField={{
                                    value: noteF.state.value,
                                    onChange: noteF.handleChange,
                                  }}
                                  animClass={animClass}
                                />
                              )}
                            </form.Field>
                          )}
                        </form.Field>
                      )}
                    </form.Field>
                  )}
                  {step === 3 && recipient && (
                    <form.Subscribe
                      selector={(s) => ({
                        amount: s.values.amount,
                        category: s.values.category,
                        note: s.values.note,
                      })}
                    >
                      {({ amount, category, note }) => (
                        <Step3
                          recipient={recipient}
                          balanceInPiastres={balanceInPiastres}
                          amount={amount}
                          category={category}
                          note={note}
                          animClass={animClass}
                        />
                      )}
                    </form.Subscribe>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          {!sent ? (
            <div
              style={{
                borderTop: '2px solid #1a1a1a',
                padding: '16px 24px',
                display: 'flex',
                gap: 12,
                background: '#000',
                flexShrink: 0,
              }}
            >
              {step === 1 ? (
                <button
                  onClick={handleClose}
                  type="button"
                  style={{
                    border: '2px solid #333',
                    background: 'transparent',
                    color: '#888',
                    padding: '14px 20px',
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  CANCEL
                </button>
              ) : (
                <button
                  onClick={() => goTo(step - 1)}
                  type="button"
                  style={{
                    border: '2px solid #444',
                    background: 'transparent',
                    color: '#ccc',
                    padding: '14px 20px',
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'inherit',
                  }}
                >
                  <ArrowLeft size={14} strokeWidth={2.5} /> BACK
                </button>
              )}

              <div style={{ flex: 1 }} />

              {step === 1 && (
                <button
                  type="button"
                  onClick={() => canNext1 && goTo(2)}
                  disabled={!canNext1}
                  style={{
                    border: `3px solid ${canNext1 ? '#000' : '#1a1a1a'}`,
                    background: canNext1 ? '#00ff87' : '#1a1a1a',
                    color: canNext1 ? '#000' : '#333',
                    padding: '14px 28px',
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.1em',
                    cursor: canNext1 ? 'pointer' : 'not-allowed',
                    boxShadow: canNext1 ? '4px 4px 0 #000' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  NEXT →
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => canReview && goTo(3)}
                  disabled={!canReview}
                  style={{
                    border: `3px solid ${canReview ? '#000' : '#1a1a1a'}`,
                    background: canReview ? '#00ff87' : '#1a1a1a',
                    color: canReview ? '#000' : '#333',
                    padding: '14px 28px',
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.1em',
                    cursor: canReview ? 'pointer' : 'not-allowed',
                    boxShadow: canReview ? '4px 4px 0 #000' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  REVIEW →
                </button>
              )}

              {step === 3 && (
                <form.Subscribe selector={(s) => s.isSubmitting}>
                  {(isSubmitting) => (
                    <button
                      type="button"
                      onClick={() => form.handleSubmit()}
                      disabled={isSubmitting || sendMoney.isPending}
                      style={{
                        border: '3px solid #000',
                        background: '#00ff87',
                        color: '#000',
                        padding: '14px 28px',
                        fontWeight: 700,
                        fontSize: 14,
                        letterSpacing: '0.1em',
                        cursor: isSubmitting || sendMoney.isPending ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        boxShadow: '4px 4px 0 #000',
                        opacity: isSubmitting || sendMoney.isPending ? 0.7 : 1,
                        fontFamily: 'inherit',
                      }}
                    >
                      <Send size={16} strokeWidth={2.5} />
                      {isSubmitting || sendMoney.isPending ? 'SENDING…' : 'CONFIRM & SEND'}
                    </button>
                  )}
                </form.Subscribe>
              )}
            </div>
          ) : (
            <div
              style={{
                borderTop: '2px solid #1a1a1a',
                padding: '16px 24px',
                background: '#000',
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleClose}
                type="button"
                style={{
                  border: '3px solid #000',
                  background: '#00ff87',
                  color: '#000',
                  padding: '14px 28px',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: '4px 4px 0 #000',
                  fontFamily: 'inherit',
                }}
              >
                CLOSE
              </button>
            </div>
          )}

          {sendMoney.isError && (
            <div
              style={{
                padding: '10px 24px',
                background: '#1a0000',
                borderTop: '2px solid #ba1a1a',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <AlertTriangle size={14} strokeWidth={2.5} color="#ff4444" />
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  color: '#ff4444',
                  fontWeight: 700,
                }}
              >
                TRANSFER FAILED — PLEASE TRY AGAIN
              </span>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
