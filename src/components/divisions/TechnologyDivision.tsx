import React, { useState } from 'react';
import { Menu, Radio, Layers, Activity, Sparkles, CheckCircle2, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';

interface TechnologyDivisionProps {
  onOpenMenu: () => void;
  onOpenPrivacyCenter?: () => void;
}

export const TechnologyDivision: React.FC<TechnologyDivisionProps> = ({
  onOpenMenu,
  onOpenPrivacyCenter,
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);

  const modules = [
    {
      title: 'Client platform',
      desc: 'Profiles, saved properties and enquiries',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="9" />
        </svg>
      ),
      specs: [
        'Client-side zero-knowledge document vault',
        'Biometric WebAuthn passkey authentication',
        'Multi-device synchronization without trackers',
      ],
    },
    {
      title: 'Property systems',
      desc: 'Listings, checks and documentation status',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
        </svg>
      ),
      specs: [
        'Cadastral mapping with Lagos State GIS integration',
        'Title verification timeline & beacon cross-check',
        'Automated legal encumbrance search pipeline',
      ],
    },
    {
      title: 'Data and analytics',
      desc: 'Insights for decisions and operations',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      specs: [
        'Corridor price-per-square-meter historical indexing',
        'Diaspora rental yield modeling (Lekki, Ikoyi, Epe)',
        'Infrastructure impact valuation forecasts',
      ],
    },
    {
      title: 'Automation',
      desc: 'Faster follow-up and service delivery',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#d5a55d]">
          <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.8L12 22l-2.4-7.2L2.4 12l7.2-2.8L12 2z" />
        </svg>
      ),
      specs: [
        'Under-15-minute senior broker match routing',
        'Automated title perfection tracking notifications',
        'Direct WhatsApp and in-app synchronized messaging',
      ],
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
            Mirvai Technology
          </h1>
          <p className="text-xs sm:text-sm text-[#829b8c] mt-0.5">
            The ecosystem’s digital engine
          </p>
        </div>
      </div>

      {/* Hero Card matching Screenshot */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#12271c] to-[#0c1c13] border border-[#1d3d2c] p-6 sm:p-7 overflow-hidden shadow-xl">
        <div className="absolute right-[-15px] bottom-[-30px] font-editorial text-[140px] font-black text-[#1b3d2b]/25 select-none pointer-events-none leading-none">
          M
        </div>

        <div className="relative z-10 space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132c1e] border border-emerald-500/30 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            CORE ENGINE
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8]">
            Mirvai Technology
          </h2>

          <p className="text-xs sm:text-sm text-[#a4baa9] leading-relaxed max-w-lg">
            The technology layer connects client dashboards, property data, enquiries, documents and operations across Mirvai.
          </p>
        </div>
      </div>

      {/* Technology modules matching Screenshot */}
      <div className="space-y-3.5 pt-2">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8]">
          Technology modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              onClick={() => setActiveModuleIndex(activeModuleIndex === idx ? null : idx)}
              className={`p-5 rounded-2xl bg-[#0e1f16] border transition-all text-left flex flex-col justify-between cursor-pointer ${
                activeModuleIndex === idx ? 'border-[#d5a55d] bg-[#12271c]' : 'border-[#183324] hover:border-[#d5a55d]/40'
              }`}
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
              </div>

              {activeModuleIndex === idx && (
                <div className="mt-4 pt-3 border-t border-[#183324] space-y-1.5 animate-fadeIn">
                  {mod.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-[11px] text-[#a4baa9]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d5a55d]" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Architecture & Privacy Relay Status Card */}
      <div className="p-5 rounded-2xl bg-[#091810] border border-[#183324] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0e1f16] border border-[#1d3d2c] flex items-center justify-center text-[#d5a55d]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#f0eee8]">
              Edge Privacy Architecture
            </h4>
            <p className="text-[11px] text-[#829b8c]">
              Zero-knowledge client storage · TLS 1.3 encrypted
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
          HEALTHY (99.98%)
        </span>
      </div>
    </div>
  );
};
