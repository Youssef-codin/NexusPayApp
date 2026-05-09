import { Check } from 'lucide-react';
import { Fragment } from 'react';

interface StepIndicatorProps {
  step: number;
}

export function StepIndicator({ step }: StepIndicatorProps) {
  const labels = ['RECIPIENT', 'AMOUNT', 'CONFIRM'];

  return (
    <div className="flex items-center mb-7">
      {labels.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;

        return (
          <Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex size-8 items-center justify-center font-mono text-[13px] font-bold transition-all ${
                  done || active
                    ? 'border-[3px] border-[#00ff87] bg-[#00ff87] text-black'
                    : 'border-2 border-[#444] bg-[#2a2a2a] text-[#666]'
                }`}
                style={{
                  boxShadow: active ? '3px 3px 0 #00e478' : 'none',
                }}
              >
                {done ? <Check size={14} strokeWidth={3} /> : `0${num}`}
              </div>
              <span
                className={`font-mono text-[10px] font-bold tracking-[0.16em] transition-colors ${
                  done || active ? 'text-[#00ff87]' : 'text-[#555]'
                }`}
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div
                className="flex-1 h-0.5 mx-2 mb-5.5 transition-colors"
                style={{
                  background: step > num ? '#00ff87' : '#2a2a2a',
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
