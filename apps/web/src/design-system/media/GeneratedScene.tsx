import { useId } from 'react';
import type { SceneSubject } from './registry';

/**
 * Composition de repli d'un emplacement média.
 *
 * Dessinée en SVG à partir des couleurs du territoire courant : la page reste
 * habitée avant l'arrivée des photographies, et l'identité chromatique
 * s'applique jusque dans les images. Les silhouettes humaines sont abstraites
 * et sans visage — une image générée ne doit jamais passer pour une
 * photographie d'une personne réelle.
 */
export function GeneratedScene({ subject, className }: { subject: SceneSubject; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const sky = `sky-${uid}`;
  const deep = `deep-${uid}`;
  const glow = `glow-${uid}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="var(--ambient-3)" />
          <stop offset="58%" stopColor="var(--ambient-1)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--ambient-2)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={deep} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ambient-3)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--ambient-3)" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0%" stopColor="var(--ambient-2)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--ambient-2)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${sky})`} />
      <circle cx="312" cy="66" r="76" fill={`url(#${glow})`} />

      {subject === 'skyline' && <Skyline deep={deep} />}
      {subject === 'river' && <River deep={deep} />}
      {subject === 'ocean' && <Ocean deep={deep} />}
      {subject === 'street' && <Street deep={deep} />}
      {subject === 'night' && <NightStreet deep={deep} />}
      {subject === 'people' && <People deep={deep} />}
      {subject === 'crew' && <Crew deep={deep} />}

      {/* Grain léger : évite l'aplat trop net d'un dégradé pur. */}
      <rect width="400" height="300" fill="var(--ambient-3)" opacity="0.05" />
    </svg>
  );
}

/** Hauteurs de bâtiments fixes : une scène doit être stable d'un rendu à l'autre. */
const BUILDINGS = [
  [12, 118, 30, 182],
  [46, 92, 26, 208],
  [76, 140, 34, 160],
  [114, 74, 28, 226],
  [146, 126, 40, 174],
  [190, 98, 30, 202],
  [224, 150, 36, 150],
  [264, 86, 26, 214],
  [294, 132, 44, 168],
  [342, 106, 30, 194],
] as const;

/** Arbre stylisé — la canopée est l'élément d'identité de la scène urbaine. */
function Tree({ x, y, scale = 1, opacity = 0.55 }: { x: number; y: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-2" y="-14" width="4" height="26" fill="var(--ambient-3)" opacity="0.8" />
      <ellipse cx="0" cy="-22" rx="19" ry="16" fill="var(--ambient-1)" />
      <ellipse cx="-12" cy="-12" rx="13" ry="11" fill="var(--ambient-1)" opacity="0.85" />
      <ellipse cx="12" cy="-13" rx="12" ry="10" fill="var(--ambient-1)" opacity="0.7" />
    </g>
  );
}

function Skyline({ deep }: { deep: string }) {
  return (
    <g>
      {/* Plan lointain, atténué : donne la profondeur d'une ville étendue. */}
      {BUILDINGS.map(([x, y, w, h]) => (
        <rect
          key={`far-${x}`}
          x={x + 16}
          y={y + 34}
          width={w * 0.8}
          height={h - 34}
          fill="var(--ambient-3)"
          opacity="0.28"
        />
      ))}

      {BUILDINGS.map(([x, y, w, h]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={h} rx="2" fill="var(--ambient-3)" opacity="0.8" />
          {/* Fenêtres éclairées : ce qui distingue une ville d'un graphique. */}
          {Array.from({ length: Math.floor((h - 20) / 22) }).map((_, row) =>
            Array.from({ length: Math.max(Math.floor(w / 13), 1) }).map((__, col) => {
              const lit = (row * 7 + col * 3 + x) % 5 < 2;
              if (!lit) return null;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={x + 5 + col * 13}
                  y={y + 12 + row * 22}
                  width="5"
                  height="7"
                  fill="var(--ambient-2)"
                  opacity="0.55"
                />
              );
            }),
          )}
        </g>
      ))}

      <rect y="228" width="400" height="72" fill={`url(#${deep})`} />

      {/* Avenue plantée au premier plan : l'identité verte se lit dans la silhouette. */}
      {[14, 62, 116, 172, 226, 282, 336, 388].map((x, index) => (
        <Tree key={x} x={x} y={252} scale={index % 2 === 0 ? 1 : 0.82} opacity={index % 2 === 0 ? 0.6 : 0.45} />
      ))}
      <rect y="268" width="400" height="3" fill="var(--ambient-2)" opacity="0.28" />
    </g>
  );
}

