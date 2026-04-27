# Releasing

Klasio suit Semantic Versioning et tient son historique dans `CHANGELOG.md`.

## Avant une release

1. Vérifier que `CHANGELOG.md` contient les changements dans `[Unreleased]`.
2. Lancer la suite complète :

   ```bash
   npm ci
   npm run check
   npm audit --audit-level=moderate
   ```

3. Tester manuellement la landing, la démo, le partage URL et les exports PDF,
   TXT, CSV et mural.
4. Vérifier que `docs/PUBLICATION.md` reflète encore les réglages GitHub.

## Publier une version

1. Créer une section versionnée dans `CHANGELOG.md`.
2. Mettre à jour la version dans `package.json` si la release change la version
   du projet.
3. Committer :

   ```bash
   git add CHANGELOG.md package.json package-lock.json
   git commit -m "chore: release vX.Y.Z"
   ```

4. Taguer :

   ```bash
   git tag -a vX.Y.Z -m "Klasio vX.Y.Z"
   git push origin main
   git push origin vX.Y.Z
   ```

5. Créer la release GitHub depuis le tag `vX.Y.Z` avec les notes du changelog.
6. Vérifier que le workflow `CI` déploie GitHub Pages et que
   <https://boblebol.github.io/Klasio/> répond en HTTP 200.

## Après publication

- Vérifier les alertes Dependabot.
- Fermer ou mettre à jour les PR Dependabot devenues obsolètes.
- Créer les issues de suivi si une dette connue est volontairement reportée.
