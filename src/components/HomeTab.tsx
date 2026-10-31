import React, { useState } from 'react';
import { Search, ArrowUpRight, Home as HomeIcon, MessageSquare, ShieldCheck, Check, Sparkles, Building, MapPin, Bookmark } from 'lucide-react';
import { PROPERTIES } from '../data/propertiesData';
import { TabType } from './BottomNav';
import { useAuth } from '../context/AuthContext';

interface HomeTabProps {
  onNavigateTab: (tab: TabType) => void;
  onSelectProperty: (propertyId: string) => void;
  onOpenDiasporaModal: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigateTab,
  onSelectProperty,
  onOpenDiasporaModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isPropertySaved, toggleSaveProperty, setPrivacyModalOpen } = useAuth();

  const propertyTypes = [
    {
      id: 'Terrace',
      name: 'Terrace duplex',
      count: '18 verified',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'Detached',
      name: 'Detached homes',
      count: '12 verified',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'Land',
      name: 'Land',
      count: '24 plots',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'Semi-detached',
      name: 'Semi-detached',
      count: '9 verified',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'Off-plan',
      name: 'Off-plan developments',
      count: '6 projects',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const filteredProperties = searchQuery
    ? PROPERTIES.filter(
        p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.fullLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PROPERTIES.slice(0, 4);

  return (
    <div className="space-y-6 pb-28 pt-2 w-full max-w-4xl mx-auto">
      {/* Active status indicator */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#a2b5a9]">
          MIRVAI REALTY · <span className="text-emerald-400">ACTIVE NOW</span>
        </span>
      </div>

      {/* Hero Headline */}
      <div className="space-y-1">
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f2e7d3] leading-[1.08]">
          Find. Grow.<br />
          <span className="text-[#dfb877]">Invest.</span>
        </h1>
        <p className="text-sm sm:text-base text-[#94a89d] leading-relaxed pt-2 max-w-lg">
          Your property journey, clearly guided—from first search to final documentation.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7d9385]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search properties, locations or opportunities"
          className="w-full pl-10 pr-4 py-3.5 bg-[#0b1b13] border border-[#1b3a2a] rounded-2xl text-xs sm:text-sm text-[#e3ece7] placeholder-[#6a8072] focus:outline-none focus:border-[#c69a58] focus:ring-1 focus:ring-[#c69a58] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-[#7d9385] hover:text-[#e3ece7]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Two Main Action Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
        {/* Left Card: Warm Gold Card */}
        <button
          onClick={() => onNavigateTab('properties')}
          className="p-5 rounded-3xl bg-[#cca25d] hover:bg-[#d5ae68] text-[#0a1711] text-left flex flex-col justify-between min-h-[170px] transition-all duration-200 shadow-xl group relative overflow-hidden"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#0a1711]/10 flex items-center justify-center">
              <HomeIcon className="w-6 h-6 text-[#0a1711]" />
            </div>
            <ArrowUpRight className="w-6 h-6 text-[#0a1711] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <div className="mt-6">
            <h3 className="font-editorial text-2xl font-bold text-[#0a1711] leading-tight">
              Find a<br />property
            </h3>
            <p className="text-xs text-[#2c3d31] font-semibold mt-1">
              Explore verified opportunities
            </p>
          </div>
        </button>

        {/* Right Card: Dark Forest Card */}
        <button
          onClick={onOpenDiasporaModal}
          className="p-5 rounded-3xl bg-[#0d2117] hover:bg-[#122b1f] border border-[#1d3d2c] text-left flex flex-col justify-between min-h-[170px] transition-all duration-200 shadow-md group relative overflow-hidden"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#163324] border border-[#234b35] flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#dfb877]" />
            </div>
            <ArrowUpRight className="w-6 h-6 text-[#7e9989] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#dfb877]" />
          </div>
          <div className="mt-6">
            <h3 className="font-editorial text-2xl font-bold text-[#f2e7d3] leading-tight">
              Diaspora<br />desk
            </h3>
            <p className="text-xs text-[#8fa598] font-medium mt-1">
              Remote guidance &amp; inspections
            </p>
          </div>
        </button>
      </div>

      {/* Explore by Type Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f2e7d3]">
              Explore by type
            </h2>
            <p className="text-xs text-[#82998b] mt-0.5">
              A cleaner route to the right property
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('properties')}
            className="text-xs font-semibold text-[#dfb877] hover:underline pb-0.5"
          >
            View all
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
          {propertyTypes.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigateTab('properties')}
              className="flex-shrink-0 w-40 sm:w-44 p-3 rounded-2xl bg-[#0d2117] border border-[#1b3a2a] hover:border-[#c69a58]/60 text-left transition-all duration-200 snap-start group"
            >
              <div className="w-full h-24 rounded-xl bg-[#091710] border border-[#163223] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium">
                  {item.count}
                </span>
              </div>
              <p className="text-xs font-bold text-[#e5ece8] mt-2.5 truncate group-hover:text-[#dfb877] transition-colors">
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Verified Opportunities Featured Preview with Real Photos */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#f2e7d3]">
              Verified listings
            </h3>
            <p className="text-xs text-[#82998b]">
              Title search verified by Mirvai Legal
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('properties')}
            className="text-xs font-medium text-[#c69a58] hover:underline"
          >
            See all ({PROPERTIES.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProperties.map(prop => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop.id)}
              className="rounded-3xl bg-[#0d2117] border border-[#1c3c2b] overflow-hidden hover:border-[#c69a58]/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="relative h-40 w-full bg-[#081710] overflow-hidden">
                <img
                  src={prop.imageUrl}
                  alt={prop.categoryLabel}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2117] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#07130e]/80 text-[#cca25d] text-[9px] font-bold uppercase border border-[#cca25d]/30">
                    {prop.categoryLabel}
                  </span>
                </div>
                <div className="absolute bottom-2 left-3">
                  <span className="text-xs font-bold text-white drop-shadow">
                    {prop.priceDisplay}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-[#f0e7d5] group-hover:text-[#cca25d] transition-colors">
                  {prop.title}
                </h4>
                <p className="text-xs text-[#869e90] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#cca25d] shrink-0" />
                  {prop.fullLocation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mirvai Diaspora Safe-Vault Protocol Callout */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0e2419] to-[#081710] border border-[#204532] space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#cca25d]" />
          <h4 className="font-editorial text-lg font-bold text-[#f2e7d3]">
            Mirvai Verified Title Protocol
          </h4>
        </div>
        <p className="text-xs text-[#9eb6a7] leading-relaxed">
          Zero risk for international buyers. We conduct ministry registry searches, physical boundary beacon coordinate inspections, and hold funds in regulated trust accounts.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#cad8cf]">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#cca25d]" />
            <span>Ministry C of O verification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#cca25d]" />
            <span>4K Drone video stream</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#cca25d]" />
            <span>Escrow milestone release</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#cca25d]" />
            <span>Encumbrance warranty</span>
          </div>
        </div>
      </div>
    </div>
  );
};
