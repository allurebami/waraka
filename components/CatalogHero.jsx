import Link from "next/link";

export default function CatalogHero({ kind, collection }) {
  const isProduct = kind === "product";
  const sourceNote = collection.error ? "Ce répertoire est momentanément indisponible."
    : collection.source === "demo" ? "Les fiches visibles ici sont des exemples fictifs de démonstration."
    : "Les fiches publiées restent soumises à notre démarche documentaire.";
  return <section className={`catalog-hero${isProduct ? "" : " practitioner-hero"}`}>
    <div className="catalog-hero-inner">
      <Link className="back-link" href="/">← Retour à l’accueil</Link>
      <p className="eyebrow light-eyebrow">RÉPERTOIRE WARAKA</p>
      <h1>{isProduct ? "Produits traditionnels" : "Praticiens"}</h1>
      <p>{isProduct ? "Explorez les fiches documentaires et consultez le statut des informations présentées." : "Consultez les profils et les informations communiquées à WARAKA. Chaque fiche précise son statut documentaire."}</p>
      <span className="catalog-demo-note">{sourceNote}</span>
    </div>
  </section>;
}
