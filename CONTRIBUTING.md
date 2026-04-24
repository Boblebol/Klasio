# Contribuer à Klasio

Merci de votre intérêt pour Klasio ! Ce guide couvre les conventions du projet.

## 💬 Avant de coder

- **Bug** : ouvrez une [issue](../../issues/new?template=bug_report.md) avec étapes de reproduction, navigateur et capture si possible.
- **Feature** : ouvrez une [issue](../../issues/new?template=feature_request.md) pour discuter avant d'envoyer une PR conséquente.
- **Petite correction** (typo, accessibilité, doc) : PR directe bienvenue.

## 🧑‍💻 Setup

Klasio est un projet **sans build**. Tout se passe dans `index.html`.

```bash
git clone https://github.com/OWNER/klasio.git
cd klasio
python3 -m http.server 8080   # ou `npx serve .`
```

Ouvrez <http://localhost:8080>.

## 🎨 Conventions de code

Le projet étant mono-fichier, on garde une **cohérence stricte** avec l'existant :

- **Indentation** : 2 espaces (voir `.editorconfig`).
- **JS** : vanilla, pas de framework. Fonctions courtes, état global dans `state`.
- **CSS** : custom properties dans `:root`, classes utilitaires courtes.
- **Nommage** : camelCase pour le JS, kebab-case pour le CSS.
- **Pas de dépendances npm** — on reste sur du HTML/CSS/JS servi en statique.
- **jsPDF** : chargé via CDN, ne pas déplacer sans discussion.

## 🔒 Sécurité

- **Jamais** d'injection directe en HTML de données saisies par l'utilisateur — utiliser `textContent`, `.value` sur un `input`, ou une fonction d'échappement dédiée.
- Pas de requêtes réseau vers des tiers (hors police Google Fonts et CDN jsPDF déjà présents).

## 🌐 i18n

Le projet est actuellement en français uniquement. Si vous voulez ouvrir à d'autres langues, discutons-en via issue — c'est prévu dans la roadmap (phase 2).

## 🧪 Tester manuellement avant une PR

Checklist minimale :

- [ ] Les 4 étapes du wizard fonctionnent sans erreur console.
- [ ] `Partager` copie un lien, et ce lien recharge bien la répartition.
- [ ] Export PDF ouvre un fichier valide.
- [ ] Export TXT téléchargé et lisible.
- [ ] Export mural s'ouvre dans un nouvel onglet, imprimable.
- [ ] Ajout / suppression de niveau custom OK.
- [ ] Pas de warning XSS lors d'une saisie contenant `<script>` ou `"`.

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

Merci !
