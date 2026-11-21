# portfolio-cms

Un CMS git open source pour sites de portfolio (développeur, designer, etc.).

Le contenu reste en fichiers MDX dans votre dépôt : pas de base de données. Une sauvegarde crée un commit sur une branche de travail et ouvre une pull request,  et votre CI continue de refuser le contenu invalide.

> **Statut : en construction.** Rien n'est utilisable pour l'instant.

## Éditions

- **Édition Libre** (MIT) : le moteur et les templates gratuits.
- **Édition Pro** : le même moteur, plus des templates payants.

Les templates n'utilisent que shadcn/ui officiel et des composants maison, pour rester redistribuables.

## Structure

```
apps/       applications (CMS, aperçu)
packages/   bibliothèques partagées
```

## Licence

MIT, voir [LICENSE](./LICENSE).
