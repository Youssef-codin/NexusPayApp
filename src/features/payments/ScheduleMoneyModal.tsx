import { useState, useMemo } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useForm } from '@tanstack/react-form';
import { X, ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { useSendMoney, useTransfers } from '#/hooks/use-transfers';
import { useOnlineStatus } from '#/hooks/use-online-status';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '#/lib/query-keys';
import type { UserSearchResult } from '#/types';
import {
  StepIndicator,
  RecipientStep,
  AmountStep,
  RecipientChip,
  CATS,
} from '#/features/dashboard/send-money-shared';

const STEP_LABELS = ['RECIPIENT', 'AMOUNT', 'SCHEDULE', 'CONFIRM'];

function buildTimeOptions(): { label: string; value: string }[] {
  const opts: { label: string; value: string }[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const period = h < 12 ? 'AM' : 'PM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m === 0 ? '00' : '30';
      opts.push({
        label: `${String(displayH).padStart(2, '0')}:${displayM} ${period}`,
        value: `${String(h).padStart(2, '0')}:${displayM}`,
      });
    }
  }
  return opts;
}

const TIME_OPTIONS = buildTimeOptions();

function ScheduleStep({
  recipient,
  dateField,
  timeField,
  animClass,
}: {
  recipient: UserSearchResult;
  dateField: { value: string; onChange: (v: string) => void };
  timeField: { value: string; onChange: (v: string) => void };
  animClass: string;
}) {
  const labelStyle = {
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: '0.2em',
    fontWeight: 700,
    color: '#888',
    marginBottom: 10,
  } as const;

  const inputStyle = {
    width: '100%',
    border: '2px solid #444',
    background: '#111',
    color: '#fff',
    padding: '14px 16px',
    fontSize: 16,
    fontWeight: 600,
    outline: 'none',
    fontFamily: 'inherit',
    letterSpacing: '-0.01em',
    colorScheme: 'dark',
  } as const;

  return (
    <div className={animClass} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <RecipientChip recipient={recipient} />

      {/* When to send */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 14,
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 700,
            color: '#00ff87',
          }}
        >
          <Clock size={14} strokeWidth={2.5} />
          WHEN TO SEND
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={labelStyle}>DATE</div>
            <input
              type="date"
              value={dateField.value}
              onChange={(e) => dateField.onChange(e.target.value)}
              min={new Date().toLocaleDateString('en-CA')}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>TIME</div>
            <select
              value={timeField.value}
              onChange={(e) => timeField.onChange(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleConfirmStep({
  recipient,
  amount,
  category,
  date,
  time,
  animClass,
}: {
  recipient: UserSearchResult;
  amount: string;
  category: string;
  date: string;
  time: string;
  animClass: string;
}) {
  const numericAmount = parseFloat(amount) || 0;
  const fmtEGP = (n: number) =>
    n.toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const catLabel = CATS.find((c) => c.id === category)?.label;

  const firstSend =
    date && time
      ? new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
          .format(new Date(`${date}T${time}:00`))
          .toUpperCase()
      : '—';

  const rows = [
    {
      key: 'SENDING TO',
      val: (
        <span style={{ fontWeight: 700, color: '#fff' }}>
          {recipient.full_name}{' '}
          <span style={{ color: '#00ff87', fontSize: 13 }}>
            @{recipient.full_name.toLowerCase().replace(/\s+/g, '')}
          </span>
        </span>
      ),
    },
    {
      key: 'AMOUNT',
      val: <span style={{ fontWeight: 700, color: '#00ff87' }}>EGP {fmtEGP(numericAmount)}</span>,
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
    { key: 'FIRST SEND', val: <span style={{ color: '#fff', fontWeight: 700 }}>{firstSend}</span> },
    { key: 'FEE', val: <span style={{ color: '#00ff87', fontWeight: 700 }}>EGP 0.00 — FREE</span> },
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 700,
            color: '#00ff87',
            marginBottom: 10,
          }}
        >
          <Clock size={14} strokeWidth={2.5} />
          SCHEDULED TRANSFER
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
          SCHEDULED TRANSFERS CAN BE CANCELLED FROM THE PAYMENTS DASHBOARD BEFORE THEY ARE
          PROCESSED.
        </span>
      </div>
    </div>
  );
}

export interface ScheduleMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  balanceInPiastres: number;
}

export function ScheduleMoneyModal({
  isOpen,
  onClose,
  balanceInPiastres,
}: ScheduleMoneyModalProps) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [animKey, setAnimKey] = useState(0);
  const [recipient, setRecipient] = useState<UserSearchResult | null>(null);
  const [scheduled, setScheduled] = useState(false);

  const sendMoney = useSendMoney();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
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

  const defaultTime = TIME_OPTIONS.find((o) => o.value === '09:00')?.value ?? TIME_OPTIONS[0].value;

  const form = useForm({
    defaultValues: {
      to_wallet_id: '',
      amount: '',
      category: '',
      date: '',
      time: defaultTime,
    },
    onSubmit: async ({ value }) => {
      const piastres = Math.round((parseFloat(value.amount) || 0) * 100);
      const scheduledAt = new Date(`${value.date}T${value.time}:00`).toISOString();
      await sendMoney.mutateAsync({
        to_wallet_id: value.to_wallet_id,
        amount_in_piastres: piastres,
        scheduled_at: scheduledAt,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.scheduled.list() });
      setScheduled(true);
    },
  });

  const reset = () => {
    setStep(1);
    setDir('fwd');
    setAnimKey(0);
    setRecipient(null);
    setScheduled(false);
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

  const handleClearStep1 = () => {
    setRecipient(null);
    form.setFieldValue('to_wallet_id', '');
  };

  const balanceEGP = balanceInPiastres / 100;
  const animClass =
    dir === 'fwd'
      ? 'animate-in fade-in-0 slide-in-from-right-8 duration-300'
      : 'animate-in fade-in-0 slide-in-from-left-8 duration-300';

  const TITLES = ['SELECT RECIPIENT', 'AMOUNT & CATEGORY', 'SCHEDULE', 'CONFIRM TRANSFER'];

  const canSchedule = (date: string) => !!date;

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
            maxWidth: 640,
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
            Schedule Transfer
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
                    NEXUSPAY · SCHEDULED
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
                    {scheduled ? 'TRANSFER SCHEDULED' : TITLES[step - 1]}
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
            {!scheduled && <StepIndicator step={step} labels={STEP_LABELS} />}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', minHeight: 0 }}>
            {scheduled ? (
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
                  <Clock size={32} strokeWidth={2.5} color="#000" />
                </div>
                <div
                  style={{ fontWeight: 700, fontSize: 32, letterSpacing: '-0.03em', color: '#fff' }}
                >
                  TRANSFER SCHEDULED
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
                  EGP{' '}
                  {(parseFloat(form.state.values.amount) || 0).toLocaleString('en-EG', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  → {recipient?.full_name}
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: '#444',
                    marginTop: 6,
                    letterSpacing: '0.1em',
                  }}
                >
                  VIEW IN PAYMENTS → SCHEDULED
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
                    <RecipientStep
                      selectedRecipient={recipient}
                      onSelect={handleSelectRecipient}
                      onClear={handleClearStep1}
                      animClass={animClass}
                      recentRecipients={recentRecipients}
                    />
                  )}
                  {step === 2 && recipient && (
                    <form.Field name="amount">
                      {(amountF) => (
                        <form.Field name="category">
                          {(categoryF) => (
                            <AmountStep
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
                              animClass={animClass}
                            />
                          )}
                        </form.Field>
                      )}
                    </form.Field>
                  )}
                  {step === 3 && recipient && (
                    <form.Field name="date">
                      {(dateF) => (
                        <form.Field name="time">
                          {(timeF) => (
                            <ScheduleStep
                              recipient={recipient}
                              dateField={{ value: dateF.state.value, onChange: dateF.handleChange }}
                              timeField={{ value: timeF.state.value, onChange: timeF.handleChange }}
                              animClass={animClass}
                            />
                          )}
                        </form.Field>
                      )}
                    </form.Field>
                  )}
                  {step === 4 && recipient && (
                    <form.Subscribe
                      selector={(s) => ({
                        amount: s.values.amount,
                        category: s.values.category,
                        date: s.values.date,
                        time: s.values.time,
                      })}
                    >
                      {({ amount, category, date, time }) => (
                        <ScheduleConfirmStep
                          recipient={recipient}
                          amount={amount}
                          category={category}
                          date={date}
                          time={time}
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
          {!scheduled ? (
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

              <form.Subscribe
                selector={(s) => ({
                  amount: s.values.amount,
                  date: s.values.date,
                  isSubmitting: s.isSubmitting,
                })}
              >
                {({ amount, date, isSubmitting }) => {
                  const canNext1 = !!recipient;
                  const canNext2 =
                    (parseFloat(amount) || 0) >= 10 && (parseFloat(amount) || 0) <= balanceEGP;
                  const canNext3 = canSchedule(date);

                  if (step === 1) {
                    return (
                      <button
                        type="button"
                        onClick={() => canNext1 && goTo(2)}
                        disabled={!canNext1}
                        style={nextBtnStyle(canNext1)}
                      >
                        NEXT →
                      </button>
                    );
                  }
                  if (step === 2) {
                    return (
                      <button
                        type="button"
                        onClick={() => canNext2 && goTo(3)}
                        disabled={!canNext2}
                        style={nextBtnStyle(canNext2)}
                      >
                        NEXT →
                      </button>
                    );
                  }
                  if (step === 3) {
                    return (
                      <button
                        type="button"
                        onClick={() => canNext3 && goTo(4)}
                        disabled={!canNext3}
                        style={nextBtnStyle(canNext3)}
                      >
                        REVIEW →
                      </button>
                    );
                  }
                  return (
                    <button
                      type="button"
                      onClick={() => form.handleSubmit()}
                      disabled={isSubmitting || sendMoney.isPending || !isOnline}
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
                      <Clock size={16} strokeWidth={2.5} />
                      {isSubmitting || sendMoney.isPending ? 'SCHEDULING…' : 'SCHEDULE TRANSFER'}
                    </button>
                  );
                }}
              </form.Subscribe>
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
                SCHEDULING FAILED — PLEASE TRY AGAIN
              </span>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function nextBtnStyle(enabled: boolean): React.CSSProperties {
  return {
    border: `3px solid ${enabled ? '#000' : '#1a1a1a'}`,
    background: enabled ? '#00ff87' : '#1a1a1a',
    color: enabled ? '#000' : '#333',
    padding: '14px 28px',
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.1em',
    cursor: enabled ? 'pointer' : 'not-allowed',
    boxShadow: enabled ? '4px 4px 0 #000' : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  };
}
