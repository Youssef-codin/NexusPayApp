import { useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import axios from 'axios';
import { registerSchema } from '#/lib/schemas';
import { useRegister } from '#/hooks/use-auth';
import { Button } from '#/components/ui/button';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { NexusPayMark } from '#/components/NexusPayLogo';
import { AuthFormField } from './AuthFormField';

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useRegister();
  const authErrorMessage = getAuthErrorMessage(register.error);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
    },
    validators: {
      onBlur: registerSchema,
      onChange: () => {
        if (register.error) register.reset();
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await register.mutateAsync({
          email: value.email,
          password: value.password,
          full_name: value.full_name,
        });
        navigate({ to: '/' });
      } catch {
        // Error is rendered from mutation state.
      }
    },
  });

  return (
    <div className="p-8 md:p-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8 text-black">
        <NexusPayMark size={20} />
        <span className="text-sm font-bold tracking-[0.25em] text-black">NEXUS</span>
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Full Name */}
        <form.Field
          name="full_name"
          children={(field) => (
            <AuthFormField label="Full Name" field={field} icon={User} placeholder="Agent Smith" />
          )}
        />

        {/* Email Address */}
        <form.Field
          name="email"
          children={(field) => (
            <AuthFormField
              label="Email Address"
              field={field}
              icon={Mail}
              type="email"
              placeholder="agent@nexus.com"
            />
          )}
        />

        {/* Passcode */}
        <form.Field
          name="password"
          children={(field) => (
            <AuthFormField
              label="Passcode"
              field={field}
              icon={Lock}
              type="password"
              placeholder="••••••••"
            />
          )}
        />

        {/* Confirm Passcode */}
        <form.Field
          name="confirmPassword"
          children={(field) => (
            <AuthFormField
              label="Confirm Passcode"
              field={field}
              icon={Lock}
              type="password"
              placeholder="••••••••"
            />
          )}
        />

        {authErrorMessage && (
          <div className="border-2 border-red-600 bg-red-50 px-3 py-2">
            <p className="text-sm text-red-700 font-semibold">{authErrorMessage}</p>
          </div>
        )}

        {/* Submit */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={register.isPending || isSubmitting || !canSubmit}
              className="w-full h-12 cursor-pointer bg-[#00ff87] text-black hover:bg-[#00e67a] border-2 border-black rounded-none font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-base disabled:cursor-not-allowed"
            >
              {register.isPending || isSubmitting ? (
                'INITIALIZING...'
              ) : (
                <>
                  REGISTER
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          )}
        />
      </form>

      <div className="h-px bg-black mt-8 mb-5" />

      <p className="text-center text-xs font-medium text-black">
        Already have access protocol established?{' '}
        <Button type="button" variant="link" onClick={() => navigate({ to: '/login' })}>
          AUTHENTICATE
        </Button>
      </p>
    </div>
  );
}

function getAuthErrorMessage(error: unknown) {
  if (!error) return null;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    switch (status) {
      case 409:
        return 'An account with this email already exists.';
      case 400:
      case 422:
        return 'Please review your details and try again.';
      case 429:
        return 'Too many attempts. Please wait a moment and try again.';
      default:
        if (status && status >= 500) {
          return 'Server issue right now. Please try again shortly.';
        }
        if (!status) {
          return 'Network error. Please check your connection and try again.';
        }
    }

    const data = error.response?.data;
    if (typeof data === 'string' && data.toLowerCase().includes('exists')) {
      return 'An account with this email already exists.';
    }
  }

  return 'Something went wrong while creating your account. Please try again.';
}
