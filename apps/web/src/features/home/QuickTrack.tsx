import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button, Panel, TextInput } from '@/design-system';

/**
 * Accès direct au suivi depuis l'accueil.
 *
 * Deuxième intention la plus fréquente après le dépôt. La réduire à un lien
 * de navigation imposerait une page intermédiaire à un utilisateur qui a déjà
 * sa référence en main.
 */
export function QuickTrack() {
  const navigate = useNavigate();
  const [reference, setReference] = useState('');

  const submit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const trimmed = reference.trim();
      if (trimmed) navigate('/suivi', { state: { reference: trimmed } });
    },
    [navigate, reference],
  );

  return (
    <Panel elevation="raised" className="flex flex-col gap-4">
      <header>
        <h2 className="text-[15px] font-semibold text-primary">Suivre un dossier</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Saisissez la référence reçue au dépôt. Aucun compte n’est nécessaire.
        </p>
      </header>

      <form onSubmit={submit} className="flex flex-col gap-2.5">
        <label className="relative">
          <span className="sr-only">Référence du signalement</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint"
            aria-hidden
          />
          <TextInput
            value={reference}
            onChange={(event) => setReference(event.target.value.toUpperCase())}
            placeholder="SIG-XXXX-00"
            autoComplete="off"
            spellCheck={false}
            className="pl-10 font-mono tracking-wider"
          />
        </label>
        <Button
          type="submit"
          variant="outline"
          disabled={reference.trim().length === 0}
          iconRight={<ArrowRight className="size-4" />}
        >
          Consulter l’avancement
        </Button>
      </form>
    </Panel>
  );
}
