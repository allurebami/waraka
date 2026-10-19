import { categories } from "./catalog.js";

export function readFilters(params = {}) {
  const first = (value) => typeof value === "string" ? value : Array.isArray(value) ? value[0] || "" : "";
  const category = first(params.categorie);
  return {
    initialQuery: first(params.q).slice(0, 300),
    initialCategory: categories.some((item) => item.value === category) ? category : "all",
    initialCity: first(params.ville) || "all",
  };
}
