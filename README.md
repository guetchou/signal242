# Signal 242

Plateforme de signalement citoyen et de gestion d'incidents urbains, destinée
aux collectivités locales, aux autorités de sécurité et aux organisations
gérant un patrimoine bâti.

La proposition de valeur ne porte pas sur la collecte — le marché la maîtrise —
mais sur ce qui la suit : la qualification automatique, l'acheminement au bon
service, l'engagement de délai et la preuve de résolution.

## Écrans

| Route | Rôle | Public |
|---|---|---|
| `/` | Écran d'action : choisir un type de problème, suivre un dossier, voir l'activité du territoire | Citoyens |
| `/signaler` | Parcours de dépôt en quatre étapes | Citoyens |
| `/suivi` | Consultation d'un dossier par sa référence | Citoyens |
| `/carte` | Carte publique, canal sécurité exclu | Citoyens |
| `/console` | Supervision, file priorisée, carte opérationnelle | Agents |
| `/solution` | Présentation de l'offre | Décideurs |

L'accueil est un écran d'action, non une page de présentation : l'usager qui
arrive veut signaler ou consulter un dossier. Le discours destiné aux
acheteurs vit sur `/solution`, atteint par un lien.

## Périmètre fonctionnel

| Domaine | Contenu |
|---|---|
| Identité territoriale | Brazzaville la Verte, Pointe-Noire la ville océane, Dolisie la ville carrefour — accent, ambiance et compositions basculent avec le territoire |
| Familles d'incidents | Voirie, éclairage, déchets, nuisances sonores, sécurité, eau, énergie, bâti, espaces verts, divers — 40 situations qualifiées |
| Mesure acoustique | LAeq pondéré A, LAmax, L90, émergence, seuil par période réglementaire |
| Parcours citoyen | Dépôt en quatre étapes — lieu, nature, preuves, envoi — sans compte, avec référence de suivi |
| Rapprochement de doublons | Signalements existants affichés dès le choix du lieu, confirmation proposée à la place d'un nouveau dossier |
| Console d'exploitation | Supervision chiffrée, file priorisée, carte opérationnelle, fiche de dossier |
| Transparence | Carte publique, canal sécurité cloisonné, journal d'audit |

## Démarrage

```bash
npm install
npm run dev          # http://localhost:5173
npm run test         # tests unitaires du domaine
npm run typecheck    # vérification de types
npm run build        # build de production
```

Node 20 ou supérieur.

## Mise en ligne

Le projet produit un site statique. Aucun serveur n'est requis pour l'héberger,
mais une règle de réécriture l'est : le routage étant géré côté client, un
accès direct à `/signaler` doit renvoyer `index.html` avec un code 200, faute
de quoi l'hébergeur répond 404. Les configurations fournies s'en chargent.

| Hébergeur | Fichier fourni | Action |
|---|---|---|
| Netlify | `netlify.toml` | Connecter le dépôt, rien à régler |
| Vercel | `vercel.json` | Connecter le dépôt, rien à régler |
| Cloudflare Pages | `apps/web/public/_redirects` | Commande `npm run build`, dossier `apps/web/dist` |

Vérification locale du rendu de production, réécriture comprise :

```bash
npm run build
npm run preview --workspace @signal242/web
```

**Ces configurations visent un déploiement à la racine d'un domaine.** Un
hébergement sur un sous-chemin — GitHub Pages sur `/signal242/` par exemple —
exigerait de renseigner `base` dans la configuration Vite, `basename` sur le
routeur et de faire passer les chemins de polices et de médias par
`import.meta.env.BASE_URL`. Ce travail n'a pas été fait : il n'a pas lieu
d'être si le site vit à la racine.

### Ce qui peut être mis en ligne aujourd'hui

Une **démonstration**, pas un service opérationnel. Le service back-end
n'existe pas encore : les signalements sont produits et conservés en mémoire
dans le navigateur, et disparaissent au rechargement. Exposer cette version
comme un vrai guichet de signalement induirait les habitants en erreur — ils
déposeraient des dossiers que personne ne recevrait.

Une mise en ligne publique suppose donc au minimum le jalon 1 de la feuille de
route — socle serveur et persistance. D'ici là, le déploiement a sa place sur
une adresse de démonstration, signalée comme telle.

## Architecture

L'application suit une architecture en couches avec inversion de dépendance.

```
apps/web/src/
├── domain/             Règles métier pures — aucune dépendance React ni réseau
│   ├── report/         Modèle, taxonomie, délais contractuels, priorisation
│   ├── noise/          Traitement acoustique normalisé
│   ├── ops/            Agrégats d'exploitation
│   └── ports.ts        Contrats dont dépendent les vues
├── infrastructure/     Adaptateurs interchangeables des ports
│   ├── mock/           Dépôt en mémoire, jeu de démonstration déterministe
│   ├── noise/          Sonomètre Web Audio et sonomètre simulé de repli
│   └── geo/            Géolocalisation navigateur
├── design-system/      Primitives et graphiques, pilotés par jetons de thème
├── features/           Fonctionnalités composées, isolées par domaine d'usage
├── app/                Injection de dépendances, thème, routage, pages
└── styles/             Jetons de design, source unique de l'identité visuelle
```

Trois règles structurent le code :

1. **Le domaine ne connaît rien du navigateur.** Les fonctions y sont pures et
   reçoivent l'instant de référence en paramètre, ce qui les rend testables et
   reproductibles.
2. **Les vues dépendent de ports, jamais d'implémentations.** Brancher l'API de
   production revient à substituer un adaptateur dans `ServicesProvider`.
3. **Aucune valeur visuelle brute dans les composants.** Couleurs, rayons et
   durées proviennent de `styles/tokens.css`.

## État et suite

Le dépôt contient une application front-end complète et fonctionnelle, adossée
à un dépôt en mémoire. Le service back-end, l'authentification et les canaux
USSD et WhatsApp décrits dans la documentation restent à construire : voir
[`docs/06-feuille-de-route.md`](docs/06-feuille-de-route.md).

## Documentation

| Document | Objet |
|---|---|
| [`docs/00-vision-produit.md`](docs/00-vision-produit.md) | Cadrage QQOQCP, personas, proposition de valeur |
| [`docs/01-benchmark-concurrentiel.md`](docs/01-benchmark-concurrentiel.md) | Analyse du marché et positionnement |
| [`docs/02-architecture-technique.md`](docs/02-architecture-technique.md) | Architecture, décisions structurantes, cible back-end |
| [`docs/03-design-system.md`](docs/03-design-system.md) | Principes visuels, jetons, accessibilité |
| [`docs/04-modele-economique.md`](docs/04-modele-economique.md) | Tarification, coûts, seuil de rentabilité |
| [`docs/05-analyse-risques.md`](docs/05-analyse-risques.md) | SWOT, PESTEL, matrice de risques |
| [`docs/06-feuille-de-route.md`](docs/06-feuille-de-route.md) | Trajectoire produit et jalons |

Les données affichées dans l'application sont fictives et générées
localement. Aucune donnée réelle de collectivité n'est utilisée.
