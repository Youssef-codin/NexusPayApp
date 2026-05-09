import type { AnyFieldApi } from '@tanstack/react-form';
import { Input } from '#/components/ui/input';
import { cn } from '#/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface AuthFormFieldProps {
  label: string;
  field: AnyFieldApi;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  rightElement?: React.ReactNode;
}

export function AuthFormField({
  label,
  field,
  icon: Icon,
  type = 'text',
  placeholder,
  rightElement,
}: AuthFormFieldProps) {
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors && field.state.meta.errors.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-black uppercase tracking-wider">{label}</label>
        {rightElement}
      </div>

      {/* Container for Input and Icon only to fix alignment */}
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <Input
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          type={type}
          className={cn(
            'pl-10 h-12 border-2 border-black rounded-none bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black focus-visible:shadow-[4px_4px_0px_#00ff87] transition-shadow',
            hasError &&
              'border-red-600 focus-visible:border-red-600 focus-visible:shadow-[4px_4px_0px_#dc2626]'
          )}
          placeholder={placeholder}
        />
      </div>

      {/* Error message rendered outside the relative container */}
      {hasError && (
        <div className="border-2 border-red-600 bg-red-50 px-3 py-2 mt-1.5">
          <p className="text-sm text-red-700 font-semibold">
            {field.state.meta.errors
              .map((e) =>
                typeof e === 'object' && e !== null && 'message' in e
                  ? String(e.message)
                  : String(e)
              )
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
