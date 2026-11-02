export type PropertyPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PublicProperty = {
  id: string | number;
  reference: string;
  slug?: string;
  title: string;
  location: string;
  type: string;
  price: number;
  status: string;
  description: string;
  image_key: string | null;
  image_url?: string;
  verified: number;
  category?: ListingCategorySlug;
};

export const propertyCategories = [
  { slug: "all", label: "All properties" },
  { slug: "terrace-duplex", label: "Terrace duplexes" },
  { slug: "semi-detached-duplex", label: "Semi-detached duplexes" },
  { slug: "fully-detached-duplex", label: "Fully detached duplexes" },
  { slug: "apartments-penthouses", label: "Apartments & penthouses" },
  { slug: "off-plan", label: "Off-plan properties" },
  { slug: "bungalow", label: "Bungalows" },
  { slug: "land", label: "Land" },
  { slug: "commercial", label: "Commercial property" },
] as const;

export type PropertyCategorySlug = (typeof propertyCategories)[number]["slug"];
export type ListingCategorySlug = Exclude<PropertyCategorySlug, "all"> | "other";

export const featuredProperty = {
  id: "mirvai-ikeja-001",
  reference: "MIR-IKE-001",
  slug: "luxury-4-bedroom-terrace-duplex-adeniyi-jones",
  title: "Luxury 4-Bedroom Terrace Duplex with BQ",
  location: "Adeniyi Jones, Ikeja, Lagos",
  type: "Terrace duplex",
  category: "terrace-duplex",
  price: 400_000_000,
  status: "Available",
  completionStatus: "Fully completed",
  titleDocument: "Governor’s Consent",
  publiclyListed: true,
  description:
    "A fully completed four-bedroom luxury terrace duplex with a boy’s quarters in Adeniyi Jones, Ikeja. The home combines modern contemporary architecture with generous living spaces, an ante-room, all en-suite bedrooms, a fully fitted kitchen and quality sanitary fittings. It is set within a secure gated environment in an established Ikeja neighbourhood.",
  image_key: null,
  image_url: "/properties/adeniyi-jones-terrace/01-exterior.jpg",
  verified: 1,
  features: [
    "Modern contemporary architecture",
    "Spacious living area",
    "Ante-room",
    "Beautifully crafted wardrobes",
    "Luxury sanitary fittings",
    "All rooms en-suite",
    "Fully fitted kitchen",
    "Stamped concrete flooring",
    "Thoughtfully designed lighting",
    "Boy’s quarters",
    "Secure gated environment",
    "Established neighbourhood",
    "CCTV",
  ],
  photos: [
    { src: "/properties/adeniyi-jones-terrace/01-exterior.jpg", width: 709, height: 1536, alt: "Exterior of the luxury terrace duplex in Adeniyi Jones, Ikeja" },
    { src: "/properties/adeniyi-jones-terrace/02-living-area.jpg", width: 1152, height: 1536, alt: "Spacious living area with contemporary ceiling details" },
    { src: "/properties/adeniyi-jones-terrace/03-kitchen-view.jpg", width: 1152, height: 1536, alt: "Interior view leading toward the fitted kitchen" },
    { src: "/properties/adeniyi-jones-terrace/04-bathroom.jpg", width: 1152, height: 1536, alt: "En-suite bathroom with contemporary sanitary fittings" },
    { src: "/properties/adeniyi-jones-terrace/05-landing.jpg", width: 1152, height: 1536, alt: "Upper staircase landing inside the duplex" },
    { src: "/properties/adeniyi-jones-terrace/06-bathtub.jpg", width: 1152, height: 1536, alt: "Bathroom with a freestanding bathtub" },
    { src: "/properties/adeniyi-jones-terrace/07-kitchen.jpg", width: 1152, height: 1536, alt: "Fully fitted kitchen with centre island" },
    { src: "/properties/adeniyi-jones-terrace/08-staircase.jpg", width: 1152, height: 1536, alt: "Marble-finished staircase inside the duplex" },
    { src: "/properties/adeniyi-jones-terrace/09-bedroom.jpg", width: 1152, height: 1536, alt: "En-suite bedroom with balcony access" },
    { src: "/properties/adeniyi-jones-terrace/10-shower.jpg", width: 1152, height: 1536, alt: "Glass-enclosed shower in an en-suite bathroom" },
  ] satisfies PropertyPhoto[],
} as const;

export function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function withFeaturedProperty(properties: PublicProperty[]) {
  const managedProperties = properties.filter(
    (property) => property.reference !== featuredProperty.reference,
  );

  return featuredProperty.publiclyListed
    ? [featuredProperty, ...managedProperties] as PublicProperty[]
    : managedProperties;
}

export function categoryForProperty(property: PublicProperty): ListingCategorySlug {
  if (property.category) return property.category;
  const type = property.type.toLowerCase();
  if (type.includes("terrace")) return "terrace-duplex";
  if (type.includes("semi-detached")) return "semi-detached-duplex";
  if (type.includes("fully detached") || type.includes("detached duplex")) return "fully-detached-duplex";
  if (type.includes("off-plan")) return "off-plan";
  if (type.includes("apartment") || type.includes("penthouse")) return "apartments-penthouses";
  if (type.includes("bungalow")) return "bungalow";
  if (type.includes("land")) return "land";
  if (type.includes("commercial")) return "commercial";
  return "other";
}
