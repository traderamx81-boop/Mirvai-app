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
  FileText,
  Sparkles
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
    <div className="w-full flex flex-col h-[calc(100dvh-75px)] max-w-4xl mx-auto overflow-hidden">
      {/* 1. Mirvai Property Desk Header */}
      <header className="w-full bg-[#07160e]/95 backdrop-blur-md px-3 sm:px-4 py-2.5 shrink-0 border-b border-[#163323] rounded-2xl mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Back to home"
              className="w-9 h-9 rounded-full bg-[#0e2117] border border-[#1b3a28] flex items-center justify-center text-[#d5a55d] hover:bg-[#153324] active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#d5a55d] text-[#07160e] font-bold text-base flex items-center justify-center shadow-inner shrink-0">
                  M
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07160e] animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-[#f0eee8] leading-tight flex items-center gap-1.5">
                  <span>Mirvai Property Desk</span>
                  <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-md bg-[#132d20] text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </h1>
                <p className="text-[11px] text-[#8fa79b]">
                  Legal title verification &amp; diaspora acquisitions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDiasporaModal && (
              <button
                onClick={onOpenDiasporaModal}
                title="Schedule 4K Drone Walkthrough"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e2117] border border-[#1b3a28] text-xs font-semibold text-[#d5a55d] hover:bg-[#153324] cursor-pointer transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>4K Walkthrough</span>
              </button>
            )}
            <button
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className="px-2.5 py-1.5 rounded-full bg-[#0e2117] border border-[#1b3a28] text-xs font-semibold text-[#8fa79b] hover:text-[#d5a55d] cursor-pointer transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPrivacyModalOpen(true)}
              title="End-to-End Encrypted Privacy Vault"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0e2117] border border-[#1b3a28] text-xs text-[#d5a55d] hover:bg-[#153324] cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#d5a55d]" />
              <span className="hidden xs:inline text-[11px] font-medium">Vault</span>
            </button>
          </div>
        </div>

        {/* Expandable Info Dropdown */}
        {showInfoPanel && (
          <div className="mt-2.5 pt-2.5 border-t border-[#163323] text-xs text-[#cad8cf] animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="font-bold text-[#f0eee8]">Direct Client Concierge</p>
                <p className="text-[#8fa79b] text-[11px] mt-0.5">
                  We verify titles at Lagos Lands Registry (Alausa), organize physical inspections, and coordinate escrow disbursements.
                </p>
              </div>
              {onOpenBrief && (
                <button
                  onClick={() => {
                    setShowInfoPanel(false);
                    onOpenBrief();
                  }}
                  className="px-3 py-1 rounded-xl bg-[#d5a55d] text-[#07160e] font-bold text-xs shrink-0 cursor-pointer hover:bg-[#deb26d] transition-colors"
                >
                  Send Property Brief
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. Message History Stream */}
      <div className="flex-1 w-full overflow-y-auto px-2 sm:px-4 py-2 space-y-3 bg-[#06130b] rounded-2xl border border-[#14291e]/50">
        {/* Security badge */}
        <div className="flex items-center justify-center my-1">
          <span className="px-3 py-1 rounded-full bg-[#0a1b12] border border-[#173825] text-[10px] font-medium text-[#8fa79b] flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3 h-3 text-[#d5a55d]" />
            <span>Private zero-knowledge channel · Session saved locally</span>
          </span>
        </div>

        {/* Message Items */}
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full group`}
            >
              <div className={`flex items-center gap-1.5 px-2 mb-1 text-[10px] ${
                isUser ? 'text-[#d5a55d] font-semibold' : 'text-[#8fa79b] font-medium'
              }`}>
                <span>{isUser ? 'You' : 'Mirvai Property Desk'}</span>
                <span className="opacity-40">·</span>
                <span className="text-[#657d70] font-normal">{msg.time}</span>
              </div>

              <div
                className={`max-w-[90%] sm:max-w-[80%] md:max-w-[70%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md transition-all ${
                  isUser
                    ? 'bg-[#d5a55d] text-[#07160e] font-medium rounded-br-xs'
                    : 'bg-[#0e2418] text-[#e3ece7] border border-[#1a3d29] rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                <div className={`flex items-center justify-end gap-1.5 mt-1.5 pt-0.5 text-[10px] select-none ${
                  isUser ? 'text-[#203629]' : 'text-[#71887c]'
                }`}>
                  <span>{msg.time}</span>
                  {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#07160e]" />}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#0e2418] border border-[#1a3d29] w-20 text-[#d5a55d]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d5a55d] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#d5a55d] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#d5a55d] animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Composer & Quick Prompts Area */}
      <div className="w-full bg-[#07160e] border border-[#173825] rounded-2xl mt-2 p-2.5 shadow-xl shrink-0">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2">
          <button
            onClick={() => handleQuickPrompt("I'm living abroad and need remote inspection support.")}
            className="px-3 py-1 rounded-full bg-[#0c1f15] border border-[#1a3d28] text-[11px] text-[#8fa79b] hover:text-[#f0eee8] hover:border-[#d5a55d] whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Video className="w-3 h-3 text-[#d5a55d]" />
            <span>Remote inspection</span>
          </button>
          <button
            onClick={() => handleQuickPrompt("How do you verify Governor's Consent at Lands Registry?")}
            className="px-3 py-1 rounded-full bg-[#0c1f15] border border-[#1a3d28] text-[11px] text-[#8fa79b] hover:text-[#f0eee8] hover:border-[#d5a55d] whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-3 h-3 text-[#d5a55d]" />
            <span>Verify Governor's Consent</span>
          </button>
          <button
            onClick={() => handleQuickPrompt("Tell me about Adeniyi Jones 4-bedroom terrace duplex in Ikeja.")}
            className="px-3 py-1 rounded-full bg-[#0c1f15] border border-[#1a3d28] text-[11px] text-[#8fa79b] hover:text-[#f0eee8] hover:border-[#d5a55d] whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3 h-3 text-[#d5a55d]" />
            <span>Ikeja Terrace Duplex</span>
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Attachment Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              aria-label="Attach file or brief"
              className="w-10 h-10 rounded-full bg-[#0c1f15] border border-[#1a3d28] flex items-center justify-center text-[#8fa79b] hover:text-[#d5a55d] hover:border-[#d5a55d] transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-12 left-0 w-52 rounded-2xl bg-[#0c1f15] border border-[#1a3d28] p-2 shadow-2xl z-50 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(false);
                    if (onOpenBrief) onOpenBrief();
                  }}
                  className="w-full p-2 rounded-xl hover:bg-[#142e20] text-left text-xs font-semibold text-[#f0eee8] flex items-center gap-2 cursor-pointer"
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
                  className="w-full p-2 rounded-xl hover:bg-[#142e20] text-left text-xs font-semibold text-[#f0eee8] flex items-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-[#d5a55d]" />
                  <span>Book 4K Walkthrough</span>
                </button>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask about properties, legal title, or inspections..."
              className="w-full px-4 py-2.5 bg-[#051109] border border-[#1a3d28] rounded-full text-xs sm:text-sm text-[#e3ece7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d] focus:ring-1 focus:ring-[#d5a55d] transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            aria-label="Send message"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-[#d5a55d] hover:bg-[#deb26d] disabled:opacity-35 text-[#07160e] flex items-center justify-center transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.8]" />
          </button>
        </form>
      </div>
    </div>
  );
};
