import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/scheduled')({
  component: Scheduled,
});

function Scheduled() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
        Scheduled Transfers
      </h1>
      <p className="text-neutral-600 font-medium">
        To create a scheduled transfer, go to Transfers and set a future date.
      </p>
    </div>
  );
}
