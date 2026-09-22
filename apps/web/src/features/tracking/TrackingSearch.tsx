import { useCallback, useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Button, TextInput } from '@/design-system';

export interface TrackingSearchProps {
  initial?: string;
  loading: boolean;
  onSearch: (reference: string) => void;
}

/** Recherche par référence : unique porte d'entrée du suivi, sans compte. */
export function TrackingSearch({ initial = '', loading, onSearch }: TrackingSearchProps) {
  const [value, setValue] = useState(initial);

  const submit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const trimmed = value.trim();
      if (trimmed) onSearch(trimmed);
    },
    [onSearch, value],
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Référence du signalement</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
        <TextInput
          value={value}
          onChange={(event) => setValue(event.target.value.toUpperCase())}
          placeholder="SIG-XXXX-00"
          autoComplete="off"
          spellCheck={false}
          className="h-12 pl-11 font-mono tracking-wider"
        />
      </label>
      <Button type="submit" size="lg" loading={loading} disabled={value.trim().length === 0}>
        Consulter le dossier
      </Button>
    </form>
  );
}
