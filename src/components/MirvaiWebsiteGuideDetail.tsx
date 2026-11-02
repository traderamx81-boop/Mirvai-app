import React from 'react';
import Link from 'next/link';
import PropertyExploreMenu from '@/components/property-explore-menu';
import MirvaiBrand from '@/components/mirvai-brand';
import { buyerGuides, getBuyerGuide } from '@/lib/buyer-guides';

interface GuideDetailProps {
  slug?: string;
}

export const MirvaiWebsiteGuideDetail: React.FC<GuideDetailProps> = ({ slug }) => {
  const currentSlug = slug || (typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '') || buyerGuides[0].slug;
  const guide = getBuyerGuide(currentSlug) || buyerGuides[0];
  const otherGuides = buyerGuides.filter((item) => item.slug !== guide.slug).slice(0, 3);

  return (
    <div className="mirvai-website-wrapper">
      <main>
        <header className="all-properties-nav">
          <MirvaiBrand />
          <div className="catalog-nav-actions">
            <PropertyExploreMenu />
            <Link href="/#enquire">Tell us what you need</Link>
          </div>
        </header>

        <article className="buyer-guide">
          <header className="buyer-guide-head">
            <Link href="/guides">← All buyer guides</Link>
            <p className="section-label light">{guide.kicker}</p>
            <h1>{guide.title}</h1>
            <p>{guide.description}</p>
            <small>{guide.readTime} · General educational information</small>
          </header>

          <div className="buyer-guide-layout">
            <aside>
              <p className="section-label">In this guide</p>
              {guide.sections.map((section, index) => (
                <a href={`#section-${index + 1}`} key={section.heading}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.heading}
                </a>
              ))}
              <Link className="button gold" href="/#enquire">
                Ask Mirvai
              </Link>
            </aside>

            <div className="buyer-guide-copy">
              <p className="guide-introduction">{guide.introduction}</p>
              {guide.sections.map((section, index) => (
                <section id={`section-${index + 1}`} key={section.heading}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.points && (
                    <ul>
                      {section.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <div className="guide-disclaimer">
                <strong>Important</strong>
                <p>
                  Property circumstances differ. Obtain independent legal, survey, tax, financial or technical advice
                  where appropriate before making a payment or commitment.
                </p>
              </div>
            </div>
          </div>
        </article>

        <section className="related-guides section">
          <p className="section-label">Keep reading</p>
          <h2>More Mirvai buyer guides</h2>
          <div>
            {otherGuides.map((item) => (
              <Link href={`/guides/${item.slug}`} key={item.slug}>
                <small>{item.kicker}</small>
                <strong>{item.title}</strong>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

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

export default MirvaiWebsiteGuideDetail;
