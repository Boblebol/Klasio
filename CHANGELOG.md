# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

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

[Unreleased]: https://github.com/OWNER/klasio/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/OWNER/klasio/releases/tag/v0.1.0
