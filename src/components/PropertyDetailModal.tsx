import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, CheckCircle2, Bookmark, Video, FileText, Share2, Compass, Layers } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { MirvaiLogo } from './MirvaiLogo';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onEnquire: (property: Property) => void;
  onScheduleInspection: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onEnquire,
  onScheduleInspection,
}) => {
  const { isPropertySaved, toggleSaveProperty } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'title' | 'diaspora'>('overview');

  if (!property) return null;

  const saved = isPropertySaved(property.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0b1b13] border border-[#1f4230] rounded-t-[32px] sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="p-4 border-b border-[#183626] flex items-center justify-between bg-[#08150f]">
          <div className="flex items-center gap-2">
            <MirvaiLogo variant="badge" showTagline={false} size="sm" />
            <span className="text-xs text-[#82998b] font-medium">Verified Property Details</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveProperty(property.id)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                saved
                  ? 'bg-[#cca25d] border-[#cca25d] text-[#0a1711]'
                  : 'bg-[#0e2117] border-[#1d3d2c] text-[#8fa397]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#0e2117] border border-[#1d3d2c] flex items-center justify-center text-[#8fa397] hover:text-[#e4be78]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Main Visual */}
          <div className="relative h-56 rounded-2xl overflow-hidden border border-[#1d3d2c] bg-[#07130e]">
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#07130e]/85 backdrop-blur-md border border-[#214733] text-[9px] font-bold tracking-widest uppercase text-[#cad8cf]">
                SAMPLE LAYOUT &amp; VERIFIED
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#cca25d] text-[#0a1711] text-[9px] font-bold uppercase">
                {property.categoryLabel}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#dfb877] font-semibold">
                  {property.titleType}
                </span>
                <p className="text-base font-bold text-white font-editorial">{property.priceDisplay}</p>
              </div>
              {property.numericPrice && (
                <span className="text-xs bg-[#0b1b13]/90 px-2 py-1 rounded border border-[#214733] text-[#cad8cf]">
                  ≈ ${(property.numericPrice / 1500).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                </span>
              )}
            </div>
          </div>

          {/* Sub Navigation in Modal */}
          <div className="flex border-b border-[#183626]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#cca25d] text-[#dfb877]'
                  : 'border-transparent text-[#82998b] hover:text-[#dce7e1]'
              }`}
            >
              Overview &amp; Specs
            </button>
            <button
              onClick={() => setActiveTab('title')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'title'
                  ? 'border-[#cca25d] text-[#dfb877]'
                  : 'border-transparent text-[#82998b] hover:text-[#dce7e1]'
              }`}
            >
              Title Verification
            </button>
            <button
              onClick={() => setActiveTab('diaspora')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'diaspora'
                  ? 'border-[#cca25d] text-[#dfb877]'
                  : 'border-transparent text-[#82998b] hover:text-[#dce7e1]'
              }`}
            >
              Diaspora Inspection
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#f2e7d3]">
                  {property.title}
                </h3>
                <p className="text-xs text-[#82998b] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#cca25d]" />
                  {property.fullLocation}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#091710] border border-[#183626] text-center">
                {property.bedrooms && (
                  <div>
                    <span className="text-[10px] text-[#7d9586] uppercase block">Bedrooms</span>
                    <span className="text-sm font-bold text-[#f2e7d3]">{property.bedrooms} Ensuite</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <span className="text-[10px] text-[#7d9586] uppercase block">Bathrooms</span>
                    <span className="text-sm font-bold text-[#f2e7d3]">{property.bathrooms}</span>
                  </div>
                )}
                {property.areaSqMeters && (
                  <div>
                    <span className="text-[10px] text-[#7d9586] uppercase block">Plot / Floor</span>
                    <span className="text-sm font-bold text-[#f2e7d3]">{property.areaSqMeters} m²</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#dfb877]">Description</h4>
                <p className="text-xs text-[#cad8cf] leading-relaxed">{property.description}</p>
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#dfb877]">Verified Features</h4>
                <div className="space-y-1.5">
                  {property.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#b9cebf]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#cca25d] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'title' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-[#091710] border border-[#1d402e] flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#cca25d] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#f2e7d3]">100% Verified Legal Standing</h4>
                  <p className="text-xs text-[#8fa397] mt-0.5">
                    Mirvai’s real estate attorneys have verified this property directly at the State Lands Registry.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#0d2117] border border-[#1b3a2a] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#f0e7d5]">Primary Title Deed</p>
                    <p className="text-[11px] text-[#82998b]">{property.titleType} (Registered &amp; Gazetted)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                    AUTHENTICATED
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0d2117] border border-[#1b3a2a] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#f0e7d5]">Cadastral Beacon Survey</p>
                    <p className="text-[11px] text-[#82998b]">Coordinates verified with Surveyor General</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                    CLEAR
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0d2117] border border-[#1b3a2a] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#f0e7d5]">Encumbrance &amp; Litigation Check</p>
                    <p className="text-[11px] text-[#82998b]">Zero court injunctions, zero family disputes</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                    CLEAR
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diaspora' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-[#091710] border border-[#1b3a2a] space-y-2">
                <h4 className="font-editorial text-base font-bold text-[#f2e7d3]">
                  Overseas Buyer Protection Protocol
                </h4>
                <p className="text-xs text-[#9eb6a7] leading-relaxed">
                  Buying from the UK, US, Canada, or UAE? Mirvai acts as your physical fiduciary in Nigeria. We execute live video walkthroughs, unedited 4K drone sweeps of the access roads and surrounding drainage, and legal escrow.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#0d2117] border border-[#183626]">
                  <Video className="w-4 h-4 text-[#cca25d] mb-1" />
                  <p className="font-semibold text-[#f0e7d5]">Live Drone Video</p>
                  <p className="text-[10px] text-[#7d9586] mt-0.5">High definition perimeter scan</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0d2117] border border-[#183626]">
                  <Layers className="w-4 h-4 text-[#cca25d] mb-1" />
                  <p className="font-semibold text-[#f0e7d5]">Escrow Trust</p>
                  <p className="text-[10px] text-[#7d9586] mt-0.5">Disbursement upon verified milestones</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-[#08150f] border-t border-[#183626] flex gap-2">
          <button
            onClick={() => {
              onClose();
              onScheduleInspection(property);
            }}
            className="flex-1 py-3 rounded-xl bg-[#132c1f] hover:bg-[#1a3c2a] border border-[#234b35] text-xs font-semibold text-[#dfb877] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Video className="w-4 h-4" />
            <span>Book Remote Inspection</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onEnquire(property);
            }}
            className="flex-1 py-3 rounded-xl bg-[#cca25d] hover:bg-[#d8b06b] text-[#0a1711] text-xs font-bold transition-colors shadow-md"
          >
            Send Property Brief
          </button>
        </div>
      </div>
    </div>
  );
};
