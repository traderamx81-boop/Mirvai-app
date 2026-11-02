import React, { useState } from 'react';
import { Menu, Layers, Grid, Box, Home, Zap, Settings, ArrowRight, CheckCircle2, ShoppingBag, X, Send } from 'lucide-react';

interface ConstructionDivisionProps {
  onOpenMenu: () => void;
  onOpenMessages?: () => void;
}

export const ConstructionDivision: React.FC<ConstructionDivisionProps> = ({
  onOpenMenu,
  onOpenMessages,
}) => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({
    'TMT High-Yield 12mm Steel (Per Tonne)': 2,
    'Dangote Falcon 42.5R Cement (50kg Bags)': 50,
  });
  const [deliveryLocation, setDeliveryLocation] = useState('Lekki / Epe Corridor, Lagos');
  const [contactInfo, setContactInfo] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const categories = [
    {
      id: 'steel',
      title: 'Iron rods and steel',
      desc: 'Reinforcement and structural materials',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      items: ['TMT High-Yield 12mm Steel (Per Tonne)', 'TMT High-Yield 16mm Steel (Per Tonne)', 'Binding Wire (25kg Roll)'],
    },
    {
      id: 'cement',
      title: 'Cement and blocks',
      desc: 'Core building and masonry supplies',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      items: ['Dangote Falcon 42.5R Cement (50kg Bags)', 'Vibrated Sandcrete 9-inch Hollow Blocks', 'Granite Aggregates (30-Tonne Tipper)'],
    },
    {
      id: 'timber',
      title: 'Timber and formwork',
      desc: 'Wood and support materials',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <rect x="3" y="14" width="18" height="4" rx="1" />
        </svg>
      ),
      items: ['2x3 Hardwood Framing Planks', 'Marine Film-Faced Plywood (18mm)', 'Bamboo / Steel Scaffolding Props'],
    },
    {
      id: 'roofing',
      title: 'Roofing and finishes',
      desc: 'Roofing, tiles and finishing supplies',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" />
        </svg>
      ),
      items: ['Stone-Coated Bond Roofing Sheets', 'Spanish Vitrified Floor Tiles (60x60)', 'Emulsion & Satin Exterior Wall Paint'],
    },
    {
      id: 'electrical',
      title: 'Electrical and plumbing',
      desc: 'Essential installation materials',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      items: ['Coleman Pure Copper 2.5mm Single Cable', 'PPR Pressure Plumbing Pipes & Fittings', 'Schneider 8-Way Distribution Panel'],
    },
    {
      id: 'equipment',
      title: 'Site equipment',
      desc: 'Tools, accessories and project supplies',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#d5a55d]">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      items: ['Diesel Concrete Mixer (1 Bag Capacity)', 'Submersible Water Dewatering Pump', 'Safety Helmets & High-Vis PPE (Set of 10)'],
    },
  ];

  const handleOpenCategory = (catId: string) => {
    setSelectedCategory(catId);
    setQuoteModalOpen(true);
  };

  const handleToggleItem = (itemName: string) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[itemName]) {
        delete next[itemName];
      } else {
        next[itemName] = 1;
      }
      return next;
    });
  };

  const handleUpdateQty = (itemName: string, delta: number) => {
    setSelectedItems(prev => {
      const curr = prev[itemName] || 1;
      const nextVal = Math.max(1, curr + delta);
      return { ...prev, [itemName]: nextVal };
    });
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteModalOpen(false);
    }, 3000);
  };

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
            Mirvai Construction
          </h1>
          <p className="text-xs sm:text-sm text-[#829b8c] mt-0.5">
            Building materials and supply
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
            GROWTH DIVISION
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8]">
            Mirvai Construction
          </h2>

          <p className="text-xs sm:text-sm text-[#a4baa9] leading-relaxed max-w-lg">
            A practical marketplace for sourcing dependable construction materials and arranging supply for building projects.
          </p>
        </div>
      </div>

      {/* Material categories - 6 cards in 2x3 grid */}
      <div className="space-y-3.5 pt-2">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8]">
          Material categories
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleOpenCategory(cat.id)}
              className="p-5 rounded-2xl bg-[#0e1f16] border border-[#183324] hover:border-[#d5a55d]/40 transition-all text-left flex flex-col justify-between h-full hover:bg-[#12271c] cursor-pointer group"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#06130b] border border-[#183324] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <h4 className="font-editorial text-base sm:text-lg font-bold text-[#f0eee8] group-hover:text-[#d5a55d] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#829b8c] mt-1.5 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#d5a55d] mt-3 block">
                Select & quote →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* How ordering works - 3 numbered steps */}
      <div className="space-y-3.5 pt-2">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8]">
          How ordering works
        </h3>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1f16] border border-[#183324] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d5a55d] text-[#101f16] font-bold flex items-center justify-center shrink-0 font-editorial text-lg shadow-sm">
              1
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#f0eee8]">
                Select the materials
              </h4>
              <p className="text-xs text-[#829b8c] mt-0.5">
                Choose category, specification and quantity.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1f16] border border-[#183324] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d5a55d] text-[#101f16] font-bold flex items-center justify-center shrink-0 font-editorial text-lg shadow-sm">
              2
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#f0eee8]">
                Request a verified quote
              </h4>
              <p className="text-xs text-[#829b8c] mt-0.5">
                Mirvai confirms price and availability.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1f16] border border-[#183324] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d5a55d] text-[#101f16] font-bold flex items-center justify-center shrink-0 font-editorial text-lg shadow-sm">
              3
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#f0eee8]">
                Confirm supply and delivery
              </h4>
              <p className="text-xs text-[#829b8c] mt-0.5">
                Approve the order and arrange delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Button matching Screenshot */}
      <div className="pt-2">
        <button
          onClick={() => setQuoteModalOpen(true)}
          className="w-full py-4 px-6 rounded-2xl bg-[#d5a55d] hover:bg-[#c4944b] text-[#101f16] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#d5a55d]/10 transition-all cursor-pointer hover:shadow-[#d5a55d]/20 active:scale-[0.99]"
        >
          <span>Request a material quote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Material Quote Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1f16] border border-[#1d3d2c] p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#183324]">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#f0eee8]">
                  Request Material Quote
                </h3>
                <p className="text-xs text-[#829b8c] mt-0.5">
                  Direct site delivery across Lagos, Abuja, and Ogun State
                </p>
              </div>
              <button
                onClick={() => setQuoteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#08170f] text-[#829b8c] hover:text-[#f0eee8] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {quoteSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#122b1e] border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-editorial text-xl font-bold text-[#f0eee8]">
                  Quote Request Dispatched
                </h4>
                <p className="text-xs text-[#a4baa9] leading-relaxed">
                  Your request has been routed directly to the Mirvai Materials Procurement Desk. An itemized invoice with guaranteed mill prices will be sent within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a4baa9] mb-2 uppercase tracking-wider">
                    Select Building Supplies
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {categories.flatMap(c => c.items).map((item, idx) => {
                      const isSelected = !!selectedItems[item];
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#14291e] border-[#d5a55d]/50'
                              : 'bg-[#08170f] border-[#183324]'
                          }`}
                        >
                          <div
                            onClick={() => handleToggleItem(item)}
                            className="flex items-center gap-2.5 cursor-pointer flex-1"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-[#d5a55d] rounded"
                            />
                            <span className="text-xs text-[#e3eee7]">{item}</span>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-2 ml-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item, -1)}
                                className="w-6 h-6 rounded bg-[#0e1f16] text-[#d5a55d] text-xs font-bold hover:bg-[#1a3325]"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-bold text-[#f0eee8] min-w-5 text-center">
                                {selectedItems[item]}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item, 1)}
                                className="w-6 h-6 rounded bg-[#0e1f16] text-[#d5a55d] text-xs font-bold hover:bg-[#1a3325]"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a4baa9] mb-1.5 uppercase tracking-wider">
                    Delivery Site Address
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={e => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Plot 14, Sangotedo Estate, Lekki"
                    className="w-full px-3.5 py-2.5 bg-[#08170f] border border-[#183324] rounded-xl text-xs text-[#e3eee7] focus:outline-none focus:border-[#d5a55d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a4baa9] mb-1.5 uppercase tracking-wider">
                    Your WhatsApp or Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={e => setContactInfo(e.target.value)}
                    placeholder="+234 or international format"
                    className="w-full px-3.5 py-2.5 bg-[#08170f] border border-[#183324] rounded-xl text-xs text-[#e3eee7] focus:outline-none focus:border-[#d5a55d]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#d5a55d] text-[#101f16] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#c4944b] transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Quote Request to Mirvai Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
