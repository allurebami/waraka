import { SITE_URL } from "../lib/config.js";

export default function sitemap() {
  return ["/", "/produits", "/praticiens"].map((path) => ({ url: `${SITE_URL}${path}` }));
}
