import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { loginSchema, type LoginInput } from "#/lib/schemas"
import { useLogin } from "#/hooks/use-auth"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Mail, Lock, ArrowRight } from "lucide-react"

function NexusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 17 L7 7 L17 17 L17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export function LoginForm() {
  const navigate = useNavigate()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await login.mutateAsync(data)
      navigate({ to: "/dashboard" })
    } catch {
      // Error handled by query
    }
  }

  return (
    <div className="p-8 md:p-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <NexusMark className="w-5 h-5 text-black" />
        <span className="text-sm font-bold tracking-[0.25em] text-black">
          NEXUS
        </span>
      </div>

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-black leading-[1.1] mb-3">
        WELCOME TO THE
        <br />
        VAULT
      </h1>
      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
        Authenticate your credentials to access your
        <br className="hidden sm:block" />
        digital assets and transaction history.
      </p>

      <div className="h-px bg-black mb-8" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <Input
              {...register("email")}
              type="email"
              className="pl-10 h-12 border-2 border-black rounded-none bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black focus-visible:shadow-[4px_4px_0px_#00ff87] transition-shadow"
              placeholder="agent@nexus.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm mt-1.5 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Passcode */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-black uppercase tracking-wider">
              Passcode
            </label>
            <button
              type="button"
              onClick={() => navigate({ to: "/register" })}
              className="text-xs font-medium text-black hover:underline cursor-pointer"
            >
              Recover
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <Input
              {...register("password")}
              type="password"
              className="pl-10 h-12 border-2 border-black rounded-none bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black focus-visible:shadow-[4px_4px_0px_#00ff87] transition-shadow"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1.5 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={login.isPending}
          className="w-full h-12 cursor-pointer bg-[#00ff87] text-black hover:bg-[#00e67a] border-2 border-black rounded-none font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-base disabled:cursor-not-allowed"
        >
          {login.isPending ? (
            "AUTHENTICATING..."
          ) : (
            <>
              ENTER
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      <div className="h-px bg-black mt-8 mb-5" />

      <p className="text-center text-xs font-medium text-black">
        No access protocol established?{" "}
        <button
          type="button"
          onClick={() => navigate({ to: "/register" })}
          className="font-bold underline hover:text-[#00ff87] transition-colors cursor-pointer"
        >
          REGISTER ENTITY
        </button>
      </p>
    </div>
  )
}
