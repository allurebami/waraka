const nextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/produits.html", destination: "/produits", permanent: true },
      { source: "/praticiens.html", destination: "/praticiens", permanent: true },
    ];
  },
};

export default nextConfig;
