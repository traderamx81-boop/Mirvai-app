import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { PropertiesTab } from './components/PropertiesTab';
import { EnquiryTab } from './components/EnquiryTab';
import { MessagesTab } from './components/MessagesTab';
import { AccountTab } from './components/AccountTab';
import { EcosystemMenuDrawer } from './components/EcosystemMenuDrawer';
import { RealtyDivision } from './components/divisions/RealtyDivision';
import { DevelopmentsDivision } from './components/divisions/DevelopmentsDivision';
import { ConstructionDivision } from './components/divisions/ConstructionDivision';
import { TechnologyDivision } from './components/divisions/TechnologyDivision';
import { EnergyDivision } from './components/divisions/EnergyDivision';
import { CommunitiesDivision } from './components/divisions/CommunitiesDivision';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AuthModal } from './components/AuthModal';
import { PrivacyCenterModal } from './components/PrivacyCenterModal';
import { DiasporaDeskModal } from './components/DiasporaDeskModal';
import { DocumentVaultModal } from './components/DocumentVaultModal';
import { AppointmentsModal } from './components/AppointmentsModal';
import { SavedPropertiesModal } from './components/SavedPropertiesModal';
import { InstallAppBanner } from './components/InstallAppBanner';
import { MirvaiWebsiteLanding } from './components/MirvaiWebsiteLanding';
import { MirvaiWebsiteProperties } from './components/MirvaiWebsiteProperties';
import { MirvaiWebsiteGuides } from './components/MirvaiWebsiteGuides';
import { MirvaiWebsitePrivacy } from './components/MirvaiWebsitePrivacy';
import { PROPERTIES } from './data/propertiesData';
import { Property, PropertyCategory, DivisionId } from './types';

