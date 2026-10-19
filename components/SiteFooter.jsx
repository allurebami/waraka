import Link from "next/link";
import BrandLogo from "./BrandLogo.jsx";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="brand footer-brand" href="/" aria-label="WARAKA, accueil"><BrandLogo /></Link>
      <p>WARAKA distingue les informations déclarées des éléments examinés. Les contenus ne constituent pas des recommandations de santé.</p>
      <Link href="/#accueil">Retour à l’accueil</Link>
    </footer>
  );
}