function River({ deep }: { deep: string }) {
  return (
    <g>
      <path d="M0,196 C90,180 150,212 240,198 C310,187 356,204 400,196 L400,300 L0,300 Z" fill={`url(#${deep})`} />
      {[212, 232, 252, 272].map((y, index) => (
        <path
          key={y}
          d={`M0,${y} C70,${y - 8} 140,${y + 8} 210,${y} C280,${y - 7} 340,${y + 6} 400,${y}`}
          fill="none"
          stroke="var(--ambient-2)"
          strokeWidth="1.6"
          opacity={0.36 - index * 0.06}
        />
      ))}
      {BUILDINGS.slice(0, 6).map(([x, y, w, h]) => (
        <rect key={x} x={x} y={y + 44} width={w} height={h - 44} rx="2" fill="var(--ambient-3)" opacity="0.5" />
      ))}
    </g>
  );
}

function Ocean({ deep }: { deep: string }) {
  return (
    <g>
      <rect y="168" width="400" height="132" fill={`url(#${deep})`} />
      {[182, 204, 226, 250, 276].map((y, index) => (
        <path
          key={y}
          d={`M-10,${y} C60,${y - 11} 120,${y + 9} 200,${y} C280,${y - 10} 340,${y + 8} 410,${y}`}
          fill="none"
          stroke="var(--ambient-2)"
          strokeWidth={2.2 - index * 0.25}
          opacity={0.5 - index * 0.07}
        />
      ))}
      {/* Grue portuaire : Pointe-Noire est d'abord un port. */}
      <g opacity="0.55" fill="var(--ambient-3)">
        <rect x="316" y="112" width="5" height="60" />
        <rect x="286" y="110" width="72" height="5" />
        <rect x="352" y="112" width="4" height="22" />
      </g>
    </g>
  );
}

function Street({ deep }: { deep: string }) {
  return (
    <g>
      <path d="M0,300 L152,186 L248,186 L400,300 Z" fill={`url(#${deep})`} />
      {[0, 1, 2, 3].map((index) => (
        <rect
          key={index}
          x={198 - 3}
          y={200 + index * 26}
          width="6"
          height={12 + index * 5}
          fill="var(--ambient-2)"
          opacity="0.5"
        />
      ))}
      {[46, 354].map((x) => (
        <g key={x} fill="var(--ambient-3)" opacity="0.6">
          <rect x={x} y={120} width="4" height="76" />
          <rect x={x - 12} y={116} width="28" height="5" rx="2" />
        </g>
      ))}
    </g>
  );
}

function NightStreet({ deep }: { deep: string }) {
  return (
    <g>
      <rect y="196" width="400" height="104" fill={`url(#${deep})`} />
      {[60, 150, 240, 330].map((x, index) => {
        const lit = index !== 2; // un lampadaire éteint : le motif du signalement
        return (
          <g key={x}>
            <rect x={x} y="112" width="4" height="86" fill="var(--ambient-3)" opacity="0.75" />
            <rect x={x - 13} y="108" width="30" height="5" rx="2" fill="var(--ambient-3)" opacity="0.75" />
            {lit && (
              <>
                <circle cx={x + 2} cy="118" r="26" fill="var(--ambient-2)" opacity="0.2" />
                <path d={`M${x - 20},198 L${x + 2},118 L${x + 24},198 Z`} fill="var(--ambient-2)" opacity="0.1" />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

/** Silhouettes sans visage : une image générée ne doit pas simuler une photo. */
function Figure({ x, scale = 1, opacity = 0.8 }: { x: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} 300) scale(${scale})`} fill="var(--ambient-3)" opacity={opacity}>
      <circle cx="0" cy="-104" r="13" />
      <path d="M-16,-90 C-16,-70 -14,-48 -12,-30 L-4,-30 L-2,-62 L2,-62 L4,-30 L12,-30 C14,-48 16,-70 16,-90 Z" />
    </g>
  );
}

function People({ deep }: { deep: string }) {
  return (
    <g>
      <rect y="214" width="400" height="86" fill={`url(#${deep})`} />
      <Figure x={128} scale={1.25} opacity={0.85} />
      <Figure x={196} scale={0.95} opacity={0.6} />
      <Figure x={262} scale={1.08} opacity={0.72} />
      {/* Halo du téléphone : le geste de signalement, sans montrer de visage. */}
      <circle cx="146" cy="-0.5" r="0" />
      <rect x="140" y="182" width="12" height="19" rx="2.5" fill="var(--ambient-2)" opacity="0.85" />
      <circle cx="146" cy="191" r="24" fill="var(--ambient-2)" opacity="0.16" />
    </g>
  );
}

function Crew({ deep }: { deep: string }) {
  return (
    <g>
      <rect y="222" width="400" height="78" fill={`url(#${deep})`} />
      {/* Zone d'intervention balisée */}
      <path d="M96,300 L120,236 L282,236 L306,300 Z" fill="var(--ambient-1)" opacity="0.18" />
      <Figure x={150} scale={1.15} opacity={0.85} />
      <Figure x={252} scale={1.05} opacity={0.72} />
      {[196, 216, 236].map((x) => (
        <path key={x} d={`M${x},262 L${x + 9},280 L${x - 9},280 Z`} fill="var(--ambient-2)" opacity="0.7" />
      ))}
    </g>
  );
}
