import React, { useState } from 'react';
import { X, Fingerprint, Mail, ShieldCheck, Lock, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MirvaiLogo } from './MirvaiLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, loginAsUser, loginWithOneClick, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'passkey' | 'email'>('passkey');
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handlePasskeyAuth = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      loginWithOneClick();
      setIsAuthenticating(false);
    }, 700);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      loginAsUser(name || 'Mirvai Client', email || 'client@mirvai.com', phone, 'email');
      setIsAuthenticating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0b1b13] border border-[#1f4230] rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0e2117] border border-[#1d3d2c] flex items-center justify-center text-[#8fa397] hover:text-[#cca25d]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Crest */}
        <div className="text-center pt-2">
          <MirvaiLogo variant="badge" showTagline={true} />
          <h2 className="font-editorial text-2xl font-bold text-[#f2e7d3] mt-3">
            Seamless Client Access
          </h2>
          <p className="text-xs text-[#82998b] mt-1 max-w-xs mx-auto">
            Biometric passkey and privacy-hardened authentication. No passwords to remember.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#081710] border border-[#183626]">
          <button
            onClick={() => setAuthMode('passkey')}
            className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'passkey'
                ? 'bg-[#142e20] text-[#dfb877] shadow-sm'
                : 'text-[#7d9586] hover:text-[#cad8cf]'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-[#cca25d]" />
            <span>Passkey / Biometric</span>
          </button>
          <button
            onClick={() => setAuthMode('email')}
            className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'email'
                ? 'bg-[#142e20] text-[#dfb877] shadow-sm'
                : 'text-[#7d9586] hover:text-[#cad8cf]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#cca25d]" />
            <span>Instant Email Access</span>
          </button>
        </div>

        {authMode === 'passkey' ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-[#091710] border border-[#1b3a2a] text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#132c1f] border border-[#cca25d]/50 flex items-center justify-center mx-auto text-[#dfb877]">
                <Fingerprint className={`w-8 h-8 ${isAuthenticating ? 'animate-pulse text-[#cca25d]' : ''}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#f2e7d3]">
                  1-Click Diaspora Passkey
                </h4>
                <p className="text-[11px] text-[#8fa397] mt-0.5">
                  Sign in instantly using your device credentials or biometric vault.
                </p>
              </div>
            </div>

            <button
              onClick={handlePasskeyAuth}
              disabled={isAuthenticating}
              className="w-full py-3.5 rounded-2xl bg-[#cca25d] hover:bg-[#d8b06b] text-[#0a1711] font-bold text-xs tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{isAuthenticating ? 'Authenticating Secure Session...' : 'Sign In with Passkey'}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-[#8fa397] mb-1">
                Full Name or Alias
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Dr. Adeola Williams"
                className="w-full px-3.5 py-2.5 bg-[#081710] border border-[#1b3a2a] rounded-xl text-xs text-[#e5ece8] placeholder-[#5d7366] focus:outline-none focus:border-[#cca25d]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#8fa397] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="client@diaspora.com"
                className="w-full px-3.5 py-2.5 bg-[#081710] border border-[#1b3a2a] rounded-xl text-xs text-[#e5ece8] placeholder-[#5d7366] focus:outline-none focus:border-[#cca25d]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#8fa397] mb-1">
                WhatsApp / Phone (for inspection updates)
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+44 7911 123456"
                className="w-full px-3.5 py-2.5 bg-[#081710] border border-[#1b3a2a] rounded-xl text-xs text-[#e5ece8] placeholder-[#5d7366] focus:outline-none focus:border-[#cca25d]"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 rounded-2xl bg-[#cca25d] hover:bg-[#d8b06b] text-[#0a1711] font-bold text-xs tracking-wide transition-colors shadow-md mt-2"
            >
              {isAuthenticating ? 'Signing In...' : 'Access My Journey'}
            </button>
          </form>
        )}

        {/* Security and privacy note */}
        <div className="pt-2 border-t border-[#183626] flex items-center justify-between text-[11px] text-[#738b7d]">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#cca25d]" />
            End-to-End Local Encryption
          </span>
          {user.isLoggedIn && (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-red-400/80 hover:text-red-300 font-medium"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
