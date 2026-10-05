const WHATSAPP_NUMBER = "237657806397";
let products = (window.WARAKA_PRODUCTS || []).map((product) => ({ ...product, isDemo: true }));
let practitioners = (window.WARAKA_PRACTITIONERS || []).map((person) => ({ ...person, isDemo: true }));
const dataService = window.WARAKA_DATA;
const productList = document.querySelector("#productList");
const practitionerList = document.querySelector("#practitionerList");
const globalSearch = document.querySelector("#globalSearch");
const cityFilter = document.querySelector("#cityFilter");
const productCount = document.querySelector("#productCount");
const productEmpty = document.querySelector("#productEmpty");
const practitionerEmpty = document.querySelector("#practitionerEmpty");
const dialog = document.querySelector("#detailDialog");
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
  const badge = product.isDemo ? "Démonstration" : product.isFeatured ? "Mis en avant par WARAKA" : "Référencement validé";
  return `
    <article class="directory-card">
      <div class="card-media">
        <img src="${escapeHTML(product.image || "assets/waraka-apercu.jpg")}" alt="${escapeHTML(product.imageAlt || product.name)}" loading="lazy" />
        <span class="demo-badge">${escapeHTML(badge)}</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span>${escapeHTML(product.categoryLabel)}</span><span>${product.isDemo ? "Information indicative" : "Fiche documentaire"}</span></div>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        ${product.practitionerName ? `<p class="product-practitioner">Proposé par ${escapeHTML(product.practitionerName)}</p>` : ""}
        <button class="text-button" type="button" data-detail-type="product" data-detail-id="${escapeHTML(product.id)}">Consulter la fiche <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
}

function practitionerCard(person) {
  return `
    <article class="directory-card practitioner-card">
      <div class="card-media practitioner-media">
        <img src="${escapeHTML(person.image || "assets/waraka-apercu.jpg")}" alt="${escapeHTML(person.imageAlt || person.name)}" loading="lazy" />
        <span class="demo-badge">${person.isDemo ? "Profil fictif" : "Profil publié"}</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span>${escapeHTML(person.city)}</span><span>${person.isDemo ? "À vérifier" : "Référencé par WARAKA"}</span></div>
        <h3>${escapeHTML(person.name)}</h3>
        <p>${escapeHTML(person.specialty)}</p>
        <button class="text-button" type="button" data-detail-type="practitioner" data-detail-id="${escapeHTML(person.id)}">Voir le profil <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
}

function updateCityOptions() {
  const selected = cityFilter.value;
  const cities = [...new Set(practitioners.map((person) => person.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
  cityFilter.innerHTML = '<option value="all">Toutes les villes</option>' + cities
    .map((city) => `<option value="${escapeHTML(city)}">${escapeHTML(city)}</option>`).join("");
  cityFilter.value = cities.includes(selected) ? selected : "all";
}

function render() {
  const query = normalize(globalSearch.value);
  const selectedCity = cityFilter.value;
  const visibleProducts = products.filter((product) => {
    const categoryMatches = activeCategory === "all" || product.category === activeCategory;
    const queryMatches = !query || normalize(`${product.name} ${product.categoryLabel} ${product.description} ${product.practitionerName}`).includes(query);
    return categoryMatches && queryMatches;
  });
  const visiblePractitioners = practitioners.filter((person) => {
    const cityMatches = selectedCity === "all" || person.city === selectedCity;
    const queryMatches = !query || normalize(`${person.name} ${person.specialty} ${person.city} ${person.region}`).includes(query);
    return cityMatches && queryMatches;
  });
  productList.innerHTML = visibleProducts.map(productCard).join("");
  practitionerList.innerHTML = visiblePractitioners.map(practitionerCard).join("");
  productCount.textContent = `${visibleProducts.length} fiche${visibleProducts.length === 1 ? "" : "s"}`;
  productEmpty.hidden = visibleProducts.length > 0;
  practitionerEmpty.hidden = visiblePractitioners.length > 0;
}

function openDetails(type, id) {
  const collection = type === "product" ? products : practitioners;
  const entry = collection.find((item) => item.id === id);
  if (!entry) return;
  const isProduct = type === "product";
  const isDemo = Boolean(entry.isDemo);
  const title = isProduct ? "FICHE PRODUIT" : "PROFIL PRATICIEN";
  const summary = isProduct ? entry.categoryLabel : `${entry.specialty} · ${entry.city}`;
  const image = entry.image || "assets/waraka-apercu.jpg";
  dialogContent.innerHTML = `
    <img class="dialog-image" src="${escapeHTML(image)}" alt="${escapeHTML(entry.imageAlt || entry.name)}" />
    <p class="eyebrow">${title} · ${isDemo ? "DÉMONSTRATION" : "WARAKA"}</p>
    <h2 id="dialogTitle">${escapeHTML(entry.name)}</h2>
    <p class="dialog-summary">${escapeHTML(summary)}${isProduct && entry.practitionerName ? ` · ${escapeHTML(entry.practitionerName)}` : ""}</p>
    <p>${escapeHTML(entry.details || "")}</p>
    <p class="dialog-disclaimer">Cette fiche documentaire ne constitue ni une certification ni une recommandation médicale.</p>`;
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

function submitSearch() {
  render();
  document.querySelector("#produits").scrollIntoView({ behavior: "smooth", block: "start" });
}
document.querySelector("#searchButton").addEventListener("click", submitSearch);
globalSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitSearch();
  }
});
globalSearch.addEventListener("input", render);
cityFilter.addEventListener("change", render);
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-detail-type]");
  if (trigger) openDetails(trigger.dataset.detailType, trigger.dataset.detailId);
});
document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("#contactWhatsapp").href =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour Waraka, j'ai une question au sujet des produits ou des praticiens référencés.")}`;

async function loadHomeCatalog() {
  if (!dataService?.isConfigured()) {
    updateCityOptions();
    render();
    return;
  }
  document.querySelector("#productIntroNote").textContent = "Consultez les fiches produits publiées et leur statut documentaire.";
  document.querySelector("#practitionerIntroNote").textContent = "Découvrez les profils publiés et les informations professionnelles communiquées à WARAKA.";
  document.querySelector("#footerDemoDisclaimer").textContent = "Les contenus publiés par WARAKA ne constituent pas des recommandations de santé.";
  const results = await Promise.allSettled([dataService.listProducts(), dataService.listPractitioners()]);
  if (results[0].status === "fulfilled") products = results[0].value;
  else {
    console.error("Impossible de charger les produits WARAKA.", results[0].reason);
    products = [];
  }
  if (results[1].status === "fulfilled") practitioners = results[1].value;
  else {
    console.error("Impossible de charger les praticiens WARAKA.", results[1].reason);
    practitioners = [];
  }
  updateCityOptions();
  render();
}

loadHomeCatalog();
