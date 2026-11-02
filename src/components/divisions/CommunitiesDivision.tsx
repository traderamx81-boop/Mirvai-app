import React, { useState } from 'react';
import { Menu, Home, Shield, TreePine, Users, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

interface CommunitiesDivisionProps {
  onOpenMenu: () => void;
  onOpenEnquiry?: (categoryLabel: string) => void;
}

export const CommunitiesDivision: React.FC<CommunitiesDivisionProps> = ({
  onOpenMenu,
  onOpenEnquiry,
}) => {
  const [pledgeSubmitted, setPledgeSubmitted] = useState(false);

  const pillars = [
    {
      title: 'Quality homes',
      desc: 'Thoughtfully planned living environments',
      detail: 'Architectural harmony, climate-conscious layouts, and acoustic privacy between residences.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      title: 'Infrastructure',
      desc: 'Dependable power, roads and water systems',
      detail: 'Subterranean cabling, uninterrupted potable water reticulation, and wide paved access boulevards.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      ),
    },
    {
      title: 'Sustainability',
      desc: 'Green spaces and energy-efficient design',
      detail: 'Canopy tree-lined jogging tracks, rainwater recycling, and communal solar microgrids.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M12 2L4 12h5v8h6v-8h5z" />
        </svg>
      ),
    },
    {
      title: 'Connected living',
      desc: 'Safe, community-oriented neighborhoods',
      detail: 'Access control with digital resident guest passes, private community parks, and family sports courts.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-28 pt-2">
      {/* Top circular menu button and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="w-11 h-11 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#f0eee8] tracking-tight">
            Mirvai Communities
          </h1>
          <p className="text-xs sm:text-sm text-[#829b8c] mt-0.5">
            Connected places for living
          </p>
        </div>
      </div>

      {/* Hero Card matching Screenshot */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#12271c] to-[#0c1c13] border border-[#1d3d2c] p-6 sm:p-7 overflow-hidden shadow-xl">
        <div className="absolute right-[-15px] bottom-[-30px] font-editorial text-[140px] font-black text-[#1b3d2b]/25 select-none pointer-events-none leading-none">
          M
        </div>

        <div className="relative z-10 space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c281e] border border-[#d5a55d]/40 text-[10px] font-bold tracking-widest text-[#d5a55d] uppercase">
            FUTURE DIVISION
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8]">
            Mirvai Communities
          </h2>

          <p className="text-xs sm:text-sm text-[#a4baa9] leading-relaxed max-w-lg">
            A vision for connected, managed residential communities that combine quality homes, dependable services and long-term care.
          </p>
        </div>
      </div>

      {/* Community vision - 4 cards */}
      <div className="space-y-3.5 pt-2">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8]">
          Community vision
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {pillars.map((mod, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0e1f16] border border-[#183324] hover:border-[#d5a55d]/40 transition-all text-left flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#06130b] border border-[#183324] flex items-center justify-center mb-3">
                  {mod.icon}
                </div>
                <h4 className="font-editorial text-base sm:text-lg font-bold text-[#f0eee8]">
                  {mod.title}
                </h4>
                <p className="text-xs text-[#829b8c] mt-1.5 leading-relaxed">
                  {mod.desc}
                </p>
                <p className="text-[11px] text-[#5f776a] mt-2.5 pt-2.5 border-t border-[#183324]/50 leading-relaxed">
                  {mod.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Expression of Interest */}
      <div className="p-6 rounded-3xl bg-[#0c1a12] border border-[#1d3d2c] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#14291e] border border-[#d5a55d]/30 flex items-center justify-center text-[#d5a55d]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-editorial text-lg font-bold text-[#f0eee8]">
              Proposed Initial Corridors
            </h4>
            <p className="text-xs text-[#829b8c]">
              Epe Waterfront · Lekki Scheme 2 · Abuja Idu Eco-District
            </p>
          </div>
        </div>

        {pledgeSubmitted ? (
          <div className="p-3.5 rounded-xl bg-[#122b1e] border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Thank you for your interest. Community prospectus will be shared via encrypted channel.</span>
          </div>
        ) : (
          <button
            onClick={() => setPledgeSubmitted(true)}
            className="w-full py-3.5 rounded-xl bg-[#d5a55d] hover:bg-[#c4944b] text-[#101f16] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Express Master-Plan Interest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
