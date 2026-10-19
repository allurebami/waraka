"use client";

import { useEffect, useRef } from "react";
import { CatalogImage } from "./CatalogCards.jsx";

export default function DetailDialog({ selected, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    if (selected && !element.open) element.showModal();
  }, [selected]);

  const { type, entry } = selected;
  const isProduct = type === "product";
  return (
    <dialog className="detail-dialog" ref={dialog} aria-labelledby="dialogTitle" onClose={onClose} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
    }}>
      <button className="dialog-close" type="button" aria-label="Fermer la fiche" onClick={() => dialog.current.close()}>×</button>
      <CatalogImage className="dialog-image" src={entry.image} alt={entry.imageAlt || entry.name} loading="eager" />
      <p className="eyebrow">{isProduct ? "FICHE PRODUIT" : "PROFIL PRATICIEN"} · {entry.isDemo ? "DÉMONSTRATION" : "WARAKA"}</p>
      <h2 id="dialogTitle">{entry.name}</h2>
      <p className="dialog-summary">{isProduct ? entry.categoryLabel : `${entry.specialty} · ${entry.city}`}{isProduct && entry.practitionerName ? ` · ${entry.practitionerName}` : ""}</p>
      <p>{entry.details}</p>
      <p className="dialog-disclaimer">Cette fiche documentaire ne constitue ni une certification d’efficacité ni une recommandation médicale.</p>
    </dialog>
  );
}
