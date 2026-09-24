# Migration WARAKA vers Vercel — état du 24 septembre 2026

## Source vérifiée
Cette branche contient la version source publiée sur Sites, issue du commit `b185d1f48a86ba425f2370dc1af93b960e6aa55d`. Images et polices sont présentes ; seul le fichier généré `tsconfig.tsbuildinfo` a été omis.

## État
- Le dépôt `allurebami/waraka` est accessible avec les droits d'administration. L'import est sur `migration-vercel`, en PR brouillon ; `main` garde sa version initiale.
- Le site courant reste accessible sur https://waraka.espace-de-tr-2919.chatgpt.site
- La base D1 contient cinq tables (`profiles`, `records`, `documents`, `messages`, `audit`) vides lors de la vérification. Il n'y a pas de données utilisateur à importer à cette date.
- Aucun projet ni équipe Vercel n'apparaît dans la connexion Vercel disponible pour cette session. Vérifier l'accès au bon compte et à l'intégration GitHub avant l'import.

## Architecture choisie
L'utilisateur a retenu **Vercel + Clerk** :
- **Neon Postgres** via la place de marché Vercel pour les cinq tables ;
- **Vercel Blob privé** pour les justificatifs PDF et images ;
- **Clerk** pour l'inscription et la connexion ;
- `WARAKA_ADMIN_EMAILS` comme liste d'administration côté serveur.

Ne jamais exposer les clés Clerk serveur, la chaîne de connexion SQL ni le jeton Blob dans le dépôt. La configuration du projet doit fournir notamment `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `WARAKA_ADMIN_EMAILS`.

## Travail de code restant
1. Passer des scripts Vinext/Cloudflare à un build Next.js pris en charge par Vercel.
2. Remplacer `cloudflare:workers` et les requêtes D1 par Neon Postgres ; adapter le schéma SQLite et les migrations dans `drizzle/` à PostgreSQL, préserver les opérations atomiques.
3. Remplacer R2 par Vercel Blob privé. Garder les contrôles de type et taille, le contrôle du propriétaire avant tout téléchargement et la suppression d'un fichier si l'écriture SQL échoue.
4. Remplacer les en-têtes et routes de connexion Sites par Clerk. Mettre à jour les liens et libellés « Continuer avec ChatGPT » et protéger les routes du compte, de dépôt et d'administration.
5. Installer les trois ressources dans le projet Vercel, récupérer les variables, tester le build et les parcours publics/connectés, puis déployer d'abord une prévisualisation.

Le dépôt actuel ne doit pas être déployé tel quel sur Vercel : ses API et sa connexion dépendent de Sites. Ne pas basculer le domaine ni fusionner la PR avant la validation fonctionnelle.

Références : https://vercel.com/docs/git/vercel-for-github · https://vercel.com/docs/storage · https://clerk.com/docs/deployments/vercel
