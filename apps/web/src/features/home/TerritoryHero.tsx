import { Clock, ShieldCheck } from 'lucide-react';
import { MediaFrame } from '@/design-system';
import { useTerritory } from '@/app/providers/TerritoryProvider';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import { LocateAction } from './LocateAction';

const AMBIENT_CLASS = {
  foliage: 'ambient-foliage',
  waves: 'ambient-waves',
  crossroads: 'ambient-crossroads',
} as const;

const REASSURANCE = [
  { icon: Clock, text: 'Délai annoncé avant l’envoi' },
  { icon: ShieldCheck, text: 'Dépôt anonyme, sans compte' },
] as const;

/**
 * Bandeau d'ouverture, porteur de l'identité du territoire.
 *
 * Il contient l'action plutôt que de la repousser : la localisation vit dans
 * le bandeau, l'usager voit sa ville et trouve le geste attendu sans défiler.
 *
 * Le visuel est cadré comme une image, non étalé en fond. Une image de fond
 * doit être voilée pour rester lisible sous du texte, et ce voile la délave ;
 * cadrée, elle garde sa densité et supporte les superpositions — cercle de
 * portrait, pastille chiffrée — qui donnent sa profondeur à la composition.
 */
export function TerritoryHero() {
  const { territory } = useTerritory();

  return (
    <section className="relative isolate overflow-hidden pb-4 pt-10 sm:pt-12">
      <div className={cn('ambient', AMBIENT_CLASS[territory.motif])} aria-hidden />
      <div className="ambient ambient-glow opacity-60" aria-hidden />

      <div className="relative mx-auto grid max-w-[80rem] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="flex flex-col">
          <p className="flex items-center gap-2.5">
            <span className="h-px w-7 bg-[var(--accent)]" aria-hidden />
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {territory.name} · {territory.nickname}
            </span>
          </p>

          <h1 className="mt-3 max-w-[15ch] text-[2.1rem] font-bold leading-[1.06] sm:text-[2.8rem]">
            Signaler un problème dans votre quartier
          </h1>

          <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-secondary">
            {territory.identity}
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {REASSURANCE.map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-[13px] text-secondary">
                <item.icon className="size-4 shrink-0 text-[var(--accent)]" aria-hidden />
                {item.text}
              </li>
            ))}
          </ul>

          <LocateAction className="mt-6" />
        </div>

        {/* Composition média : image principale, portrait en médaillon,
            pastille chiffrée. Les trois plans se chevauchent volontairement. */}
        <div className="relative hidden lg:block">
          <MediaFrame
            media="heroCity"
            shape="landscape"
            interactive
            className="lift shadow-depth"
          />

          <MediaFrame
            media="districtFace"
            shape="circle"
            interactive
            className="absolute bottom-5 left-5 size-32 border-4 border-[var(--surface-base)] shadow-depth"
          />

          <div className="absolute -right-4 -top-5 rounded-[var(--radius-lg)] glass px-4 py-3 shadow-depth">
            <p className="text-[10px] uppercase tracking-[0.12em] text-faint">Habitants desservis</p>
            <p className="numeric mt-0.5 text-xl font-bold text-primary">
              {formatNumber(territory.population)}
            </p>
          </div>

          <div className="absolute -bottom-6 right-6 max-w-[14rem] rounded-[var(--radius-md)] glass px-3.5 py-2.5 shadow-depth">
            <p className="text-[11px] font-semibold text-primary">{territory.paletteLabel}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">
              L’interface prend les couleurs du territoire qu’elle sert.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
