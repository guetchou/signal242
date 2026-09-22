import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheckBig, MapPin, Play, Waves } from 'lucide-react';
import { Badge, Button, Panel, Sparkline } from '@/design-system';

const HERO_KPIS = [
  { label: 'Signalements traités', value: '128 400', trend: [42, 51, 47, 63, 71, 68, 84, 92, 101, 118] },
  { label: 'Délai médian', value: '31 h', trend: [72, 68, 61, 58, 49, 44, 41, 37, 34, 31] },
  { label: 'Taux de résolution', value: '87 %', trend: [61, 64, 66, 69, 72, 76, 79, 82, 85, 87] },
];

const PROOF_POINTS = [
  'Mesure acoustique horodatée opposable',
  'Fonctionne hors ligne, synchronise ensuite',
  'Interopérable Open311 et GeoJSON',
];

/**
 * Bandeau d'ouverture.
 *
 * Trois messages en dix secondes : ce que fait la plateforme, pour qui, et la
 * preuve qu'elle tourne déjà. Le panneau flottant montre le produit réel plutôt
 * qu'une illustration abstraite.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20">
      <div className="aurora" aria-hidden />
      <div className="absolute inset-0 grid-tech opacity-70" aria-hidden />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--surface-canvas)] to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[84rem] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_1fr] lg:px-8">
        <div className="flex flex-col gap-7">
          <Badge tone="signal" dot pulse size="md" className="w-fit">
            Plateforme opérationnelle · Congo-Brazzaville
          </Badge>

          <h1 className="max-w-[16ch] text-[2.5rem] font-extrabold leading-[1.04] sm:text-[3.4rem] lg:text-[3.8rem]">
            <span className="text-gradient">Chaque signal du terrain devient une intervention</span>{' '}
            <span className="relative inline-block">
              <span className="text-signal-400">tracée et prouvée.</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 320 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 8c60-6 120-7 180-3s90 5 136 1"
                  stroke="var(--color-signal-400)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </svg>
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted">
            Voirie dégradée, éclairage éteint, dépôts sauvages, nuisances sonores mesurées au
            décibel, actes de banditisme : Signal&nbsp;242 capte l’incident, le qualifie
            automatiquement, l’achemine au bon service et suit son délai contractuel jusqu’à la
            preuve de résolution.
          </p>

          <ul className="flex flex-col gap-2.5">
            {PROOF_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-sm text-secondary">
                <CircleCheckBig className="size-4 shrink-0 text-signal-400" aria-hidden />
                {point}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/signaler">
              <Button size="lg" iconRight={<ArrowRight className="size-4" />}>
                Déposer un signalement
              </Button>
            </Link>
            <Link to="/console">
              <Button size="lg" variant="secondary" iconLeft={<Play className="size-4" />}>
                Voir la console agent
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-6 rounded-[var(--radius-2xl)] bg-gradient-to-br from-signal-400/16 via-cortex-400/10 to-transparent blur-2xl"
            aria-hidden
          />

          <Panel elevation="floating" bezel className="relative grain overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-[var(--radius-sm)] bg-signal-400/12">
                  <Waves className="size-4 text-signal-400" aria-hidden />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-primary">Supervision territoriale</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    30 derniers jours
                  </p>
                </div>
              </div>
              <Badge tone="signal" dot pulse>
                Temps réel
              </Badge>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-4">
              {HERO_KPIS.map((kpi, index) => (
                <div key={kpi.label} className="flex flex-col gap-2">
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-faint">{kpi.label}</dt>
                  <dd className="numeric text-xl font-bold text-primary sm:text-2xl">{kpi.value}</dd>
                  <Sparkline
                    values={kpi.trend}
                    color={`var(--series-${index + 1})`}
                    className="h-7 w-full"
                    label={`Tendance : ${kpi.label}`}
                  />
                </div>
              ))}
            </dl>

            <div className="mt-6 rounded-[var(--radius-md)] surface-sunken p-4">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                <MapPin className="size-3.5" aria-hidden />
                Dernière alerte qualifiée
              </div>
              <p className="mt-2.5 text-sm font-semibold text-primary">
                Nuisance sonore · 78,4 dB(A) relevés à 23 h 41
              </p>
              <p className="mt-1 text-xs text-muted">
                Avenue de la Paix, Bacongo — émergence de 26 dB au-dessus du fond sonore.
                Routé vers la police municipale, échéance dans 1 h 20.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
