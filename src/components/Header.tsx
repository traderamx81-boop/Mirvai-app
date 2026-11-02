import React, { useState } from 'react';
import { MirvaiLogo } from './MirvaiLogo';
import { Bell, ShieldCheck, ChevronLeft, Menu, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentTab: string;
  onBack?: () => void;
  showBack?: boolean;
  onOpenMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onBack,
  showBack = false,
  onOpenMenu,
}) => {
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
    <header className="sticky top-0 z-40 bg-[#06130b]/95 backdrop-blur-md border-b border-[#14291e] px-4 pt-3.5 pb-3">
      <div className="flex items-center justify-between">
        {showBack ? (
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <MirvaiLogo variant="badge" showTagline={false} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {onOpenMenu && (
              <button
                onClick={onOpenMenu}
                aria-label="Open Mirvai Ecosystem Menu"
                className="w-10 h-10 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <MirvaiLogo variant="badge" showTagline={true} />
          </div>
        )}

        <div className="flex items-center gap-2">

          {/* Privacy badge / quick switch */}
          <button
            onClick={() => setPrivacyModalOpen(true)}
            title="Mirvai Privacy Vault & Zero Trackers"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0e1f16] border border-[#183324] text-[11px] text-[#829b8c] hover:text-[#d5a55d] transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#d5a55d]" />
            <span className="hidden sm:inline font-medium">Privacy Vault</span>
          </button>

          {/* User profile / Auth trigger */}
          <button
            onClick={() => setAuthModalOpen(true)}
            title="User Authentication"
            className="w-9 h-9 rounded-full bg-[#0e1f16] border border-[#d5a55d]/40 flex items-center justify-center overflow-hidden hover:border-[#d5a55d] transition-colors cursor-pointer"
          >
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-xs font-semibold text-[#d5a55d]">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'MC'}
              </span>
            )}
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d5a55d] ring-2 ring-[#06130b]" />
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-[#0e1f16] border border-[#1d3d2c] p-4 shadow-2xl z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#183324]">
                  <h4 className="font-editorial text-sm font-bold text-[#f0eee8]">Notifications</h4>
                  <span className="text-[10px] text-[#829b8c]">Private Encrypted</span>
                </div>
                <div className="divide-y divide-[#183324]/50 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="py-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#e2ede6]">{n.title}</p>
                        <span className="text-[10px] text-[#63786b] whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#829b8c] mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
