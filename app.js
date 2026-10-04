const WHATSAPP_NUMBER = "237657806397";

const products = window.WARAKA_PRODUCTS;

const practitioners = window.WARAKA_PRACTITIONERS;

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
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function productCard(product) {
  return `
    <article class="directory-card">
      <div class="card-media">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.imageAlt)}" loading="lazy" />
        <span class="demo-badge">Démonstration</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span>${escapeHTML(product.categoryLabel)}</span><span>Information indicative</span></div>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <button class="text-button" type="button" data-detail-type="product" data-detail-id="${escapeHTML(product.id)}">Consulter la fiche <span aria-hidden="true">→</span></button>
      </div>
    </article>
  `;
}

function practitionerCard(practitioner) {
  return `
    <article class="directory-card practitioner-card">
      <div class="card-media practitioner-media">
        <img src="${escapeHTML(practitioner.image)}" alt="${escapeHTML(practitioner.imageAlt)}" loading="lazy" />
        <span class="demo-badge">Profil fictif</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span>${escapeHTML(practitioner.city)}</span><span>À vérifier</span></div>
        <h3>${escapeHTML(practitioner.name)}</h3>
        <p>${escapeHTML(practitioner.specialty)}</p>
        <button class="text-button" type="button" data-detail-type="practitioner" data-detail-id="${escapeHTML(practitioner.id)}">Voir le profil <span aria-hidden="true">→</span></button>
      </div>
    </article>
  `;
}

function render() {
  const query = normalize(globalSearch.value);
  const selectedCity = cityFilter.value;

  const visibleProducts = products.filter((product) => {
    const categoryMatches = activeCategory === "all" || product.category === activeCategory;
    const queryMatches = !query || normalize(`${product.name} ${product.categoryLabel} ${product.description}`).includes(query);
    return categoryMatches && queryMatches;
  });

  const visiblePractitioners = practitioners.filter((practitioner) => {
    const cityMatches = selectedCity === "all" || practitioner.city === selectedCity;
    const queryMatches = !query || normalize(`${practitioner.name} ${practitioner.specialty} ${practitioner.city}`).includes(query);
    return cityMatches && queryMatches;
  });

  productList.innerHTML = visibleProducts.map(productCard).join("");
  practitionerList.innerHTML = visiblePractitioners.map(practitionerCard).join("");
  productCount.textContent = `${visibleProducts.length} exemple${visibleProducts.length === 1 ? "" : "s"}`;
  productEmpty.hidden = visibleProducts.length > 0;
  practitionerEmpty.hidden = visiblePractitioners.length > 0;
}

function openDetails(type, id) {
  const collection = type === "product" ? products : practitioners;
  const entry = collection.find((item) => item.id === id);
  if (!entry) return;

  const isProduct = type === "product";
  dialogContent.innerHTML = `
    <img class="dialog-image" src="${escapeHTML(entry.image)}" alt="${escapeHTML(entry.imageAlt)}" />
    <p class="eyebrow">${isProduct ? "FICHE PRODUIT" : "PROFIL PRATICIEN"} · DÉMONSTRATION</p>
    <h2 id="dialogTitle">${escapeHTML(entry.name)}</h2>
    <p class="dialog-summary">${escapeHTML(isProduct ? entry.categoryLabel : `${entry.specialty} · ${entry.city}`)}</p>
    <p>${escapeHTML(entry.details)}</p>
    <p class="dialog-disclaimer">Exemple fictif. Cette fiche n’atteste ni l’efficacité d’un produit ni la qualification d’un praticien.</p>
  `;
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

document.querySelector("#searchButton").addEventListener("click", () => {
  render();
  document.querySelector("#produits").scrollIntoView({ behavior: "smooth", block: "start" });
});

globalSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    render();
    document.querySelector("#produits").scrollIntoView({ behavior: "smooth", block: "start" });
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

render();
