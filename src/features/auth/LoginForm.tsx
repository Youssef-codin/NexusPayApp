import { useNavigate, Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { loginSchema } from '#/lib/schemas';
import { useLogin } from '#/hooks/use-auth';
import { useOnlineStatus } from '#/hooks/use-online-status';
import { Button } from '#/components/ui/button';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { NexusPayMark } from '#/components/NexusPayLogo';
import { AuthFormField } from './AuthFormField';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();
  const isOnline = useOnlineStatus();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onBlur: loginSchema,
      onChange: () => {
        if (login.error) login.reset();
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await login.mutateAsync(value);
        navigate({ to: '/dashboard' });
      } catch {
        // Error is handled by mutation state
      }
    },
  });

  return (
    <div className="p-6 sm:p-8 md:p-10">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 no-underline">
        <NexusPayMark size={20} className="w-5 h-5" />
        <span className="text-sm font-bold tracking-[0.25em] text-black">NEXUS</span>
      </Link>

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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
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

        {login.error && (
          <div className="border-2 border-red-600 bg-red-50 px-3 py-2 mt-2">
            <p className="text-sm text-red-700 font-semibold">{getAuthErrorMessage(login.error)}</p>
          </div>
        )}

        {/* Submit */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={login.isPending || isSubmitting || !canSubmit || !isOnline}
              className="w-full font-bold tracking-wider"
            >
              {login.isPending || isSubmitting ? (
                'AUTHENTICATING...'
              ) : (
                <>
                  ENTER
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          )}
        />
      </form>

      <div className="h-px bg-black mt-8 mb-5" />

      <p className="text-center text-xs font-medium text-black">
        No access protocol established?{' '}
        <Button type="button" variant="link" onClick={() => navigate({ to: '/register' })}>
          REGISTER ENTITY
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
      case 401:
      case 403:
        return 'Incorrect email or password. Please try again.';
      case 400:
        return 'Please check your details and try again.';
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
    if (typeof data === 'string' && data.toLowerCase().includes('invalid')) {
      return 'Incorrect email or password. Please try again.';
    }
  }

  return 'Something went wrong while signing in. Please try again.';
}
