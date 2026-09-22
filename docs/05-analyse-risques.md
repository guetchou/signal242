# Analyse de risques

## 1. SWOT

### Forces
- Quatre différenciateurs sans équivalent dans le panel concurrentiel : mesure
  acoustique, USSD, canal sécurité cloisonné, engagement de délai armé.
- Architecture en couches avec domaine pur : le cœur métier est testé,
  réutilisable côté serveur, et indépendant du canal.
- Adaptation au contexte des marchés visés — réseau intermittent, terminaux
  hétérogènes, exigence de souveraineté — que les offres nord-américaines et
  européennes ne traitent pas.
- Délai de mise en service court, argument décisif face au développement
  spécifique.

### Faiblesses
- Aucune référence client installée : premier contrat à conquérir sans preuve
  sociale.
- Back-end à construire ; l'engagement commercial porte aujourd'hui sur des
  fonctions spécifiées mais non livrées.
- Canaux USSD et WhatsApp dépendants d'accords opérateurs non conclus.
- Opposabilité juridique du relevé acoustique non établie sans étalonnage
  normalisé et sans validation d'une autorité compétente.
- Équipe réduite : risque de dépendance à un petit nombre de personnes clés.

### Opportunités
- Faible numérisation des services techniques municipaux dans la zone :
  marché peu disputé par les acteurs internationaux.
- Bailleurs de fonds finançant la gouvernance urbaine et la redevabilité —
  source de financement du premier déploiement.
- Segment privé — sites industriels, campus, parcs immobiliers — au cycle de
  vente plus court, finançant l'attente du cycle public.
- Standard Open311 : sa mise en œuvre ouvre les marchés exigeant
  l'interopérabilité et interdit l'enfermement propriétaire.

### Menaces
- Alternance politique annulant un projet porté par une équipe sortante.
- Arrivée d'un acteur international avec une offre localisée.
- Discrédit du service par une adoption citoyenne sans capacité de traitement
  en face : le volume perçu de signalements non traités se retourne contre la
  plateforme et contre la collectivité.
- Détournement du canal sécurité à des fins de dénonciation abusive ou de
  surveillance.
- Contentieux sur la responsabilité : un signalement reçu et non traité peut
  être invoqué en cas d'accident.

## 2. PESTEL

| Dimension | Facteur | Effet |
|---|---|---|
| **Politique** | Cycle électoral municipal | Contractualiser sur plusieurs exercices et ancrer le projet dans l'administration permanente, pas dans le cabinet |
| **Économique** | Contrainte budgétaire des collectivités | Prix d'entrée accessible, financement par bailleur possible, démonstration du coût évité |
| **Social** | Confiance limitée envers l'administration | La preuve de résolution et la carte publique sont le mécanisme de reconstruction, non un supplément |
| **Technologique** | Pénétration partielle du smartphone, réseau intermittent | USSD et mode hors ligne sont des conditions d'universalité, pas des options |
| **Environnemental** | Inondations saisonnières, dégradation de la voirie | Pic de charge prévisible : dimensionner et préparer un mode crise |
| **Légal** | Cadre de protection des données en construction | Anticiper le standard le plus strict ; la conformité par anticipation devient un argument |

## 3. Matrice de risques

Cotation : probabilité (1 à 5) × impact (1 à 5). Traitement obligatoire
au-delà de 12.

| # | Risque | P | I | Score | Traitement |
|---|---|:-:|:-:|:-:|---|
| R1 | Adoption citoyenne sans capacité de traitement en face | 4 | 5 | **20** | Déploiement par paliers : une famille d'incidents et un arrondissement pilote. La campagne d'adoption n'est lancée qu'après validation de la capacité du service. |
| R2 | Relevé acoustique contesté faute d'étalonnage | 4 | 4 | **16** | Mention explicite « indicatif » tant que le terminal n'est pas étalonné, dans l'interface et dans le dossier. Procédure d'étalonnage guidée avant toute revendication d'opposabilité. |
| R3 | Accord opérateur USSD non conclu | 3 | 5 | **15** | Négociation engagée avant tout engagement commercial sur ce canal. Repli documenté : SMS enrichi et centre d'appel. |
| R4 | Alternance politique annulant le projet | 3 | 4 | **12** | Contractualisation pluriannuelle, portage par le secrétariat général, transfert de compétence aux agents permanents. |
| R5 | Détournement du canal sécurité | 3 | 4 | **12** | Traçabilité interne des dépôts anonymes, détection des schémas d'abus, seuil de confirmation avant escalade, revue humaine obligatoire. |
| R6 | Fuite de données personnelles | 2 | 5 | 10 | Minimisation à la conception : le citoyen n'a pas de compte. Chiffrement en transit et au repos, journal d'accès nominatif côté agent. |
| R7 | Dépendance à une personne clé | 3 | 3 | 9 | Documentation d'architecture à jour, tests couvrant le domaine, revue croisée systématique. |
| R8 | Concurrent international localisé | 2 | 4 | 8 | Accélérer l'installation de références locales ; défendre les quatre différenciateurs contextuels. |
| R9 | Pic de charge saisonnier | 3 | 2 | 6 | Dimensionnement élastique, mode crise avec priorisation renforcée. |

## 4. Risque principal et sa conséquence de conception

**R1 est le risque structurant.** L'échec le plus probable de ce produit n'est
pas technique : c'est une plateforme qui fonctionne trop bien pour
l'organisation qui la reçoit. Le volume de signalements non traités devient
alors public, et l'outil se retourne contre son commanditaire.

Ce risque a trois conséquences directes sur le produit.

1. **Déploiement par paliers imposé contractuellement**, jamais un lancement
   sur toutes les familles d'incidents à la fois.
2. **Le tableau de bord expose la tenue des engagements avant le volume.** Un
   outil qui afficherait d'abord le nombre de signalements reçus encouragerait
   à minimiser la collecte ; un outil qui affiche d'abord le taux de tenue
   encourage à traiter.
3. **La gravité déclarée arme un délai connu du citoyen avant l'envoi.**
   L'engagement est explicite, donc arbitrable : une collectivité peut choisir
   des délais qu'elle sait tenir plutôt que des délais qui la mettent en défaut.

## 5. Revue

Cette analyse est révisée à chaque jalon de la feuille de route, et à chaque
signature de contrat — un nouveau client modifie l'exposition, notamment sur
R1 et R5.
