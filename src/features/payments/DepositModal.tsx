import { useState } from 'react';
import { useOnlineStatus } from '#/hooks/use-online-status';
import { Dialog } from 'radix-ui';
import { Elements, useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { useQueryClient } from '@tanstack/react-query';
import { useTopUp, useWallet } from '#/hooks/use-wallet';
import { queryKeys } from '#/lib/query-keys';
import { stripePromise } from '#/lib/stripe';
import { AmountStep } from './steps/AmountStep';
import { CardStep } from './steps/CardStep';
import { ConfirmStep } from './steps/ConfirmStep';
import { SuccessStep } from './steps/SuccessStep';

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<number, string> = { 1: 'Amount', 2: 'Card', 3: 'Confirm' };

interface StepDotProps {
  n: number;
  label: string;
  current: Step;
}

function StepDot({ n, label, current }: StepDotProps) {
  const done = current > n;
  const active = current === n;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`flex h-7 w-7 items-center justify-center border-2 font-mono text-[11px] font-bold transition-all ${
          active || done
            ? 'border-[#00ff87] bg-[#00ff87] text-black'
            : 'border-[#333] bg-[#1e1e1e] text-neutral-500'
        }`}
      >
        {done ? '✓' : `0${n}`}
      </div>
      <span
        className={`text-[9px] font-bold uppercase tracking-[0.16em] transition-colors ${
          active || done ? 'text-[#00ff87]' : 'text-neutral-600'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function DepositModalInner({ isOpen, onClose }: DepositModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>(1);
  const [amountEGP, setAmountEGP] = useState(500);
  const [cardholderName, setCardholderName] = useState('');
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const topUp = useTopUp();
  const isOnline = useOnlineStatus();
  const { data: wallet } = useWallet();

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(1);
      setAmountEGP(500);
      setCardholderName('');
      setConfirmError(null);
      setIsConfirming(false);
      topUp.reset();
    }, 200);
  }

  async function handleContinue() {
    try {
      await topUp.mutateAsync(amountEGP * 100);
    } catch {
      // Backend error — advance anyway so user reaches the card UI.
    }
    setStep(2);
  }

  function handlePay(name: string) {
    setCardholderName(name);
    setStep(3);
  }

  async function handleConfirm() {
    if (!stripe || !elements || !topUp.data?.client_secret) {
      setConfirmError('Session expired. Please go back and try again.');
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    setIsConfirming(true);
    setConfirmError(null);
    try {
      const { error } = await stripe.confirmCardPayment(topUp.data.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardholderName },
        },
      });
      if (error) {
        setConfirmError(error.message ?? 'Payment failed. Please try again.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all });
      setStep(4);
    } catch {
      setConfirmError('Network error. Please check your connection and try again.');
    } finally {
      setIsConfirming(false);
    }
  }

  const newBalanceEGP = (wallet?.balance ?? 0) / 100 + (step === 4 ? amountEGP : 0);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/72 backdrop-blur-[10px]" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex w-[550px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border-[3px] border-[#111] bg-[#0a0a0a] shadow-[12px_12px_0_#000] outline-none"
          style={{ maxHeight: '96vh' }}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="shrink-0 border-b-[3px] border-[#00ff87] bg-black px-6 pb-0 pt-5">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-1.5 shrink-0 bg-[#00ff87]" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-neutral-700">
                    NexusPay · Stripe
                  </p>
                  <Dialog.Title className="text-lg font-bold tracking-tight text-white">
                    Top Up Balance
                  </Dialog.Title>
                  <p className="text-[9px] uppercase tracking-[0.14em] text-[#3a3a3a]">
                    Visa · Mastercard · Amex · Instant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#252525] text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-300"
              >
                ✕
              </button>
            </div>

            {/* Step indicator — hidden on success */}
            {step < 4 && (
              <div className="mb-5 flex items-center">
                {[1, 2, 3].map((n, i) => (
                  <>
                    <StepDot key={n} n={n} label={STEP_LABELS[n]} current={step} />
                    {i < 2 && (
                      <div
                        key={`line-${n}`}
                        className={`mx-2 mb-5 h-0.5 flex-1 transition-colors duration-300 ${step > n ? 'bg-[#00ff87]' : 'bg-[#252525]'}`}
                      />
                    )}
                  </>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
            {step === 1 && (
              <AmountStep
                amountEGP={amountEGP}
                onAmountChange={setAmountEGP}
                onContinue={handleContinue}
                isLoading={topUp.isPending || !isOnline}
              />
            )}

            {/* CardStep stays in the DOM from step 2 onward (display:none on step 3)
                so Stripe iframes remain mounted for elements.getElement() in handleConfirm */}
            <div className={step === 2 || step === 3 ? '' : 'hidden'}>
              <div className={step !== 2 ? 'hidden' : ''}>
                <CardStep amountEGP={amountEGP} onBack={() => setStep(1)} onPay={handlePay} />
              </div>
              {step === 3 && (
                <ConfirmStep
                  amountEGP={amountEGP}
                  onBack={() => setStep(2)}
                  onConfirm={handleConfirm}
                  isLoading={isConfirming || !isOnline}
                  error={confirmError}
                />
              )}
            </div>

            {step === 4 && (
              <SuccessStep
                amountEGP={amountEGP}
                newBalanceEGP={newBalanceEGP}
                onClose={handleClose}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [sessionKey, setSessionKey] = useState(0);

  function handleClose() {
    onClose();
    // Remount Elements after close animation so card fields are blank on next open
    setTimeout(() => setSessionKey((k) => k + 1), 300);
  }

  return (
    <Elements key={sessionKey} stripe={stripePromise}>
      <DepositModalInner isOpen={isOpen} onClose={handleClose} />
    </Elements>
  );
}
