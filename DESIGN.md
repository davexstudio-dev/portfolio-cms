# DESIGN.md : portfolio-cms

> Profil de marque et de design du projet. Lu par l'agent avant toute modification d'interface (skill `brand-design-system`).
> Chaque décision porte un statut : **[validé]** (dit par le propriétaire, 2026-11-21) ou **[proposé]** (choix de l'agent, à valider).
> Ce fichier remplace le « sans logo ni charte » de la spécification du site (#20).

## 1. Produit et public

- **Produit** : un CMS git open source (MIT) qui édite les fichiers MDX d'un dépôt GitHub, sans base de données ; chaque sauvegarde devient un commit et une pull request vers `develop`. Le projet est en construction.
- **Utilisateurs** : développeurs et designers qui tiennent leur portfolio en MDX dans Git, à l'aise avec le code et avec GitHub [validé]. Le ton et les visuels ne visent pas les non-techniciens.
- **Appareils et réseau** : lecture sur ordinateur et sur téléphone ; le site doit rester utilisable à 375 px de large. Pas de hors-ligne requis [proposé].
- **Langues et écritures** : français d'abord, anglais ensuite. Le latin suffit [validé].

## 2. Enjeu de confiance

- **Le produit ne doit jamais laisser croire** qu'il est utilisable aujourd'hui, ni montrer une fausse capture, un témoignage ou un chiffre inventé [validé].
- **Risques d'imitation** : ne pas copier le logo ni la charte de GitHub, de Keystatic ou d'un autre CMS. L'émeraude évoque Git sans reprendre une marque existante [validé].

## 3. Marque

- **Direction** : « éditorial calme » [validé]. Base neutre chaude, un seul accent émeraude profond, beaucoup d'espace, traits fins, une mono pour le code. Pas de dégradés criards ni d'effets gadget.
- **Personnalité** : éditorial, calme, précis ; à éviter : criard, gadget, « hacker » [validé].
- **Nom** : « portfolio-cms », toujours en minuscules, même en début de phrase [validé].
- **Logo** : logotype texte en minuscules, le trait d'union traité comme élément graphique, plus un monogramme géométrique simple pour le favicon et les avatars, en SVG. Aucun pictogramme figuratif (dossier, plume) [validé]. Dessin exact : à définir pendant les variantes.
- **Visuels** : motifs SVG (fil de commits, lignes de frontmatter, bloc MDX), jamais présentés comme des captures du produit. Ni photo ni image générée [validé].
- **Mouvement** : minimal et utile (survols, apparition douce, bascule de thème), `prefers-reduced-motion` respecté, aucune animation au défilement [validé].
- **Directions écartées** : « startup SaaS colorée à dégradés » et « terminal hacker sombre » [validé].

- **Landing retenue** [validé, 2026-11-21] : combinaison de trois variantes du prototype. Le **schéma** de E (une ligne de stations : la branche de travail part de `develop` et y revient par une pull request ; `main` et `develop` ne sont jamais touchées), le **panneau de fichier MDX** de B (il surligne la ligne correspondant au principe survolé, avec la mention « ce n'est pas une capture du produit »), et le **fond éditorial** de A (grands titres serif, principes en liste de définitions, section « en construction » sobre). Sous 1280 px, le schéma devient une liste verticale de stations. Prototype jetable : `?variant=F`, dossier temporaire de la session.
- **Améliorations après audit** [proposé, 2026-11-21] : (1) une action claire sous l'accroche, « Suivre le projet sur GitHub » (primaire) et « Lire la documentation » (secondaire), car la landing est en mode Persuade et ne peut pas promettre d'essai ; (2) la règle « le CMS n'écrit jamais directement sur develop ni sur main » est mise en avant dans le schéma (texte d'encre, 17 px) ; (3) la section des principes s'intitule « Nos principes », car tous ne sont pas des refus ; (4) une seule pastille « en construction », celle de l'en-tête ; (5) un pied de page sobre (licence MIT, Davex Studio Development, code source) ; (6) toutes les cibles cliquables font au moins 44 px (mesuré à 375 px). Détecteur d'impeccable : aucun défaut.
- **Polices du prototype** [proposé] : Instrument Sans (texte), Newsreader (titres), JetBrains Mono (code), toutes OFL.
- **Fond en shader** [validé le 2026-11-21 : option « composant maison », sans 21st.dev ni beUi] : un fond WebGL discret derrière l'en-tête de la landing, construit par nous sur `@paper-design/shaders-react` (Apache-2.0), composant `GrainGradient` (forme « wave », vitesse 0,12, intensité 0,6). Une seconde couche de **brouillard** (shader `PerlinNoise`, quatre octaves, vitesse 0,05, floue de 18 px, sur fond transparent) se superpose au grain : blanc laiteux en clair, vert sombre en sombre (`#284838`, plus foncé que le texte discret, pour ne jamais faire perdre de contraste). Les deux couches s'effacent vers le bas par un masque pour que le texte reste sur l'aplat. Garde-fous : teintes émeraude et neutre chaud très atténuées, jamais de dégradé criard ; les couleurs du shader sont des valeurs hexadécimales regroupées dans un seul fichier (le shader n'accepte pas les variables CSS) ; texte à 4,5:1 minimum sur chaque couleur du shader (clair : 4,88:1 au pire ; sombre : 4,94:1 au pire avec le brouillard, mesuré par calcul sur le mélange le plus défavorable) ; image fixe quand `prefers-reduced-motion` est actif (vérifié : deux captures espacées de 2 s sont identiques) ; aplat de couleur en repli si WebGL est absent ; limité à la landing, jamais en documentation ni dans le CMS. Coût : environ +31 ko de JavaScript compressé.
- **Variantes écartées** : C (journal git, trop proche de A), D (commande d'abord, contenu caché derrière un clic).

## 4. Modes de design (skill `impeccable`)

| Famille d'écrans | Mode | Remarque |
|---|---|---|
| Landing (`apps/site`, `/`) | Persuade | Quatre sections seulement : accroche, trois étapes, principes, état « en construction » |
| Documentation (`/docs`) | Read | Lecture longue, navigation latérale, recherche |
| Interface du CMS (`apps/cms`) | Operate | Mêmes jetons que le site, appliqués plus tard |

## 5. Contraintes dures (mesurées)

| Exigence | Seuil | Contrôle |
|---|---|---|
| Cible tactile | 44 px au minimum sur la landing et la documentation ; 48 px pour l'interface du CMS [proposé] | `scripts/measure-touch-targets.js` |
| Contraste du texte courant | 7:1 [proposé] | `scripts/check-contrast.ts` |
| Contraste du texte | 4,5:1 [validé] | idem |
| Composants et focus | 3:1 | idem |
| Texte courant | 17 px, interligne 1,6 [proposé] | revue |
| Thème sombre | oui, dessiné à part, suit le système, sélecteur manuel [validé] | page de démonstration |
| Largeur minimale | 375 px sans défilement horizontal [validé] | test de bout en bout du site |
| Mouvement | `prefers-reduced-motion` respecté [validé] | revue |

## 6. Jetons et typographie

- **Jetons** : `packages/ui/src/styles/tokens.css`, à exposer au thème Tailwind dans le CSS du paquet `ui` quand il existera (`@theme inline`) [proposé].
- **Palette** [proposé, contrastes contrôlés] : neutres chauds (teinte 85) ; **accent émeraude** (teinte 160) : `primary` foncé en clair (L 0,42), éclairci en sombre (L 0,78). `accent` est un fond émeraude très doux. `destructive` en rouge-brique.
- **Statuts** (toujours avec une icône et un mot, jamais la couleur seule) : `construction` (ambre, pastille « en construction » de l'en-tête), `soon` (neutre, marque « à venir » de la documentation).
- **Polices** [validé : trio ouvert ; familles exactes à choisir pendant les variantes] : un sans-serif pour l'interface et le texte courant, une serif d'affichage pour les grands titres de la landing, une mono pour le code. Toutes sous licence ouverte (SIL OFL), auto-hébergées (`@fontsource`), couvrant le latin.
- **Rayon** : `--radius: 0.5rem` [proposé].

## 7. Composants

- **Génériques** : le futur paquet `packages/ui` (shadcn/ui officiel et composants maison), style et famille (Base UI ou Radix) à choisir au ticket #21.
- **Métier** : dans l'application concernée.
- **Page de démonstration** : `/design` en développement seulement, créée avec le site.
- **Règle** : aucune valeur de couleur ou d'espacement arbitraire ; les composants shadcn ne sont pas restylés à l'usage. Ces règles sont aussi écrites dans la configuration de `@shadcn/lint` (le présent fichier en est la source lisible) [validé].

## 8. Registres shadcn autorisés

Liste blanche de l'ADR 0014 de davex-studio [validé] :

| Espace de noms | Statut | Raison |
|---|---|---|
| shadcn/ui officiel | autorisé | source de référence |
| blocks.so | autorisé | licence MIT |
| coss ui (`cosscom/ui`) | autorisé | licence MIT |
| `cosscom/coss` | écarté | licence AGPL |
| beUi (sur 21st.dev) | écarté (2026-11-21) | MIT, mais installation par clé d'API 21st.dev (compte requis, quota). Le fond en shader est un composant maison sur `@paper-design/shaders-react` (Apache-2.0) |
| shadcnblocks | écarté | licence interdisant la redistribution ; aucun bloc copié |

Règle : relire chaque élément avant installation ; demander l'accord avant d'ajouter un registre. Les polices et illustrations sont sous licence ouverte ou créées par nous.

## 9. Vocabulaire et voix

- **Glossaire** : celui de davex-studio (CMS git, Bloc, Composant maison, Registre autorisé) ; le dépôt portfolio-cms n'a pas encore le sien.
- **Personne** : vouvoiement [proposé]. Français direct, phrases courtes (15 mots en moyenne), pas de superlatifs, pas d'émojis, pas de futur présenté comme du présent [validé].
- **Exemple d'accroche** : « Éditez votre portfolio en MDX, sans quitter Git. »
- **Contenu public** : le dépôt est public ; n'y écrire que ce qui existe et ce qui est décidé pour le projet ouvert, jamais d'offre, de tarif ni de feuille de route privée [validé].
- **Textes à reprendre tels quels** : pastille « en construction » ; marque « à venir ».

## 10. Commandes de vérification

```
bun <skill>/scripts/check-contrast.ts --tokens packages/ui/src/styles/tokens.css
pnpm dlx @shadscan/cli@next --json        # garde-fou d'agent avant commit, projet shadcn/ui requis
```

Le linter `@shadcn/lint` rejoint la CI d'`apps/site` et `apps/cms` au ticket #21.

## 11. Questions ouvertes

- Familles exactes des trois polices : Instrument Sans, Newsreader et JetBrains Mono sont utilisées dans le prototype ; à valider.
- Fond en shader : contraste mesuré par calcul sur les couleurs du shader, pas encore sur les pixels du rendu ; poids (+31 ko compressés) à confirmer acceptable pour une landing ; à retester sur un téléphone.
- Dessin final du logotype et du monogramme.
- Style shadcn (Base UI ou Radix, vega / nova / lyra…) : à choisir au ticket #21.
- Tutoiement ou vouvoiement : vouvoiement proposé, à confirmer.
- Seuil de cible tactile et taille du texte : proposés, à confirmer.
