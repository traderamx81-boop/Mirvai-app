import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyExploreMenu from "@/components/property-explore-menu";
import MirvaiBrand from "@/components/mirvai-brand";
import { buyerGuides, getBuyerGuide } from "@/lib/buyer-guides";

export function generateStaticParams() {
  return buyerGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getBuyerGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.description, type: "article", url: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getBuyerGuide(slug);
  if (!guide) notFound();
  const otherGuides = buyerGuides.filter((item) => item.slug !== guide.slug).slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    author: { "@type": "Organization", name: "Mirvai" },
    publisher: { "@type": "Organization", name: "Mirvai" },
    mainEntityOfPage: `https://mirvaigroup.com/guides/${guide.slug}`,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="all-properties-nav">
        <MirvaiBrand />
        <div className="catalog-nav-actions"><PropertyExploreMenu/><Link href="/#enquire">Tell us what you need</Link></div>
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
            {guide.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</a>)}
            <Link className="button gold" href="/#enquire">Ask Mirvai</Link>
          </aside>
          <div className="buyer-guide-copy">
            <p className="guide-introduction">{guide.introduction}</p>
            {guide.sections.map((section, index) => (
              <section id={`section-${index + 1}`} key={section.heading}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
              </section>
            ))}
            <div className="guide-disclaimer"><strong>Important</strong><p>Property circumstances differ. Obtain independent legal, survey, tax, financial or technical advice where appropriate before making a payment or commitment.</p></div>
          </div>
        </div>
      </article>
      <section className="related-guides section">
        <p className="section-label">Keep reading</p><h2>More Mirvai buyer guides</h2>
        <div>{otherGuides.map((item) => <Link href={`/guides/${item.slug}`} key={item.slug}><small>{item.kicker}</small><strong>{item.title}</strong><span aria-hidden="true">→</span></Link>)}</div>
      </section>
      <footer><MirvaiBrand/><p>Integrity. Professionalism. Results.</p><p>© 2026 Mirvai · <Link href="/guides">Buyer guides</Link> · <Link href="/privacy">Privacy</Link></p></footer>
    </main>
  );
}
