# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Ajouté (Phase 1 — en cours)

- **Mode sombre** avec trois modes : clair / sombre / automatique (suit la préférence système). Toggle dans le header, choix persisté dans `localStorage`.
- **Annuler / Rétablir** via les boutons du header et les raccourcis `Ctrl+Z` / `Ctrl+Y` (et `Cmd+Z` / `Cmd+Shift+Z` sur macOS). Historique de 20 états avec coalescence des modifications rapprochées (<800 ms) pour éviter le spam de snapshots lors de la saisie clavier.
- **Nom personnalisé par classe** (ex. « Classe de la baleine », « Salle 12 »). Le nom auto « CP + CE1 » reste en placeholder et en sous-titre de la carte.
- **Sauvegarde / ouverture de fichier `.klasio`** (JSON) : boutons _Sauver_ et _Ouvrir_ dans la barre du bas de l'étape 4. Le fichier est validé par le schéma avant import.
- **Onboarding de première visite** : 3 écrans présentant l'outil, le wizard et les raccourcis (vu une seule fois, bouton _Passer_ toujours disponible).
- **Import CSV des effectifs** à l'étape 1 : coller une liste `CP,24 / CE1,22 / …` (séparateurs virgule, point-virgule, tabulation ou pipe) ou charger un fichier `.csv`. Aperçu en temps réel des niveaux mis à jour / créés, avec remontée des lignes invalides.
- **Déplacer des élèves entre classes** : bouton → sur chaque ligne de niveau, modal listant les classes compatibles (même niveau ou niveau consécutif, places disponibles), avec sélecteur de quantité. Supprime automatiquement la ligne source si elle tombe à zéro, ou fusionne avec une ligne existante côté cible.
- **ESLint + Prettier** : configuration flat config (ESLint 9) sur `src/core.mjs`, `tests/` et les configs. Règles `eqeqeq`, `no-var`, `prefer-const`, `no-unused-vars` (en warning). Prettier sur tous les fichiers JS/MD/YAML/JSON (hors pages HTML autonomes et `vendor/`). Nouveaux scripts `npm run lint`, `lint:fix`, `format`, `format:check`, et nouveau job `lint` dans le CI GitHub Actions.
- **jsPDF hébergé localement** (`vendor/jspdf/jspdf.umd.min.js`, version 2.5.2) : plus aucune dépendance runtime sur un CDN. Fonctionnement 100 % hors ligne après le premier chargement, CSP renforcée (`script-src 'self' 'unsafe-inline'`, retrait de `cdnjs.cloudflare.com`), aucune requête sortie du navigateur du directeur pour exporter un PDF. Documentation de la procédure de mise à jour dans `vendor/jspdf/README.md`.
- **Commentaire libre par classe** (280 caractères max) : bouton « + Ajouter une note » qui déplie une zone de saisie sous chaque classe (ex. _« privilégier élèves calmes »_, _« séparer jumeaux Dupont »_). La note est reprise dans les exports **TXT** et **PDF** (en italique sous la classe), mais **pas dans le mural** — le mural étant destiné à l'affichage public.
- **Multi-scénarios A / B / C** : trois répartitions indépendantes que vous pouvez éditer et comparer côte à côte. Bouton _Scénario A_ dans le header → modal avec résumé de chaque scénario (élèves placés, classes, erreurs) et actions _Activer_ / _Copier vers_ / _Vider_. Noms éditables, undo/redo isolé par scénario. Migration transparente des données existantes vers le slot A.
- **Total filles/garçons par classe** : ligne compacte dépliable dans chaque carte de classe, badge d'équilibre (`Équilibré`, `À surveiller`, `Déséquilibré`, `À compléter`, `Total incohérent`), persistance dans les scénarios, partage URL et exports TXT/PDF.
- **Mode démo** : bouton _Charger un exemple_ à l'étape 1 pour ouvrir une école fictive complète avec effectifs, classes, enseignant·es, notes et totaux F/M.
- **Export CSV tableur** : bouton _CSV_ dans la barre d'exports de l'étape 4, avec une ligne par niveau de classe et des cellules échappées pour Excel/LibreOffice.
- **Page vie privée** : page statique `privacy.html` expliquant le stockage local, les fichiers `.klasio`, les liens de partage, les exports et les limites à connaître.
- **Landing GitHub Pages** : `index.html` devient une page publique complète, avec accès à l'application dans `app.html`, à la démo, à la page vie privée et au repository GitHub.
- **Vérification d'artefact Pages** : script `npm run verify:pages` pour contrôler que `dist/` contient les pages, modules et liens indispensables avant déploiement.
- **Accessibilité** : passe complète pour conforter la navigation clavier et les lecteurs d'écran.
  - Lien « Aller au contenu principal » (skip link) apparaissant au focus clavier.
  - Landmark `<main>` sur la zone centrale, nav étapes annoncée et `aria-current="step"` sur l'étape active.
  - Cartes stratégie : `role="radio"` dans un `role="radiogroup"`, activables avec Entrée et Espace.
  - Toast annoncé poliment (`role="status"` + `aria-live`), cartes d'étapes opérables au clavier.
  - Anneau de focus visible uniforme via `:focus-visible`, focus initial dans les modals, restauration du focus sur l'élément déclencheur à la fermeture.
  - Respect de `prefers-reduced-motion` : animations et transitions réduites à 0,01 ms.
