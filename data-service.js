(function () {
  const config = window.WARAKA_SUPABASE_CONFIG || {};
  const baseUrl = String(config.url || "").trim().replace(/\/$/, "");
  const publishableKey = String(config.publishableKey || "").trim();

  function isConfigured() {
    return Boolean(baseUrl && publishableKey);
  }

  async function select(table, query) {
    const url = `${baseUrl}/rest/v1/${table}?${query}`;
    const response = await fetch(url, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Supabase (${response.status}): ${detail || response.statusText}`);
    }
    return response.json();
  }

  const categoryLabels = {
    preparation: "Préparation",
    huile: "Huile végétale",
    plante: "Produit botanique",
    autre: "Autre produit",
  };

  window.WARAKA_DATA = Object.freeze({
    isConfigured,
    async listProducts() {
      const rows = await select(
        "products",
        "select=id,slug,name,category,description,details,image_url,image_alt,is_featured,practitioners(name)&status=eq.approved&order=is_featured.desc,created_at.desc",
      );
      return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        category: row.category,
        categoryLabel: categoryLabels[row.category] || categoryLabels.autre,
        description: row.description || "",
        details: row.details || row.description || "",
        image: row.image_url || "",
        imageAlt: row.image_alt || `Image de ${row.name}`,
        practitionerName: row.practitioners?.name || "",
        isFeatured: Boolean(row.is_featured),
        isDemo: false,
      }));
    },
    async listPractitioners() {
      const rows = await select(
        "practitioners",
        "select=id,slug,name,specialty,city,region,bio,image_url,image_alt&publication_status=eq.published&order=name.asc",
      );
      return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        specialty: row.specialty || "Pratique traditionnelle déclarée",
        city: row.city || "",
        region: row.region || "",
        image: row.image_url || "",
        imageAlt: row.image_alt || `Portrait de ${row.name}`,
        details: row.bio || "",
        isDemo: false,
      }));
    },
  });
})();
