import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/transfers')({
  component: Transfers,
});

function Transfers() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Transfers</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
