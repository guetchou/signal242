import { useMemo } from 'react';
import { Info, Mic, MicOff, Square, TriangleAlert } from 'lucide-react';
import { Badge, Button, Panel, RadialGauge } from '@/design-system';
import {
  classifyLevel,
  emergence,
  levelReference,
  PERIOD_LABELS,
  PERIOD_THRESHOLDS,
  periodAt,
  VERDICT_LABELS,
  type NoiseVerdict,
} from '@/domain/noise/acoustics';
import type { NoiseMeasurement } from '@/domain/report/types';
import { cn } from '@/lib/cn';
import { SpectrumBars } from './SpectrumBars';
import { useNoiseMeter } from './useNoiseMeter';

const VERDICT_TONE: Record<NoiseVerdict, 'signal' | 'ember' | 'alert' | 'pulse'> = {
  calm: 'signal',
  moderate: 'pulse',
  disturbing: 'ember',
  harmful: 'alert',
};

const GAUGE_COLOR: Record<NoiseVerdict, string> = {
  calm: 'var(--series-1)',
  moderate: 'var(--series-4)',
  disturbing: 'var(--series-3)',
  harmful: 'var(--series-5)',
};

export interface NoiseMeterPanelProps {
  mode: 'live' | 'simulated';
  /** Durée de la fenêtre de mesure en secondes. */
  durationS?: number;
  /** Remontée de la mesure consolidée à l'arrêt, pour attacher au signalement. */
  onMeasured?: (measurement: NoiseMeasurement) => void;
  className?: string;
}

/**
 * Sonomètre complet : capture, indicateurs normalisés et qualification.
 *
 * Le composant n'effectue aucun calcul acoustique — il compose le domaine
 * (`domain/noise/acoustics`) et le port de capture. Sa seule responsabilité
 * est la présentation et la conduite de l'interaction.
 */
export function NoiseMeterPanel({
  mode,
  durationS = 30,
  onMeasured,
  className,
}: NoiseMeterPanelProps) {
  const { status, frame, fallback, start, stop } = useNoiseMeter({ mode, maxDurationS: durationS });

  const period = useMemo(() => periodAt(new Date()), []);
  const threshold = PERIOD_THRESHOLDS[period];
  const running = status === 'running';
  const hasData = frame.elapsedS > 0.4;

  const verdict = hasData ? classifyLevel(frame.laeq, period) : 'calm';
  const emergenceDb = hasData ? emergence(frame.laeq, frame.l90) : 0;

  const handleStop = () => {
    stop();
    if (!onMeasured || !hasData) return;
    onMeasured({
      laeq: Math.round(frame.laeq * 10) / 10,
      lmax: Math.round(frame.lmax * 10) / 10,
      l90: Math.round(frame.l90 * 10) / 10,
      durationS: Math.round(frame.elapsedS),
      calibrationOffsetDb: 0,
      calibrated: false,
      measuredAt: new Date().toISOString(),
    });
  };

  return (
    <Panel elevation="floating" bezel className={cn('relative overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-primary">Sonomètre intégré</h3>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            {PERIOD_LABELS[period]} · seuil {threshold} dB(A)
          </p>
        </div>
        <Badge tone={running ? VERDICT_TONE[verdict] : 'neutral'} dot pulse={running}>
          {running ? 'Mesure en cours' : hasData ? 'Mesure terminée' : 'En attente'}
        </Badge>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center">
        <RadialGauge
          value={hasData ? frame.laeq : 0}
          min={25}
          max={110}
          threshold={threshold}
          unit="dB(A)"
          caption={hasData ? levelReference(frame.laeq) : 'Lancez la mesure'}
          color={GAUGE_COLOR[verdict]}
        />

        <div className="flex flex-col gap-4">
          <div className="h-24 rounded-[var(--radius-md)] surface-sunken p-3">
            <SpectrumBars spectrum={frame.spectrum} active={running} className="h-full" />
          </div>

          <dl className="grid grid-cols-3 gap-3">
            {[
              { label: 'Crête LAmax', value: hasData ? frame.lmax.toFixed(1) : '—' },
              { label: 'Fond L90', value: hasData ? frame.l90.toFixed(1) : '—' },
              {
                label: 'Émergence',
                value: hasData ? `+${emergenceDb.toFixed(1)}` : '—',
                highlight: emergenceDb >= 5,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[var(--radius-sm)] surface-sunken px-3 py-2.5">
                <dt className="text-[10px] uppercase tracking-[0.12em] text-faint">{item.label}</dt>
                <dd
                  className={cn(
                    'numeric mt-1 text-lg font-bold',
                    item.highlight ? 'text-ember-300' : 'text-primary',
                  )}
                >
                  {item.value}
                  <span className="ml-1 text-[10px] font-normal text-faint">dB</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center gap-2.5">
            {running ? (
              <Button variant="danger" size="sm" iconLeft={<Square className="size-3.5" />} onClick={handleStop}>
                Arrêter et joindre
              </Button>
            ) : (
              <Button size="sm" iconLeft={<Mic className="size-4" />} onClick={() => void start()}>
                {hasData ? 'Relancer une mesure' : `Démarrer ${durationS} s de mesure`}
              </Button>
            )}
            {running && (
              <span className="numeric text-xs text-muted">
                {frame.elapsedS.toFixed(0)} / {durationS} s
              </span>
            )}
          </div>
        </div>
      </div>

      {running && (
        <div className="mt-5 h-1 overflow-hidden rounded-full surface-sunken">
          <div
            className="h-full rounded-full bg-signal-400 transition-[width] duration-100 ease-linear"
            style={{ width: `${Math.min((frame.elapsedS / durationS) * 100, 100)}%` }}
          />
        </div>
      )}

      {hasData && !running && (
        <p className="mt-5 flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--accent-soft)] px-3.5 py-3 text-[13px] leading-relaxed text-secondary">
          <Info className="mt-0.5 size-4 shrink-0 text-signal-400" aria-hidden />
          <span>
            <strong className="font-semibold text-primary">{VERDICT_LABELS[verdict]}. </strong>
            {frame.laeq.toFixed(1)} dB(A) moyennés sur {Math.round(frame.elapsedS)} s, soit{' '}
            {emergenceDb >= 0 ? '+' : ''}
            {emergenceDb.toFixed(1)} dB au-dessus du bruit de fond, pour un seuil de {threshold} dB(A)
            en {PERIOD_LABELS[period].toLowerCase()}.
          </span>
        </p>
      )}

      {(fallback || status === 'denied') && (
        <p className="mt-3 flex items-start gap-2 rounded-[var(--radius-sm)] bg-ember-400/10 px-3.5 py-3 text-[13px] leading-relaxed text-ember-300">
          <MicOff className="mt-0.5 size-4 shrink-0" aria-hidden />
          Microphone indisponible : la démonstration se poursuit avec un signal simulé. Sur le
          terrain, autorisez l’accès au micro pour obtenir une mesure réelle.
        </p>
      )}

      <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-faint">
        <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Un terminal non étalonné fournit une mesure indicative, non un relevé de classe 1 ou 2 au
        sens de la CEI 61672. Après étalonnage sur source de référence, l’écart attendu est de
        l’ordre de ±2 dB(A) : suffisant pour objectiver une gêne et déclencher un contrôle.
      </p>
    </Panel>
  );
}
