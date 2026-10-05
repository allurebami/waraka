let products = [];
const demoProducts = (window.WARAKA_PRODUCTS || []).map((product) => ({ ...product, isDemo: true }));
const dataService = window.WARAKA_DATA;
const searchInput = document.querySelector("#productSearch");
const catalogList = document.querySelector("#catalogList");
const catalogCount = document.querySelector("#catalogCount");
const catalogEmpty = document.querySelector("#catalogEmpty");
const sourceNote = document.querySelector("#catalogSourceNote");
const dialog = document.querySelector("#productDialog");
const dialogContent = document.querySelector("#dialogContent");
let activeCategory = "all";

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function productCard(product) {
  const badge = product.isDemo
    ? "Démonstration"
    : product.isFeatured ? "Mis en avant par WARAKA" : "Référencement validé";
  const image = product.image || "assets/waraka-apercu.jpg";
  return `
    <article class="directory-card">
      <div class="card-media">
        <img src="${escapeHTML(image)}" alt="${escapeHTML(product.imageAlt || product.name)}" loading="lazy" />
        <span class="demo-badge">${escapeHTML(badge)}</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span>${escapeHTML(product.categoryLabel)}</span><span>${product.isDemo ? "Information indicative" : "Fiche documentaire"}</span></div>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        ${product.practitionerName ? `<p class="product-practitioner">Proposé par ${escapeHTML(product.practitionerName)}</p>` : ""}
        <button class="text-button" type="button" data-product-detail="${escapeHTML(product.id)}">Consulter la fiche <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
}

function render() {
  const query = normalize(searchInput.value);
  const visible = products.filter((product) => {
    const categoryMatches = activeCategory === "all" || product.category === activeCategory;
    const queryMatches = !query || normalize(`${product.name} ${product.categoryLabel} ${product.description} ${product.practitionerName}`).includes(query);
    return categoryMatches && queryMatches;
  });
  catalogList.innerHTML = visible.map(productCard).join("");
  catalogCount.textContent = `${visible.length} fiche${visible.length === 1 ? "" : "s"}`;
  catalogEmpty.hidden = visible.length > 0;
  if (!visible.length && dataService?.isConfigured()) {
    catalogEmpty.textContent = "Aucun produit validé ne correspond à cette recherche.";
  }
}

function openDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const isDemo = Boolean(product.isDemo);
  dialogContent.innerHTML = `
    <img class="dialog-image" src="${escapeHTML(product.image || "assets/waraka-apercu.jpg")}" alt="${escapeHTML(product.imageAlt || product.name)}" />
    <p class="eyebrow">FICHE PRODUIT · ${isDemo ? "DÉMONSTRATION" : "RÉFÉRENCEMENT WARAKA"}</p>
    <h2 id="dialogTitle">${escapeHTML(product.name)}</h2>
    <p class="dialog-summary">${escapeHTML(product.categoryLabel)}${product.practitionerName ? ` · ${escapeHTML(product.practitionerName)}` : ""}</p>
    <p>${escapeHTML(product.details)}</p>
    <p class="dialog-disclaimer">Cette fiche documentaire ne constitue ni une certification d’efficacité ni un conseil de santé.</p>`;
  dialog.showModal();
}

document.querySelectorAll("[data-product-category]").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.productCategory;
    document.querySelectorAll("[data-product-category]").forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    render();
  });
});

searchInput.addEventListener("input", render);
document.querySelector("#catalogSearchButton").addEventListener("click", render);
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-product-detail]");
  if (trigger) openDetails(trigger.dataset.productDetail);
});
document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

async function loadProducts() {
  if (!dataService?.isConfigured()) {
    products = demoProducts;
    render();
    return;
  }

  sourceNote.textContent = "Chargement du catalogue WARAKA…";
  catalogEmpty.hidden = true;
  try {
    products = await dataService.listProducts();
    sourceNote.textContent = "Les fiches publiées sont issues du catalogue WARAKA et restent soumises à notre démarche documentaire.";
    render();
  } catch (error) {
    console.error("Impossible de charger le catalogue WARAKA.", error);
    products = [];
    sourceNote.textContent = "Le catalogue est momentanément indisponible. Réessayez dans quelques instants.";
    catalogList.innerHTML = "";
    catalogCount.textContent = "0 fiche";
    catalogEmpty.textContent = "Impossible de charger les produits. Vérifiez la connexion ou réessayez plus tard.";
    catalogEmpty.hidden = false;
  }
}

if (dataService?.isConfigured()) sourceNote.hidden = false;
loadProducts();
