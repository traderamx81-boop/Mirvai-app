import React, { useState } from 'react';
import { Menu, Sun, Zap, BatteryCharging, Gauge, ArrowRight, CheckCircle2, Calculator } from 'lucide-react';

interface EnergyDivisionProps {
  onOpenMenu: () => void;
  onOpenEnquiry?: (categoryLabel: string) => void;
}

export const EnergyDivision: React.FC<EnergyDivisionProps> = ({
  onOpenMenu,
  onOpenEnquiry,
}) => {
  const [houseSize, setHouseSize] = useState('4-bedroom terrace duplex');
  const [acUnits, setAcUnits] = useState(3);
  const [hasInverter, setHasInverter] = useState(true);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const focusCards = [
    {
      title: 'Solar solutions',
      desc: 'Clean power for homes and businesses',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
      detail: 'Tier-1 monocrystalline solar PV panels with 25-year performance warranty and microinverter resilience.',
    },
    {
      title: 'Power systems',
      desc: 'Reliable generation and distribution',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      detail: 'Hybrid synchronized power hubs seamlessly blending solar generation, grid supply, and low-decibel back-ups.',
    },
    {
      title: 'Energy storage',
      desc: 'Battery and backup infrastructure',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <rect x="2" y="7" width="20" height="12" rx="2" /><path d="M8 7V4M16 7V4" />
        </svg>
      ),
      detail: 'Lithium Iron Phosphate (LiFePO4) high-cycle storage banks capable of 6,000+ deep charge cycles.',
    },
    {
      title: 'Smart energy',
      desc: 'Monitoring and efficient usage',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M3 13l4-4 4 4 4-6 6 6" />
        </svg>
      ),
      detail: 'App-based load shedding, real-time power analytics, and remote battery health monitoring.',
    },
  ];

  const estimatedKw = Math.round(5 + acUnits * 1.8);
  const estimatedKwhStorage = Math.round(10 + acUnits * 3.5);

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
            Mirvai Energy
          </h1>
          <p className="text-xs sm:text-sm text-[#829b8c] mt-0.5">
            Reliable energy solutions
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
            Mirvai Energy
          </h2>

          <p className="text-xs sm:text-sm text-[#a4baa9] leading-relaxed max-w-lg">
            A future division for dependable and sustainable power solutions serving homes, businesses and Mirvai communities.
          </p>
        </div>
      </div>

      {/* Future focus - 4 cards */}
      <div className="space-y-3.5 pt-2">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8]">
          Future focus
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {focusCards.map((card, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0e1f16] border border-[#183324] hover:border-[#d5a55d]/40 transition-all text-left flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#06130b] border border-[#183324] flex items-center justify-center mb-3">
                  {card.icon}
                </div>
                <h4 className="font-editorial text-base sm:text-lg font-bold text-[#f0eee8]">
                  {card.title}
                </h4>
                <p className="text-xs text-[#829b8c] mt-1.5 leading-relaxed">
                  {card.desc}
                </p>
                <p className="text-[11px] text-[#5f776a] mt-2.5 pt-2.5 border-t border-[#183324]/50 leading-relaxed">
                  {card.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Solar Sizing Tool */}
      <div className="p-6 rounded-3xl bg-[#0c1a12] border border-[#1d3d2c] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#14291e] border border-[#d5a55d]/30 flex items-center justify-center text-[#d5a55d]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-lg font-bold text-[#f0eee8]">
                Estimate Property Solar Needs
              </h4>
              <p className="text-xs text-[#829b8c]">
                Calculate off-grid and hybrid backup capacity
              </p>
            </div>
          </div>
          <button
            onClick={() => setCalculatorOpen(!calculatorOpen)}
            className="text-xs font-semibold text-[#d5a55d] underline cursor-pointer"
          >
            {calculatorOpen ? 'Hide' : 'Configure'}
          </button>
        </div>

        {calculatorOpen && (
          <div className="space-y-4 pt-2 border-t border-[#183324]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#829b8c] block mb-1">Property Type</label>
                <select
                  value={houseSize}
                  onChange={e => setHouseSize(e.target.value)}
                  className="w-full px-3 py-2 bg-[#08170f] border border-[#183324] rounded-xl text-xs text-[#e2ede6]"
                >
                  <option>3-bedroom terrace duplex</option>
                  <option>4-bedroom terrace duplex</option>
                  <option>5-bedroom fully detached villa</option>
                  <option>Commercial office duplex</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#829b8c] block mb-1">Inverter ACs ({acUnits})</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={acUnits}
                    onChange={e => setAcUnits(Number(e.target.value))}
                    className="flex-1 accent-[#d5a55d]"
                  />
                  <span className="text-xs font-mono font-bold text-[#d5a55d] min-w-6">
                    {acUnits} ACs
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12271c] border border-[#1d3d2c] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#829b8c] uppercase tracking-wider">Recommended Solar Capacity</p>
                <p className="text-lg font-bold font-editorial text-[#f0eee8] mt-0.5">
                  {estimatedKw} kVA Hybrid Inverter
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#829b8c] uppercase tracking-wider">LiFePO4 Storage</p>
                <p className="text-lg font-bold font-mono text-[#d5a55d] mt-0.5">
                  {estimatedKwhStorage} kWh
                </p>
              </div>
            </div>
          </div>
        )}

        {inquirySent ? (
          <div className="p-3.5 rounded-xl bg-[#122b1e] border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Consultation registered. A solar engineer will follow up with complete specs.</span>
          </div>
        ) : (
          <button
            onClick={() => setInquirySent(true)}
            className="w-full py-3.5 rounded-xl bg-[#d5a55d] hover:bg-[#c4944b] text-[#101f16] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Reserve Solar Feasibility Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
