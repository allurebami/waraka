import { SITE_URL } from "./config.js";

export function pageMetadata(title, description, path = "/") {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: {
      type: "website", locale: "fr_FR", siteName: "WARAKA", title, description,
      url: `${SITE_URL}${path}`,
      images: [{ url: "/assets/waraka-apercu.jpg", width: 1200, height: 630, alt: "WARAKA — produits traditionnels et praticiens au Cameroun" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/assets/waraka-apercu.jpg"] },
  };
}
