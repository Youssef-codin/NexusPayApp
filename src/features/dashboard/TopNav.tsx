import { Link } from "@tanstack/react-router"
import { Bell, HelpCircle, User } from "lucide-react"
import { NexusPayLogo } from "#/components/NexusPayLogo"
import { Button } from "#/components/ui/button"
import { cn } from "#/lib/utils"

interface NavItem {
  label: string
  to: string
  active?: boolean
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", active: true },
  { label: "Payments", to: "/" },
  { label: "Analytics", to: "/" },
  { label: "Settings", to: "/" },
]

function NavLink({ label, to, active }: NavItem) {
  return (
    <Link
      to={to}
      className={cn(
        "relative px-1 pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors",
        active
          ? "text-white"
          : "text-white/50 hover:text-white"
      )}
    >
      {label}
      {active && (
        <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#00ff87]" />
      )}
    </Link>
  )
}

function IconButton({
  children,
  ariaLabel,
  filled = false,
}: {
  children: React.ReactNode
  ariaLabel: string
  filled?: boolean
}) {
  return (
    <Button
      type="button"
      aria-label={ariaLabel}
      size={filled ? "icon-nav-filled" : "icon-nav"}
    >
      {children}
    </Button>
  )
}

export function TopNav() {
  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6">
        <div className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center bg-[#00ff87] text-black">
            <NexusPayLogo type="icon" size={20} />
          </span>
          <span className="text-lg font-semibold uppercase tracking-[0.15em] text-white">
            NexusPay
          </span>
        </div>

        <nav className="flex items-center gap-10">
          {navItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <IconButton ariaLabel="Notifications">
            <Bell className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Help">
            <HelpCircle className="h-4 w-4" />
          </IconButton>
          <Button type="button" aria-label="Profile" size="icon-nav-filled">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
