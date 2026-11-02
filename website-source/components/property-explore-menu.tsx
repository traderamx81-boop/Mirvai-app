"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { propertyCategories } from "@/lib/featured-property";
import MirvaiBrand from "@/components/mirvai-brand";

const WA = "2349011081436";

export default function PropertyExploreMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ isLoggedIn: boolean; name: string } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Sync active user
    const syncUser = () => {
      try {
        const saved = localStorage.getItem('mirvai_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

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

    syncUser();
    syncTheme();

    window.addEventListener("storage", syncUser);
    window.addEventListener("mirvai:auth-state-changed", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("mirvai:auth-state-changed", syncUser);
    };
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

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    close();
    window.dispatchEvent(new CustomEvent('mirvai:auth', { detail: { mode } }));
  };

  const handleOpenPortal = () => {
    close();
    window.dispatchEvent(new CustomEvent('mirvai:open-portal'));
  };

  const handleSignOut = () => {
    try {
      const saved = localStorage.getItem('mirvai_user');
      if (saved) {
        const u = JSON.parse(saved);
        u.isLoggedIn = false;
        localStorage.setItem('mirvai_user', JSON.stringify(u));
        setUser(u);
        window.dispatchEvent(new CustomEvent('mirvai:auth-state-changed'));
      }
    } catch (e) {
      console.warn(e);
    }
  };

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
        <span>Menu</span>
      </button>

      {open && createPortal(
        <div className="site-menu-overlay" id="mirvai-site-menu" role="dialog" aria-modal="true" aria-labelledby="site-menu-title">
          <div className="site-menu-shell max-w-lg">
            <header className="site-menu-top">
              <MirvaiBrand onClick={close} />
              <button className="site-menu-close" type="button" onClick={close} aria-label="Close menu" ref={closeButton}>
                <span aria-hidden="true">×</span> Close
              </button>
            </header>

            <div className="site-menu-body">
              <div className="flex flex-col gap-5">
                {/* 1. Client Portal & Authentication Card INSIDE Menu */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#081f15] border border-[#d5a55d]/40 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#d5a55d]">
                      Mirvai Private Client Portal
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {user?.isLoggedIn ? (
                    <div>
                      <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-10 h-10 rounded-full bg-[#133324] border border-[#d5a55d]/50 flex items-center justify-center font-bold text-sm text-[#f0eee8]">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#f0eee8] leading-tight m-0">{user.name}</p>
                          <small className="text-[10px] text-[#8ea89c] block mt-0.5">Verified Diaspora Investor</small>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          type="button"
                          onClick={handleOpenPortal}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#06130b] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Enter Client Portal</span>
                          <span aria-hidden="true">→</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="py-2 px-3 rounded-xl border border-[#214a36] text-[#b4c7be] hover:text-red-400 hover:border-red-400/40 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-[#cad8d0] mb-3 leading-relaxed">
                        Access verified title registry, schedule live 4K drone inspections, and track property acquisitions.
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleOpenAuth('login')}
                          className="py-2.5 px-3 rounded-xl border border-[#d5a55d]/60 text-[#f0eee8] hover:bg-[#143324] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>Log In</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAuth('signup')}
                          className="py-2.5 px-3 rounded-xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#06130b] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Sign In / Sign Up</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Theme Switcher Button INSIDE Menu */}
                  <div className="mt-3.5 pt-3 border-t border-[#163826] flex items-center justify-between">
                    <span className="text-[11px] text-[#9bb5a6] font-medium">Appearance Theme:</span>
                    <button
                      type="button"
                      onClick={handleToggleTheme}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d5a55d]/40 bg-[#06160e] text-[#d5a55d] hover:border-[#d5a55d] text-xs font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      {currentTheme === 'dark' ? (
                        <>
                          <span aria-hidden="true">☀️</span>
                          <span>Switch to White Theme</span>
                        </>
                      ) : (
                        <>
                          <span aria-hidden="true">🌙</span>
                          <span>Switch to Dark Theme</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Home Overview Button */}
                <Link
                  href="/"
                  onClick={close}
                  className="w-full p-3.5 rounded-2xl bg-[#092015] border border-[#1b3d2b] hover:border-[#d5a55d]/60 flex items-center justify-between text-left transition-all group no-underline"
                >
                  <span className="text-sm font-semibold text-[#f0eee8] group-hover:text-[#d5a55d] transition-colors">
                    Home overview
                  </span>
                  <span className="text-[#82998c] group-hover:text-[#d5a55d] group-hover:translate-x-1 transition-all text-sm font-bold">
                    →
                  </span>
                </Link>

                {/* 3. Primary Site Navigation Links */}
                <nav className="site-menu-primary" aria-label="Main navigation">
                  <p>Navigation</p>
                  <Link href="/properties" onClick={close}>All Verified Properties</Link>
                  <Link href="/#about" onClick={close}>About Mirvai &amp; Founder</Link>
                  <Link href="/#services" onClick={close}>How We Help</Link>
                  <Link href="/#faq" onClick={close}>Diaspora FAQ</Link>
                  <Link href="/guides" onClick={close}>Buyer Guides &amp; Insights</Link>
                  <Link href="/#enquire" onClick={close}>Make an Enquiry</Link>
                </nav>
              </div>

              {/* 4. Property Category Links */}
              <section className="site-menu-properties" aria-labelledby="site-menu-title">
                <p>Curated Portfolio</p>
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
              <Link href="/#enquire" onClick={close}>Send requirements</Link>
              <a href={`https://wa.me/${WA}`} onClick={close} target="_blank" rel="noopener noreferrer">WhatsApp Advisory</a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
