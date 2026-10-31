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
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-3 pt-1 pointer-events-none"
    >
      <div className="pointer-events-auto bg-[#0a1711]/95 backdrop-blur-xl border border-[#1a382a]/80 rounded-[28px] shadow-[0_12px_36px_rgba(0,0,0,0.65)] p-1.5 flex items-center justify-between">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'bg-[#182c20] text-[#dfb877] shadow-inner font-medium'
                  : 'text-[#6f8577] hover:text-[#a0b8aa] hover:bg-[#0e2017]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#c69a58]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  isActive ? 'text-[#dfb877] font-semibold' : 'text-[#6f8577]'
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
