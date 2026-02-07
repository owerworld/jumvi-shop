import { product } from "@/lib/product";
import { t } from "@/lib/i18n";

export default function JsonLd() {
  const reviews = t.reviews.items.slice(0, 3).map((item, index) => ({
    author: item.name,
    rating: index === 2 ? 4 : 5,
    text: item.text,
  }));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: t.hero.title,
    description: t.hero.subtitle,
    image: ["https://jumvi.co/jumvi-hero.png"],
    brand: { "@type": "Brand", name: "JUMVI" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toString(),
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    review: reviews.map((item) => ({
      "@type": "Review",
      author: { "@type": "Person", name: item.author },
      reviewRating: { "@type": "Rating", ratingValue: item.rating },
      reviewBody: item.text,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
