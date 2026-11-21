# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TanStack Start (React) pour les deux applications : le CMS (`apps/cms`), déployé sur Cloudflare Workers avec une couche d'hébergement isolée pour garder la possibilité d'un déploiement Node, et le site (`apps/site`, landing et documentation Fumadocs). Composants shadcn/ui officiels et composants maison. Monorepo pnpm. Aucune base de données.

## Users

Développeurs et designers qui tiennent leur portfolio en fichiers MDX dans un dépôt GitHub, et qui veulent un éditeur web sans quitter Git. Le premier utilisateur est davex-studio. Le produit ne vise pas les non-techniciens.

## Product Purpose

portfolio-cms est un CMS git open source (licence MIT) : une application web qui lit et écrit les fichiers MDX d'un dépôt GitHub. Une sauvegarde est un commit sur une branche de travail et une pull request vers `develop`, jamais une écriture directe sur `develop` ni sur `main`. Le succès : un contenu accepté dans le CMS ne casse pas le build du site.

## Positioning

Le CMS travaille sur les fichiers MDX tels quels, sans migration vers une base de données. La CI du propriétaire continue de refuser le contenu invalide. Un seul fichier de modèle de contenu, propre au CMS et indépendant d'Astro, alimente à la fois l'éditeur et les collections de contenu d'un site Astro.

## Operating Context

Le CMS s'installe comme une GitHub App aux droits limités (contenu et pull requests). Les dépôts privés sont pris en charge. Le contenu est en français et en anglais. La première version couvre les Articles et les Tutoriels, avec l'état brouillon. Le projet est en construction : le site public doit le dire clairement.

## Capabilities and Constraints

- Aucune base de données : le dépôt GitHub est la seule source de vérité.
- Jamais d'écriture sur `main` ni `develop`, vérifiée côté serveur.
- Hors périmètre de la première version : projets, services, parcours, médias, rôles propres au CMS, traduction automatique, hébergement Node, édition collaborative en temps réel, autres hébergeurs Git.
- Vocabulaire : celui du glossaire de davex-studio (CMS git, Bloc, Composant maison, Registre autorisé).

## Brand Commitments

Le nom s'écrit « portfolio-cms », toujours en minuscules. Licence MIT, au nom de Davex Studio Development. Logotype en texte, sans pictogramme figuratif. Le dépôt est public : n'y publier que ce qui existe et ce qui est décidé pour le projet ouvert.

## Evidence on Hand

Aucun témoignage, chiffre ni capture du produit : le CMS n'existe pas encore et rien de tout cela ne doit être inventé. Preuve de faisabilité : le script d'essai GitHub App (`scripts/spike/github-app-spike.mjs`) lit un fichier MDX, le modifie et ouvre une pull request en brouillon.

## Product Principles

- Honnêteté sur l'état d'avancement : ne jamais promettre ce qui n'existe pas.
- Le dépôt reste la seule source de vérité du contenu.
- Les branches protégées ne sont jamais écrites par le CMS.
- Une interface utilisable au clavier et lisible à 375 px de large.

## Accessibility & Inclusion

Contraste du texte d'au moins 4,5:1 dans les thèmes clair et sombre ; navigation au clavier avec focus visible ; mouvement réduit respecté (`prefers-reduced-motion`).
