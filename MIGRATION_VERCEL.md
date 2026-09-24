# Migration WARAKA vers Vercel — état du 24 septembre 2026

## Source vérifiée
Cette branche contient la version source publiée sur Sites, issue du commit `b185d1f48a86ba425f2370dc1af93b960e6aa55d`. Les images et polices ont été importées. Le fichier généré `tsconfig.tsbuildinfo` a été omis.

## État réel
- Le dépôt GitHub `allurebami/waraka` est accessible avec des droits d'administration. La branche `main` conserve son contenu initial tant que l'import n'est pas revu.
- Le site actuel reste sur Sites : https://waraka.espace-de-tr-2919.chatgpt.site
- La base D1 contient les tables `profiles`, `records`, `documents`, `messages` et `audit` ; elles ne contiennent encore aucune ligne. Aucune migration de données utilisateur n'est donc requise à cet instant.
- Aucun projet Vercel n'est visible dans le compte relié à cette session. Il faut vérifier le bon compte Vercel et son accès à l'installation GitHub avant de pouvoir importer le dépôt et publier une URL Vercel.

## Dépendances de la plateforme Sites
Le code actuel ne peut pas être publié tel quel sur Vercel :
1. `scripts/run-framework.mjs` et `vite.config.ts` construisent une application Vinext/Cloudflare Worker, et non un déploiement Next.js pour Vercel.
2. `db/raw.ts` utilise `cloudflare:workers`, D1 et R2. Le point d'API `app/api/waraka/route.ts` en dépend pour tous les formulaires, l'annuaire, la vérification et les documents.
3. `app/chatgpt-auth.ts` et les liens de connexion utilisent des routes et des en-têtes d'identité fournis exclusivement par Sites. Ils doivent être remplacés par un vrai système de connexion sur Vercel.
4. La liste d'administrateurs vient de `WARAKA_ADMIN_EMAILS`. Elle devra être ajoutée aux variables du projet Vercel.

## Suite de la migration
1. Choisir et configurer une base de données SQL, un stockage privé de documents et une connexion des utilisateurs compatibles avec Vercel. Garder la même logique de validation des dossiers et les mêmes restrictions d'accès aux documents.
2. Remplacer les adaptateurs D1/R2 et Sites Auth. Recréer les cinq tables avec les migrations présentes dans `drizzle/`, adaptées au moteur de la nouvelle base.
3. Passer au build Next.js de Vercel, installer les dépendances, lancer un build local et tester les parcours publics et connectés.
4. Importer le dépôt GitHub dans le compte Vercel, configurer les variables et lancer un déploiement de prévisualisation. Vérifier ensuite l'annuaire, les formulaires, les documents et l'administration avant de publier en production.

Ne pas considérer cette branche comme prête pour la production. Aucun domaine ni trafic du site Sites n'a été basculé.

Références : https://vercel.com/docs/git/vercel-for-github et https://vercel.com/docs/frameworks/full-stack/nextjs
