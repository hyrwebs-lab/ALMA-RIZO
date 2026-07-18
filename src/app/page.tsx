import Hero from "@/components/home/Hero";
import TrustBadges from "@/components/home/TrustBadges";
import Identify from "@/components/home/Identify";
import Solution from "@/components/home/Solution";
import ClaimMarquee from "@/components/home/ClaimMarquee";
import ServicesPreview from "@/components/home/ServicesPreview";
import Prep from "@/components/home/Prep";
import Results from "@/components/home/Results";
import About from "@/components/home/About";
import ProductsPreview from "@/components/home/ProductsPreview";
import Reviews from "@/components/home/Reviews";
import ReelWall from "@/components/home/ReelWall";
import Location from "@/components/home/Location";
import Brands from "@/components/home/Brands";
import FinalCTA from "@/components/home/FinalCTA";
import { site } from "@/lib/site";
import { getServices, getProducts, getReviews, getNews } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, products, reviews, news] = await Promise.all([
    getServices(),
    getProducts(),
    getReviews(),
    getNews(),
  ]);

  const shownReviews = reviews.filter((r) => r.rating >= 4.5);
  const avgRating = shownReviews.length
    ? shownReviews.reduce((a, r) => a + r.rating, 0) / shownReviews.length
    : 5;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": "https://almarizo.com/#salon",
    name: site.fullName,
    description: site.tagline,
    image: "https://almarizo.com/og.jpg",
    logo: "https://almarizo.com/logos/logo-green.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      postalCode: site.contact.postalCode,
      addressLocality: site.contact.cityRegion,
      addressRegion: "Tarragona",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: 41.118, longitude: 1.245 },
    telephone: site.contact.phoneHref,
    url: "https://almarizo.com",
    areaServed: "Tarragona",
    priceRange: "€€",
    currenciesAccepted: "EUR",
    sameAs: [site.social.instagram],
    hasMap: site.mapsLink,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday"], opens: "09:30", closes: "18:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday", "Friday"], opens: "09:30", closes: "19:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:30", closes: "13:30" },
    ],
    ...(shownReviews.length
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avgRating.toFixed(1), reviewCount: shownReviews.length, bestRating: 5 } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero news={news} />
      <TrustBadges />
      <Identify />
      <Solution />
      <ClaimMarquee />
      <ServicesPreview services={services} />
      <Prep />
      <Results />
      <About />
      <ProductsPreview products={products} />
      <Reviews reviews={reviews} />
      <ReelWall />
      <Location />
      <Brands />
      <FinalCTA />
    </>
  );
}
