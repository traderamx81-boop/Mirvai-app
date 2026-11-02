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
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-1 pointer-events-none"
    >
      <div className="pointer-events-auto bg-[#07150d]/95 backdrop-blur-xl border border-[#162a1e] rounded-[30px] shadow-[0_12px_36px_rgba(0,0,0,0.7)] p-1.5 flex items-center justify-between">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'bg-[#1a261c] text-[#d5a55d] font-semibold'
                  : 'text-[#63786b] hover:text-[#9bb2a4] hover:bg-[#0c1a11]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#d5a55d]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  isActive ? 'text-[#d5a55d] font-semibold' : 'text-[#63786b]'
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
