import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";

// Isolated fixtures: this test never writes to or depends on the real catalogue.
const requests = [];
let productMode = "live";
const products = [
  { id: "oil", name: "Huile végétale témoin", category: "huile", description: "<script>alert('unsafe')</script>", practitioners: { name: "Équipe témoin" } },
  { id: "plant", name: "Préparation témoin", category: "preparation", description: "Fiche de contrôle" },
];
const practitioners = [
  { id: "douala", name: "Profil Douala témoin", city: "Douala", specialty: "Botanique" },
  { id: "bafoussam", name: "Profil Bafoussam témoin", city: "Bafoussam", specialty: "Pratique traditionnelle" },
];
const api = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  requests.push({ path: url.pathname, query: url.searchParams, key: request.headers.apikey });
  response.setHeader("Content-Type", "application/json");
  if (request.headers.apikey !== "sb_publishable_fixture") {
    response.writeHead(401).end('{}');
  } else if (url.pathname.endsWith("/products")) {
    if (productMode === "error") response.writeHead(503).end('{}');
    else response.end(JSON.stringify(productMode === "empty" ? [] : products));
  } else if (url.pathname.endsWith("/practitioners")) {
    response.end(JSON.stringify(practitioners));
  } else response.writeHead(404).end('{}');
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const apiPort = api.address().port;

const portReservation = createServer();
portReservation.listen(0, "127.0.0.1");
await once(portReservation, "listening");
const appPort = portReservation.address().port;
await new Promise((resolve) => portReservation.close(resolve));

const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(appPort)], {
  env: { ...process.env, SUPABASE_URL: `http://127.0.0.1:${apiPort}`, SUPABASE_PUBLISHABLE_KEY: "sb_publishable_fixture", WARAKA_DEMO_MODE: "0", NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let logs = "";
app.stderr.on("data", (chunk) => { logs += chunk; });
app.stdout.on("data", (chunk) => { logs += chunk; });
const origin = `http://127.0.0.1:${appPort}`;
const checks = [];
async function page(path) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  return response.text();
}

try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Next.js startup timed out: ${logs}`)), 20000);
    app.stdout.on("data", (chunk) => { if (String(chunk).includes("Ready")) { clearTimeout(timeout); resolve(); } });
    app.once("exit", (code) => { clearTimeout(timeout); reject(new Error(`Next.js exited (${code}): ${logs}`)); });
    app.once("error", reject);
  });

  for (const [path, destination] of [["/index.html", "/"], ["/produits.html?utm_source=whatsapp", "/produits?utm_source=whatsapp"], ["/praticiens.html?ville=Douala", "/praticiens?ville=Douala"]]) {
    const response = await fetch(origin + path, { redirect: "manual" });
    assert.equal(response.status, 308, path);
    assert.equal(response.headers.get("location"), destination);
    checks.push(`Legacy redirect ${path}`);
  }

  const home = await page("/");
  assert.ok(home.includes("Huile végétale témoin"));
  assert.ok(home.includes("Profil Douala témoin"));
  assert.ok(home.includes('id="contact"'));
  assert.ok(home.includes('https://wa.me/237657806397'));
  checks.push("Home renders both live catalogues on the server");

  const productPage = await page("/produits");
  assert.ok(productPage.includes('<h3>Huile végétale témoin</h3>'));
  assert.ok(productPage.includes('&lt;script&gt;'));
  assert.ok(!productPage.includes("<script>alert('unsafe')</script>"));
  assert.ok(productPage.includes('rel="canonical" href="https://waraka-bea6.vercel.app/produits"'));
  assert.ok(productPage.includes('property="og:image"'));
  checks.push("Product SSR, escaped catalogue text, canonical and social metadata");

  const filteredProducts = await page("/produits?q=VEGETALE&categorie=huile");
  assert.ok(filteredProducts.includes('<h3>Huile végétale témoin</h3>'));
  assert.ok(!filteredProducts.includes('<h3>Préparation témoin</h3>'));
  checks.push("Shared product filters work before hydration");

  const filteredPeople = await page("/praticiens?ville=Bafoussam");
  assert.ok(filteredPeople.includes('<h3>Profil Bafoussam témoin</h3>'));
  assert.ok(!filteredPeople.includes('<h3>Profil Douala témoin</h3>'));
  checks.push("Shared practitioner city filter and dynamic cities");

  productMode = "empty";
  const emptyProducts = await page("/produits");
  assert.ok(emptyProducts.includes("Aucun produit publié pour le moment."));
  assert.ok(!emptyProducts.includes("Exemple de fiche"));
  checks.push("An empty live catalogue stays empty");

  productMode = "error";
  const failedProducts = await page("/produits");
  assert.ok(failedProducts.includes("Impossible de charger"));
  assert.ok(failedProducts.includes("Réessayer"));
  const partialHome = await page("/");
  assert.ok(partialHome.includes('<h3>Profil Douala témoin</h3>'));
  assert.ok(!partialHome.includes('<h3>Huile végétale témoin</h3>'));
  checks.push("API outages expose retry and preserve the other directory");

  for (const path of ["/assets/favicon.svg", "/assets/waraka-apercu.jpg", "/assets/apple-touch-icon.png", "/robots.txt", "/sitemap.xml"]) {
    assert.equal((await fetch(origin + path)).status, 200, path);
  }
  assert.equal((await fetch(origin + "/page-absente")).status, 404);
  checks.push("Brand assets, robots, sitemap and 404");

  assert.ok(requests.some((request) => request.path.endsWith("/products") && request.query.get("status") === "eq.approved"));
  assert.ok(requests.some((request) => request.path.endsWith("/practitioners") && request.query.get("publication_status") === "eq.published"));
  assert.ok(requests.every((request) => request.key === "sb_publishable_fixture"));
  checks.push("Server requests respect public catalogue access and publication filters");

  for (const check of checks) console.log(`PASS ${check}`);
  console.log(`${checks.length} HTTP integration checks passed.`);
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  const exited = app.exitCode !== null ? Promise.resolve() : once(app, "exit");
  app.kill("SIGTERM");
  await exited;
  await new Promise((resolve) => api.close(resolve));
}
