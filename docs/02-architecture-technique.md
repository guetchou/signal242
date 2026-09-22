# Architecture technique

## 1. Principes

Trois principes gouvernent la structure du code et se vérifient par lecture du
graphe de dépendances.

**Le domaine est pur.** `src/domain/` ne référence ni React, ni le DOM, ni le
réseau. Les fonctions y reçoivent l'instant de référence en paramètre plutôt
que d'appeler `Date.now()`, ce qui rend les tests déterministes et rendra le
calcul réutilisable côté serveur sans duplication de règle.

**Les vues dépendent de contrats.** `src/domain/ports.ts` déclare
`ReportRepository`, `GeolocationPort` et `NoiseMeterPort`. Aucun composant
n'importe une implémentation ; `ServicesProvider` injecte l'adaptateur retenu.
Le passage de la démonstration à l'API de production est un changement d'une
ligne.

**L'identité visuelle est centralisée.** Aucune valeur de couleur, de rayon ou
de durée n'apparaît dans un composant. `styles/tokens.css` est la source
unique ; les composants consomment des rôles sémantiques.

## 2. Couches

```
domain/          Règles métier — ne dépend de rien
   ↑
infrastructure/  Adaptateurs — dépend de domain/ports
   ↑
features/        Fonctionnalités — dépend de domain et design-system
   ↑
app/             Composition — injection, routage, pages
```

Les flèches représentent le sens autorisé des dépendances. Une importation de
`features/` depuis `domain/` est une erreur d'architecture.

## 3. Décisions structurantes

### D1 — Un modèle interne aligné sur Open311, sans y être asservi
Les statuts reprennent le vocabulaire de GeoReport v2 (`open`, `in_progress`,
`closed`) afin qu'une API conforme puisse être exposée sans traduction
coûteuse. Le modèle interne va toutefois au-delà du standard — gravité,
mesure acoustique, score de priorité — que la spécification ne couvre pas.

### D2 — `resolvedAt` distinct de `updatedAt`
L'engagement de l'administration porte sur la fin d'intervention, non sur le
dernier événement du dossier. Mesurer le délai sur `updatedAt` faisait
basculer hors délai des dossiers traités dans les temps mais confirmés
tardivement par le déclarant. Deux tests de non-régression fixent ce
comportement.

### D3 — Le calcul acoustique appartient au domaine, pas à l'adaptateur
`infrastructure/noise/webAudioMeter.ts` capture et transmet des échantillons ;
`domain/noise/acoustics.ts` calcule. Conséquence directe : le même code
produit les indicateurs d'une capture microphone, d'un fichier audio importé
ou, demain, d'un capteur fixe déployé sur mobilier urbain.

### D4 — Repli systématique sur les dépendances externes
Le microphone peut être refusé, le fond cartographique inaccessible, le
presse-papiers bloqué. Chaque dépendance externe dispose d'un chemin dégradé
explicite : sonomètre simulé, carte schématique, référence sélectionnable à la
main. Un outil d'exploitation ne rend jamais un écran vide.

### D5 — Graphiques construits sur mesure plutôt qu'importés
Les visualisations sont du SVG écrit à la main, sans bibliothèque de
graphiques. Motifs : maîtrise complète du rendu dans les deux thèmes, poids
réduit, et respect d'une discipline de visualisation que les bibliothèques
génériques ne garantissent pas — teinte unique pour une comparaison de
magnitudes, palette d'état réservée, légende obligatoire au-delà d'une série.

### D6 — Polices auto-hébergées
Aucune requête vers un service tiers au chargement. Motifs : absence de fuite
d'adresse IP des visiteurs, fonctionnement en réseau restreint, rendu garanti
hors ligne. Coût : 224 Ko de sous-ensembles latins.

## 4. Pile technique

| Couche | Choix | Justification |
|---|---|---|
| Interface | React 19, TypeScript strict | Écosystème, typage du domaine métier |
| Build | Vite 7 | Démarrage à froid rapide, sortie standard |
| Styles | Tailwind CSS 4 avec jetons CSS | Classes utilitaires adossées à des variables de thème |
| Cartographie | MapLibre GL | Sans clé d'API, fond de plan substituable par le client |
| Acoustique | Web Audio API | Disponible sur tous les navigateurs mobiles récents |
| Tests | Vitest | 47 tests sur le domaine pur |

## 5. Cible back-end

L'application front-end est complète ; le service reste à construire. La cible
retenue, cohérente avec les ports existants :

| Composant | Choix visé | Motif |
|---|---|---|
| API | Service HTTP typé, exposant une façade Open311 | Interopérabilité exigée par les marchés publics |
| Persistance | PostgreSQL avec extension PostGIS | Requêtes spatiales pour la détection de doublons par proximité |
| Fichiers | Stockage objet compatible S3 | Photos et enregistrements sonores, chiffrés au repos |
| File de traitement | File de messages durable | Notifications, escalades, synchronisation différée |
| Authentification | Agents uniquement ; le citoyen reste anonyme | Réduction de la surface de données personnelles |

**Détection de doublons.** Règle visée : regroupement des signalements de même
sous-type dans un rayon paramétrable — 50 m par défaut en zone dense — sur une
fenêtre glissante de 72 h. Chaque signalement regroupé devient une
confirmation, qui alimente le score de priorité et peut déclencher une
remontée de gravité. La règle de remontée est déjà implémentée dans
`domain/report/sla.ts`.

## 6. Dette assumée

| Point | État | Échéance |
|---|---|---|
| Dépôt en mémoire | Suffisant pour la démonstration | Remplacé par l'adaptateur HTTP au sprint back-end |
| Géocodage inverse approché | Grille de quartiers de référence | Nominatim ou référentiel cadastral local |
| Étalonnage du sonomètre | Décalage persisté, procédure guidée non implémentée | Avant toute revendication d'opposabilité |
| Canaux USSD et WhatsApp | Spécifiés, non implémentés | Dépendent d'un accord opérateur |
| Tests d'interface | Absents ; seul le domaine est couvert | Tests de parcours sur le dépôt et la file |

Cette dette est documentée plutôt que masquée : chaque ligne correspond à un
engagement pris dans la documentation commerciale et doit être tenue avant
d'être vendue.
