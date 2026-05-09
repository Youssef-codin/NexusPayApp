import type { ReactNode } from 'react';
import { TopNav } from '#/features/dashboard/TopNav';

export function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcf8ff]">
      <TopNav />
      <main className="mx-auto max-w-[1600px] px-4 sm:px-8 py-8">{children}</main>
    </div>
  );
}
