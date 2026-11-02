import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/property-gallery";
import PropertyExploreMenu from "@/components/property-explore-menu";
import MirvaiBrand from "@/components/mirvai-brand";
import { featuredProperty, formatNaira } from "@/lib/featured-property";

const WA = "2349011081436";

export function generateStaticParams() {
  return featuredProperty.publiclyListed ? [{ slug: featuredProperty.slug }] : [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!featuredProperty.publiclyListed || slug !== featuredProperty.slug) return {};

  return {
    title: `${featuredProperty.title} in Ikeja`,
    description: `${featuredProperty.completionStatus} ${featuredProperty.title.toLowerCase()} for sale in ${featuredProperty.location} for ${formatNaira(featuredProperty.price)}.`,
    alternates: { canonical: `/properties/${featuredProperty.slug}` },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!featuredProperty.publiclyListed || slug !== featuredProperty.slug) notFound();

  const whatsappMessage = encodeURIComponent(
    `Hello Mirvai, I am interested in ${featuredProperty.title} at ${featuredProperty.location} (${featuredProperty.reference}). Please confirm its current availability and arrange the next step.`,
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "House",
    name: featuredProperty.title,
    description: featuredProperty.description,
    numberOfRooms: 4,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Adeniyi Jones",
      addressLocality: "Ikeja",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    offers: {
      "@type": "Offer",
      price: featuredProperty.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: `https://mirvaigroup.com/properties/${featuredProperty.slug}`,
    },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="all-properties-nav">
        <MirvaiBrand />
        <div className="catalog-nav-actions"><PropertyExploreMenu/><Link href="/#enquire">Enquire</Link></div>
      </header>

      <article className="property-detail">
        <section className="property-detail-head">
          <div>
            <Link className="property-breadcrumb" href="/properties">← Back to properties</Link>
            <p className="section-label light">{featuredProperty.type} · {featuredProperty.status}</p>
            <h1>{featuredProperty.title}</h1>
            <p className="property-location">{featuredProperty.location}</p>
          </div>
          <div className="property-price-panel">
            <small>ASKING PRICE</small>
            <strong>{formatNaira(featuredProperty.price)}</strong>
            <span>{featuredProperty.completionStatus}</span>
          </div>
        </section>

        <PropertyGallery photos={featuredProperty.photos} />

        <section className="property-information">
          <div className="property-copy">
            <p className="section-label">The property</p>
            <h2>Contemporary living in central Ikeja.</h2>
            <p>{featuredProperty.description}</p>

            <div className="property-features">
              {featuredProperty.features.map((feature) => <span key={feature}>{feature}</span>)}
            </div>
          </div>

          <aside className="property-facts">
            <h2>At a glance</h2>
            <dl>
              <div><dt>Bedrooms</dt><dd>4</dd></div>
              <div><dt>Property type</dt><dd>{featuredProperty.type}</dd></div>
              <div><dt>Additional space</dt><dd>Boy’s quarters</dd></div>
              <div><dt>Completion</dt><dd>{featuredProperty.completionStatus}</dd></div>
              <div><dt>Title information</dt><dd>{featuredProperty.titleDocument}</dd></div>
              <div><dt>Reference</dt><dd>{featuredProperty.reference}</dd></div>
            </dl>
            <a className="button gold" href={`https://wa.me/${WA}?text=${whatsappMessage}`}>Enquire on WhatsApp</a>
            <Link className="property-form-link" href="/#enquire">Use the website enquiry form</Link>
          </aside>
        </section>

        <section className="property-notice">
          <strong>Important information</strong>
          <p>Price, availability, property details and title information were supplied for this listing and may change. Governor’s Consent is stated as the title document; buyers should complete an independent legal review and official title search before making any payment or commitment.</p>
        </section>
      </article>

      <footer><MirvaiBrand/><p>Integrity. Professionalism. Results.</p><p>© 2026 Mirvai · <Link href="/guides">Buyer guides</Link> · <Link href="/privacy">Privacy</Link></p></footer>
    </main>
  );
}
