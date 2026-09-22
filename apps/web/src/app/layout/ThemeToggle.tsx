import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { cn } from '@/lib/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
      className={cn(
        'grid size-9 place-items-center rounded-[var(--radius-sm)] border border-subtle',
        'text-muted transition-colors hover:border-strong hover:text-primary',
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
