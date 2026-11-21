export const repo = "https://github.com/davexstudio-dev/portfolio-cms";
export const links = {
  repo,
  issues: `${repo}/issues`,
  docs: "/docs",
};

export const hook = "Éditez votre portfolio en MDX, sans quitter Git.";
export const lead =
  "portfolio-cms est un éditeur web pour les fichiers MDX de votre dépôt GitHub. Chaque sauvegarde devient un commit et une pull request.";

export const steps = [
  {
    title: "Connectez votre dépôt GitHub",
    body: "Installez la GitHub App sur le dépôt. Elle ne demande que les droits sur le contenu et les pull requests.",
  },
  {
    title: "Éditez",
    body: "Ouvrez un article ou un tutoriel, modifiez le frontmatter et le texte, et suivez l'aperçu en direct.",
  },
  {
    title: "Ouvrez une pull request",
    body: "La sauvegarde ajoute un commit sur une branche de travail et ouvre une pull request vers develop.",
  },
];

export const principles = [
  { t: "Du MDX dans votre dépôt", d: "Vos contenus restent des fichiers MDX versionnés. Rien n'est copié ailleurs." },
  { t: "Aucune base de données", d: "Le dépôt GitHub est la seule source de vérité." },
  { t: "Jamais d'écriture sur main ni develop", d: "Le CMS travaille sur une branche et passe par une pull request." },
  { t: "Dépôts privés pris en charge", d: "Vous pouvez l'utiliser avant de publier votre site." },
  { t: "Licence MIT", d: "Le code est ouvert : vous pouvez le lire, l'utiliser et le modifier." },
];

export const status = {
  title: "En construction",
  body: "portfolio-cms n'est pas encore utilisable. Le code et l'avancement sont publics : suivez les tickets ou lisez la documentation.",
};
