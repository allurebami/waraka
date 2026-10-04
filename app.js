const WHATSAPP_NUMBER = "237657806397";

const products = [
  {
    id: "preparation-botanique",
    name: "Préparation traditionnelle aux plantes",
    category: "preparation",
    categoryLabel: "Préparation",
    description: "Exemple de fiche. La composition et l’origine restent à confirmer par le responsable.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBcSAtL5qPRge83qgnKT8G42yOqYZO6fuNUlSowrR9Czyu8rHj0VOyzfsOo3RZ_Qx_sYuNY4KSF2aMsXuVtmZkSkksOKRsMkXVq1yjACweVQi51SKVpEgrXlFl8E3TTNfrtVbp8yFI5FiaFjlHFWOYevCNBwATWGHStnD7xyYwzzu8oGRZexLXh9G9_p_hms0ombicOg6S6y7WMfl6h9-neQ5HJ_BSDeltHlLUUU7s1NwQGkhpks0",
    imageAlt: "Composition botanique de démonstration sur fond clair",
    details: "Cette fiche illustre la présentation d’un produit. La composition, le fabricant, les documents et les précautions devront être fournis puis examinés avant publication réelle.",
  },
  {
    id: "huile-vegetale",
    name: "Huile végétale — exemple de fiche",
    category: "huile",
    categoryLabel: "Huile végétale",
    description: "Contenu de démonstration. Aucune propriété thérapeutique n’est attribuée à ce produit.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuDK2ahAc-Zvi5dw6JJQrdKA5hJ8M84lQLzu0AdzpJU3ELjsMQXVNftmjmBsF4jQxNhF9AorrHc9K3FCXkmlE_gvoG8gvd12qr-0Z-I5KTbzQd0VaJ_5MKNWibKZC0M-T6USeI7GBPqK_nfkFZvAgeO2BcMCb_q2fJOct8b4tQMBpOGBX5GJPU6aWwJOFCKzvCWGNz5G0a7IgiVhmsWOOcxMbYWz77DrUkOd0APKMmerd3DqgC7LI",
    imageAlt: "Feuille botanique en gros plan pour une fiche de démonstration",
    details: "Une fiche publiée devra distinguer les informations communiquées par le responsable des documents effectivement consultés par Waraka.",
  },
  {
    id: "produit-botanique",
    name: "Produit botanique documenté",
    category: "plante",
    categoryLabel: "Produit botanique",
    description: "Exemple visuel de catalogue. Les données réelles seront ajoutées après vérification.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-y1_WUdZ50ZtalXgduigZi9GDLmPO6x7iDcLzX2T_c5knXTmQiIevfU7EnWk5t3sfVFfOUx5Ym8GeivQnD271eX1sb_ItbcqdX0zDryKh1R5nWK_WfYaq2K0TxQYqNvoztBplQK8PpGod7xzCq3zjZdaKolZ0RScd2rVf_er29fWSEkewFTqpYbuSc6yNVzql4lOo7nuMCKnO7jciABOrkFI7uwmdcHQA-hoVGQA_joNpZRZyFhM",
    imageAlt: "Écorce et feuilles présentées comme spécimen botanique",
    details: "Le nom botanique, l’origine, le responsable, la composition et les références documentaires sont des champs à compléter pour chaque produit réel.",
  },
];

const practitioners = [
  {
    id: "praticien-demo-01",
    name: "Praticien de démonstration 01",
    specialty: "Pratique traditionnelle déclarée",
    city: "Douala",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMFzpLabMIhLhLmGpuiV6cXOMYza5YnVH1Pn-piMF89fkTtflnr0J42yVRsZUfBcRebfP-DnbEwIS_pdHK65A7GdJMU8MnPlicoU3NIzJ7uIqV_unlLUIy9zRbwhMgu5CtT1PIukhlWyAK62vZypY_PGFH6vhomwmCVVdhAfL3RrZVh4x11O8nWkyxU9sJmCsnf9QraMsjCJyvUPegcA3vPLTfRvDedYJspbIDYrI0wjdeWWR1bPs",
    imageAlt: "Portrait illustratif d’un praticien, profil fictif de démonstration",
    details: "Profil fictif destiné à la maquette. Il ne correspond pas à une personne référencée et n’a fait l’objet d’aucune vérification.",
  },
  {
    id: "praticien-demo-02",
    name: "Praticienne de démonstration 02",
    specialty: "Spécialité à confirmer",
    city: "Yaoundé",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNUnViT-8DXNYjGhySKjOiwXtGBZThBBP4ajG0pFdHdjVmw6OEWZaFbtr9fZV9Qi8hk75RNrygE2guYkbXESxpuDjBZ8iHK12OgRTkenuHiZo3bg2g3QDSQuO9eTQb9CMqYoKL4EaH9TIv7SPQY1X8i6heh9tNX4UpkoAnd_YHR9l_4bfODCdBrqb2UN7ePEdxZQTisb4F-LT_n1MTIpn9xqk9JtNysSpuRtjTD90SxLfCPmxWH7k",
    imageAlt: "Portrait illustratif d’une praticienne, profil fictif de démonstration",
    details: "Profil fictif destiné à la maquette. Les informations de profil et les coordonnées devront être communiquées et validées avant toute publication réelle.",
  },
  {
    id: "praticien-demo-03",
    name: "Praticien de démonstration 03",
    specialty: "Profil documentaire à compléter",
    city: "Douala",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLsYnleUq1sdG5Gjx1qgla9rF5Dfk-OSwa8klbshWJRPj4KZKtmM9xW6X28KbsaNYpcAfAFwNqq1GaGjOEZ7XBvPzq-_TXE3yDoc8PoV77epowTJXigXu6hfrrXYlSw60wyH5GpmWIFMJ8XmCnLQjSVShpOSU6V21UmmOnM-0tEVthhgeAtIVPYHjVnXSiNebM2Bp-ZlGX5tY4UY-0qTwfq_2FIsD2LvOl4z2RKabKzWCZBPhKmls",
    imageAlt: "Portrait illustratif d’un praticien, profil fictif de démonstration",
    details: "Profil fictif destiné à la maquette. Le statut affiché n’est pas une certification ni une recommandation médicale.",
  },
];

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
