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

## 1 ter. Identité territoriale

La plateforme se pare des couleurs du territoire qu'elle sert. Ce n'est pas un
habillage : une collectivité reconnaît son identité dans l'outil qu'elle
déploie, un agent travaillant sur plusieurs territoires sait lequel il
consulte, et l'argument de personnalisation distingue une offre mutualisée
d'un produit générique.

| Territoire | Surnom d'usage | Registre | Ambiance |
|---|---|---|---|
| Brazzaville | Brazza la Verte | Vert fleuve et feuillage | Feuillage porté par le vent |
| Pointe-Noire | La ville océane | Bleu océan et turquoise | Houle du large |
| Dolisie | La ville carrefour | Ocre de latérite et forêt | Rail et route qui se croisent |

Un attribut `data-territory` sur la racine du document bascule l'accent et
l'ambiance par simple cascade. Le territoire redéfinit l'accent, ses surfaces
dérivées, le halo et les trois couleurs d'ambiance — jamais les couleurs de
série des graphiques, validées globalement pour l'accessibilité, ni les
couleurs d'état, dont la signification est fixe.

Chaque accent est vérifié à 4,5:1 au moins contre sa couleur de premier plan,
dans les deux thèmes. Cette vérification a corrigé un défaut existant : le
vert de Brazzaville en thème clair plafonnait à 4,09:1 contre du blanc et a été
porté au palier supérieur.

## 1 quater. Ambiances et effets

Un effet n'est retenu que pour ce qu'il dit. La pluie n'apparaît que sur
l'eau et l'assainissement, dont les signalements suivent la saison ; le
feuillage sur les espaces verts ; la houle sur le littoral. Ailleurs, rien.
Les effets purement démonstratifs — vue à 360 degrés, animations d'horloge
décoratives — ont été écartés : ils coûtent en poids et en attention sans rien
apprendre au visiteur.

Tous les effets sont décoratifs au sens de l'accessibilité, masqués aux
technologies d'assistance, sans capture du pointeur, et neutralisés sous
`prefers-reduced-motion`.

## 1 quinquies. Emplacements média

Chaque visuel du site est déclaré dans `design-system/media/registry.ts` avec
son cadrage, son texte alternatif définitif et un brief de prise de vue. Tant
qu'aucun fichier n'est déposé sous `public/media/`, l'emplacement rend une
composition SVG générée à partir des couleurs du territoire — silhouette
urbaine, berge, littoral, rue de nuit, équipe d'intervention.

Deux conséquences : la mise en page se conçoit et se valide avant qu'une seule
photographie ait été commandée, et la livraison des visuels ne demande aucune
reprise de code. Les silhouettes humaines des compositions sont abstraites et
sans visage : une image générée ne doit jamais passer pour la photographie
d'une personne réelle.

**Photographies à produire.** Le registre tient lieu de commande : sept
emplacements, du plan large de ville au portrait recadrable en cercle, chacun
avec ses dimensions et son intention. Les prises de vue montrant des personnes
identifiables exigent un accord écrit.

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
