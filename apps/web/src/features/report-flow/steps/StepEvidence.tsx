import { Camera, EyeOff, ImagePlus, X } from 'lucide-react';
import { Field, Panel, TextArea } from '@/design-system';
import { getCategory } from '@/domain/report/categories';
import type { Attachment, ReportDraft } from '@/domain/report/types';
import { NoiseMeterPanel } from '@/features/noise-meter/NoiseMeterPanel';
import { cn } from '@/lib/cn';

export interface StepEvidenceProps {
  draft: ReportDraft;
  error: string | null;
  onPatch: (patch: Partial<ReportDraft>) => void;
}

const MAX_ATTACHMENTS = 4;

/** Étape 3 — preuves : description, photos et, si requis, mesure acoustique. */
export function StepEvidence({ draft, error, onPatch }: StepEvidenceProps) {
  const category = getCategory(draft.categoryId);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const additions: Attachment[] = Array.from(files)
      .slice(0, MAX_ATTACHMENTS - draft.attachments.length)
      .map((file, index) => ({
        id: `local_${Date.now()}_${index}`,
        kind: 'photo' as const,
        // URL locale : la photo ne quitte le terminal qu'à la transmission.
        url: URL.createObjectURL(file),
        capturedAt: new Date().toISOString(),
      }));
    onPatch({ attachments: [...draft.attachments, ...additions] });
  };

  const removeAttachment = (id: string) => {
    const target = draft.attachments.find((attachment) => attachment.id === id);
    if (target) URL.revokeObjectURL(target.url);
    onPatch({ attachments: draft.attachments.filter((attachment) => attachment.id !== id) });
  };

  return (
    <div className="flex flex-col gap-7">
      <Field
        label="Décrivez ce que vous constatez"
        hint={`${draft.description.trim().length} caractères`}
        required
        error={error ?? undefined}
      >
        <TextArea
          rows={4}
          value={draft.description}
          onChange={(event) => onPatch({ description: event.target.value })}
          placeholder="Exemple : trou d’environ 1 m de diamètre au milieu de la chaussée, deux motos y sont déjà tombées cette semaine."
        />
      </Field>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-secondary">
          Photos <span className="text-faint">({draft.attachments.length}/{MAX_ATTACHMENTS})</span>
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {draft.attachments.map((attachment) => (
            <figure key={attachment.id} className="group relative aspect-4/3 overflow-hidden rounded-[var(--radius-md)] surface-sunken">
              <img src={attachment.url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeAttachment(attachment.id)}
                className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full glass text-primary opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="Retirer cette photo"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </figure>
          ))}

          {draft.attachments.length < MAX_ATTACHMENTS && (
            <label
              className={cn(
                'flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-md)]',
                'border border-dashed border-default text-muted transition-colors hover:border-strong hover:text-primary',
              )}
            >
              <ImagePlus className="size-5" aria-hidden />
              <span className="text-[11px]">Ajouter</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="sr-only"
                onChange={(event) => handleFiles(event.target.files)}
              />
            </label>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-faint">
          <Camera className="size-3" aria-hidden />
          Les photos sont horodatées et associées à la position. Elles constituent la pièce
          principale du dossier d’intervention.
        </p>
      </div>

      {category.requiresAcoustics && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-secondary">Mesure sonore requise</p>
          <NoiseMeterPanel
            mode="live"
            durationS={30}
            onMeasured={(measurement) => onPatch({ noise: measurement })}
          />
          {draft.noise && (
            <p className="rounded-[var(--radius-sm)] bg-signal-400/10 px-3.5 py-2.5 text-[13px] text-[var(--tone-signal-text)]">
              Mesure jointe : {draft.noise.laeq.toFixed(1)} dB(A) sur {draft.noise.durationS} s,
              crête à {draft.noise.lmax.toFixed(1)} dB(A).
            </p>
          )}
        </div>
      )}

      <Panel elevation="flat" className="flex items-start gap-3.5">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] surface-sunken">
          <EyeOff className="size-4 text-muted" aria-hidden />
        </span>
        <div className="flex-1">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={draft.anonymous}
              onChange={(event) => onPatch({ anonymous: event.target.checked })}
              className="mt-0.5 size-4 accent-[var(--color-signal-400)]"
            />
            <span>
              <span className="block text-sm font-medium text-primary">Signaler de façon anonyme</span>
              <span className="mt-1 block text-[12px] leading-relaxed text-muted">
                Votre identité n’est transmise à aucun service et n’apparaît pas sur la carte
                publique. Vous conservez la référence de suivi pour consulter l’avancement.
              </span>
            </span>
          </label>
        </div>
      </Panel>
    </div>
  );
}
