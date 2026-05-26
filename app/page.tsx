import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FleetLoader from "@/components/FleetLoader";
import FeaturesSection from "@/components/FeaturesSection";
import ProcessSection from "@/components/ProcessSection";
import PricingStripe from "@/components/PricingStripe";
import ContactSection from "@/components/ContactSection";
import GiantMark from "@/components/GiantMark";
import Footer from "@/components/Footer";
import AIConcierge from "@/components/AIConcierge";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mlikrentcar.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CarRental",
  name: "MLIK'A Location de Voiture",
  alternateName: "MlikRentCar",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/og-image.jpg`,
  image: `${SITE_URL}/assets/og-image.jpg`,
  description:
    "Location de voiture premium en Tunisie. Flotte récente, livraison gratuite à l'aéroport Tunis-Carthage et à domicile, disponible 24h/24.",
  telephone: "+21652526595",
  priceRange: "DT DT DT",
  currenciesAccepted: "TND",
  paymentAccepted: "Cash, Virement bancaire",
  openingHours: "Mo-Su 00:00-24:00",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tunis",
    addressRegion: "Tunis",
    addressCountry: "TN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.8065,
    longitude: 10.1815,
  },
  areaServed: [
    { "@type": "City", name: "Tunis" },
    { "@type": "City", name: "Sousse" },
    { "@type": "City", name: "Sfax" },
    { "@type": "Country", name: "Tunisie" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Flotte de véhicules",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Car", name: "Citadine", description: "Voiture citadine économique" },
        priceCurrency: "TND",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "89", priceCurrency: "TND", unitText: "DAY" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Car", name: "Sport", description: "Voiture sport et dynamique" },
        priceCurrency: "TND",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "110", priceCurrency: "TND", unitText: "DAY" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Car", name: "Premium", description: "Voiture premium haut de gamme" },
        priceCurrency: "TND",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "135", priceCurrency: "TND", unitText: "DAY" },
      },
    ],
  },
  sameAs: [],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <Hero />
      <Marquee />
      <FleetLoader />
      <FeaturesSection />
      <ProcessSection />
      <PricingStripe />
      <ContactSection />
      <GiantMark />
      <Footer />
      <AIConcierge />
    </>
  );
}
