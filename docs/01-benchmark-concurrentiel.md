# Benchmark concurrentiel

Analyse établie en septembre 2026 à partir de la documentation publique des
éditeurs et de la spécification Open311 GeoReport v2. Elle vise le
positionnement, non l'exhaustivité fonctionnelle.

## 1. Cartographie du marché

Le marché se structure en quatre modèles économiques distincts.

| Modèle | Représentants | Logique | Limite |
|---|---|---|---|
| Open source hébergé | FixMyStreet (mySociety) | Socle gratuit, prestation d'hébergement et d'adaptation | Exploitation à la charge du client ; qualification manuelle |
| Suite municipale intégrée | SeeClickFix, absorbé par CivicPlus | Le signalement comme module d'un écosystème (site, agenda, 311) | Vente liée à la suite ; ancrage nord-américain |
| Offre francophone de proximité | TellMyCity, BetterStreet, PanneauPocket | Application citoyenne simple, déploiement rapide | Faible profondeur d'exploitation ; pas d'engagement de délai armé |
| Développement spécifique | Prestataires locaux | Sur mesure au forfait | Coût élevé, délai long, dépendance au prestataire |

**Lecture.** Les trois premiers modèles convergent sur la collecte et divergent
sur l'aval. Aucun ne traite le bruit, l'absence de réseau ou la confidentialité
du canal sécurité.

## 2. Comparatif fonctionnel

Légende : ● couvert · ◐ partiel · ○ absent

| Critère | Signal 242 | FixMyStreet | SeeClickFix / CivicPlus | TellMyCity |
|---|:--:|:--:|:--:|:--:|
| Dépôt géolocalisé avec photo | ● | ● | ● | ● |
| Suivi public du dossier | ● | ● | ● | ◐ |
| Interopérabilité Open311 GeoReport v2 | ● | ● | ● | ○ |
| Fusion automatique des doublons | ● | ◐ | ● | ○ |
| Délais contractuels par gravité, escalade | ● | ◐ | ● | ◐ |
| **Mesure acoustique intégrée** | ● | ○ | ○ | ○ |
| **Canal USSD, sans données mobiles** | ● | ○ | ○ | ○ |
| **Canal sécurité cloisonné et anonyme** | ● | ○ | ◐ | ○ |
| Capture hors ligne et resynchronisation | ● | ◐ | ◐ | ◐ |
| Espace privé entreprise ou site | ● | ○ | ○ | ○ |
| Rapport public de redevabilité | ● | ● | ● | ◐ |
| Hébergement souverain sur le continent | ● | ◐ | ○ | ○ |

Les quatre lignes en gras constituent le positionnement défendable. Les autres
sont des conditions d'entrée sur le marché : les absents y perdent des appels
d'offres, les présents n'y gagnent rien.

## 3. Analyse par concurrent

### FixMyStreet — mySociety
**Forces.** Socle open source éprouvé, standard Open311 natif, réputation
d'indépendance, absence de coût de licence.
**Faiblesses.** L'exploitation reste à construire : sans équipe technique
interne, une collectivité obtient une boîte de réception géolocalisée. La
qualification et le routage restent humains.
**Riposte.** Ne pas opposer le prix au gratuit. Opposer le coût complet :
un socle gratuit mal exploité coûte plus cher en temps d'agent qu'un
abonnement à un produit qui qualifie seul.

### SeeClickFix — CivicPlus
**Forces.** Profondeur d'exploitation réelle, automatisation des flux de
travail, intégration SIG et gestion de travaux, références nombreuses.
**Faiblesses.** Vente liée à la suite CivicPlus, tarification et implantation
pensées pour le marché nord-américain, faible réponse aux contraintes de
réseau et de terminaux des marchés visés.
**Riposte.** Le terrain d'affrontement n'est pas la fonctionnalité mais
l'adéquation au contexte : USSD, hors ligne, souveraineté des données,
présence locale.

