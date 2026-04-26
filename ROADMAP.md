# Roadmap Klasio

> Feuille de route produit pour faire grandir Klasio d'un outil personnel v0.1 vers une vraie solution utilisable par les écoles françaises (et au-delà).

**Légende**

- 🎯 = priorité forte (impact utilisateur élevé, effort raisonnable)
- 🧱 = dette technique / fondations
- 🌟 = nice-to-have / long terme

---

## Phase 1 — Consolidation (v0.2)

_Objectif : rendre la v0.1 fiable, testable et agréable au quotidien. 1–3 semaines._

### Produit

- ✅ **Annuler / refaire** (Ctrl+Z / Ctrl+Y) avec coalescence des modifications rapprochées.
- ✅ **Nom personnalisé par classe** (en plus du nom auto « CP + CE1 »).
- ✅ **Import CSV des effectifs** — coller `CP,24 / CE1,22 / …` à l'étape 1 pour pré-remplir.
- ✅ **Sauvegarde/ouverture de fichiers `.klasio`** (JSON) à l'étape 4.
- ✅ **Déplacer des élèves entre classes** — bouton → sur chaque ligne, modal avec classes cibles compatibles et quantité paramétrable.
- ✅ **Multi-scénarios A/B/C** — trois slots indépendants avec noms éditables, modal de comparaison (élèves placés, classes, erreurs), undo/redo isolé par scénario.
- ✅ **Dupliquer une répartition** (pour tester une variante) via l'action « Copier vers… » des brouillons A/B/C.
- ✅ **Commentaire par classe** — note libre (280 caractères) dépliable sous chaque classe, reprise dans les exports TXT et PDF (mais pas dans le mural public).
- ✅ **Total par genre F/M** optionnel, avec badge d'équilibre (si l'école entre cette donnée).
- ✅ **Mode démo** — charge une école fictive complète pour tester l'outil sans saisie.
- ✅ **Export CSV tableur** — une ligne par niveau de classe, compatible Excel/LibreOffice.
- **Indicateur de charge** par enseignant·e (utile si une maîtresse a 2 demi-classes à cheval).

### UX / UI

- ✅ **Mode sombre** (clair / sombre / auto, persisté).
- ✅ **Onboarding première visite** (3 écrans).
- ✅ **Mobile** : sticky bar revue pour les écrans étroits.
- 🎯 **Capture d'écran / bandeau d'illustration** dans le README (actuellement placeholder).
- ✅ **Accessibilité** : skip link, landmarks, navigation clavier sur les étapes et les cartes stratégie (role=radio), toast `aria-live`, focus restoration sur les modals, `prefers-reduced-motion`.
- **Animations plus douces** lors du changement d'étape.
- **Localisation des messages d'erreur** (messages plus pédagogiques pour les non-tech).

### Technique

- ✅ **Tests Vitest** sur `validateState`, `computeDistrib`, `consecOk`, `classPlafond`, `genderBalanceStatus`, `encodeState/decodeState`, `parseCsvEffectifs` (64 tests).
- ✅ **Validation stricte des états importés** (localStorage + URL + fichier `.klasio`).
- ✅ **Échappement HTML centralisé** via `esc()` sur toutes les données utilisateur.
- ✅ **Début de split du monolithe** : les fonctions pures sont dans `src/core.mjs`, `index.html` est un `<script type="module">` qui les importe.
- 🧱 **Terminer le split du monolithe** en fichiers séparés :
  ```
  src/
    index.html
    styles/main.css
    js/state.js      # état + persistance
    js/render.js     # rendu DOM
    js/exports.js    # PDF, TXT, mural
    js/share.js      # encodage URL
  ```
  Build minimal : concaténation avec [esbuild](https://esbuild.github.io/) ou [Vite](https://vitejs.dev/), mais **garder la possibilité** de servir le fichier unique en prod (one-file-build).
- ✅ **Linting** : ESLint 9 (flat config) + Prettier, intégrés au CI.
- ✅ **GitHub Pages via Actions** : tests, lint, format, build statique et déploiement automatique sur `main`.
- ✅ **jsPDF hébergé localement** (`vendor/jspdf/`) — plus de CDN runtime, CSP durcie, offline complet.

---

## Phase 2 — Étendre la cible (v0.3–0.4)

_Objectif : passer d'un outil pour directeur d'école primaire à une solution plus large. 1–2 mois._

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
- ✅ **Page « Vie privée »** détaillée sur le fonctionnement local, les liens de partage et les exports.
- **Article de blog** : « Pourquoi Klasio (et pas un tableur) ».

### i18n

- 🌟 Architecture i18n (fichiers JSON par langue, sélecteur dans le header).
- 🌟 Traductions EN, ES pour commencer.

---

## Phase 3 — Collaboration (v0.5–0.6)

_Objectif : plusieurs personnes peuvent travailler sur la même répartition. 2–3 mois._

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

_Objectif : devenir LA référence française pour la composition des classes. 3–6 mois._

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

| Item                                                                                   | Où              | Sévérité   |
| -------------------------------------------------------------------------------------- | --------------- | ---------- |
| Échappement HTML systématique des labels saisis par l'utilisateur dans les templates   | `render()`      | 🔴 Haute   |
| Pas de validation du JSON importé par URL                                              | `decodeState()` | 🟠 Moyenne |
| `renderExcept` ne restaure pas le focus (code mort, commentaire reconnaît le problème) | `render()`      | 🟡 Basse   |
| ~~Dépendance CDN jsPDF (pas d'offline)~~ — vendorisé dans `vendor/jspdf/`              | `<head>`        | ✅ Réglé   |
| Aucun test automatisé                                                                  | —               | 🟠 Moyenne |
| 1229 lignes dans un seul fichier                                                       | `index.html`    | 🟠 Moyenne |
| Pas de CSP header                                                                      | `<head>` (meta) | 🟡 Basse   |
| `load()` fait un `state=p` sans merger — plante si le schéma évolue                    | `load()`        | 🟠 Moyenne |

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
