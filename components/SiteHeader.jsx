"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo.jsx";

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <>
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="WARAKA, accueil">
          <BrandLogo />
        </Link>
        <nav className="main-nav" aria-label="Navigation principale">
          <Link href="/produits" className={pathname === "/produits" ? "current-nav" : undefined} aria-current={pathname === "/produits" ? "page" : undefined}>Produits</Link>
          <Link href="/praticiens" className={pathname === "/praticiens" ? "current-nav" : undefined} aria-current={pathname === "/praticiens" ? "page" : undefined}>Praticiens</Link>
          <Link href="/#confiance">Notre approche</Link>
        </nav>
        <Link className="header-link" href="/#contact">Nous contacter</Link>
      </header>
    </>
  );
}
