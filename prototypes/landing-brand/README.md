# Prototype de la landing (jetable)

Prototype des cinq directions de la landing de portfolio-cms, produit pendant le travail d'identité de marque. Il vit sur une branche jetable : il n'est pas destiné à `main` et le code n'est pas à promouvoir tel quel. Les décisions retenues sont dans `DESIGN.md` et dans la spécification #32.

## Lancer

```bash
pnpm install --ignore-workspace
pnpm --ignore-workspace dev        # http://localhost:5190/?variant=A
```

`--ignore-workspace` est nécessaire : le dépôt a son propre espace de travail pnpm, qui n'inclut pas ce dossier.

Le commutateur en bas de page change de variante (flèches ← →, ou `?variant=A` à `F`).

## Variantes

| Clé | Nom | Idée |
|---|---|---|
| A | Texte suivi | Un essai éditorial en une colonne |
| B | Source et rendu | Le fichier MDX à côté de la page rendue |
| C | Journal git | La page se lit comme un historique |
| D | Commande d'abord | Une palette qui affiche le contenu à la demande |
| E | Schéma | Une ligne de stations entre `develop` et la branche de travail |
| F | Retenue : E + B + A | Schéma de E, fichier de B, fond éditorial de A, avec fond en shader (grain et brouillard) |

La variante F est celle qui a été retenue. Le fond en shader est le composant `ShaderBackdrop`.

## Limites

- Le contraste sous le shader est calculé, pas mesuré sur les pixels du rendu.
- Le repli sans WebGL et le rendu sur un vrai téléphone n'ont pas été vérifiés.
- Les liens `/docs` et le dépôt ne mènent à rien tant que le site n'existe pas.
