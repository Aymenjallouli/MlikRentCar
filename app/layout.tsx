import type { Metadata } from "next";
import { Anton, Manrope, Instrument_Serif } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const manrope = Manrope({ weight: ["300","400","500","600","700","800"], subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const instrumentSerif = Instrument_Serif({ weight: "400", style: ["normal","italic"], subsets: ["latin"], variable: "--font-serif", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mlikrentcar.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MLIK'A — Location de Voiture Premium en Tunisie",
    template: "%s | MLIK'A Location Voiture Tunisie",
  },
  description:
    "Location de voiture premium en Tunisie. Flotte récente, livraison gratuite à l'aéroport Tunis-Carthage et à domicile, disponible 24h/24. Réservez en ligne en 2 minutes.",
  keywords: [
    "location voiture tunisie",
    "location voiture tunis",
    "rent a car tunisie",
    "location voiture aéroport tunis carthage",
    "location voiture pas cher tunisie",
    "voiture de location tunis",
    "rent car tunis",
    "location auto tunisie",
    "mlika location voiture",
    "mlik'a rent car",
  ],
  authors: [{ name: "Ahmed Mlik", url: SITE_URL }],
  creator: "MLIK'A",
  publisher: "MLIK'A",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "MLIK'A — Location de Voiture Premium en Tunisie",
    description:
      "Flotte récente, livraison gratuite à l'aéroport & domicile, disponible 24h/24. Réservez en ligne.",
    url: SITE_URL,
    siteName: "MLIK'A Location Voiture",
    locale: "fr_TN",
    type: "website",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MLIK'A — Location de Voiture Premium en Tunisie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MLIK'A — Location de Voiture Premium en Tunisie",
    description: "Flotte récente, livraison gratuite, disponible 24h/24. Réservez en ligne.",
    images: ["/assets/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${anton.variable} ${manrope.variable} ${instrumentSerif.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href={SITE_URL} />
        <meta name="geo.region" content="TN" />
        <meta name="geo.placename" content="Tunis, Tunisie" />
      </head>
      <body style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
