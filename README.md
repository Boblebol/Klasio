# Klasio

> Outil web gratuit pour aider les directeurs et directrices d'école à **répartir leurs élèves dans les classes** — y compris les classes à double niveau typiques des écoles primaires françaises.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-online-success)](https://boblebol.github.io/Klasio/)
![Status: alpha](https://img.shields.io/badge/status-alpha-orange.svg)
![Runtime: static HTML](https://img.shields.io/badge/runtime-static%20HTML-informational)
[![CI](https://github.com/Boblebol/Klasio/actions/workflows/check.yml/badge.svg)](https://github.com/Boblebol/Klasio/actions/workflows/check.yml)
![Tests: 67 unitaires](https://img.shields.io/badge/tests-67%20unitaires-success)

Klasio est une application **100 % côté client** servie depuis `app.html`, avec une landing publique en `index.html`. Aucune donnée ne quitte le navigateur : tout est stocké localement (`localStorage`). Aucun compte, aucun backend, aucun tracker.

---

## ✨ Fonctionnalités

- **Assistant en 4 étapes** — effectifs par niveau → plafonds par classe → stratégie de répartition → ajustement manuel.
- **Mode démo** — charge une école fictive complète pour tester l'outil sans saisie préalable.
- **Répartition automatique** avec 4 stratégies :
  - ⚖️ **Classes équilibrées** (recommandé)
  - 🔀 **Le moins de classes possible** (regroupements à double niveau)
  - 📋 **Un seul niveau par classe**
  - 🌱 **Classes les plus légères**
- **Gestion des doubles niveaux** avec validation automatique des niveaux consécutifs (CP+CE1 ✓, CP+CE2 ✗).
- **Alertes temps réel** : dépassement de plafond, élèves non placés, niveaux incompatibles.
- **Actions rapides** par classe : remplir au max, équilibrer, vider…
- **Tri des classes** (ordre de création / par niveau).
- **Nom d'enseignant·e** par classe.
- **Partage par lien URL** (l'état est encodé dans l'URL).
- **Exports / imports** : PDF, TXT, CSV tableur, affichage mural imprimable, **fichier `.klasio`** (JSON) réimportable, **import CSV** des effectifs à l'étape 1.
- **Plafonds personnalisables** (24 pour CP/CE1 par défaut, conformément à la réglementation française 2024).
- **Ajout de niveaux libres** (maternelle GS/MS/PS, collège 6e…).
- **Mode sombre** + **Annuler/Rétablir** (`Ctrl+Z` / `Ctrl+Y`).

## 🚀 Démarrage rapide

Klasio est une application HTML statique. Il suffit de l'ouvrir dans un navigateur moderne.

### En local

```bash
git clone https://github.com/Boblebol/Klasio.git
cd Klasio
open app.html          # macOS : ouvre directement l'application
# ou
open index.html        # landing publique
```

### Via un petit serveur local (recommandé)

```bash
python3 -m http.server 8080
# ou
npx serve .
```

Puis rendez-vous sur <http://localhost:8080>.

### En ligne (GitHub Pages)

La version publique est déployée automatiquement par GitHub Actions :

<https://boblebol.github.io/Klasio/>

L'application est accessible depuis la landing, ou directement via :

<https://boblebol.github.io/Klasio/app.html>

Le workflow `.github/workflows/check.yml` exécute les tests, le lint, le formatage, le build Pages et une vérification d'artefact (`npm run verify:pages`). Sur un push vers `main`, ce dossier est publié sur GitHub Pages.

Pour un fork, activez **Settings → Pages → Source: GitHub Actions**, puis poussez sur `main`.
Voir aussi [`docs/PUBLICATION.md`](./docs/PUBLICATION.md) pour la checklist de publication et les réglages GitHub du repository.

```bash
npm run build:pages
npm run verify:pages
```

Le dossier `dist/` contient uniquement les fichiers nécessaires au site public (`index.html`, `app.html`, `privacy.html`, `src/`, `vendor/`, `.nojekyll`).

## 🧭 Utilisation

1. **Étape 1 — Effectifs** : saisissez le nombre d'élèves inscrits par niveau (vous pouvez ajouter PS, MS, GS, 6e, etc.).
2. **Étape 2 — Taille des classes** : définissez le plafond d'élèves par niveau et le nombre total de classes disponibles.
3. **Étape 3 — Répartition** : choisissez une stratégie automatique (aperçu avant application).
4. **Étape 4 — Mes classes** : ajustez manuellement, ajoutez des enseignants, exportez (PDF / TXT / mural).

À tout moment, utilisez **Partager** pour copier un lien qui encode toute votre répartition — pratique pour collaborer avec l'équipe pédagogique.

## 🛠️ Stack technique

- HTML / CSS / JavaScript vanilla — **aucune dépendance runtime externe**, aucun bundler nécessaire pour servir le site.
- `<script type="module">` avec imports ES6 vers `src/core.mjs` (fonctions pures testables).
- [jsPDF](https://github.com/parallax/jsPDF) 2.5.2 **hébergé localement** dans `vendor/jspdf/` pour l'export PDF (offline, vie privée, CSP stricte).
- Police [Inter](https://rsms.me/inter/) via Google Fonts (seule ressource externe restante).
- Persistance locale via `localStorage`, partage via encodage Base64URL dans l'URL.
- Page [`privacy.html`](./privacy.html) statique pour documenter clairement les garanties et limites de vie privée.
- [Vitest](https://vitest.dev) en dépendance **dev uniquement** pour les tests unitaires.

## 🧪 Tests

Le noyau de logique (validation, répartition, parsing CSV, export CSV, démo, échappement HTML, encode/decode URL) vit dans `src/core.mjs` et est couvert par une suite de tests Vitest.

```bash
npm install      # installe les outils de dev
npm test         # exécution unique (CI)
npm run test:watch
```

## 🧹 Lint & format

ESLint (flat config) et Prettier sont configurés sur le noyau JS (`src/`), les tests (`tests/`) et les configs. Les pages HTML autonomes (`index.html`, `app.html`) sont volontairement exclues — l'app sera splittée dans une itération future avec Vite.

```bash
npm run lint           # ESLint (0 warning attendu)
npm run lint:fix       # autofix
npm run format         # reformatte avec Prettier
npm run format:check   # vérifie sans écrire (CI)
npm run build:pages    # prépare l'artefact GitHub Pages dans dist/
npm run verify:pages   # vérifie les fichiers et liens clés de dist/
```

Ces commandes tournent aussi dans le CI GitHub Actions.

## 📁 Structure du projet

```
klasio/
├── index.html              # Landing publique GitHub Pages
├── app.html                # Application Klasio (HTML + CSS + JS inline)
├── privacy.html            # Page vie privée statique
├── src/
│   └── core.mjs            # Noyau pur (validation, répartition, parsing CSV…)
├── vendor/
│   └── jspdf/              # jsPDF 2.5.2 vendorisé (UMD + LICENSE)
├── tests/
│   └── core.test.mjs       # 67 tests Vitest
├── scripts/
│   ├── build-pages.mjs     # Prépare dist/ pour GitHub Pages
│   └── verify-pages-build.mjs # Vérifie l'artefact Pages
├── docs/
│   └── PUBLICATION.md      # Checklist publication/open-source
├── package.json            # scripts + devDependencies de test/lint
├── vitest.config.mjs
├── README.md               # Ce fichier
├── ROADMAP.md              # Feuille de route produit
├── CHANGELOG.md            # Historique des versions
├── CONTRIBUTING.md         # Guide de contribution
├── SUPPORT.md              # Aide, issues et sécurité
├── LICENSE                 # MIT
├── .editorconfig
├── .gitignore
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        └── check.yml        # Tests, lint/format, build + déploiement Pages
```

## 🤝 Contribuer

Les contributions sont les bienvenues. Consultez [`CONTRIBUTING.md`](./CONTRIBUTING.md) pour les conventions du projet et [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) pour les règles de participation.

## 🔒 Vie privée

- Aucune donnée n'est envoyée à un serveur. Tout reste dans votre navigateur.
- Le lien de partage encode les données dans l'URL elle-même — seules les personnes à qui vous envoyez le lien y ont accès.
- Pas de cookies de tracking, pas d'analytics.
- Détails et limites : [`privacy.html`](./privacy.html).

## 📜 Licence

[MIT](./LICENSE) — faites-en ce que vous voulez, avec mention.

---

**Klasio** — conçu avec ❤️ pour les équipes pédagogiques qui passent leurs mois de juin à faire tourner des tableurs.
