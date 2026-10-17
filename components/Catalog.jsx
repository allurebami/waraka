"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { categories, filterProducts, filterPractitioners, practitionerCities } from "../lib/catalog.js";
import { ProductCard, PractitionerCard } from "./CatalogCards.jsx";
import DetailDialog from "./DetailDialog.jsx";

function SearchForm({ id, query, onChange, onSubmit, label, placeholder }) {
  return (
    <form className="search-controls" role="search" aria-label={label} onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
      <label className="visually-hidden" htmlFor={id}>{label}</label>
      <input id={id} type="search" value={query} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" />
      <button className="button button-primary" type="submit">Rechercher</button>
    </form>
  );
}

function CategoryFilters({ value, onChange }) {
  return <div className="filter-row" role="group" aria-label="Filtrer les produits">{categories.map((category) => (
    <button className={`filter-chip${value === category.value ? " is-active" : ""}`} type="button" key={category.value} aria-pressed={value === category.value} onClick={() => onChange(category.value)}>{category.label}</button>
  ))}</div>;
}

function CityFilter({ id, cities, value, onChange, wide = false }) {
  return <label className={`city-filter${wide ? " city-filter-wide" : ""}`} htmlFor={id}>
    <span>Filtrer par ville</span>
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="all">Toutes les villes</option>
      {cities.map((city) => <option key={city} value={city}>{city}</option>)}
    </select>
  </label>;
}

function CollectionState({ collection, count, filtered, kind }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  if (collection.error) return <div className="empty-state data-error" role="alert" aria-busy={isPending}>
    <p>Impossible de charger {kind === "product" ? "les produits" : "les praticiens"} pour le moment. Réessayez dans quelques instants.</p>
    <button className="button button-primary" type="button" disabled={isPending} onClick={() => startTransition(() => router.refresh())}>{isPending ? "Chargement…" : "Réessayer"}</button>
  </div>;
  if (count) return null;
  return <p className="empty-state" role="status">{filtered
    ? `Aucun ${kind === "product" ? "produit" : "praticien"} ne correspond à ces critères.`
    : kind === "product" ? "Aucun produit publié pour le moment." : "Aucun profil publié pour le moment."}</p>;
}

function Count({ collection, count, noun }) {
  return <span className="section-count" role="status">{collection.error ? "Indisponible" : `${count} ${noun}${count === 1 ? "" : "s"}`}</span>;
}

const emptyCollection = { entries: [], source: "live", error: null };

