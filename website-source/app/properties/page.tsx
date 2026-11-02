"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyExploreMenu from "@/components/property-explore-menu";
import MirvaiBrand from "@/components/mirvai-brand";
import {
  categoryForProperty,
  featuredProperty,
  formatNaira,
  propertyCategories,
  type PropertyCategorySlug,
  type PublicProperty,
  withFeaturedProperty,
} from "@/lib/featured-property";

const WA = "2349011081436";

function track(event: string) {
  try {
    let sessionId = localStorage.getItem("mirvai-session-id");
    if (!sessionId) { sessionId = crypto.randomUUID(); localStorage.setItem("mirvai-session-id", sessionId); }
    void fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ event, path: "/properties", sessionId }) });
  } catch { /* Analytics must never interrupt a visitor. */ }
}

export default function PropertiesPage() {
  return <Suspense fallback={<p className="catalog-loading">Loading properties…</p>}><PropertyCatalogue /></Suspense>;
}

function PropertyCatalogue() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const activeCategory = (propertyCategories.some((category) => category.slug === requestedType) ? requestedType : "all") as PropertyCategorySlug;
  const activeLabel = propertyCategories.find((category) => category.slug === activeCategory)?.label || "All properties";
  const visibleProperties = activeCategory === "all"
    ? properties
    : properties.filter((property) => categoryForProperty(property) === activeCategory);

  useEffect(() => {
    track("page_view");
    fetch("/api/properties")
      .then(response => response.ok ? response.json() as Promise<PublicProperty[]> : [])
      .then(items => setProperties(withFeaturedProperty(items)))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return <main><header className="all-properties-nav"><MirvaiBrand/><div className="catalog-nav-actions"><PropertyExploreMenu/><Link href="/#enquire">Tell us what you need</Link></div></header><section className="all-properties-head"><p className="section-label light">Lagos Mainland and Island</p><h1>Explore properties</h1><p>Browse available opportunities by property type, or send Mirvai your requirements for a tailored search.</p></section><section className="catalog-filter-shell" id="browse"><div className="catalog-filter-head"><div><p className="section-label">Browse by type</p><h2>{activeLabel}</h2></div><span>{visibleProperties.length} {visibleProperties.length === 1 ? "property" : "properties"}</span></div><div className="catalog-filter-list" aria-label="Filter properties by type">{propertyCategories.map((category) => <Link className={category.slug === activeCategory ? "active" : ""} aria-current={category.slug === activeCategory ? "page" : undefined} href={category.slug === "all" ? "/properties#browse" : `/properties?type=${category.slug}#browse`} key={category.slug}>{category.label}</Link>)}</div></section><section className="all-properties listings section">{loading && visibleProperties.length === 0 ? <p className="empty">Checking available properties…</p> : visibleProperties.length === 0 ? <div className="catalog-empty"><p className="section-label">Property sourcing</p><h2>No {activeLabel.toLowerCase()} are published yet.</h2><p>Mirvai only publishes a property after its details and current availability have been confirmed. Send your brief and we will check the closest suitable options for your location and budget.</p><Link className="button gold" href="/#enquire">Send your requirements</Link></div> : <div className="property-grid">{visibleProperties.map(property => {
    const imageSource = property.image_url || (property.image_key ? `/api/images/${property.image_key}` : null);
    const isCurated = property.reference === featuredProperty.reference;
    return <article key={property.id}>{imageSource && <Image src={imageSource} width={1600} height={1200} sizes="(max-width: 800px) 100vw, 33vw" alt={`${property.title} in ${property.location}`} />}<div><small>{property.type} · {property.status}</small><h3>{property.title}</h3><p>{property.location}</p><b>{formatNaira(property.price)}</b>{property.verified ? <span className="verified">Verified</span> : null}{isCurated ? <Link href={`/properties/${featuredProperty.slug}`}>View full property &amp; photos →</Link> : <a onClick={() => track("whatsapp_click")} href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hello Mirvai, I am interested in ${property.title} in ${property.location}.`)}`}>Enquire on WhatsApp ↗</a>}</div></article>;
  })}</div>}<div className="listing-actions"><Link className="button" href="/#enquire">Send your requirements</Link></div></section></main>;
}
