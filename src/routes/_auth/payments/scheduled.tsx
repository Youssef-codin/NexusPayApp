import { createFileRoute } from '@tanstack/react-router';
import { PaymentsPage } from '#/features/payments/PaymentsPage';

export const Route = createFileRoute('/_auth/payments/scheduled')({
  component: () => <PaymentsPage activeTab="scheduled" />,
});
