import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { registerSchema, type RegisterInput } from "#/lib/schemas"
import { useRegister } from "#/hooks/use-auth"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

export function RegisterForm() {
  const navigate = useNavigate()
  const register = useRegister()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register.mutateAsync({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      })
      navigate({ to: "/dashboard" })
    } catch {
      // Error handled by query
    }
  }

  return (
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000] w-full max-w-md">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-2xl font-bold text-black">REGISTER</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
                First Name
              </label>
              <Input
                {...registerField("firstName")}
                className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
                Last Name
              </label>
              <Input
                {...registerField("lastName")}
                className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Email
            </label>
            <Input
              {...registerField("email")}
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
              Phone (Optional)
            </label>
            <Input
              {...registerField("phone")}
              type="tel"
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="+20 100 000 0000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Password
            </label>
            <Input
              {...registerField("password")}
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
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Confirm Password
            </label>
            <Input
              {...registerField("confirmPassword")}
              type="password"
              className="border-2 border-black focus:border-4 focus:border-black focus:shadow-[4px_4px_0px_#00ff87]"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-[#00ff87] text-black hover:bg-[#00cc6a] border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000]"
          >
            {register.isPending ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm font-medium text-black">
          Already have an account?{" "}
          <button
            onClick={() => navigate({ to: "/login" })}
            className="text-[#00ff87] hover:underline font-bold"
          >
            Login
          </button>
        </p>
      </CardContent>
    </Card>
  )
}