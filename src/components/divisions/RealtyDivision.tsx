import React, { useState } from 'react';
import { 
  Menu, 
  ArrowRight, 
  ShieldCheck, 
  Home, 
  Building2, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  Eye, 
  Calendar, 
  PhoneCall, 
  FileText, 
  Video, 
  Sparkles, 
  Compass,
  Bed,
  Bath,
  Maximize2
} from 'lucide-react';
import { PropertyCategory } from '../../types';
import { PROPERTIES } from '../../data/propertiesData';

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
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedPropertyPreview, setSelectedPropertyPreview] = useState<string | null>(null);

  const filterOptions = [
    { label: 'All Portfolios', value: 'All' },
    { label: 'Terrace Duplex', value: 'Terrace' },
    { label: 'Detached Homes', value: 'Detached' },
    { label: 'Semi-Detached', value: 'Semi-detached' },
    { label: 'Residential Land', value: 'Land' },
    { label: 'Off-Plan Luxury', value: 'Off-plan' },
  ];

  const featuredRealtyProperties = [
    {
      id: 'ikeja-terrace',
      title: 'Luxury 4-Bedroom Terrace Duplex with BQ',
      location: 'Adeniyi Jones, Ikeja, Lagos',
      category: 'Terrace',
      categoryLabel: 'TERRACE DUPLEX',
      price: '₦400,000,000',
      beds: 4,
      baths: 5,
      area: '420 m²',
      titleType: 'Governor’s Consent',
      status: 'Fully Completed',
      image: '/properties/adeniyi-jones-terrace/01-exterior.jpg',
      highlights: ['Governor’s Consent Title', 'Fitted Kitchen with Island', 'Gated Ikeja Community'],
    },
    {
      id: 'lekki-terrace',
      title: 'Contemporary 4-Bedroom Terrace Duplex',
      location: 'Admiralty Way Corridor, Lekki Phase 1, Lagos',
      category: 'Terrace',
      categoryLabel: 'TERRACE DUPLEX',
      price: '₦185,000,000',
      beds: 4,
      baths: 5,
      area: '380 m²',
      titleType: 'Governor’s Consent',
      status: 'Ready for Handover',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Rooftop Sky Terrace', '2-Car Dedicated Port', '11.4% Rental Yield'],
    },
    {
      id: 'ikoyi-villa',
      title: 'Executive 5-Bedroom Diplomatic Villa',
      location: 'Bourdillon Road Enclave, Old Ikoyi, Lagos',
      category: 'Detached',
      categoryLabel: 'DETACHED HOMES',
      price: '₦580,000,000',
      beds: 5,
      baths: 6,
      area: '750 m²',
      titleType: 'Federal C of O',
      status: 'Verified Available',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Olympic Private Pool', 'Home Cinema & Elevator', 'Dual Staff Quarters'],
    },
    {
      id: 'chevron-semi',
      title: 'Modern 4-Bedroom Semi-Detached Duplex',
      location: 'Chevron Tollgate Enclave, Lekki, Lagos',
      category: 'Semi-detached',
      categoryLabel: 'SEMI-DETACHED DUPLEX',
      price: '₦145,000,000',
      beds: 4,
      baths: 4,
      area: '320 m²',
      titleType: 'Governor’s Consent',
      status: 'Move-in Ready',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Fitted Bosch Kitchen', 'Stamp Concrete Compound', 'Perimeter CCTV'],
    },
    {
      id: 'epe-waterfront',
      title: 'Prime Commercial & Residential Table Land',
      location: 'Epe Express Waterfront Corridor, Lagos',
      category: 'Land',
      categoryLabel: 'RESIDENTIAL LAND',
      price: '₦65,000,000',
      beds: null,
      baths: null,
      area: '600 m²',
      titleType: 'Registered Survey & Gazette',
      status: 'Immediate Physical Possession',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      highlights: ['100% Dry Sand-filled', 'Direct Waterfront Access', 'Projected 45% 2-Yr ROI'],
    },
    {
      id: 'eko-atlantic',
      title: 'Atlantic Marina Luxury Oceanfront Condominium',
      location: 'Marina District, Eko Atlantic City, Lagos',
      category: 'Off-plan',
      categoryLabel: 'OFF-PLAN DEVELOPMENT',
      price: '₦320,000,000',
      beds: 3,
      baths: 3,
      area: '240 m²',
      titleType: 'Deed of Conveyance',
      status: 'Milestone Escrow Active',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Oceanfront Balconies', 'Escrow-backed Milestones', '24-Month Payment Plan'],
    },
  ];

  const filteredList = selectedFilter === 'All'
    ? featuredRealtyProperties
    : featuredRealtyProperties.filter(p => p.category === selectedFilter);

  const pillars = [
    {
      number: '01',
      title: 'Alausa Registry Title Search',
      description: 'Independent legal counsel performs official searches at the Lagos Lands Registry to confirm unencumbered Governor’s Consent, C of O, or Gazette.',
    },
    {
      number: '02',
      title: 'Cadastral Beacon & Boundary Audit',
      description: 'Registered surveyors verify coordinate beacons against state master plans to ensure zero acquisition overlap or road alignment infringements.',
    },
    {
      number: '03',
      title: '4K Drone & Physical Inspection',
      description: 'Comprehensive structural assessment with live timestamped 4K video feeds for buyers in Nigeria and the diaspora.',
    },
    {
      number: '04',
      title: 'Milestone Escrow Safeguards',
      description: 'Staged transactions with clear legal protections, ensuring funds are released only as agreed milestones are certified.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 pb-32 pt-2">
      {/* 1. Top Header with Menu Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="w-10 h-10 rounded-full bg-[#0e2117] border border-[#1b3a28] flex items-center justify-center text-[#d5a55d] hover:bg-[#153324] transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#d5a55d]">
                Mirvai Group Ecosystem
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8] tracking-tight">
              Mirvai Realty
            </h1>
          </div>
        </div>

        <button
          onClick={() => onOpenEnquiry('General Realty Enquiry')}
          className="hidden xs:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#d5a55d] text-[#07160e] text-xs font-bold hover:bg-[#deb26d] transition-all cursor-pointer shadow-md"
        >
          <span>Send Brief</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Hero Division Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#122c1e] via-[#0c1f15] to-[#07150d] border border-[#1e422e] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-8 -bottom-10 font-editorial text-[180px] font-black text-[#1b3d2b]/20 select-none pointer-events-none leading-none">
          M
        </div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e2117] border border-[#d5a55d]/40 text-[11px] font-bold tracking-wider text-[#d5a55d] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#d5a55d]" />
            Verified Developer Portfolio
          </div>

          <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[#f0eee8] leading-tight max-w-xl">
            Sourced with integrity.<br />
            <span className="text-[#d5a55d]">Verified before commitment.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#b8ccc0] leading-relaxed max-w-xl">
            Explore authenticated residential, commercial, and land assets from vetted partner developers across Lagos Island and Mainland. Every listing includes verified title documentation and physical audit files.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-[#091a11]/80 border border-[#1a3827]">
              <span className="text-[10px] uppercase font-bold text-[#8fa79b] tracking-wider block">Portfolio Value</span>
              <strong className="text-base sm:text-lg font-bold text-[#d5a55d]">₦45B+</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#091a11]/80 border border-[#1a3827]">
              <span className="text-[10px] uppercase font-bold text-[#8fa79b] tracking-wider block">Title Security</span>
              <strong className="text-base sm:text-lg font-bold text-[#f0eee8]">100% Vetted</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#091a11]/80 border border-[#1a3827]">
              <span className="text-[10px] uppercase font-bold text-[#8fa79b] tracking-wider block">Inspections</span>
              <strong className="text-base sm:text-lg font-bold text-emerald-400">Live 4K Drone</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#091a11]/80 border border-[#1a3827]">
              <span className="text-[10px] uppercase font-bold text-[#8fa79b] tracking-wider block">Diaspora Escrow</span>
              <strong className="text-base sm:text-lg font-bold text-[#f0eee8]">Milestone-Based</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#f0eee8]">
            Curated Opportunities
          </h3>
          <span className="text-xs text-[#8fa79b]">
            Showing {filteredList.length} verified {filteredList.length === 1 ? 'property' : 'properties'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === option.value
                  ? 'bg-[#d5a55d] text-[#07160e] shadow-md'
                  : 'bg-[#0a1c12] border border-[#1a3827] text-[#9cb2a6] hover:text-[#f0eee8] hover:border-[#d5a55d]/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Live Property Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map(prop => (
          <article 
            key={prop.id}
            className="rounded-3xl bg-[#0a1c12] border border-[#1a3827] hover:border-[#d5a55d]/50 transition-all overflow-hidden shadow-lg flex flex-col justify-between group"
          >
            {/* Card Media */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#06130b]">
              <img 
                src={prop.image} 
                alt={prop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1c12] via-transparent to-black/30" />
              
              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-[#07160e]/90 backdrop-blur-md border border-[#d5a55d]/40 text-[10px] font-bold text-[#d5a55d] uppercase tracking-wider">
                  {prop.categoryLabel}
                </span>
                <span className="px-2 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#f0eee8]">
                <span className="font-semibold text-lg sm:text-xl font-editorial text-[#d5a55d] drop-shadow-md">
                  {prop.price}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#07160e]/80 text-[#cad8d0] border border-[#1b3a28]">
                  {prop.titleType}
                </span>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-editorial text-base sm:text-lg font-bold text-[#f0eee8] group-hover:text-[#d5a55d] transition-colors leading-snug">
                  {prop.title}
                </h4>
                
                <p className="text-xs text-[#8fa79b] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d5a55d] shrink-0" />
                  <span>{prop.location}</span>
                </p>

                {/* Specs */}
                {(prop.beds || prop.area) && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#163323] text-xs text-[#b8ccc0]">
                    {prop.beds && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-[#d5a55d]" />
                        <span>{prop.beds} Beds</span>
                      </span>
                    )}
                    {prop.baths && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-[#d5a55d]" />
                        <span>{prop.baths} Baths</span>
                      </span>
                    )}
                    {prop.area && (
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-[#d5a55d]" />
                        <span>{prop.area}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Key Points */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {prop.highlights.map(h => (
                    <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-[#0e2418] text-[#8fa79b] border border-[#163323]">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenEnquiry(prop.title)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#07160e] text-xs font-bold transition-all text-center cursor-pointer shadow-sm"
                >
                  Request Inspection
                </button>
                <button
                  onClick={() => onExploreProperties(prop.category as PropertyCategory)}
                  className="py-2.5 px-3 rounded-xl border border-[#1e422e] text-[#c4d6cb] hover:text-[#d5a55d] hover:border-[#d5a55d]/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  Explore Similar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 5. Mirvai Verification Protocol Card */}
      <section className="rounded-3xl bg-[#091a11] border border-[#1a3827] p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#163323] pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d5a55d]">Due Diligence Framework</p>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8] mt-0.5">
              How Mirvai protects every transaction
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Zero-Compromise Standards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map(pillar => (
            <div key={pillar.number} className="p-4 rounded-2xl bg-[#07160e] border border-[#163323] space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#d5a55d] bg-[#122c1e] px-2 py-0.5 rounded-md border border-[#d5a55d]/30 inline-block">
                {pillar.number}
              </span>
              <h4 className="font-editorial text-base font-bold text-[#f0eee8]">
                {pillar.title}
              </h4>
              <p className="text-xs text-[#8fa79b] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Diaspora VIP Sourcing Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#122c1e] to-[#0b1c13] border border-[#d5a55d]/35 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d5a55d]">
            Diaspora Client Desk
          </span>
          <h3 className="font-editorial text-xl font-bold text-[#f0eee8]">
            Need a tailored search in Ikeja, Lekki, or Ikoyi?
          </h3>
          <p className="text-xs text-[#a4baa9] max-w-md leading-relaxed">
            Specify your budget, preferred neighborhood, and property type. Mirvai sources verified options matching your requirements without third-party markups.
          </p>
        </div>

        <button
          onClick={() => onOpenEnquiry('Tailored Property Search')}
          className="py-3 px-5 rounded-2xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#07160e] text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Send Tailored Brief</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RealtyDivision;
