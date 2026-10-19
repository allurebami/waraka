import Link from "next/link";
import { HERO_IMAGE } from "../lib/media.js";
import { contactUrl, serviceUrl } from "../lib/config.js";

export function HomeHero() {
  return <section className="hero" id="accueil">
    <img className="hero-image" src={HERO_IMAGE} alt="Canopée forestière, visuel illustratif de WARAKA" fetchPriority="high" />
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-content">
      <p className="eyebrow light-eyebrow">SAVOIRS TRADITIONNELS · CAMEROUN</p>
      <h1>WARAKA</h1>
      <p className="hero-lead">Produits traditionnels documentés. Praticiens référencés.</p>
      <p className="hero-copy">Une plateforme pour consulter des informations claires et découvrir les acteurs, avec une distinction visible entre données déclarées et éléments examinés.</p>
      <div className="hero-actions"><Link className="button button-light" href="/produits">Explorer les produits</Link><Link className="button button-outline-light" href="/praticiens">Trouver un praticien</Link></div>
    </div>
  </section>;
}

export function HomeSections() {
  return <>
    <section className="contact-section" id="services">
      <div><p className="eyebrow">SERVICES WARAKA</p><h2>Donnez une meilleure visibilité à vos produits.</h2><p>Le profil de base reste gratuit après examen. WARAKA propose aussi, sur devis, la photographie et la retouche des produits, la création de fiches catalogue et la production de contenus pour les réseaux sociaux.</p></div>
      <a className="button button-primary" href={serviceUrl} target="_blank" rel="noopener noreferrer">Demander une offre sur WhatsApp</a>
    </section>
    <section className="trust-section">
      <div className="trust-copy"><p className="eyebrow light-eyebrow">TRANSPARENCE</p><h2>Un statut précis pour chaque information.</h2><p>Une fiche publiée n’est pas automatiquement une certification. WARAKA indique ce qui a été déclaré et ce qui a effectivement été examiné.</p></div>
      <div className="trust-items">
        <div><span className="status-dot declared" aria-hidden="true" /><span><strong>Information déclarée</strong><small>Communiquée par le responsable ou le praticien.</small></span></div>
        <div><span className="status-dot reviewed" aria-hidden="true" /><span><strong>Élément examiné</strong><small>Contrôle limité aux éléments précisés sur la fiche.</small></span></div>
        <div><span className="status-dot demo" aria-hidden="true" /><span><strong>Exemple de démonstration</strong><small>Contenu fictif utilisé pour illustrer l’interface.</small></span></div>
      </div>
    </section>
    <section className="contact-section" id="contact">
      <div><p className="eyebrow">CONTACT WARAKA</p><h2>Une question sur les informations publiées ?</h2><p>Écrivez à l’équipe Waraka pour demander un renseignement ou signaler une information à corriger.</p></div>
      <a className="button button-primary" href={contactUrl} target="_blank" rel="noopener noreferrer">Contacter Waraka sur WhatsApp</a>
    </section>
  </>;
}
