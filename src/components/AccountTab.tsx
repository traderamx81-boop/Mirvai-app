import React, { useRef } from 'react';
import { ChevronLeft, ArrowRight, ShieldCheck, Camera, Bookmark, FileText, Calendar, FolderLock, MessageSquare, KeyRound, LogOut, Download, Trash2, CheckCircle2 } from 'lucide-react';
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
    clearUserData,
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
    <div className="space-y-5 pb-28 pt-2">
      {/* Header matching Screenshot 5 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            aria-label="Back to home"
            className="w-10 h-10 rounded-full bg-[#0d2117] border border-[#1d3d2c] flex items-center justify-center text-[#dfb877] hover:bg-[#132f21] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-editorial text-3xl font-bold text-[#f2e7d3]">
              Client dashboard
            </h1>
            <p className="text-xs text-[#82998b] mt-0.5">
              Your profile, property journey and documents
            </p>
          </div>
        </div>

        <button
          onClick={() => setPrivacyModalOpen(true)}
          className="p-2 rounded-full bg-[#0d2117] border border-[#1d3d2c] text-[#cca25d] hover:bg-[#153424]"
          title="Data Privacy Vault"
        >
          <ShieldCheck className="w-5 h-5" />
        </button>
      </div>

      {/* Main Profile & Journey Card matching Screenshot 5 */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0d2117] border border-[#1c3c2b] shadow-xl space-y-5">
        <div className="flex items-center gap-4">
          {/* Avatar with MC or uploaded image */}
          <div className="relative w-16 h-16 rounded-full bg-[#0a1811] border-2 border-[#cca25d]/60 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif text-xl font-bold text-[#dfb877]">
                MC
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#f2e7d3]">
              {user.name}
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 rounded-full bg-[#13281e] border border-[#cca25d]/40 text-[#dfb877] text-xs font-semibold hover:bg-[#1b3a2a] transition-colors flex items-center gap-1.5"
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
          <h2 className="font-editorial text-2xl font-bold text-[#f2e7d3]">
            Your property journey
          </h2>
          <p className="text-xs text-[#9eb6a7] leading-relaxed mt-1">
            Save properties, follow enquiries, manage inspection appointments and keep important transaction documents together.
          </p>
        </div>
      </div>

      {/* Menu Rows matching Screenshot 5 */}
      <div className="rounded-3xl bg-[#0d2117] border border-[#1c3c2b] divide-y divide-[#183626] overflow-hidden shadow-lg">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-[#122b1f] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#f0e7d5] group-hover:text-[#dfb877] transition-colors">
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#163324] border border-[#244b36] text-[10px] text-[#cca25d] font-semibold">
                  {item.count}
                </span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-[#759080] group-hover:text-[#cca25d] group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* Authentication & Privacy Management Panel */}
      <div className="p-4 rounded-3xl bg-[#091710] border border-[#1b3a2a] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#cca25d]" />
            <h4 className="text-xs font-bold text-[#f2e7d3]">Authentication &amp; Data Security</h4>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Active Session
          </span>
        </div>

        <div className="text-[11px] text-[#8fa397] space-y-1">
          <p><strong className="text-[#cad8cf]">Method:</strong> {user.authMethod.toUpperCase()} (Biometric / Passkey Ready)</p>
          <p><strong className="text-[#cad8cf]">Email:</strong> {user.email}</p>
          <p><strong className="text-[#cad8cf]">Zero-Knowledge Shield:</strong> Enabled (No 3P tracking or shared data)</p>
        </div>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#142e20] border border-[#cca25d]/40 text-[#dfb877] font-semibold hover:bg-[#1a3d2c]"
          >
            Manage Auth / Switch
          </button>
          <button
            onClick={() => setPrivacyModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#142e20] border border-[#1f4230] text-[#9eb6a7] font-semibold hover:text-[#f2e7d3]"
          >
            Privacy Controls
          </button>
          <button
            onClick={exportUserData}
            className="px-3 py-1.5 rounded-xl bg-[#142e20] border border-[#1f4230] text-[#9eb6a7] font-semibold hover:text-[#f2e7d3] flex items-center gap-1"
          >
            <Download className="w-3 h-3 text-[#cca25d]" />
            Export Vault
          </button>
        </div>
      </div>

      {/* Local Preview Disclaimer matching Screenshot 5 */}
      <p className="text-center text-[10px] text-[#6d8275] pt-1">
        Photo upload works locally for this preview and is not sent or stored.
      </p>
    </div>
  );
};
