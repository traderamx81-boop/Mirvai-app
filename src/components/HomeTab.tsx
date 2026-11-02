import React, { useState } from 'react';
import { Search, ArrowUpRight, Home as HomeIcon, MessageSquare, ShieldCheck, Check, Building, MapPin } from 'lucide-react';
import { PROPERTIES } from '../data/propertiesData';
import { TabType } from './BottomNav';
import { PropertyCategory } from '../types';
import { useAuth } from '../context/AuthContext';

interface HomeTabProps {
  onNavigateTab: (tab: TabType, category?: PropertyCategory) => void;
  onSelectProperty: (propertyId: string) => void;
  onOpenDiasporaModal: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigateTab,
  onSelectProperty,
  onOpenDiasporaModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isPropertySaved, toggleSaveProperty } = useAuth();

  const propertyTypes: {
    id: PropertyCategory;
    name: string;
    count: string;
    imageUrl: string;
  }[] = [
    {
      id: 'Terrace',
      name: 'Terrace duplex',
      count: '18 verified',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Detached',
      name: 'Detached homes',
      count: '12 verified',
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Land',
      name: 'Land',
      count: '24 plots',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Semi-detached',
      name: 'Semi-detached',
      count: '9 verified',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Off-plan',
      name: 'Off-plan',
      count: '6 projects',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
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
      {/* Active status indicator matching Screenshot 1 */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#829b8c]">
          MIRVAI REALTY · <span className="text-emerald-400">ACTIVE NOW</span>
        </span>
      </div>

      {/* Hero Headline matching Screenshot 1 */}
      <div className="space-y-1">
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f0eee8] leading-[1.08]">
          Find. Grow.<br />
          <span className="text-[#d5a55d]">Invest.</span>
        </h1>
        <p className="text-sm sm:text-base text-[#829b8c] leading-relaxed pt-2 max-w-lg">
          Your property journey, clearly guided—from first search to final documentation.
        </p>
      </div>

      {/* Search Input Bar matching Screenshot 1 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5f776a]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search properties, locations or opportunities"
          className="w-full pl-10 pr-4 py-3.5 bg-[#08170f] border border-[#183324] rounded-2xl text-xs sm:text-sm text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d] focus:ring-1 focus:ring-[#d5a55d] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-[#5f776a] hover:text-[#e3eee7]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Two Main Action Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
        {/* Left Card: Warm Gold Card matching Screenshot 1 */}
        <button
          onClick={() => onNavigateTab('properties')}
          className="p-5 rounded-3xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#101f16] text-left flex flex-col justify-between min-h-[170px] transition-all duration-200 shadow-xl group relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-[#101f16]/10 flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-[#101f16]" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#101f16] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div className="mt-6">
            <h3 className="font-editorial text-2xl font-bold text-[#101f16] leading-tight">
              Find a<br />property
            </h3>
            <p className="text-xs text-[#25392d] font-semibold mt-1">
              Explore verified opportunities
            </p>
          </div>
        </button>

        {/* Right Card: Dark Forest Card matching Screenshot 1 */}
        <button
          onClick={onOpenDiasporaModal}
          className="p-5 rounded-3xl bg-[#0e1f16] hover:bg-[#12281d] border border-[#183324] text-left flex flex-col justify-between min-h-[170px] transition-all duration-200 shadow-md group relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-[#14291e] border border-[#1f3d2e] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#d5a55d]" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#738b7d] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#d5a55d]" />
          </div>
          <div className="mt-6">
            <h3 className="font-editorial text-2xl font-bold text-[#f0eee8] leading-tight">
              Diaspora<br />desk
            </h3>
            <p className="text-xs text-[#829b8c] font-medium mt-1">
              Remote guidance &amp; inspections
            </p>
          </div>
        </button>
      </div>

      {/* Explore by Type Section matching Screenshot 1 with Real Architectural Photography */}
      <div className="space-y-3 pt-2">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8]">
              Explore by type
            </h2>
            <p className="text-xs text-[#829b8c] mt-0.5">
              A cleaner route to the right property
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('properties')}
            className="text-xs font-semibold text-[#d5a55d] hover:underline pb-0.5 cursor-pointer"
          >
            View all
          </button>
        </div>

        {/* Horizontal Carousel with Real Luxury Images */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
          {propertyTypes.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigateTab('properties', item.id)}
              className="flex-shrink-0 w-36 sm:w-44 p-3 rounded-2xl bg-[#0e1f16] border border-[#183324] hover:border-[#d5a55d]/50 text-left transition-all duration-200 snap-start group cursor-pointer"
            >
              <div className="w-full h-24 rounded-xl bg-[#08170f] border border-[#14291e] overflow-hidden relative group-hover:scale-[1.02] transition-transform">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1f16] via-transparent to-transparent opacity-80" />
              </div>
              <p className="text-xs font-bold text-[#f0eee8] mt-2.5 truncate group-hover:text-[#d5a55d] transition-colors">
                {item.name}
              </p>
              <span className="text-[10px] text-[#63786b] block mt-0.5">
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Verified Opportunities Featured Preview */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#f0eee8]">
              Verified listings
            </h3>
            <p className="text-xs text-[#829b8c]">
              Title search verified by Mirvai Legal
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('properties')}
            className="text-xs font-medium text-[#d5a55d] hover:underline cursor-pointer"
          >
            See all ({PROPERTIES.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProperties.map(prop => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop.id)}
              className="rounded-3xl bg-[#0e1f16] border border-[#183324] overflow-hidden hover:border-[#d5a55d]/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="relative h-44 w-full bg-[#08170f] overflow-hidden">
                <img
                  src={prop.imageUrl}
                  alt={prop.categoryLabel}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1f16] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#06130b]/85 text-[#d5a55d] text-[9px] font-bold uppercase border border-[#d5a55d]/30">
                    {prop.categoryLabel}
                  </span>
                </div>
                <div className="absolute bottom-2 left-3">
                  <span className="text-xs font-bold text-[#f0eee8] drop-shadow">
                    {prop.priceDisplay}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-[#f0eee8] group-hover:text-[#d5a55d] transition-colors">
                  {prop.title}
                </h4>
                <p className="text-xs text-[#82998b] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d5a55d] shrink-0" />
                  {prop.fullLocation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mirvai Diaspora Safe-Vault Protocol Callout */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0e1f16] to-[#08170f] border border-[#183324] space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#d5a55d]" />
          <h4 className="font-editorial text-lg font-bold text-[#f0eee8]">
            Mirvai Verified Title Protocol
          </h4>
        </div>
        <p className="text-xs text-[#82998b] leading-relaxed">
          Zero risk for international buyers. We conduct ministry registry searches, physical boundary beacon coordinate inspections, and hold funds in regulated trust accounts.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#c2d4c8]">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#d5a55d]" />
            <span>Ministry C of O verification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#d5a55d]" />
            <span>4K Drone video stream</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#d5a55d]" />
            <span>Escrow milestone release</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#d5a55d]" />
            <span>Encumbrance warranty</span>
          </div>
        </div>
      </div>
    </div>
  );
};
