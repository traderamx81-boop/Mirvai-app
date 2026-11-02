import React, { useRef } from 'react';
import { ChevronLeft, ArrowRight, ShieldCheck, Camera, KeyRound, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TabType } from './BottomNav';

interface AccountTabProps {
  onBack: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenDocuments: () => void;
  onOpenAppointments: () => void;
  onOpenSaved: () => void;
  onOpenEnquiries: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  onBack,
  onNavigateTab,
  onOpenDocuments,
  onOpenAppointments,
  onOpenSaved,
  onOpenEnquiries,
}) => {
  const {
    user,
    updateProfilePhoto,
    savedPropertyIds,
    briefs,
    appointments,
    documents,
    setAuthModalOpen,
    setPrivacyModalOpen,
    exportUserData,
    logout,
  } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateProfilePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    {
      id: 'saved',
      label: 'Saved properties',
      count: savedPropertyIds.length,
      onClick: onOpenSaved,
    },
    {
      id: 'enquiries',
      label: 'My enquiries',
      count: briefs.length,
      onClick: onOpenEnquiries,
    },
    {
      id: 'inspections',
      label: 'Inspection appointments',
      count: appointments.length,
      onClick: onOpenAppointments,
    },
    {
      id: 'documents',
      label: 'My documents',
      count: documents.length,
      onClick: onOpenDocuments,
    },
    {
      id: 'messages',
      label: 'Messages and support',
      onClick: () => onNavigateTab('messages'),
    },
  ];

  return (
    <div className="space-y-5 pb-28 pt-2 w-full max-w-xl mx-auto">
      {/* Header matching Screenshot 5 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            aria-label="Back to home"
            className="w-10 h-10 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-editorial text-3xl font-bold text-[#f0eee8]">
              Client dashboard
            </h1>
            <p className="text-xs text-[#82998b] mt-0.5">
              Your profile, property journey and documents
            </p>
          </div>
        </div>

        <button
          onClick={() => setPrivacyModalOpen(true)}
          className="p-2 rounded-full bg-[#0e1f16] border border-[#183324] text-[#d5a55d] hover:bg-[#14291e] cursor-pointer"
          title="Data Privacy Vault"
        >
          <ShieldCheck className="w-5 h-5" />
        </button>
      </div>

      {/* Main Profile & Journey Card matching Screenshot 5 */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1f16] border border-[#183324] shadow-xl space-y-5">
        <div className="flex items-center gap-4">
          {/* Avatar with MC or uploaded image */}
          <div className="relative w-16 h-16 rounded-full bg-[#08170f] border-2 border-[#d5a55d]/40 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif text-xl font-bold text-[#d5a55d]">
                MC
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#f0eee8]">
              {user.name}
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 rounded-full bg-[#0e1f16] border border-[#d5a55d]/40 text-[#d5a55d] text-xs font-semibold hover:bg-[#14291e] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload profile photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Section Headline matching Screenshot 5 */}
        <div className="pt-2">
          <h2 className="font-editorial text-2xl font-bold text-[#f0eee8]">
            Your property journey
          </h2>
          <p className="text-xs text-[#82998b] leading-relaxed mt-1">
            Save properties, follow enquiries, manage inspection appointments and keep important transaction documents together.
          </p>
        </div>
      </div>

      {/* Menu Rows matching Screenshot 5 */}
      <div className="rounded-3xl bg-[#0e1f16] border border-[#183324] divide-y divide-[#14291e] overflow-hidden shadow-lg">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-[#12281d] transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#f0eee8] group-hover:text-[#d5a55d] transition-colors">
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#14291e] border border-[#1d3d2c] text-[10px] text-[#d5a55d] font-semibold">
                  {item.count}
                </span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-[#d5a55d] group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>

      {/* Authentication & Privacy Management Panel */}
      <div className="p-4 rounded-3xl bg-[#08170f] border border-[#183324] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#d5a55d]" />
            <h4 className="text-xs font-bold text-[#f0eee8]">Authentication &amp; Data Security</h4>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Active Session
          </span>
        </div>

        <div className="text-[11px] text-[#82998b] space-y-1">
          <p><strong className="text-[#c2d4c8]">Method:</strong> {user.authMethod.toUpperCase()} (Biometric / Passkey Ready)</p>
          <p><strong className="text-[#c2d4c8]">Email:</strong> {user.email}</p>
          <p><strong className="text-[#c2d4c8]">Zero-Knowledge Shield:</strong> Enabled (No 3P tracking)</p>
        </div>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#0e1f16] border border-[#d5a55d]/40 text-[#d5a55d] font-semibold hover:bg-[#14291e] cursor-pointer"
          >
            Manage Auth / Switch
          </button>
          <button
            onClick={() => setPrivacyModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#0e1f16] border border-[#183324] text-[#82998c] font-semibold hover:text-[#f0eee8] cursor-pointer"
          >
            Privacy Controls
          </button>
          <button
            onClick={exportUserData}
            className="px-3 py-1.5 rounded-xl bg-[#0e1f16] border border-[#183324] text-[#82998c] font-semibold hover:text-[#f0eee8] flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3 text-[#d5a55d]" />
            Export Vault
          </button>
          <button
            onClick={() => {
              logout();
              onBack();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#190e0e] border border-red-900/40 text-red-400 font-semibold hover:text-red-300 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Local Preview Disclaimer matching Screenshot 5 */}
      <p className="text-center text-[10px] text-[#63786b] pt-1">
        Photo upload works locally for this preview and is not sent or stored.
      </p>
    </div>
  );
};
