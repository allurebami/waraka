let practitioners = [];
const demoPractitioners = (window.WARAKA_PRACTITIONERS || []).map((person) => ({ ...person, isDemo: true }));
const dataService = window.WARAKA_DATA;
const searchInput = document.querySelector("#practitionerSearch");
const cityFilter = document.querySelector("#practitionerCity");
const catalog = document.querySelector("#practitionerCatalog");
const count = document.querySelector("#practitionerCount");
const emptyState = document.querySelector("#practitionerCatalogEmpty");
const sourceNote = document.querySelector("#practitionerSourceNote");
const dialog = document.querySelector("#practitionerDialog");
const dialogContent = document.querySelector("#practitionerDialogContent");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function practitionerCard(person) {
  const image = person.image || "assets/waraka-apercu.jpg";
  const status = person.isDemo ? "Profil fictif" : "Profil publié";
  return `
    <article class="directory-card practitioner-card">
      <div class="card-media practitioner-media">
        <img src="${escapeHTML(image)}" alt="${escapeHTML(person.imageAlt || person.name)}" loading="lazy" />
        <span class="demo-badge">${status}</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span>${escapeHTML(person.city)}</span><span>${person.isDemo ? "À vérifier" : "Référencé par WARAKA"}</span></div>
        <h3>${escapeHTML(person.name)}</h3>
        <p>${escapeHTML(person.specialty)}</p>
        <button class="text-button" type="button" data-practitioner-detail="${escapeHTML(person.id)}">Voir le profil <span aria-hidden="true">→</span></button>
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
  const query = normalize(searchInput.value);
  const selectedCity = cityFilter.value;
  const visible = practitioners.filter((person) => {
    const cityMatches = selectedCity === "all" || person.city === selectedCity;
    const queryMatches = !query || normalize(`${person.name} ${person.specialty} ${person.city} ${person.region}`).includes(query);
    return cityMatches && queryMatches;
  });
  catalog.innerHTML = visible.map(practitionerCard).join("");
  count.textContent = `${visible.length} profil${visible.length === 1 ? "" : "s"}`;
  emptyState.hidden = visible.length > 0;
}

function openDetails(id) {
  const person = practitioners.find((entry) => entry.id === id);
  if (!person) return;
  const image = person.image || "assets/waraka-apercu.jpg";
  dialogContent.innerHTML = `
    <img class="dialog-image" src="${escapeHTML(image)}" alt="${escapeHTML(person.imageAlt || person.name)}" />
    <p class="eyebrow">PROFIL PRATICIEN · ${person.isDemo ? "DÉMONSTRATION" : "WARAKA"}</p>
    <h2 id="dialogTitle">${escapeHTML(person.name)}</h2>
    <p class="dialog-summary">${escapeHTML(person.specialty)} · ${escapeHTML(person.city)}</p>
    <p>${escapeHTML(person.details || "")}</p>
    <p class="dialog-disclaimer">Le référencement ne vaut pas autorisation d’exercice et ne constitue pas une recommandation médicale.</p>`;
  dialog.showModal();
}

searchInput.addEventListener("input", render);
cityFilter.addEventListener("change", render);
document.querySelector("#practitionerSearchButton").addEventListener("click", render);
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-practitioner-detail]");
  if (trigger) openDetails(trigger.dataset.practitionerDetail);
});
document.querySelector("#practitionerDialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

async function loadPractitioners() {
  if (!dataService?.isConfigured()) {
    practitioners = demoPractitioners;
    updateCityOptions();
    render();
    return;
  }

  sourceNote.hidden = false;
  sourceNote.textContent = "Chargement des profils WARAKA…";
  try {
    practitioners = await dataService.listPractitioners();
    updateCityOptions();
    sourceNote.textContent = "Seuls les profils publiés par WARAKA apparaissent dans cet annuaire.";
    render();
  } catch (error) {
    console.error("Impossible de charger l’annuaire WARAKA.", error);
    practitioners = [];
    catalog.innerHTML = "";
    count.textContent = "0 profil";
    sourceNote.textContent = "L’annuaire est momentanément indisponible. Réessayez dans quelques instants.";
    emptyState.textContent = "Impossible de charger les profils. Vérifiez la connexion ou réessayez plus tard.";
    emptyState.hidden = false;
  }
}

loadPractitioners();
