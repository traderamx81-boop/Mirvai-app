import React, { useState } from 'react';
import { Search, ChevronLeft, Bookmark, ArrowRight, ShieldCheck, MapPin, Menu, Bed, Bath, Maximize } from 'lucide-react';
import { PropertyCategory } from '../types';
import { PROPERTIES } from '../data/propertiesData';
import { useAuth } from '../context/AuthContext';

interface PropertiesTabProps {
  onBack: () => void;
  onOpenMenu?: () => void;
  onSelectProperty: (propertyId: string) => void;
  initialCategory?: PropertyCategory;
}

export const PropertiesTab: React.FC<PropertiesTabProps> = ({
  onBack,
  onOpenMenu,
  onSelectProperty,
  initialCategory = 'All',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>(initialCategory);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {onOpenMenu ? (
            <button
              onClick={onOpenMenu}
              aria-label="Open menu"
              className="w-10 h-10 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onBack}
              aria-label="Back to home"
              className="w-10 h-10 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8]">
              Properties
            </h1>
            <p className="text-xs text-[#829b8c] mt-0.5">
              Clear categories. Verified before publication.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0e1f16] border border-[#183324] text-xs text-[#829b8c]">
          <ShieldCheck className="w-4 h-4 text-[#d5a55d]" />
          <span>{filtered.length} listings available</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5f776a]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by type, title or location (e.g. Lekki, Ikoyi, Epe)"
          className="w-full pl-10 pr-16 py-3 bg-[#08170f] border border-[#183324] rounded-2xl text-xs sm:text-sm text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-[#5f776a] hover:text-[#e3eee7]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#d5a55d] text-[#101f16] font-semibold shadow-md'
                  : 'bg-[#0e1f16] text-[#829b8c] border border-[#183324] hover:text-[#e3eee7] hover:bg-[#14291e]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Properties Cards Grid - Using Real High-Resolution Architectural Photography */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 px-4 rounded-3xl bg-[#08170f] border border-[#183324]">
            <p className="text-sm text-[#829b8c]">No properties found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#d5a55d] text-[#101f16] text-xs font-semibold cursor-pointer"
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
                className="rounded-3xl bg-[#0e1f16] border border-[#183324] overflow-hidden shadow-lg transition-all hover:border-[#d5a55d]/50 group flex flex-col justify-between cursor-pointer"
              >
                {/* Visual Real Photo Frame */}
                <div className="relative w-full h-56 bg-[#08170f] overflow-hidden">
                  <img
                    src={prop.imageUrl}
                    alt={prop.categoryLabel}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Luxury dark gradient overlay for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1f16] via-transparent to-black/40" />

                  {/* Title / Verification Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-[#06130b]/85 backdrop-blur-md border border-[#183324] text-[9px] font-bold tracking-widest uppercase text-[#d5a55d] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#d5a55d]" />
                      {prop.titleType}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSaveProperty(prop.id);
                      }}
                      aria-label="Save property"
                      className={`w-9 h-9 rounded-full flex items-center justify-center border backdrop-blur-md transition-all cursor-pointer ${
                        saved
                          ? 'bg-[#d5a55d] border-[#d5a55d] text-[#101f16] shadow-lg'
                          : 'bg-[#06130b]/80 border-[#183324] text-[#c2d4c8] hover:text-[#d5a55d]'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Specs Pill overlay at bottom of photo if bedrooms exist */}
                  {prop.bedrooms && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2.5 px-2.5 py-1 rounded-lg bg-[#06130b]/85 backdrop-blur-md border border-[#183324] text-[11px] text-[#c2d4c8]">
                      <span className="flex items-center gap-1 font-mono">
                        <Bed className="w-3.5 h-3.5 text-[#d5a55d]" />
                        {prop.bedrooms} beds
                      </span>
                      {prop.areaSqMeters && (
                        <span className="flex items-center gap-1 font-mono">
                          <Maximize className="w-3 h-3 text-[#d5a55d]" />
                          {prop.areaSqMeters} m²
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Content matching exact design */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.14em] text-[#d5a55d] uppercase block">
                      {prop.categoryLabel}
                    </span>
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8] mt-1 leading-snug group-hover:text-[#d5a55d] transition-colors">
                      {prop.title}
                    </h2>
                    <p className="text-xs text-[#82998b] mt-0.5">
                      {prop.subLocation}
                    </p>
                  </div>

                  {/* Bottom Row */}
                  <div className="pt-3 border-t border-[#14291e] flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#f0eee8]">
                      {prop.priceDisplay}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectProperty(prop.id);
                      }}
                      className="text-xs font-semibold text-[#d5a55d] hover:text-[#deb26d] inline-flex items-center gap-1 group/btn cursor-pointer"
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
