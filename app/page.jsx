import Catalog from "../components/Catalog.jsx";
import { Suspense } from "react";
import CatalogSkeleton from "../components/CatalogSkeleton.jsx";
import { HomeHero, HomeSections } from "../components/HomeSections.jsx";
import { catalogService } from "../lib/server-catalog.js";
import { pageMetadata } from "../lib/metadata.js";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("WARAKA | Produits traditionnels et praticiens", "WARAKA documente les produits traditionnels et référence des praticiens au Cameroun. Explorez les répertoires et découvrez les informations disponibles.");

async function HomeCatalog() {
  const [products, practitioners] = await Promise.all([catalogService.products(), catalogService.practitioners()]);
  return <Catalog products={products} practitioners={practitioners} />;
}

export default function HomePage() {
  return <><HomeHero /><Suspense fallback={<CatalogSkeleton />}><HomeCatalog /></Suspense><HomeSections /></>;
}
