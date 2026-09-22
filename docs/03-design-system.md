# Design system

## 1. Intention

Deux registres cohabitent, et leur frontière est explicite.

**Les écrans de travail** — accueil, dépôt, suivi, carte, console — sont sobres
et denses. Fond clair, surfaces blanches détachées par une bordure nette et une
ombre courte, un seul accent, aucun ornement. Dans un formulaire ou une file de
traitement, un halo coloré est du bruit : il concurrence l'information qu'il
est censé mettre en valeur.

**La page d'offre** (`/solution`) assume un registre de démonstration
commerciale : halos, grain, dégradés de titre, bandeau d'activité. Ce registre
s'adresse à un décideur qui juge la crédibilité d'un outil d'exploitation à sa
première impression, et il est circonscrit à cette seule page.

Les deux registres sont soumis aux mêmes contraintes non négociables :
contraste conforme, navigation clavier intégrale, respect des préférences de
mouvement réduit.

## 1 bis. Thème

Le thème clair est le thème principal. C'est celui d'une application métier
consultée en journée, sur des postes d'agents et des téléphones en extérieur.
Le thème sombre reste disponible — permanences, usage nocturne — et la
préférence est conservée.

L'élévation se lit à l'inverse d'un thème à l'autre : en clair, une surface
élevée est **plus claire** que le fond, détachée par une bordure et une ombre
courte. Transposer la surface translucide grise du thème sombre aplatirait
toute la hiérarchie. Les voiles d'interaction suivent la même logique :
éclaircir sur fond sombre, assombrir sur fond clair.

## 2. Jetons

`styles/tokens.css` est la source unique. Deux niveaux d'indirection :

1. **Palette brute** — `--color-signal-400`, `--color-night-850`. Jamais
   référencée directement par un composant.
2. **Rôles sémantiques** — `--surface-raised`, `--text-muted`,
   `--tone-alert-text`. Redéfinis intégralement pour chaque thème.

Le thème clair n'est pas une inversion automatique du thème sombre. Chaque
palier y est resélectionné : une teinte lisible sur fond sombre échoue au
contraste sur fond blanc. Cette règle a corrigé 69 occurrences lors de la
revue du rendu clair.

## 3. Typographie

| Famille | Usage | Raison |
|---|---|---|
| Sora | Titres | Grotesque géométrique, forte présence aux grandes tailles |
| Inter | Texte courant, interface | Lisibilité aux petites tailles, jeu de graisses complet |
| JetBrains Mono | Chiffres, références, horodatages | Chiffres tabulaires : les colonnes de KPI ne dansent pas |

Toute donnée chiffrée porte la classe `numeric`, qui impose la police à
chasse fixe et les chiffres tabulaires. Un indicateur qui change de largeur à
chaque rafraîchissement est illisible.

## 4. Rôles chromatiques

Six rôles, jamais des couleurs libres.

| Rôle | Signification | Usage |
|---|---|---|
| `signal` | Validation, résolution, identité de marque | État résolu, action principale |
| `ember` | Vigilance, traitement en cours | Échéance proche, intervention engagée |
| `alert` | Criticité, urgence | Hors délai, gravité critique, canal sécurité |
| `cortex` | Couche analytique | Mesure acoustique, qualification |
| `pulse` | Flux temps réel, capteurs | Dépôt récent, télémétrie |
| `neutral` | Absence d'état | Dossier clos, information secondaire |

Les correspondances gravité → rôle, statut → rôle et état de délai → rôle sont
déclarées une seule fois dans `design-system/tones.ts`. Aucun composant ne
décide d'une couleur.

## 5. Visualisation de données

Les graphiques suivent une discipline explicite, vérifiée par outil pour la
partie colorimétrique.

**Palette de séries validée.** Cinq teintes, sélectionnées séparément pour
chaque surface, contrôlées sur cinq critères : bande de clarté OKLCH, plancher
de chroma, séparation en vision déficiente, séparation en vision normale,
contraste au fond.

| Rôle | Surface sombre | Surface claire |
|---|---|---|
| Série 1 | `#00a87c` | `#00805e` |
| Série 2 | `#8a6bff` | `#6b45f0` |
| Série 3 | `#c98300` | `#9a6500` |
| Série 4 | `#1f9ec4` | `#0a7c9c` |
| Série 5 | `#ef3450` | `#cc1030` |

**Règles appliquées.**

- La forme découle du travail demandé à la donnée : magnitude → barres
  classées ; évolution → courbe unique ; état → barre empilée d'états ;
  valeur unique bornée avec seuil → cadran radial.
- Une comparaison de magnitudes nommées emploie **une seule teinte**. Colorer
  chaque famille d'incident laisserait croire à un codage sémantique
  inexistant — et deux familles partageant une teinte de marque deviendraient
  indiscernables. Les libellés portent l'identité.
- La palette d'état — bon, vigilance, critique — est **réservée** et n'est
  jamais réutilisée comme couleur de série. Chaque segment est accompagné d'un
  libellé, d'un glyphe et d'une valeur : l'état n'est jamais porté par la
  couleur seule.
- Jamais deux échelles verticales sur un même graphique.
- Les marques restent fines : trait de 2 px, écart de 2 px entre segments
  empilés, anneau de surface sur les points superposés.
- Le texte porte des jetons de texte, jamais la couleur de la série.

## 6. Accessibilité

| Exigence | Mise en œuvre |
|---|---|
| Contraste | Rôles chromatiques revalidés par thème ; palette de séries vérifiée par script |
| Clavier | Contour de focus visible sur tout élément interactif, lien d'évitement en tête de page |
| Mouvement | `prefers-reduced-motion` neutralise animations, transitions et défilement lissé |
| Structure | Titres hiérarchisés, listes sémantiques, `fieldset`/`legend` sur les groupes de choix |
| Images | Graphiques porteurs de `role="img"` et d'une description textuelle |
| Animation décorative | Bandeau défilant masqué aux technologies d'assistance |

## 7. États d'interface

Tout composant affichant des données distantes rend explicitement trois états,
conçus en même temps que l'état nominal :

- **Chargement** — indicateur et message, jamais une page blanche.
- **Vide** — cause probable et action de sortie, jamais un cadre vide.
- **Erreur** — message actionnable, saisie de l'utilisateur préservée.

La latence simulée de l'adaptateur en mémoire est délibérée : elle force à
traiter ces états dès la conception plutôt qu'à les découvrir en production.
