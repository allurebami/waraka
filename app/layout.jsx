import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { SITE_URL } from "../lib/config.js";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "WARAKA",
  icons: {
    icon: { url: "/assets/waraka-symbol-v1.png", type: "image/png" },
    apple: "/assets/waraka-symbol-v1.png",
  },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#174b38" };

export default function RootLayout({ children }) {
  return <html lang="fr">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet" />
    </head>
    <body><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></body>
  </html>;
}
