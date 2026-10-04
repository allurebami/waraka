const products = window.WARAKA_PRODUCTS;
const searchInput = document.querySelector("#productSearch");
const catalogList = document.querySelector("#catalogList");
const catalogCount = document.querySelector("#catalogCount");
const catalogEmpty = document.querySelector("#catalogEmpty");
const dialog = document.querySelector("#productDialog");
const dialogContent = document.querySelector("#dialogContent");
let activeCategory = "all";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
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
        <button class="text-button" type="button" data-product-detail="${escapeHTML(product.id)}">Consulter la fiche <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
}

function render() {
  const query = normalize(searchInput.value);
  const visible = products.filter((product) => {
    const categoryMatches = activeCategory === "all" || product.category === activeCategory;
    const queryMatches = !query || normalize(`${product.name} ${product.categoryLabel} ${product.description}`).includes(query);
    return categoryMatches && queryMatches;
  });
  catalogList.innerHTML = visible.map(productCard).join("");
  catalogCount.textContent = `${visible.length} fiche${visible.length === 1 ? "" : "s"}`;
  catalogEmpty.hidden = visible.length > 0;
}

function openDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  dialogContent.innerHTML = `
    <img class="dialog-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.imageAlt)}" />
    <p class="eyebrow">FICHE PRODUIT · DÉMONSTRATION</p>
    <h2 id="dialogTitle">${escapeHTML(product.name)}</h2>
    <p class="dialog-summary">${escapeHTML(product.categoryLabel)}</p>
    <p>${escapeHTML(product.details)}</p>
    <p class="dialog-disclaimer">Exemple fictif. Cette fiche n’atteste pas l’efficacité du produit et ne constitue pas un conseil de santé.</p>`;
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
render();
