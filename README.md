# WARAKA

WARAKA est une plateforme en HTML, CSS et JavaScript consacrée aux produits traditionnels et aux praticiens référencés. Les pages publiques peuvent lire le catalogue et l’annuaire depuis Supabase.

## Pages

- `index.html` : accueil et aperçu des deux répertoires.
- `produits.html` : catalogue des produits, recherche, filtres et fiches détaillées.
- `praticiens.html` : répertoire des praticiens, recherche par profil ou ville et fiches détaillées.

Sans configuration Supabase, les pages Produits et Praticiens utilisent les données fictives de démonstration. Une fois Supabase configuré, elles n’affichent que les produits approuvés et les praticiens publiés. La plateforme ne collecte pas encore de candidatures et ne formule pas de promesse de guérison. Le contact général passe par WhatsApp.

## Connecter Supabase

1. Dans le tableau de bord Supabase, ouvre **SQL Editor** et exécute `supabase/schema.sql`.
2. Dans les paramètres API du projet, copie le **Project URL** et la clé **publishable** (ou l’ancienne clé `anon`).
3. Renseigne ces deux valeurs dans `supabase-config.js` (`url` et `publishableKey`), puis redéploie le site.
4. Ajoute les fiches de l’équipe dans les tables `practitioners` et `products` avec le **Table Editor**. Mets `publication_status` à `published` pour un profil et `status` à `approved` pour un produit à afficher.

La clé `service_role` ou toute clé secrète ne doit jamais être ajoutée à `supabase-config.js` ni au code du navigateur. Cette première version limite le frontend à la lecture publique; les ajouts et validations se font dans Supabase. Les règles RLS filtrent les fiches visibles.

Catégories de produits acceptées : `preparation`, `huile`, `plante`, `autre`. Les images peuvent être renseignées dans `image_url`; `image_alt` fournit leur texte alternatif. `is_featured = true` affiche le badge « Mis en avant par WARAKA » et place le produit en tête du catalogue.

## Lancer en local

Ouvrir `index.html` dans un navigateur ou servir le dossier avec un serveur HTTP statique. Le site peut être hébergé sur Vercel ou GitHub Pages.
