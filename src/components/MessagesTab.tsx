import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ArrowUp, 
  ShieldCheck, 
  Video, 
  Paperclip, 
  CheckCheck, 
  Lock, 
  Info,
  Building,
  Home as HomeIcon,
  Building2,
  FileText,
  MessageSquare,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TabType } from './BottomNav';

interface MessagesTabProps {
  onBack: () => void;
  onNavigateTab?: (tab: TabType) => void;
  onOpenDiasporaModal?: () => void;
  onOpenBrief?: () => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  onBack,
  onNavigateTab,
  onOpenDiasporaModal,
  onOpenBrief,
}) => {
  const { messages, sendMessage, setPrivacyModalOpen } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1100);
  };

  const handleQuickPrompt = (promptText: string) => {
    sendMessage(promptText);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#07130e] flex flex-col w-full h-[100dvh] overflow-hidden select-text">
      {/* 1. Full-Bleed Top Header matching Screenshot 2 */}
      <header className="w-full bg-[#07130e] px-4 pt-3 pb-2 shrink-0 border-b border-[#142c1f]/60">
        <div className="w-full max-w-5xl mx-auto">
          {/* Top Row: Back button & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                aria-label="Back to home"
                className="w-10 h-10 rounded-full bg-[#0d2117] border border-[#1d3d2c] flex items-center justify-center text-[#dfb877] hover:bg-[#153424] active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
              </button>
              <div>
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f2e7d3] leading-tight">
                  Mirvai chat
                </h1>
                <p className="text-xs text-[#82998b]">
                  A future in-app alternative to WhatsApp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenDiasporaModal && (
                <button
                  onClick={onOpenDiasporaModal}
                  title="Schedule 4K Drone Walkthrough"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d2117] border border-[#1f4230] text-xs font-semibold text-[#cca25d] hover:bg-[#153424]"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>4K Inspection</span>
                </button>
              )}
              <button
                onClick={() => setPrivacyModalOpen(true)}
                title="End-to-End Encrypted Privacy Vault"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0d2117] border border-[#1f4230] text-xs text-[#cca25d] hover:bg-[#153424]"
              >
                <ShieldCheck className="w-4 h-4 text-[#cca25d]" />
                <span className="hidden xs:inline text-[11px] font-medium">Encrypted</span>
              </button>
            </div>
          </div>

          {/* Mirvai property desk status card matching Screenshot 2 */}
          <div className="mt-3 p-3.5 rounded-2xl bg-[#0d2117] border border-[#1b3a2a] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#cca25d] text-[#0a1711] font-bold text-lg flex items-center justify-center shadow-inner shrink-0">
                M
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#f2e7d3]">
                  Mirvai property desk
                </h2>
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available for enquiries
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className="px-2.5 py-1 rounded-full bg-[#13281e] text-[#cca25d] text-xs font-medium border border-[#cca25d]/30"
            >
              {showInfoPanel ? 'Hide Desk Info' : 'Desk Info'}
            </button>
          </div>
        </div>
      </header>

      {/* Info Panel Dropdown */}
      {showInfoPanel && (
        <div className="bg-[#0b1b13] border-b border-[#1b3a2a] px-4 py-3 text-xs text-[#cad8cf] animate-in slide-in-from-top-2 duration-200 shrink-0">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div>
              <p className="font-bold text-[#f2e7d3]">Mirvai Private Advisory &amp; Title Verification</p>
              <p className="text-[#8fa397] mt-0.5">
                Direct in-app messaging. We confirm Governor’s Consent titles, coordinate 4K video inspections, and guide milestone escrow.
              </p>
            </div>
            {onOpenBrief && (
              <button
                onClick={() => {
                  setShowInfoPanel(false);
                  onOpenBrief();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#cca25d] text-[#0a1711] font-bold text-xs shrink-0"
              >
                Send Property Brief
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Full-Page Wide Chat Canvas (Wide message stream) */}
      <div className="flex-1 w-full overflow-y-auto px-4 sm:px-8 md:px-16 py-3 space-y-3.5 bg-gradient-to-b from-[#07130e] via-[#081710] to-[#07130e]">
        <div className="max-w-4xl mx-auto space-y-3 w-full">
          {/* Security / Privacy Banner */}
          <div className="flex items-center justify-center my-1">
            <span className="px-3.5 py-1 rounded-full bg-[#0d2117] border border-[#1c3a2a] text-[10px] sm:text-[11px] font-medium text-[#8fa397] flex items-center gap-1.5 shadow-sm">
              <Lock className="w-3 h-3 text-[#cca25d]" />
              <span>Messages stay exclusively in your private client vault</span>
            </span>
          </div>

          {/* Message Stream */}
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[78%] md:max-w-[68%] p-4 rounded-2xl text-sm sm:text-[15px] leading-relaxed shadow-md transition-all ${
                    isUser
                      ? 'bg-[#cca25d] text-[#0a1711] font-medium rounded-br-xs'
                      : 'bg-[#0f241a] text-[#e3ece7] border border-[#1d3d2c] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6d8275] px-1.5 mt-1">
                  <span>{msg.time}</span>
                  {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#cca25d]" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#0f241a] border border-[#1d3d2c] w-24 text-[#cca25d]">
              <span className="w-2 h-2 rounded-full bg-[#cca25d] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#cca25d] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#cca25d] animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. Bottom Area: Quick Prompts + Wide Composer + Disclaimer + Navigation Bar */}
      <footer className="w-full bg-[#0a1711] border-t border-[#183626] shrink-0 pt-2 pb-1.5 z-30 shadow-2xl">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-0.5">
            <button
              onClick={() => handleQuickPrompt("I'm buying from abroad and need remote inspection support.")}
              className="px-3.5 py-1.5 rounded-full bg-[#0e2117] border border-[#1b3a2a] text-xs text-[#a0b8aa] hover:text-[#f2e7d3] hover:border-[#cca25d] whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-[#cca25d]" />
              <span>Remote inspection support</span>
            </button>
            <button
              onClick={() => handleQuickPrompt("How do you verify Governor's Consent at the Lands Registry?")}
              className="px-3.5 py-1.5 rounded-full bg-[#0e2117] border border-[#1b3a2a] text-xs text-[#a0b8aa] hover:text-[#f2e7d3] hover:border-[#cca25d] whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#cca25d]" />
              <span>Verify Lands Registry Title</span>
            </button>
            <button
              onClick={() => handleQuickPrompt("Explain the escrow milestone release terms.")}
              className="px-3.5 py-1.5 rounded-full bg-[#0e2117] border border-[#1b3a2a] text-xs text-[#a0b8aa] hover:text-[#f2e7d3] hover:border-[#cca25d] whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#cca25d]" />
              <span>Escrow milestone release</span>
            </button>
          </div>

          {/* Wide Message Input matching Screenshot 2 */}
          <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-3">
            {/* Attachment Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                aria-label="Attach file or brief"
                className="w-11 h-11 rounded-full bg-[#0e2117] border border-[#1b3a2a] flex items-center justify-center text-[#8fa397] hover:text-[#cca25d] hover:border-[#cca25d] transition-colors cursor-pointer"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {showAttachMenu && (
                <div className="absolute bottom-14 left-0 w-56 rounded-2xl bg-[#0d2117] border border-[#214733] p-2 shadow-2xl z-50 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      if (onOpenBrief) onOpenBrief();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#142e20] text-left text-xs font-semibold text-[#f2e7d3] flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-[#cca25d]" />
                    <span>Attach Property Brief</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      if (onOpenDiasporaModal) onOpenDiasporaModal();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#142e20] text-left text-xs font-semibold text-[#f2e7d3] flex items-center gap-2"
                  >
                    <Video className="w-4 h-4 text-[#cca25d]" />
                    <span>Book Drone Walkthrough</span>
                  </button>
                </div>
              )}
            </div>

            {/* Input field */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Write a message..."
                className="w-full px-5 py-3.5 bg-[#07130e] border border-[#1c3a2a] rounded-full text-sm sm:text-base text-[#e3ece7] placeholder-[#647c6e] focus:outline-none focus:border-[#cca25d] focus:ring-1 focus:ring-[#cca25d] transition-all"
              />
            </div>

            {/* Upward arrow send button matching Screenshot 2 */}
            <button
              type="submit"
              aria-label="Send message"
              disabled={!inputText.trim()}
              className="w-12 h-12 rounded-full bg-[#cca25d] hover:bg-[#d8b06b] disabled:opacity-40 text-[#0a1711] flex items-center justify-center transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
            >
              <ArrowUp className="w-6 h-6 stroke-[2.8]" />
            </button>
          </form>

          {/* Prototype disclaimer matching Screenshot 2 */}
          <p className="text-center text-[10px] text-[#6d8275] pt-2 pb-1">
            Interactive prototype · messages stay only on this page
          </p>

          {/* Docked In-App Navigation Bar so user can effortlessly switch back */}
          {onNavigateTab && (
            <div className="pt-1 pb-1">
              <div className="bg-[#0e2017]/90 border border-[#1a382a]/70 rounded-[24px] p-1 flex items-center justify-between">
                {[
                  { id: 'home' as TabType, label: 'Home', icon: HomeIcon },
                  { id: 'properties' as TabType, label: 'Properties', icon: Building2 },
                  { id: 'enquiry' as TabType, label: 'Enquiry', icon: FileText },
                  { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
                  { id: 'account' as TabType, label: 'Account', icon: User },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = tab.id === 'messages';
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onNavigateTab(tab.id)}
                      className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#182c20] text-[#dfb877] font-semibold'
                          : 'text-[#6f8577] hover:text-[#a0b8aa]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[9px] mt-0.5">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
