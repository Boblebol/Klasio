# Publication et ouverture du projet

Cette checklist garde les réglages publics de Klasio explicites, pour éviter qu'une
fonctionnalité GitHub soit documentée sans être réellement activée.

## État attendu du repository

- Repository GitHub public : `Boblebol/Klasio`.
- Licence : MIT (`LICENSE`).
- Page publique : <https://boblebol.github.io/Klasio/>.
- Homepage GitHub renseignée avec l'URL GitHub Pages.
- Topics GitHub : `education`, `school`, `classroom`, `static-site`,
  `vanilla-javascript`, `github-pages`, `french`.
- Issues activées avec templates bug/feature.
- Pull request template présent.
- `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`,
  `CHANGELOG.md` et `ROADMAP.md` présents.

## GitHub Pages

Klasio utilise GitHub Pages en mode **GitHub Actions**.

Réglage à vérifier dans GitHub :

1. Aller dans **Settings -> Pages**.
2. Mettre **Build and deployment / Source** sur **GitHub Actions**.
3. Pousser sur `main` ou relancer le workflow `CI`.
4. Vérifier que le job **Deploy GitHub Pages** passe.
5. Vérifier que <https://boblebol.github.io/Klasio/> répond en HTTP 200.

Le workflow `.github/workflows/check.yml` construit `dist/`, vérifie l'artefact
avec `npm run verify:pages`, l'upload avec `actions/upload-pages-artifact`, puis
déploie avec `actions/deploy-pages`.

## Vérification locale avant publication

```bash
npm ci
npm test
npm run lint
npm run format:check
npm run build:pages
npm run verify:pages
```

Pour tester le site localement :

```bash
npm run dev
```

Ouvrir ensuite <http://localhost:8080>.

## Points d'attention open-source

- `package.json` garde `"private": true` pour empêcher une publication npm
  accidentelle. Cela ne rend pas le repository GitHub privé.
- Les dépendances npm sont réservées au développement et aux tests.
- `vendor/jspdf/` contient jsPDF et sa licence pour éviter une dépendance CDN à
  l'exécution.
- Les données utilisateur restent côté navigateur ; voir `privacy.html` et
  `SECURITY.md` pour les limites à communiquer.
