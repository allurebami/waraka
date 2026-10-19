import Link from "next/link";
import Catalog from "../../components/Catalog.jsx";
import CatalogHero from "../../components/CatalogHero.jsx";
import { catalogService } from "../../lib/server-catalog.js";
import { pageMetadata } from "../../lib/metadata.js";
import { readFilters } from "../../lib/search-params.js";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Produits traditionnels | WARAKA", "Explorez les fiches de produits traditionnels documentés sur WARAKA et consultez les informations disponibles au Cameroun.", "/produits");

export default async function ProductsPage({ searchParams }) {
  const [products, params] = await Promise.all([catalogService.products(), searchParams]);
  const filters = readFilters(params);
  return <>
    <CatalogHero kind="product" collection={products} />
    <Catalog key={`${filters.initialQuery}:${filters.initialCategory}`} mode="products" products={products} {...filters} />
    <section className="catalog-bottom">
      <div><p className="eyebrow">INFORMATION</p><h2>Une fiche n’est pas une certification.</h2><p>WARAKA distingue les informations communiquées des éléments effectivement examinés. Les fiches ne constituent ni un avis médical ni une recommandation d’utilisation.</p></div>
      <Link className="button button-primary" href="/praticiens">Découvrir les praticiens</Link>
    </section>
  </>;
}
