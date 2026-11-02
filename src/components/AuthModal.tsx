import React, { useState, useEffect } from 'react';
import { X, Fingerprint, Mail, Lock, UserPlus, LogIn, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MirvaiLogo } from './MirvaiLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    user,
    loginAsUser,
    loginWithOneClick,
    logout,
    authModalMode,
    setAuthModalMode,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(authModalMode || 'login');
  const [loginMethod, setLoginMethod] = useState<'passkey' | 'email'>('passkey');

  // Login form fields
  const [loginEmail, setLoginEmail] = useState(user.email || 'a.williams@diaspora-uk.co');

  // Sign up form fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [investmentTrack, setInvestmentTrack] = useState('Diaspora Property Acquisition');

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
    }
  }, [authModalMode, isOpen]);

  if (!isOpen) return null;

  const handleCompleteAuth = (callback: () => void, successText: string) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      callback();
      setIsAuthenticating(false);
      setAuthSuccessMsg(successText);
      setTimeout(() => {
        setAuthSuccessMsg(null);
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 600);
    }, 550);
  };

  const handlePasskeyLogin = () => {
    handleCompleteAuth(
      () => loginWithOneClick(),
      'Biometric session authenticated. Entering Client Portal...'
    );
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleCompleteAuth(
      () => loginAsUser(user.name || 'Dr. Adeola Williams', loginEmail, user.phone || '+44 7911 123456', 'email'),
      'Secure email session confirmed. Entering Client Portal...'
    );
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = signupName.trim() || 'Diaspora Investor';
    const finalEmail = signupEmail.trim() || 'investor@mirvai-client.co';
    const finalPhone = signupPhone.trim() || '+44 7700 900123';
    handleCompleteAuth(
      () => loginAsUser(finalName, finalEmail, finalPhone, 'passkey'),
      'Account created & verified. Welcome to your Client Portal!'
    );
  };

  const handleOneClickSignup = () => {
    handleCompleteAuth(
      () => loginAsUser('Dr. Adeola Williams', 'a.williams@diaspora-uk.co', '+44 7911 123456', 'passkey'),
      'Account created with Passkey. Entering Client Portal...'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0e1f16] border border-[#183324] rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#08170f] border border-[#183324] flex items-center justify-center text-[#82998c] hover:text-[#d5a55d] cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Crest */}
        <div className="text-center pt-1">
          <MirvaiLogo variant="badge" showTagline={true} />
          <h2 className="font-editorial text-2xl font-bold text-[#f0eee8] mt-2.5">
            {activeTab === 'login' ? 'Client Portal Login' : 'Create Investor Account'}
          </h2>
          <p className="text-xs text-[#82998c] mt-1 max-w-xs mx-auto">
            {activeTab === 'login'
              ? 'Access your diaspora inspection streams, verified titles, and property briefs.'
              : 'Register to unlock your private portfolio, legal title verification, and remote inspections.'}
          </p>
        </div>

        {/* Success Alert Banner */}
        {authSuccessMsg && (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{authSuccessMsg}</span>
          </div>
        )}

        {/* Main Tab Switcher: Log In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#08170f] border border-[#183324]">
          <button
            onClick={() => {
              setActiveTab('login');
              setAuthModalMode('login');
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#14291e] text-[#d5a55d] shadow-sm'
                : 'text-[#82998c] hover:text-[#f0eee8]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-[#d5a55d]" />
            <span>Log In</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setAuthModalMode('signup');
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-[#14291e] text-[#d5a55d] shadow-sm'
                : 'text-[#82998c] hover:text-[#f0eee8]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-[#d5a55d]" />
            <span>Sign Up / Register</span>
          </button>
        </div>

        {/* TAB 1: LOG IN */}
        {activeTab === 'login' && (
          <div className="space-y-3.5">
            {/* Sub-method toggle: Passkey vs Email */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLoginMethod('passkey')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  loginMethod === 'passkey'
                    ? 'border-[#d5a55d]/70 text-[#d5a55d] bg-[#14291e]/60'
                    : 'border-[#183324] text-[#82998c] hover:text-[#e2ede6]'
                }`}
              >
                <Fingerprint className="w-3 h-3" />
                <span>1-Click Passkey</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  loginMethod === 'email'
                    ? 'border-[#d5a55d]/70 text-[#d5a55d] bg-[#14291e]/60'
                    : 'border-[#183324] text-[#82998c] hover:text-[#e2ede6]'
                }`}
              >
                <Mail className="w-3 h-3" />
                <span>Email Sign In</span>
              </button>
            </div>

            {loginMethod === 'passkey' ? (
              <div className="space-y-3 py-1">
                <div className="p-4 rounded-2xl bg-[#08170f] border border-[#183324] text-center space-y-2.5">
                  <div className="w-12 h-12 rounded-full bg-[#14291e] border border-[#d5a55d]/40 flex items-center justify-center mx-auto text-[#d5a55d]">
                    <Fingerprint className={`w-7 h-7 ${isAuthenticating ? 'animate-pulse text-[#d5a55d]' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#f0eee8]">
                      Biometric / Passkey Login
                    </h4>
                    <p className="text-[11px] text-[#82998c] mt-0.5">
                      Fast, passwordless sign-in for verified diaspora clients.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePasskeyLogin}
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-2xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#101f16] font-bold text-xs tracking-wide transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>{isAuthenticating ? 'Authenticating...' : 'Sign In with Passkey → Enter Portal'}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-2.5 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-[#82998c] mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="client@diaspora.com"
                    className="w-full px-3.5 py-2.5 bg-[#08170f] border border-[#183324] rounded-xl text-xs text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-2xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#101f16] font-bold text-xs tracking-wide transition-colors shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isAuthenticating ? 'Signing In...' : 'Log In &amp; Enter Client Portal'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePasskeyLogin}
                  className="w-full py-2 text-center text-[11px] text-[#d5a55d] hover:underline cursor-pointer"
                >
                  Instant Demo Login (Dr. Adeola Williams)
                </button>
              </form>
            )}

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setAuthModalMode('signup');
                }}
                className="text-[11px] text-[#82998c] hover:text-[#d5a55d] transition-colors cursor-pointer"
              >
                Don't have an investor account? <strong className="text-[#d5a55d] underline">Sign Up here</strong>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-2.5 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-[#82998c] mb-1">
                Full Name / Alias
              </label>
              <input
                type="text"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                placeholder="e.g. Dr. Adeola Williams"
                className="w-full px-3.5 py-2 bg-[#08170f] border border-[#183324] rounded-xl text-xs text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#82998c] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="a.williams@diaspora.co"
                  className="w-full px-3 py-2 bg-[#08170f] border border-[#183324] rounded-xl text-xs text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#82998c] mb-1">
                  WhatsApp / Phone
                </label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  placeholder="+44 7911 123456"
                  className="w-full px-3 py-2 bg-[#08170f] border border-[#183324] rounded-xl text-xs text-[#e3eee7] placeholder-[#5f776a] focus:outline-none focus:border-[#d5a55d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#82998c] mb-1">
                Primary Investment Focus
              </label>
              <select
                value={investmentTrack}
                onChange={e => setInvestmentTrack(e.target.value)}
                className="w-full px-3 py-2 bg-[#08170f] border border-[#183324] rounded-xl text-xs text-[#e3eee7] focus:outline-none focus:border-[#d5a55d]"
              >
                <option value="Diaspora Property Acquisition">Diaspora Luxury Property Acquisition</option>
                <option value="Land Development & Titles">Verified Land &amp; Governor's Consent</option>
                <option value="Off-Plan Duplex Developments">Off-Plan Residential Developments</option>
                <option value="Construction Materials & Supply">Mirvai Construction &amp; Supply</option>
              </select>
            </div>

            <div className="p-2.5 rounded-xl bg-[#08170f] border border-[#183324] flex items-center gap-2 text-[11px] text-[#82998c]">
              <Shield className="w-4 h-4 text-[#d5a55d] shrink-0" />
              <span>Zero-knowledge client vault. Your identity remains private and encrypted.</span>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-2xl bg-[#d5a55d] hover:bg-[#deb26d] text-[#101f16] font-bold text-xs tracking-wide transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isAuthenticating ? 'Creating Account...' : 'Sign Up & Enter Client Portal'}</span>
            </button>

            <button
              type="button"
              onClick={handleOneClickSignup}
              className="w-full py-2 text-center text-[11px] text-[#d5a55d] hover:underline cursor-pointer"
            >
              Or Quick 1-Click Register as Verified Investor
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setAuthModalMode('login');
                }}
                className="text-[11px] text-[#82998c] hover:text-[#d5a55d] transition-colors cursor-pointer"
              >
                Already have an account? <strong className="text-[#d5a55d] underline">Log In here</strong>
              </button>
            </div>
          </form>
        )}

        {/* Security and privacy note */}
        <div className="pt-2 border-t border-[#183324] flex items-center justify-between text-[11px] text-[#63786b]">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#d5a55d]" />
            End-to-End Client Encryption
          </span>
          {user.isLoggedIn && (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-red-400 hover:text-red-300 font-medium cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
