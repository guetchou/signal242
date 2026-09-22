/**
 * Générateur de jeu de démonstration.
 *
 * Déterministe : un générateur pseudo-aléatoire à graine fixe garantit un
 * rendu identique à chaque exécution, condition indispensable pour une
 * démonstration commerciale reproductible et pour des captures d'écran stables.
 */

import { CATEGORIES } from '@/domain/report/categories';
import { computeDueDate } from '@/domain/report/sla';
import type {
  Report,
  ReportChannel,
  ReportStatus,
  Severity,
  TimelineEvent,
} from '@/domain/report/types';
import { CITY, DISTRICTS, streetAt } from './districts';

/** Générateur congruentiel linéaire : suffisant et sans dépendance. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

const pick = <T,>(random: () => number, items: readonly T[]): T =>
  items[Math.floor(random() * items.length)] ?? items[0]!;

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeReference(random: () => number, index: number): string {
  let block = '';
  for (let i = 0; i < 4; i += 1) {
    block += REFERENCE_ALPHABET[Math.floor(random() * REFERENCE_ALPHABET.length)];
  }
  return `SIG-${block}-${String(index).padStart(2, '0')}`;
}

const CHANNELS: readonly ReportChannel[] = ['mobile', 'web', 'whatsapp', 'ussd', 'call_center'];
const SEVERITIES: readonly Severity[] = ['low', 'moderate', 'high', 'critical'];
const STATUSES: readonly ReportStatus[] = [
  'submitted',
  'triaged',
  'in_progress',
  'in_progress',
  'resolved',
  'closed',
];

const ALIASES = [
  'Citoyen anonyme',
  'Mireille N.',
  'Patrick O.',
  'Grace M.',
  'Serge B.',
  'Fatou D.',
  'Armand K.',
  'Léonie T.',
  'Brice S.',
];

const TEAM_ACTORS = ['Cellule de qualification', 'Brigade voirie 2', 'Équipe éclairage nord', 'Police municipale'];

function buildTimeline(
  random: () => number,
  status: ReportStatus,
  createdAt: Date,
  team: string,
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: 'e0',
      at: createdAt.toISOString(),
      kind: 'created',
      label: 'Signalement déposé',
      actor: 'Citoyen',
    },
  ];
  const step = (hours: number) => new Date(createdAt.getTime() + hours * 3_600_000).toISOString();
  const reached = STATUSES.indexOf(status);

  if (status !== 'submitted') {
    events.push({
      id: 'e1',
      at: step(1 + random() * 5),
      kind: 'assignment',
      label: `Affecté à ${team}`,
      actor: pick(random, TEAM_ACTORS),
    });
  }
  if (reached >= 2) {
    events.push({
      id: 'e2',
      at: step(8 + random() * 20),
      kind: 'status',
      label: 'Intervention engagée',
      actor: team,
      detail: 'Équipe dépêchée sur site avec bon de travaux.',
    });
  }
  if (status === 'resolved' || status === 'closed') {
    events.push({
      id: 'e3',
      at: step(30 + random() * 60),
      kind: 'evidence',
      label: 'Photo de fin de chantier transmise',
      actor: team,
    });
  }
  if (status === 'closed') {
    events.push({
      id: 'e4',
      at: step(72 + random() * 40),
      kind: 'status',
      label: 'Clôture confirmée par le déclarant',
      actor: 'Citoyen',
    });
  }
  return events;
}

/**
 * Construit le corpus de démonstration.
 * @param count nombre de signalements à produire
 * @param now instant de référence, injecté pour la reproductibilité
 */
export function buildSeedReports(count: number, now: Date): Report[] {
  const random = createRandom(24_242);
  const reports: Report[] = [];

  for (let index = 0; index < count; index += 1) {
    const category = pick(random, CATEGORIES);
    const subtype = pick(random, category.subtypes);
    const district = pick(random, DISTRICTS);
    const status = pick(random, STATUSES);

    // Gravité : ancrée sur le sous-type, avec une variation contrôlée.
    const baseIndex = SEVERITIES.indexOf(subtype.baseSeverity);
    const drift = random() < 0.25 ? (random() < 0.5 ? -1 : 1) : 0;
    const severity = SEVERITIES[Math.min(Math.max(baseIndex + drift, 0), 3)]!;

    const ageHours = Math.pow(random(), 1.7) * 720;
    const createdAt = new Date(now.getTime() - ageHours * 3_600_000);
    const dueAt = computeDueDate(category.id, severity, createdAt);
    const team = category.defaultTeam;
    const timeline = buildTimeline(random, status, createdAt, team);
    const updatedAt = timeline[timeline.length - 1]?.at ?? createdAt.toISOString();

    const anonymous = category.anonymousByDefault === true || random() < 0.22;
    const confirmations = Math.floor(Math.pow(random(), 2.4) * 48);

    reports.push({
      id: `rep_${index}`,
      reference: makeReference(random, index),
      categoryId: category.id,
      subtypeId: subtype.id,
      title: subtype.label,
      description: `${subtype.label} signalé sur ${streetAt(index)}, quartier ${district.name}. ${
        subtype.hint ?? 'Situation constatée sur place par le déclarant.'
      }`,
      status,
      severity,
      channel: pick(random, CHANNELS),
      position: {
        lat: district.lat + (random() - 0.5) * 0.018,
        lng: district.lng + (random() - 0.5) * 0.018,
        accuracyM: Math.round(4 + random() * 22),
      },
      address: { label: streetAt(index), district: district.name, city: CITY },
      createdAt: createdAt.toISOString(),
      updatedAt,
      dueAt: dueAt.toISOString(),
      anonymous,
      reporterAlias: anonymous ? 'Déclarant protégé' : pick(random, ALIASES),
      assignedTeam: status === 'submitted' ? undefined : team,
      confirmations,
      attachments:
        random() < 0.78
          ? [
              {
                id: `att_${index}`,
                kind: 'photo',
                url: `#photo-${index}`,
                capturedAt: createdAt.toISOString(),
              },
            ]
          : [],
      noise:
        category.id === 'noise'
          ? {
              laeq: Math.round((52 + random() * 34) * 10) / 10,
              lmax: Math.round((72 + random() * 26) * 10) / 10,
              l90: Math.round((38 + random() * 14) * 10) / 10,
              durationS: 30 + Math.floor(random() * 90),
              calibrationOffsetDb: Math.round((random() * 6 - 3) * 10) / 10,
              calibrated: random() < 0.65,
              measuredAt: createdAt.toISOString(),
            }
          : undefined,
      timeline,
    });
  }

  return reports.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
