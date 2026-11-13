import React, { useState } from 'react';
import {
  categories,
  categoryLabel,
  HomeListing,
  ngn,
  resolveListingImage,
} from '../lib/courtyardReview';

interface ReviewWebsiteViewProps {
  hidden: boolean;
  webFilter: string;
  webArea: string;
  webQuery: string;
  listings: HomeListing[];
  onFilterChange: (categoryId: string) => void;
  onAreaChange: (area: string) => void;
  onQueryChange: (query: string) => void;
  onResetFilters: () => void;
  onOpenMenu: () => void;
  onEnquire: (propertyId?: string) => void;
  onContact: () => void;
  onOpenProperty: (propertyId: string) => void;
}

export const ReviewWebsiteView: React.FC<ReviewWebsiteViewProps> = ({
  hidden,
  webFilter,
  webArea,
  webQuery,
  listings,
  onFilterChange,
  onAreaChange,
  onQueryChange,
  onResetFilters,
  onOpenMenu,
  onEnquire,
  onContact,
  onOpenProperty,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const filterOptions: [string, string][] = [['all', 'All properties'], ...categories];

  const toggleDescription = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="website" data-surface="" hidden={hidden}>
      <header className="site-head" id="top">
        <button
          type="button"
          className="icon-button menu-toggle"
          onClick={onOpenMenu}
          aria-label="Open website menu"
        >
          <svg aria-hidden="true">
            <use href="#i-menu" />
          </svg>
          <span>Menu</span>
        </button>

        <a className="wordmark" href="#top" aria-label="MIRVAI home">
          MIRVAI
        </a>

        <button
          type="button"
          className="text-button head-contact"
          onClick={() => onEnquire()}
        >
          Make an enquiry{' '}
          <svg aria-hidden="true">
            <use href="#i-down" />
          </svg>
        </button>
      </header>

      <figure className="hero-photo">
        <img
          src="/assets/courtyard.webp"
          alt="A quiet limestone courtyard with a timber entry, leafy tree and reflecting pool"
          width={1360}
          height={680}
          fetchPriority="high"
        />
      </figure>

      <section className="light section collection" id="properties">
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="eyebrow">01 / MIRVAI</p>
              <h1>The Lagos Collection.</h1>
            </div>
            <p>
              Explore homes and land from independent developers and property owners. Search across
              Lagos Island and Mainland.
            </p>
          </div>

          <div className="collection-tools">
            <div
              id="web-filters"
              className="filters"
              aria-label="Website property categories"
            >
              {filterOptions.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  data-filter={id}
                  data-filter-surface="web"
                  aria-pressed={webFilter === id}
                  onClick={() => onFilterChange(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="collection-controls-right">
              <label className="search-field" htmlFor="web-search">
                Location{' '}
                <input
                  id="web-search"
                  type="search"
                  value={webQuery}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Search Lekki, Island, Ikeja…"
                />
              </label>

              <label className="compact-field">
                Area{' '}
                <select
                  id="web-area"
                  value={webArea}
                  onChange={(e) => onAreaChange(e.target.value)}
                >
                  <option value="all">All Lagos</option>
                  <option value="Island">Lagos Island</option>
                  <option value="Mainland">Lagos Mainland</option>
                </select>
              </label>
            </div>
          </div>

          <div id="web-list" className="property-grid">
            {listings.length === 0 ? (
              <div className="empty">
                <p>No properties match this selection. Try another location, category, or area.</p>
                <button
                  type="button"
                  className="card-desc-link"
                  onClick={onResetFilters}
                >
                  Reset search &amp; filters
                </button>
              </div>
            ) : (
              listings.map((item) => {
                const art = resolveListingImage(item);
                const isExpanded = Boolean(expandedIds[item.id]);
                const badgeLabel = item.status && item.status !== 'Available' ? item.status : 'Sample';

                return (
                  <article key={item.id} className="property-card">
                    <button
                      type="button"
                      className="property-image"
                      aria-label={`View ${item.name}`}
                      onClick={() => onOpenProperty(item.id)}
                    >
                      {art ? (
                        <img
                          loading="lazy"
                          src={art.src}
                          alt={art.alt}
                          width={1050}
                          height={700}
                        />
                      ) : (
                        <span className="image-placeholder">
                          <svg aria-hidden="true">
                            <use href="#i-home" />
                          </svg>{' '}
                          Property preview
                        </span>
                      )}
                      <span className="sample-tag">{badgeLabel}</span>
                    </button>

                    <p className="mini-meta">
                      {item.locale} · Lagos {item.area} · {categoryLabel(item.type)}
                    </p>
                    <h3>
                      <button type="button" onClick={() => onOpenProperty(item.id)}>
                        {item.name}
                      </button>
                    </h3>

                    <div className="card-footer-row">
                      <span className="price">{ngn(item.price)}</span>
                      <button
                        type="button"
                        className="card-desc-toggle"
                        aria-expanded={isExpanded}
                        aria-controls={`desc-${item.id}`}
                        onClick={() => toggleDescription(item.id)}
                      >
                        {isExpanded ? 'Hide description' : 'Description'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div id={`desc-${item.id}`} className="card-desc-panel">
                        <p>{item.description}</p>
                        <div className="card-desc-meta">
                          <span>
                            {item.beds ? `${item.beds} bedrooms · ` : ''}
                            {item.status || 'Available'}
                          </span>
                          <button
                            type="button"
                            className="card-desc-link"
                            onClick={() => onOpenProperty(item.id)}
                          >
                            Full details →
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

          <p className="fineprint">
            Illustrative listings, images and prices for design review. No property is being offered
            through this preview.
          </p>
        </div>
      </section>

      <footer className="site-foot" id="contact">
        <div>
          <div className="wordmark">MIRVAI</div>
          <p>Find. Own. Grow.</p>
        </div>
        <div className="actions">
          <button type="button" className="button outline" onClick={onContact}>
            Contact options
          </button>
          <button type="button" className="button primary" onClick={() => onEnquire()}>
            Make an enquiry
          </button>
        </div>
        <small>Design review · No live bookings, messages, payments or uploads.</small>
      </footer>
    </div>
  );
};
