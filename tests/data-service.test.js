import test from "node:test";
import assert from "node:assert/strict";
import { createCatalogService } from "../lib/data-service.js";

const config = { url: "https://catalogue.example/", publishableKey: "sb_publishable_test" };

test("public products request only approved records and preserve their responsible practitioner", async () => {
  const service = createCatalogService(config, async (url, options) => {
    const request = new URL(url);
    assert.equal(request.pathname, "/rest/v1/products");
    assert.equal(request.searchParams.get("status"), "eq.approved");
    assert.equal(options.headers.apikey, config.publishableKey);
    assert.equal(options.cache, "no-store");
    return Response.json([{ id: "p1", name: "Produit", category: "huile", practitioners: { name: "Équipe" }, is_featured: true }]);
  });
  const result = await service.products();
  assert.equal(result.entries[0].practitionerName, "Équipe");
  assert.equal(result.entries[0].isDemo, false);
  assert.equal(result.entries[0].isFeatured, true);
  assert.equal(result.source, "live");
});
test("public practitioner requests remain restricted to published profiles", async () => {
  const service = createCatalogService(config, async (url) => {
    assert.equal(new URL(url).searchParams.get("publication_status"), "eq.published");
    return Response.json([{ id: "person", name: "Anne", city: "Douala", bio: "Informations déclarées" }]);
  });
  const result = await service.practitioners();
  assert.equal(result.entries[0].details, "Informations déclarées");
  assert.equal(result.entries[0].isDemo, false);
});
test("an empty published catalogue stays empty instead of displaying fictitious entries", async () => {
  const result = await createCatalogService(config, async () => Response.json([])).products();
  assert.deepEqual(result, { entries: [], source: "live", error: null });
});
test("an HTTP failure never replaces the live catalogue with demonstration profiles", async () => {
  const result = await createCatalogService(config, async () => new Response("error", { status: 503 })).practitioners();
  assert.deepEqual(result.entries, []);
  assert.equal(result.source, "live");
  assert.equal(result.error, "unavailable");
});
test("invalid API payloads produce a recoverable unavailable state", async () => {
  const result = await createCatalogService(config, async () => Response.json({ message: "invalid" })).products();
  assert.equal(result.error, "unavailable");
  assert.deepEqual(result.entries, []);
});
test("one unavailable directory does not hide the other directory", async () => {
  const service = createCatalogService(config, async (url) => {
    if (url.includes("/products?")) throw new TypeError("Network failure");
    return Response.json([{ id: "p1", name: "Anne" }]);
  });
  const [products, practitioners] = await Promise.all([service.products(), service.practitioners()]);
  assert.equal(products.error, "unavailable");
  assert.equal(practitioners.entries.length, 1);
});
test("an incomplete configuration is not silently treated as demonstration mode", async () => {
  const result = await createCatalogService({ url: config.url }, () => { throw Error("Should not fetch"); }).products();
  assert.equal(result.error, "configuration");
  assert.deepEqual(result.entries, []);
});
test("explicit unconfigured/demo mode labels every fictitious record", async () => {
  const service = createCatalogService({}, () => { throw Error("Should not fetch"); });
  for (const result of await Promise.all([service.products(), service.practitioners()])) {
    assert.equal(result.source, "demo");
    assert.ok(result.entries.length > 0);
    assert.ok(result.entries.every((entry) => entry.isDemo));
  }
});
