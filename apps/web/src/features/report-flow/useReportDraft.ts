import { useCallback, useMemo, useReducer } from 'react';
import { getCategory } from '@/domain/report/categories';
import type { CategoryId, ReportDraft, Severity } from '@/domain/report/types';

export const STEPS = ['category', 'location', 'evidence', 'review'] as const;
export type StepId = (typeof STEPS)[number];

export const STEP_META: Record<StepId, { title: string; caption: string }> = {
  category: { title: 'Nature', caption: 'De quoi s’agit-il ?' },
  location: { title: 'Lieu', caption: 'Où exactement ?' },
  evidence: { title: 'Preuves', caption: 'Qu’avez-vous constaté ?' },
  review: { title: 'Envoi', caption: 'Vérifiez et transmettez' },
};

type Action =
  | { type: 'set-category'; categoryId: CategoryId }
  | { type: 'set-subtype'; subtypeId: string; severity: Severity }
  | { type: 'patch'; patch: Partial<ReportDraft> };

function createInitialDraft(categoryId: CategoryId = 'roads'): ReportDraft {
  const category = getCategory(categoryId);
  const subtype = category.subtypes[0]!;
  return {
    categoryId,
    subtypeId: subtype.id,
    title: subtype.label,
    description: '',
    position: null,
    address: null,
    severity: subtype.baseSeverity,
    anonymous: category.anonymousByDefault === true,
    attachments: [],
    channel: 'web',
  };
}

function reducer(state: ReportDraft, action: Action): ReportDraft {
  switch (action.type) {
    case 'set-category': {
      // Changer de famille réinitialise le sous-type : un sous-type n'a de sens
      // que dans sa famille d'origine.
      const category = getCategory(action.categoryId);
      const subtype = category.subtypes[0]!;
      return {
        ...state,
        categoryId: action.categoryId,
        subtypeId: subtype.id,
        title: subtype.label,
        severity: subtype.baseSeverity,
        anonymous: category.anonymousByDefault === true ? true : state.anonymous,
        noise: undefined,
      };
    }
    case 'set-subtype':
      return { ...state, subtypeId: action.subtypeId, severity: action.severity };
    case 'patch':
      return { ...state, ...action.patch };
    default:
      return state;
  }
}

/** Règles de complétude par étape — source unique pour la navigation et les messages. */
function validate(draft: ReportDraft): Record<StepId, string | null> {
  const category = getCategory(draft.categoryId);
  return {
    category: draft.subtypeId ? null : 'Choisissez la situation constatée.',
    location: draft.position && draft.address ? null : 'Précisez le lieu du signalement.',
    evidence:
      category.requiresAcoustics && !draft.noise
        ? 'Une mesure sonore est attendue pour cette famille.'
        : draft.description.trim().length >= 12
          ? null
          : 'Décrivez la situation en quelques mots (12 caractères minimum).',
    review: null,
  };
}

/**
 * État du brouillon de signalement.
 *
 * Toute la logique de progression est ici : les composants d'étape ne font que
 * lire et émettre, ce qui les rend testables isolément et interchangeables.
 */
export function useReportDraft(initialCategory?: CategoryId) {
  const [draft, dispatch] = useReducer(reducer, initialCategory, (id) => createInitialDraft(id));

  const errors = useMemo(() => validate(draft), [draft]);

  const setCategory = useCallback(
    (categoryId: CategoryId) => dispatch({ type: 'set-category', categoryId }),
    [],
  );
  const setSubtype = useCallback(
    (subtypeId: string, severity: Severity) => dispatch({ type: 'set-subtype', subtypeId, severity }),
    [],
  );
  const patch = useCallback((value: Partial<ReportDraft>) => dispatch({ type: 'patch', patch: value }), []);

  return { draft, errors, setCategory, setSubtype, patch };
}
