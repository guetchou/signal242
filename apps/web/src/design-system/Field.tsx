import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

const CONTROL =
  'w-full rounded-[var(--radius-md)] surface-sunken border border-default px-4 text-sm text-primary ' +
  'placeholder:text-faint transition-colors duration-[var(--duration-fast)] ' +
  'focus:border-signal-400/60 focus:outline-none focus:ring-2 focus:ring-signal-400/25';

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/** Enveloppe de champ : libellé, aide et erreur, reliés au contrôle. */
export function Field({ label, hint, error, required, children, className }: FieldProps) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-secondary">
          {label}
          {required && <span className="ml-1 text-alert-400">*</span>}
        </span>
        {hint && <span className="text-[11px] text-faint">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="text-xs font-medium text-alert-300">
          {error}
        </span>
      )}
    </label>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(CONTROL, 'h-11', className)} {...props} />;
  },
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(CONTROL, 'resize-y py-3 leading-relaxed', className)} {...props} />;
  },
);
