import type { Metadata } from "next";
import Link from "next/link";
import PropertyExploreMenu from "@/components/property-explore-menu";
import MirvaiBrand from "@/components/mirvai-brand";
import { buyerGuides } from "@/lib/buyer-guides";

export const metadata: Metadata = {
  title: "Lagos Property Buyer Guides",
  description: "Practical Mirvai guides for buying property in Lagos, investing from abroad and coordinating property verification in Nigeria.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main>
      <header className="all-properties-nav">
        <MirvaiBrand />
        <div className="catalog-nav-actions"><PropertyExploreMenu/><Link href="/#enquire">Tell us what you need</Link></div>
      </header>
      <section className="guide-index-hero">
        <p className="section-label light">Mirvai buyer guides</p>
        <h1>Clear answers before<br/><em>big property decisions.</em></h1>
        <p>Practical guidance for Lagos buyers and Nigerians investing from abroad—written to help you ask better questions and understand the next step.</p>
      </section>
      <section className="guide-index section">
        <div className="guide-index-intro"><p className="section-label">Learn before you commit</p><h2>Start with the guide that matches your goal.</h2></div>
        <div className="guide-index-grid">
          {buyerGuides.map((guide, index) => (
            <article key={guide.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{guide.kicker} · {guide.readTime}</small>
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
              <Link href={`/guides/${guide.slug}`}>Read the guide <b aria-hidden="true">→</b></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="guide-index-cta"><div><p className="section-label light">Need personal guidance?</p><h2>Tell us what you want to buy.</h2></div><div><p>Share your preferred location, property type and budget. Mirvai will explain what your budget can achieve and help you plan the next step.</p><Link className="button gold" href="/#enquire">Send your property brief</Link></div></section>
      <footer><MirvaiBrand/><p>Integrity. Professionalism. Results.</p><p>© 2026 Mirvai · <Link href="/guides">Buyer guides</Link> · <Link href="/privacy">Privacy</Link></p></footer>
    </main>
  );
}
