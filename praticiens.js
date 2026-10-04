const practitioners = window.WARAKA_PRACTITIONERS;
const searchInput = document.querySelector("#practitionerSearch");
const cityFilter = document.querySelector("#practitionerCity");
const catalog = document.querySelector("#practitionerCatalog");
const count = document.querySelector("#practitionerCount");
const emptyState = document.querySelector("#practitionerCatalogEmpty");
const dialog = document.querySelector("#practitionerDialog");
const dialogContent = document.querySelector("#practitionerDialogContent");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
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
        <button class="text-button" type="button" data-practitioner-detail="${escapeHTML(practitioner.id)}">Voir le profil <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
}

function render() {
  const query = normalize(searchInput.value);
  const selectedCity = cityFilter.value;
  const visible = practitioners.filter((person) => {
    const cityMatches = selectedCity === "all" || person.city === selectedCity;
    const queryMatches = !query || normalize(`${person.name} ${person.specialty} ${person.city}`).includes(query);
    return cityMatches && queryMatches;
  });
  catalog.innerHTML = visible.map(practitionerCard).join("");
  count.textContent = `${visible.length} profil${visible.length === 1 ? "" : "s"}`;
  emptyState.hidden = visible.length > 0;
}

function openDetails(id) {
  const person = practitioners.find((entry) => entry.id === id);
  if (!person) return;
  dialogContent.innerHTML = `
    <img class="dialog-image" src="${escapeHTML(person.image)}" alt="${escapeHTML(person.imageAlt)}" />
    <p class="eyebrow">PROFIL PRATICIEN · DÉMONSTRATION</p>
    <h2 id="dialogTitle">${escapeHTML(person.name)}</h2>
    <p class="dialog-summary">${escapeHTML(person.specialty)} · ${escapeHTML(person.city)}</p>
    <p>${escapeHTML(person.details)}</p>
    <p class="dialog-disclaimer">Profil fictif. Cette fiche ne certifie pas la qualification du praticien et ne constitue pas une recommandation médicale.</p>`;
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
render();
