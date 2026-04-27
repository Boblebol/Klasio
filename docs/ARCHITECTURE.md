# Architecture

Klasio est volontairement une application statique : le site peut être servi par
GitHub Pages, un simple serveur HTTP local ou une ouverture directe des fichiers
HTML.

## Surfaces publiques

- `index.html` : landing publique, liens vers l'application, la démo, la page
  vie privée et le repository GitHub.
- `app.html` : application complète, avec HTML/CSS/JavaScript inline historique.
- `privacy.html` : explication statique du stockage local, des exports et des
  limites de confidentialité.

## Noyau testable

Le noyau pur vit dans `src/core.mjs`. Il contient la logique sans effet de bord :

- validation d'état ;
- calcul de répartition ;
- compatibilité de niveaux ;
- parsing/import CSV ;
- export CSV ;
- encodage/décodage des liens de partage ;
- helpers de sécurité comme `esc()`.

Les tests Vitest sont dans `tests/core.test.mjs`. Toute logique métier nouvelle
doit aller dans `src/core.mjs` ou dans un module testable équivalent, puis être
couverte avant d'être câblée dans `app.html`.

## Données et confidentialité

Klasio ne possède pas de backend applicatif. Les données restent dans le
navigateur via `localStorage`, dans les fichiers `.klasio` exportés, ou dans les
URL de partage générées par l'utilisateur.

Règles non négociables :

- ne pas ajouter d'analytics ni de tracking ;
- ne pas envoyer la répartition vers un service tiers ;
- ne pas injecter de données utilisateur avec `innerHTML` sans échappement
  centralisé ;
- documenter toute nouvelle ressource réseau dans `README.md` et `privacy.html`.

## Build et déploiement

Il n'y a pas de build runtime pour utiliser l'application. Le build Pages copie
seulement les fichiers publics nécessaires dans `dist/` :

```bash
npm run build:pages
npm run verify:pages
```

Le workflow `.github/workflows/check.yml` exécute tests, lint, format, build,
vérification d'artefact, puis déploie GitHub Pages sur un push vers `main`.

## Dépendances

- Les dépendances npm sont des dépendances de développement uniquement.
- `vendor/jspdf/` contient le bundle UMD minifié de jsPDF et sa licence pour
  éviter un CDN runtime.
- `package.json` reste `private: true` pour empêcher une publication npm
  accidentelle.

## Direction technique

Le monolithe `app.html` est accepté pour la v0.1/v0.2, mais les nouvelles
fonctions pures doivent sortir progressivement vers `src/`. Le split complet du
HTML/CSS/JS est suivi dans `ROADMAP.md`.
