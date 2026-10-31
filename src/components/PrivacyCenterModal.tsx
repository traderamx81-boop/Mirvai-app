import React from 'react';
import { X, ShieldCheck, EyeOff, Lock, Download, Trash2, CheckCircle2, AlertTriangle, FileLock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MirvaiLogo } from './MirvaiLogo';

interface PrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({ isOpen, onClose }) => {
  const { user, togglePrivacyMode, exportUserData, clearUserData } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0b1b13] border border-[#1f4230] rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0e2117] border border-[#1d3d2c] flex items-center justify-center text-[#8fa397] hover:text-[#cca25d]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Crest */}
        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-[#122b1e] border border-[#cca25d]/40 flex items-center justify-center mx-auto text-[#cca25d] mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#f2e7d3]">
            Data Privacy &amp; Security Vault
          </h2>
          <p className="text-xs text-[#82998b] mt-1 max-w-xs mx-auto">
            Mirvai enforces zero-tracking, client anonymization, and local data sovereignty.
          </p>
        </div>

        {/* Security Pillars */}
        <div className="space-y-2.5 pt-1">
          <div className="p-3.5 rounded-2xl bg-[#091710] border border-[#183626] flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-[#f0e7d5]">Zero Third-Party Trackers</p>
              <p className="text-[#8fa397] mt-0.5">
                We do not use Google Analytics, Meta Pixels, or telemetry cookies. Your browsing habits remain completely confidential.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#091710] border border-[#183626] flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-[#cca25d] shrink-0 mt-0.5" />
            <div className="text-xs flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#f0e7d5]">Client Privacy Relay</p>
                <button
                  onClick={togglePrivacyMode}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user.privacyMode
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {user.privacyMode ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
              <p className="text-[#8fa397] mt-0.5">
                When active, your phone and email are masked with a secure relay during preliminary property vetting.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#091710] border border-[#183626] flex items-start gap-3">
            <FileLock className="w-4 h-4 text-[#cca25d] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-[#f0e7d5]">Isolated Document Vault</p>
              <p className="text-[#8fa397] mt-0.5">
                Your land titles, deeds of assignment, and survey extracts are retained solely in client-side secure sandbox storage.
              </p>
            </div>
          </div>
        </div>

        {/* Data Actions */}
        <div className="pt-2 space-y-2">
          <button
            onClick={exportUserData}
            className="w-full py-3 rounded-2xl bg-[#142e20] hover:bg-[#1a3d2c] border border-[#cca25d]/40 text-xs font-semibold text-[#dfb877] flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-[#cca25d]" />
            <span>Download My Personal Vault (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to purge all local search history, briefs, and chat records?')) {
                clearUserData();
                onClose();
              }
            }}
            className="w-full py-2.5 rounded-2xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Purge All Local Records &amp; Reset</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-[10px] text-[#6d8275]">
            Mirvai Realty &amp; Investment · Compliant with NDPR &amp; GDPR standards.
          </p>
        </div>
      </div>
    </div>
  );
};
