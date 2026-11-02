import React from 'react';
import { Menu, ArrowRight, ShieldCheck, Home, Building2, Layers, MapPin } from 'lucide-react';
import { PropertyCategory } from '../../types';

interface RealtyDivisionProps {
  onOpenMenu: () => void;
  onExploreProperties: (category?: PropertyCategory) => void;
  onOpenEnquiry: (categoryLabel: string) => void;
}

export const RealtyDivision: React.FC<RealtyDivisionProps> = ({
  onOpenMenu,
  onExploreProperties,
  onOpenEnquiry,
}) => {
  const categories = [
    {
      id: 'Terrace' as PropertyCategory,
      title: 'Terrace duplexes',
      desc: 'Completed and off-plan opportunities',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      ),
    },
    {
      id: 'Detached' as PropertyCategory,
      title: 'Detached homes',
      desc: 'Standalone residential properties',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
        </svg>
      ),
    },
    {
      id: 'Semi-detached' as PropertyCategory,
      title: 'Semi-detached homes',
      desc: 'Premium homes across Lagos',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <rect x="4" y="4" width="7" height="16" /><rect x="13" y="4" width="7" height="16" />
        </svg>
      ),
    },
    {
      id: 'Land' as PropertyCategory,
      title: 'Land and off-plan',
      desc: 'Verified opportunities from developers',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-28 pt-2">
      {/* Top circular menu button and Title matching Screenshot 5 */}
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
            Mirvai Realty
          </h1>
          <p className="text-xs sm:text-sm text-[#829b8c] mt-0.5">
            Properties from partner developers
          </p>
        </div>
      </div>

      {/* Hero Card matching Screenshot 5 */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#12271c] to-[#0c1c13] border border-[#1d3d2c] p-6 sm:p-7 overflow-hidden shadow-xl">
        {/* Subtle Watermark 'M' in background */}
        <div className="absolute right-[-15px] bottom-[-30px] font-editorial text-[140px] font-black text-[#1b3d2b]/25 select-none pointer-events-none leading-none">
          M
        </div>

        <div className="relative z-10 space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132c1e] border border-emerald-500/30 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE NOW
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8]">
            Mirvai Realty
          </h2>

          <p className="text-xs sm:text-sm text-[#a4baa9] leading-relaxed max-w-lg">
            Explore verified properties Mirvai markets on behalf of trusted external developers across Lagos.
          </p>
        </div>
      </div>

      {/* Available property categories matching Screenshot 5 */}
      <div className="space-y-3.5 pt-2">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8]">
          Available property categories
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onExploreProperties(cat.id)}
              className="p-5 rounded-2xl bg-[#0e1f16] border border-[#183324] hover:border-[#d5a55d]/40 transition-all text-left flex flex-col justify-between h-full hover:bg-[#12271c] cursor-pointer group"
            >
              <div>
                <div className="mb-3">
                  <span className="w-7 h-7 rounded-lg bg-[#06130b] border border-[#183324] flex items-center justify-center text-[#d5a55d] group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </span>
                </div>
                <h4 className="font-editorial text-base sm:text-lg font-bold text-[#f0eee8] group-hover:text-[#d5a55d] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#829b8c] mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview note box matching Screenshot 5 */}
      <div className="p-4 rounded-2xl bg-[#091f16] border border-dashed border-[#204a35] text-xs text-[#829b8c] leading-relaxed">
        <span className="text-[#c1d9cc] font-medium">Preview note:</span> confirmed partner-developer properties will appear here with photographs, prices, documents and availability.
      </div>

      {/* Main Action Button matching Screenshot 5 */}
      <div>
        <button
          onClick={() => onExploreProperties('All')}
          className="w-full py-4 px-6 rounded-2xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#06130b] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#d5a55d]/10 transition-all cursor-pointer"
        >
          <span>Open property explorer</span>
        </button>
      </div>

      {/* Trust & Verification Footnote */}
      <div className="p-4 rounded-2xl bg-[#08170f] border border-[#183324] flex items-start gap-3 text-xs text-[#829b8c]">
        <ShieldCheck className="w-5 h-5 text-[#d5a55d] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Every property listed on Mirvai Realty undergoes legal title vetting, boundary verification at the Surveyor General’s registry, and physical inspection prior to client presentation.
        </p>
      </div>
    </div>
  );
};
