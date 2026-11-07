import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (Vite client env vars must start with VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface StoredProperty {
  id: string;
  reference: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  category: string;
  price: number;
  status: string;
  completionStatus?: string;
  titleDocument?: string;
  description: string;
  image_url: string;
  image_key?: string | null;
  verified: number;
  featured?: boolean;
  features: string[];
  createdAt?: string;
}

export interface WebsiteSettings {
  heroKickerTop: string;
  heroKickerBottom: string;
  heroHeadlineMain: string;
  heroHeadlineEm: string;
  heroCopy: string;
  whatsapp: string;
  contactEmail: string;
  officeLocation: string;
  playStoreUrl: string;
  trustPoints: string[];
  announcement: string;
  showAnnouncement: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'visitor' | 'admin';
  body: string;
  senderName?: string;
  createdAt: string;
  timeString: string;
}

export interface ChatConversation {
  id: string;
  visitorToken: string;
  name: string;
  contact: string;
  status: 'active' | 'resolved' | 'archived';
  unreadByAdmin: number;
  unreadByVisitor: number;
  lastMessage: string;
  updatedAt: string;
  createdAt: string;
}

// Convert DB snake_case to frontend camelCase
function mapPropertyFromDb(row: any): StoredProperty {
  return {
    id: row.id,
    reference: row.reference,
    slug: row.slug,
    title: row.title,
    location: row.location,
    type: row.type,
    category: row.category,
    price: Number(row.price),
    status: row.status,
    completionStatus: row.completion_status,
    titleDocument: row.title_document,
    description: row.description || '',
    image_url: row.image_url || '',
    image_key: row.image_key || null,
    verified: row.verified !== undefined ? Number(row.verified) : 1,
    featured: Boolean(row.featured),
    features: Array.isArray(row.features) ? row.features : [],
    createdAt: row.created_at,
  };
}

function mapSettingsFromDb(row: any): WebsiteSettings {
  return {
    heroKickerTop: row.hero_kicker_top || 'Lagos · Nigeria · Diaspora',
    heroKickerBottom: row.hero_kicker_bottom || 'Buy · Sell · Invest',
    heroHeadlineMain: row.hero_headline_main || 'Property decisions,',
    heroHeadlineEm: row.hero_headline_em || 'made with confidence.',
    heroCopy: row.hero_copy || 'We help you find, evaluate and secure the right property in Lagos—wherever you are in the world.',
    whatsapp: row.whatsapp || '2349011081436',
    contactEmail: row.contact_email || 'advisory@mirvaigroup.com',
    officeLocation: row.office_location || 'Admiralty Way Corridor, Lekki Phase 1 / Ikeja, Lagos',
    playStoreUrl: row.play_store_url || 'https://play.google.com/store/apps/details?id=com.mirvai.app',
    trustPoints: Array.isArray(row.trust_points) ? row.trust_points : ["Verified options", "Clear guidance", "End-to-end support"],
    announcement: row.announcement || '',
    showAnnouncement: Boolean(row.show_announcement),
  };
}

// =========================================================================
// DATA ACCESS LAYER: DUAL SUPABASE & LOCAL REST ENGINE
// =========================================================================

// 1. PROPERTIES
export async function fetchAllProperties(): Promise<StoredProperty[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(mapPropertyFromDb);
      }
    } catch (err) {
      console.warn('Supabase properties fetch error, falling back to local API:', err);
    }
  }

  // Fallback to local endpoint
  try {
    const res = await fetch('/api/properties');
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

export async function upsertProperty(prop: Partial<StoredProperty>): Promise<StoredProperty | null> {
  const id = prop.id || 'prop-' + Date.now();
  const slug = prop.slug || (prop.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

  if (supabase) {
    try {
      const payload = {
        id,
        reference: prop.reference || `MIR-${Math.floor(100 + Math.random() * 900)}`,
        slug,
        title: prop.title || 'Untitled Property',
        location: prop.location || 'Lagos, Nigeria',
        type: prop.type || 'Terrace duplex',
        category: prop.category || 'terrace-duplex',
        price: Number(prop.price) || 0,
        status: prop.status || 'Available',
        completion_status: prop.completionStatus || 'Fully completed',
        title_document: prop.titleDocument || 'Governor’s Consent',
        description: prop.description || '',
        image_url: prop.image_url || '',
        image_key: prop.image_key || null,
        verified: prop.verified !== undefined ? Number(prop.verified) : 1,
        featured: Boolean(prop.featured),
        features: prop.features || [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('properties')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) {
        return mapPropertyFromDb(data);
      }
    } catch (err) {
      console.warn('Supabase property upsert error, falling back:', err);
    }
  }

  // Fallback to local server
  try {
    const method = prop.id ? 'PUT' : 'POST';
    const url = prop.id ? `/api/properties/${prop.id}` : '/api/properties';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prop),
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function removeProperty(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase property delete error, falling back:', err);
    }
  }

  try {
    const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

// 2. WEBSITE SETTINGS
export async function fetchWebsiteSettings(): Promise<WebsiteSettings | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .eq('id', 'current')
        .single();
      if (!error && data) {
        return mapSettingsFromDb(data);
      }
    } catch (err) {
      console.warn('Supabase settings fetch error, falling back:', err);
    }
  }

  try {
    const res = await fetch('/api/website-settings');
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function saveWebsiteSettings(settings: WebsiteSettings): Promise<boolean> {
  if (supabase) {
    try {
      const payload = {
        id: 'current',
        hero_kicker_top: settings.heroKickerTop,
        hero_kicker_bottom: settings.heroKickerBottom,
        hero_headline_main: settings.heroHeadlineMain,
        hero_headline_em: settings.heroHeadlineEm,
        hero_copy: settings.heroCopy,
        whatsapp: settings.whatsapp,
        contact_email: settings.contactEmail,
        office_location: settings.officeLocation,
        play_store_url: settings.playStoreUrl,
        trust_points: settings.trustPoints,
        announcement: settings.announcement,
        show_announcement: settings.showAnnouncement,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('website_settings').upsert(payload);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase settings update error, falling back:', err);
    }
  }

  try {
    const res = await fetch('/api/website-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 3. CHAT CONVERSATIONS & MESSAGES
export async function fetchAdminChatData(): Promise<{ conversations: ChatConversation[]; messages: ChatMessage[] }> {
  if (supabase) {
    try {
      const [convRes, msgRes] = await Promise.all([
        supabase.from('chat_conversations').select('*').order('updated_at', { ascending: false }),
        supabase.from('chat_messages').select('*').order('created_at', { ascending: true }),
      ]);

      if (!convRes.error && !msgRes.error) {
        const convs: ChatConversation[] = (convRes.data || []).map((c) => ({
          id: c.id,
          visitorToken: c.visitor_token,
          name: c.name || 'Guest Visitor',
          contact: c.contact || 'Not provided',
          status: c.status || 'active',
          unreadByAdmin: c.unread_by_admin || 0,
          unreadByVisitor: c.unread_by_visitor || 0,
          lastMessage: c.last_message || '',
          updatedAt: c.updated_at,
          createdAt: c.created_at,
        }));

        const msgs: ChatMessage[] = (msgRes.data || []).map((m) => ({
          id: m.id,
          conversationId: m.conversation_id,
          sender: m.sender,
          senderName: m.sender_name,
          body: m.body,
          timeString: m.time_string || 'Recent',
          createdAt: m.created_at,
        }));

        return { conversations: convs, messages: msgs };
      }
    } catch (err) {
      console.warn('Supabase chat admin fetch error, falling back:', err);
    }
  }

  try {
    const res = await fetch('/api/chat/admin');
    if (res.ok) return await res.json();
  } catch {}
  return { conversations: [], messages: [] };
}

export async function fetchVisitorConversation(visitorToken: string): Promise<{ conversation: ChatConversation | null; messages: ChatMessage[] }> {
  if (supabase) {
    try {
      const { data: convData } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('visitor_token', visitorToken)
        .single();

      if (convData) {
        const { data: msgData } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', convData.id)
          .order('created_at', { ascending: true });

        const conv: ChatConversation = {
          id: convData.id,
          visitorToken: convData.visitor_token,
          name: convData.name,
          contact: convData.contact,
          status: convData.status,
          unreadByAdmin: convData.unread_by_admin,
          unreadByVisitor: convData.unread_by_visitor,
          lastMessage: convData.last_message,
          updatedAt: convData.updated_at,
          createdAt: convData.created_at,
        };

        const msgs: ChatMessage[] = (msgData || []).map((m) => ({
          id: m.id,
          conversationId: m.conversation_id,
          sender: m.sender,
          senderName: m.sender_name,
          body: m.body,
          timeString: m.time_string || 'Recent',
          createdAt: m.created_at,
        }));

        return { conversation: conv, messages: msgs };
      }
    } catch (err) {
      console.warn('Supabase visitor conv fetch error, falling back:', err);
    }
  }

  try {
    const res = await fetch(`/api/chat?token=${encodeURIComponent(visitorToken)}`);
    if (res.ok) return await res.json();
  } catch {}
  return { conversation: null, messages: [] };
}

export async function postVisitorMessage(token: string, name: string, contact: string, message: string): Promise<boolean> {
  if (supabase) {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Find or create conversation
      let convId = '';
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('visitor_token', token)
        .maybeSingle();

      if (existingConv) {
        convId = existingConv.id;
        await supabase
          .from('chat_conversations')
          .update({
            name: name || existingConv.name,
            contact: contact || existingConv.contact,
            last_message: message.trim(),
            unread_by_admin: (existingConv.unread_by_admin || 0) + 1,
            updated_at: now.toISOString(),
          })
          .eq('id', convId);
      } else {
        convId = 'conv-' + Date.now();
        await supabase
          .from('chat_conversations')
          .insert({
            id: convId,
            visitor_token: token,
            name: name || 'Guest Visitor',
            contact: contact || 'Not provided',
            status: 'active',
            unread_by_admin: 1,
            unread_by_visitor: 0,
            last_message: message.trim(),
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          });
      }

      // Insert message
      await supabase.from('chat_messages').insert({
        id: 'msg-' + Date.now(),
        conversation_id: convId,
        sender: 'visitor',
        sender_name: name || 'Guest Visitor',
        body: message.trim(),
        time_string: timeString,
        created_at: now.toISOString(),
      });

      return true;
    } catch (err) {
      console.warn('Supabase visitor message insert error, falling back:', err);
    }
  }

  // Fallback to local server
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name, contact, message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function postAdminReply(conversationId: string, body: string, adminName = 'Senior Advisor (Mirvai)'): Promise<boolean> {
  if (supabase) {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update conversation
      await supabase
        .from('chat_conversations')
        .update({
          last_message: body.trim(),
          unread_by_visitor: 1,
          unread_by_admin: 0,
          updated_at: now.toISOString(),
        })
        .eq('id', conversationId);

      // Insert admin message
      await supabase.from('chat_messages').insert({
        id: 'msg-' + Date.now(),
        conversation_id: conversationId,
        sender: 'admin',
        sender_name: adminName,
        body: body.trim(),
        time_string: timeString,
        created_at: now.toISOString(),
      });

      return true;
    } catch (err) {
      console.warn('Supabase admin reply insert error, falling back:', err);
    }
  }

  try {
    const res = await fetch('/api/chat/admin/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, body, adminName }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
