import React from 'react';
import { X, Globe2, ShieldCheck, Video, FileCheck, Layers, ArrowRight } from 'lucide-react';
import { MirvaiLogo } from './MirvaiLogo';

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
      <div className="w-full max-w-lg bg-[#0b1b13] border border-[#1f4230] rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0e2117] border border-[#1d3d2c] flex items-center justify-center text-[#8fa397] hover:text-[#cca25d]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#132c1f] border border-[#cca25d]/40 flex items-center justify-center mx-auto text-[#dfb877] mb-2.5">
            <Globe2 className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#f2e7d3]">
            Mirvai Diaspora Desk
          </h2>
          <p className="text-xs text-[#82998b] mt-1 max-w-sm mx-auto">
            Dedicated advisory &amp; remote inspection infrastructure for Nigerians living in the UK, US, Canada, Europe, and UAE.
          </p>
        </div>

        {/* 3-Pillar Guarantee */}
        <div className="space-y-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#091710] border border-[#183626] flex items-start gap-3">
            <Video className="w-5 h-5 text-[#cca25d] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#f0e7d5]">1. Uncut 4K Live Drone Inspection</h4>
              <p className="text-xs text-[#8fa397] mt-0.5 leading-relaxed">
                We fly licensed 4K camera drones over the perimeter, neighboring developments, and access roads so you see the real environment without filters.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#091710] border border-[#183626] flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-[#cca25d] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#f0e7d5]">2. Ministry Legal Title Searches</h4>
              <p className="text-xs text-[#8fa397] mt-0.5 leading-relaxed">
                Our in-house conveyancing solicitors verify Certificate of Occupancy (C of O), Governor’s Consent, and Survey Beacon coordinates directly at the State Lands Registry.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#091710] border border-[#183626] flex items-start gap-3">
            <Layers className="w-5 h-5 text-[#cca25d] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#f0e7d5]">3. Regulated Milestone Escrow</h4>
              <p className="text-xs text-[#8fa397] mt-0.5 leading-relaxed">
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
            className="flex-1 py-3.5 rounded-2xl bg-[#cca25d] hover:bg-[#d8b06b] text-[#0a1711] font-bold text-xs tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>Chat with Diaspora Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenBrief();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-[#142e20] hover:bg-[#1b3d2b] border border-[#1f4230] text-[#dfb877] font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Submit Property Brief</span>
          </button>
        </div>
      </div>
    </div>
  );
};
