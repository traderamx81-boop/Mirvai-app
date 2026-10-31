import React, { useState } from 'react';
import { Search, ChevronLeft, Bookmark, ArrowRight, ShieldCheck, MapPin, Eye, Sparkles } from 'lucide-react';
import { Property, PropertyCategory } from '../types';
import { PROPERTIES } from '../data/propertiesData';
import { useAuth } from '../context/AuthContext';

interface PropertiesTabProps {
  onBack: () => void;
  onSelectProperty: (propertyId: string) => void;
}

export const PropertiesTab: React.FC<PropertiesTabProps> = ({ onBack, onSelectProperty }) => {
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { isPropertySaved, toggleSaveProperty } = useAuth();

  const categories: PropertyCategory[] = [
    'All',
    'Terrace',
    'Detached',
    'Semi-detached',
    'Land',
    'Off-plan',
  ];

  const filtered = PROPERTIES.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fullLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-28 pt-2 w-full max-w-6xl mx-auto">
      {/* Header matching Screenshot 3 */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onBack}
          aria-label="Back to home"
          className="w-10 h-10 rounded-full bg-[#0d2117] border border-[#1d3d2c] flex items-center justify-center text-[#dfb877] hover:bg-[#132f21] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-editorial text-3xl font-bold text-[#f2e7d3]">
            Properties
          </h1>
          <p className="text-xs text-[#82998b] mt-0.5">
            Clear categories. Verified before publication.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#738b7d]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by type or location"
          className="w-full pl-10 pr-4 py-3 bg-[#0b1b13] border border-[#1b3a2a] rounded-2xl text-xs sm:text-sm text-[#e3ece7] placeholder-[#647c6e] focus:outline-none focus:border-[#c69a58] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-[#738b7d] hover:text-[#e3ece7]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills Bar matching Screenshot 3 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#cca25d] text-[#0a1711] font-semibold shadow-md'
                  : 'bg-[#0f241a] text-[#8ca495] border border-[#1a3828] hover:text-[#dce7e1] hover:bg-[#142e20]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Properties Cards Grid - Responsive & with Real Luxury Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 px-4 rounded-3xl bg-[#0b1b13] border border-[#183626]">
            <p className="text-sm text-[#8fa397]">No properties found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#cca25d] text-[#0a1711] text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map(prop => {
            const saved = isPropertySaved(prop.id);
            return (
              <div
                key={prop.id}
                onClick={() => onSelectProperty(prop.id)}
                className="rounded-3xl bg-[#0d2117] border border-[#1c3c2b] overflow-hidden shadow-lg transition-all hover:border-[#c69a58]/60 group flex flex-col justify-between cursor-pointer"
              >
                {/* Real High-Resolution Luxury Architectural Photography */}
                <div className="relative w-full h-56 bg-[#091811] overflow-hidden">
                  <img
                    src={prop.imageUrl}
                    alt={prop.categoryLabel}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle Luxury Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2117] via-transparent to-black/30 pointer-events-none" />

                  {/* Sample Layout & Verification Badge (top-left) */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#07130e]/85 backdrop-blur-md border border-[#214733] text-[9px] font-bold tracking-widest uppercase text-[#cad8cf]">
                      VERIFIED PROPERTY
                    </span>
                    <span className="px-2 py-1 rounded-md bg-[#cca25d]/90 text-[#0a1711] text-[9px] font-bold tracking-wider uppercase">
                      {prop.category}
                    </span>
                  </div>

                  {/* Bookmark Button (top-right) */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSaveProperty(prop.id);
                      }}
                      aria-label="Save property"
                      className={`w-9 h-9 rounded-full flex items-center justify-center border backdrop-blur-md transition-all ${
                        saved
                          ? 'bg-[#cca25d] border-[#cca25d] text-[#0a1711] shadow-lg'
                          : 'bg-[#07130e]/80 border-[#214733] text-[#cad8cf] hover:text-[#cca25d]'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Quick specs pill (bottom-left overlay) */}
                  <div className="absolute bottom-3 left-3.5 flex items-center gap-2 text-[10px] text-white/90">
                    {prop.bedrooms && (
                      <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 font-medium">
                        {prop.bedrooms} Beds
                      </span>
                    )}
                    {prop.areaSqMeters && (
                      <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 font-medium">
                        {prop.areaSqMeters} m²
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content matching Screenshot 3 */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.14em] text-[#cca25d] uppercase block">
                      {prop.categoryLabel}
                    </span>
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#f2e7d3] mt-1 leading-snug group-hover:text-[#cca25d] transition-colors">
                      {prop.title}
                    </h2>
                    <p className="text-xs text-[#82998b] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#cca25d] shrink-0" />
                      {prop.fullLocation}
                    </p>
                  </div>

                  {/* Verified Title & Key Tag */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#9eb6a7] bg-[#12281e] px-2.5 py-1 rounded-lg border border-[#1f4230]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#cca25d]" />
                      {prop.titleType}
                    </span>
                    {prop.numericPrice && (
                      <span className="text-[11px] font-semibold text-[#cca25d]">
                        ₦{(prop.numericPrice / 1000000).toLocaleString()}M
                      </span>
                    )}
                  </div>

                  {/* Bottom Row matching Screenshot 3 */}
                  <div className="pt-3 border-t border-[#183627] flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#f0e7d5]">
                      {prop.priceDisplay}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectProperty(prop.id);
                      }}
                      className="text-xs font-semibold text-[#cca25d] hover:text-[#e4be78] inline-flex items-center gap-1 group/btn"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