- **Suite de tests unitaires** (Vitest) sur le noyau pur (`src/core.mjs`) : 67 tests couvrant `validateState`, `computeDistrib`, `consecOk`, `classPlafond`, `computeMoveTargets`, `summariseState`, `genderBalanceStatus`, `encodeState/decodeState`, `parseCsvEffectifs`, `applyCsvItems`, `createDemoState`, `buildClassesCsv`, `esc`. Exécutés en CI sur chaque push.
- **GitHub Pages via GitHub Actions** : workflow unique pour tests, lint, formatage, build statique (`dist/`) et déploiement automatique sur `main`.

### Corrigé

- **Barre du bas (sticky) en mobile étroit** : les boutons débordaient sur plusieurs lignes et cassaient la mise en page. Remplacé par un scroll horizontal au-dessus d'un bloc titre compact et non-ambigu.
- Suppression d'un doublon de styles `.teacher-row` / `.teacher-input` devenu obsolète après la refonte du bloc enseignant·e.

### Changé

- Bascule de la configuration de déploiement de Netlify vers GitHub Pages.
- Séparation de la landing publique (`index.html`) et de l'application (`app.html`) pour une présentation GitHub Pages plus lisible.
- **Début de décomposition du monolithe** : le code JavaScript devient un module ES (`<script type="module">`) qui importe ses fonctions pures depuis `src/core.mjs`. Les handlers inline restants sont exposés explicitement via `window.*`. Ouvre la voie au build Vite prévu en Phase 2.
- **Onboarding clarifié** : introduction recentrée sur la confidentialité, le parcours conseillé et la sauvegarde `.klasio`, avec une hiérarchie visuelle plus sobre.

### Sécurité

- **Échappement HTML systématique** de toutes les données saisies par l'utilisateur injectées dans les templates de rendu (labels de niveaux, nom de classe, libellés de boutons, attributs `title`, actions rapides). Un helper `esc()` centralisé remplace les concaténations directes.
- **Validation stricte du schéma** à la lecture (`localStorage` + paramètre URL `?s=…`). Un état corrompu ou manipulé est rejeté silencieusement plutôt que de casser l'application ou de permettre une injection.
- **Restriction des identifiants de niveau** à `/^[A-Za-z0-9_-]{1,20}$/` pour couper la surface d'injection via les handlers `onclick`.

### À venir

Voir [ROADMAP.md](./ROADMAP.md) pour les prochaines fonctionnalités planifiées.

## [0.1.0] — 2026-04-24

### Ajouté

- Première version publique de Klasio.
- Assistant en 4 étapes : effectifs → plafonds → stratégie → ajustement manuel.
- 4 stratégies de répartition automatique :
  - Classes équilibrées (par défaut).
  - Le moins de classes possible (doubles niveaux regroupés).
  - Un seul niveau par classe.
  - Classes les plus légères.
- Gestion des doubles niveaux avec validation des niveaux consécutifs.
- Alertes en temps réel : dépassement de plafond, élèves non placés, niveaux incompatibles.
- Actions rapides par classe : remplir au max, équilibrer, vider, ajouter un niveau disponible.
- Tri des classes (ordre de création / par niveau).
- Champ enseignant·e par classe.
- Partage de la répartition par lien URL (encodage base64url dans `?s=...`).
- Export PDF via jsPDF.
- Export TXT.
- Export **affichage mural** imprimable (HTML coloré par niveau).
- Persistance locale via `localStorage`.
- Gestion libre de niveaux personnalisés (PS, MS, GS, 6e…).
- UI responsive optimisée mobile.

### Corrigé

- Bug `teacherRow` non défini qui empêchait le rendu de l'étape 4 dans certains cas.
- Bug `exportMural()` : le bouton de la barre collante appelait une fonction inexistante.

### Sécurité

- Les valeurs du champ « enseignant·e » sont maintenant peuplées via le DOM plutôt qu'injectées en HTML pour éviter tout risque XSS.
- L'export mural utilise un `Blob` + `URL.createObjectURL` au lieu d'APIs d'écriture directes dans le document.

[Unreleased]: https://github.com/Boblebol/Klasio/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Boblebol/Klasio/releases/tag/v0.1.0
