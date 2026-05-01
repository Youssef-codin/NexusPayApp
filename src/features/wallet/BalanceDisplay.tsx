import { useWallet } from "#/hooks/use-wallet"
import { formatCurrency } from "#/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { CardSkeleton } from "#/components/LoadingSpinner"

export function BalanceDisplay() {
  const { data: wallet, isLoading, error } = useWallet()

  if (isLoading) {
    return <CardSkeleton />
  }

  if (error || !wallet) {
    return (
      <Card className="border-2 border-black bg-white">
        <CardContent className="pt-6">
          <p className="text-red-600 font-medium">Failed to load wallet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
          Available Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-5xl font-bold text-black tracking-tight">
          {formatCurrency(wallet.balance)}
        </p>
        <p className="text-sm text-neutral-600 mt-2 font-medium">
          EGP
        </p>
      </CardContent>
    </Card>
  )
}