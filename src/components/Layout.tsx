import { Outlet, Link, useMatch } from "@tanstack/react-router"
import { cn } from "#/lib/utils"
import { useAuthStore } from "#/store/auth-store"
import { Wallet, Send, Calendar, User, LogOut } from "lucide-react"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Wallet },
  { to: "/transfers", label: "Transfers", icon: Send },
  { to: "/scheduled", label: "Scheduled", icon: Calendar },
  { to: "/profile", label: "Profile", icon: User },
]

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Wallet }) {
  const isActive = useMatch({ from: to, shouldThrow: false })

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all",
        isActive
          ? "bg-[#00ff87] text-black border-l-8 border-black"
          : "text-white hover:bg-neutral-800"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  )
}

export function Layout() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  return (
    <div className="flex min-h-screen bg-[#fcf8ff]">
      <aside className="w-64 bg-black flex flex-col">
        <div className="p-6 border-b-2 border-white">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            NEXUS
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="p-4 border-t-2 border-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00ff87] flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="text-white">
              <p className="text-sm font-bold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-neutral-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white hover:text-[#00ff87] text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}