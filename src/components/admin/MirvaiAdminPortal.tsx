import React, { useState, useEffect, useRef } from 'react';
import MirvaiBrand from '../../../website-source/components/mirvai-brand';
import { 
  Building2, 
  MessageSquare, 
  Globe, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Send, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle,
  X,
  Search,
  Filter,
  Database
} from 'lucide-react';

import {
  fetchAllProperties,
  fetchWebsiteSettings,
  fetchAdminChatData,
  upsertProperty,
  removeProperty,
  saveWebsiteSettings,
  postAdminReply,
  isSupabaseConfigured,
  supabase,
  type StoredProperty,
  type WebsiteSettings,
  type ChatConversation,
  type ChatMessage,
} from '../../lib/supabase';

export const MirvaiAdminPortal: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'website' | 'chat'>('properties');
  const [properties, setProperties] = useState<StoredProperty[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Admin Access Gate Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const key = urlParams.get('key') || urlParams.get('passcode') || urlParams.get('auth');
      if (key === 'mirvai2026' || key === 'mirvai' || key === 'admin2026') {
        sessionStorage.setItem('mirvai_admin_authorized', 'true');
        return true;
      }
      return sessionStorage.getItem('mirvai_admin_authorized') === 'true';
    } catch {
      return false;
    }
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcodeInput.trim();
    if (clean === 'mirvai2026' || clean === 'mirvai' || clean === 'admin2026') {
      try {
        sessionStorage.setItem('mirvai_admin_authorized', 'true');
      } catch {}
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Access is strictly restricted to Mirvai Administrators.');
    }
  };

  const handleSignOut = () => {
    try {
      sessionStorage.removeItem('mirvai_admin_authorized');
    } catch {}
    setIsAuthenticated(false);
  };

  // Property Modal State
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<StoredProperty | null>(null);
  const [propertyFormData, setPropertyFormData] = useState({
    title: '',
    reference: '',
    location: '',
    type: 'Terrace duplex',
    category: 'terrace-duplex',
    price: '',
    status: 'Available',
    completionStatus: 'Fully completed',
    titleDocument: 'Governor’s Consent',
    description: '',
    image_url: '',
    verified: 1,
    featured: true,
    features: '',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [props, s, chatData] = await Promise.all([
        fetchAllProperties(),
        fetchWebsiteSettings(),
        fetchAdminChatData(),
      ]);

      setProperties(props);
      if (s) setSettings(s);
      setConversations(chatData.conversations || []);
      setMessages(chatData.messages || []);
      if (!selectedConvId && chatData.conversations && chatData.conversations.length > 0) {
        setSelectedConvId(chatData.conversations[0].id);
      }
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Connect to Real-Time (Supabase WebSocket Channel or Local SSE Stream)
  useEffect(() => {
    if (supabase) {
      const sb = supabase;
      setRealtimeConnected(true);
      const channel = sb
        .channel('admin:realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'properties' },
          () => {
            fetchAllProperties().then((p) => setProperties(p));
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'website_settings' },
          () => {
            fetchWebsiteSettings().then((s) => {
              if (s) setSettings(s);
            });
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'chat_conversations' },
          () => {
            fetchAdminChatData().then((d) => setConversations(d.conversations));
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages' },
          (payload: any) => {
            const m = payload.new;
            if (m) {
              const mappedMsg: ChatMessage = {
                id: m.id,
                conversationId: m.conversation_id,
                sender: m.sender,
                senderName: m.sender_name,
                body: m.body,
                timeString: m.time_string || 'Recent',
                createdAt: m.created_at,
              };
              setMessages((prev) => {
                if (prev.some((x) => x.id === mappedMsg.id)) return prev;
                return [...prev, mappedMsg];
              });
            }
          }
        )
        .subscribe();

      return () => {
        sb.removeChannel(channel);
      };
    }

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');
      
      eventSource.addEventListener('connected', () => {
        setRealtimeConnected(true);
      });

      eventSource.addEventListener('property_added', (e) => {
        try {
          const { payload } = JSON.parse(e.data);
          setProperties((prev) => [payload, ...prev.filter((p) => p.id !== payload.id)]);
        } catch {}
      });

      eventSource.addEventListener('property_updated', (e) => {
        try {
          const { payload } = JSON.parse(e.data);
          setProperties((prev) => prev.map((p) => (p.id === payload.id ? payload : p)));
        } catch {}
      });

      eventSource.addEventListener('property_deleted', (e) => {
        try {
          const { payload } = JSON.parse(e.data);
          setProperties((prev) => prev.filter((p) => p.id !== payload.id));
        } catch {}
      });

      eventSource.addEventListener('settings_updated', (e) => {
        try {
          const { payload } = JSON.parse(e.data);
          setSettings(payload);
        } catch {}
      });

      eventSource.addEventListener('chat_message', (e) => {
        try {
          const { payload } = JSON.parse(e.data);
          const { conversation, message } = payload;
          setConversations((prev) => {
            const others = prev.filter((c) => c.id !== conversation.id);
            return [conversation, ...others];
          });
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        } catch {}
      });

      eventSource.onerror = () => {
        setRealtimeConnected(false);
      };
    } catch {}

    return () => {
      eventSource?.close();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConvId]);

  // Open Property Modal for Create
  const handleOpenAddProperty = () => {
    setEditingProperty(null);
    setPropertyFormData({
      title: '',
      reference: `MIR-${Math.floor(100 + Math.random() * 900)}`,
      location: 'Lekki Phase 1, Lagos',
      type: 'Terrace duplex',
      category: 'terrace-duplex',
      price: '350000000',
      status: 'Available',
      completionStatus: 'Fully completed',
      titleDocument: 'Governor’s Consent',
      description: 'Luxury residential home with contemporary finishing, fitted marble kitchen, en-suite bedrooms and 24/7 security.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      verified: 1,
      featured: true,
      features: "Governor's Consent Title\nModern contemporary architecture\nAll rooms en-suite\nFitted marble kitchen\n24/7 Gated security",
    });
    setPropertyModalOpen(true);
  };

  // Open Property Modal for Edit
  const handleOpenEditProperty = (prop: StoredProperty) => {
    setEditingProperty(prop);
    setPropertyFormData({
      title: prop.title,
      reference: prop.reference,
      location: prop.location,
      type: prop.type,
      category: prop.category,
      price: String(prop.price),
      status: prop.status,
      completionStatus: prop.completionStatus || 'Fully completed',
      titleDocument: prop.titleDocument || 'Governor’s Consent',
      description: prop.description,
      image_url: prop.image_url,
      verified: prop.verified,
      featured: !!prop.featured,
      features: prop.features.join('\n'),
    });
    setPropertyModalOpen(true);
  };

  // Save Property (Create or Update)
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving property…');

    const payload: Partial<StoredProperty> = {
      ...(editingProperty ? { id: editingProperty.id } : {}),
      title: propertyFormData.title,
      reference: propertyFormData.reference,
      location: propertyFormData.location,
      type: propertyFormData.type,
      category: propertyFormData.category,
      price: Number(propertyFormData.price) || 0,
      status: propertyFormData.status,
      completionStatus: propertyFormData.completionStatus,
      titleDocument: propertyFormData.titleDocument,
      description: propertyFormData.description,
      image_url: propertyFormData.image_url,
      verified: propertyFormData.verified,
      featured: propertyFormData.featured,
      features: propertyFormData.features.split('\n').map((f) => f.trim()).filter(Boolean),
    };

    try {
      const saved = await upsertProperty(payload);
      if (saved) {
        setSaveStatus(editingProperty ? 'Property updated live!' : 'Property published live!');
        setPropertyModalOpen(false);
        fetchData();
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to save property. Please check input.');
      }
    } catch {
      setSaveStatus('Network error while saving property.');
    }
  };

  // Delete Property
  const handleDeleteProperty = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      const ok = await removeProperty(id);
      if (ok) {
        setSaveStatus('Property deleted successfully.');
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        alert('Failed to delete property.');
      }
    } catch {
      alert('Failed to delete property.');
    }
  };

  // Quick Toggle Verified
  const handleToggleVerified = async (prop: StoredProperty) => {
    const nextVal = prop.verified ? 0 : 1;
    try {
      await upsertProperty({ id: prop.id, verified: nextVal });
      setProperties((prev) => prev.map((p) => (p.id === prop.id ? { ...p, verified: nextVal } : p)));
    } catch {}
  };

  // Save Website CMS Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaveStatus('Updating live website settings…');

    try {
      const ok = await saveWebsiteSettings(settings);
      if (ok) {
        setSaveStatus('Website landing page updated live!');
        setTimeout(() => setSaveStatus(''), 4000);
      } else {
        setSaveStatus('Failed to update website settings.');
      }
    } catch {
      setSaveStatus('Error saving settings.');
    }
  };

  // Send Admin Reply
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedConvId) return;

    const body = adminReplyText.trim();
    setAdminReplyText('');

    try {
      const ok = await postAdminReply(selectedConvId, body);
      if (ok) {
        fetchAdminChatData().then((d) => {
          setConversations(d.conversations);
          setMessages(d.messages);
        });
      } else {
        alert('Failed to deliver reply.');
      }
    } catch {
      alert('Failed to deliver reply.');
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedConvId);
  const activeConversationMessages = messages.filter((m) => m.conversationId === selectedConvId);

  // Format currency
  const formatNaira = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#041109] flex flex-col items-center justify-center p-4 selection:bg-[#cca462]/30 text-[#e5ede8]">
        <div className="w-full max-w-md bg-[#071d12] border border-[#cca462]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#cca462] to-transparent opacity-80" />
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-sm bg-[#cca462] flex items-center justify-center font-serif text-3xl font-bold text-[#082216] shadow-lg select-none">
              M
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#f0eee8] tracking-wide mb-1">
              Mirvai Senior Access
            </h1>
            <p className="text-xs text-[#9eb5a8] uppercase tracking-[0.2em] font-semibold">
              Restricted Administrator Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#cca462] uppercase tracking-wider mb-2">
                Administrator Security Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter administrator passcode"
                  className="w-full px-4 py-3 rounded-xl bg-[#030e07] border border-[#1d4634] text-sm text-[#f0eee8] placeholder-[#9bb3a6]/40 focus:outline-none focus:border-[#cca462] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9bb3a6] hover:text-[#cca462] transition-colors cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#cca462] hover:bg-[#deb26d] text-[#082216] font-bold text-sm tracking-wide transition-all shadow-lg cursor-pointer"
            >
              Unlock Admin Portal
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#163d2a] flex items-center justify-between text-xs">
            <span className="text-[#8fa89c] text-[11px]">Passcode: <code className="text-[#cca462]">mirvai2026</code></span>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-[#9bb3a6] hover:text-[#cca462] transition-colors underline cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#041109] text-[#e5ede8] font-sans">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#06180f]/95 backdrop-blur-md border-b border-[#153a28] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MirvaiBrand onClick={onNavigateHome} />
          <div className="h-6 w-[1px] bg-[#1a4732]" />
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.2em] uppercase font-bold text-[#cca462]">
              SENIOR ADMIN CRM
            </span>
            {isSupabaseConfigured() ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Cloud Connected
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] bg-[#112d1e] text-[#cca462] border border-[#cca462]/30 font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${realtimeConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {realtimeConnected ? 'Local Engine (Add Supabase keys for Vercel)' : 'Connecting'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            title="Refresh All Data"
            className="p-2 rounded-lg bg-[#0a2719] hover:bg-[#123824] text-[#cca462] border border-[#cca462]/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#cca462] hover:bg-[#deb26d] text-[#082216] font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e2c1c] hover:bg-[#17462c] text-[#9eb5a8] hover:text-white border border-[#1d4634] text-xs font-semibold transition-all cursor-pointer"
            title="Lock and sign out of admin portal"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#163d2a] mb-6 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('properties')}
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'properties'
                ? 'bg-[#cca462] text-[#082216] shadow-lg'
                : 'text-[#9eb5a8] hover:text-[#f0eee8] hover:bg-[#092518]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Properties ({properties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'website'
                ? 'bg-[#cca462] text-[#082216] shadow-lg'
                : 'text-[#9eb5a8] hover:text-[#f0eee8] hover:bg-[#092518]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website CMS &amp; Landing Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer relative ${
              activeTab === 'chat'
                ? 'bg-[#cca462] text-[#082216] shadow-lg'
                : 'text-[#9eb5a8] hover:text-[#f0eee8] hover:bg-[#092518]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Chat &amp; Inquiries ({conversations.length})</span>
            {conversations.some((c) => c.unreadByAdmin > 0) && (
              <span className="w-2 h-2 rounded-full bg-red-400 absolute top-2 right-2 animate-ping" />
            )}
          </button>
        </div>

        {/* Global Save Alert Banner */}
        {saveStatus && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveStatus}</span>
            </div>
            <button type="button" onClick={() => setSaveStatus('')} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: PROPERTIES MANAGEMENT
           ========================================================================= */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071e13] p-4 sm:p-5 rounded-2xl border border-[#173e2b]">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#f0eee8]">Property Portfolio Management</h2>
                <p className="text-xs sm:text-sm text-[#8fa89b] mt-0.5">
                  Add, edit, toggle verification badges, and delete properties in real time.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddProperty}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#cca462] hover:bg-[#deb26d] text-[#082216] font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Property</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#8fa89b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, location or ref (e.g., MIR-IKE-001)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071f14] border border-[#173e2b] text-sm text-[#f0eee8] placeholder-[#60796e] focus:outline-none focus:border-[#cca462]"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#071f14] border border-[#173e2b] text-sm text-[#f0eee8] focus:outline-none focus:border-[#cca462]"
              >
                <option value="all">All Categories</option>
                <option value="terrace-duplex">Terrace Duplex</option>
                <option value="fully-detached-duplex">Fully Detached Duplex</option>
                <option value="apartments-penthouses">Apartments &amp; Penthouses</option>
                <option value="land">Residential / Commercial Land</option>
                <option value="off-plan">Off-plan Properties</option>
              </select>
            </div>

            {/* Properties List Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="rounded-2xl bg-[#061a10] border border-[#163d29] overflow-hidden flex flex-col justify-between hover:border-[#cca462]/60 transition-all shadow-lg group"
                >
                  <div className="relative h-48 bg-[#092216] overflow-hidden">
                    <img
                      src={prop.image_url}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#082216]/90 text-[#cca462] border border-[#cca462]/30 backdrop-blur-sm">
                        {prop.type}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                        prop.status === 'Available' 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-600/40'
                      }`}>
                        {prop.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleVerified(prop)}
                      title="Click to toggle verified badge"
                      className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer backdrop-blur-sm ${
                        prop.verified
                          ? 'bg-emerald-500/90 text-[#082216]'
                          : 'bg-gray-800/80 text-gray-400'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{prop.verified ? 'Verified' : 'Unverified'}</span>
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#8da699] mb-1">
                        <span>Ref: {prop.reference}</span>
                        <span>{prop.titleDocument || "Gov. Consent"}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#f0eee8] leading-snug line-clamp-2">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-[#9eb3a6] mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#cca462] shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </p>
                      <p className="text-xs text-[#8ca497] mt-2.5 line-clamp-2 leading-relaxed">
                        {prop.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#143a27] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#789385] uppercase tracking-wider">Price</span>
                        <b className="font-serif text-base text-[#cca462]">{formatNaira(prop.price)}</b>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProperty(prop)}
                          className="p-2 rounded-lg bg-[#0b2b1c] hover:bg-[#12402b] text-[#cca462] border border-[#cca462]/30 transition-all cursor-pointer"
                          title="Edit Property"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(prop.id, prop.title)}
                          className="p-2 rounded-lg bg-[#270d10] hover:bg-[#3d1419] text-red-400 border border-red-500/30 transition-all cursor-pointer"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: WEBSITE CMS & LANDING PAGE EDITOR
           ========================================================================= */}
        {activeTab === 'website' && settings && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <div className="bg-[#071e13] p-5 rounded-2xl border border-[#173e2b]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif text-[#f0eee8]">Landing Page Real-Time Editor</h2>
                  <p className="text-xs sm:text-sm text-[#8fa89b] mt-0.5">
                    Modifications save directly to the database and update the live website immediately.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#cca462] hover:bg-[#deb26d] text-[#082216] font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer shrink-0"
                >
                  Save &amp; Broadcast Live
                </button>
              </div>
            </div>

            {/* Announcement Banner Control */}
            <div className="p-5 rounded-2xl bg-[#071f14] border border-[#173e2b] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#cca462]">Top Announcement Banner</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#9eb3a6]">
                  <input
                    type="checkbox"
                    checked={settings.showAnnouncement}
                    onChange={(e) => setSettings({ ...settings, showAnnouncement: e.target.checked })}
                    className="accent-[#cca462] w-4 h-4"
                  />
                  <span>Show on public site</span>
                </label>
              </div>
              <input
                type="text"
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                placeholder="Banner message..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8] focus:outline-none focus:border-[#cca462]"
              />
            </div>

            {/* Hero Section Copy */}
            <div className="p-5 rounded-2xl bg-[#071f14] border border-[#173e2b] space-y-4">
              <h3 className="font-bold text-sm text-[#cca462] uppercase tracking-wider">Hero Section Headlines</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#8ea699] mb-1">Kicker Eyebrow Top</label>
                  <input
                    type="text"
                    value={settings.heroKickerTop}
                    onChange={(e) => setSettings({ ...settings, heroKickerTop: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8ea699] mb-1">Kicker Tagline Bottom</label>
                  <input
                    type="text"
                    value={settings.heroKickerBottom}
                    onChange={(e) => setSettings({ ...settings, heroKickerBottom: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#8ea699] mb-1">Headline First Line</label>
                  <input
                    type="text"
                    value={settings.heroHeadlineMain}
                    onChange={(e) => setSettings({ ...settings, heroHeadlineMain: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8ea699] mb-1">Headline Emphasized Line</label>
                  <input
                    type="text"
                    value={settings.heroHeadlineEm}
                    onChange={(e) => setSettings({ ...settings, heroHeadlineEm: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8ea699] mb-1">Hero Subtitle Copy</label>
                <textarea
                  rows={3}
                  value={settings.heroCopy}
                  onChange={(e) => setSettings({ ...settings, heroCopy: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                />
              </div>
            </div>

            {/* Official Contact & App Links */}
            <div className="p-5 rounded-2xl bg-[#071f14] border border-[#173e2b] space-y-4">
              <h3 className="font-bold text-sm text-[#cca462] uppercase tracking-wider">Contact &amp; Store Channels</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#8ea699] mb-1">Official WhatsApp (digits with country code)</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    placeholder="2349011081436"
                    className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8ea699] mb-1">Official Advisory Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8ea699] mb-1">Physical Office Corridor</label>
                <input
                  type="text"
                  value={settings.officeLocation}
                  onChange={(e) => setSettings({ ...settings, officeLocation: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8ea699] mb-1">Google Play Store Download URL</label>
                <input
                  type="text"
                  value={settings.playStoreUrl}
                  onChange={(e) => setSettings({ ...settings, playStoreUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#06180f] border border-[#18422d] text-sm text-[#f0eee8]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#cca462] hover:bg-[#deb26d] text-[#082216] font-bold text-sm transition-all shadow-lg cursor-pointer"
            >
              Save All Website Changes Live
            </button>
          </form>
        )}

        {/* =========================================================================
            TAB 3: LIVE REAL-TIME CHAT & CLIENT INQUIRIES
           ========================================================================= */}
        {activeTab === 'chat' && (
          <div className="bg-[#071f14] rounded-2xl border border-[#173e2b] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] shadow-xl">
            {/* Left Conversations Sidebar */}
            <div className="md:col-span-4 border-r border-[#153b28] bg-[#061a10] flex flex-col">
              <div className="p-4 border-b border-[#153b28] bg-[#082316]">
                <h3 className="font-serif text-base font-bold text-[#f0eee8] flex items-center justify-between">
                  <span>Client Conversations</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#cca462]/20 text-[#cca462]">
                    {conversations.length}
                  </span>
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[#133524]">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      fetch('/api/chat/admin/read', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ conversationId: conv.id }),
                      });
                    }}
                    className={`w-full p-4 text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      selectedConvId === conv.id
                        ? 'bg-[#0f3422] border-l-4 border-l-[#cca462]'
                        : 'hover:bg-[#0b271b]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#f0eee8] truncate">{conv.name}</span>
                      <span className="text-[10px] text-[#7d998b]">
                        {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#8ea699] truncate">{conv.lastMessage}</p>
                    <div className="flex items-center justify-between text-[10px] text-[#cca462] mt-0.5">
                      <span>{conv.contact}</span>
                      {conv.unreadByAdmin > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#cca462] text-[#082216] font-bold">
                          {conv.unreadByAdmin} new
                        </span>
                      )}
                    </div>
                  </button>
                ))}
                {conversations.length === 0 && (
                  <div className="p-8 text-center text-xs text-[#70897e]">
                    No chat conversations yet. When visitors message from the website, they will appear here live.
                  </div>
                )}
              </div>
            </div>

            {/* Right Chat Thread Panel */}
            <div className="md:col-span-8 flex flex-col bg-[#05170d]">
              {selectedConversation ? (
                <>
                  {/* Chat User Header */}
                  <div className="p-4 border-b border-[#153b28] bg-[#082316] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#f0eee8]">{selectedConversation.name}</h4>
                      <p className="text-xs text-[#cca462]">{selectedConversation.contact}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${selectedConversation.contact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${selectedConversation.name}, this is Mirvai Senior Advisory following up on your live enquiry.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25d366]/20 text-[#25d366] hover:bg-[#25d366]/30 text-xs font-bold transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Open WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Messages Bubble Stream */}
                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 min-h-[380px] max-h-[460px]">
                    {activeConversationMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-[#789386] mb-1 px-1">
                          {msg.sender === 'admin' ? 'Mirvai Senior Advisor' : selectedConversation.name} · {msg.timeString}
                        </span>
                        <div
                          className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            msg.sender === 'admin'
                              ? 'bg-[#cca462] text-[#082216] font-medium rounded-tr-none'
                              : 'bg-[#0f2e1e] text-[#f0eee8] border border-[#1b4b33] rounded-tl-none'
                          }`}
                        >
                          {msg.body}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Canned Replies */}
                  <div className="px-4 py-2 bg-[#071f14] border-t border-[#133926] flex items-center gap-2 overflow-x-auto text-xs">
                    <button
                      type="button"
                      onClick={() => setAdminReplyText("Title verification is complete. Governor's Consent is unencumbered.")}
                      className="px-2.5 py-1 rounded-full bg-[#0a2c1d] hover:bg-[#12402b] text-[#cca462] whitespace-nowrap text-[11px] border border-[#cca462]/20"
                    >
                      Title Check Passed
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminReplyText("We can schedule a live 4K drone walkthrough tomorrow at 2:00 PM WAT.")}
                      className="px-2.5 py-1 rounded-full bg-[#0a2c1d] hover:bg-[#12402b] text-[#cca462] whitespace-nowrap text-[11px] border border-[#cca462]/20"
                    >
                      Drone Inspection
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminReplyText("Would you like our legal team to send the deed review file to your email?")}
                      className="px-2.5 py-1 rounded-full bg-[#0a2c1d] hover:bg-[#12402b] text-[#cca462] whitespace-nowrap text-[11px] border border-[#cca462]/20"
                    >
                      Send Deed File
                    </button>
                  </div>

                  {/* Admin Reply Input Box */}
                  <form onSubmit={handleSendAdminReply} className="p-4 bg-[#082417] border-t border-[#153b28] flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your live reply to this client..."
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#05170e] border border-[#1a442e] text-sm text-[#f0eee8] placeholder-[#627d70] focus:outline-none focus:border-[#cca462]"
                    />
                    <button
                      type="submit"
                      disabled={!adminReplyText.trim()}
                      className="px-5 py-2.5 rounded-xl bg-[#cca462] hover:bg-[#deb26d] disabled:opacity-50 text-[#082216] font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#70897e]">
                  <MessageSquare className="w-10 h-10 text-[#cca462]/40 mb-3" />
                  <p className="text-sm">Select a conversation from the left to view messages and reply in real time.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: ADD / EDIT PROPERTY
         ========================================================================= */}
      {propertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#071f14] border border-[#cca462]/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setPropertyModalOpen(false)}
              className="absolute top-5 right-5 text-[#8fa89b] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f0eee8] mb-1">
              {editingProperty ? 'Edit Property Listing' : 'Publish New Property Listing'}
            </h3>
            <p className="text-xs text-[#8fa89b] mb-5">
              Updates will instantly synchronize across the website landing and property catalogue in real time.
            </p>

            <form onSubmit={handleSaveProperty} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8ea699] mb-1 font-semibold">Title</label>
                  <input
                    required
                    type="text"
                    value={propertyFormData.title}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-sm text-[#f0eee8]"
                    placeholder="e.g. Luxury 4-Bedroom Terrace Duplex"
                  />
                </div>
                <div>
                  <label className="block text-[#8ea699] mb-1 font-semibold">Reference ID</label>
                  <input
                    required
                    type="text"
                    value={propertyFormData.reference}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, reference: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-sm text-[#f0eee8]"
                    placeholder="MIR-IKE-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8ea699] mb-1 font-semibold">Location / Area</label>
                  <input
                    required
                    type="text"
                    value={propertyFormData.location}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-sm text-[#f0eee8]"
                    placeholder="e.g. Adeniyi Jones, Ikeja, Lagos"
                  />
                </div>
                <div>
                  <label className="block text-[#8ea699] mb-1 font-semibold">Price (in Naira NGN)</label>
                  <input
                    required
                    type="number"
                    value={propertyFormData.price}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-sm text-[#f0eee8]"
                    placeholder="400000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#8ea699] mb-1 font-semibold">Property Category</label>
                  <select
                    value={propertyFormData.category}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-xs text-[#f0eee8]"
                  >
                    <option value="terrace-duplex">Terrace Duplex</option>
                    <option value="fully-detached-duplex">Fully Detached</option>
                    <option value="semi-detached-duplex">Semi-detached</option>
                    <option value="apartments-penthouses">Apartment/Penthouse</option>
                    <option value="land">Land</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="off-plan">Off-Plan</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8ea699] mb-1 font-semibold">Status</label>
                  <select
                    value={propertyFormData.status}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-xs text-[#f0eee8]"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8ea699] mb-1 font-semibold">Title Document</label>
                  <input
                    type="text"
                    value={propertyFormData.titleDocument}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, titleDocument: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-xs text-[#f0eee8]"
                    placeholder="Governor's Consent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8ea699] mb-1 font-semibold">Image URL</label>
                <input
                  required
                  type="text"
                  value={propertyFormData.image_url}
                  onChange={(e) => setPropertyFormData({ ...propertyFormData, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-xs text-[#f0eee8]"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="block text-[#8ea699] mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={propertyFormData.description}
                  onChange={(e) => setPropertyFormData({ ...propertyFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-xs text-[#f0eee8]"
                  placeholder="Comprehensive description of the home and surrounding neighborhood..."
                />
              </div>

              <div>
                <label className="block text-[#8ea699] mb-1 font-semibold">Key Features (one per line)</label>
                <textarea
                  rows={3}
                  value={propertyFormData.features}
                  onChange={(e) => setPropertyFormData({ ...propertyFormData, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#05170d] border border-[#18422d] text-xs text-[#f0eee8]"
                  placeholder="Governor's Consent Title&#10;Fitted Italian marble kitchen&#10;24/7 Security"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#f0eee8]">
                  <input
                    type="checkbox"
                    checked={!!propertyFormData.verified}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, verified: e.target.checked ? 1 : 0 })}
                    className="accent-[#cca462] w-4 h-4"
                  />
                  <span>Mark as Mirvai Verified</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#f0eee8]">
                  <input
                    type="checkbox"
                    checked={propertyFormData.featured}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, featured: e.target.checked })}
                    className="accent-[#cca462] w-4 h-4"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#163d2a]">
                <button
                  type="button"
                  onClick={() => setPropertyModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#1c4833] text-[#9eb5a8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#cca462] hover:bg-[#deb26d] text-[#082216] font-bold text-xs"
                >
                  {editingProperty ? 'Update Property' : 'Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MirvaiAdminPortal;
