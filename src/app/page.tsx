import Hero from "@/components/home/Hero";
import Identify from "@/components/home/Identify";
import Solution from "@/components/home/Solution";
import ServicesPreview from "@/components/home/ServicesPreview";
import Results from "@/components/home/Results";
import About from "@/components/home/About";
import ProductsPreview from "@/components/home/ProductsPreview";
import Reviews from "@/components/home/Reviews";
import Location from "@/components/home/Location";
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: site.fullName,
    description: site.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      postalCode: site.contact.postalCode,
      addressLocality: site.contact.cityRegion,
      addressCountry: "ES",
    },
    telephone: site.contact.phone,
    url: "https://almarizo.com",
    areaServed: "Tarragona",
    priceRange: "€€",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero news={news} />
      <Identify />
      <Solution />
      <ServicesPreview services={services} />
      <Results />
      <About />
      <ProductsPreview products={products} />
      <Reviews reviews={reviews} />
      <Location />
      <FinalCTA />
    </>
  );
}
