import test from "node:test";
import assert from "node:assert/strict";
import { filterProducts, filterPractitioners, practitionerCities, productBadge, safeImageSource } from "../lib/catalog.js";
import { readFilters } from "../lib/search-params.js";

const products = [
  { id: "oil", name: "Huile végétale", category: "huile", categoryLabel: "Huile végétale", description: "Fiche publiée", practitionerName: "Équipe de Douala" },
  { id: "plant", name: "Préparation botanique", category: "preparation", description: "Produit documenté" },
];
const people = [
  { id: "a", name: "Anne", city: "Yaoundé", specialty: "Pratique traditionnelle", region: "Centre" },
  { id: "b", name: "Paul", city: "Douala", specialty: "Botanique", region: "Littoral" },
  { id: "c", name: "Marie", city: "Douala", specialty: "Pratique déclarée", region: "Littoral" },
];

test("product searches ignore accents, case and surrounding spaces", () => {
  assert.deepEqual(filterProducts(products, "  HUILE VEGETALE ").map((p) => p.id), ["oil"]);
});
test("product categories and search text work together", () => {
  assert.equal(filterProducts(products, "documente", "preparation").length, 1);
  assert.equal(filterProducts(products, "huile", "preparation").length, 0);
});
test("a product can be found by its practitioner's name", () => {
  assert.equal(filterProducts(products, "equipe de douala")[0].id, "oil");
});
test("practitioners can be found by city, specialty and region", () => {
  assert.equal(filterPractitioners(people, "yaounde")[0].id, "a");
  assert.equal(filterPractitioners(people, "botanique", "Douala")[0].id, "b");
  assert.equal(filterPractitioners(people, "centre", "Douala").length, 0);
});
test("city options come from live records without duplicates", () => {
  assert.deepEqual(practitionerCities([...people, { city: "Bafoussam" }, { city: "" }]), ["Bafoussam", "Douala", "Yaoundé"]);
});
test("demonstration data cannot inherit a real publication badge", () => {
  assert.equal(productBadge({ isDemo: true, isFeatured: true }), "Démonstration");
});
test("invalid or executable image URLs fall back to the local image", () => {
  for (const value of ["javascript:alert(1)", "data:image/svg+xml,evil", "not a URL", "", null]) {
    assert.equal(safeImageSource(value), "/assets/waraka-apercu.jpg");
  }
  assert.equal(safeImageSource("assets/favicon.svg"), "/assets/favicon.svg");
  assert.equal(safeImageSource("https://example.com/image.jpg"), "https://example.com/image.jpg");
});
test("shared filter URLs tolerate repeated and invalid parameters", () => {
  assert.deepEqual(readFilters({ q: ["huile", "ignored"], categorie: "unknown", ville: "Douala" }), {
    initialQuery: "huile", initialCategory: "all", initialCity: "Douala",
  });
  assert.equal(readFilters({ q: "x".repeat(500) }).initialQuery.length, 300);
});
