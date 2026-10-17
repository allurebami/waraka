import { supabaseConfig } from "./config.js";
import { createCatalogService } from "./data-service.js";

export const catalogService = createCatalogService(
  process.env.WARAKA_DEMO_MODE === "1" ? { url: "", publishableKey: "" } : supabaseConfig,
);
