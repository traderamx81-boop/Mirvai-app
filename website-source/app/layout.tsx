import type {Metadata} from "next";import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://mirvaigroup.com"),
  title: {
    default: "Mirvai Group | Real Estate Company in Lagos",
    template: "%s | Mirvai Group",
  },
  description:
    "Lagos property sourcing and investment guidance for buyers in Nigeria and abroad, with clear viewings, documentation coordination and budget advice.",
  keywords: [
    "real estate company in Lagos",
    "property for sale in Lagos",
    "buy property in Nigeria from abroad",
    "Lagos property sourcing",
    "Lagos property investment",
    "diaspora property Nigeria",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mirvai Group | Real Estate Solutions",
    description:
      "Clear Lagos property sourcing and guidance for buyers in Nigeria and abroad.",
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: "Mirvai Group",
    images: [
      {
        url: "/favicon-512x512.png",
        width: 512,
        height: 512,
        alt: "Mirvai Group Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirvai Group | Real Estate Solutions",
    description: "Clear Lagos property sourcing and guidance for buyers in Nigeria and abroad.",
    images: ["/favicon-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Mirvai Realty & Investment",
  alternateName: "Mirvai Group",
  url: "https://mirvaigroup.com/",
  logo: "https://mirvaigroup.com/favicon-512x512.png",
  image: "https://mirvaigroup.com/favicon-512x512.png",
  description: "Lagos property sourcing and investment guidance for buyers in Nigeria and abroad, with verified titles and end-to-end support.",
  telephone: "+2349011081436",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressRegion: "Lagos State",
    addressCountry: "NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

