import React from 'react';
import { X, Globe2, Video, FileCheck, Layers, ArrowRight } from 'lucide-react';

interface DiasporaDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: () => void;
  onOpenBrief: () => void;
}

export const DiasporaDeskModal: React.FC<DiasporaDeskModalProps> = ({
  isOpen,
  onClose,
  onStartChat,
  onOpenBrief,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0e1f16] border border-[#183324] rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#82998c] hover:text-[#d5a55d] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#14291e] border border-[#d5a55d]/40 flex items-center justify-center mx-auto text-[#d5a55d] mb-2.5">
            <Globe2 className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#f0eee8]">
            Mirvai Diaspora Desk
          </h2>
          <p className="text-xs text-[#82998c] mt-1 max-w-sm mx-auto">
            Dedicated advisory &amp; remote inspection infrastructure for Nigerians living in the UK, US, Canada, Europe, and UAE.
          </p>
        </div>

        {/* 3-Pillar Guarantee */}
        <div className="space-y-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#08170f] border border-[#183324] flex items-start gap-3">
            <Video className="w-5 h-5 text-[#d5a55d] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#f0eee8]">1. Uncut 4K Live Drone Inspection</h4>
              <p className="text-xs text-[#82998c] mt-0.5 leading-relaxed">
                We fly licensed 4K camera drones over the perimeter, neighboring developments, and access roads so you see the real environment without filters.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#08170f] border border-[#183324] flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-[#d5a55d] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#f0eee8]">2. Ministry Legal Title Searches</h4>
              <p className="text-xs text-[#82998c] mt-0.5 leading-relaxed">
                Our in-house conveyancing solicitors verify Certificate of Occupancy (C of O), Governor’s Consent, and Survey Beacon coordinates directly at the State Lands Registry.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#08170f] border border-[#183324] flex items-start gap-3">
            <Layers className="w-5 h-5 text-[#d5a55d] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#f0eee8]">3. Regulated Milestone Escrow</h4>
              <p className="text-xs text-[#82998c] mt-0.5 leading-relaxed">
                Funds are held in an audited trustee bank account and released in installments only after verified survey handover and signed deeds.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              onClose();
              onStartChat();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#101f16] font-bold text-xs tracking-wide transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Chat with Diaspora Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenBrief();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-[#0e1f16] hover:bg-[#14291e] border border-[#183324] text-[#d5a55d] font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Submit Property Brief</span>
          </button>
        </div>
      </div>
    </div>
  );
};
