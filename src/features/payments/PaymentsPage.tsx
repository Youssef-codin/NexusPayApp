import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { SendMoneyModal } from '#/features/dashboard/SendMoneyModal';
import { useWallet } from '#/hooks/use-wallet';
import { DepositModal } from './DepositModal';
import { WalletTab } from './WalletTab';
import { TransfersTab } from './TransfersTab';
import { ScheduledTab } from './ScheduledTab';
import { ScheduleMoneyModal } from './ScheduleMoneyModal';

type TabId = 'wallet' | 'transfers' | 'scheduled';

const TABS: { id: TabId; label: string; path: string }[] = [
  { id: 'wallet', label: 'Wallet', path: '/payments/' },
  { id: 'transfers', label: 'Transfers', path: '/payments/transfers' },
  { id: 'scheduled', label: 'Scheduled', path: '/payments/scheduled' },
];

interface PaymentsPageProps {
  activeTab?: TabId;
}

export function PaymentsPage({ activeTab = 'wallet' }: PaymentsPageProps) {
  const navigate = useNavigate();
  const [depositOpen, setDepositOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const { data: wallet } = useWallet();

  const handleTabClick = (tab: TabId) => {
    const target = TABS.find((t) => t.id === tab);
    if (target) {
      navigate({ to: target.path as any });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-neutral-400">
          NexusPay
        </p>
        <h1 className="text-5xl font-bold tracking-tighter text-black">PAYMENTS</h1>
      </div>

      {/* Tab bar */}
      <div className="flex border-b-4 border-black">
        {TABS.map(({ id, label }) => {
          const active = id === activeTab;
          return (
            <button
              type="button"
              key={id}
              onClick={() => handleTabClick(id)}
              className={`px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors ${
                active
                  ? '-mb-[4px] border-b-4 border-[#00ff87] bg-black text-[#00ff87]'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex flex-col">
        {activeTab === 'wallet' && <WalletTab onDeposit={() => setDepositOpen(true)} />}
        {activeTab === 'transfers' && <TransfersTab onNewTransfer={() => setSendOpen(true)} />}
        {activeTab === 'scheduled' && <ScheduledTab onNewSchedule={() => setScheduleOpen(true)} />}
      </div>

      {/* Modals */}
      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
      <SendMoneyModal
        isOpen={sendOpen}
        onClose={() => setSendOpen(false)}
        balanceInPiastres={wallet?.balance ?? 0}
      />
      <ScheduleMoneyModal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        balanceInPiastres={wallet?.balance ?? 0}
      />
    </div>
  );
}
