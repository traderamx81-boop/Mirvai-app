import React, { useState } from 'react';
import { X, Calendar, Video, Clock, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROPERTIES } from '../data/propertiesData';

interface AppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPropertyTitle?: string;
}

export const AppointmentsModal: React.FC<AppointmentsModalProps> = ({
  isOpen,
  onClose,
  preselectedPropertyTitle,
}) => {
  const { appointments, addAppointment } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState(preselectedPropertyTitle || PROPERTIES[0].title);
  const [inspectionType, setInspectionType] = useState<'Live 4K Drone Walkthrough' | 'In-Person Broker Escort' | 'Surveyor Legal Inspection'>('Live 4K Drone Walkthrough');
  const [dateTime, setDateTime] = useState('Tomorrow at 02:00 PM (WAT / GMT+1)');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      propertyTitle,
      type: inspectionType,
      dateTime,
      agentName: 'Oluwaseun Adeyemi (Lead Surveyor)',
      meetingLink: 'https://mirvai.secure/stream/live-' + Math.floor(1000 + Math.random() * 9000),
    });
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0e1f16] border border-[#183324] rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#82998c] hover:text-[#d5a55d] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#d5a55d]" />
              <h2 className="font-editorial text-2xl font-bold text-[#f0eee8]">
                Inspection Appointments
              </h2>
            </div>
            <p className="text-xs text-[#82998c] mt-0.5">
              Live remote 4K walkthroughs and physical land surveys.
            </p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-3 py-1.5 rounded-full bg-[#d5a55d] text-[#101f16] text-xs font-bold flex items-center gap-1 hover:bg-[#deb26d] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New</span>
          </button>
        </div>

        {isCreating ? (
          <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-[#08170f] border border-[#183324] space-y-3">
            <h4 className="text-xs font-bold text-[#d5a55d] uppercase tracking-wider">
              Schedule New Remote Walkthrough
            </h4>

            <div>
              <label className="block text-[11px] font-medium text-[#82998c] mb-1">
                Property Unit
              </label>
              <select
                value={propertyTitle}
                onChange={e => setPropertyTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0e1f16] border border-[#183324] rounded-xl text-xs text-[#e3eee7] focus:outline-none focus:border-[#d5a55d]"
              >
                {PROPERTIES.map(p => (
                  <option key={p.id} value={p.title}>
                    {p.categoryLabel} – {p.title} ({p.fullLocation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#82998c] mb-1">
                Inspection Mode
              </label>
              <select
                value={inspectionType}
                onChange={e => setInspectionType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#0e1f16] border border-[#183324] rounded-xl text-xs text-[#e3eee7] focus:outline-none focus:border-[#d5a55d]"
              >
                <option value="Live 4K Drone Walkthrough">Live 4K Drone Walkthrough (Overseas Stream)</option>
                <option value="In-Person Broker Escort">In-Person Broker Escort</option>
                <option value="Surveyor Legal Inspection">Surveyor Legal Inspection &amp; Beacons</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#82998c] mb-1">
                Preferred Date &amp; Time (Include Timezone)
              </label>
              <input
                type="text"
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
                placeholder="e.g. Saturday at 3:00 PM UK Time (BST)"
                className="w-full px-3.5 py-2.5 bg-[#0e1f16] border border-[#183324] rounded-xl text-xs text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d]"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 rounded-xl bg-[#0e1f16] text-xs font-semibold text-[#82998c] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#d5a55d] text-[#101f16] text-xs font-bold hover:bg-[#deb26d] cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        ) : null}

        <div className="space-y-3 pt-1">
          {appointments.length === 0 ? (
            <p className="text-center text-xs text-[#82998c] py-8">No scheduled inspection appointments yet.</p>
          ) : (
            appointments.map(apt => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-[#08170f] border border-[#183324] space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#14291e] text-[#d5a55d] flex items-center justify-center shrink-0 mt-0.5">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#f0eee8] leading-snug">
                        {apt.propertyTitle}
                      </h4>
                      <span className="text-[10px] text-[#d5a55d] font-semibold uppercase tracking-wider block mt-0.5">
                        {apt.type}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold shrink-0">
                    {apt.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#82998c] flex items-center justify-between pt-1 border-t border-[#14291e]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d5a55d]" />
                    {apt.dateTime}
                  </span>
                  <span>Lead: {apt.agentName.split(' ')[0]}</span>
                </div>

                {apt.meetingLink && (
                  <button
                    onClick={() => alert(`Connecting to private encrypted 4K inspection stream for ${apt.propertyTitle}`)}
                    className="w-full py-2 rounded-xl bg-[#d5a55d] text-[#101f16] text-xs font-bold hover:bg-[#deb26d] transition-colors cursor-pointer"
                  >
                    Join Live 4K Walkthrough Stream
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
