"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { propertyCategories } from "@/lib/featured-property";
import MirvaiBrand from "@/components/mirvai-brand";

const WA = "2349011081436";

export default function PropertyExploreMenu() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const triggerElement = trigger.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      triggerElement?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button className="site-menu-trigger" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mirvai-site-menu" ref={trigger}>
        <span className="menu-bars" aria-hidden="true"><i/><i/><i/></span>
        <span>Menu</span>
      </button>
      {open && createPortal(
        <div className="site-menu-overlay" id="mirvai-site-menu" role="dialog" aria-modal="true" aria-labelledby="site-menu-title">
          <div className="site-menu-shell">
            <header className="site-menu-top">
              <MirvaiBrand onClick={close} />
              <button className="site-menu-close" type="button" onClick={close} aria-label="Close menu" ref={closeButton}><span aria-hidden="true">×</span> Close</button>
            </header>

            <div className="site-menu-body">
              <nav className="site-menu-primary" aria-label="Main navigation">
                <p>Menu</p>
                <Link href="/" onClick={close}>Home</Link>
                <Link href="/properties" onClick={close}>All properties</Link>
                <Link href="/#about" onClick={close}>About Mirvai</Link>
                <Link href="/#services" onClick={close}>How we help</Link>
                <Link href="/#faq" onClick={close}>Diaspora buyers</Link>
                <Link href="/guides" onClick={close}>Buyer guides</Link>
                <Link href="/#enquire" onClick={close}>Make an enquiry</Link>
              </nav>

              <section className="site-menu-properties" aria-labelledby="site-menu-title">
                <p>Explore our listings</p>
                <h2 id="site-menu-title">Browse by property type</h2>
                <div>
                  {propertyCategories.map((category) => (
                    <Link
                      href={category.slug === "all" ? "/properties" : `/properties?type=${category.slug}#browse`}
                      onClick={close}
                      key={category.slug}
                    >
                      <span>{category.label}</span><b aria-hidden="true">→</b>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <div className="site-menu-footer">
              <p>Can’t find exactly what you want? Tell us your preferred property, location and budget.</p>
              <Link href="/#enquire" onClick={close}>Send your requirements</Link>
              <a href={`https://wa.me/${WA}`} onClick={close}>WhatsApp Mirvai</a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
