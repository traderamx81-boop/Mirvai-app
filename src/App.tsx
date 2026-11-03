import React, { useState, useEffect } from 'react';
import { MirvaiWebsiteLanding } from './components/MirvaiWebsiteLanding';
import { MirvaiWebsiteProperties } from './components/MirvaiWebsiteProperties';
import { MirvaiWebsitePropertyDetail } from './components/MirvaiWebsitePropertyDetail';
import { MirvaiWebsiteGuides } from './components/MirvaiWebsiteGuides';
import { MirvaiWebsiteGuideDetail } from './components/MirvaiWebsiteGuideDetail';
import { MirvaiWebsitePrivacy } from './components/MirvaiWebsitePrivacy';

type WebsiteSubPage = 'home' | 'properties' | 'property-detail' | 'guides' | 'guide-detail' | 'privacy';

export default function App() {
  const [websiteSubPage, setWebsiteSubPage] = useState<WebsiteSubPage>('home');
  const [activeSlug, setActiveSlug] = useState<string>('');

  // Automatic system theme detection with user manual toggle support
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const pref = localStorage.getItem('mirvai_theme_preference');
      if (pref === 'dark' || pref === 'light') return pref;
    } catch {}
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('mirvai_theme_preference')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Listen for theme toggle events
  useEffect(() => {
    const handleThemeToggle = () => {
      setTheme(prev => {
        const next = prev === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem('mirvai_theme_preference', next);
        } catch {}
        return next;
      });
    };

    window.addEventListener('mirvai:theme-toggle', handleThemeToggle);
    return () => {
      window.removeEventListener('mirvai:theme-toggle', handleThemeToggle);
    };
  }, []);

  // Listen for navigation events emitted by website-source Next.js Link shims
  useEffect(() => {
    const handleNav = (e?: Event) => {
      const customEvent = e as CustomEvent<{ href: string }> | undefined;
      const href = customEvent?.detail?.href || (typeof window !== 'undefined' ? window.location.pathname + window.location.search + window.location.hash : '');

      if (href.startsWith('/properties/') && !href.startsWith('/properties?')) {
        const pathPart = href.split('?')[0].split('#')[0];
        const slug = pathPart.replace('/properties/', '');
        setWebsiteSubPage('property-detail');
        setActiveSlug(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '/properties' || href.startsWith('/properties?') || href.startsWith('/properties#')) {
        setWebsiteSubPage('properties');
        if (href.includes('#browse')) {
          setTimeout(() => {
            const el = document.getElementById('browse');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (href.startsWith('/guides/') && !href.startsWith('/guides?')) {
        const pathPart = href.split('?')[0].split('#')[0];
        const slug = pathPart.replace('/guides/', '');
        setWebsiteSubPage('guide-detail');
        setActiveSlug(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '/guides' || href.startsWith('/guides?') || href.startsWith('/guides#')) {
        setWebsiteSubPage('guides');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href.startsWith('/privacy')) {
        setWebsiteSubPage('privacy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Home page or home section anchor (/ , /#about, /#services, /#faq, /#enquire, #about, etc.)
        setWebsiteSubPage('home');

        const hashIndex = href.indexOf('#');
        if (hashIndex !== -1) {
          const targetId = href.substring(hashIndex + 1);
          if (targetId && targetId !== 'top') {
            setTimeout(() => {
              const el = document.getElementById(targetId);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }, 120);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('mirvai:navigate', handleNav);
    window.addEventListener('popstate', handleNav);
    return () => {
      window.removeEventListener('mirvai:navigate', handleNav);
      window.removeEventListener('popstate', handleNav);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#06130b] text-[#e2ede6] flex flex-col items-center justify-start relative w-full overflow-x-hidden selection:bg-[#d5a55d]/30 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#11261b]/30 blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#d5a55d]/5 blur-[160px]" />
      </div>

      {/* OFFICIAL MIRVAI WEBSITE */}
      <div
        className={`w-full mirvai-website-container ${theme === 'dark' ? 'theme-dark' : 'theme-light'} relative z-10 transition-colors duration-300`}
        data-theme={theme}
      >
        {websiteSubPage === 'home' && <MirvaiWebsiteLanding />}
        {websiteSubPage === 'properties' && <MirvaiWebsiteProperties />}
        {websiteSubPage === 'property-detail' && <MirvaiWebsitePropertyDetail slug={activeSlug} />}
        {websiteSubPage === 'guides' && <MirvaiWebsiteGuides />}
        {websiteSubPage === 'guide-detail' && <MirvaiWebsiteGuideDetail slug={activeSlug} />}
        {websiteSubPage === 'privacy' && <MirvaiWebsitePrivacy />}
      </div>
    </div>
  );
}
