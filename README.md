# portfolio-cms

Le CMS des agences et des équipes marketing : publiez vos sites jusqu'à dix fois plus vite, sans développeur.

Le contenu reste en fichiers MDX dans votre dépôt : pas de base de données. Une sauvegarde crée un commit sur une branche de travail et ouvre une pull request, et votre CI continue de refuser le contenu invalide.

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
