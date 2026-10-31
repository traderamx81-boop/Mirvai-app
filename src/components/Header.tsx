import React, { useState } from 'react';
import { MirvaiLogo } from './MirvaiLogo';
import { Bell, ShieldCheck, ChevronLeft, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentTab: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onBack, showBack = false }) => {
  const { user, setAuthModalOpen, setPrivacyModalOpen } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: 'Title Verified: Lekki Phase 1',
      desc: 'Governor’s Consent verification passed with zero encumbrances.',
      time: '18m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Diaspora Inspection Ready',
      desc: 'Live 4K drone walkthrough scheduled for tomorrow at 2:00 PM WAT.',
      time: '2h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Privacy Vault Active',
      desc: 'Zero-Knowledge local security shield is active. Session is private.',
      time: '1d ago',
      unread: false,
    },
  ]);

  return (
    <header className="sticky top-0 z-40 bg-[#07130e]/95 backdrop-blur-md border-b border-[#13281e] px-4 pt-3.5 pb-3">
      <div className="flex items-center justify-between">
        {showBack ? (
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 rounded-full bg-[#0e2017] border border-[#1b3829] flex items-center justify-center text-[#c69a58] hover:bg-[#142e21] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <MirvaiLogo variant="badge" showTagline={false} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <MirvaiLogo variant="badge" showTagline={true} />
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Privacy badge / quick switch */}
          <button
            onClick={() => setPrivacyModalOpen(true)}
            title="Mirvai Privacy Vault & Zero Trackers"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0c1c14] border border-[#1c3a2a] text-[11px] text-[#9eb6a8] hover:text-[#c69a58] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#c69a58]" />
            <span className="hidden sm:inline font-medium">Privacy Vault</span>
          </button>

          {/* User profile / Auth trigger */}
          <button
            onClick={() => setAuthModalOpen(true)}
            title="User Authentication"
            className="w-9 h-9 rounded-full bg-[#0e2218] border border-[#c69a58]/30 flex items-center justify-center overflow-hidden hover:border-[#c69a58] transition-colors"
          >
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-xs font-semibold text-[#dfb877]">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'MC'}
              </span>
            )}
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-[#0e2017] border border-[#1a382a] flex items-center justify-center text-[#d5aa66] hover:bg-[#142e21] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c69a58] ring-2 ring-[#07130e]" />
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-[#0c1c14] border border-[#224432] p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#183626]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#c69a58]" />
                    <h4 className="font-medium text-sm text-[#e5ece8]">Notifications</h4>
                  </div>
                  <span className="text-[10px] text-[#c69a58] bg-[#142c1f] px-2 py-0.5 rounded-full border border-[#c69a58]/20">
                    2 New
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map(item => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        item.unread
                          ? 'bg-[#10251a] border-[#254d39]'
                          : 'bg-[#09150f] border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-semibold text-[#f0e6d5]">{item.title}</p>
                        <span className="text-[10px] text-[#789182]">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[#9eb6a8] mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#183626] flex items-center justify-between text-[11px]">
                  <span className="text-[#789182] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#c69a58]" /> Verified Mirvai Feed
                  </span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[#c69a58] hover:underline font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
