import { createFileRoute } from '@tanstack/react-router';
import { PaymentsPage } from '#/features/payments/PaymentsPage';

export const Route = createFileRoute('/_auth/payments')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as 'wallet' | 'transfers' | 'scheduled' | undefined) ?? 'wallet',
  }),
  component: Payments,
});

function Payments() {
  const { tab } = Route.useSearch();
  return <PaymentsPage initialTab={tab} />;
}
