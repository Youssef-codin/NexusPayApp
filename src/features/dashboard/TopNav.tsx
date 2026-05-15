import { useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, Menu, X } from 'lucide-react';
import { NexusPayLogo } from '#/components/NexusPayLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '#/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/components/ui/tooltip';
import { cn } from '#/lib/utils';
import { useAuthStore } from '#/store/auth-store';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard' as const },
  { label: 'Payments', to: '/payments' as const },
  { label: 'Analytics', to: '/analytics' as const },
] as const;

function MobileNavItem({ label, to, onClose }: { label: string; to: string; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = to === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(to);
  const comingSoon = label === 'Analytics';

  if (comingSoon) {
    return (
      <span className="flex items-center border-l-2 border-transparent px-5 py-3 text-sm font-medium uppercase tracking-[0.15em] text-white/25 line-through">
        {label}
      </span>
    );
  }

  return (
    <Link
      to={to as '/'}
      onClick={onClose}
      className={cn(
        'flex items-center border-l-2 px-5 py-3 text-sm font-medium uppercase tracking-[0.15em] transition-colors',
        active
          ? 'border-[#00ff87] bg-white/5 text-white'
          : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white'
      )}
    >
      {label}
    </Link>
  );
}

function NavLink({ label, to }: { label: string; to: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const active = to === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(to);

  const comingSoon = label === 'Analytics';

  if (comingSoon) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="relative cursor-default px-1 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-white/30 line-through">
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border border-[#00ff87]/20 bg-black px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ff87]"
        >
          coming_soon
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      to={to as '/'}
      className={cn(
        'relative px-1 pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors',
        active ? 'text-white' : 'text-white/50 hover:text-white'
      )}
    >
      {label}
      {active && <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#00ff87]" />}
    </Link>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate({ to: '/login' });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="User menu"
          className="flex h-8 w-8 items-center justify-center bg-[#00ff87] text-black text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80 focus:outline-none"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-none border-2 border-white/20 bg-black p-0 shadow-[4px_4px_0_#00ff87]"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#00ff87] text-black text-xs font-bold uppercase tracking-wider">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              {user?.full_name}
            </p>
            <p className="truncate font-mono text-[10px] text-white/40">{user?.email}</p>
          </div>
        </div>
        <div className="p-1">
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer rounded-none px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 focus:bg-white/5 focus:text-white focus:[&_svg]:text-white"
          >
            <LogOut className="mr-2 h-3.5 w-3.5 text-inherit!" />
            Sign Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  function handleMobileLogout() {
    setMobileOpen(false);
    logout();
    queryClient.clear();
    navigate({ to: '/login' });
  }

  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center bg-[#00ff87] text-black">
            <NexusPayLogo type="icon" size={20} />
          </span>
          <span className="text-lg font-semibold uppercase tracking-[0.15em] text-white">
            NexusPay
          </span>
        </Link>

        <TooltipProvider delayDuration={100}>
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.label} label={item.label} to={item.to} />
            ))}
          </nav>
        </TooltipProvider>

        <div className="flex items-center gap-3">
          <UserMenu />
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:text-white md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-72 border-r-2 border-white/20 bg-black p-0 text-white"
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center bg-[#00ff87] text-black">
                  <NexusPayLogo type="icon" size={18} />
                </span>
                <span className="text-base font-semibold uppercase tracking-[0.15em] text-white">
                  NexusPay
                </span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col py-4">
              {NAV_ITEMS.map((item) => (
                <MobileNavItem
                  key={item.label}
                  label={item.label}
                  to={item.to}
                  onClose={() => setMobileOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-auto border-t border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#00ff87] text-xs font-bold uppercase tracking-wider text-black">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                    {user?.full_name}
                  </p>
                  <p className="truncate font-mono text-[10px] text-white/40">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleMobileLogout}
                className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
