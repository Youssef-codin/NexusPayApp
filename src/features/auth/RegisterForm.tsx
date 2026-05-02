import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { registerSchema, type RegisterInput } from "#/lib/schemas";
import { useRegister } from "#/hooks/use-auth";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Mail, Lock, ArrowRight, User } from "lucide-react";

function NexusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7 17 L7 7 L17 17 L17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register.mutateAsync({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });
      navigate({ to: "/dashboard" });
    } catch {
      // Error handled by query
    }
  };

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
        CREATE NEW
        <br />
        ENTITY
      </h1>
      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
        Establish your access protocol and join
        <br className="hidden sm:block" />
        the secure network.
      </p>

      <div className="h-px bg-black mb-8" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <Input
              {...registerField("full_name")}
              className="pl-10 h-12 border-2 border-black rounded-none bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black focus-visible:shadow-[4px_4px_0px_#00ff87] transition-shadow"
              placeholder="Agent Smith"
            />
          </div>
          {errors.full_name && (
            <p className="text-red-600 text-sm mt-1.5 font-medium">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <Input
              {...registerField("email")}
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
          <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wider">
            Passcode
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <Input
              {...registerField("password")}
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

        {/* Confirm Passcode */}
        <div>
          <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wider">
            Confirm Passcode
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <Input
              {...registerField("confirmPassword")}
              type="password"
              className="pl-10 h-12 border-2 border-black rounded-none bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black focus-visible:shadow-[4px_4px_0px_#00ff87] transition-shadow"
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1.5 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={register.isPending}
          className="w-full h-12 cursor-pointer bg-[#00ff87] text-black hover:bg-[#00e67a] border-2 border-black rounded-none font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-base disabled:cursor-not-allowed"
        >
          {register.isPending ? (
            "INITIALIZING..."
          ) : (
            <>
              REGISTER
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      <div className="h-px bg-black mt-8 mb-5" />

      <p className="text-center text-xs font-medium text-black">
        Already have access protocol established?{" "}
        <button
          type="button"
          onClick={() => navigate({ to: "/login" })}
          className="font-bold underline hover:text-[#00ff87] transition-colors cursor-pointer"
        >
          AUTHENTICATE
        </button>
      </p>
    </div>
  );
}