export default function Catalog({ mode = "home", products = emptyCollection, practitioners = emptyCollection, initialQuery = "", initialCategory = "all", initialCity = "all" }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const cities = practitionerCities(practitioners.entries);
  const [city, setCity] = useState(cities.includes(initialCity) ? initialCity : "all");
  const [selected, setSelected] = useState(null);
  const visibleProducts = filterProducts(products.entries, query, category);
  const visiblePractitioners = filterPractitioners(practitioners.entries, query, city);
  const isHome = mode === "home";
  const hasFilters = Boolean(query || category !== "all" || city !== "all");

  function syncUrl(nextQuery, nextCategory, nextCity) {
    if (isHome) return;
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries({ q: nextQuery, categorie: nextCategory === "all" ? "" : nextCategory, ville: nextCity === "all" ? "" : nextCity })) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function changeQuery(value) { setQuery(value); syncUrl(value, category, city); }
  function changeCategory(value) { setCategory(value); syncUrl(query, value, city); }
  function changeCity(value) { setCity(value); syncUrl(query, category, value); }
  function resetFilters() { setQuery(""); setCategory("all"); setCity("all"); syncUrl("", "all", "all"); }
  function openDetails(type, entry) { setSelected({ type, entry }); }
  function submitSearch() {
    document.getElementById(isHome ? "produits" : "catalogue")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  const reset = hasFilters && <div className="filter-actions"><button className="text-button" type="button" onClick={resetFilters}>Réinitialiser les filtres</button></div>;

  const productSection = <section className={`section${isHome ? "" : " catalog-section"}`} id={isHome ? "produits" : "catalogue"} aria-labelledby="productTitle">
    <div className="section-heading">
      <div>
        <p className="eyebrow">{isHome ? "RÉPERTOIRE 01" : "CATALOGUE"}</p>
        <h2 id="productTitle">{isHome ? "Produits traditionnels" : "Fiches produits"}</h2>
        <p>{products.source === "demo" ? "Les exemples affichés servent à présenter la plateforme." : "Consultez les fiches produits publiées et leur statut documentaire."}</p>
      </div>
      <div className="heading-actions">
        <Count collection={products} count={visibleProducts.length} noun="fiche" />
        {isHome && <Link className="section-count view-all-link" href="/produits">Voir tous les produits <span aria-hidden="true">→</span></Link>}
      </div>
    </div>
    {isHome && <CategoryFilters value={category} onChange={changeCategory} />}
    {isHome && reset}
    <div className="card-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openDetails} />)}</div>
    <CollectionState collection={products} count={visibleProducts.length} filtered={Boolean(query || category !== "all")} kind="product" />
  </section>;

  const practitionerSection = <section className={`section ${isHome ? "practitioners-section" : "catalog-section"}`} id={isHome ? "praticiens" : "catalogue"} aria-labelledby="practitionerTitle">
    <div className="section-heading">
      <div>
        <p className="eyebrow">{isHome ? "RÉPERTOIRE 02" : "RÉPERTOIRE"}</p>
        <h2 id="practitionerTitle">{isHome ? "Praticiens" : "Profils de praticiens"}</h2>
        <p>{practitioners.source === "demo" ? "Les profils présentés sont fictifs et servent à illustrer la plateforme." : "Découvrez les profils publiés et les informations professionnelles communiquées à WARAKA."}</p>
        {isHome && <Link className="section-count view-all-link" href="/praticiens">Voir tous les praticiens <span aria-hidden="true">→</span></Link>}
      </div>
      {isHome ? <CityFilter id="homeCity" cities={cities} value={city} onChange={changeCity} /> : <Count collection={practitioners} count={visiblePractitioners.length} noun="profil" />}
    </div>
    <div className="card-grid practitioner-grid">{visiblePractitioners.map((person) => <PractitionerCard key={person.id} person={person} onOpen={openDetails} />)}</div>
    <CollectionState collection={practitioners} count={visiblePractitioners.length} filtered={Boolean(query || city !== "all")} kind="practitioner" />
  </section>;

  return <>
    {isHome ? <>
      <section className="search-band" aria-label="Recherche dans WARAKA">
        <div className="search-intro"><p className="eyebrow">RECHERCHE</p><h2>Que recherchez-vous ?</h2></div>
        <SearchForm id="globalSearch" query={query} onChange={changeQuery} onSubmit={submitSearch} label="Nom de produit, praticien, spécialité ou ville" placeholder="Produit, praticien, spécialité, ville..." />
      </section>
      <section className="notice-strip" id="confiance" aria-label="Notre approche">
        <span className="notice-mark" aria-hidden="true">i</span>
        <p><strong>Information, pas prescription.</strong> WARAKA ne pose pas de diagnostic et ne remplace pas l’avis d’un professionnel de santé.</p>
      </section>
      {productSection}{practitionerSection}
    </> : <>
      <section className={`catalog-tools${mode === "practitioners" ? " practitioner-tools" : ""}`} aria-label="Recherche et filtres">
        <SearchForm id="catalogSearch" query={query} onChange={changeQuery} onSubmit={submitSearch}
          label={mode === "products" ? "Rechercher un produit" : "Rechercher un praticien, une spécialité ou une ville"}
          placeholder={mode === "products" ? "Rechercher un produit ou une catégorie..." : "Nom, spécialité ou ville..."} />
        {mode === "products" ? <CategoryFilters value={category} onChange={changeCategory} /> : <CityFilter id="catalogCity" cities={cities} value={city} onChange={changeCity} wide />}
        {reset}
      </section>
      {mode === "products" ? productSection : practitionerSection}
    </>}
    {selected && <DetailDialog selected={selected} onClose={() => setSelected(null)} />}
  </>;
}
