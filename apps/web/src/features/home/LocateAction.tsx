import { useCallback, useId, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crosshair, MapPin, TriangleAlert } from 'lucide-react';
import { Button, TextInput } from '@/design-system';
import { useServices } from '@/app/providers/ServicesProvider';
import { DISTRICTS } from '@/infrastructure/mock/districts';
import { cn } from '@/lib/cn';

/**
 * Point de départ du signalement : le lieu.
 *
 * C'est la seule information que l'usager possède sans réflexion — il est
 * devant le problème. Demander d'abord la catégorie lui imposerait de
 * classer ce qu'il voit avant de pouvoir agir, et priverait l'étape suivante
 * de tout rapprochement avec les signalements déjà déposés au même endroit.
 */
export function LocateAction({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { geolocation } = useServices();
  const listId = useId();

  const [locating, setLocating] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const go = useCallback(
    async (point: { lat: number; lng: number; accuracyM?: number }) => {
      const address = await geolocation.reverse(point.lat, point.lng);
      navigate('/signaler', { state: { place: { position: point, address } } });
    },
    [geolocation, navigate],
  );

  const useMyPosition = useCallback(async () => {
    setLocating(true);
    setError(null);
    try {
      await go(await geolocation.current());
    } catch {
      setError('Position indisponible. Saisissez votre quartier ci-dessous.');
    } finally {
      setLocating(false);
    }
  }, [geolocation, go]);

  const submitQuery = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const needle = query.trim().toLowerCase();
      if (!needle) return;

      const match = DISTRICTS.find((district) => district.name.toLowerCase().includes(needle));
      if (!match) {
        setError('Quartier non reconnu. Choisissez-en un dans la liste proposée.');
        return;
      }
      setError(null);
      await go({ lat: match.lat, lng: match.lng, accuracyM: 900 });
    },
    [go, query],
  );

  return (
    <section
      aria-labelledby="titre-localiser"
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--accent-border)] bg-[var(--accent-surface)] p-5 sm:p-6',
        className,
      )}
    >
      <h2 id="titre-localiser" className="text-[15px] font-semibold text-primary">
        Où se trouve le problème ?
      </h2>
      <p className="mt-1 text-[13px] text-muted">
        Indiquez le lieu en premier : nous vous montrons ensuite ce qui a déjà été signalé sur
        place.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <Button
          size="lg"
          className="sm:shrink-0"
          loading={locating}
          iconLeft={<Crosshair className="size-4" />}
          onClick={() => void useMyPosition()}
        >
          Utiliser ma position
        </Button>

        <form
          onSubmit={(event) => void submitQuery(event)}
          className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row"
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Quartier ou arrondissement</span>
            <MapPin
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint"
              aria-hidden
            />
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ou un quartier : Bacongo, Talangaï…"
              list={listId}
              autoComplete="off"
              className="h-14 pl-10"
            />
            <datalist id={listId}>
              {DISTRICTS.map((district) => (
                <option key={district.name} value={district.name} />
              ))}
            </datalist>
          </label>
          <Button
            type="submit"
            size="lg"
            variant="outline"
            className="sm:shrink-0"
            disabled={query.trim().length === 0}
          >
            Continuer
          </Button>
        </form>
      </div>

      {error && (
        <p role="alert" className="mt-3 flex items-center gap-2 text-[12px] text-[var(--tone-ember-text)]">
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </section>
  );
}
