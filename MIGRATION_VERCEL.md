# WARAKA sur Vercel et Firebase

La branche `migration-vercel` prépare une application Next.js hébergée sur Vercel avec Firebase Authentication (courriel et mot de passe), Cloud Firestore (profils, fiches, messages et audit) et Cloud Storage for Firebase (documents privés). La version précédente prévoyait Clerk, Neon et Vercel Blob ; ces services ne sont plus nécessaires pour l'application.

## Préparer Firebase

1. Dans la console Firebase, créer ou choisir **un projet** et enregistrer une application **Web**. Activer Authentication > Email/Password. Ajouter le domaine Vercel de WARAKA dans les domaines autorisés d'Authentication. Les comptes doivent vérifier leur courriel avant d'utiliser leur espace.
2. Créer la base Cloud Firestore en mode sécurisé, puis le bucket Cloud Storage. Firebase exige le plan **Blaze** pour Cloud Storage ; vérifier les coûts et budgets avant activation.
3. Conserver les règles Firestore et Storage qui refusent les accès directs depuis le navigateur. Toutes les lectures et écritures WARAKA passent par l'API Next.js, qui valide le jeton Firebase et contrôle le propriétaire ou l'adresse administratrice. Le modèle des règles est fourni dans `firebase/firestore.rules` et `firebase/storage.rules`.
4. Dans Paramètres du projet > Comptes de service, créer une clé de compte de service. Reporter ses champs uniquement dans les variables **chiffrées** du projet Vercel ; ne pas ajouter le fichier JSON au dépôt ni l'envoyer dans une conversation. La clé privée peut être copiée dans `FIREBASE_PRIVATE_KEY` avec des sauts de ligne `\\n`.

## Variables Vercel

Renseigner les variables de `.env.example` dans Vercel pour Preview et Production, idéalement avec **des projets Firebase distincts** pour isoler les essais. Les quatre variables `NEXT_PUBLIC_` viennent de la configuration de l'application Web ; la clé API côté navigateur est publique. Les quatre variables `FIREBASE_` correspondent au projet, au compte de service et au nom exact du bucket. `WARAKA_ADMIN_EMAILS` contient les adresses vérifiées habilitées, séparées par des virgules. Ne publier aucune clé de service.

Importer `allurebami/waraka` dans Vercel après avoir placé la branche de migration sur la branche de déploiement. Le dépôt n'est pas encore déployé sur Vercel. La base Sites D1 était vide lors de l'audit : aucune donnée utilisateur n'était alors à transférer.

## Vérifier avant l'ouverture

- Création de compte, validation du courriel, connexion et déconnexion.
- Profil, document PDF/JPEG/PNG privé (5 Mo maximum), soumission d'un dossier.
- Impossible pour un second compte de consulter le document ; impossible de lire directement Firestore ou Storage depuis un navigateur.
- Seule une adresse administratrice vérifiée peut examiner et publier une fiche.
- Annuaire et vérification publique d'une référence, messages et journal des décisions.

`pnpm build` et la vérification TypeScript passent sans clés Firebase ; cela ne vérifie pas encore le fonctionnement réel des services. Garder le site Sites accessible pendant la validation.
