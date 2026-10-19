export const categories = [
  { value: "all", label: "Tout" },
  { value: "preparation", label: "Préparations" },
  { value: "huile", label: "Huiles" },
  { value: "plante", label: "Produits botaniques" },
  { value: "autre", label: "Autres produits" },
];

const categoryLabels = {
  preparation: "Préparation",
  huile: "Huile végétale",
  plante: "Produit botanique",
  autre: "Autre produit",
};

export function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
}

export function filterProducts(products, query = "", category = "all") {
  const term = normalize(query);
  return products.filter((product) =>
    (category === "all" || product.category === category) &&
    (!term || normalize([product.name, product.categoryLabel, product.description, product.practitionerName].join(" ")).includes(term)),
  );
}

export function filterPractitioners(practitioners, query = "", city = "all") {
  const term = normalize(query);
  return practitioners.filter((person) =>
    (city === "all" || person.city === city) &&
    (!term || normalize([person.name, person.specialty, person.city, person.region].join(" ")).includes(term)),
  );
}

export function practitionerCities(practitioners) {
  return [...new Set(practitioners.map((person) => person.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
}

export function mapProduct(row) {
  return {
    id: String(row.id), slug: String(row.slug || row.id), name: String(row.name || ""),
    category: String(row.category || "autre"),
    categoryLabel: categoryLabels[row.category] || categoryLabels.autre,
    description: String(row.description || ""), details: String(row.details || row.description || ""),
    image: String(row.image_url || ""), imageAlt: String(row.image_alt || `Image de ${row.name}`),
    practitionerName: String(row.practitioners?.name || ""),
    isFeatured: Boolean(row.is_featured), isDemo: false,
  };
}

export function mapPractitioner(row) {
  return {
    id: String(row.id), slug: String(row.slug || row.id), name: String(row.name || ""),
    specialty: String(row.specialty || "Pratique traditionnelle déclarée"),
    city: String(row.city || ""), region: String(row.region || ""),
    image: String(row.image_url || ""), imageAlt: String(row.image_alt || `Portrait de ${row.name}`),
    details: String(row.bio || ""), isDemo: false,
  };
}

export function productBadge(product) {
  return product.isDemo ? "Démonstration" : product.isFeatured ? "Mis en avant par WARAKA" : "Référencement validé";
}

export function safeImageSource(value) {
  if (typeof value !== "string" || !value.trim()) return "/assets/waraka-apercu.jpg";
  if (value.startsWith("/assets/") || value.startsWith("assets/")) return `/${value.replace(/^\//, "")}`;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch { /* Use the local fallback for invalid image URLs. */ }
  return "/assets/waraka-apercu.jpg";
}
