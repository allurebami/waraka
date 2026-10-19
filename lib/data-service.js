import { mapProduct, mapPractitioner } from "./catalog.js";
import { demoProducts, demoPractitioners } from "./demo-data.js";

const queries = {
  products: "select=id,slug,name,category,description,details,image_url,image_alt,is_featured,practitioners(name)&status=eq.approved&order=is_featured.desc,created_at.desc",
  practitioners: "select=id,slug,name,specialty,city,region,bio,image_url,image_alt&publication_status=eq.published&order=name.asc",
};

export function createCatalogService(config, fetcher = fetch) {
  const baseUrl = String(config.url || "").trim().replace(/\/$/, "");
  const publishableKey = String(config.publishableKey || "").trim();

  async function load(table, mapper, demo) {
    if (!baseUrl && !publishableKey) {
      return { entries: demo.map((entry) => ({ ...entry, isDemo: true })), source: "demo", error: null };
    }
    if (!baseUrl || !publishableKey) {
      return { entries: [], source: "live", error: "configuration" };
    }
    try {
      const headers = { apikey: publishableKey, Accept: "application/json" };
      if (publishableKey.startsWith("eyJ")) headers.Authorization = `Bearer ${publishableKey}`;
      const response = await fetcher(`${baseUrl}/rest/v1/${table}?${queries[table]}`, {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`Catalogue HTTP ${response.status}`);
      const rows = await response.json();
      if (!Array.isArray(rows)) throw new Error("Invalid catalogue response");
      return { entries: rows.map(mapper), source: "live", error: null };
    } catch (error) {
      // Log a useful diagnostic without the API key, response body or personal records.
      console.error(`WARAKA ${table}:`, error instanceof Error ? error.message : "RequestError");
      return { entries: [], source: "live", error: "unavailable" };
    }
  }

  return {
    products: () => load("products", mapProduct, demoProducts),
    practitioners: () => load("practitioners", mapPractitioner, demoPractitioners),
  };
}
