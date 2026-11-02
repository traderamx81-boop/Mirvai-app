import React from 'react';
import Link from 'next/link';
import PropertyGallery from '@/components/property-gallery';
import PropertyExploreMenu from '@/components/property-explore-menu';
import MirvaiBrand from '@/components/mirvai-brand';
import { featuredProperty, formatNaira } from '@/lib/featured-property';

const WA = "2349011081436";

interface PropertyDetailProps {
  slug?: string;
}

export const MirvaiWebsitePropertyDetail: React.FC<PropertyDetailProps> = ({ slug }) => {
  const currentSlug = slug || (typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '') || featuredProperty.slug;

  const property = featuredProperty.slug === currentSlug ? featuredProperty : featuredProperty;

  const whatsappMessage = encodeURIComponent(
    `Hello Mirvai, I am interested in ${property.title} at ${property.location} (${property.reference}). Please confirm its current availability and arrange the next step.`
  );

  return (
    <div className="mirvai-website-wrapper">
      <main>
        <header className="all-properties-nav">
          <MirvaiBrand />
          <div className="catalog-nav-actions">
            <PropertyExploreMenu />
            <Link href="/#enquire">Enquire</Link>
          </div>
        </header>

        <article className="property-detail">
          <section className="property-detail-head">
            <div>
              <Link className="property-breadcrumb" href="/properties">
                ← Back to properties
              </Link>
              <p className="section-label light">
                {property.type} · {property.status}
              </p>
              <h1>{property.title}</h1>
              <p className="property-location">{property.location}</p>
            </div>
            <div className="property-price-panel">
              <small>ASKING PRICE</small>
              <strong>{formatNaira(property.price)}</strong>
              <span>{property.completionStatus}</span>
            </div>
          </section>

          <PropertyGallery photos={property.photos} />

          <section className="property-information">
            <div className="property-copy">
              <p className="section-label">The property</p>
              <h2>Contemporary living in central Ikeja.</h2>
              <p>{property.description}</p>

              <div className="property-features">
                {property.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            </div>

            <aside className="property-facts">
              <h2>At a glance</h2>
              <dl>
                <div>
                  <dt>Bedrooms</dt>
                  <dd>4</dd>
                </div>
                <div>
                  <dt>Property type</dt>
                  <dd>{property.type}</dd>
                </div>
                <div>
                  <dt>Additional space</dt>
                  <dd>Boy’s quarters</dd>
                </div>
                <div>
                  <dt>Completion</dt>
                  <dd>{property.completionStatus}</dd>
                </div>
                <div>
                  <dt>Title information</dt>
                  <dd>{property.titleDocument}</dd>
                </div>
                <div>
                  <dt>Reference</dt>
                  <dd>{property.reference}</dd>
                </div>
              </dl>
              <a className="button gold" href={`https://wa.me/${WA}?text=${whatsappMessage}`}>
                Enquire on WhatsApp
              </a>
              <Link className="property-form-link" href="/#enquire">
                Use the website enquiry form
              </Link>
            </aside>
          </section>

          <section className="property-notice">
            <strong>Important information</strong>
            <p>
              Price, availability, property details and title information were supplied for this listing and may change.
              Governor’s Consent is stated as the title document; buyers should complete an independent legal review and
              official title search before making any payment or commitment.
            </p>
          </section>
        </article>

        <footer>
          <MirvaiBrand />
          <p>Integrity. Professionalism. Results.</p>
          <p>
            © 2026 Mirvai · <Link href="/guides">Buyer guides</Link> · <Link href="/privacy">Privacy</Link>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default MirvaiWebsitePropertyDetail;
