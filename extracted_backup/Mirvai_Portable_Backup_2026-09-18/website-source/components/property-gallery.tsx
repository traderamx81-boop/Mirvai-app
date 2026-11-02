"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyPhoto } from "@/lib/featured-property";

export default function PropertyGallery({ photos }: { photos: readonly PropertyPhoto[] }) {
  const [active, setActive] = useState(0);
  const photo = photos[active];

  function move(direction: number) {
    setActive((current) => (current + direction + photos.length) % photos.length);
  }

  return (
    <section className="property-gallery" aria-label="Property photo gallery">
      <div className="property-gallery-stage">
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          priority={active === 0}
          sizes="(max-width: 900px) 100vw, 76vw"
        />
        <button type="button" className="gallery-arrow previous" onClick={() => move(-1)} aria-label="Previous photo">‹</button>
        <button type="button" className="gallery-arrow next" onClick={() => move(1)} aria-label="Next photo">›</button>
        <span className="gallery-count">{active + 1} / {photos.length}</span>
      </div>
      <div className="property-thumbnails">
        {photos.map((item, index) => (
          <button
            type="button"
            className={index === active ? "active" : ""}
            onClick={() => setActive(index)}
            aria-label={`View photo ${index + 1}: ${item.alt}`}
            aria-current={index === active ? "true" : undefined}
            key={item.src}
          >
            <Image src={item.src} alt="" fill sizes="110px" />
          </button>
        ))}
      </div>
      <p className="gallery-help">Select a thumbnail to view each photo.</p>
    </section>
  );
}
