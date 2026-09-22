import { PhoneCall, TriangleAlert } from 'lucide-react';
import { EMERGENCY_CONTACTS, IS_DEMO } from '@/config/demo';
import { getCategory } from '@/domain/report/categories';
import type { CategoryId, Severity } from '@/domain/report/types';
import { cn } from '@/lib/cn';

export interface DemoNoticeProps {
  categoryId: CategoryId;
  severity: Severity;
  className?: string;
}

/**
 * Rappel contextuel du caractère fictif du dépôt.
 *
 * Le bandeau de page couvre l'arrivée sur le site ; celui-ci couvre le moment
 * du risque — l'instant où l'usager s'apprête à transmettre. Il se renforce
 * sur les situations où une méprise aurait des conséquences : famille sécurité,
 * ou gravité critique quelle que soit la famille.
 */
export function DemoNotice({ categoryId, severity, className }: DemoNoticeProps) {
  if (!IS_DEMO) return null;

  const category = getCategory(categoryId);
  const critical = categoryId === 'security' || severity === 'critical';

  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3 rounded-[var(--radius-md)] border p-4',
        critical
          ? 'border-[var(--tone-alert-border)] bg-[var(--tone-alert-bg)]'
          : 'border-[var(--tone-ember-border)] bg-[var(--tone-ember-bg)]',
        className,
      )}
    >
      {critical ? (
        <PhoneCall className="mt-0.5 size-4 shrink-0 text-[var(--tone-alert-text)]" aria-hidden />
      ) : (
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[var(--tone-ember-text)]" aria-hidden />
      )}

      <div className="min-w-0 text-[13px] leading-relaxed">
        <p
          className={cn(
            'font-semibold',
            critical ? 'text-[var(--tone-alert-text)]' : 'text-[var(--tone-ember-text)]',
          )}
        >
          {critical
            ? 'Ce signalement ne parviendra à aucun service.'
            : 'Démonstration : ce signalement ne sera pas transmis.'}
        </p>

        <p className="mt-1 text-secondary">
          {critical ? (
            <>
              Vous vous apprêtez à signaler une situation {category.id === 'security' ? 'de sécurité' : 'critique'}{' '}
              sur une version de démonstration. Aucun agent ne la recevra. Si la situation est
              réelle,{' '}
              {EMERGENCY_CONTACTS.length > 0 ? (
                <>
                  composez immédiatement le{' '}
                  {EMERGENCY_CONTACTS.map((contact, index) => (
                    <span key={contact.number}>
                      {index > 0 && ' ou le '}
                      <a href={`tel:${contact.number}`} className="font-semibold underline">
                        {contact.number}
                      </a>
                    </span>
                  ))}
                  .
                </>
              ) : (
                'composez immédiatement le numéro d’urgence de votre localité ou rendez-vous au commissariat le plus proche.'
              )}
            </>
          ) : (
            <>
              Votre saisie reste dans ce navigateur et disparaîtra au rechargement. Pour un
              problème réel, adressez-vous directement à votre mairie.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
