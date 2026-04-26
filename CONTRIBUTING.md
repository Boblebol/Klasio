# Contribuer à Klasio

Merci de votre intérêt pour Klasio ! Ce guide couvre les conventions du projet.

## 💬 Avant de coder

- **Bug** : ouvrez une [issue](../../issues/new?template=bug_report.md) avec étapes de reproduction, navigateur et capture si possible.
- **Feature** : ouvrez une [issue](../../issues/new?template=feature_request.md) pour discuter avant d'envoyer une PR conséquente.
- **Petite correction** (typo, accessibilité, doc) : PR directe bienvenue.

## 🧑‍💻 Setup

Klasio est un site statique **sans build runtime** :

- `index.html` : landing publique GitHub Pages.
- `app.html` : application Klasio.
- `src/core.mjs` : noyau pur testé avec Vitest.

```bash
git clone https://github.com/Boblebol/Klasio.git
cd Klasio
npm install
npm run dev
```

Ouvrez <http://localhost:8080>.

## 🎨 Conventions de code

Le projet étant mono-fichier, on garde une **cohérence stricte** avec l'existant :

- **Indentation** : 2 espaces (voir `.editorconfig`).
- **JS** : vanilla, pas de framework. Fonctions courtes, état global dans `state` côté app.
- **CSS** : custom properties dans `:root`, classes utilitaires courtes.
- **Nommage** : camelCase pour le JS, kebab-case pour le CSS.
- **Pas de dépendances npm runtime** — l'application doit rester du HTML/CSS/JS servi en statique. Les dépendances npm sont réservées aux outils de développement et de test.
- **jsPDF** : vendorisé dans `vendor/jspdf/`, ne pas déplacer sans discussion.

## 🔒 Sécurité

- **Jamais** d'injection directe en HTML de données saisies par l'utilisateur — utiliser `textContent`, `.value` sur un `input`, ou une fonction d'échappement dédiée.
- Pas de requêtes réseau vers des tiers (hors police Google Fonts et ressources explicitement documentées).

## 🌐 i18n

Le projet est actuellement en français uniquement. Si vous voulez ouvrir à d'autres langues, discutons-en via issue — c'est prévu dans la roadmap (phase 2).

## 🧪 Tester manuellement avant une PR

Vérifications automatisées :

```bash
npm test
npm run lint
npm run format:check
npm run build:pages
npm run verify:pages
```

Checklist minimale :

- [ ] La landing (`/`) ouvre bien `app.html` et `privacy.html`.
- [ ] Les 4 étapes du wizard fonctionnent sans erreur console.
- [ ] `Partager` copie un lien, et ce lien recharge bien la répartition.
- [ ] Export PDF ouvre un fichier valide.
- [ ] Export TXT téléchargé et lisible.
- [ ] Export CSV téléchargé et lisible dans un tableur.
- [ ] Export mural s'ouvre dans un nouvel onglet, imprimable.
- [ ] Ajout / suppression de niveau custom OK.
- [ ] Pas de warning XSS lors d'une saisie contenant `<script>` ou `"`.

Le workflow GitHub Actions exécute les vérifications automatisées sur chaque pull request. Le déploiement GitHub Pages ne se fait que sur un push vers `main`, après réussite des vérifications.

## 📦 Commits

Le projet utilise un format inspiré de [Conventional Commits](https://www.conventionalcommits.org/fr) :

```
<type>(<scope>): <description courte>

<body optionnel>
```

Types courants : `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `test`.

Exemples :

```
feat(export): ajout de l'export mural imprimable
fix(render): corrige teacherRow non défini en étape 4
docs(readme): ajoute section vie privée
```

## 🚀 Pull Requests

- Une PR = un changement cohérent.
- Renseignez le template de PR (il est rempli automatiquement).
- Reliez l'issue concernée (`Closes #123`).
- Respectez le [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

Merci !
