import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

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
  createdAt: string;
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

export interface StoredEnquiry {
  id: string;
  kind: 'Viewing' | 'Enquiry';
  title: string;
  summary: string;
  location?: string;
  timeline?: string;
  propertyType?: string;
  budget?: string;
  clientName?: string;
  clientContact?: string;
  basedIn?: string;
  notes?: string;
  reviewed: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  properties: StoredProperty[];
  enquiries?: StoredEnquiry[];
  settings: WebsiteSettings;
  conversations: ChatConversation[];
  messages: ChatMessage[];
  analytics: Array<{ event: string; path: string; sessionId: string; timestamp: string }>;
}

const defaultInitialData: DatabaseSchema = {
  properties: [
    {
      id: "mirvai-ikeja-001",
      reference: "MIR-IKE-001",
      slug: "luxury-4-bedroom-terrace-duplex-adeniyi-jones",
      title: "Luxury 4-Bedroom Terrace Duplex with BQ",
      location: "Adeniyi Jones, Ikeja, Lagos",
      type: "Terrace duplex",
      category: "terrace-duplex",
      price: 400000000,
      status: "Available",
      completionStatus: "Fully completed",
      titleDocument: "Governor’s Consent",
      description: "A fully completed four-bedroom luxury terrace duplex with boy's quarters in Adeniyi Jones, Ikeja. Modern architecture with generous living spaces, an ante-room, all en-suite bedrooms, fitted marble kitchen and quality sanitary fittings. Gated environment in an established Ikeja neighbourhood.",
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      image_key: null,
      verified: 1,
      featured: true,
      features: [
        "Governor's Consent Title",
        "Modern contemporary architecture",
        "Spacious living area with ante-room",
        "All rooms en-suite with walk-in wardrobes",
        "Fully fitted Italian marble kitchen",
        "Self-contained boy's quarters (BQ)",
        "24/7 Security & CCTV surveillance"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "mirvai-lekki-002",
      reference: "MIR-LEK-002",
      slug: "contemporary-5-bedroom-fully-detached-lekki-1",
      title: "Contemporary 5-Bedroom Detached Villa with Pool",
      location: "Admiralty Way Corridor, Lekki Phase 1, Lagos",
      type: "Fully detached duplex",
      category: "fully-detached-duplex",
      price: 650000000,
      status: "Available",
      completionStatus: "Ready for move-in",
      titleDocument: "Governor’s Consent",
      description: "Exceptional modern mansion featuring private infinity swimming pool, smart automated access control, elevator, double volume living room, and German fitted chef kitchen with Miele appliances.",
      image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
      image_key: null,
      verified: 1,
      featured: true,
      features: [
        "Verified Governor's Consent",
        "Private swimming pool & cabana",
        "Cinema room & private elevator",
        "Smart home lighting & climate automation",
        "Industrial water treatment plant",
        "Dedicated 4-car garage"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "mirvai-ikoyi-003",
      reference: "MIR-IKY-003",
      slug: "waterfront-3-bedroom-luxury-penthouse-ikoyi",
      title: "Waterfront 3-Bedroom Penthouse with Panoramic Views",
      location: "Bouridllon / Waterfront, Ikoyi, Lagos",
      type: "Penthouse",
      category: "apartments-penthouses",
      price: 850000000,
      status: "Under Offer",
      completionStatus: "Brand new",
      titleDocument: "Federal Certificate of Occupancy",
      description: "Ultra-prime waterfront penthouse boasting expansive 180-degree lagoon views, wraparound entertaining terraces, private boat jetty access, 24/7 uninterrupted power, and club amenities.",
      image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      image_key: null,
      verified: 1,
      featured: true,
      features: [
        "Federal C of O with clean root of title",
        "Expansive lagoon waterfront terraces",
        "24-Hour uninterrupted turbine power",
        "Private boat slip & jetty access",
        "Olympics-size communal pool & gym",
        "High diaspora rental yield (12.5% USD)"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "mirvai-epe-004",
      reference: "MIR-EPE-004",
      slug: "prime-waterfront-commercial-residential-land-epe",
      title: "1,200 SQM Dry Waterfront Land (Commercial/Res)",
      location: "Alaro City Corridor, Epe Waterfront, Lagos",
      type: "Land",
      category: "land",
      price: 95000000,
      status: "Available",
      completionStatus: "Ready for construction",
      titleDocument: "Gazette & Registered Survey",
      description: "100% dry table-land with direct access to dual carriageway. Free from government acquisition, registered survey lodged with surveyor-general, ideal for luxury residential subdivision or long-term capital appreciation.",
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80",
      image_key: null,
      verified: 1,
      featured: false,
      features: [
        "Registered Gazette & survey beacon validation",
        "100% dry table land (zero sand filling)",
        "Direct tarred access to Lekki-Epe expressway",
        "Rapidly appreciating high-growth corridor"
      ],
      createdAt: new Date().toISOString()
    }
  ],
  settings: {
    heroKickerTop: "Lagos · Nigeria · Diaspora",
    heroKickerBottom: "Buy · Sell · Invest",
    heroHeadlineMain: "Property decisions,",
    heroHeadlineEm: "made with confidence.",
    heroCopy: "We help you find, evaluate and secure the right property in Lagos—wherever you are in the world.",
    whatsapp: "2349011081436",
    contactEmail: "advisory@mirvaigroup.com",
    officeLocation: "Admiralty Way Corridor, Lekki Phase 1 / Ikeja, Lagos",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.mirvai.app",
    trustPoints: ["Verified options", "Clear guidance", "End-to-end support"],
    announcement: "",
    showAnnouncement: false
  },
  conversations: [
    {
      id: "conv-seed-1",
      visitorToken: "visitor-seed-1",
      name: "Tunde Adebayo",
      contact: "+44 7911 123456 (London, UK)",
      status: "active",
      unreadByAdmin: 1,
      unreadByVisitor: 0,
      lastMessage: "Can we verify the Governor's Consent for the 4-bedroom duplex in Adeniyi Jones?",
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    }
  ],
  messages: [
    {
      id: "msg-seed-1",
      conversationId: "conv-seed-1",
      sender: "visitor",
      body: "Hello Mirvai, I am a Nigerian based in London. I saw the Adeniyi Jones property.",
      senderName: "Tunde Adebayo",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      timeString: "45m ago"
    },
    {
      id: "msg-seed-2",
      conversationId: "conv-seed-1",
      sender: "admin",
      body: "Good afternoon Tunde! Welcome to Mirvai Senior Advisory. We coordinate full legal due diligence and drone viewings for diaspora buyers.",
      senderName: "Senior Advisor (Mirvai)",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      timeString: "30m ago"
    },
    {
      id: "msg-seed-3",
      conversationId: "conv-seed-1",
      sender: "visitor",
      body: "Can we verify the Governor's Consent for the 4-bedroom duplex in Adeniyi Jones?",
      senderName: "Tunde Adebayo",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      timeString: "15m ago"
    }
  ],
  analytics: []
};

// Load or initialize DB
function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db.json, using defaults:', err);
  }
  saveDB(defaultInitialData);
  return defaultInitialData;
}

function saveDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

let db = loadDB();

// Server-Sent Events (SSE) connections for instant real-time synchronization
const sseClients: Response[] = [];

function broadcastRealtime(event: string, payload: any) {
  const data = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  sseClients.forEach((client) => {
    try {
      client.write(`event: ${event}\ndata: ${data}\n\n`);
    } catch {
      // client disconnected
    }
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));
  // Favicon explicit routes
  app.get('/favicon.ico', (_req: Request, res: Response) => {
    const icoPath = path.join(__dirname, 'public', 'favicon.ico');
    if (fs.existsSync(icoPath)) {
      res.setHeader('Content-Type', 'image/x-icon');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(icoPath);
    }
    res.status(404).end();
  });

  app.get('/favicon.svg', (_req: Request, res: Response) => {
    const svgPath = path.join(__dirname, 'public', 'favicon.svg');
    if (fs.existsSync(svgPath)) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(svgPath);
    }
    res.status(404).end();
  });

  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(sitemapPath);
    }
    res.status(404).end();
  });

  app.get('/robots.txt', (_req: Request, res: Response) => {
    const robotsPath = path.join(__dirname, 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(robotsPath);
    }
    res.status(404).end();
  });

  // AI Crawler Manifest Endpoints (standardized llms.txt protocol for ChatGPT, Claude, Perplexity, Gemini, Applebot)
  app.get(['/llms.txt', '/.well-known/llms.txt'], (_req: Request, res: Response) => {
    const llmsPath = path.join(__dirname, 'public', 'llms.txt');
    if (fs.existsSync(llmsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(llmsPath);
    }
    res.status(404).end();
  });

  app.get('/llms-full.txt', (_req: Request, res: Response) => {
    const fullPath = path.join(__dirname, 'public', 'llms-full.txt');
    if (fs.existsSync(fullPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(fullPath);
    }
    res.status(404).end();
  });

  // Machine-readable AI Manifest API endpoint (JSON format)
  app.get('/api/ai-manifest', (_req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      name: "Mirvai Realty & Investment",
      tagline: "Premium Lagos Property Sourcing & Diaspora Advisory",
      founder: "Osuwah Nkechi Racheal",
      locations: ["Ikoyi", "Ikeja GRA", "Lekki Phase 1", "Magodo GRA", "Oniru", "Alaro / Epe Corridor"],
      website: "https://mirvaigroup.com",
      whatsapp: "+2349011081436",
      diasporaDesk: {
        services: [
          "Live HD Remote Video Walkthroughs",
          "5-Step Due Diligence Framework",
          "Independent Legal & Surveyor Title Search Coordination",
          "Written Transparent Findings Before Payment Commitment"
        ]
      },
      divisions: [
        { name: "MIRVAI Realty", status: "Active", focus: "Verified third-party properties" },
        { name: "MIRVAI Development", status: "Incoming", focus: "Proprietary architectural homes" },
        { name: "MIRVAI Construction", status: "Incoming", focus: "Building materials and finishing" },
        { name: "MIRVAI Technology", status: "Incoming", focus: "Digital real estate intelligence" },
        { name: "MIRVAI Energy", status: "Incoming", focus: "Residential solar and microgrids" },
        { name: "MIRVAI Community", status: "Incoming", focus: "Resident and investor network" }
      ],
      propertiesCount: db.properties.length,
      properties: db.properties,
      llmsSummary: "/llms.txt",
      llmsFull: "/llms-full.txt",
      sitemap: "/sitemap.xml",
      robots: "/robots.txt"
    });
  });

  app.get(['/favicon-48x48.png', '/apple-touch-icon.png', '/favicon-16x16.png', '/favicon-32x32.png', '/favicon-96x96.png', '/favicon-192x192.png', '/favicon-512x512.png', '/favicon.png'], (req: Request, res: Response) => {
    const imgName = req.path.replace('/', '');
    const imgPath = path.join(__dirname, 'public', imgName);
    if (fs.existsSync(imgPath)) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(imgPath);
    }
    res.status(404).end();
  });

  // SSE Real-Time Endpoint
  app.get('/api/realtime/stream', (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });

    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Real-time SSE connected', clientId: Date.now() })}\n\n`);
    sseClients.push(res);

    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  // Keep-alive heartbeat for SSE every 25s
  setInterval(() => {
    sseClients.forEach((client) => {
      try {
        client.write(': heartbeat\n\n');
      } catch {}
    });
  }, 25000);

  // 1. PROPERTIES API
  app.get('/api/properties', (_req: Request, res: Response) => {
    res.json(db.properties);
  });

  app.get('/api/properties/:id', (req: Request, res: Response) => {
    const prop = db.properties.find((p) => p.id === req.params.id || p.slug === req.params.id);
    if (!prop) return res.status(404).json({ error: 'Property not found' });
    res.json(prop);
  });

  app.post('/api/properties', (req: Request, res: Response) => {
    const b = req.body || {};
    const newProp: StoredProperty = {
      id: b.id || 'prop-' + Date.now(),
      reference: b.reference || `MIR-${Math.floor(100 + Math.random() * 900)}`,
      slug: (b.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900),
      title: b.title || 'Untitled Property',
      location: b.location || 'Lagos, Nigeria',
      type: b.type || 'Terrace duplex',
      category: b.category || 'terrace-duplex',
      price: Number(b.price) || 0,
      status: b.status || 'Available',
      completionStatus: b.completionStatus || 'Completed',
      titleDocument: b.titleDocument || 'Governor’s Consent',
      description: b.description || '',
      image_url: b.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      image_key: null,
      verified: b.verified !== undefined ? Number(b.verified) : 1,
      featured: !!b.featured,
      features: Array.isArray(b.features) ? b.features : (b.features ? String(b.features).split('\n').filter(Boolean) : []),
      createdAt: new Date().toISOString(),
    };

    const existingIdx = db.properties.findIndex((p) => p.id === newProp.id);
    if (existingIdx !== -1) {
      db.properties[existingIdx] = { ...db.properties[existingIdx], ...newProp };
    } else {
      db.properties.unshift(newProp);
    }
    saveDB(db);
    broadcastRealtime('property_added', newProp);
    res.status(201).json(newProp);
  });

  app.put('/api/properties/:id', (req: Request, res: Response) => {
    const index = db.properties.findIndex((p) => p.id === req.params.id || p.slug === req.params.id);
    const b = req.body || {};

    if (index === -1) {
      const created: StoredProperty = {
        id: req.params.id,
        reference: b.reference || `MIR-${Math.floor(100 + Math.random() * 900)}`,
        slug: (b.title || req.params.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: b.title || 'Untitled Property',
        location: b.location || 'Lagos, Nigeria',
        type: b.type || 'Terrace duplex',
        category: b.category || 'terrace-duplex',
        price: Number(b.price) || 0,
        status: b.status || 'Available',
        completionStatus: b.completionStatus || 'Completed',
        titleDocument: b.titleDocument || 'Governor’s Consent',
        description: b.description || '',
        image_url: b.image_url || '',
        image_key: null,
        verified: b.verified !== undefined ? Number(b.verified) : 1,
        featured: !!b.featured,
        features: Array.isArray(b.features) ? b.features : [],
        createdAt: new Date().toISOString(),
      };
      db.properties.unshift(created);
      saveDB(db);
      broadcastRealtime('property_updated', created);
      return res.json(created);
    }

    const current = db.properties[index];
    const updated: StoredProperty = {
      ...current,
      title: b.title !== undefined ? b.title : current.title,
      reference: b.reference !== undefined ? b.reference : current.reference,
      location: b.location !== undefined ? b.location : current.location,
      type: b.type !== undefined ? b.type : current.type,
      category: b.category !== undefined ? b.category : current.category,
      price: b.price !== undefined ? Number(b.price) : current.price,
      status: b.status !== undefined ? b.status : current.status,
      completionStatus: b.completionStatus !== undefined ? b.completionStatus : current.completionStatus,
      titleDocument: b.titleDocument !== undefined ? b.titleDocument : current.titleDocument,
      description: b.description !== undefined ? b.description : current.description,
      image_url: b.image_url !== undefined ? b.image_url : current.image_url,
      verified: b.verified !== undefined ? Number(b.verified) : current.verified,
      featured: b.featured !== undefined ? !!b.featured : current.featured,
      features: Array.isArray(b.features) ? b.features : (b.features ? String(b.features).split('\n').filter(Boolean) : current.features),
    };

    db.properties[index] = updated;
    saveDB(db);
    broadcastRealtime('property_updated', updated);
    res.json(updated);
  });

  app.delete('/api/properties/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const initialLen = db.properties.length;
    db.properties = db.properties.filter((p) => p.id !== id && p.slug !== id);
    if (db.properties.length !== initialLen) {
      saveDB(db);
      broadcastRealtime('property_deleted', { id });
    }
    res.json({ success: true, id });
  });

  // 2. WEBSITE SETTINGS CMS API
  app.get('/api/website-settings', (_req: Request, res: Response) => {
    res.json(db.settings);
  });

  app.put('/api/website-settings', (req: Request, res: Response) => {
    db.settings = {
      ...db.settings,
      ...req.body,
    };
    saveDB(db);
    broadcastRealtime('settings_updated', db.settings);
    res.json(db.settings);
  });

  // 3. REAL-TIME CHAT API
  app.get('/api/chat/admin', (_req: Request, res: Response) => {
    res.json({
      conversations: db.conversations,
      messages: db.messages,
    });
  });

  // Visitor chat lookup by token query
  app.get('/api/chat', (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token) return res.json({ conversation: null, messages: [] });
    const conv = db.conversations.find((c) => c.visitorToken === token || c.id === token);
    if (!conv) return res.json({ conversation: null, messages: [] });
    const msgs = db.messages.filter((m) => m.conversationId === conv.id);
    res.json({ conversation: conv, messages: msgs });
  });

  // Enquiries & Appointments handlers
  app.get('/api/enquiries', (_req: Request, res: Response) => {
    res.json(db.enquiries || []);
  });

  app.post('/api/enquiries', (req: Request, res: Response) => {
    const b = req.body || {};
    const entry: StoredEnquiry = {
      id: b.id || 'enq-' + Date.now(),
      kind: b.kind === 'Viewing' ? 'Viewing' : 'Enquiry',
      title: b.title || 'MIRVAI',
      summary: b.summary || '',
      location: b.location,
      timeline: b.timeline,
      propertyType: b.propertyType,
      budget: b.budget,
      clientName: b.clientName,
      clientContact: b.clientContact,
      basedIn: b.basedIn,
      notes: b.notes,
      reviewed: false,
      createdAt: new Date().toISOString(),
    };
    db.enquiries = [entry, ...(db.enquiries || [])].slice(0, 100);
    saveDB(db);
    broadcastRealtime('enquiry_added', entry);
    res.status(201).json({ success: true, enquiry: entry, message: 'Enquiry received by Mirvai Desk' });
  });

  app.patch('/api/enquiries/:id', (req: Request, res: Response) => {
    const list = db.enquiries || [];
    const target = list.find((item) => item.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'Enquiry not found' });
    target.reviewed = req.body?.reviewed !== undefined ? Boolean(req.body.reviewed) : true;
    saveDB(db);
    broadcastRealtime('enquiry_updated', target);
    res.json({ success: true, enquiry: target });
  });

  app.post('/api/appointments', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Appointment reserved' });
  });

  app.get('/api/appointments', (_req: Request, res: Response) => {
    res.json({ bookedTimes: ['11:00'] });
  });

  // Visitor sends message
  app.post('/api/chat', (req: Request, res: Response) => {
    const { token, name, contact, message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message body required' });

    let conv = db.conversations.find((c) => c.visitorToken === token);
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!conv) {
      conv = {
        id: 'conv-' + Date.now(),
        visitorToken: token || ('visitor-' + Date.now()),
        name: name || 'Guest Visitor',
        contact: contact || 'Not provided',
        status: 'active',
        unreadByAdmin: 1,
        unreadByVisitor: 0,
        lastMessage: message.trim(),
        updatedAt: now.toISOString(),
        createdAt: now.toISOString(),
      };
      db.conversations.unshift(conv);
    } else {
      if (name && name !== 'Guest Visitor') conv.name = name;
      if (contact && contact !== 'Not provided') conv.contact = contact;
      conv.lastMessage = message.trim();
      conv.updatedAt = now.toISOString();
      conv.unreadByAdmin = (conv.unreadByAdmin || 0) + 1;
      // move to top
      db.conversations = [conv, ...db.conversations.filter((c) => c.id !== conv!.id)];
    }

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      conversationId: conv.id,
      sender: 'visitor',
      senderName: conv.name,
      body: message.trim(),
      createdAt: now.toISOString(),
      timeString,
    };

    db.messages.push(newMsg);
    saveDB(db);

    broadcastRealtime('chat_message', {
      conversation: conv,
      message: newMsg,
    });

    res.status(201).json({ success: true, conversation: conv, message: newMsg });
  });

  // Admin replies to visitor
  app.post('/api/chat/admin/reply', (req: Request, res: Response) => {
    const { conversationId, body, adminName = 'Senior Advisor (Mirvai)' } = req.body;
    if (!body || !body.trim()) return res.status(400).json({ error: 'Message body required' });

    const conv = db.conversations.find((c) => c.id === conversationId);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    conv.lastMessage = body.trim();
    conv.updatedAt = now.toISOString();
    conv.unreadByVisitor = (conv.unreadByVisitor || 0) + 1;
    conv.unreadByAdmin = 0; // admin has reviewed

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      conversationId: conv.id,
      sender: 'admin',
      senderName: adminName,
      body: body.trim(),
      createdAt: now.toISOString(),
      timeString,
    };

    db.messages.push(newMsg);
    saveDB(db);

    broadcastRealtime('chat_message', {
      conversation: conv,
      message: newMsg,
    });

    res.status(201).json({ success: true, conversation: conv, message: newMsg });
  });

  // Admin marks read
  app.post('/api/chat/admin/read', (req: Request, res: Response) => {
    const { conversationId } = req.body;
    const conv = db.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.unreadByAdmin = 0;
      saveDB(db);
      broadcastRealtime('chat_read', { conversationId });
    }
    res.json({ ok: true });
  });

  // Simple Analytics
  app.post('/api/analytics', (req: Request, res: Response) => {
    try {
      db.analytics.push({
        event: req.body.event || 'page_view',
        path: req.body.path || '/',
        sessionId: req.body.sessionId || 'anonymous',
        timestamp: new Date().toISOString(),
      });
      if (db.analytics.length > 1000) db.analytics = db.analytics.slice(-1000);
      saveDB(db);
    } catch {}
    res.json({ ok: true });
  });

  app.get('/api/analytics', (_req: Request, res: Response) => {
    const totals = [
      { event: 'page_view', total: db.analytics.filter((a) => a.event === 'page_view').length, unique_sessions: new Set(db.analytics.map((a) => a.sessionId)).size },
      { event: 'whatsapp_click', total: db.analytics.filter((a) => a.event === 'whatsapp_click').length, unique_sessions: 0 },
      { event: 'chat_sent', total: db.messages.filter((m) => m.sender === 'visitor').length, unique_sessions: db.conversations.length },
    ];
    res.json({ totals, count: db.analytics.length });
  });

  // Image Upload handler (Base64 data URL persistence)
  app.post('/api/upload', (req: Request, res: Response) => {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) return res.status(400).json({ error: 'No data URL provided' });
    res.json({ success: true, url: dataUrl });
  });

  const distDir = path.join(__dirname, 'dist');
  const distIndex = path.join(distDir, 'index.html');
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(distIndex);

  if (isProd) {
    app.use(express.static(distDir, { index: 'index.html' }));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(distIndex);
    });
  } else {
    // Mount Vite development middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mirvai Fullstack Engine] Running live on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
