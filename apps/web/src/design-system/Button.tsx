import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-signal-300 via-signal-400 to-signal-500 text-night-950 font-semibold ' +
    'shadow-[0_10px_30px_-10px_rgb(16_217_163_/_0.7)] hover:shadow-[0_16px_44px_-12px_rgb(16_217_163_/_0.85)] ' +
    'hover:brightness-110 active:brightness-95',
  secondary:
    'glass text-primary hover:border-strong hover:bg-white/[0.07] active:bg-white/[0.04]',
  outline:
    'border border-default text-primary hover:border-strong hover:bg-white/[0.04]',
  ghost: 'text-secondary hover:text-primary hover:bg-white/[0.05]',
  danger:
    'bg-gradient-to-br from-alert-300 via-alert-400 to-alert-500 text-white font-semibold ' +
    'shadow-[0_10px_30px_-10px_rgb(255_77_94_/_0.7)] hover:brightness-110',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-[var(--radius-sm)]',
  md: 'h-11 px-5 text-sm gap-2 rounded-[var(--radius-md)]',
  lg: 'h-14 px-7 text-base gap-2.5 rounded-[var(--radius-lg)]',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, iconLeft, iconRight, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center whitespace-nowrap',
        'transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none',
        'active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
});
