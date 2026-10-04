const WHATSAPP_NUMBER = "237657806397";

const products = [
  {
    title: "Pack anniversaire 20 personnes",
    category: "pack",
    budget: "standard",
    price: "A partir de 35 000 FCFA",
    description: "Mini buffet, boissons, amuse-bouches et option gateau selon le besoin.",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Buffet prepare pour une celebration",
  },
  {
    title: "Gateau personnalise",
    category: "patisserie",
    budget: "standard",
    price: "A partir de 12 000 FCFA",
    description: "Gateau pour anniversaire, ceremonie, entreprise ou surprise familiale.",
    status: "Sur commande",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Gateau d'anniversaire decore",
  },
  {
    title: "Plateaux repas entreprise",
    category: "repas",
    budget: "premium",
    price: "A partir de 2 500 FCFA / personne",
    description: "Formule pratique pour reunions, formations, seminaires et dejeuners professionnels.",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Repas compose de legumes frais et d'accompagnements",
  },
  {
    title: "Jus naturels assortis",
    category: "boisson",
    budget: "eco",
    price: "A partir de 1 000 FCFA / bouteille",
    description: "Bissap, gingembre, cocktail, baobab et jus de fruits selon disponibilite.",
    status: "Disponible",
    image: "https://buyam.co/storage/products/medium_38a76cf8-8ec5-4b93-ac3e-e90fc944fa79.png",
    imageAlt: "Bouteille de jus naturel de bissap",
  },
  {
    title: "Buffet traditionnel",
    category: "repas",
    budget: "premium",
    price: "Sur devis",
    description: "Selection de plats camerounais pour receptions, mariages et ceremonies.",
    status: "Traiteur requis",
    image: "https://camerounactuel.com/wp-content/uploads/2024/05/Ndole-1_jpg2.jpeg",
    imageAlt: "Plat camerounais de ndole servi avec des accompagnements",
  },
  {
    title: "Pack petit dejeuner",
    category: "pack",
    budget: "eco",
    price: "A partir de 1 500 FCFA / personne",
    description: "Viennoiseries, boisson chaude, jus et accompagnements pour equipe ou evenement.",
    status: "Sur commande",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Pain et viennoiseries pour un petit-dejeuner",
  },
];

const caterers = [
  {
    name: "Maison Saveurs",
    specialty: "Buffets et plats traditionnels",
    zone: "Douala",
    level: "Standard",
    verified: true,
    image: "https://camerounactuel.com/wp-content/uploads/2024/05/Ndole-1_jpg2.jpeg",
    imageAlt: "Specialite camerounaise preparee par Maison Saveurs",
  },
  {
    name: "Deli Cake Studio",
    specialty: "Patisserie et gateaux personnalises",
    zone: "Douala / Bonamoussadi",
    level: "Premium",
    verified: true,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Gateau de patisserie personnalise",
  },
  {
    name: "Event Food Pro",
    specialty: "Plateaux repas et evenements corporate",
    zone: "Douala / Akwa",
    level: "Premium",
    verified: true,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Equipe de traiteur preparant un buffet evenementiel",
  },
];

const categoryLabels = {
  all: "Tous les produits",
  repas: "Repas prepares",
  patisserie: "Patisserie",
  boisson: "Boissons",
  pack: "Packs evenementiels",
};

