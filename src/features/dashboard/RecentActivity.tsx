import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Inbox, Wallet } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { TransactionRow } from './TransactionRow';
import type { ActivityItem } from '#/types/dashboard';

function ViewAllLink() {
  return (
    <Link
      to="/payments/transfers"
      className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400 underline transition-colors hover:text-black"
    >
      View All
    </Link>
  );
}

interface RecentActivityProps {
  items: ActivityItem[];
  totalCount?: number;
}

const PAGE_SIZE = 10;

export function RecentActivity({ items, totalCount = 0 }: RecentActivityProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedItems = items.slice(startIndex, startIndex + PAGE_SIZE);

  if (items.length === 0) {
    return (
      <section>
        <header className="flex items-end justify-between border-b-2 border-black pb-3">
          <h2 className="text-xl font-semibold uppercase tracking-tight text-black">
            Recent Activity
          </h2>
          <Button type="button" variant="link" size="xs">
            View All
          </Button>
        </header>

        <div className="mt-5">
          <div className="flex flex-col items-center justify-center border-2 border-black bg-white p-12 text-center shadow-[6px_6px_0px_#000000]">
            <div className="mb-6 border-2 border-black bg-neutral-100 p-4">
              <Inbox className="size-10 text-black stroke-[1.5]" />
            </div>
            <h3 className="mb-2 text-xl font-black uppercase tracking-widest text-black">
              No activity yet
            </h3>
            <p className="mb-10 max-w-[280px] text-sm font-medium text-neutral-500">
              Your transactions will appear here once you start using NexusPay.
            </p>
            <Button asChild variant="dark" className="h-12 px-8 text-xs font-black tracking-widest">
              <Link to="/transfers">
                <Wallet className="mr-2 size-5 stroke-[3]" />
                MAKE A TRANSACTION
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <header className="flex items-end justify-between border-b-2 border-black pb-3">
        <h2 className="text-xl font-semibold uppercase tracking-tight text-black">
          Recent Activity
        </h2>
        <ViewAllLink />
      </header>

      <div className="mt-5">
        <div className="space-y-4">
          {paginatedItems.map((item) => (
            <TransactionRow key={item.id} item={item} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t-2 border-black pt-3">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page === 1}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-600">
              Page {page} of {totalPages}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        <div className="mt-2 text-center text-xs font-medium uppercase tracking-widest text-neutral-600">
          Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, items.length)} of {totalCount}{' '}
          transactions
        </div>
      </div>
    </section>
  );
}
