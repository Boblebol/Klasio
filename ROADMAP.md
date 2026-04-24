# Roadmap Klasio

> Feuille de route produit pour faire grandir Klasio d'un outil personnel v0.1 vers une vraie solution utilisable par les écoles françaises (et au-delà).

**Légende**
- 🎯 = priorité forte (impact utilisateur élevé, effort raisonnable)
- 🧱 = dette technique / fondations
- 🌟 = nice-to-have / long terme

---

## Phase 1 — Consolidation (v0.2)
*Objectif : rendre la v0.1 fiable, testable et agréable au quotidien. 1–3 semaines.*

### Produit
- 🎯 **Annuler / refaire** (Ctrl+Z / Ctrl+Y) sur toutes les actions destructrices (suppression de classe, vider, appliquer une stratégie). Historique des 20 derniers états.
- 🎯 **Nom personnalisé par classe** (en plus du nom auto « CP + CE1 ») — ex. « Classe de la baleine », « Salle 12 ».
- 🎯 **Déplacer des élèves entre classes** (bouton ± dans une classe qui transfère vers la classe ayant encore de la place, ou drag-and-drop).
- 🎯 **Multi-profils** — garder plusieurs répartitions (ex. scénarios A / B / C) côte à côte, switch rapide.
- **Dupliquer une répartition** (pour tester une variante).
- **Commentaire par classe** (notes libres : « privilégier élèves calmes », « jumeaux à séparer »…).
- **Total par genre F/M** optionnel, avec badge d'équilibre (si l'école entre cette donnée).
- **Indicateur de charge** par enseignant·e (utile si une maîtresse a 2 demi-classes à cheval).

