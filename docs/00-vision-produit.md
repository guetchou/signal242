# Vision produit

## 1. Cadrage QQOQCP

**Quoi.** Une plateforme qui transforme un signal émis par un citoyen ou un
salarié en intervention tracée, avec un engagement de délai opposable et une
preuve de résolution. Le signalement n'est pas la finalité : il est l'amorce
d'une chaîne de traitement industrialisée.

**Qui.** Trois populations aux intérêts distincts, servies par un socle
commun.

| Population | Ce qu'elle cherche | Ce qui la fait renoncer |
|---|---|---|
| Citoyen déclarant | Être entendu et constater un résultat | Un formulaire sans retour, une absence de suite |
| Agent de terrain et de permanence | Savoir quoi traiter en premier, avec les bonnes informations | Une boîte de réception indifférenciée, des doublons |
| Décideur — élu, DGS, DST, commandement | Rendre compte avec des chiffres défendables | Des indicateurs invérifiables, un tableur reconstitué à la main |

**Où.** Déploiement initial à Brazzaville, extension à Pointe-Noire et Dolisie,
puis aux capitales régionales d'Afrique centrale. Le référentiel territorial et
la langue sont paramétrables ; l'architecture n'est liée à aucune géographie.

**Quand.** Mise en service en quatre semaines pour une commune, trente jours
pour une agglomération avec reprise d'historique. Cette contrainte de délai est
structurante : elle interdit le développement spécifique au forfait et impose
un produit paramétrable.

**Comment.** Cinq canaux d'entrée — mobile, web, WhatsApp, USSD, centre
d'appel — convergeant vers un référentiel unique, puis quatre temps :
capter, qualifier, acheminer, prouver.

**Pourquoi.** Parce que l'écart entre ce qu'une collectivité reçoit et ce
qu'elle traite n'est aujourd'hui mesuré nulle part. Sans cette mesure, aucun
arbitrage budgétaire sur les services techniques n'est étayé, et la
redevabilité vis-à-vis des administrés reste déclarative.

## 1 bis. Hiérarchie des intentions à l'arrivée

Le produit sert quatre populations, dont les volumes de visite diffèrent de
trois ordres de grandeur. L'architecture des écrans suit cette réalité, non
l'importance commerciale perçue.

| Intention | Population | Volume estimé | Écran |
|---|---|---|---|
| Signaler maintenant | Citoyen avec un problème sous les yeux | Milliers/mois | `/` puis `/signaler` |
| Consulter mon dossier | Citoyen ayant déjà signalé | Centaines/mois | `/` puis `/suivi` |
| Traiter ma file | Agent | Quotidien | `/console` |
| Être convaincu | Acheteur public ou privé | Dizaines/an | `/solution` |

**Deuxième conséquence : le lieu précède la nature du problème.** L'usager
devant un nid-de-poule sait où il se trouve ; il ne sait pas encore dans quelle
case le ranger. Demander la catégorie d'abord lui impose de classer avant de
pouvoir agir — et prive surtout l'étape suivante de tout rapprochement avec ce
qui a déjà été signalé au même endroit. Dans l'ordre retenu, le choix du lieu
déclenche l'affichage des dossiers existants à proximité et propose une
confirmation plutôt qu'un doublon : c'est le premier service rendu aux agents,
et il serait techniquement impossible dans l'ordre inverse.

**Conséquence de conception.** L'accueil fait agir, il ne convainc pas. Placer
le discours commercial en porte d'entrée reviendrait à servir la population la
plus rare aux dépens des trois autres, et à imposer un temps de lecture à un
utilisateur debout dans la rue devant un nid-de-poule.

## 2. Problème adressé

Le marché du signalement citoyen est mature sur la collecte et immature sur
l'exploitation. Les plateformes existantes savent recueillir une photo et une
position ; peu savent répondre aux questions suivantes :

- Ce signalement est-il un doublon des onze autres reçus dans le même pâté de
  maisons ?
