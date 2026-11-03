"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MirvaiBrand from "@/components/mirvai-brand";

const WA = "2349011081436";

export default function PropertyExploreMenu() {
  const [open, setOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Sync theme
    const syncTheme = () => {
      try {
        const pref = localStorage.getItem('mirvai_theme_preference');
        if (pref === 'dark' || pref === 'light') {
          setCurrentTheme(pref);
          return;
        }
        if (typeof window !== 'undefined' && window.matchMedia) {
          setCurrentTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
      } catch {}
    };

    syncTheme();
  }, [open]);

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

  const handleToggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('mirvai:theme-toggle'));
  };

  return (
    <>
      <button
        className="site-menu-trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mirvai-site-menu"
        ref={trigger}
      >
        <span className="menu-bars" aria-hidden="true"><i/><i/><i/></span>
        <span className="hidden sm:inline">Menu</span>
      </button>

      {open && createPortal(
        <div className="site-menu-overlay" id="mirvai-site-menu" role="dialog" aria-modal="true" aria-labelledby="site-menu-title">
          <div className="site-menu-shell w-full max-w-7xl mx-auto min-h-screen flex flex-col justify-between">
            {/* Top Bar */}
            <header className="site-menu-top">
              <MirvaiBrand onClick={close} />
              <button className="site-menu-close" type="button" onClick={close} aria-label="Close menu" ref={closeButton}>
                <span aria-hidden="true">×</span> Close
              </button>
            </header>

            {/* Menu Body - Exact 2-Column layout matching reference IMG-20261102-WA0011 */}
            <div className="site-menu-body flex-1 py-8 sm:py-14 px-6 sm:px-12 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 lg:gap-20 items-start">
              
              {/* Left Column: Primary Site Navigation */}
              <nav className="site-menu-primary md:col-span-5 flex flex-col" aria-label="Main menu">
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#cca462] font-bold mb-4">
                  MENU
                </p>
                <Link
                  href="/"
                  onClick={close}
                  className="font-serif text-2xl sm:text-3xl text-[#f6f1e8] hover:text-[#cca462] py-3.5 border-b border-[#1b3d30] block transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/properties"
                  onClick={close}
                  className="font-serif text-2xl sm:text-3xl text-[#f6f1e8] hover:text-[#cca462] py-3.5 border-b border-[#1b3d30] block transition-colors"
                >
                  All properties
                </Link>
                <Link
                  href="/#about"
                  onClick={close}
                  className="font-serif text-2xl sm:text-3xl text-[#f6f1e8] hover:text-[#cca462] py-3.5 border-b border-[#1b3d30] block transition-colors"
                >
                  About Mirvai
                </Link>
                <Link
                  href="/#services"
                  onClick={close}
                  className="font-serif text-2xl sm:text-3xl text-[#f6f1e8] hover:text-[#cca462] py-3.5 border-b border-[#1b3d30] block transition-colors"
                >
                  How we help
                </Link>
                <Link
                  href="/#diaspora"
                  onClick={close}
                  className="font-serif text-2xl sm:text-3xl text-[#f6f1e8] hover:text-[#cca462] py-3.5 border-b border-[#1b3d30] block transition-colors"
                >
                  Diaspora buyers
                </Link>
                <Link
                  href="/guides"
                  onClick={close}
                  className="font-serif text-2xl sm:text-3xl text-[#f6f1e8] hover:text-[#cca462] py-3.5 border-b border-[#1b3d30] block transition-colors"
                >
                  Buyer guides
                </Link>
              </nav>

              {/* Right Column: Browse by property type */}
              <section className="site-menu-properties md:col-span-7 flex flex-col" aria-labelledby="site-menu-title">
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#cca462] font-bold mb-2">
                  EXPLORE OUR LISTINGS
                </p>
                <h2 id="site-menu-title" className="font-serif text-3xl sm:text-4xl text-[#f6f1e8] font-normal mb-6 leading-tight">
                  Browse by property type
                </h2>

                {/* Sub-grid with 2 parallel columns matching reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 w-full border-t border-[#1b3d30]">
                  {/* Column 1 */}
                  <div className="flex flex-col">
                    <Link
                      href="/properties"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>All properties</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/properties?type=semi-detached#browse"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>Semi-detached duplexes</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/properties?type=apartment#browse"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>Apartments &amp; penthouses</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/properties?type=bungalow#browse"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>Bungalows</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/properties?type=commercial#browse"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>Commercial property</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                  </div>

                  {/* Column 2 */}
                  <div className="flex flex-col">
                    <Link
                      href="/properties?type=terrace-duplex#browse"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>Terrace duplexes</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/properties?type=fully-detached#browse"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>Fully detached duplexes</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/properties?type=off-plan#browse"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>Off-plan properties</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/properties?type=land#browse"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#dbe5e1] hover:text-[#cca462] transition-colors"
                    >
                      <span>Land</span>
                      <span className="text-[#cca462]" aria-hidden="true">→</span>
                    </Link>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.mirvai.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      className="py-3.5 border-b border-[#1b3d30] flex items-center justify-between text-sm sm:text-base font-semibold text-[#cca462] hover:text-white transition-colors"
                    >
                      <span>Download Mirvai App (Play Store)</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>

                {/* Theme switch & Android notice */}
                <div className="mt-8 pt-4 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleToggleTheme}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#cca462]/40 bg-[#061810] text-[#cca462] hover:border-[#cca462] text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    {currentTheme === 'dark' ? (
                      <>
                        <span aria-hidden="true">☀️</span>
                        <span>Switch to Light Theme</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">🌙</span>
                        <span>Switch to Dark Theme</span>
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-[#8fa89c]">
                    Mirvai Android App v2.4 Available on Google Play
                  </span>
                </div>
              </section>
            </div>

            {/* Menu Footer */}
            <footer className="site-menu-footer">
              <p>Can’t find exactly what you want? Tell us your preferred property, location and budget.</p>
              <Link href="/#enquire" onClick={close}>Send requirements</Link>
              <a href={`https://wa.me/${WA}`} onClick={close} target="_blank" rel="noopener noreferrer">WhatsApp Advisory</a>
            </footer>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
