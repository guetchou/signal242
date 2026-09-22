import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { Badge, Panel, resolveIcon, Reveal, SectionHeading, TONES } from '@/design-system';
import { CATEGORIES } from '@/domain/report/categories';
import { SEVERITY_LABELS } from '@/domain/report/sla';
import { formatDuration } from '@/lib/format';
import { cn } from '@/lib/cn';

/**
 * Couverture fonctionnelle.
 *
 * Objection commerciale n°1 : « votre outil ne couvre pas mon métier ». Cette
 * grille y répond par l'exhaustivité visible, chaque famille exposant ses
 * sous-types réels et son délai contractuel.
 */
export function CategoryGrid() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="couverture" className="relative mx-auto max-w-[84rem] px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Couverture"
          title={
            <>
              Dix familles d’incidents,{' '}
              <span className="text-signal-400">quarante situations</span> qualifiées
            </>
          }
          description="Chaque famille embarque ses sous-types, son service destinataire par défaut et ses délais contractuels par niveau de gravité. Le référentiel s’adapte à l’organigramme du client sans développement."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {CATEGORIES.map((category, index) => {
          const Icon = resolveIcon(category.icon);
          const tone = TONES[category.tone];
          const isActive = active === category.id;

          return (
            <Reveal key={category.id} delay={index * 40}>
              <Panel
                elevation="raised"
                padded={false}
                onMouseEnter={() => setActive(category.id)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  'group relative h-full overflow-hidden p-5 transition-all duration-[var(--duration-base)]',
                  'hover:-translate-y-1 hover:border-strong',
                  isActive && tone.glow,
                )}
              >
                <span
                  className={cn(
                    'absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                  style={{ backgroundImage: `linear-gradient(90deg, transparent, ${tone.hex}, transparent)` }}
                  aria-hidden
                />

                <div className="flex items-start justify-between gap-2">
                  <span className={cn('grid size-10 place-items-center rounded-[var(--radius-md)]', tone.bg)}>
                    <Icon className={cn('size-5', tone.text)} aria-hidden />
                  </span>
                  {category.requiresAcoustics && (
                    <Badge tone="cortex">Mesure dB</Badge>
                  )}
                  {category.anonymousByDefault && <Badge tone="alert">Confidentiel</Badge>}
                </div>

                <h3 className="mt-4 text-[15px] font-semibold text-primary">{category.label}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{category.description}</p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {category.subtypes.slice(0, 3).map((subtype) => (
                    <li
                      key={subtype.id}
                      className="rounded-full surface-sunken px-2 py-0.5 text-[11px] text-faint"
                    >
                      {subtype.label}
                    </li>
                  ))}
                  {category.subtypes.length > 3 && (
                    <li className="rounded-full surface-sunken px-2 py-0.5 text-[11px] text-faint">
                      +{category.subtypes.length - 3}
                    </li>
                  )}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-subtle pt-3.5">
                  <span className="flex items-center gap-1.5 text-[11px] text-faint">
                    <Clock className="size-3" aria-hidden />
                    {SEVERITY_LABELS.critical} : {formatDuration(category.slaHours.critical)}
                  </span>
                  <Link
                    to="/signaler"
                    state={{ categoryId: category.id }}
                    className={cn(
                      'inline-flex items-center gap-0.5 text-[11px] font-semibold transition-transform',
                      'group-hover:translate-x-0.5',
                      tone.text,
                    )}
                  >
                    Signaler
                    <ArrowUpRight className="size-3" aria-hidden />
                  </Link>
                </div>
              </Panel>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
