# Klasio

> Outil web gratuit pour aider les directeurs et directrices d'école à **répartir leurs élèves dans les classes** — y compris les classes à double niveau typiques des écoles primaires françaises.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)]()
[![No dependencies](https://img.shields.io/badge/build-static%20HTML-informational)]()

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
- **Exports** : PDF, TXT, affichage mural imprimable.
- **Plafonds personnalisables** (24 pour CP/CE1 par défaut, conformément à la réglementation française 2024).
- **Ajout de niveaux libres** (maternelle GS/MS/PS, collège 6e…).

## 🚀 Démarrage rapide

Klasio est un fichier HTML statique. Il suffit de l'ouvrir dans un navigateur moderne.

### En local

```bash
git clone https://github.com/<votre-compte>/klasio.git
cd klasio
# Ouvrir directement le fichier
open index.html        # macOS
# ou
xdg-open index.html    # Linux
# ou
start index.html       # Windows
```

### Via un petit serveur local (recommandé)

```bash
# Python 3
python3 -m http.server 8080
# Node
npx serve .
```

Puis rendez-vous sur <http://localhost:8080>.

### En ligne (GitHub Pages)

Le workflow `.github/workflows/deploy.yml` déploie automatiquement le contenu sur GitHub Pages à chaque push sur `main`. Une fois activé dans **Settings → Pages → Source: GitHub Actions**, l'app sera disponible sur `https://<votre-compte>.github.io/klasio/`.

## 🧭 Utilisation

1. **Étape 1 — Effectifs** : saisissez le nombre d'élèves inscrits par niveau (vous pouvez ajouter PS, MS, GS, 6e, etc.).
2. **Étape 2 — Taille des classes** : définissez le plafond d'élèves par niveau et le nombre total de classes disponibles.
3. **Étape 3 — Répartition** : choisissez une stratégie automatique (aperçu avant application).
4. **Étape 4 — Mes classes** : ajustez manuellement, ajoutez des enseignants, exportez (PDF / TXT / mural).

À tout moment, utilisez **Partager** pour copier un lien qui encode toute votre répartition — pratique pour collaborer avec l'équipe pédagogique.

## 🛠️ Stack technique

- HTML / CSS / JavaScript vanilla — **aucune dépendance de build**.
- [jsPDF](https://github.com/parallax/jsPDF) (chargé via CDN) pour l'export PDF.
- Police [Inter](https://rsms.me/inter/) via Google Fonts.
- Persistance locale via `localStorage`.
- Partage via encodage Base64URL dans l'URL (`?s=...`).

## 📁 Structure du projet

```
klasio/
├── index.html              # L'application complète (HTML + CSS + JS)
├── README.md               # Ce fichier
├── ROADMAP.md              # Feuille de route produit
├── CHANGELOG.md            # Historique des versions
├── CONTRIBUTING.md         # Guide de contribution
├── LICENSE                 # MIT
├── .editorconfig
├── .gitignore
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        └── deploy.yml       # Déploiement GitHub Pages
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
