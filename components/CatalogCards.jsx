import { productBadge, safeImageSource } from "../lib/catalog.js";

export function CatalogImage({ src, alt, className, loading = "lazy" }) {
  return <img className={className} src={safeImageSource(src)} alt={alt} loading={loading} onError={(event) => {
    const fallback = new URL("/assets/waraka-apercu.jpg", window.location.origin).href;
    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
  }} />;
}

export function ProductCard({ product, onOpen }) {
  return (
    <article className="directory-card">
      <div className="card-media">
        <CatalogImage src={product.image} alt={product.imageAlt || product.name} />
        <span className="demo-badge">{productBadge(product)}</span>
      </div>
      <div className="card-body">
        <div className="card-meta"><span>{product.categoryLabel}</span><span>{product.isDemo ? "Information indicative" : "Fiche documentaire"}</span></div>
        <h3>{product.name}</h3><p>{product.description}</p>
        {product.practitionerName && <p className="product-practitioner">Proposé par {product.practitionerName}</p>}
        <button className="text-button" type="button" onClick={() => onOpen("product", product)} aria-label={`Consulter la fiche : ${product.name}`}>Consulter la fiche <span aria-hidden="true">→</span></button>
      </div>
    </article>
  );
}

export function PractitionerCard({ person, onOpen }) {
  return (
    <article className="directory-card practitioner-card">
      <div className="card-media practitioner-media">
        <CatalogImage src={person.image} alt={person.imageAlt || person.name} />
        <span className="demo-badge">{person.isDemo ? "Profil fictif" : "Profil publié"}</span>
      </div>
      <div className="card-body">
        <div className="card-meta"><span>{person.city}</span><span>{person.isDemo ? "À vérifier" : "Référencé par WARAKA"}</span></div>
        <h3>{person.name}</h3><p>{person.specialty}</p>
        <button className="text-button" type="button" onClick={() => onOpen("practitioner", person)} aria-label={`Voir le profil : ${person.name}`}>Voir le profil <span aria-hidden="true">→</span></button>
      </div>
    </article>
  );
}
