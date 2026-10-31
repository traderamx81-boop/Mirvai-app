import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { PropertiesTab } from './components/PropertiesTab';
import { EnquiryTab } from './components/EnquiryTab';
import { MessagesTab } from './components/MessagesTab';
import { AccountTab } from './components/AccountTab';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AuthModal } from './components/AuthModal';
import { PrivacyCenterModal } from './components/PrivacyCenterModal';
import { DiasporaDeskModal } from './components/DiasporaDeskModal';
import { DocumentVaultModal } from './components/DocumentVaultModal';
import { AppointmentsModal } from './components/AppointmentsModal';
import { SavedPropertiesModal } from './components/SavedPropertiesModal';
import { InstallAppBanner } from './components/InstallAppBanner';
import { PROPERTIES } from './data/propertiesData';
import { Property } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [diasporaModalOpen, setDiasporaModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [preselectedTypeForEnquiry, setPreselectedTypeForEnquiry] = useState<string>('Terrace duplex');

  const { authModalOpen, setAuthModalOpen, privacyModalOpen, setPrivacyModalOpen } = useAuth();

  const selectedProperty = selectedPropertyId
    ? PROPERTIES.find(p => p.id === selectedPropertyId) || null
    : null;

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  const handleEnquireFromProperty = (property: Property) => {
    setSelectedPropertyId(null);
    setPreselectedTypeForEnquiry(property.categoryLabel);
    setActiveTab('enquiry');
  };

  const handleScheduleInspectionFromProperty = (property: Property) => {
    setSelectedPropertyId(null);
    setAppointmentsModalOpen(true);
  };

  const handleBackToHome = () => {
    setActiveTab('home');
  };

  // If activeTab is messages, the chat takes over the ENTIRE page
  const isChatActive = activeTab === 'messages';

  return (
    <div className="min-h-screen bg-[#07130e] text-[#e3ece7] flex flex-col items-center justify-start relative w-full overflow-x-hidden selection:bg-[#cca25d]/30 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#163324]/20 blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#cca25d]/8 blur-[160px]" />
      </div>

      {/* When chat is active, it takes over the entire viewport without outer header interference */}
      {isChatActive ? (
        <div className="w-full h-[100dvh] flex flex-col justify-between z-30">
          <MessagesTab
            onBack={handleBackToHome}
            onNavigateTab={setActiveTab}
            onOpenDiasporaModal={() => setDiasporaModalOpen(true)}
            onOpenBrief={() => setActiveTab('enquiry')}
          />
        </div>
      ) : (
        <>
          {/* PWA App Install Banner */}
          <InstallAppBanner />

          {/* App Header */}
          <div className="w-full z-40 bg-[#07130e]/95 backdrop-blur-md">
            <div className="w-full max-w-7xl mx-auto">
              <Header
                currentTab={activeTab}
                showBack={activeTab !== 'home'}
                onBack={handleBackToHome}
              />
            </div>
          </div>

          {/* Dynamic Main App Body */}
          <main
            className={`w-full flex-1 relative z-10 transition-all duration-300 px-3 sm:px-6 md:px-8 py-2 ${
              activeTab === 'properties'
                ? 'max-w-7xl mx-auto'
                : 'max-w-3xl mx-auto'
            }`}
          >
            {activeTab === 'home' && (
              <HomeTab
                onNavigateTab={setActiveTab}
                onSelectProperty={handleSelectProperty}
                onOpenDiasporaModal={() => setDiasporaModalOpen(true)}
              />
            )}

            {activeTab === 'properties' && (
              <PropertiesTab
                onBack={handleBackToHome}
                onSelectProperty={handleSelectProperty}
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
                onNavigateTab={setActiveTab}
                onOpenDocuments={() => setDocumentsModalOpen(true)}
                onOpenAppointments={() => setAppointmentsModalOpen(true)}
                onOpenSaved={() => setSavedModalOpen(true)}
                onOpenEnquiries={() => setActiveTab('enquiry')}
              />
            )}
          </main>

          {/* Modern App Bottom Navigation Bar */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </>
      )}

      {/* Modals & Dialogs */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedPropertyId(null)}
        onEnquire={handleEnquireFromProperty}
        onScheduleInspection={handleScheduleInspectionFromProperty}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
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
          setActiveTab('messages');
        }}
        onOpenBrief={() => {
          setDiasporaModalOpen(false);
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
