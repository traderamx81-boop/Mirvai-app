import React from 'react';
import { X, Bookmark, ArrowRight, Trash2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROPERTIES } from '../data/propertiesData';

interface SavedPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (propertyId: string) => void;
}

export const SavedPropertiesModal: React.FC<SavedPropertiesModalProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
}) => {
  const { savedPropertyIds, toggleSaveProperty } = useAuth();

  if (!isOpen) return null;

  const savedList = PROPERTIES.filter(p => savedPropertyIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0b1b13] border border-[#1f4230] rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0e2117] border border-[#1d3d2c] flex items-center justify-center text-[#8fa397] hover:text-[#cca25d]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pt-1">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#cca25d] fill-current" />
            <h2 className="font-editorial text-2xl font-bold text-[#f2e7d3]">
              Saved Properties ({savedList.length})
            </h2>
          </div>
          <p className="text-xs text-[#82998b] mt-0.5">
            Your shortlisted opportunities for diaspora investment.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {savedList.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#82998b]">
              No saved properties yet. Tap the bookmark icon on any property card to save it here.
            </div>
          ) : (
            savedList.map(prop => (
              <div
                key={prop.id}
                className="p-3.5 rounded-2xl bg-[#091710] border border-[#1b3a2a] flex items-center justify-between gap-3 hover:border-[#cca25d]/40 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-[#0e2117] overflow-hidden shrink-0 border border-[#1d3d2c]">
                  <img src={prop.imageUrl} alt={prop.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold tracking-wider text-[#cca25d] uppercase">
                    {prop.categoryLabel}
                  </span>
                  <h4 className="text-xs font-bold text-[#f0e7d5] truncate">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-[#82998b] truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#cca25d] shrink-0" />
                    {prop.fullLocation}
                  </p>
                  <p className="text-xs font-semibold text-[#f2e7d3] mt-1">{prop.priceDisplay}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProperty(prop.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#cca25d] text-[#0a1711] text-xs font-bold hover:bg-[#d8b06b]"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => toggleSaveProperty(prop.id)}
                    className="p-1 text-center text-[#7d9586] hover:text-red-400 text-[10px]"
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
