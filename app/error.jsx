"use client";

export default function ErrorPage({ reset }) {
  return <section className="section not-found" role="alert"><p className="eyebrow">WARAKA</p><h1>Cette page est momentanément indisponible.</h1><p>Vous pouvez réessayer dans quelques instants.</p><button className="button button-primary" type="button" onClick={reset}>Réessayer</button></section>;
}
