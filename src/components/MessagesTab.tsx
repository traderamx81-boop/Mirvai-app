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
    <div className="fixed inset-0 z-40 bg-[#06130b] flex flex-col w-full h-[100dvh] overflow-hidden select-text">
      {/* 1. Full-Bleed Top Header matching Screenshot 2 */}
      <header className="w-full bg-[#06130b] px-4 pt-3 pb-2 shrink-0 border-b border-[#14291e]/60">
        <div className="w-full max-w-5xl mx-auto">
          {/* Top Row: Back button & Title matching Screenshot 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                aria-label="Back to home"
                className="w-10 h-10 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#d5a55d] hover:bg-[#14291e] active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
              </button>
              <div>
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f0eee8] leading-tight">
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
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1f16] border border-[#183324] text-xs font-semibold text-[#d5a55d] hover:bg-[#14291e]"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>4K Inspection</span>
                </button>
              )}
              <button
                onClick={() => setPrivacyModalOpen(true)}
                title="End-to-End Encrypted Privacy Vault"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0e1f16] border border-[#183324] text-xs text-[#d5a55d] hover:bg-[#14291e]"
              >
                <ShieldCheck className="w-4 h-4 text-[#d5a55d]" />
                <span className="hidden xs:inline text-[11px] font-medium">Encrypted</span>
              </button>
            </div>
          </div>

          {/* Mirvai property desk status card matching Screenshot 2 */}
          <div className="mt-3 p-3.5 rounded-2xl bg-[#0e1f16] border border-[#183324] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#d5a55d] text-[#101f16] font-bold text-lg flex items-center justify-center shadow-inner shrink-0">
                M
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#f0eee8]">
                  Mirvai property desk
                </h2>
                <p className="text-xs text-[#34d399] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                  Available for enquiries
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className="px-2.5 py-1 rounded-full bg-[#14291e] text-[#d5a55d] text-xs font-medium border border-[#d5a55d]/30 cursor-pointer"
            >
              {showInfoPanel ? 'Hide Desk Info' : 'Desk Info'}
            </button>
          </div>
        </div>
      </header>

      {/* Info Panel Dropdown */}
      {showInfoPanel && (
        <div className="bg-[#0e1f16] border-b border-[#183324] px-4 py-3 text-xs text-[#cad8cf] animate-in slide-in-from-top-2 duration-200 shrink-0">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div>
              <p className="font-bold text-[#f0eee8]">Mirvai Private Advisory &amp; Title Verification</p>
              <p className="text-[#82998b] mt-0.5">
                Direct in-app messaging. We confirm Governor’s Consent titles, coordinate 4K video inspections, and guide milestone escrow.
              </p>
            </div>
            {onOpenBrief && (
              <button
                onClick={() => {
                  setShowInfoPanel(false);
                  onOpenBrief();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#d5a55d] text-[#101f16] font-bold text-xs shrink-0 cursor-pointer"
              >
                Send Property Brief
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Full-Page Wide Chat Canvas matching Screenshot 2 */}
      <div className="flex-1 w-full overflow-y-auto px-4 sm:px-8 md:px-16 py-3 space-y-3.5 bg-gradient-to-b from-[#06130b] via-[#08170f] to-[#06130b]">
        <div className="max-w-4xl mx-auto space-y-3 w-full">
          {/* Security / Privacy Banner */}
          <div className="flex items-center justify-center my-1">
            <span className="px-3.5 py-1 rounded-full bg-[#0e1f16] border border-[#183324] text-[10px] sm:text-[11px] font-medium text-[#82998c] flex items-center gap-1.5 shadow-sm">
              <Lock className="w-3 h-3 text-[#d5a55d]" />
              <span>Messages stay exclusively in your private client vault</span>
            </span>
          </div>

          {/* Message Stream */}
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full group`}
              >
                {/* Subtle header label with sender and time context */}
                <div className={`flex items-center gap-1.5 px-2 mb-1 text-[10px] tracking-wide ${
                  isUser ? 'text-[#d5a55d]/90 font-medium' : 'text-[#82998c] font-medium'
                }`}>
                  <span>{isUser ? 'You' : 'Mirvai Property Desk'}</span>
                  <span className="opacity-40">·</span>
                  <span className="text-[#5f776a] font-normal">{msg.time}</span>
                </div>

                {/* Bubble matching Screenshot 2: Desk in #10241a, User in #d5a55d */}
                <div
                  className={`max-w-[92%] sm:max-w-[78%] md:max-w-[68%] p-3.5 sm:p-4 rounded-2xl text-sm sm:text-[15px] leading-relaxed shadow-md transition-all relative ${
                    isUser
                      ? 'bg-[#d5a55d] text-[#101f16] font-medium rounded-br-xs'
                      : 'bg-[#10241a] text-[#d8e4dd] border border-[#183324] rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Subtle timestamp label inside the bubble */}
                  <div className={`flex items-center justify-end gap-1.5 mt-1.5 pt-0.5 text-[10px] tracking-tight select-none ${
                    isUser ? 'text-[#25392d]' : 'text-[#63786b]'
                  }`}>
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#101f16]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#10241a] border border-[#183324] w-24 text-[#d5a55d]">
              <span className="w-2 h-2 rounded-full bg-[#d5a55d] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#d5a55d] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#d5a55d] animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. Bottom Area: Quick Prompts + Wide Composer + Disclaimer + Navigation Bar */}
      <footer className="w-full bg-[#07150d] border-t border-[#183324] shrink-0 pt-2 pb-1.5 z-30 shadow-2xl">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-0.5">
            <button
              onClick={() => handleQuickPrompt("I'm buying from abroad and need remote inspection support.")}
              className="px-3.5 py-1.5 rounded-full bg-[#0e1f16] border border-[#183324] text-xs text-[#82998c] hover:text-[#f0eee8] hover:border-[#d5a55d] whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-[#d5a55d]" />
              <span>Remote inspection support</span>
            </button>
            <button
              onClick={() => handleQuickPrompt("How do you verify Governor's Consent at the Lands Registry?")}
              className="px-3.5 py-1.5 rounded-full bg-[#0e1f16] border border-[#183324] text-xs text-[#82998c] hover:text-[#f0eee8] hover:border-[#d5a55d] whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#d5a55d]" />
              <span>Verify Lands Registry Title</span>
            </button>
            <button
              onClick={() => handleQuickPrompt("Explain the escrow milestone release terms.")}
              className="px-3.5 py-1.5 rounded-full bg-[#0e1f16] border border-[#183324] text-xs text-[#82998c] hover:text-[#f0eee8] hover:border-[#d5a55d] whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#d5a55d]" />
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
                className="w-11 h-11 rounded-full bg-[#0e1f16] border border-[#183324] flex items-center justify-center text-[#82998c] hover:text-[#d5a55d] hover:border-[#d5a55d] transition-colors cursor-pointer"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {showAttachMenu && (
                <div className="absolute bottom-14 left-0 w-56 rounded-2xl bg-[#0e1f16] border border-[#183324] p-2 shadow-2xl z-50 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      if (onOpenBrief) onOpenBrief();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#14291e] text-left text-xs font-semibold text-[#f0eee8] flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#d5a55d]" />
                    <span>Attach Property Brief</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      if (onOpenDiasporaModal) onOpenDiasporaModal();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#14291e] text-left text-xs font-semibold text-[#f0eee8] flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-[#d5a55d]" />
                    <span>Book Drone Walkthrough</span>
                  </button>
                </div>
              )}
            </div>

            {/* Input field matching Screenshot 2 */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Write a message..."
                className="w-full px-5 py-3.5 bg-[#08170f] border border-[#183324] rounded-full text-sm sm:text-base text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d] focus:ring-1 focus:ring-[#d5a55d] transition-all"
              />
            </div>

            {/* Upward arrow send button matching Screenshot 2: circle in #d5a55d with #101f16 arrow */}
            <button
              type="submit"
              aria-label="Send message"
              disabled={!inputText.trim()}
              className="w-12 h-12 rounded-full bg-[#d5a55d] hover:bg-[#deb26d] disabled:opacity-40 text-[#101f16] flex items-center justify-center transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
            >
              <ArrowUp className="w-6 h-6 stroke-[2.8]" />
            </button>
          </form>

          {/* Prototype disclaimer matching Screenshot 2 */}
          <p className="text-center text-[10px] text-[#63786b] pt-2 pb-1">
            Interactive prototype · messages stay only on this page
          </p>

          {/* Docked In-App Navigation Bar so user can effortlessly switch back */}
          {onNavigateTab && (
            <div className="pt-1 pb-1">
              <div className="bg-[#07150d] border border-[#162a1e] rounded-[24px] p-1 flex items-center justify-between">
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
                      className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1a261c] text-[#d5a55d] font-semibold'
                          : 'text-[#63786b] hover:text-[#9bb2a4]'
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
