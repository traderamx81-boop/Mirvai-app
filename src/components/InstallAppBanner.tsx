import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle } from 'lucide-react';
import { MirvaiLogo } from './MirvaiLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (isInstalled || dismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for iOS Safari or browsers without beforeinstallprompt
      setShowInstructions(true);
    }
  };

  return (
    <>
      <div className="w-full bg-[#0e1f16] border-b border-[#183324] px-4 py-2 flex items-center justify-between text-xs z-50">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#d5a55d]/40 shrink-0">
            <img
              src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
              alt="Mirvai App"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="truncate">
            <span className="font-bold text-[#f0eee8]">Mirvai Mobile App</span>
            <span className="text-[#82998c] ml-2 hidden sm:inline">Install for offline vaults and instant alerts</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 rounded-full bg-[#d5a55d] text-[#101f16] font-bold text-xs hover:bg-[#deb26d] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#63786b] hover:text-[#e3eee7] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0b1b13] border border-[#1f4230] rounded-3xl p-5 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#142e20] text-[#cca25d] flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#f2e7d3]">
                Install Mirvai on Your Device
              </h3>
              <p className="text-xs text-[#82998b] mt-1 leading-relaxed">
                To install this app on iOS Safari: tap the <strong>Share</strong> button, then select <strong>'Add to Home Screen'</strong>.
              </p>
              <p className="text-xs text-[#82998b] mt-1 leading-relaxed">
                On Android Chrome: tap the <strong>Three Dots (⋮)</strong> menu, then choose <strong>'Install App'</strong>.
              </p>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-[#cca25d] text-[#0a1711] font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
