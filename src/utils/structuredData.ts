// Schema.org structured data helpers
import { DOMAIN_URL } from "../constants/seoMetadata";

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "File Edit",
  url: DOMAIN_URL,
  logo: `${DOMAIN_URL}/logo.png`,
  description:
    "Free online PDF and image editor with conversion, merging, compression, and resizing tools",
  sameAs: [
    "https://twitter.com/fileedit",
    "https://facebook.com/fileedit",
    "https://instagram.com/fileedit",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    url: DOMAIN_URL,
  },
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "File Edit",
  url: DOMAIN_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${DOMAIN_URL}/search?q={search_term_string}`,
    },
    query_input: "required name=search_term_string",
  },
});

export const generateSoftwareApplicationSchema = (
  name: string,
  description: string,
  url: string
) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: name,
  description: description,
  url: url,
  applicationCategory: "UtilityApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
  },
  operatingSystem: "Any",
});

export const generateToolSchema = (
  toolName: string,
  toolDescription: string,
  toolUrl: string
) => ({
  "@context": "https://schema.org",
  "@type": "Tool",
  name: toolName,
  description: toolDescription,
  url: toolUrl,
  provider: {
    "@type": "Organization",
    name: "File Edit",
    url: DOMAIN_URL,
  },
});

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
