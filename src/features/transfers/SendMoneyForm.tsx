import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendMoneySchema, type SendMoneyInput } from "#/lib/schemas"
import { useSendMoney } from "#/hooks/use-transfers"
import { useUserSearch } from "#/hooks/use-user"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Search, User, Calendar } from "lucide-react"

export function SendMoneyForm() {
  const sendMoney = useSendMoney()
  const [searchQuery, setSearchQuery] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const { data: searchResults, isLoading: isSearching } = useUserSearch(searchQuery)
  const [showResults, setShowResults] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SendMoneyInput>({
    resolver: zodResolver(sendMoneySchema),
  })

  const selectedWalletId = watch("to_wallet_id")
  const scheduledAt = watch("scheduled_at")

  const onSubmit = async (data: SendMoneyInput) => {
    try {
      await sendMoney.mutateAsync({
        ...data,
        scheduled_at: data.scheduled_at || undefined,
      })
      reset()
      setSearchQuery("")
      setIsScheduled(false)
    } catch {
      // Error handled by query
    }
  }

  const selectUser = (user: { id: string; full_name: string }) => {
    setValue("to_wallet_id", user.id, { shouldValidate: true })
    setSearchQuery(user.full_name)
    setShowResults(false)
  }

  return (
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
          {isScheduled ? "Schedule Transfer" : "Send Money"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Search Recipient
            </label>
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => setShowResults(true)}
                className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87] pl-10"
                placeholder="Search by name..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
            {showResults && searchQuery && (
              <div className="absolute z-10 w-full mt-1 border-2 border-black bg-white max-h-48 overflow-auto">
                {isSearching ? (
                  <div className="p-3 text-sm text-neutral-500 font-medium">Searching...</div>
                ) : searchResults && searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => selectUser(user)}
                      className="w-full p-3 text-left hover:bg-[#00ff87]/20 flex items-center gap-2 border-b border-neutral-200 last:border-0"
                    >
                      <User className="w-4 h-4" />
                      <div>
                        <p className="font-bold text-black text-sm">{user.full_name}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-sm text-neutral-500 font-medium">No users found</div>
                )}
              </div>
            )}
            {errors.to_wallet_id && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.to_wallet_id.message}
              </p>
            )}
            <input type="hidden" {...register("to_wallet_id")} value={selectedWalletId} />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Amount (Piastres)
            </label>
            <Input
              {...register("amount_in_piastres", { valueAsNumber: true })}
              type="number"
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="1000 = 10 EGP"
            />
            {errors.amount_in_piastres && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.amount_in_piastres.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Note (Optional)
            </label>
            <Input
              {...register("note")}
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="What's it for?"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsScheduled(!isScheduled)
                if (!isScheduled) {
                  setValue("scheduled_at", "")
                } else {
                  setValue("scheduled_at", undefined)
                }
              }}
              className={`flex items-center gap-2 px-3 py-2 border-2 border-black text-sm font-bold uppercase tracking-wider transition-colors ${
                isScheduled ? "bg-[#00ff87] text-black" : "bg-white text-black hover:bg-neutral-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Schedule for later
            </button>
          </div>
          {isScheduled && (
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
                Schedule Date & Time
              </label>
              <Input
                {...register("scheduled_at")}
                type="datetime-local"
                className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              />
              {errors.scheduled_at && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.scheduled_at.message}
                </p>
              )}
            </div>
          )}
          <Button
            type="submit"
            disabled={sendMoney.isPending}
            className="w-full bg-[#00ff87] text-black hover:bg-[#00cc6a] border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000]"
          >
            {sendMoney.isPending
              ? isScheduled
                ? "Scheduling..."
                : "Sending..."
              : isScheduled
              ? "Schedule Transfer"
              : "Send Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}