const productList = document.querySelector("#productList");
const catererList = document.querySelector("#catererList");
const resultTitle = document.querySelector("#resultTitle");
const resultCount = document.querySelector("#resultCount");
const chips = document.querySelectorAll(".chip");
const categoryFilter = document.querySelector("#categoryFilter");
const budgetFilter = document.querySelector("#budgetFilter");
const textFilter = document.querySelector("#textFilter");
const quickSearch = document.querySelector("#quickSearch");
const quoteForm = document.querySelector("#quoteForm");

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderProducts(category = "all", budget = "all", text = "") {
  const normalizedText = text.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const categoryMatch = category === "all" || product.category === category;
    const budgetMatch = budget === "all" || product.budget === budget;
    const textMatch =
      !normalizedText ||
      product.title.toLowerCase().includes(normalizedText) ||
      product.description.toLowerCase().includes(normalizedText);

    return categoryMatch && budgetMatch && textMatch;
  });

  resultTitle.textContent = categoryLabels[category] || "Resultats";
  resultCount.textContent = `${filtered.length} offre${filtered.length > 1 ? "s" : ""}`;

  if (!filtered.length) {
    productList.innerHTML = `
      <article class="product-card">
        <div>
          <span class="tag">Aucun resultat</span>
          <h3>Aucune offre ne correspond a cette recherche.</h3>
          <p class="card-description">Essaie une autre categorie ou demande une offre personnalisee sur WhatsApp.</p>
        </div>
        <div class="card-actions">
          <a class="btn primary" href="${whatsappLink("Bonjour, je veux une offre personnalisee sur Waraka.")}" target="_blank" rel="noreferrer">Demander une offre</a>
        </div>
      </article>
    `;
    return;
  }

  productList.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <img class="card-image" src="${product.image}" alt="${product.imageAlt}" loading="lazy" />
          <div>
            <div class="tag-row">
              <span class="tag">${categoryLabels[product.category]}</span>
              <span class="tag green">${product.status}</span>
            </div>
            <h3>${product.title}</h3>
            <p class="card-description">${product.description}</p>
            <p class="card-price">${product.price}</p>
          </div>
          <div class="card-actions">
            <a class="btn primary" href="${whatsappLink(`Bonjour, je veux commander: ${product.title}.`)}" target="_blank" rel="noreferrer">Commander</a>
            <a class="btn secondary" href="${whatsappLink(`Bonjour, je veux plus d'informations sur: ${product.title}.`)}" target="_blank" rel="noreferrer">Details</a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCaterers() {
  catererList.innerHTML = caterers
    .map(
      (caterer) => `
        <article class="caterer-card">
          <img class="card-image" src="${caterer.image}" alt="${caterer.imageAlt}" loading="lazy" />
          <div>
            <div class="tag-row">
              <span class="tag green">Certifie</span>
              <span class="tag">${caterer.level}</span>
            </div>
            <h3>${caterer.name}</h3>
            <p class="caterer-meta">${caterer.specialty}</p>
            <p class="caterer-meta">Zone: ${caterer.zone}</p>
          </div>
          <div class="card-actions">
            <a class="btn primary" href="${whatsappLink(`Bonjour, je veux contacter le traiteur ${caterer.name} sur Waraka.`)}" target="_blank" rel="noreferrer">Contacter</a>
          </div>
        </article>
      `
    )
    .join("");
}

function setActiveCategory(category) {
  chips.forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.category === category);
  });
  categoryFilter.value = category;
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const category = chip.dataset.category;
    setActiveCategory(category);
    renderProducts(category, budgetFilter.value, textFilter.value);
  });
});

quickSearch.addEventListener("submit", (event) => {
  event.preventDefault();
  setActiveCategory(categoryFilter.value);
  renderProducts(categoryFilter.value, budgetFilter.value, textFilter.value);
  document.querySelector("#produits").scrollIntoView({ behavior: "smooth" });
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const need = document.querySelector("#quoteNeed").value;
  const people = document.querySelector("#quotePeople").value;
  const date = document.querySelector("#quoteDate").value || "date a confirmer";
  const details = document.querySelector("#quoteDetails").value || "aucun detail ajoute";
  const message = `Bonjour, je veux un devis Waraka.
Type: ${need}
Nombre de personnes: ${people}
Date: ${date}
Details: ${details}`;

  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
});

document.querySelector("#heroWhatsapp").href = whatsappLink(
  "Bonjour, je veux commander un produit ou contacter un traiteur certifie sur Waraka."
);
document.querySelector("#contactWhatsapp").href = whatsappLink(
  "Bonjour, je veux ajouter un produit ou devenir traiteur certifie sur Waraka."
);

renderProducts();
renderCaterers();
