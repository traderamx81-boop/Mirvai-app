import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Shield, Clock } from 'lucide-react';
import { PROPERTY_TYPES, BUDGET_RANGES } from '../data/propertiesData';
import { useAuth } from '../context/AuthContext';

interface EnquiryTabProps {
  onBack: () => void;
  preselectedPropertyType?: string;
}

export const EnquiryTab: React.FC<EnquiryTabProps> = ({
  onBack,
  preselectedPropertyType = 'Terrace duplex',
}) => {
  const { user, addBrief, briefs } = useAuth();
  const [propertyType, setPropertyType] = useState(preselectedPropertyType);
  const [budgetRange, setBudgetRange] = useState('Select a range');
  const [contact, setContact] = useState(user.phone || user.email || '');
  const [detail, setDetail] = useState('');
  const [privacyRelay, setPrivacyRelay] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'history'>('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      alert('Please provide a phone number or email so the advisory desk can connect.');
      return;
    }

    addBrief({
      propertyType,
      budgetRange: budgetRange === 'Select a range' ? 'Flexible' : budgetRange,
      contact,
      detail: detail.trim() || 'Standard diaspora advisory and verification required.',
      privacyRelayActive: privacyRelay,
    });

    setSubmitted(true);
  };

  return (
    <div className="space-y-5 pb-28 pt-2 w-full max-w-xl mx-auto">
      {/* Header matching Screenshot 4 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            aria-label="Back to home"
            className="w-10 h-10 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-editorial text-3xl font-bold text-[#f0eee8]">
              Property brief
            </h1>
            <p className="text-xs text-[#82998c] mt-0.5">
              Start short. Add details after contact.
            </p>
          </div>
        </div>

        {briefs.length > 0 && (
          <button
            onClick={() => setViewMode(viewMode === 'form' ? 'history' : 'form')}
            className="px-3 py-1.5 rounded-full bg-[#0e1f16] border border-[#183324] text-xs font-semibold text-[#d5a55d] cursor-pointer"
          >
            {viewMode === 'form' ? `Active (${briefs.length})` : 'New brief'}
          </button>
        )}
      </div>

      {viewMode === 'history' ? (
        /* History of submitted briefs */
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#f0eee8] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#d5a55d]" />
            Your Submitted Property Briefs
          </h2>
          {briefs.map(brief => (
            <div
              key={brief.id}
              className="p-4 rounded-2xl bg-[#0e1f16] border border-[#183324] space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#d5a55d]">
                    {brief.propertyType}
                  </span>
                  <h3 className="font-bold text-[#f0eee8] text-sm mt-0.5">
                    Budget: {brief.budgetRange}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  {brief.status}
                </span>
              </div>
              <p className="text-xs text-[#82998c] leading-relaxed">
                "{brief.detail}"
              </p>
              <div className="pt-2 border-t border-[#14291e] flex items-center justify-between text-[11px] text-[#63786b]">
                <span>Contact: {brief.privacyRelayActive ? '••••••••' + brief.contact.slice(-4) : brief.contact}</span>
                <span>{brief.timestamp}</span>
              </div>
            </div>
          ))}
          <button
            onClick={() => setViewMode('form')}
            className="w-full py-3 rounded-2xl bg-[#d5a55d] text-[#101f16] text-xs font-bold cursor-pointer"
          >
            Submit Another Brief
          </button>
        </div>
      ) : submitted ? (
        /* Submission Success Card */
        <div className="p-6 rounded-3xl bg-[#0e1f16] border border-[#183324] text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#f0eee8]">
              Brief Received
            </h3>
            <p className="text-xs text-[#82998c] mt-1.5 max-w-xs mx-auto leading-relaxed">
              Your property brief has been lodged into the Mirvai Private Advisory desk. A senior broker will review verified inventory and reach out via your preferred channel.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#08170f] border border-[#14291e] text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#82998c]">Target Type:</span>
              <span className="font-semibold text-[#f0eee8]">{propertyType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#82998c]">Allocated Budget:</span>
              <span className="font-semibold text-[#f0eee8]">{budgetRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#82998c]">Privacy Shield:</span>
              <span className="font-semibold text-emerald-400">Encrypted Relay Active</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                setSubmitted(false);
                setDetail('');
              }}
              className="flex-1 py-3 rounded-xl bg-[#14291e] text-[#d5a55d] text-xs font-semibold hover:bg-[#1a3828] cursor-pointer"
            >
              Submit New Brief
            </button>
            <button
              onClick={() => setViewMode('history')}
              className="flex-1 py-3 rounded-xl bg-[#d5a55d] text-[#101f16] text-xs font-bold hover:bg-[#deb26d] cursor-pointer"
            >
              View All Briefs
            </button>
          </div>
        </div>
      ) : (
        /* Form Card strictly matching Screenshot 4 */
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1f16] border border-[#183324] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="font-editorial text-2xl sm:text-[26px] font-bold text-[#f0eee8] leading-tight">
                What are you looking for?
              </h2>
              <p className="text-xs text-[#82998c] mt-1">
                A simpler first step designed to reduce form fatigue.
              </p>
            </div>

            {/* Field 1: Property Type matching Screenshot 4 */}
            <div className="space-y-1.5">
              <label htmlFor="property-type" className="block text-xs font-medium text-[#c2d4c8]">
                Property type
              </label>
              <div className="relative">
                <select
                  id="property-type"
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-[#08170f] border border-[#183324] rounded-2xl text-xs sm:text-sm text-[#e3eee7] focus:outline-none focus:border-[#d5a55d] transition-colors cursor-pointer"
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type} className="bg-[#0e1f16] text-[#e3eee7]">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#5f776a]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Field 2: Budget Range matching Screenshot 4 */}
            <div className="space-y-1.5">
              <label htmlFor="budget-range" className="block text-xs font-medium text-[#c2d4c8]">
                Budget range
              </label>
              <div className="relative">
                <select
                  id="budget-range"
                  value={budgetRange}
                  onChange={e => setBudgetRange(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-[#08170f] border border-[#183324] rounded-2xl text-xs sm:text-sm text-[#e3eee7] focus:outline-none focus:border-[#d5a55d] transition-colors cursor-pointer"
                >
                  {BUDGET_RANGES.map(range => (
                    <option key={range} value={range} className="bg-[#0e1f16] text-[#e3eee7]">
                      {range}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#5f776a]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Field 3: Phone or email matching Screenshot 4 */}
            <div className="space-y-1.5">
              <label htmlFor="contact-input" className="block text-xs font-medium text-[#c2d4c8]">
                Phone or email
              </label>
              <input
                id="contact-input"
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="How should Mirvai reach you?"
                className="w-full px-4 py-3 bg-[#08170f] border border-[#183324] rounded-2xl text-xs sm:text-sm text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d] transition-colors"
                required
              />
            </div>

            {/* Field 4: One important detail (optional) matching Screenshot 4 */}
            <div className="space-y-1.5">
              <label htmlFor="detail-input" className="block text-xs font-medium text-[#c2d4c8]">
                One important detail <span className="text-[#82998c]">(optional)</span>
              </label>
              <textarea
                id="detail-input"
                rows={3}
                value={detail}
                onChange={e => setDetail(e.target.value)}
                placeholder="Preferred location, timeline or purpose"
                className="w-full px-4 py-3 bg-[#08170f] border border-[#183324] rounded-2xl text-xs sm:text-sm text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d] transition-colors resize-none"
              />
            </div>

            {/* Privacy Relay Toggle */}
            <div className="p-3 rounded-2xl bg-[#08170f] border border-[#14291e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#d5a55d]" />
                <div>
                  <p className="text-xs font-semibold text-[#f0eee8]">Client Privacy Shield</p>
                  <p className="text-[10px] text-[#82998c]">Anonymize contact info during initial vetting</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyRelay(!privacyRelay)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  privacyRelay ? 'bg-[#d5a55d]' : 'bg-[#183324]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#101f16] transition-transform ${
                    privacyRelay ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Gold Submit Button matching Screenshot 4 */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#101f16] font-semibold text-sm tracking-wide transition-all duration-200 shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Send my property brief</span>
            </button>

            {/* Footer notice matching Screenshot 4 */}
            <p className="text-center text-[10px] text-[#63786b] pt-1">
              Preview only—this concept does not send or store personal information.
            </p>
          </form>
        </div>
      )}
    </div>
  );
};