### TellMyCity et l'offre francophone de proximité
**Forces.** Simplicité, coût d'entrée bas, déploiement rapide, proximité
commerciale, bonne adoption citoyenne.
**Faiblesses.** L'outil s'arrête au dépôt. Pas d'engagement de délai armé, pas
de priorisation, pas de standard d'échange.
**Riposte.** Cible la même porte d'entrée commerciale mais avec la chaîne
aval. Argument décisif auprès du DGS, pas du chargé de communication.

## 4. Enseignements pour la conception

Cinq conclusions ont été traduites directement dans le produit.

1. **La preuve prime sur la collecte.** D'où un journal d'audit immuable, une
   date de résolution distincte de la dernière modification, et une
   confirmation citoyenne de clôture.
2. **Le doublon est le premier ennemi de l'agent.** D'où la fusion des
   confirmations et leur usage comme signal de priorité plutôt que comme
   volume parasite.
3. **La couleur ne doit pas mentir.** Une carte recolorée chaque jour selon
   l'état des dossiers est illisible d'un jour sur l'autre : les marqueurs
   suivent la famille d'incident, l'état passe par le halo.
4. **Le réseau est une hypothèse, pas une garantie.** D'où la capture hors
   ligne, l'USSD, et le repli cartographique schématique lorsque le fond de
   plan est inaccessible.
5. **Tous les signalements n'ont pas vocation à être publics.** D'où
   l'exclusion structurelle du canal sécurité de la carte publique.

## 4 bis. Corrections issues de l'observation directe

L'examen du parcours mobile de FixMyStreet a conduit à trois révisions du
produit, sur des points où leur choix était meilleur que le nôtre.

| Leur pratique | Notre erreur initiale | Correction |
|---|---|---|
| Le lieu demandé en premier, par géolocalisation ou par saisie | La catégorie demandée en premier | Parcours inversé ; le rapprochement de doublons devient possible |
| Parcours explicité en quatre étapes avant l'engagement | Aucune annonce de l'effort demandé | Bloc « Comment ça se passe » sur l'accueil |
| Action de dépôt flottante et persistante sur mobile | Bouton d'en-tête seul, perdu au défilement | Barre d'action fixe en bas d'écran |

Observation générale : leur page d'accueil ne vend rien. Elle place un champ de
localisation, explique le parcours, affiche quelques chiffres et la liste des
derniers signalements. Le discours destiné aux collectivités et aux
développeurs occupe des blocs distincts, en bas de page. Cette hiérarchie est
la bonne, et nous ne l'avions pas.

## 5. Sources

- [SeeClickFix — 311 Request and Work Management Software](https://seeclickfix.com/)
- [CivicPlus SeeClickFix 311 CRM — profil éditeur, Software Advice](https://www.softwareadvice.com/crm/seeclickfix-profile/)
- [Citizen Reporting Platforms Guide — Mark-a-Spot](https://www.mark-a-spot.com/citizen-reporting-platforms)
- [TellMyCity — fiche de réutilisation, data.gouv.fr](https://www.data.gouv.fr/reuses/tellmycity)
- [BetterStreet — JVS-Mairistem](https://www.jvs-mairistem.fr/territoire/gerez-vos-interventions-et-votre-patrimoine-communal-avec-betterstreet-loutil-des/)
- [Open311 GeoReport v2 — spécification](https://wiki.open311.org/GeoReport_v2/)
- [NoiseCapture — Université Gustave Eiffel, documentation applicative](https://github.com/Universite-Gustave-Eiffel/NoiseCapture/wiki/4.-NoiseCapture-App)
- [Collaborative noise data collected from smartphones — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5648040/)
- [Evaluating the Accuracy of Android Applications in Monitoring Environmental Noise Levels](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12040400/)

Ce comparatif est à revoir à chaque évolution majeure des offres citées. Sa
valeur commerciale dépend de son actualité.