- Quel service doit le traiter, et sous quel délai contractuel ?
- Ce délai est-il tenu, et sinon depuis combien de temps ?
- La résolution annoncée est-elle prouvée, et confirmée par le déclarant ?

Il en résulte un effet pervers documenté : la plateforme accroît le volume de
doléances sans accroître la capacité de traitement, dégrade le délai moyen
perçu et finit par éroder la confiance qu'elle prétendait construire.

## 3. Proposition de valeur

**Pour** une collectivité, une autorité de sécurité ou un gestionnaire de site
**qui** reçoit des signalements par des canaux dispersés et non consolidés,
**Signal 242 est** une plateforme de gestion d'incidents territoriaux
**qui** qualifie, achemine et prouve chaque traitement sous délai contractuel,
**contrairement à** un formulaire de signalement adossé à une boîte
partagée,
**notre offre** mesure la nuisance sonore, fonctionne hors ligne et sur
téléphone non connecté, et cloisonne le canal sécurité.

## 4. Quatre différenciateurs défendables

1. **Mesure acoustique intégrée.** Aucune plateforme du panel étudié ne mesure
   le bruit. La plainte cesse d'être une appréciation et devient un relevé
   horodaté, géolocalisé et qualifiable au regard d'un seuil réglementaire.

2. **Couverture des terminaux non connectés.** Le canal USSD atteint une
   population que les applications mobiles excluent structurellement. Dans un
   marché où la pénétration du smartphone reste partielle, c'est une condition
   d'universalité du service public, pas une option.

3. **Cloisonnement du canal sécurité.** Publier la position d'un acte de
   banditisme sur une carte ouverte expose le déclarant et cartographie les
   zones de tension pour quiconque. Le canal sécurité est anonyme par défaut et
   absent de la carte publique.

4. **Engagement de délai opposable.** Le délai est armé au dépôt, connu du
   citoyen avant l'envoi, et mesuré sur la fin d'intervention. Il devient un
   engagement vérifiable plutôt qu'une intention.

## 5. Personas

### Mireille, 34 ans, commerçante à Bacongo
Signale un nid-de-poule devant son étal, qui fait tomber les motos. Elle n'a
pas de compte, pas de temps, et un forfait de données limité. Ce qui la fait
revenir : la référence de suivi reçue en dix secondes, et le message qui
l'informe que l'intervention a eu lieu.

### Armand, 41 ans, agent de permanence à la direction de la voirie
Ouvre sa console à 7 h 30 et doit décider de l'ordre de ses quatre équipes. Ce
dont il a besoin : une file déjà ordonnée par priorité réelle, pas par date
d'arrivée, et la certitude que les doublons sont fusionnés.

### Colonel Nkounkou, centre de commandement
Reçoit les remontées de sécurité. Exige que le canal soit séparé du flux
public, que les déclarants soient protégés, et que la carte de chaleur des
tensions ne quitte pas son périmètre.

### Grace, 47 ans, directrice des moyens généraux d'un site industriel
Veut que ses 600 salariés puissent signaler une ampoule grillée ou une rampe
descellée en deux gestes, et que ces signalements alimentent directement sa
gestion de maintenance sans ressaisie.

## 6. Ce que le produit ne fait pas

Le périmètre exclut délibérément :

- **L'urgence vitale.** Signal 242 n'est pas un centre d'appel d'urgence. Les
  situations mettant en jeu une vie relèvent des numéros dédiés, rappelés dans
  le parcours.
- **La gestion d'intervention détaillée.** Planning des équipes, stocks,
  facturation des travaux relèvent d'une GMAO, vers laquelle la plateforme
  exporte.
- **La délibération citoyenne.** Budget participatif et consultation sont un
  autre métier, avec d'autres acheteurs.

Ce refus est un choix de positionnement : la valeur se concentre sur la chaîne
signal-intervention-preuve, et l'intégration remplace l'extension.
