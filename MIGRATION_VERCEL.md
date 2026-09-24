# WARAKA sur Vercel, Firebase Spark et Vercel Blob Hobby

La branche `migration-vercel` prépare Next.js sur Vercel avec Firebase Authentication (courriel et mot de passe), Cloud Firestore (profils, fiches, messages et audit) et Vercel Blob **privé** (documents). Elle n'utilise aucun service Firebase qui nécessite le forfait Blaze. L'utilisateur a demandé une configuration sans facturation.

## État vérifié le 24 septembre 2026

- Le projet Firebase `waraka-a2e59` est sur Spark (0 $/mois).
- L'application Web « Waraka Web » est enregistrée et la méthode Authentication « Adresse e-mail/Mot de passe » est activée.
- Firestore Standard `(default)` est créé à Paris (`europe-west9`) en mode production, avec refus des lectures et écritures directes depuis les clients.
- La configuration serveur Vercel, la liaison du magasin Blob et les essais réels restent à faire. Aucun projet Waraka n'a été déployé sur Vercel.

## Firebase sans facturation

1. Garder le projet sur **Spark**, sans lier de compte de facturation. Le projet, l'application Web et Authentication > Email/Password sont déjà configurés. Ajouter le futur domaine Vercel de WARAKA aux domaines autorisés. Les comptes doivent vérifier leur courriel avant d'utiliser leur espace.
2. La base Cloud Firestore gratuite est créée en mode production. Les règles initiales refusent déjà les accès directs et correspondent à `firebase/firestore.rules`. Toutes les lectures et écritures WARAKA passent par l'API Next.js qui vérifie les jetons Firebase et les droits d'accès.
3. Dans Paramètres du projet > Comptes de service, créer une clé de compte de service pour le serveur. Copier ses champs uniquement dans les variables chiffrées de Vercel. Ne jamais publier le JSON ou l'envoyer dans une conversation.

Le forfait Spark n'exige aucun moyen de paiement. Quand le quota gratuit est épuisé, le service concerné devient indisponible jusqu'à la remise à zéro du quota ; ne pas activer Blaze. Cloud Storage for Firebase n'est pas utilisé, car la création de nouveaux buckets exige Blaze.

## Vercel Hobby

Relier le magasin privé `waraka-documents` déjà créé au futur projet Vercel afin d'injecter `BLOB_READ_WRITE_TOKEN`. Conserver l'espace Vercel en forfait Hobby. Vercel Blob est gratuit sous ses limites Hobby et bloque l'accès au stockage si les limites sont dépassées, sans facturer le dépassement. Les documents restent accessibles uniquement par l'API après contrôle de leur propriétaire ou d'un administrateur.

**Restriction du forfait Hobby :** Vercel le réserve à un usage personnel non commercial. Avant une ouverture publique de WARAKA, confirmer que le projet répond à cette condition. Si WARAKA est une activité commerciale, ne pas le publier sur Hobby ; choisir une solution d'hébergement adaptée sans activer de facturation à l'insu du propriétaire.

Ajouter les variables de `.env.example` dans les environnements Preview et Production. Les quatre variables `NEXT_PUBLIC_` viennent de la configuration de l'application Web Firebase ; la clé API côté navigateur est publique. `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` et `FIREBASE_PRIVATE_KEY` viennent du compte de service. La clé privée peut contenir des sauts de ligne `\\n`. `WARAKA_ADMIN_EMAILS` contient les adresses vérifiées habilitées, séparées par des virgules. Isoler idéalement Preview et Production avec des projets Firebase distincts.

Importer `allurebami/waraka` dans Vercel après avoir placé la branche de migration sur la branche de déploiement. Le dépôt n'est pas encore déployé sur Vercel. La base Sites D1 était vide lors de l'audit : aucune donnée utilisateur n'était alors à transférer.

## Vérifications avant ouverture

- Création de compte, validation du courriel, connexion et déconnexion.
- Profil, document PDF/JPEG/PNG privé (5 Mo maximum), soumission d'un dossier.
- Impossible pour un second compte de consulter le document ; impossible de lire directement Firestore depuis le navigateur.
- Seule une adresse administratrice vérifiée peut examiner et publier une fiche.
- Annuaire et vérification publique d'une référence, messages et journal des décisions.

`pnpm build` et la vérification TypeScript passent sans clés Firebase ; cela ne vérifie pas encore le fonctionnement réel des services. Garder le site Sites accessible pendant la validation.
