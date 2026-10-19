import Link from "next/link";
import Catalog from "../../components/Catalog.jsx";
import CatalogHero from "../../components/CatalogHero.jsx";
import { catalogService } from "../../lib/server-catalog.js";
import { pageMetadata } from "../../lib/metadata.js";
import { readFilters } from "../../lib/search-params.js";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Praticiens traditionnels référencés | WARAKA", "Consultez les profils des praticiens traditionnels référencés sur WARAKA et découvrez les informations communiquées sur leurs activités au Cameroun.", "/praticiens");

export default async function PractitionersPage({ searchParams }) {
  const [practitioners, params] = await Promise.all([catalogService.practitioners(), searchParams]);
  const filters = readFilters(params);
  return <>
    <CatalogHero kind="practitioner" collection={practitioners} />
    <Catalog key={`${filters.initialQuery}:${filters.initialCity}`} mode="practitioners" practitioners={practitioners} {...filters} />
    <section className="catalog-bottom">
      <div><p className="eyebrow">TRANSPARENCE</p><h2>Informations déclarées et éléments examinés.</h2><p>Un profil publié ne constitue pas à lui seul une certification ou une recommandation médicale. Chaque fiche précise les informations communiquées à WARAKA.</p></div>
      <Link className="button button-primary" href="/#contact">Contacter WARAKA</Link>
    </section>
  </>;
}
