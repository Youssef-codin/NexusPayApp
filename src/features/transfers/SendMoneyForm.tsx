import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendMoneySchema, type SendMoneyInput } from "#/lib/schemas"
import { useSendMoney } from "#/hooks/use-transfers"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

export function SendMoneyForm() {
  const sendMoney = useSendMoney()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMoneyInput>({
    resolver: zodResolver(sendMoneySchema),
  })

  const onSubmit = async (data: SendMoneyInput) => {
    try {
      await sendMoney.mutateAsync(data)
      reset()
    } catch {
      // Error handled by query
    }
  }

  return (
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
          Send Money
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Recipient ID
            </label>
            <Input
              {...register("recipientId")}
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="Recipient ID"
            />
            {errors.recipientId && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.recipientId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Recipient Name
            </label>
            <Input
              {...register("recipientName")}
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="Full Name"
            />
            {errors.recipientName && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.recipientName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Amount (Piastres)
            </label>
            <Input
              {...register("amount", { valueAsNumber: true })}
              type="number"
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="1000 = 10 EGP"
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.amount.message}
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
          <Button
            type="submit"
            disabled={sendMoney.isPending}
            className="w-full bg-[#00ff87] text-black hover:bg-[#00cc6a] border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000]"
          >
            {sendMoney.isPending ? "Sending..." : "Send Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}