import { Plus, Send } from "lucide-react"
import { Button } from "#/components/ui/button"

interface BalanceHeroProps {
  balanceInPiastres: number
}

function splitAmount(piastres: number): { integer: string; decimal: string } {
  const egp = piastres / 100
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const formatted = formatter.format(egp)
  const [integer, decimal = "00"] = formatted.split(".")
  return { integer, decimal }
}

export function BalanceHero({ balanceInPiastres }: BalanceHeroProps) {
  const { integer, decimal } = splitAmount(balanceInPiastres)

  return (
    <section className="relative overflow-hidden border-2 border-black bg-[#00ff87] shadow-[6px_6px_0px_#000000]">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 md:block">
        <svg
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMid slice"
          className="h-full w-full text-black/10"
          aria-hidden="true"
        >
          <path d="M40 20 L160 20 L160 60 L80 60 L80 100 L160 100 L160 140 L40 140 Z" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="170" cy="40" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="170" cy="120" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/70">
            Total Balance
          </p>
          <div className="mt-2 flex items-end font-semibold leading-none text-black">
            <span className="text-3xl">EGP</span>
            <span className="ml-2 text-6xl tracking-tight md:text-7xl">
              {integer}
            </span>
            <span className="text-2xl md:text-3xl">.{decimal}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="dark" size="default">
            <Plus className="h-4 w-4" />
            Deposit
          </Button>
          <Button type="button" variant="dark" size="default">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </section>
  )
}
