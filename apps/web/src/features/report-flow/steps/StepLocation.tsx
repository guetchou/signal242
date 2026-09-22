import { useCallback, useState } from 'react';
import { Crosshair, MapPin, TriangleAlert } from 'lucide-react';
import { Badge, Button } from '@/design-system';
import { useServices } from '@/app/providers/ServicesProvider';
import type { Address, GeoPoint, ReportDraft } from '@/domain/report/types';
import { IncidentMap } from '@/features/map/IncidentMap';
import { NearbyReports } from '../NearbyReports';

export interface StepLocationProps {
  draft: ReportDraft;
  onPatch: (patch: Partial<ReportDraft>) => void;
}

/** Étape 2 — localisation : GPS en un geste, correction manuelle à la carte. */
export function StepLocation({ draft, onPatch }: StepLocationProps) {
  const { geolocation } = useServices();
  const [locating, setLocating] = useState(false);

  const applyPosition = useCallback(
    async (position: GeoPoint) => {
      const place: Address = await geolocation.reverse(position.lat, position.lng);
      onPatch({ position, address: place });
    },
    [geolocation, onPatch],
  );

  const locate = useCallback(async () => {
    setLocating(true);
    try {
      await applyPosition(await geolocation.current());
    } finally {
      setLocating(false);
    }
  }, [applyPosition, geolocation]);

  const imprecise = draft.position?.accuracyM !== undefined && draft.position.accuracyM > 80;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          iconLeft={<Crosshair className="size-4" />}
          loading={locating}
          onClick={() => void locate()}
        >
          Utiliser ma position
        </Button>
        <p className="text-[13px] text-muted">
          ou cliquez directement sur la carte pour placer le point.
        </p>
      </div>

      <IncidentMap
        points={
          draft.position
            ? [
                {
                  id: 'draft',
                  position: draft.position,
                  // Marqueur neutre : la nature du problème n'est pas encore
                  // connue à cette étape, une couleur de famille mentirait.
                  color: '#10d9a3',
                  label: 'Position du signalement',
                  emphasis: true,
                },
              ]
            : []
        }
        selected={draft.position}
        onPick={(position) => void applyPosition(position)}
        className="h-[22rem] w-full sm:h-[26rem]"
      />

      {draft.position && <NearbyReports position={draft.position} />}

      {draft.address && draft.position ? (
        <div className="flex flex-col gap-3 rounded-[var(--radius-md)] surface-raised p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-signal-400/12">
              <MapPin className="size-4 text-[var(--tone-signal-text)]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">{draft.address.label}</p>
              <p className="text-[13px] text-muted">
                {draft.address.district}, {draft.address.city}
              </p>
              <p className="numeric mt-1.5 text-[11px] text-faint">
                {draft.position.lat.toFixed(5)}, {draft.position.lng.toFixed(5)}
                {draft.position.accuracyM !== undefined && ` · précision ±${draft.position.accuracyM} m`}
              </p>
            </div>
          </div>

          {imprecise && (
            <Badge tone="ember" size="md" className="w-fit">
              <TriangleAlert className="size-3" aria-hidden />
              Position peu précise : ajustez le point à la main pour éviter un mauvais routage.
            </Badge>
          )}
        </div>
      ) : (
        <p className="rounded-[var(--radius-md)] surface-sunken px-4 py-3 text-[13px] text-muted">
          Aucune position sélectionnée. Le lieu conditionne le service destinataire et le délai de
          traitement : il est obligatoire.
        </p>
      )}
    </div>
  );
}
