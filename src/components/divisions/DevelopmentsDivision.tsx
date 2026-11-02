import React, { useState } from 'react';
import { Menu, Sparkles, CheckCircle2, Calendar, FileText, KeyRound, Bell, ArrowRight } from 'lucide-react';

interface DevelopmentsDivisionProps {
  onOpenMenu: () => void;
  onOpenEnquiry: (categoryLabel: string) => void;
}

export const DevelopmentsDivision: React.FC<DevelopmentsDivisionProps> = ({
  onOpenMenu,
  onOpenEnquiry,
}) => {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const modules = [
    {
      title: 'New launches',
      desc: 'First access to upcoming Mirvai-built estates',
      detail: 'Architectural renderings, site master plans, and exclusive allocation windows before general market announcement.',
      icon: Sparkles,
    },
    {
      title: 'Project progress',
      desc: 'Milestone photos, construction updates and timeline tracking',
      detail: 'Bi-weekly high-resolution drone footage, engineering sign-offs, and transparent site progress logs.',
      icon: Calendar,
    },
    {
      title: 'Payment plans',
      desc: 'Structured milestone schedules tied to real site completion',
      detail: 'Protected escrow disbursement tied to certified construction benchmarks (foundation, decking, finishes).',
      icon: FileText,
    },
    {
      title: 'Ownership journey',
      desc: 'From allocation to title perfection and key handover',
      detail: 'Seamless digital deeds, Governor’s Consent processing, and turnkey keys collection.',
      icon: KeyRound,
    },
  ];

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setWaitlistSubmitted(true);
      setTimeout(() => {
        setWaitlistEmail('');
      }, 4000);
    }
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
            Mirvai Developments
          </h1>
          <p className="text-xs sm:text-sm text-[#829b8c] mt-0.5">
            Mirvai-owned residential projects
          </p>
        </div>
      </div>

      {/* Hero Card matching Screenshot */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#12271c] to-[#0c1c13] border border-[#1d3d2c] p-6 sm:p-7 overflow-hidden shadow-xl">
        <div className="absolute right-[-15px] bottom-[-30px] font-editorial text-[140px] font-black text-[#1b3d2b]/25 select-none pointer-events-none leading-none">
          M
        </div>

        <div className="relative z-10 space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c281e] border border-[#d5a55d]/40 text-[10px] font-bold tracking-widest text-[#d5a55d] uppercase">
            FUTURE DIVISION
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8]">
            Mirvai Developments
          </h2>

          <p className="text-xs sm:text-sm text-[#a4baa9] leading-relaxed max-w-lg">
            Mirvai’s proprietary development pipeline will deliver master-planned residential communities, architectural distinction, and transparent off-plan delivery.
          </p>
        </div>
      </div>

      {/* What clients will see here */}
      <div className="space-y-3.5 pt-2">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#f0eee8]">
          What clients will see here
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0e1f16] border border-[#183324] flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-[#06130b] border border-[#183324] flex items-center justify-center text-[#d5a55d] mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-[#f0eee8]">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-[#829b8c] mt-1.5 leading-relaxed">
                    {mod.desc}
                  </p>
                  <p className="text-[11px] text-[#5f776a] mt-2.5 pt-2.5 border-t border-[#183324]/50 leading-relaxed">
                    {mod.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Waitlist / Launch Notification */}
      <div className="p-6 rounded-3xl bg-[#0c1a12] border border-[#1d3d2c] space-y-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#14291e] border border-[#d5a55d]/30 flex items-center justify-center text-[#d5a55d]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-editorial text-lg font-bold text-[#f0eee8]">
              Join the Priority Pipeline
            </h4>
            <p className="text-xs text-[#829b8c]">
              Receive first allocations before public release.
            </p>
          </div>
        </div>

        {waitlistSubmitted ? (
          <div className="p-4 rounded-2xl bg-[#122b1e] border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Thank you. Your email has been added to the private developments priority roster.</span>
          </div>
        ) : (
          <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              value={waitlistEmail}
              onChange={e => setWaitlistEmail(e.target.value)}
              placeholder="Enter your email or phone for VIP alerts"
              className="flex-1 px-4 py-3 bg-[#08170f] border border-[#183324] rounded-xl text-xs sm:text-sm text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d]"
            />
            <button
              type="submit"
              className="py-3 px-5 rounded-xl bg-[#d5a55d] text-[#101f16] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#c4944b] transition-colors cursor-pointer shrink-0"
            >
              <span>Get early access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
