# Total F/M par classe — Design

## Contexte

Klasio permet déjà de construire et comparer des répartitions de classes. La prochaine amélioration retenue est un total filles/garçons optionnel, saisi directement sur chaque classe, pour donner un signal d'équilibre sans complexifier l'étape 1 ni introduire de gestion nominative des élèves.

## Choix validés

- La saisie F/M se fait par classe uniquement.
- L'interface utilise une ligne compacte dépliable dans chaque carte de classe.
- Le badge d'équilibre utilise l'écart absolu entre filles et garçons :
  - `0` à `2` : équilibré.
  - `3` à `5` : à surveiller.
  - `6+` : déséquilibré.
- Les données F/M sont incluses dans le lien de partage, dans les scénarios A/B/C, dans l'export/import `.klasio`, et dans les exports TXT/PDF.
- L'affichage mural public ne montre pas F/M.

## Modèle de données

Chaque objet classe accepte deux champs optionnels :

```js
{
  rows: [{ nid: 'CP', val: 12 }],
  teacher: '',
  name: '',
  comment: '',
  girls: 11,
  boys: 10
}
```

Les valeurs sont normalisées par `validateState()` :

- nombre entier ;
- valeur minimale `0` ;
- valeur maximale `999` ;
- fallback à `0` si absent ou invalide.

Les classes générées automatiquement et les classes créées manuellement démarrent avec `girls: 0` et `boys: 0`.

## Interface

Dans l'étape 4, chaque carte non vide affiche une ligne compacte “Équilibre F/M”. La ligne contient :

- un libellé ;
- un résumé `F/M 11/10` quand une saisie existe ;
- un badge d'état : équilibré, à surveiller, déséquilibré, à compléter ou incohérent.

Au clic, la ligne se déplie et affiche deux champs numériques :

- `Filles` ;
- `Garçons`.

Les champs ne déclenchent pas de rendu complet à chaque frappe afin de garder le focus stable. Ils mettent à jour le badge, le résumé et la persistance.

## Règles d'état

Le statut F/M d'une classe dépend de `girls`, `boys` et du total de la classe :

- Si `girls + boys === 0` : aucune donnée, statut “à compléter”.
- Si `girls + boys < totalClasse` : statut “à compléter”.
- Si `girls + boys > totalClasse` : statut “total incohérent”.
- Si `girls + boys === totalClasse` :
  - écart `0..2` : équilibré ;
  - écart `3..5` : à surveiller ;
  - écart `6+` : déséquilibré.

Un statut F/M incohérent n'est pas une erreur bloquante de répartition. Il reste informatif.

## Exports et partage

- `.klasio` : inchangé côté enveloppe, car l'état complet inclut déjà les champs de classe.
- Lien de partage : `encodeState()` ajoute `g` et `b` sur chaque classe ; `decodeState()` les restaure.
- TXT : chaque classe ajoute une ligne `F/M : 11 filles / 10 garçons — équilibré` si une saisie existe.
- PDF : chaque classe affiche une ligne F/M compacte sous le titre de classe si une saisie existe.
- Mural : pas de changement.

## Tests

Les tests unitaires couvrent :

- validation et normalisation de `girls` / `boys` ;
- calcul du statut F/M ;
- round-trip `encodeState()` / `decodeState()` ;
- résumé de scénario enrichi avec un compteur de classes F/M à surveiller ou incohérentes.

## Hors périmètre

- Saisie F/M par niveau.
- Répartition automatique filles/garçons.
- Gestion nominative des élèves.
- Blocage de la répartition quand F/M est incomplet.
