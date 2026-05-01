import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { loginSchema, type LoginInput } from "#/lib/schemas"
import { useLogin } from "#/hooks/use-auth"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

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
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000] w-full max-w-md">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-2xl font-bold text-black">LOGIN</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Email
            </label>
            <Input
              {...register("email")}
              type="email"
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Password
            </label>
            <Input
              {...register("password")}
              type="password"
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-[#00ff87] text-black hover:bg-[#00cc6a] border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000]"
          >
            {login.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm font-medium text-black">
          Don't have an account?{" "}
          <button
            onClick={() => navigate({ to: "/register" })}
            className="text-[#00ff87] hover:underline font-bold"
          >
            Register
          </button>
        </p>
      </CardContent>
    </Card>
  )
}