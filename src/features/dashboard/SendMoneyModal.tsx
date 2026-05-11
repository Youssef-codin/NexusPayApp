import { useState, useMemo } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useForm } from '@tanstack/react-form';
import { Check, X, ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { useSendMoney, useTransfers } from '#/hooks/use-transfers';
import { useOnlineStatus } from '#/hooks/use-online-status';
import type { UserSearchResult } from '#/types';
import { StepIndicator, RecipientStep, AmountStep, CATS } from './send-money-shared';

const STEP_LABELS = ['RECIPIENT', 'AMOUNT', 'CONFIRM'];

function ConfirmStep({
  recipient,
  balanceInPiastres,
  amount,
  category,
  animClass,
}: {
  recipient: UserSearchResult;
  balanceInPiastres: number;
  amount: string;
  category: string;
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
  const isOnline = useOnlineStatus();
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
    defaultValues: { to_wallet_id: '', amount: '', category: '' },
    onSubmit: async ({ value }) => {
      const piastres = Math.round((parseFloat(value.amount) || 0) * 100);
      const result = await sendMoney.mutateAsync({
        to_wallet_id: value.to_wallet_id,
        amount_in_piastres: piastres,
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

  const handleClearStep1 = () => {
    setRecipient(null);
    form.setFieldValue('to_wallet_id', '');
  };

  const balanceEGP = balanceInPiastres / 100;
  const numericAmount = parseFloat(form.state.values.amount) || 0;
  const canNext1 = !!recipient;

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
            {!sent && <StepIndicator step={step} labels={STEP_LABELS} />}
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
                    <form.Subscribe
                      selector={(s) => ({ amount: s.values.amount, category: s.values.category })}
                    >
                      {({ amount, category }) => (
                        <ConfirmStep
                          recipient={recipient}
                          balanceInPiastres={balanceInPiastres}
                          amount={amount}
                          category={category}
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
                <form.Subscribe selector={(s) => s.values.amount}>
                  {(amountVal) => {
                    const canReview =
                      (parseFloat(amountVal) || 0) >= 10 &&
                      (parseFloat(amountVal) || 0) <= balanceEGP;
                    return (
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
                    );
                  }}
                </form.Subscribe>
              )}

              {step === 3 && (
                <form.Subscribe selector={(s) => s.isSubmitting}>
                  {(isSubmitting) => (
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
