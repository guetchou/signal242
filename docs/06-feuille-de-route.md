# Feuille de route

## État actuel

Application front-end complète, adossée à un dépôt en mémoire. 47 tests
unitaires couvrent le domaine — acoustique, délais contractuels,
priorisation, agrégats d'exploitation.

| Livré | Non livré |
|---|---|
| Parcours citoyen en quatre étapes | Service back-end et persistance |
| Sonomètre Web Audio et calculs normalisés | Étalonnage guidé du terminal |
| Console : supervision, file priorisée, carte | Authentification des agents |
| Suivi par référence, carte publique | Canaux USSD et WhatsApp |
| Design system bi-thème, accessibilité | Notifications sortantes |
| Repli sur dépendances externes indisponibles | Détection de doublons par proximité |

## Jalon 1 — Socle serveur (6 semaines)

Objectif : substituer l'adaptateur HTTP au dépôt en mémoire sans modifier une
seule vue. C'est le test de validité de l'architecture retenue.

- Service HTTP typé, persistance PostgreSQL avec PostGIS.
- Stockage objet chiffré pour photos et enregistrements sonores.
- Authentification des agents, journal d'accès nominatif.
- Détection de doublons par proximité géographique et sous-type.
- Réutilisation des règles de `domain/` côté serveur, sans duplication.

**Critère de sortie.** Un déploiement de démonstration persiste les données
entre deux sessions, et la détection de doublons fusionne correctement sur un
jeu de test construit à cet effet.

## Jalon 2 — Canaux et notifications (5 semaines)

- Passerelle SMS et USSD, sous réserve de l'accord opérateur (risque R3).
- Canal WhatsApp Business.
- Notifications sortantes : accusé de réception, changement d'état, demande de
  confirmation de clôture.
- Application mobile installable, avec capture hors ligne et file de
  synchronisation persistante.

**Critère de sortie.** Un signalement déposé sans réseau est transmis
intégralement au retour de la connexion, pièces jointes comprises.

## Jalon 3 — Exploitation avancée (6 semaines)

- Règles de routage par territoire et par astreinte, configurables sans
  développement.
- Escalade automatique avant échéance.
- API Open311 GeoReport v2, exposée et documentée.
- Rapport mensuel de redevabilité généré et publiable.
- Connecteurs GMAO et ticketing.

**Critère de sortie.** Un tiers consomme l'API Open311 sans assistance, à
partir de la seule documentation publiée.

## Jalon 4 — Opposabilité acoustique (4 semaines)

- Procédure d'étalonnage guidée, avec source de référence.
- Persistance et traçabilité de l'état d'étalonnage par terminal.
- Scellement de la mesure : position, heure, état d'étalonnage, empreinte.
- Validation du protocole par un laboratoire ou une autorité compétente.

**Critère de sortie.** Un relevé produit par un terminal étalonné est accepté
comme pièce dans une procédure de contrôle. Tant que ce critère n'est pas
atteint, l'interface continue de qualifier la mesure d'indicative — cet
engagement ne doit pas être anticipé commercialement (risque R2).

## Jalon 5 — Segment privé (4 semaines)

- Espaces privés cloisonnés, périmètre géographique dédié.
- Arborescence patrimoniale — bâtiments, étages, équipements.
- QR codes par équipement.
- Authentification d'entreprise.
- Engagements de service internes paramétrables.

**Critère de sortie.** Un site pilote signale et traite un incident de bout en
bout sans qu'aucune donnée ne sorte de son périmètre.

## Séquencement commercial

| Période | Action |
|---|---|
| Jalons 1-2 | Un arrondissement pilote, une à deux familles d'incidents, sans facturation |
| Fin jalon 2 | Premier contrat Commune, sur la base du pilote |
| Jalon 3 | Extension à l'agglomération, réponse aux premiers appels d'offres |
| Jalon 5 | Ouverture du segment privé, cycle de vente court |

Le pilote non facturé est un investissement commercial assumé : il produit la
référence installée qui manque aujourd'hui, identifiée comme faiblesse
principale dans l'analyse SWOT.

## Principe de priorisation

À chaque arbitrage, la question est : **cette fonctionnalité rapproche-t-elle
d'une preuve de résolution, ou ajoute-t-elle du volume de collecte ?** Le
marché est saturé de collecte et vide de preuve. Une fonctionnalité qui ajoute
un canal sans renforcer la chaîne aval passe après celle qui consolide la
preuve.
