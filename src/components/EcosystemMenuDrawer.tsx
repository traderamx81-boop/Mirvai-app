import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ChevronDown, Globe, Sun, Moon, LogIn, UserPlus, LogOut } from 'lucide-react';
import { DivisionId } from '../types';

interface EcosystemMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDivision: (divisionId: DivisionId) => void;
  onGoHome: () => void;
  currentDivision?: DivisionId | null;
}

export const EcosystemMenuDrawer: React.FC<EcosystemMenuDrawerProps> = ({
  isOpen,
  onClose,
  onSelectDivision,
  onGoHome,
  currentDivision,
}) => {
  const [user, setUser] = useState<{ isLoggedIn: boolean; name: string } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (!isOpen) return;
    const syncUser = () => {
      try {
        const saved = localStorage.getItem('mirvai_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    const syncTheme = () => {
      try {
        const pref = localStorage.getItem('mirvai_theme_preference');
        if (pref === 'dark' || pref === 'light') {
          setCurrentTheme(pref);
          return;
        }
        if (typeof window !== 'undefined' && window.matchMedia) {
          setCurrentTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
      } catch {}
    };

    syncUser();
    syncTheme();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('mirvai:theme-toggle'));
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    onClose();
    window.dispatchEvent(new CustomEvent('mirvai:auth', { detail: { mode } }));
  };

  const handleSignOut = () => {
    try {
      const saved = localStorage.getItem('mirvai_user');
      if (saved) {
        const u = JSON.parse(saved);
        u.isLoggedIn = false;
        localStorage.setItem('mirvai_user', JSON.stringify(u));
        setUser(u);
        window.dispatchEvent(new CustomEvent('mirvai:auth-state-changed'));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const divisions: {
    num: string;
    id: DivisionId;
    title: string;
    sub: string;
    status: string;
    statusType: 'active' | 'future' | 'growth' | 'engine';
  }[] = [
    {
      num: '01',
      id: 'realty',
      title: 'Mirvai Realty',
      sub: 'Partner-developer properties',
      status: 'ACTIVE',
      statusType: 'active',
    },
    {
      num: '02',
      id: 'developments',
      title: 'Mirvai Developments',
      sub: 'Mirvai-owned properties',
      status: 'FUTURE',
      statusType: 'future',
    },
    {
      num: '03',
      id: 'construction',
      title: 'Mirvai Construction',
      sub: 'Building materials and supply',
      status: 'GROWTH',
      statusType: 'growth',
    },
    {
      num: '04',
      id: 'technology',
      title: 'Mirvai Technology',
      sub: 'Digital ecosystem infrastructure',
      status: 'ENGINE',
      statusType: 'engine',
    },
    {
      num: '05',
      id: 'energy',
      title: 'Mirvai Energy',
      sub: 'Power and energy solutions',
      status: 'FUTURE',
      statusType: 'future',
    },
    {
      num: '06',
      id: 'communities',
      title: 'Mirvai Communities',
      sub: 'Connected places for living',
      status: 'FUTURE',
      statusType: 'future',
    },
  ];

  const getStatusBadge = (status: string, type: 'active' | 'future' | 'growth' | 'engine') => {
    switch (type) {
      case 'active':
      case 'growth':
      case 'engine':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#132c1e] border border-emerald-500/30 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
            {status}
          </span>
        );
      case 'future':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#1c281e] border border-[#d5a55d]/30 text-[10px] font-bold tracking-wider text-[#d5a55d] uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#06130b] flex flex-col justify-between overflow-y-auto px-4 py-5 shadow-2xl">
        {/* Top Header matching Screenshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#14291e]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#d5a55d]/40 bg-[#08170f] flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
                  alt="Mirvai Crest"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-brand text-sm tracking-[0.22em] text-[#f0eee8] font-bold uppercase leading-none">
                  Mirvai
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#d5a55d] font-medium uppercase mt-1">
                  Find · Grow · Invest
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#82998c] hover:text-[#d5a55d] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Client Portal Authentication & Theme Toggle Card INSIDE Menu */}
          <div className="p-4 rounded-2xl bg-[#081f15] border border-[#d5a55d]/40 shadow-lg">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#d5a55d]">
                Private Client Portal
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {user?.isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#133324] border border-[#d5a55d]/50 flex items-center justify-center font-bold text-xs text-[#f0eee8]">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#f0eee8] leading-tight m-0">{user.name}</p>
                    <small className="text-[9px] text-[#8ea89c] block mt-0.5">Verified Diaspora Investor</small>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2 px-3 rounded-xl border border-[#214a36] text-[#b4c7be] hover:text-red-400 hover:border-red-400/40 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-[#cad8d0] leading-relaxed m-0">
                  Access verified deeds, schedule private 4K drone inspections, and track transactions.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenAuth('login')}
                    className="py-2 px-2.5 rounded-xl border border-[#d5a55d]/60 text-[#f0eee8] hover:bg-[#143324] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#d5a55d]" />
                    <span>Log In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAuth('signup')}
                    className="py-2 px-2.5 rounded-xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#06130b] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign In / Up</span>
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Theme Toggle */}
            <div className="mt-3 pt-2.5 border-t border-[#163826] flex items-center justify-between">
              <span className="text-[11px] text-[#9bb5a6] font-medium">Appearance:</span>
              <button
                type="button"
                onClick={handleToggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d5a55d]/40 bg-[#06160e] text-[#d5a55d] hover:border-[#d5a55d] text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                {currentTheme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span>White Theme</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Theme</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Home overview link card matching Screenshot */}
          <div>
            <button
              onClick={() => {
                onGoHome();
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-[#0e1f16] border border-[#183324] hover:border-[#d5a55d]/50 flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <span className="text-sm font-semibold text-[#f0eee8] group-hover:text-[#d5a55d] transition-colors">
                Home overview
              </span>
              <ArrowRight className="w-4 h-4 text-[#82998c] group-hover:text-[#d5a55d] group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Section Header: Mirvai Ecosystem ∨ matching Screenshot */}
          <div>
            <div className="w-full p-3.5 rounded-2xl bg-[#0e1f16] border border-[#183324] flex items-center justify-between text-left">
              <h2 className="font-editorial text-base sm:text-lg font-bold text-[#d5a55d] m-0">
                Mirvai Ecosystem
              </h2>
              <ChevronDown className="w-4 h-4 text-[#d5a55d]" />
            </div>
          </div>

          {/* 6 Divisions list matching Screenshot 4 */}
          <div className="space-y-2">
            {divisions.map(div => {
              const isCurrent = currentDivision === div.id;
              return (
                <button
                  key={div.id}
                  onClick={() => {
                    onSelectDivision(div.id);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                    isCurrent
                      ? 'bg-[#14291e] border-[#d5a55d]/60 shadow-md'
                      : 'bg-[#0e1f16] border-[#183324] hover:bg-[#12281d] hover:border-[#d5a55d]/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-[#08170f] border border-[#183324] text-[#d5a55d] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {div.num}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-[#f0eee8] group-hover:text-[#d5a55d] transition-colors truncate m-0">
                        {div.title}
                      </h3>
                      <p className="text-[11px] text-[#82998c] truncate m-0 mt-0.5">
                        {div.sub}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {getStatusBadge(div.status, div.statusType)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer note matching Screenshot 4 */}
        <div className="pt-4 pb-2 text-center border-t border-[#14291e] mt-4">
          <p className="text-[11px] text-[#63786b] leading-relaxed m-0">
            The menu separates services available today from Mirvai's future divisions.
          </p>
        </div>
      </div>
    </div>
  );
};
