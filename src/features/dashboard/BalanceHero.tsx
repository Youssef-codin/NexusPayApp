import { Plus, Send, Wallet } from 'lucide-react';
import { Button } from '#/components/ui/button';

interface BalanceHeroProps {
  balanceInPiastres: number;
  onSend?: () => void;
  onDeposit?: () => void;
}

function splitAmount(piastres: number): { integer: string; decimal: string } {
  const egp = piastres / 100;
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatted = formatter.format(egp);
  const [integer, decimal = '00'] = formatted.split('.');
  return { integer, decimal };
}

export function BalanceHero({ balanceInPiastres, onSend, onDeposit }: BalanceHeroProps) {
  const { integer, decimal } = splitAmount(balanceInPiastres);

  return (
    <section className="relative overflow-hidden bg-[#00ff87] shadow-[8px_8px_0px_#000000]">
      {/* Background Wallet Icon */}
      <div className="pointer-events-none absolute bottom-0 right-0 hidden translate-x-1/4 translate-y-1/4 text-black/5 md:block">
        <Wallet className="size-100 -rotate-12 stroke-1" />
      </div>

      <div className="relative flex flex-col gap-10 p-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-black/50">
            Total Balance
          </p>
          <div className="flex items-baseline leading-none text-black">
            <span className="text-5xl font-black opacity-30">EGP</span>
            <span className="ml-5 text-7xl font-bold tracking-tighter md:text-8xl">{integer}</span>
            <span className="ml-1 text-4xl font-bold opacity-30">.{decimal}</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-6 md:w-[320px]">
          <Button
            type="button"
            variant="dark"
            onClick={onDeposit}
            className="h-12 text-xs font-black tracking-widest"
          >
            <Plus className="mr-2 h-5 w-5 stroke-3" />
            DEPOSIT
          </Button>
          <Button
            type="button"
            variant="white"
            onClick={onSend}
            className="h-12 border-white text-xs font-black tracking-widest hover:border-neutral-50"
          >
            <Send className="mr-2 h-5 w-5 -rotate-12 stroke-3" />
            SEND
          </Button>
        </div>
      </div>
    </section>
  );
}
