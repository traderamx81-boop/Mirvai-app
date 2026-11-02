import React from 'react';
import { Home, Building2, FileText, MessageSquare, User } from 'lucide-react';

export type TabType = 'home' | 'properties' | 'enquiry' | 'messages' | 'account';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'properties' as TabType, label: 'Properties', icon: Building2 },
    { id: 'enquiry' as TabType, label: 'Enquiry', icon: FileText },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { id: 'account' as TabType, label: 'Account', icon: User },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-1 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-lg bg-[#07160e]/95 backdrop-blur-2xl border border-[#1e3c2b] rounded-full shadow-[0_16px_45px_rgba(0,0,0,0.85)] p-1.5 flex items-center justify-between">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 relative cursor-pointer group ${
                isActive
                  ? 'bg-[#122e20] text-[#d5a55d] font-semibold border border-[#d5a55d]/35 shadow-inner'
                  : 'text-[#72877a] hover:text-[#c4d6cb] hover:bg-[#0c1c13]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8] group-hover:scale-105'
                  }`}
                />
                {tab.badge && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#d5a55d] ring-2 ring-[#07160e] animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  isActive ? 'text-[#d5a55d] font-bold' : 'text-[#72877a]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
