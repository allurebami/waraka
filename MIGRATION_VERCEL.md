# WARAKA sur Vercel

La branche `migration-vercel` porte la version Next.js de WARAKA. Elle remplace l'identité Sites par Clerk, D1 par Neon Postgres et R2 par Vercel Blob privé. Le build local `pnpm build` et la vérification TypeScript `pnpm exec tsc --noEmit` ont réussi le 24 septembre 2026.

## Configuration du projet

Importer le dépôt `allurebami/waraka` dans l'espace Vercel `christianbardots-projects`. Avant une ouverture publique, créer et relier au projet :

1. une base Neon Postgres (variable `DATABASE_URL`) ;
2. un magasin Vercel Blob avec accès **private** (`BLOB_READ_WRITE_TOKEN` ou authentification OIDC fournie par Vercel) ;
3. une instance Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).

Configurer aussi `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` et `WARAKA_ADMIN_EMAILS` avec les adresses explicitement autorisées. Garder toutes les clés hors du dépôt. Exemple de noms dans `.env.example`.

Lorsque `DATABASE_URL` est disponible dans un environnement sécurisé, lancer une fois `pnpm db:migrate` pour créer les cinq tables. Les migrations SQL utilisent des chaînes de date ISO afin de préserver les comparaisons et réponses de l'API. Le script est idempotent pour la première création ; toute évolution future du schéma devra avoir sa propre migration.

## Contrôles avant publication

- Vérifier l'annuaire et la recherche d'une référence sans être connecté.
- Créer un compte Clerk, enregistrer un profil, déposer un document privé et soumettre le dossier.
- Vérifier qu'un autre compte ne peut pas lire le document.
- Vérifier que seul un administrateur autorisé voit les dossiers et peut publier une fiche.
- Vérifier le formulaire de contact et le journal de décisions.

La base Sites D1 était vide au moment de l'audit. Aucun profil, document ou message n'attendait alors un transfert. Le site Sites reste accessible pendant cette vérification. Ne pas basculer de domaine avant les contrôles.

Le connecteur Vercel disponible dans ChatGPT ne possède pas actuellement le jeton pour l'espace `christianbardots-projects` ; le navigateur connecté voit toutefois cet espace et le dépôt GitHub.
