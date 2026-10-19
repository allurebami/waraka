# WARAKA

WARAKA documente les produits traditionnels et référence des praticiens au Cameroun. Cette version utilise **JavaScript, React et Next.js (App Router)**, en conservant la charte graphique et le catalogue public Supabase existants.

Le périmètre reste limité à l’accueil, aux produits et aux praticiens. Le contact et les demandes de prestations passent par le lien WhatsApp déjà utilisé par l’équipe. Les inscriptions, paiements et espaces professionnels ne sont pas ajoutés par cette migration.

## Organisation, dans l’ordre de la mise à jour

1. **HTML** : structure sémantique des pages, titres, navigation, formulaires de recherche et fiches accessibles. Cette structure est décrite en JSX et rendue en HTML par React/Next.js.
2. **CSS** : `app/globals.css` conserve la palette, les images et les mises en page responsive. Le lien d’évitement, les cibles tactiles et le fond de la page Praticiens sont corrigés.
3. **JavaScript** : `lib/catalog.js` regroupe recherche, filtres, villes et adaptation des données. `lib/data-service.js` lit les fiches publiques et distingue catalogue vide, démonstration et panne.
4. **React** : `components/` contient les éléments partagés : navigation, cartes, recherche, filtres et fenêtre de détail. Les informations provenant du catalogue sont affichées comme texte, sans insertion de HTML brut.
5. **Next.js** : `app/` fournit les routes, le rendu serveur, les métadonnées sociales, le sitemap, la page 404 et les états de chargement. Les interactions restent dans les composants client.

## Routes

| Page | Adresse | Ancienne adresse redirigée en 308 |
| --- | --- | --- |
| Accueil | `/` | `/index.html` |
| Produits | `/produits` | `/produits.html` |
| Praticiens | `/praticiens` | `/praticiens.html` |

Les redirections conservent les paramètres de recherche. Les ancres historiques de l’accueil (`#accueil`, `#produits`, `#praticiens`, `#confiance`, `#services`, `#contact`) sont conservées.

Les recherches des répertoires peuvent être partagées, par exemple `/produits?q=huile&categorie=huile` et `/praticiens?ville=Douala`. Elles fonctionnent sans distinction de casse ni d’accent. Les options de ville sont issues des profils publiés.

## Développement et validation

Node.js 20.9 ou supérieur est nécessaire.

```bash
npm ci
npm run dev
```

```bash
npm test
npm run build
npm run test:http
npm start
```

Les tests couvrent notamment les recherches combinées, les villes dynamiques, les paramètres partagés, les filtres de publication et l’absence de remplacement d’un catalogue indisponible par des exemples fictifs. Après compilation, `npm run test:http` lance un serveur de catalogue isolé et vérifie les pages, le rendu serveur, les redirections et les états d’erreur sans modifier la base réelle.

## Catalogue Supabase

La configuration **publique** du catalogue existant est conservée dans `lib/config.js`. Aucun changement de base ni aucune écriture en base n’est nécessaire pour la migration.

Les valeurs peuvent être remplacées par des variables d’environnement (copier `.env.example` vers `.env.local` pour un développement local) :

| Variable | Usage |
| --- | --- |
| `SUPABASE_URL` | URL du projet Supabase, à fournir avec sa clé publique |
| `SUPABASE_PUBLISHABLE_KEY` | Clé publishable ou ancienne clé `anon`, jamais une clé `service_role` ou secrète |
| `NEXT_PUBLIC_SITE_URL` | URL publique canonique, par défaut `https://waraka-bea6.vercel.app` |
| `WARAKA_DEMO_MODE` | `1` uniquement pour afficher explicitement les exemples fictifs en local ; `0` par défaut |

Les anciennes variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` restent acceptées. Les requêtes de catalogue sont désormais exécutées côté serveur, avec une limite d’attente de 8 secondes. Les pages demandent les données à chaque requête ; une nouvelle tentative ne réutilise pas une panne en cache.

Les produits sont limités à `status = approved`, les praticiens à `publication_status = published`. Le fichier `supabase/schema.sql` et les règles RLS existantes sont conservés. La gestion et la validation des fiches restent effectuées par l’équipe dans Supabase. Une mise en avant est signalée par son badge ; une publication ne constitue pas une certification médicale.

Les exemples ne sont affichés que dans un mode de démonstration explicite ou sans configuration. Une panne réseau, un catalogue vide ou une configuration incomplète n’affichent pas de faux profils. L’interface propose un message et une nouvelle tentative quand une source est indisponible.

## Vercel

Le projet existant est `waraka-bea6`, relié au dépôt `allurebami/waraka`. `vercel.json` déclare le framework Next.js, `npm ci` pour l’installation et `npm run build` pour la compilation.

La racine du projet doit être celle du dépôt. Les déploiements passent par l’intégration GitHub existante. Un éventuel réglage d’hébergement qui impose encore un ancien dossier de sortie statique doit revenir à la valeur par défaut Next.js. Conserver `WARAKA_DEMO_MODE=0` en production.

Les assets de marque sont conservés dans `public/assets/`. Le partage social, les URL canoniques et le sitemap utilisent `NEXT_PUBLIC_SITE_URL`.

## Identité visuelle WARAKA

Le logo propre à WARAKA associe un W végétal à un livre doré : patrimoine botanique et transmission des connaissances. Le nom WARAKA accompagne le symbole dans la signature horizontale.

- `public/assets/waraka-logo-v1.png` : logo horizontal sur fond transparent, utilisé dans l’en-tête et le pied de page via `components/BrandLogo.jsx`.
- `public/assets/waraka-symbol-v1.png` : emblème seul sur fond transparent, utilisé comme icône du site et icône Apple.

Les fichiers haute résolution sont servis dans les dimensions adaptées au site par le composant Image de Next.js.
