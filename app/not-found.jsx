import Link from "next/link";

export default function NotFound() {
  return <section className="section not-found"><p className="eyebrow">WARAKA · PAGE INTROUVABLE</p><h1>Retrouvons votre chemin.</h1><p>Cette page n’existe pas. Retrouvez nos produits et les profils de praticiens depuis l’accueil.</p><Link className="button button-primary" href="/">Retour à l’accueil</Link></section>;
}
