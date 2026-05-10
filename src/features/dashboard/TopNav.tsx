import { Link, useRouterState } from '@tanstack/react-router';
import { Bell, HelpCircle, User } from 'lucide-react';
import { NexusPayLogo } from '#/components/NexusPayLogo';
import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/' as const },
  { label: 'Payments', to: '/payments' as const },
  { label: 'Analytics', to: '/' as const },
  { label: 'Settings', to: '/' as const },
] as const;

function NavLink({ label, to }: { label: string; to: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const active = to === '/' ? pathname === '/' : pathname.startsWith(to);

  // Analytics and Settings are not implemented yet
  const disabled = label === 'Analytics' || label === 'Settings';

  return (
    <Link
      to={to as '/'}
      aria-disabled={disabled}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      className={cn(
        'relative px-1 pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors',
        active ? 'text-white' : 'text-white/50 hover:text-white',
        disabled && 'cursor-default opacity-40'
      )}
    >
      {label}
      {active && <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#00ff87]" />}
    </Link>
  );
}

export function TopNav() {
  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-8 px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center bg-[#00ff87] text-black">
            <NexusPayLogo type="icon" size={20} />
          </span>
          <span className="text-lg font-semibold uppercase tracking-[0.15em] text-white">
            NexusPay
          </span>
        </Link>

        <nav className="flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} label={item.label} to={item.to} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button type="button" aria-label="Notifications" size="icon-nav">
            <Bell className="h-4 w-4" />
          </Button>
          <Button type="button" aria-label="Help" size="icon-nav">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button type="button" aria-label="Profile" size="icon-nav-filled">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
