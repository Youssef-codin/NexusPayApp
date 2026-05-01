import { useState } from "react"
import { Button } from "#/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog"
import { Input } from "#/components/ui/input"

export function TopUpButton() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")

  const handleTopUp = () => {
    console.log("Top up:", amount)
    setOpen(false)
    setAmount("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00ff87] text-black hover:bg-[#00cc6a] border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000]">
          Top Up
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-black bg-white shadow-[8px_8px_0px_#000000] max-w-sm">
        <DialogHeader className="border-b-2 border-black pb-4">
          <DialogTitle className="text-xl font-bold text-black uppercase tracking-wider">
            Top Up Wallet
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Amount (EGP)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleTopUp}
              className="flex-1 bg-[#00ff87] text-black hover:bg-[#00cc6a] border-2 border-black font-bold uppercase tracking-wider"
            >
              Confirm
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="border-2 border-black hover:bg-neutral-100 font-bold uppercase tracking-wider"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}