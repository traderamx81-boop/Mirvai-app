import React from 'react';
import { X, FileText, Download, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DocumentVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentVaultModal: React.FC<DocumentVaultModalProps> = ({ isOpen, onClose }) => {
  const { documents } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0b1b13] border border-[#1f4230] rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0e2117] border border-[#1d3d2c] flex items-center justify-center text-[#8fa397] hover:text-[#cca25d]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pt-1">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#cca25d]" />
            <h2 className="font-editorial text-2xl font-bold text-[#f2e7d3]">
              My Documents Vault
            </h2>
          </div>
          <p className="text-xs text-[#82998b] mt-0.5">
            Verified title extracts, cadastral survey coordinates &amp; transaction deeds.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-[#091710] border border-[#1b3a2a] space-y-2 hover:border-[#cca25d]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#142e20] text-[#cca25d] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#f0e7d5] leading-snug">
                      {doc.title}
                    </h4>
                    <span className="text-[10px] text-[#cca25d] font-semibold uppercase tracking-wider block mt-0.5">
                      {doc.type}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold shrink-0">
                  VERIFIED
                </span>
              </div>

              <div className="text-[11px] text-[#7d9586] flex items-center justify-between pt-1 border-t border-[#142a1f]">
                <span>Issued: {doc.date} · {doc.fileSize}</span>
                <span className="truncate max-w-[160px]">{doc.verifiedBy}</span>
              </div>

              <button
                onClick={() => alert(`Downloading verified legal bundle: ${doc.title}`)}
                className="w-full py-2 rounded-xl bg-[#12281e] hover:bg-[#1a382a] text-[#cca25d] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Encrypted Extract</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
