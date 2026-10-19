export default function CatalogSkeleton() {
  return <section className="section catalog-loading" aria-label="Chargement du répertoire" aria-busy="true">
    <p role="status">Chargement du répertoire WARAKA…</p>
    <div className="card-grid" aria-hidden="true"><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div>
  </section>;
}