### UX / UI
- 🎯 **Mode sombre** (la charte CSS est déjà variabilisée — c'est quelques heures).
- 🎯 **Capture d'écran / bandeau d'illustration** dans le README (actuellement placeholder).
- 🎯 **Onboarding première visite** : petit tutoriel overlay 3 écrans.
- 🎯 **Accessibilité** : audit complet (focus visibles, ARIA labels, navigation clavier de A à Z, contrastes AA).
- 🎯 **Mobile** : la sticky bar du bas empile mal sur très petit écran — repasser dessus.
- **Animations plus douces** lors du changement d'étape.
- **Localisation des messages d'erreur** (messages plus pédagogiques pour les non-tech).

### Technique
- 🧱 **Split du monolithe `index.html`** en fichiers séparés :
  ```
  src/
    index.html
    styles/main.css
    js/state.js      # état + persistance
    js/strategies.js # algos de répartition
    js/render.js     # rendu DOM
    js/exports.js    # PDF, TXT, mural
    js/share.js      # encodage URL
  ```
  Build minimal : concaténation avec [esbuild](https://esbuild.github.io/) ou [Vite](https://vitejs.dev/), mais **garder la possibilité** de servir le fichier unique en prod (one-file-build).
- 🧱 **Tests** : ajouter [Vitest](https://vitest.dev/) + quelques tests unitaires sur `computeDistrib`, `consecOk`, `classPlafond`, `encodeState/decodeState`.
- 🧱 **Tests end-to-end** avec [Playwright](https://playwright.dev/) — scénarios nominaux (4 étapes, partage, exports).
- 🧱 **Linting** : [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/).
- 🧱 **Helper d'échappement HTML centralisé** — remplacer les concaténations de templates par un helper `html\`...\`` type [tagged template](https://github.com/AntonioVdlC/html-template-tag) ou migrer vers [lit-html](https://lit.dev/docs/libraries/standalone-templates/).
- 🧱 **Validation des états importés par URL** : actuellement un `JSON.parse` permissif — ajouter un schéma (Zod ou validation manuelle).
- 🧱 **Héberger jsPDF localement** plutôt que CDN (résilience offline, vie privée).

---

## Phase 2 — Étendre la cible (v0.3–0.4)
*Objectif : passer d'un outil pour directeur d'école primaire à une solution plus large. 1–2 mois.*

### Produit
- 🎯 **Import CSV** — coller/uploader une liste d'élèves (prénom, nom, niveau) et Klasio remplit les champs automatiquement. Bonus : chaque élève devient nommable et déplaçable individuellement.
- 🎯 **Gestion nominative des élèves** (mode avancé) — au lieu de « 12 CP », liste de 12 prénoms. Permet :
  - règles « X et Y dans la même classe » / « A et B à séparer »
  - équilibre F/M précis
  - équilibre par profil (PPRE, allophones, etc. — tags libres)
- 🎯 **Algorithme de répartition plus fin** basé sur des contraintes :
  - contraintes dures (plafond, niveaux consécutifs, pairs/séparations)
  - contraintes souples (équilibre F/M, âge moyen, langues)
  - résolution par heuristique ou solveur SAT léger (ex. [logic-solver](https://www.npmjs.com/package/logic-solver))
- **Modèle collège/lycée** — options pour multi-niveaux non consécutifs, LV1/LV2, options.
- **Gestion du périscolaire** (cantine midi, garderie) — affectations dérivées.
- **Export XLSX** (tableau par classe avec élèves en colonnes).
- **Export vers ONDE / Pronote** (étude de faisabilité — probablement par CSV compatible).

### Comms / site
- 🎯 **Landing page** simple (fr) avec démo live, captures, témoignages.
- 🎯 **Domaine dédié** (ex. `klasio.fr` ou `klasio.app`).
- 🎯 **Page « Vie privée »** détaillée (RGPD).
- **Article de blog** : « Pourquoi Klasio (et pas un tableur) ».

### i18n
- 🌟 Architecture i18n (fichiers JSON par langue, sélecteur dans le header).
- 🌟 Traductions EN, ES pour commencer.

---

## Phase 3 — Collaboration (v0.5–0.6)
*Objectif : plusieurs personnes peuvent travailler sur la même répartition. 2–3 mois.*

> ⚠️ **Décision produit importante** à prendre : on garde du 100 % local + lien partagé (simple, privé, gratuit à héberger), OU on ajoute un backend (plus puissant mais implique RGPD pro, hébergement, coûts) ?

### Piste A — Sans serveur (recommandée au début)
- 🎯 **Partage collaboratif via CRDT** ([Yjs](https://yjs.dev/) + [y-webrtc](https://github.com/yjs/y-webrtc)) : plusieurs navigateurs sur la même URL, édition simultanée, aucun serveur.
- **Export/import fichier `.klasio`** (JSON signé) pour envoyer par email.
- **Historique des versions** (snapshots localStorage + export).

### Piste B — Avec backend (si la traction l'exige)
- Backend Node/Fastify + PostgreSQL, ou Supabase.
- Auth magic link (pas de mot de passe à créer).
- Espace **équipe pédagogique** : invitations, rôles (admin / lecture).
- **Commentaires et validations** sur chaque classe.
- **Historique des versions** serveur avec restauration.

### Auth (si piste B)
- Magic link email (SMTP).
- OAuth Google / Microsoft (familier du secteur éducation).
- 2FA optionnelle.

---

## Phase 4 — Outils métier avancés (v1.0)
*Objectif : devenir LA référence française pour la composition des classes. 3–6 mois.*

- **Simulateur multi-année** : projeter 3 ans d'effectifs (montée de niveau).
- **Suggestions IA** (optionnelles, en local avec un petit modèle ou via API) : propose des regroupements en fonction de données historiques anonymes.
- **Tableau de bord directeur** : total école, ratio encadrement, comparaison à N-1.
- **Mode inspection** : export d'un rapport officiel avec en-tête Éducation nationale, cachet.
- **Gestion des AESH / PIAL** : indiquer les élèves avec accompagnement et éviter de les isoler.
- **Intégration emploi du temps** (Brique : décloisonnement — « les CM1 vont en sport chez M. X le mardi »).

---

## Phase 5 — Pérennité et modèle économique 🌟

Le projet est actuellement MIT et gratuit. Si la base utilisateurs grossit, plusieurs pistes (non exclusives) :

- **Modèle open-source + dons** (GitHub Sponsors, Liberapay, HelloAsso).
- **Freemium hébergé** : fonctions collaboratives / multi-école payantes, l'outil mono-poste reste 100 % gratuit.
- **Conventions mairies / académies** : accompagnement, formation.
- **Marque blanche** pour les éditeurs de logiciels scolaires.

Quelle que soit la piste, **le fichier `index.html` standalone doit rester gratuit et open-source**, c'est l'ADN du projet.

---

## Dette technique identifiée (à traiter en continu)

| Item | Où | Sévérité |
|---|---|---|
| Échappement HTML systématique des labels saisis par l'utilisateur dans les templates | `render()` | 🔴 Haute |
| Pas de validation du JSON importé par URL | `decodeState()` | 🟠 Moyenne |
| `renderExcept` ne restaure pas le focus (code mort, commentaire reconnaît le problème) | `render()` | 🟡 Basse |
| Dépendance CDN jsPDF (pas d'offline) | `<head>` | 🟡 Basse |
| Aucun test automatisé | — | 🟠 Moyenne |
| 1229 lignes dans un seul fichier | `index.html` | 🟠 Moyenne |
| Pas de CSP header | `<head>` (meta) | 🟡 Basse |
| `load()` fait un `state=p` sans merger — plante si le schéma évolue | `load()` | 🟠 Moyenne |

---

## Décisions produit à prendre rapidement

1. **Public cible principal ?** Directeurs d'école primaire, de maternelle, collèges, ou tout le K–12 ? → Influence la priorité de la phase 2.
2. **Serveur ou pas ?** → Influence la phase 3.
3. **Monétisation ?** → Influence la structuration juridique (asso ? SAS ?).
4. **Ouverture à la contribution externe ?** → Si oui, il faut vite la phase 1 (tests, lint, doc) pour accueillir sereinement.
5. **Nom de domaine / marque** — vérifier la disponibilité juridique de « Klasio » (INPI, whois).

---

## Suivi

Les issues GitHub sont organisées par **label de phase** (`phase:1`, `phase:2`, …) et par **type** (`type:feat`, `type:fix`, `type:tech`, `type:docs`). Un `project` GitHub est recommandé pour suivre le statut (`Backlog → In progress → Done`).
