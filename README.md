# Klasio

> Outil web gratuit pour aider les directeurs et directrices d'école à **répartir leurs élèves dans les classes** — y compris les classes à double niveau typiques des écoles primaires françaises.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)]()
[![No dependencies](https://img.shields.io/badge/build-static%20HTML-informational)]()
[![CI](https://github.com/Boblebol/Klasio/actions/workflows/check.yml/badge.svg)](https://github.com/Boblebol/Klasio/actions/workflows/check.yml)
[![Tests](https://img.shields.io/badge/tests-58%20passing-success)]()

Klasio est une application **100 % côté client** (un seul fichier `index.html`). Aucune donnée ne quitte le navigateur : tout est stocké localement (`localStorage`). Aucun compte, aucun backend, aucun tracker.

---

## ✨ Fonctionnalités

- **Assistant en 4 étapes** — effectifs par niveau → plafonds par classe → stratégie de répartition → ajustement manuel.
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
- **Exports / imports** : PDF, TXT, affichage mural imprimable, **fichier `.klasio`** (JSON) réimportable, **import CSV** des effectifs à l'étape 1.
- **Plafonds personnalisables** (24 pour CP/CE1 par défaut, conformément à la réglementation française 2024).
- **Ajout de niveaux libres** (maternelle GS/MS/PS, collège 6e…).
- **Mode sombre** + **Annuler/Rétablir** (`Ctrl+Z` / `Ctrl+Y`).

## 🚀 Démarrage rapide

Klasio est un fichier HTML statique. Il suffit de l'ouvrir dans un navigateur moderne.

### En local

```bash
git clone https://github.com/Boblebol/Klasio.git
cd Klasio
open index.html        # macOS
```

### Via un petit serveur local (recommandé)

```bash
python3 -m http.server 8080
# ou
npx serve .
```

Puis rendez-vous sur <http://localhost:8080>.

### En ligne (Netlify)

Le projet est configuré pour un déploiement **Netlify zéro-config** (`netlify.toml` à la racine). Deux options :

**Option A — via l'interface Netlify** (la plus simple) :
1. Se connecter sur [app.netlify.com](https://app.netlify.com/).
2. **Add new site → Import an existing project → GitHub**.
3. Sélectionner le dépôt `Boblebol/Klasio` (Netlify a besoin d'un accès aux repos privés, à autoriser dans les paramètres GitHub).
4. Laisser les réglages par défaut (le `netlify.toml` s'en charge). Cliquer **Deploy**.
5. Le site est en ligne sur une URL `*.netlify.app`, déployé automatiquement à chaque push sur `main`.

**Option B — via la CLI Netlify** :
```bash
npm install -g netlify-cli
netlify login
netlify init           # relie le repo au site Netlify
netlify deploy --prod  # déploie
```

Les en-têtes de sécurité (CSP, X-Frame-Options, Referrer-Policy…) sont déjà configurés dans `netlify.toml`.

## 🧭 Utilisation

1. **Étape 1 — Effectifs** : saisissez le nombre d'élèves inscrits par niveau (vous pouvez ajouter PS, MS, GS, 6e, etc.).
2. **Étape 2 — Taille des classes** : définissez le plafond d'élèves par niveau et le nombre total de classes disponibles.
3. **Étape 3 — Répartition** : choisissez une stratégie automatique (aperçu avant application).
4. **Étape 4 — Mes classes** : ajustez manuellement, ajoutez des enseignants, exportez (PDF / TXT / mural).

À tout moment, utilisez **Partager** pour copier un lien qui encode toute votre répartition — pratique pour collaborer avec l'équipe pédagogique.

## 🛠️ Stack technique

- HTML / CSS / JavaScript vanilla — **aucune dépendance runtime externe**, aucun bundler nécessaire pour servir l'app.
- `<script type="module">` avec imports ES6 vers `src/core.mjs` (fonctions pures testables).
- [jsPDF](https://github.com/parallax/jsPDF) 2.5.2 **hébergé localement** dans `vendor/jspdf/` pour l'export PDF (offline, vie privée, CSP stricte).
- Police [Inter](https://rsms.me/inter/) via Google Fonts (seule ressource externe restante).
- Persistance locale via `localStorage`, partage via encodage Base64URL dans l'URL.
- [Vitest](https://vitest.dev) en dépendance **dev uniquement** pour la suite de tests.

## 🧪 Tests

Le noyau de logique (validation, répartition, parsing CSV, échappement HTML, encode/decode URL) vit dans `src/core.mjs` et est couvert par une suite de tests Vitest.

```bash
npm install      # installe vitest en dev
npm test         # exécution unique (CI)
npm run test:watch
```

## 📁 Structure du projet

```
klasio/
├── index.html              # UI complète (HTML + CSS + JS inline)
├── src/
│   └── core.mjs            # Noyau pur (validation, répartition, parsing CSV…)
├── vendor/
│   └── jspdf/              # jsPDF 2.5.2 vendorisé (UMD + LICENSE)
├── tests/
│   └── core.test.mjs       # 58 tests Vitest
├── package.json            # scripts + devDependencies (vitest)
├── vitest.config.mjs
├── README.md               # Ce fichier
├── ROADMAP.md              # Feuille de route produit
├── CHANGELOG.md            # Historique des versions
├── CONTRIBUTING.md         # Guide de contribution
├── LICENSE                 # MIT
├── netlify.toml            # Config Netlify (headers, redirects)
├── .editorconfig
├── .gitignore
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        └── check.yml        # Tests + lint HTML en CI
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez [`CONTRIBUTING.md`](./CONTRIBUTING.md) pour les conventions du projet.

## 🔒 Vie privée

- Aucune donnée n'est envoyée à un serveur. Tout reste dans votre navigateur.
- Le lien de partage encode les données dans l'URL elle-même — seules les personnes à qui vous envoyez le lien y ont accès.
- Pas de cookies de tracking, pas d'analytics.

## 📜 Licence

[MIT](./LICENSE) — faites-en ce que vous voulez, avec mention.

---

**Klasio** — conçu avec ❤️ pour les équipes pédagogiques qui passent leurs mois de juin à faire tourner des tableurs.