const AppContent: React.FC = () => {
  // 'website' is the default landing page of the application as requested
  const [currentMode, setCurrentMode] = useState<'website' | 'app'>('website');
  const [websiteSubPage, setWebsiteSubPage] = useState<'home' | 'properties' | 'guides' | 'privacy'>('home');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentDivision, setCurrentDivision] = useState<DivisionId | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedCategoryForProperties, setSelectedCategoryForProperties] = useState<PropertyCategory>('All');
  const [diasporaModalOpen, setDiasporaModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [preselectedTypeForEnquiry, setPreselectedTypeForEnquiry] = useState<string>('Terrace duplex');

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
      // If user hasn't explicitly set a preference, follow system
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

  const {
    user,
    authModalOpen,
    setAuthModalOpen,
    openAuthModal,
    logout,
    privacyModalOpen,
    setPrivacyModalOpen,
  } = useAuth();

  // Listen for auth, portal, and theme events dispatched from menu
  useEffect(() => {
    const handleAuthEvent = (e: Event) => {
      const custom = e as CustomEvent<{ mode: 'login' | 'signup' }>;
      openAuthModal(custom.detail?.mode || 'login');
    };

    const handleOpenPortal = () => {
      setCurrentMode('app');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleThemeToggle = () => {
      setTheme(prev => {
        const next = prev === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem('mirvai_theme_preference', next);
        } catch {}
        return next;
      });
    };

    const handleOpenDivision = (e: Event) => {
      const custom = e as CustomEvent<{ division: DivisionId }>;
      if (custom.detail?.division) {
        setCurrentMode('app');
        setCurrentDivision(custom.detail.division);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('mirvai:auth', handleAuthEvent);
    window.addEventListener('mirvai:open-portal', handleOpenPortal);
    window.addEventListener('mirvai:theme-toggle', handleThemeToggle);
    window.addEventListener('mirvai:open-division', handleOpenDivision);
    return () => {
      window.removeEventListener('mirvai:auth', handleAuthEvent);
      window.removeEventListener('mirvai:open-portal', handleOpenPortal);
      window.removeEventListener('mirvai:theme-toggle', handleThemeToggle);
      window.removeEventListener('mirvai:open-division', handleOpenDivision);
    };
  }, [openAuthModal]);

  // Listen for navigation events emitted by website-source Next.js Link shims
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      const href = customEvent.detail?.href || '';

      if (href.startsWith('/properties')) {
        setCurrentMode('website');
        setWebsiteSubPage('properties');
        if (href.includes('#browse')) {
          setTimeout(() => {
            const el = document.getElementById('browse');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (href.startsWith('/guides')) {
        setCurrentMode('website');
        setWebsiteSubPage('guides');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href.startsWith('/privacy')) {
        setCurrentMode('website');
        setWebsiteSubPage('privacy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '/app') {
        setCurrentMode('app');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Home page or home section anchor (/ , /#about, /#services, /#faq, /#enquire, #about, etc.)
        setCurrentMode('website');
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
    return () => window.removeEventListener('mirvai:navigate', handleNav);
  }, []);

  const selectedProperty = selectedPropertyId
    ? PROPERTIES.find(p => p.id === selectedPropertyId) || null
    : null;

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  const handleEnquireFromProperty = (property: Property) => {
    setSelectedPropertyId(null);
    setCurrentDivision(null);
    setPreselectedTypeForEnquiry(property.categoryLabel);
    setActiveTab('enquiry');
  };

  const handleScheduleInspectionFromProperty = (property: Property) => {
    setSelectedPropertyId(null);
    setAppointmentsModalOpen(true);
  };

  const handleBackToHome = () => {
    setCurrentDivision(null);
    setActiveTab('home');
  };

  const handleGoToHomeOverview = () => {
    setCurrentDivision(null);
    setCurrentMode('website');
    setWebsiteSubPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDivision = (divisionId: DivisionId) => {
    setCurrentDivision(divisionId);
    setIsMenuOpen(false);
  };

  const handleTabChange = (tab: TabType) => {
    setCurrentDivision(null);
    setActiveTab(tab);
  };

  const isChatActive = activeTab === 'messages' && currentDivision === null && currentMode === 'app';

  return (
    <div className="min-h-screen bg-[#06130b] text-[#e2ede6] flex flex-col items-center justify-start relative w-full overflow-x-hidden selection:bg-[#d5a55d]/30 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#11261b]/30 blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#d5a55d]/5 blur-[160px]" />
      </div>

      {/* Mode 1: OFFICIAL WEBSITE SOURCE LANDING PAGE */}
      {currentMode === 'website' ? (
        <div
          className={`w-full mirvai-website-container ${theme === 'dark' ? 'theme-dark' : 'theme-light'} relative z-10 transition-colors duration-300`}
          data-theme={theme}
        >

          {/* Render website-source pages */}
          {websiteSubPage === 'home' && <MirvaiWebsiteLanding />}
          {websiteSubPage === 'properties' && <MirvaiWebsiteProperties />}
          {websiteSubPage === 'guides' && <MirvaiWebsiteGuides />}
          {websiteSubPage === 'privacy' && <MirvaiWebsitePrivacy />}
        </div>
      ) : (
        /* Mode 2: MIRVAI CLIENT APP & ECOSYSTEM PORTAL */
        <>
          {/* When chat is active, it takes over the entire viewport */}
          {isChatActive ? (
            <div className="w-full h-[100dvh] flex flex-col justify-between z-30">
              <MessagesTab
                onBack={handleBackToHome}
                onNavigateTab={handleTabChange}
                onOpenDiasporaModal={() => setDiasporaModalOpen(true)}
                onOpenBrief={() => {
                  setCurrentDivision(null);
                  setActiveTab('enquiry');
                }}
              />
            </div>
          ) : (
            <>
              {/* PWA App Install Banner */}
              <InstallAppBanner />

              {/* App Header (shown when not inside a division with its own top title) */}
              {currentDivision === null && (
                <div className="w-full z-40 bg-[#06130b]/95 backdrop-blur-md">
                  <div className="w-full max-w-7xl mx-auto">
                    <Header
                      currentTab={activeTab}
                      showBack={activeTab !== 'home'}
                      onBack={handleBackToHome}
                      onOpenMenu={() => setIsMenuOpen(true)}
                      onViewWebsite={() => {
                        setCurrentMode('website');
                        setWebsiteSubPage('home');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Main App Body */}
              <main
                className={`w-full flex-1 relative z-10 transition-all duration-300 px-3 sm:px-6 md:px-8 py-2 ${
                  activeTab === 'properties' && currentDivision === null
                    ? 'max-w-7xl mx-auto'
                    : 'max-w-3xl mx-auto'
                }`}
              >
                {/* Division Pages Matching Screenshots */}
                {currentDivision === 'realty' && (
                  <RealtyDivision
                    onOpenMenu={() => setIsMenuOpen(true)}
                    onExploreProperties={cat => {
                      setSelectedCategoryForProperties(cat || 'All');
                      setCurrentDivision(null);
                      setActiveTab('properties');
                    }}
                    onOpenEnquiry={catLabel => {
                      setPreselectedTypeForEnquiry(catLabel);
                      setCurrentDivision(null);
                      setActiveTab('enquiry');
                    }}
                  />
                )}

                {currentDivision === 'developments' && (
                  <DevelopmentsDivision
                    onOpenMenu={() => setIsMenuOpen(true)}
                    onOpenEnquiry={catLabel => {
                      setPreselectedTypeForEnquiry(catLabel);
                      setCurrentDivision(null);
                      setActiveTab('enquiry');
                    }}
                  />
                )}

                {currentDivision === 'construction' && (
                  <ConstructionDivision
                    onOpenMenu={() => setIsMenuOpen(true)}
                    onOpenMessages={() => {
                      setCurrentDivision(null);
                      setActiveTab('messages');
                    }}
                  />
                )}

                {currentDivision === 'technology' && (
                  <TechnologyDivision
                    onOpenMenu={() => setIsMenuOpen(true)}
                    onOpenPrivacyCenter={() => setPrivacyModalOpen(true)}
                  />
                )}

                {currentDivision === 'energy' && (
                  <EnergyDivision
                    onOpenMenu={() => setIsMenuOpen(true)}
                    onOpenEnquiry={catLabel => {
                      setPreselectedTypeForEnquiry(catLabel);
                      setCurrentDivision(null);
                      setActiveTab('enquiry');
                    }}
                  />
                )}

                {currentDivision === 'communities' && (
                  <CommunitiesDivision
                    onOpenMenu={() => setIsMenuOpen(true)}
                    onOpenEnquiry={catLabel => {
                      setPreselectedTypeForEnquiry(catLabel);
                      setCurrentDivision(null);
                      setActiveTab('enquiry');
                    }}
                  />
                )}

                {/* Standard Tab Navigation when no division is pinned */}
                {currentDivision === null && (
                  <>
                    {activeTab === 'home' && (
                      <HomeTab
                        onNavigateTab={(tab, cat) => {
                          if (cat) setSelectedCategoryForProperties(cat);
                          setActiveTab(tab);
                        }}
                        onSelectProperty={handleSelectProperty}
                        onOpenDiasporaModal={() => setDiasporaModalOpen(true)}
                      />
                    )}

                    {activeTab === 'properties' && (
                      <PropertiesTab
                        onBack={handleBackToHome}
                        onOpenMenu={() => setIsMenuOpen(true)}
                        onSelectProperty={handleSelectProperty}
                        initialCategory={selectedCategoryForProperties}
                      />
                    )}

                    {activeTab === 'enquiry' && (
                      <EnquiryTab
                        onBack={handleBackToHome}
                        preselectedPropertyType={preselectedTypeForEnquiry}
                      />
                    )}

                    {activeTab === 'account' && (
                      <AccountTab
                        onBack={handleBackToHome}
                        onNavigateTab={handleTabChange}
                        onOpenDocuments={() => setDocumentsModalOpen(true)}
                        onOpenAppointments={() => setAppointmentsModalOpen(true)}
                        onOpenSaved={() => setSavedModalOpen(true)}
                        onOpenEnquiries={() => {
                          setCurrentDivision(null);
                          setActiveTab('enquiry');
                        }}
                      />
                    )}
                  </>
                )}
              </main>

              {/* Modern App Bottom Navigation Bar */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </>
          )}

          {/* Mirvai Ecosystem Full Drawer Navigation */}
          <EcosystemMenuDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onSelectDivision={handleSelectDivision}
            onGoHome={handleGoToHomeOverview}
            onOpenWebsite={() => {
              setCurrentMode('website');
              setWebsiteSubPage('home');
            }}
            currentDivision={currentDivision}
          />
        </>
      )}

      {/* Modals & Dialogs (Always accessible across both modes) */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedPropertyId(null)}
        onEnquire={handleEnquireFromProperty}
        onScheduleInspection={handleScheduleInspectionFromProperty}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentMode('app');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <PrivacyCenterModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <DiasporaDeskModal
        isOpen={diasporaModalOpen}
        onClose={() => setDiasporaModalOpen(false)}
        onStartChat={() => {
          setDiasporaModalOpen(false);
          setCurrentMode('app');
          setCurrentDivision(null);
          setActiveTab('messages');
        }}
        onOpenBrief={() => {
          setDiasporaModalOpen(false);
          setCurrentMode('app');
          setCurrentDivision(null);
          setActiveTab('enquiry');
        }}
      />

      <DocumentVaultModal
        isOpen={documentsModalOpen}
        onClose={() => setDocumentsModalOpen(false)}
      />

      <AppointmentsModal
        isOpen={appointmentsModalOpen}
        onClose={() => setAppointmentsModalOpen(false)}
        preselectedPropertyTitle={selectedProperty?.title}
      />

      <SavedPropertiesModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        onSelectProperty={handleSelectProperty}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
