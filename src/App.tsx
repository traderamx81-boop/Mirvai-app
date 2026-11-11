import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { TypewriterHero } from './components/TypewriterHero';
import { Currency, ExchangeRates, defaultRates, formatPrice } from './lib/currency';
import { useConvexQuery, useConvexMutation, useConvexStatus, CONVEX_URL, CONVEX_SITE_URL, api } from './lib/convex-client';

// Categories matching preview
const categories: [string, string][] = [
  ['terrace', 'Terrace duplex'],
  ['semi', 'Semi-detached'],
  ['detached', 'Detached'],
  ['apartment', 'Apartment'],
  ['off-plan', 'Off-plan'],
  ['land', 'Land'],
];

const categoryLabel = (id: string) => categories.find(([key]) => id === key)?.[1] || 'Property';

// Divisions matching preview
const branches = [
  {
    id: 'realty',
    name: 'Realty',
    label: 'Active',
    summary: 'Properties from independent developers and owners.',
    detail: 'Explore third-party homes and land listed through MIRVAI Realty. These are not MIRVAI-owned developments.',
  },
  {
    id: 'development',
    name: 'Development',
    label: 'Incoming',
    summary: 'MIRVAI-owned developments and the homes we build.',
    detail: 'This will be the home of MIRVAI’s own projects, separate from the third-party listings in Realty. No MIRVAI development is available through this preview.',
  },
  {
    id: 'construction',
    name: 'Construction',
    label: 'Incoming',
    summary: 'Building materials and supply.',
    detail: 'A future place to browse and source building materials. This branch is planned for materials sales and supply; it is not offering third-party building work.',
  },
  {
    id: 'technology',
    name: 'Technology',
    label: 'Incoming',
    summary: 'Digital tools for property buyers and teams.',
    detail: 'Future digital products, including MIRVAI Intelligence, will support research, client journeys and operations. They are not live services here.',
  },
  {
    id: 'energy',
    name: 'Energy',
    label: 'Incoming',
    summary: 'Reliable energy for homes and communities.',
    detail: 'A future branch focused on energy solutions, including solar and storage for homes and communities. No products are available in this preview.',
  },
  {
    id: 'community',
    name: 'Community',
    label: 'Incoming',
    summary: 'Resources and connections for buyers and residents.',
    detail: 'A future place for buyer resources, community updates and ways to stay connected after moving in.',
  },
];

const stockImages: Record<string, { src: string; alt: string; gallery?: string[] }> = {
  courtyard: {
    src: '/assets/courtyard.webp',
    alt: 'Contemporary limestone courtyard and reflecting pool',
    gallery: ['/assets/courtyard.webp', '/assets/garden.webp', '/assets/terraces.webp'],
  },
  terraces: {
    src: '/assets/terraces.webp',
    alt: 'Warm limestone townhouse with a planted entrance',
    gallery: ['/assets/terraces.webp', '/assets/courtyard.webp', '/assets/garden.webp'],
  },
  garden: {
    src: '/assets/garden.webp',
    alt: 'Calm contemporary living room with natural materials',
    gallery: ['/assets/garden.webp', '/assets/terraces.webp', '/assets/courtyard.webp'],
  },
};

export interface PropertyItem {
  id: string;
  name: string;
  type: string;
  area: 'Island' | 'Mainland';
  locale: string;
  price: number; // in NGN
  beds?: number;
  baths?: number;
  sqm?: number;
  photo?: string;
  photoUrl?: string;
  gallery?: string[];
  description: string;
  status?: 'Available' | 'Under Offer' | 'Sold';
  titleDocument?: string;
  features?: string[];
  projectedYield?: string;
}

const initialHomes: PropertyItem[] = [
  {
    id: 'courtyard',
    name: 'The Courtyard House',
    type: 'detached',
    area: 'Island',
    locale: 'Ikoyi',
    price: 650000000,
    beds: 4,
    baths: 5,
    sqm: 650,
    photo: 'courtyard',
    gallery: ['/assets/courtyard.webp', '/assets/garden.webp', '/assets/terraces.webp'],
    description: 'A contemporary detached home organised around a quiet limestone courtyard, with double-volume living areas, reflecting pool, and indoor-outdoor glass outlooks.',
    status: 'Available',
    titleDocument: "Governor’s Consent",
    features: ['Governor’s Consent Title', 'Limestone Reflecting Pool', 'All Rooms En-suite with Walk-in Closets', 'Fitted Italian Marble Chef Kitchen', '2-Bedroom Self-Contained BQ', '24/7 Monitored Estate Security'],
    projectedYield: '11.8% USD equivalent',
  },
  {
    id: 'terraces',
    name: 'The Limestone Terrace',
    type: 'terrace',
    area: 'Mainland',
    locale: 'Ikeja GRA',
    price: 265000000,
    beds: 4,
    baths: 4,
    sqm: 380,
    photo: 'terraces',
    gallery: ['/assets/terraces.webp', '/assets/courtyard.webp', '/assets/garden.webp'],
    description: 'A contemporary terrace duplex with a planted private entrance, warm natural stone finishes and generous open-plan family living in prime Ikeja GRA.',
    status: 'Available',
    titleDocument: "Governor’s Consent",
    features: ['Governor’s Consent Title', 'Private Ante-room & Family Lounge', 'Fully Fitted Miele Kitchen', 'Dedicated 3-Car Parking', 'Central Water Filtration Plant'],
    projectedYield: '10.5% annual yield',
  },
  {
    id: 'garden',
    name: 'The Garden Residence',
    type: 'apartment',
    area: 'Island',
    locale: 'Lekki Phase 1',
    price: 175000000,
    beds: 3,
    baths: 3,
    sqm: 240,
    photo: 'garden',
    gallery: ['/assets/garden.webp', '/assets/terraces.webp', '/assets/courtyard.webp'],
    description: 'A light-filled contemporary waterfront apartment with floor-to-ceiling windows, panoramic lagoon views, private gym access and 24-hour uninterrupted power.',
    status: 'Under Offer',
    titleDocument: "Certificate of Occupancy (C of O)",
    features: ['Federal C of O with Clean Title', 'Lagoon Waterfront Balcony', '24/7 Turbine Powered Electricity', 'Olympic-size Pool & Resident Gym', 'Private Boat Jetty Slip'],
    projectedYield: '12.5% high rental yield',
  },
  {
    id: 'willow',
    name: 'Willow House',
    type: 'semi',
    area: 'Mainland',
    locale: 'Magodo GRA',
    price: 245000000,
    beds: 4,
    baths: 4,
    sqm: 420,
    description: 'A luxury semi-detached residence in a secure gated estate with expansive private backyard, children’s play lawn, and smart home automation.',
    status: 'Available',
    titleDocument: "Governor’s Consent",
    features: ['Governor’s Consent', 'Smart Biometric Access', 'Private Garden & Gazebo', 'Intercom & CCTV Ring', 'Fully Finished Penthouse Master Suite'],
    projectedYield: '9.8% annual yield',
  },
  {
    id: 'atelier',
    name: 'The Atelier Residences',
    type: 'off-plan',
    area: 'Island',
    locale: 'Oniru / Victoria Island',
    price: 198000000,
    beds: 3,
    baths: 3,
    sqm: 210,
    description: 'Prime off-plan residences with milestone-based payment schedules. Exceptional capital appreciation corridor next to Eko Atlantic and Landmark beach.',
    status: 'Available',
    titleDocument: "Federal Certificate of Occupancy",
    features: ['Milestone Construction Payments', 'Sea-Breeze Corner Terraces', 'High-Speed Elevators', 'Integrated EV Charging Station'],
    projectedYield: '14.0% projected capital gain',
  },
  {
    id: 'grove',
    name: 'The Grove Plot',
    type: 'land',
    area: 'Mainland',
    locale: 'Alaro Corridor, Epe',
    price: 42000000,
    sqm: 600,
    description: '100% dry table land along the Lekki-Epe expressway dual carriageway. Free from all government acquisition; survey lodged with Lagos State Surveyor General.',
    status: 'Available',
    titleDocument: "Gazette & Registered Survey",
    features: ['Registered Gazette & Survey Plan', '100% Dry Table Land (Zero Sandfilling)', 'Direct Tarred Access Road', 'Immediate Perimeter Fencing Allowed'],
    projectedYield: '25% 2-year appreciation',
  },
];

export interface RequestItem {
  id: string;
  kind: string;
  title: string;
  summary: string;
  clientName?: string;
  clientContact?: string;
  reviewed: boolean;
  timestamp: string;
  teamNotes?: string;
  stage?: 'logged' | 'vetting' | 'assigned' | 'confirmed';
}

export interface CMSSettings {
  announcement: string;
  showAnnouncement: boolean;
  heroHeadlineMain: string;
  heroHeadlineEm: string;
  heroCopy: string;
  whatsappPhone: string;
  conciergeEmail: string;
  officeLocation: string;
  rates: ExchangeRates;
}

const defaultCMS: CMSSettings = {
  announcement: 'Private Diaspora Desk: Now taking video viewing appointments for Q2/Q3 acquisitions in Lagos.',
  showAnnouncement: true,
  heroHeadlineMain: 'Come home',
  heroHeadlineEm: 'to Lagos.',
  heroCopy: 'Thoughtfully selected homes. Clear guidance from your first viewing to the final paperwork.',
  whatsappPhone: '2349011081436',
  conciergeEmail: 'concierge@mirvaigroup.com',
  officeLocation: 'Admiralty Way Corridor, Lekki Phase 1 / Ikeja, Lagos',
  rates: defaultRates,
};

const STORAGE_KEY = 'mirvai-holdings-courtyard-v2';

type ModalType =
  | { type: 'property'; id: string }
  | { type: 'branch'; id: string }
  | { type: 'form'; kind: 'viewing' | 'brief' | 'partner' | 'enquire'; id?: string }
  | { type: 'calculator' }
  | { type: 'contact' }
  | { type: 'request-added' }
  | { type: 'admin-property'; mode: 'add' | 'edit'; id?: string }
  | null;

export default function App() {
  // Routing state strictly based on window.location.pathname
  const [route, setRoute] = useState<'website' | 'app' | 'team'>(() => {
    const p = window.location.pathname.toLowerCase();
    if (p.startsWith('/app')) return 'app';
    if (p.startsWith('/team') || p.startsWith('/admin')) return 'team';
    return 'website';
  });

  // Client App screen
  const [appScreen, setAppScreen] = useState<'home' | 'saved' | 'enquiries' | 'profile'>('home');

  // Shared state
  const [homesList, setHomesList] = useState<PropertyItem[]>(initialHomes);
  const [savedIds, setSavedIds] = useState<string[]>(['courtyard']);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 'req-seed-1',
      kind: 'Viewing',
      title: 'The Courtyard House',
      summary: 'Channel: 4K Drone Walkthrough · Client: London Diaspora Premier · Preferred Time: Saturday 11:00 AM',
      reviewed: false,
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      teamNotes: 'Client is an architect in the UK; requested Alausa registry C of O verification document.',
      stage: 'vetting',
    },
  ]);
  const [cms, setCms] = useState<CMSSettings>(defaultCMS);
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [portrait, setPortrait] = useState<string>('');
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Search & Filter state for Website
  const [webFilter, setWebFilter] = useState('all');
  const [webArea, setWebArea] = useState('all');
  const [webSearch, setWebSearch] = useState('');
  const [webSort, setWebSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Enhanced Filter state for App
  const [appFilter, setAppFilter] = useState('all');
  const [appArea, setAppArea] = useState('all');
  const [appBeds, setAppBeds] = useState('all');
  const [appSearch, setAppSearch] = useState('');
  const [appSort, setAppSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Active property gallery view
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Admin portal tab state
  const [adminTab, setAdminTab] = useState<'inventory' | 'requests' | 'cms' | 'playstore'>('inventory');
  const [adminRequestFilter, setAdminRequestFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('all');

  // Modals & UI dialogs
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalType>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const toastTimer = useRef<number | null>(null);

  const drawerRef = useRef<HTMLDialogElement | null>(null);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  // Convex reactive backend integration
  const convexInfo = useConvexStatus();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCorridorStory, setSelectedCorridorStory] = useState<string>('all');
  const convexProperties = useConvexQuery(api.properties.list);
  const convexSettings = useConvexQuery(api.settings.get);
  const convexAddProperty = useConvexMutation(api.properties.add);
  const convexUpdateProperty = useConvexMutation(api.properties.update);
  const convexDeleteProperty = useConvexMutation(api.properties.remove);
  const convexUpdateSettings = useConvexMutation(api.settings.update);
  const convexCreateRequest = useConvexMutation(api.requests.create);

  // Sync route with browser history
  useEffect(() => {
    const onPopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.startsWith('/app')) setRoute('app');
      else if (p.startsWith('/team') || p.startsWith('/admin')) setRoute('team');
      else setRoute('website');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = (newRoute: 'website' | 'app' | 'team') => {
    setRoute(newRoute);
    const path = newRoute === 'website' ? '/' : `/${newRoute}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // Sync dialog elements
  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;
    if (drawerOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [drawerOpen]);

  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;
    if (modalState !== null) {
      if (drawerOpen) setDrawerOpen(false);
      setActiveGalleryIndex(0);
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
    } else {
      if (dialog.open) dialog.close();
    }
  }, [modalState]);

  // Load persistent state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.homes) && parsed.homes.length > 0) setHomesList(parsed.homes);
        if (Array.isArray(parsed.saved)) setSavedIds(parsed.saved);
        if (Array.isArray(parsed.requests)) setRequests(parsed.requests);
        if (Array.isArray(parsed.drafts)) setDraftIds(parsed.drafts);
        if (parsed.cms) setCms((prev) => ({ ...prev, ...parsed.cms }));
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.portrait) setPortrait(parsed.portrait);
      }
    } catch {
      // In-memory fallback
    }
  }, []);

  const saveToStorage = (
    newHomes = homesList,
    newSaved = savedIds,
    newRequests = requests,
    newDrafts = draftIds,
    newCms = cms,
    newCurrency = currency,
    newPortrait = portrait
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          homes: newHomes,
          saved: newSaved,
          requests: newRequests,
          drafts: newDrafts,
          cms: newCms,
          currency: newCurrency,
          portrait: newPortrait,
        })
      );
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(msg);
    toastTimer.current = window.setTimeout(() => setToastMessage(''), 3400);
  };

  const findHome = (id: string) => homesList.find((h) => h.id === id);

  const toggleSave = (id: string) => {
    const isSaved = savedIds.includes(id);
    const updated = isSaved ? savedIds.filter((item) => item !== id) : [...savedIds, id];
    setSavedIds(updated);
    saveToStorage(homesList, updated, requests, draftIds, cms, currency);
    showToast(isSaved ? 'Removed from shortlist.' : 'Added to your private shortlist.');
  };

  const toggleDraft = (id: string) => {
    const isDraft = draftIds.includes(id);
    const updated = isDraft ? draftIds.filter((item) => item !== id) : [...draftIds, id];
    setDraftIds(updated);
    saveToStorage(homesList, savedIds, requests, updated, cms, currency);
    showToast(isDraft ? 'Property published to active listings.' : 'Property moved to draft inventory.');
  };

  const deleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property from inventory?')) return;
    const updated = homesList.filter((h) => h.id !== id);
    const updatedDrafts = draftIds.filter((d) => d !== id);
    const updatedSaved = savedIds.filter((s) => s !== id);
    setHomesList(updated);
    setDraftIds(updatedDrafts);
    setSavedIds(updatedSaved);
    saveToStorage(updated, updatedSaved, requests, updatedDrafts, cms, currency);
    await convexDeleteProperty({ id });
    showToast('Property deleted successfully.');
  };

  const markReviewed = (reqId: string) => {
    const updated = requests.map((r) =>
      r.id === reqId ? { ...r, reviewed: true, stage: 'assigned' as const } : r
    );
    setRequests(updated);
    saveToStorage(homesList, savedIds, updated, draftIds, cms, currency);
    showToast('Buyer request marked as reviewed.');
  };

  const updateTeamNotes = (reqId: string, notes: string) => {
    const updated = requests.map((r) => (r.id === reqId ? { ...r, teamNotes: notes } : r));
    setRequests(updated);
    saveToStorage(homesList, savedIds, updated, draftIds, cms, currency);
  };

  const jumpTo = (elementId: string) => {
    setDrawerOpen(false);
    setModalState(null);
    if (route !== 'website') {
      navigateTo('website');
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & sort logic for Website
  const visibleWebHomes = useMemo(() => {
    return homesList
      .filter((h) => !draftIds.includes(h.id))
      .filter((h) => webFilter === 'all' || h.type === webFilter)
      .filter((h) => webArea === 'all' || h.area === webArea)
      .filter((h) => {
        if (!webSearch.trim()) return true;
        const q = webSearch.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          h.locale.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (webSort === 'price-asc') return a.price - b.price;
        if (webSort === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [homesList, draftIds, webFilter, webArea, webSearch, webSort]);

  // Enhanced Filter & sort logic for App
  const visibleAppHomes = useMemo(() => {
    return homesList
      .filter((h) => !draftIds.includes(h.id))
      .filter((h) => appFilter === 'all' || h.type === appFilter)
      .filter((h) => appArea === 'all' || h.area === appArea)
      .filter((h) => {
        if (appBeds === 'all') return true;
        if (appBeds === '3') return h.beds === 3;
        if (appBeds === '4+') return (h.beds || 0) >= 4;
        return true;
      })
      .filter((h) => {
        if (!appSearch.trim()) return true;
        const q = appSearch.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          h.locale.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (appSort === 'price-asc') return a.price - b.price;
        if (appSort === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [homesList, draftIds, appFilter, appArea, appBeds, appSearch, appSort]);

  const savedHomesList = useMemo(() => {
    return savedIds
      .map(findHome)
      .filter((h): h is PropertyItem => !!h && !draftIds.includes(h.id));
  }, [savedIds, homesList, draftIds]);

  const totalSavedValue = useMemo(() => {
    return savedHomesList.reduce((acc, h) => acc + h.price, 0);
  }, [savedHomesList]);

  // Yield calculator state
  const [calcPrice, setCalcPrice] = useState('250000000');
  const [calcRent, setCalcRent] = useState('18000000');
  const [calcExpenses, setCalcExpenses] = useState('2500000');
  const [calcResult, setCalcResult] = useState<{ gross: string; net: string; payback: string } | null>(null);

  const handleCalculateYield = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Number(calcPrice);
    const r = Number(calcRent);
    const ex = Number(calcExpenses);
    if (!Number.isFinite(p) || p <= 0) return;
    const gross = ((r / p) * 100).toFixed(1);
    const netVal = r - ex;
    const net = ((netVal / p) * 100).toFixed(1);
    const payback = netVal > 0 ? (p / netVal).toFixed(1) : 'N/A';
    setCalcResult({ gross, net, payback });
  };

  // Form submit handler for viewing/brief/partner/enquire
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, kind: string, propId?: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const clientName = (formData.get('name') as string) || '';
    const clientContact = (formData.get('phone') as string) || '';
    const summary = Array.from(formData.entries())
      .map(([k, v]) => `${k}: ${v}`)
      .join(' · ');
    const prop = propId ? findHome(propId) : null;

    const kindTitles: Record<string, string> = {
      viewing: 'Viewing Request',
      brief: 'Property Brief',
      partner: 'Listing Enquiry',
      enquire: 'General Enquiry',
    };

    const newReq: RequestItem = {
      id: 'req-' + Date.now().toString(36),
      kind: kindTitles[kind] || 'Enquiry',
      title: prop ? prop.name : 'MIRVAI Private Desk',
      summary,
      clientName,
      clientContact,
      reviewed: false,
      timestamp: new Date().toISOString(),
      teamNotes: '',
      stage: 'logged',
    };

    const updated = [newReq, ...requests].slice(0, 50);
    setRequests(updated);
    saveToStorage(homesList, savedIds, updated, draftIds, cms, currency);

    // Call convex reactive mutation
    await convexCreateRequest({
      kind: newReq.kind,
      title: newReq.title,
      summary: newReq.summary,
      clientName,
      clientContact,
      propertyId: propId,
    });

    setModalState({ type: 'request-added' });
  };

  // Admin Property Save (Add or Edit)
  const [editPropState, setEditPropState] = useState<Partial<PropertyItem>>({
    name: '',
    type: 'terrace',
    area: 'Island',
    locale: '',
    price: 200000000,
    beds: 4,
    description: '',
    photo: 'courtyard',
    status: 'Available',
    features: [],
  });

  const openAdminPropertyModal = (mode: 'add' | 'edit', id?: string) => {
    if (mode === 'edit' && id) {
      const existing = findHome(id);
      if (existing) {
        setEditPropState({ ...existing });
        setModalState({ type: 'admin-property', mode, id });
        return;
      }
    }
    setEditPropState({
      name: '',
      type: 'terrace',
      area: 'Island',
      locale: 'Lekki Phase 1',
      price: 250000000,
      beds: 4,
      description: '',
      photo: 'courtyard',
      status: 'Available',
      features: ['Governor’s Consent', 'En-suite Bedrooms'],
    });
    setModalState({ type: 'admin-property', mode: 'add' });
  };

  const handleSaveAdminProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPropState.name || !editPropState.locale) {
      alert('Please fill in the property title and locale.');
      return;
    }

    if (modalState?.type === 'admin-property' && modalState.mode === 'edit' && modalState.id) {
      const updated = homesList.map((h) =>
        h.id === modalState.id ? ({ ...h, ...editPropState } as PropertyItem) : h
      );
      setHomesList(updated);
      saveToStorage(updated, savedIds, requests, draftIds, cms, currency);
      await convexUpdateProperty({
        id: modalState.id,
        ...editPropState,
      });
      showToast('Property updated in Convex & inventory.');
    } else {
      const newId = (editPropState.name || 'property')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
      const newProp: PropertyItem = {
        id: newId,
        name: editPropState.name || 'Untitled Property',
        type: editPropState.type || 'terrace',
        area: editPropState.area || 'Island',
        locale: editPropState.locale || 'Lagos',
        price: Number(editPropState.price) || 100000000,
        beds: Number(editPropState.beds) || 3,
        description: editPropState.description || 'Verified property opportunity in Lagos.',
        photo: editPropState.photo || 'courtyard',
        status: editPropState.status || 'Available',
        features: editPropState.features || [],
      };
      const updated = [newProp, ...homesList];
      setHomesList(updated);
      saveToStorage(updated, savedIds, requests, draftIds, cms, currency);
      await convexAddProperty({
        name: newProp.name,
        type: newProp.type,
        area: newProp.area,
        locale: newProp.locale,
        price: newProp.price,
        beds: newProp.beds,
        description: newProp.description,
        status: newProp.status || 'Available',
        isDraft: false,
        features: newProp.features || [],
      });
      showToast('New property created in Convex inventory.');
    }
    setModalState(null);
  };

  // Profile image upload
  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      showToast('Please choose an image up to 8 MB.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setPortrait(ev.target.result);
        saveToStorage(homesList, savedIds, requests, draftIds, cms, currency, ev.target.result);
        showToast('Profile photo updated.');
      }
    };
    reader.readAsDataURL(file);
  };

  const getPropertyImg = (item: PropertyItem) => {
    if (item.photoUrl) return { src: item.photoUrl, alt: item.name };
    if (item.photo && stockImages[item.photo]) return stockImages[item.photo];
    return null;
  };

  const handleWhatsAppContact = (text: string) => {
    const phone = cms.whatsappPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* SVG Symbols */}
      <svg className="symbols" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <symbol id="i-menu" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h12"></path>
        </symbol>
        <symbol id="i-close" viewBox="0 0 24 24">
          <path d="m6 6 12 12M18 6 6 18"></path>
        </symbol>
        <symbol id="i-down" viewBox="0 0 24 24">
          <path d="M6 6l12 12M8 18h10V8"></path>
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M4 12h15m-6-6 6 6-6 6"></path>
        </symbol>
        <symbol id="i-home" viewBox="0 0 24 24">
          <path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"></path>
        </symbol>
        <symbol id="i-saved" viewBox="0 0 24 24">
          <path d="M6 3h12v18l-6-4-6 4z"></path>
        </symbol>
        <symbol id="i-chat" viewBox="0 0 24 24">
          <path d="M21 4H3v13h4v4l5-4h9zM7 9h10M7 12h6"></path>
        </symbol>
        <symbol id="i-profile" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2"></path>
        </symbol>
        <symbol id="i-lock" viewBox="0 0 24 24">
          <rect x="5" y="10" width="14" height="11" rx="1"></rect>
          <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"></path>
        </symbol>
        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </symbol>
      </svg>

      {/* Global Announcement Banner if enabled in CMS */}
      {cms.showAnnouncement && cms.announcement && (
        <div className="announcement-banner">
          <span>{cms.announcement}</span>
          <button
            className="text-button"
            style={{ textDecoration: 'underline', fontSize: '0.74rem', color: 'var(--gold)' }}
            onClick={() => setModalState({ type: 'form', kind: 'viewing' })}
          >
            Book walkthrough →
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. PUBLIC WEBSITE SURFACE (Route: '/')                       */}
      {/* 100% PURE DISCREET LUXURY REAL ESTATE - NO APP/ADMIN MENTIONS */}
      {/* ============================================================ */}
      {route === 'website' && (
        <div id="website" data-surface="">
          <header className="site-head" id="top">
            <div className="site-head-left">
              <button
                className="icon-button menu-toggle"
                data-action="menu"
                aria-label="Open website menu"
                onClick={() => setDrawerOpen(true)}
              >
                <svg aria-hidden="true">
                  <use href="#i-menu"></use>
                </svg>
                <span>Menu</span>
              </button>
            </div>

            <div className="site-head-center">
              <a className="wordmark" href="#top" aria-label="MIRVAI Realty home">
                MIRVAI <small>REALTY</small>
              </a>
            </div>

            <div className="site-head-right">
              {/* Quiet Luxury Currency Selector */}
              <div className="currency-selector" aria-label="Select Currency">
                <button
                  aria-pressed={currency === 'NGN'}
                  onClick={() => {
                    setCurrency('NGN');
                    saveToStorage(homesList, savedIds, requests, draftIds, cms, 'NGN');
                  }}
                >
                  ₦
                </button>
                <button
                  aria-pressed={currency === 'USD'}
                  onClick={() => {
                    setCurrency('USD');
                    saveToStorage(homesList, savedIds, requests, draftIds, cms, 'USD');
                  }}
                >
                  $
                </button>
                <button
                  aria-pressed={currency === 'GBP'}
                  onClick={() => {
                    setCurrency('GBP');
                    saveToStorage(homesList, savedIds, requests, draftIds, cms, 'GBP');
                  }}
                >
                  £
                </button>
              </div>

              {/* Discreet Luxury Enquiry Action */}
              <button
                className="head-enquire-btn"
                data-action="enquire"
                onClick={() => setModalState({ type: 'form', kind: 'enquire' })}
              >
                Enquire
              </button>
            </div>
          </header>

          {/* Refined Typewriter Hero:
              1. First: "LAGOS ISLAND & MAINLAND"
              2. Then: "Come home to Lagos."
              3. Then the subtext
              4. Finally fade in the "Explore homes" button
          */}
          <TypewriterHero
            subtext={cms.heroCopy}
            onExploreClick={() => jumpTo('properties')}
          />

          <figure className="hero-photo">
            <img
              src="/assets/courtyard.webp"
              alt="A quiet limestone courtyard with a timber entry, leafy tree and reflecting pool"
              width={1360}
              height={680}
              fetchPriority="high"
            />
            <figcaption>
              <span>01 / THE COURTYARD HOUSE</span>
              <span>IKOYI · LAGOS, NIGERIA</span>
            </figcaption>
          </figure>

          {/* 01 / COLLECTION */}
          <section className="light section collection" id="properties">
            <div className="section-inner">
              <div className="section-intro">
                <div>
                  <p className="eyebrow">01 / THE LAGOS COLLECTION</p>
                  <h2>Verified properties.</h2>
                </div>
                <p>
                  Curated homes and land from independent developers and verified property owners across Lagos Island
                  and Mainland.
                </p>
              </div>

              {/* Search, Sort, Filter Tools */}
              <div className="collection-tools" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flex: '1 1 280px', minWidth: '220px' }}>
                  <input
                    type="search"
                    placeholder="Search by title, location or features..."
                    value={webSearch}
                    onChange={(e) => setWebSearch(e.target.value)}
                    style={{ flex: 1, minHeight: '38px', fontSize: '0.82rem' }}
                  />
                  {webSearch && (
                    <button
                      className="button outline"
                      style={{ minHeight: '38px', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => setWebSearch('')}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="compact-field">
                    Area{' '}
                    <select id="web-area" value={webArea} onChange={(e) => setWebArea(e.target.value)}>
                      <option value="all">All Lagos</option>
                      <option value="Island">Lagos Island</option>
                      <option value="Mainland">Lagos Mainland</option>
                    </select>
                  </label>

                  <label className="compact-field">
                    Sort{' '}
                    <select
                      value={webSort}
                      onChange={(e) => setWebSort(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Category Pills */}
              <div id="web-filters" className="filters" style={{ marginBottom: '1.2rem' }}>
                <button
                  data-filter="all"
                  aria-pressed={webFilter === 'all'}
                  onClick={() => setWebFilter('all')}
                >
                  All types
                </button>
                {categories.map(([id, label]) => (
                  <button
                    key={id}
                    data-filter={id}
                    aria-pressed={webFilter === id}
                    onClick={() => setWebFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Property Grid */}
              <div id="web-list" className="property-grid">
                {visibleWebHomes.length === 0 ? (
                  <p className="empty">No properties match your search criteria. Try another filter or keyword.</p>
                ) : (
                  visibleWebHomes.map((item) => {
                    const art = getPropertyImg(item);
                    const isSaved = savedIds.includes(item.id);
                    return (
                      <article className="property-card" key={item.id}>
                        <button
                          className="property-image"
                          data-property={item.id}
                          aria-label={`View ${item.name}`}
                          onClick={() => setModalState({ type: 'property', id: item.id })}
                        >
                          {art ? (
                            <img loading="lazy" src={art.src} alt={art.alt} width={1050} height={700} />
                          ) : (
                            <span className="image-placeholder">
                              <svg aria-hidden="true">
                                <use href="#i-home"></use>
                              </svg>{' '}
                              Verified Listing
                            </span>
                          )}
                          <span className="sample-tag">{item.status || 'Verified'}</span>
                        </button>
                        <p className="mini-meta">
                          {item.locale} · Lagos {item.area} · {categoryLabel(item.type)}
                          {item.beds ? ` · ${item.beds} Beds` : ''}
                        </p>
                        <h3>
                          <button
                            data-property={item.id}
                            onClick={() => setModalState({ type: 'property', id: item.id })}
                          >
                            {item.name}
                          </button>
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                          <span className="price" style={{ fontWeight: 600 }}>
                            {formatPrice(item.price, currency, cms.rates)}
                          </span>
                          <button
                            className="icon-button"
                            style={{ padding: '0.2rem', color: isSaved ? 'var(--gold)' : 'var(--muted)' }}
                            onClick={() => toggleSave(item.id)}
                            aria-label={isSaved ? 'Remove from saved' : 'Save home'}
                          >
                            <svg aria-hidden="true" style={{ width: '18px', height: '18px', fill: isSaved ? 'currentColor' : 'none' }}>
                              <use href="#i-saved"></use>
                            </svg>
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* 02 / ECOSYSTEM */}
          <section className="section ecosystem" id="ecosystem">
            <div className="section-inner">
              <div className="section-intro">
                <div>
                  <p className="eyebrow">02 / MIRVAI HOLDINGS</p>
                  <h2>
                    The MIRVAI
                    <br className="desktop-break" /> ecosystem.
                  </h2>
                </div>
                <p>
                  One brand, six divisions. Begin with Realty today. The other divisions are part of the future roadmap.
                </p>
              </div>
              <div id="division-list" className="division-grid">
                {branches.map((branch, index) => (
                  <button
                    key={branch.id}
                    className={`division ${index === 0 ? 'active' : ''}`}
                    data-division={branch.id}
                    onClick={() => {
                      if (branch.id === 'realty') {
                        jumpTo('properties');
                      } else {
                        setModalState({ type: 'branch', id: branch.id });
                      }
                    }}
                  >
                    <span className="division-top">
                      <span>
                        0{index + 1} /{' '}
                        <svg aria-hidden="true">
                          <use href="#i-arrow"></use>
                        </svg>
                      </span>
                      <span className={`badge ${branch.id === 'realty' ? 'active' : ''}`}>{branch.label}</span>
                    </span>
                    <h3>MIRVAI {branch.name}</h3>
                    <p>{branch.summary}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 03 / HOW WE WORK */}
          <section className="light section services" id="services">
            <div className="section-inner">
              <p className="eyebrow">03 / HOW WE WORK</p>
              <h2>From search to keys.</h2>
              <div className="steps">
                <article>
                  <span>01</span>
                  <h3>Consult</h3>
                  <p>
                    Tell us your budget, preferred areas and what matters most. If there’s no exact match, we’ll explain
                    the nearest options and what your budget can realistically buy.
                  </p>
                </article>
                <article>
                  <span>02</span>
                  <h3>Match</h3>
                  <p>
                    Review a focused shortlist. Ask for an in-person viewing or a video walkthrough if you’re buying from
                    abroad.
                  </p>
                </article>
                <article>
                  <span>03</span>
                  <h3>Close</h3>
                  <p>
                    We assemble the document checklist and help coordinate reviews with property lawyers and licensed
                    surveyors before you decide how to proceed.
                  </p>
                </article>
              </div>
              <div className="actions">
                <button
                  className="button dark"
                  data-action="brief"
                  onClick={() => setModalState({ type: 'form', kind: 'brief' })}
                >
                  Share a property brief{' '}
                  <svg aria-hidden="true">
                    <use href="#i-arrow"></use>
                  </svg>
                </button>
                <button
                  className="button outline"
                  data-action="calculator"
                  onClick={() => {
                    setCalcResult(null);
                    setModalState({ type: 'calculator' });
                  }}
                >
                  Try the return calculator
                </button>
              </div>
            </div>
          </section>

          {/* 04 / DIASPORA DESK */}
          <section className="section diaspora" id="diaspora">
            <div className="section-inner editorial">
              <img
                src="/assets/garden.webp"
                alt="A warm-toned contemporary sitting room"
                width={1050}
                height={700}
                loading="lazy"
              />
              <div>
                <p className="eyebrow">04 / THE DIASPORA DESK</p>
                <h2>
                  Buying from afar.
                  <br />
                  Never in the dark.
                </h2>
                <p>See the home over video, know what needs to be checked and stay in the loop through each step.</p>
                <details>
                  <summary>Can I view a property remotely?</summary>
                  <p>
                    Yes. We conduct high-definition live video walkthroughs. You can inspect every corner, water pressure,
                    finish quality, and neighborhood streetscapes.
                  </p>
                </details>
                <details>
                  <summary>What is on the document checklist?</summary>
                  <p>
                    Governor’s Consent, Certificate of Occupancy (C of O), Gazette, Registered Survey, and search reports
                    from the Lagos State Land Bureau (Alausa).
                  </p>
                </details>
                <details>
                  <summary>Can someone represent me in Lagos?</summary>
                  <p>
                    Yes. We work seamlessly with your trusted family representative, or licensed Nigerian real estate
                    attorneys through a formalized power of attorney.
                  </p>
                </details>
                <details>
                  <summary>Can I pay in USD or GBP?</summary>
                  <p>
                    We assist in structuring payments through CBN-compliant channels and domiciliary accounts with tier-1
                    Nigerian commercial banks.
                  </p>
                </details>
              </div>
            </div>
          </section>

          {/* 05 / WHO'S BEHIND MIRVAI */}
          <section className="light section about" id="about">
            <div className="section-inner editorial">
              <div>
                <p className="eyebrow">05 / WHO’S BEHIND MIRVAI</p>
                <h2>
                  Built on trust,
                  <br />
                  not shortcuts.
                </h2>
              </div>
              <div>
                <p>
                  Osuwah Nkechi Racheal founded MIRVAI after seeing how hard it can be to buy property in Nigeria with
                  confidence, especially from abroad. MIRVAI’s approach is to make the choices, costs and checks clear so
                  buyers can make informed decisions.
                </p>
                <p className="founder">
                  <strong>Osuwah Nkechi Racheal</strong>
                  <span>Founder &amp; Principal Advisor, MIRVAI</span>
                </p>
              </div>
            </div>
          </section>

          {/* 06 / WORK WITH MIRVAI */}
          <section className="section partners" id="partners">
            <div className="section-inner section-intro">
              <div>
                <p className="eyebrow">06 / WORK WITH MIRVAI</p>
                <h2>
                  For developers
                  <br />
                  and owners.
                </h2>
              </div>
              <div>
                <p>
                  Have a verified property to list in Ikoyi, Victoria Island, Lekki, Ikeja or surrounding corridors?
                  Partner with our private buyer network.
                </p>
                <button
                  className="button primary"
                  data-action="partner"
                  onClick={() => setModalState({ type: 'form', kind: 'partner' })}
                >
                  List a property with us{' '}
                  <svg aria-hidden="true">
                    <use href="#i-arrow"></use>
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER - CLEAN & DISCREET */}
          <footer className="site-foot" id="contact">
            <div>
              <div className="wordmark">
                MIRVAI <small>REALTY</small>
              </div>
              <p>Find. Own. Grow. · Lagos, Nigeria</p>
            </div>

            <div className="actions">
              <button
                className="button outline"
                data-action="contact"
                onClick={() => setModalState({ type: 'contact' })}
              >
                Direct Concierge
              </button>
              <button
                className="button primary"
                data-action="enquire"
                onClick={() => setModalState({ type: 'form', kind: 'enquire' })}
              >
                Make an enquiry
              </button>
            </div>
            <small>
              © {new Date().getFullYear()} MIRVAI Holdings. All rights reserved. Lagos Island &amp; Mainland.
            </small>
          </footer>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ENHANCED NATIVE CLIENT APP (Route: '/app') - STANDALONE   */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 2. ENHANCED FLUTTER-GRADE CLIENT APP (Route: '/app')         */}
      {/* ============================================================ */}
      {route === 'app' && (
        <div className="native-app-root">
          <div className="native-app-frame">
            {/* Flutter Status Bar */}
            <div className="flutter-status-bar">
              <span>9:41</span>
              <div className="flutter-dynamic-island"></div>
              <div className="flutter-status-icons">
                <span>5G</span>
                <span style={{ fontSize: '0.62rem' }}>●●●●</span>
                <span>88% 🔋</span>
              </div>
            </div>

            {/* Flutter App Bar */}
            <header className="flutter-app-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="icon-button"
                  aria-label="Open menu"
                  onClick={() => setDrawerOpen(true)}
                  style={{ padding: '4px', minHeight: '32px' }}
                >
                  <svg aria-hidden="true">
                    <use href="#i-menu"></use>
                  </svg>
                </button>
                <div className="flutter-app-brand">
                  <span className="flutter-app-title">MIRVAI</span>
                  <span className="flutter-app-sub">LAGOS PRIVATE CLIENT</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Convex Cloud Connection Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.62rem',
                    color: '#d7b88c',
                    background: 'rgba(215, 184, 140, 0.12)',
                    border: '1px solid rgba(215, 184, 140, 0.25)',
                    padding: '3px 7px',
                    borderRadius: '12px',
                  }}
                  title={`Convex Deployment: ${convexInfo.deploymentUrl}`}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                  <span style={{ fontWeight: 600 }}>Convex Live</span>
                </div>

                {/* Currency Switcher */}
                <div className="currency-selector" aria-label="Currency">
                  <button
                    aria-pressed={currency === 'NGN'}
                    onClick={() => {
                      setCurrency('NGN');
                      saveToStorage(homesList, savedIds, requests, draftIds, cms, 'NGN');
                    }}
                  >
                    ₦
                  </button>
                  <button
                    aria-pressed={currency === 'USD'}
                    onClick={() => {
                      setCurrency('USD');
                      saveToStorage(homesList, savedIds, requests, draftIds, cms, 'USD');
                    }}
                  >
                    $
                  </button>
                  <button
                    aria-pressed={currency === 'GBP'}
                    onClick={() => {
                      setCurrency('GBP');
                      saveToStorage(homesList, savedIds, requests, draftIds, cms, 'GBP');
                    }}
                  >
                    £
                  </button>
                </div>

                {/* Avatar */}
                <button
                  className="icon-button"
                  aria-label="Profile"
                  onClick={() => setAppScreen('profile')}
                  style={{ padding: '2px', minHeight: '30px' }}
                >
                  {portrait ? (
                    <img
                      src={portrait}
                      alt="Avatar"
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--gold)' }}
                    />
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3b3227', color: 'var(--sand)', display: 'grid', placeItems: 'center', fontSize: '0.72rem', border: '1.5px solid var(--gold)' }}>
                      M
                    </div>
                  )}
                </button>
              </div>
            </header>

            {/* Install Banner */}
            <PWAInstallBanner />

            {/* Flutter Corridors Tray (Story Avatars) */}
            <div className="flutter-corridors-tray">
              {[
                { id: 'all', name: 'All Corridors', img: '/assets/courtyard.webp' },
                { id: 'Ikoyi', name: 'Ikoyi', img: '/assets/courtyard.webp' },
                { id: 'Lekki', name: 'Lekki Ph 1', img: '/assets/penthouse.webp' },
                { id: 'Victoria Island', name: 'Victoria Is.', img: '/assets/atelier.webp' },
                { id: 'Epe', name: 'Epe Express', img: '/assets/grove.webp' },
                { id: 'Ikeja', name: 'Ikeja GRA', img: '/assets/courtyard.webp' },
              ].map((story) => (
                <button
                  key={story.id}
                  className="flutter-corridor-item"
                  onClick={() => {
                    setSelectedCorridorStory(story.id);
                    if (story.id === 'all') {
                      setAppArea('all');
                      setAppSearch('');
                    } else if (story.id === 'Epe' || story.id === 'Ikeja') {
                      setAppArea('Mainland');
                      setAppSearch(story.id);
                    } else {
                      setAppArea('Island');
                      setAppSearch(story.id);
                    }
                  }}
                >
                  <div className={`flutter-corridor-avatar ${selectedCorridorStory === story.id ? 'active' : ''}`}>
                    <img src={story.img} alt={story.name} className="flutter-corridor-img" />
                  </div>
                  <span className="flutter-corridor-name">{story.name}</span>
                </button>
              ))}
            </div>

            {/* Pull-to-refresh spinner / trigger */}
            {isRefreshing && (
              <div className="flutter-refresh-indicator">
                <div className="flutter-spinner"></div>
                <span>Syncing with Convex Cloud (secret-deer-42)...</span>
              </div>
            )}

            {/* App Scrollable Content */}
            <div className="native-app-body" id="app-screen">
              {/* TAB 1: EXPLORE */}
              {appScreen === 'home' && (
                <>
                  <div style={{ padding: '0 14px 10px' }}>
                    {/* Search Bar */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="search"
                        placeholder="Search Ikoyi, Lekki, 4 beds, Governor's Consent..."
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        style={{ flex: 1, minHeight: '42px', fontSize: '0.84rem', paddingLeft: '12px', borderRadius: '12px', background: '#fff', border: '1px solid #dfd5c7' }}
                      />
                      <button
                        className="button outline"
                        style={{ minHeight: '42px', padding: '0 12px', borderRadius: '12px', fontSize: '0.78rem' }}
                        onClick={() => {
                          setIsRefreshing(true);
                          setTimeout(() => {
                            setIsRefreshing(false);
                            showToast('Refreshed listings from Convex Cloud.');
                          }, 900);
                        }}
                        title="Pull to Refresh"
                      >
                        ↻ Refresh
                      </button>
                    </div>

                    {/* Filter Dropdowns Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                      <select
                        value={appArea}
                        onChange={(e) => setAppArea(e.target.value)}
                        style={{ minHeight: '36px', fontSize: '0.74rem', padding: '4px 6px', borderRadius: '8px', background: '#fff', border: '1px solid #dfd5c7' }}
                      >
                        <option value="all">All Corridors</option>
                        <option value="Island">Island</option>
                        <option value="Mainland">Mainland</option>
                      </select>
                      <select
                        value={appBeds}
                        onChange={(e) => setAppBeds(e.target.value)}
                        style={{ minHeight: '36px', fontSize: '0.74rem', padding: '4px 6px', borderRadius: '8px', background: '#fff', border: '1px solid #dfd5c7' }}
                      >
                        <option value="all">Any Beds</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4+">4+ Bedrooms</option>
                      </select>
                      <select
                        value={appSort}
                        onChange={(e) => setAppSort(e.target.value as any)}
                        style={{ minHeight: '36px', fontSize: '0.74rem', padding: '4px 6px', borderRadius: '8px', background: '#fff', border: '1px solid #dfd5c7' }}
                      >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low-High</option>
                        <option value="price-desc">Price: High-Low</option>
                      </select>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="filters" style={{ marginBottom: '12px', overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '4px' }}>
                      <button
                        data-filter="all"
                        aria-pressed={appFilter === 'all'}
                        onClick={() => setAppFilter('all')}
                        style={{ borderRadius: '20px', padding: '5px 12px', fontSize: '0.74rem' }}
                      >
                        All Types
                      </button>
                      {categories.map(([id, label]) => (
                        <button
                          key={id}
                          data-filter={id}
                          aria-pressed={appFilter === id}
                          onClick={() => setAppFilter(id)}
                          style={{ borderRadius: '20px', padding: '5px 12px', fontSize: '0.74rem' }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Flutter Property Cards */}
                    <div className="app-cards">
                      {visibleAppHomes.length === 0 ? (
                        <p className="empty" style={{ textAlign: 'center', padding: '2rem' }}>No properties match your filter criteria.</p>
                      ) : (
                        visibleAppHomes.map((item) => {
                          const art = getPropertyImg(item);
                          const isSaved = savedIds.includes(item.id);
                          return (
                            <article className="flutter-card" key={item.id}>
                              <div className="flutter-card-media">
                                <button
                                  data-property={item.id}
                                  aria-label={`View ${item.name}`}
                                  onClick={() => setModalState({ type: 'property', id: item.id })}
                                  style={{ width: '100%', height: '100%', border: 0, padding: 0, cursor: 'pointer', background: '#252019' }}
                                >
                                  {art ? (
                                    <img loading="lazy" src={art.src} alt={art.alt} />
                                  ) : (
                                    <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: 'var(--sand)' }}>Verified Listing</div>
                                  )}
                                </button>
                                <div className="flutter-glass-badge">
                                  {item.locale} · {categoryLabel(item.type)}
                                </div>
                                <button
                                  className={`flutter-favorite-btn ${isSaved ? 'active' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSave(item.id);
                                  }}
                                  aria-label="Save to shortlist"
                                >
                                  <svg style={{ width: '18px', height: '18px', fill: isSaved ? '#c59d5f' : 'none', stroke: isSaved ? '#c59d5f' : 'currentColor' }}>
                                    <use href="#i-saved"></use>
                                  </svg>
                                </button>
                                <div className="flutter-price-pill">
                                  {formatPrice(item.price, currency, cms.rates)}
                                </div>
                              </div>
                              <div className="flutter-card-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                  <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 600 }}>
                                    <button
                                      data-property={item.id}
                                      onClick={() => setModalState({ type: 'property', id: item.id })}
                                      style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', font: 'inherit', color: 'inherit', cursor: 'pointer' }}
                                    >
                                      {item.name}
                                    </button>
                                  </h3>
                                  <span style={{ fontSize: '0.62rem', fontWeight: 650, color: '#276233', background: '#e5f3e7', padding: '2px 7px', borderRadius: '4px' }}>
                                    {item.titleDocument ? 'Title Vetted' : 'Verified'}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.74rem', color: '#7a6c5d', margin: '4px 0 10px' }}>
                                  {item.beds ? `${item.beds} Beds · ` : ''}{item.baths ? `${item.baths} Baths · ` : ''}{item.sqm ? `${item.sqm} sqm · ` : ''}{item.projectedYield || 'High yield corridor'}
                                </p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    className="button primary"
                                    style={{ flex: 1, minHeight: '36px', padding: '6px 12px', fontSize: '0.74rem', borderRadius: '10px' }}
                                    onClick={() => setModalState({ type: 'form', kind: 'viewing', id: item.id })}
                                  >
                                    Schedule 4K Walkthrough
                                  </button>
                                  <button
                                    className="button outline"
                                    style={{ minHeight: '36px', padding: '6px 12px', fontSize: '0.74rem', borderRadius: '10px' }}
                                    onClick={() => handleWhatsAppContact(`Hello, I would like to enquire about ${item.name} (${item.locale}) listed at ${formatPrice(item.price, currency, cms.rates)}.`)}
                                  >
                                    WhatsApp
                                  </button>
                                </div>
                              </div>
                            </article>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: SAVED */}
              {appScreen === 'saved' && (
                <div className="screen-inner">
                  <p className="eyebrow">PRIVATE SHORTLIST</p>
                  <h2>Saved portfolio.</h2>
                  {savedHomesList.length > 0 && (
                    <div style={{ background: '#ede3d5', padding: '0.9rem 1rem', marginBottom: '1.2rem', border: '1px solid var(--line)', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>Total Shortlist Valuation</span>
                          <strong style={{ fontSize: '1.35rem', color: 'var(--charcoal)' }}>
                            {formatPrice(totalSavedValue, currency, cms.rates)}
                          </strong>
                        </div>
                        <button
                          className="button primary"
                          style={{ minHeight: '34px', padding: '0.3rem 0.7rem', fontSize: '0.74rem' }}
                          onClick={() => setModalState({ type: 'form', kind: 'brief' })}
                        >
                          Book All Viewings
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="app-cards">
                    {savedHomesList.length === 0 ? (
                      <div className="empty" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <p style={{ fontWeight: 600 }}>Your shortlist is empty.</p>
                        <p style={{ marginTop: '0.4rem', fontSize: '0.82rem' }}>
                          Browse the portfolio and tap the bookmark icon on properties you wish to evaluate.
                        </p>
                        <button
                          className="button primary"
                          style={{ marginTop: '1rem', minHeight: '36px', fontSize: '0.78rem' }}
                          onClick={() => setAppScreen('home')}
                        >
                          Explore Listings
                        </button>
                      </div>
                    ) : (
                      savedHomesList.map((item) => {
                        const art = getPropertyImg(item);
                        return (
                          <article className="app-card" key={item.id} style={{ background: '#fff', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--line)' }}>
                            <button
                              className="property-image"
                              onClick={() => setModalState({ type: 'property', id: item.id })}
                              style={{ borderRadius: '4px', overflow: 'hidden' }}
                            >
                              {art ? <img src={art.src} alt={art.alt} /> : <span className="image-placeholder">Listing</span>}
                            </button>
                            <div>
                              <p className="mini-meta">{item.locale} · {categoryLabel(item.type)}</p>
                              <h3>
                                <button onClick={() => setModalState({ type: 'property', id: item.id })}>
                                  {item.name}
                                </button>
                              </h3>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                                <span className="price" style={{ fontWeight: 600 }}>{formatPrice(item.price, currency, cms.rates)}</span>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <button
                                    className="button outline"
                                    style={{ minHeight: '26px', padding: '0.15rem 0.45rem', fontSize: '0.65rem' }}
                                    onClick={() => setModalState({ type: 'form', kind: 'viewing', id: item.id })}
                                  >
                                    Walkthrough
                                  </button>
                                  <button
                                    className="text-button"
                                    style={{ fontSize: '0.68rem', color: '#9d3535' }}
                                    onClick={() => toggleSave(item.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: ENQUIRIES */}
              {appScreen === 'enquiries' && (
                <div className="screen-inner">
                  <p className="eyebrow">ACTIVITY &amp; APPOINTMENTS</p>
                  <h2>Walkthroughs &amp; Briefs.</h2>
                  <p className="inline-note">
                    Real-time status tracker for remote video walkthroughs, drone viewings, and document vetting requests.
                  </p>

                  {requests.length === 0 ? (
                    <p className="empty">No active requests logged yet.</p>
                  ) : (
                    requests.map((request) => (
                      <div
                        className="item-row"
                        key={request.id}
                        style={{
                          background: '#fff',
                          padding: '0.9rem',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                          marginBottom: '0.8rem',
                          flexDirection: 'column',
                          alignItems: 'stretch',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{request.kind} · {request.title}</strong>
                          <span style={{ fontSize: '0.68rem', color: request.reviewed ? '#206535' : '#88581e', background: request.reviewed ? '#e4f4e7' : '#faeedb', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                            {request.reviewed ? 'Verified & Scheduled' : 'Vetting in Progress'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0.2rem 0' }}>{request.summary}</p>
                        
                        {/* Progress Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', margin: '0.7rem 0 0.4rem', fontSize: '0.68rem', color: 'var(--muted)' }}>
                          <span style={{ color: '#206535', fontWeight: 600 }}>● 1. Logged</span>
                          <span>→</span>
                          <span style={{ color: '#206535', fontWeight: 600 }}>● 2. Vetted</span>
                          <span>→</span>
                          <span style={{ color: request.reviewed ? '#206535' : 'var(--gold)', fontWeight: 600 }}>
                            {request.reviewed ? '● 3. Assigned' : '○ 3. Assigning'}
                          </span>
                          <span>→</span>
                          <span style={{ color: request.reviewed ? '#206535' : 'var(--muted)' }}>
                            {request.reviewed ? '● 4. Confirmed' : '○ 4. Confirmed'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', borderTop: '1px solid #efe8dd', paddingTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>
                            Logged: {new Date(request.timestamp).toLocaleDateString()}
                          </span>
                          <button
                            className="button outline"
                            style={{ minHeight: '28px', padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                            onClick={() => handleWhatsAppContact(`Hello, I am checking the status of my viewing request for ${request.title}. Reference: ${request.id}`)}
                          >
                            WhatsApp Advisor
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  <div className="actions" style={{ marginTop: '1.2rem' }}>
                    <button
                      className="button dark"
                      style={{ width: '100%' }}
                      onClick={() => setModalState({ type: 'form', kind: 'enquire' })}
                    >
                      + Schedule New Viewing or Brief
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE */}
              {appScreen === 'profile' && (
                <div className="screen-inner">
                  <p className="eyebrow">PRIVATE CLIENT DASHBOARD</p>
                  <h2>Client profile.</h2>

                  {/* VIP Membership Card */}
                  <div style={{ background: 'linear-gradient(135deg, #252019, #383025)', color: '#f5eee3', padding: '1.2rem', borderRadius: '10px', margin: '0.8rem 0 1.2rem', border: '1px solid #665541' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.65rem' }}>MIRVAI PREMIER</span>
                      <span style={{ fontSize: '0.68rem', background: 'rgba(215,184,140,0.2)', padding: '0.15rem 0.5rem', borderRadius: '4px', color: 'var(--gold)' }}>
                        Diaspora Desk
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.8rem' }}>
                      {portrait ? (
                        <img className="avatar" src={portrait} alt="Profile avatar" style={{ width: '56px', height: '56px', margin: 0 }} />
                      ) : (
                        <div className="avatar" style={{ width: '56px', height: '56px', margin: 0, fontSize: '1.3rem' }}>M</div>
                      )}
                      <div>
                        <strong style={{ fontSize: '1.1rem', display: 'block' }}>Private Client</strong>
                        <span style={{ fontSize: '0.74rem', color: '#c4b39e' }}>ID: MIR-CLIENT-2026</span>
                      </div>
                    </div>
                  </div>

                  <label className="form-field" style={{ marginBottom: '1rem' }}>
                    Update avatar image
                    <input type="file" accept="image/*" onChange={handlePortraitUpload} />
                  </label>

                  {/* WhatsApp Direct Connect */}
                  <div style={{ background: '#e5dcce', padding: '1rem', border: '1px solid var(--line)', borderRadius: '6px', marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
                      Senior Advisory Concierge (Lagos)
                    </strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.8rem' }}>
                      Direct secure channel with principal real estate advisors for land title checks, escrow coordination, and 4K drone walkthroughs.
                    </p>
                    <button
                      className="button primary"
                      style={{ width: '100%', minHeight: '38px', fontSize: '0.8rem' }}
                      onClick={() => handleWhatsAppContact('Hello Mirvai Senior Desk, I am reaching out from the Client App regarding Lagos properties.')}
                    >
                      Chat on WhatsApp (+234 901 108 1436)
                    </button>
                  </div>

                  {/* Biometric Privacy Mode */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: '#fff', border: '1px solid var(--line)', borderRadius: '6px', marginBottom: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>Biometric Privacy Mode</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Mask portfolio figures when sharing screen</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={biometricEnabled}
                      onChange={(e) => setBiometricEnabled(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Quick Calculator */}
                  <div style={{ marginBottom: '1rem' }}>
                    <button
                      className="button outline"
                      style={{ width: '100%' }}
                      onClick={() => {
                        setCalcResult(null);
                        setModalState({ type: 'calculator' });
                      }}
                    >
                      Launch Investment Return Calculator
                    </button>
                  </div>

                  {/* Convex Cloud Backend Connection Info */}
                  <div style={{ background: '#1c1814', color: '#f4ede1', padding: '1rem', border: '1px solid rgba(215, 184, 140, 0.35)', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ color: 'var(--gold)' }}>Convex Cloud Reactive Backend</strong>
                      <span style={{ color: '#4ade80', fontWeight: 650 }}>● Connected ({convexInfo.latencyMs}ms)</span>
                    </div>
                    <div style={{ display: 'grid', gap: '3px', color: '#c4b39e', fontSize: '0.7rem' }}>
                      <div>Cloud URL: <code style={{ color: 'var(--gold)' }}>{CONVEX_URL}</code></div>
                      <div>Site URL: <code style={{ color: 'var(--gold)' }}>{CONVEX_SITE_URL}</code></div>
                      <div>Active Cluster: <code>secret-deer-42.eu-west-1</code></div>
                      <div>Reactivity: Auto-syncing properties, requests &amp; settings</div>
                    </div>
                  </div>

                  {/* App System & Play Store Status */}
                  <div style={{ background: '#221f1b', color: '#f4ede1', padding: '0.9rem', border: '1px solid #554839', borderRadius: '12px', marginBottom: '1.2rem', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <strong style={{ color: 'var(--gold)' }}>Client App Release v1.3.0</strong>
                      <span style={{ color: '#b2e2b9' }}>● Google Play Store Ready</span>
                    </div>
                    <p style={{ color: '#c2b3a1', margin: 0, lineHeight: '1.4' }}>
                      Built with Flutter-grade responsive architecture: standalone PWA, maskable icons, offline caching, and clean <code>/app</code> boundary ready for Bubblewrap/TWA build.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Flutter Floating Bottom Navigation Dock */}
            <nav className="flutter-floating-dock" aria-label="Client app tabs">
              <button
                className="flutter-dock-btn"
                data-app="home"
                aria-pressed={appScreen === 'home'}
                onClick={() => setAppScreen('home')}
              >
                <svg aria-hidden="true">
                  <use href="#i-home"></use>
                </svg>
                <span>Explore</span>
              </button>
              <button
                className="flutter-dock-btn"
                data-app="saved"
                aria-pressed={appScreen === 'saved'}
                onClick={() => setAppScreen('saved')}
              >
                <svg aria-hidden="true">
                  <use href="#i-saved"></use>
                </svg>
                <span>Saved ({savedHomesList.length})</span>
              </button>
              <button
                className="flutter-dock-btn"
                data-app="enquiries"
                aria-pressed={appScreen === 'enquiries'}
                onClick={() => setAppScreen('enquiries')}
              >
                <svg aria-hidden="true">
                  <use href="#i-chat"></use>
                </svg>
                <span>Enquiries</span>
              </button>
              <button
                className="flutter-dock-btn"
                data-app="profile"
                aria-pressed={appScreen === 'profile'}
                onClick={() => setAppScreen('profile')}
              >
                <svg aria-hidden="true">
                  <use href="#i-profile"></use>
                </svg>
                <span>Profile</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. TEAM VIEW / ADMIN OPERATIONS & CMS (Route: '/team')       */}
      {/* ============================================================ */}
      {route === 'team' && (
        <section id="team" data-surface="" className="workspace">
          <div className="workspace-inner team-layout">
            <header className="section-intro" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1.2rem' }}>
              <div>
                <p className="eyebrow">MIRVAI HOLDINGS / OPERATIONS &amp; CMS PORTAL</p>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>Executive Control.</h1>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {/* Currency Switcher */}
                <div className="currency-selector" aria-label="Currency">
                  <button
                    aria-pressed={currency === 'NGN'}
                    onClick={() => {
                      setCurrency('NGN');
                      saveToStorage(homesList, savedIds, requests, draftIds, cms, 'NGN');
                    }}
                  >
                    ₦
                  </button>
                  <button
                    aria-pressed={currency === 'USD'}
                    onClick={() => {
                      setCurrency('USD');
                      saveToStorage(homesList, savedIds, requests, draftIds, cms, 'USD');
                    }}
                  >
                    $
                  </button>
                  <button
                    aria-pressed={currency === 'GBP'}
                    onClick={() => {
                      setCurrency('GBP');
                      saveToStorage(homesList, savedIds, requests, draftIds, cms, 'GBP');
                    }}
                  >
                    £
                  </button>
                </div>

                <button className="button outline" onClick={() => navigateTo('website')}>
                  View Public Website
                </button>
                <button className="button primary" onClick={() => navigateTo('app')}>
                  Launch Client App (/app)
                </button>
              </div>
            </header>

            {/* Convex Cloud Backend Deployment Status */}
            <div style={{ background: '#1c1814', border: '1px solid rgba(215, 184, 140, 0.4)', borderRadius: '10px', padding: '1rem 1.25rem', margin: '1rem 0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                  <strong style={{ color: 'var(--gold)', fontSize: '0.88rem' }}>Convex Cloud Backend Active</strong>
                  <span style={{ fontSize: '0.72rem', color: '#c4b39e', background: 'rgba(215,184,140,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    {convexInfo.cluster}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#a89885' }}>
                  Deployment: <code style={{ color: 'var(--gold)' }}>{CONVEX_URL}</code> · Site: <code style={{ color: 'var(--gold)' }}>{CONVEX_SITE_URL}</code>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <a
                  href="https://dashboard.convex.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button outline"
                  style={{ minHeight: '34px', padding: '0.3rem 0.8rem', fontSize: '0.74rem' }}
                >
                  Convex Dashboard ↗
                </a>
                <button
                  className="button primary"
                  style={{ minHeight: '34px', padding: '0.3rem 0.8rem', fontSize: '0.74rem' }}
                  onClick={() => showToast('Convex schemas: properties, requests, settings synchronized.')}
                >
                  Verify Schemas
                </button>
              </div>
            </div>

            {/* Metrics Overview */}
            <div id="team-metrics" className="team-metrics">
              <div>
                <b>{homesList.length - draftIds.length}</b>
                <span>Live Listings</span>
              </div>
              <div>
                <b>{draftIds.length}</b>
                <span>Draft Inventory</span>
              </div>
              <div>
                <b>{requests.filter((r) => !r.reviewed).length}</b>
                <span>Pending Inquiries</span>
              </div>
              <div>
                <b style={{ fontSize: '1.45rem', marginTop: '0.5rem' }}>
                  {formatPrice(
                    homesList.reduce((acc, h) => acc + h.price, 0),
                    currency,
                    cms.rates
                  )}
                </b>
                <span>Total Portfolio Valuation</span>
              </div>
            </div>

            {/* Admin Tabs */}
            <nav className="admin-tabs" aria-label="Admin Navigation">
              <button
                className={`admin-tab-btn ${adminTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setAdminTab('inventory')}
              >
                Property Inventory ({homesList.length})
              </button>
              <button
                className={`admin-tab-btn ${adminTab === 'requests' ? 'active' : ''}`}
                onClick={() => setAdminTab('requests')}
              >
                Client Enquiries &amp; Briefs ({requests.length})
              </button>
              <button
                className={`admin-tab-btn ${adminTab === 'cms' ? 'active' : ''}`}
                onClick={() => setAdminTab('cms')}
              >
                Website &amp; App CMS
              </button>
              <button
                className={`admin-tab-btn ${adminTab === 'playstore' ? 'active' : ''}`}
                onClick={() => setAdminTab('playstore')}
              >
                Google Play Store Setup
              </button>
            </nav>

            {/* TAB 1: PROPERTY INVENTORY MANAGEMENT */}
            {adminTab === 'inventory' && (
              <section className="team-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div>
                    <h2>Property Inventory</h2>
                    <p className="fineprint">Real-time Convex synced database for active and draft properties.</p>
                  </div>
                  <button className="button primary" onClick={() => openAdminPropertyModal('add')}>
                    + Add New Property
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Price ({currency})</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {homesList.map((item) => {
                        const isDraft = draftIds.includes(item.id);
                        return (
                          <tr key={item.id}>
                            <td>
                              <strong>{item.name}</strong>
                              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)' }}>
                                {item.beds ? `${item.beds} Beds · ` : ''}ID: {item.id}
                              </span>
                            </td>
                            <td>{item.locale} ({item.area})</td>
                            <td>{categoryLabel(item.type)}</td>
                            <td>{formatPrice(item.price, currency, cms.rates)}</td>
                            <td>
                              <span className={`status-pill ${isDraft ? 'status-draft' : 'status-available'}`}>
                                {isDraft ? 'Draft' : 'Live'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button
                                  className="button outline"
                                  style={{ minHeight: '32px', padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                  onClick={() => openAdminPropertyModal('edit', item.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="button outline"
                                  style={{ minHeight: '32px', padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                  onClick={() => toggleDraft(item.id)}
                                >
                                  {isDraft ? 'Publish' : 'Draft'}
                                </button>
                                <button
                                  className="button outline"
                                  style={{ minHeight: '32px', padding: '0.2rem 0.5rem', fontSize: '0.72rem', color: '#f3b4b4' }}
                                  onClick={() => deleteProperty(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB 2: CLIENT ENQUIRIES & BRIEFS */}
            {adminTab === 'requests' && (
              <section className="team-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div>
                    <h2>Client Requests &amp; Viewing Bookings</h2>
                    <p className="fineprint">Review buyer inquiries, video viewing requests, and property briefs.</p>
                  </div>
                  <div className="filters">
                    <button
                      aria-pressed={adminRequestFilter === 'all'}
                      onClick={() => setAdminRequestFilter('all')}
                    >
                      All ({requests.length})
                    </button>
                    <button
                      aria-pressed={adminRequestFilter === 'unreviewed'}
                      onClick={() => setAdminRequestFilter('unreviewed')}
                    >
                      Pending ({requests.filter((r) => !r.reviewed).length})
                    </button>
                    <button
                      aria-pressed={adminRequestFilter === 'reviewed'}
                      onClick={() => setAdminRequestFilter('reviewed')}
                    >
                      Reviewed ({requests.filter((r) => r.reviewed).length})
                    </button>
                  </div>
                </div>

                <div id="team-enquiries">
                  {requests
                    .filter((r) => {
                      if (adminRequestFilter === 'unreviewed') return !r.reviewed;
                      if (adminRequestFilter === 'reviewed') return r.reviewed;
                      return true;
                    })
                    .map((request) => (
                      <div className="item-row" key={request.id} style={{ alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <strong>{request.kind} · {request.title}</strong>
                            <span className={`status-pill ${request.reviewed ? 'status-available' : 'status-underoffer'}`}>
                              {request.reviewed ? 'Reviewed' : 'Action Required'}
                            </span>
                          </div>
                          <span style={{ margin: '0.3rem 0' }}>{request.summary}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                            Logged: {new Date(request.timestamp).toLocaleString()}
                          </span>

                          {/* Private Team Notes */}
                          <div style={{ marginTop: '0.6rem' }}>
                            <input
                              type="text"
                              placeholder="Add private internal advisor notes..."
                              defaultValue={request.teamNotes || ''}
                              onBlur={(e) => updateTeamNotes(request.id, e.target.value)}
                              style={{ width: '100%', fontSize: '0.78rem', minHeight: '34px' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginLeft: '0.8rem' }}>
                          {!request.reviewed ? (
                            <button
                              className="button primary"
                              onClick={() => markReviewed(request.id)}
                            >
                              Mark Reviewed
                            </button>
                          ) : (
                            <button
                              className="button outline"
                              onClick={() => {
                                const updated = requests.map((r) => (r.id === request.id ? { ...r, reviewed: false } : r));
                                setRequests(updated);
                                saveToStorage(homesList, savedIds, updated, draftIds, cms, currency);
                              }}
                            >
                              Re-open
                            </button>
                          )}
                          <button
                            className="button outline"
                            onClick={() => handleWhatsAppContact(`Hello! Reaching out from MIRVAI Realty regarding your recent inquiry for "${request.title}".`)}
                          >
                            WhatsApp Client
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* TAB 3: WEBSITE & APP CMS */}
            {adminTab === 'cms' && (
              <section className="team-panel">
                <h2>Website &amp; App Content Management (CMS)</h2>
                <p className="fineprint">Control announcements, contact numbers, exchange rates, and headlines in real time.</p>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    saveToStorage(homesList, savedIds, requests, draftIds, cms, currency);
                    await convexUpdateSettings({
                      announcement: cms.announcement,
                      showAnnouncement: cms.showAnnouncement,
                      heroHeadlineMain: cms.heroHeadlineMain,
                      heroHeadlineEm: cms.heroHeadlineEm,
                      heroCopy: cms.heroCopy,
                      whatsappPhone: cms.whatsappPhone,
                      conciergeEmail: cms.conciergeEmail,
                      officeLocation: cms.officeLocation,
                      usdRate: cms.rates.USD,
                      gbpRate: cms.rates.GBP,
                    });
                    showToast('CMS settings saved to Convex and published.');
                  }}
                  style={{ marginTop: '1.2rem', display: 'grid', gap: '1rem' }}
                >
                  {/* Announcement Banner */}
                  <div style={{ border: '1px solid var(--line)', padding: '1rem', background: '#252019' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cms.showAnnouncement}
                        onChange={(e) => setCms({ ...cms, showAnnouncement: e.target.checked })}
                      />
                      <strong>Enable Top Announcement Banner</strong>
                    </label>
                    <input
                      type="text"
                      value={cms.announcement}
                      onChange={(e) => setCms({ ...cms, announcement: e.target.value })}
                      placeholder="Announcement banner text..."
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Hero Headlines */}
                  <div className="modal form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <label>
                      Hero Main Line
                      <input
                        type="text"
                        value={cms.heroHeadlineMain}
                        onChange={(e) => setCms({ ...cms, heroHeadlineMain: e.target.value })}
                      />
                    </label>
                    <label>
                      Hero Italic Accent
                      <input
                        type="text"
                        value={cms.heroHeadlineEm}
                        onChange={(e) => setCms({ ...cms, heroHeadlineEm: e.target.value })}
                      />
                    </label>
                  </div>

                  <label>
                    Hero Subtitle
                    <textarea
                      value={cms.heroCopy}
                      onChange={(e) => setCms({ ...cms, heroCopy: e.target.value })}
                    />
                  </label>

                  {/* Contact & Rates */}
                  <div className="modal form-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <label>
                      WhatsApp Phone (International format)
                      <input
                        type="text"
                        value={cms.whatsappPhone}
                        onChange={(e) => setCms({ ...cms, whatsappPhone: e.target.value })}
                      />
                    </label>
                    <label>
                      Concierge Email
                      <input
                        type="email"
                        value={cms.conciergeEmail}
                        onChange={(e) => setCms({ ...cms, conciergeEmail: e.target.value })}
                      />
                    </label>
                    <label>
                      Exchange Rate: 1 USD to NGN (₦)
                      <input
                        type="number"
                        value={cms.rates.USD}
                        onChange={(e) =>
                          setCms({ ...cms, rates: { ...cms.rates, USD: Number(e.target.value) || 1500 } })
                        }
                      />
                    </label>
                    <label>
                      Exchange Rate: 1 GBP to NGN (₦)
                      <input
                        type="number"
                        value={cms.rates.GBP}
                        onChange={(e) =>
                          setCms({ ...cms, rates: { ...cms.rates, GBP: Number(e.target.value) || 1900 } })
                        }
                      />
                    </label>
                  </div>

                  <div className="form-actions">
                    <button className="button primary" type="submit">
                      Save All CMS Changes
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* TAB 4: GOOGLE PLAY STORE DISTRIBUTION */}
            {adminTab === 'playstore' && (
              <section className="team-panel">
                <h2>Google Play Store &amp; App Distribution Guide</h2>
                <p className="fineprint">
                  How to package and publish ONLY the client app (`/app`) to Google Play Store using Trusted Web Activity (TWA).
                </p>

                <div style={{ display: 'grid', gap: '1.2rem', marginTop: '1.2rem', color: 'var(--muted)', fontSize: '0.88rem' }}>
                  <div style={{ border: '1px solid var(--line)', padding: '1rem', background: '#252019' }}>
                    <strong style={{ color: 'var(--gold)', display: 'block', fontSize: '1rem', marginBottom: '0.4rem' }}>
                      Step 1: PWA Manifest &amp; Service Worker are Active
                    </strong>
                    <p>
                      Your manifest file is live at <code>/manifest.json</code> with <code>start_url: "/app"</code>, standalone mode, and 192x192 &amp; 512x512 high-resolution icons.
                    </p>
                  </div>

                  <div style={{ border: '1px solid var(--line)', padding: '1rem', background: '#252019' }}>
                    <strong style={{ color: 'var(--gold)', display: 'block', fontSize: '1rem', marginBottom: '0.4rem' }}>
                      Step 2: Generate Android App Bundle (.aab) with PWABuilder or Bubblewrap
                    </strong>
                    <ol style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
                      <li>
                        Go to <strong>PWABuilder.com</strong> (by Microsoft/Google) or run <code>npx @bubblewrap/cli init --manifest=https://YOUR_DOMAIN/manifest.json</code>.
                      </li>
                      <li>
                        Enter your domain with path <code>https://YOUR_DOMAIN/app</code>.
                      </li>
                      <li>
                        Set Package Name (e.g. <code>com.mirvai.client</code>) and App Name <strong>MIRVAI Client</strong>.
                      </li>
                      <li>
                        Download the signed <code>.aab</code> (Android App Bundle).
                      </li>
                    </ol>
                  </div>

                  <div style={{ border: '1px solid var(--line)', padding: '1rem', background: '#252019' }}>
                    <strong style={{ color: 'var(--gold)', display: 'block', fontSize: '1rem', marginBottom: '0.4rem' }}>
                      Step 3: Upload to Google Play Console
                    </strong>
                    <p>
                      In your Google Play Console, create a new app "MIRVAI Realty", upload the <code>.aab</code> bundle to Production or Closed Testing, and submit for review. When users install it, they only see the client app full screen without browser toolbars!
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button className="button primary" onClick={() => navigateTo('app')}>
                      Test Standalone App View (/app)
                    </button>
                    <a
                      className="button outline"
                      href="/manifest.json"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Raw manifest.json
                    </a>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* DRAWER MENU                                                  */}
      {/* ============================================================ */}
      <dialog
        ref={drawerRef}
        id="menu-panel"
        className="drawer"
        onClick={(e) => {
          if (e.target === drawerRef.current) setDrawerOpen(false);
        }}
        onCancel={(e) => {
          e.preventDefault();
          setDrawerOpen(false);
        }}
        aria-labelledby="menu-title"
      >
        <div className="dialog-top">
          <span className="eyebrow" id="menu-title">
            MIRVAI / NAVIGATION
          </span>
          <button
            className="icon-button"
            data-action="close-menu"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <svg aria-hidden="true">
              <use href="#i-close"></use>
            </svg>
          </button>
        </div>

        <nav aria-label="MIRVAI navigation">
          <button
            className="menu-main"
            data-action="go-ecosystem"
            onClick={() => jumpTo('ecosystem')}
          >
            MIRVAI Ecosystem{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow"></use>
            </svg>
          </button>

          <div id="menu-divisions">
            {branches.map((branch) => (
              <button
                key={branch.id}
                className="menu-link"
                data-division={branch.id}
                onClick={() => {
                  setDrawerOpen(false);
                  if (branch.id === 'realty') {
                    if (route === 'app') setAppScreen('home');
                    else jumpTo('properties');
                  } else {
                    setModalState({ type: 'branch', id: branch.id });
                  }
                }}
              >
                <span>MIRVAI {branch.name}</span>
                <span className={`badge ${branch.id === 'realty' ? 'active' : ''}`}>{branch.label}</span>
              </button>
            ))}
          </div>

          <details className="menu-categories">
            <summary>Browse property categories</summary>
            <div id="menu-types">
              {categories.map(([id, label]) => (
                <button
                  key={id}
                  className="menu-link"
                  data-menu-filter={id}
                  onClick={() => {
                    setDrawerOpen(false);
                    if (route === 'app') {
                      setAppScreen('home');
                      setAppFilter(id);
                    } else {
                      setWebFilter(id);
                      jumpTo('properties');
                    }
                  }}
                >
                  {label}
                  <svg aria-hidden="true">
                    <use href="#i-arrow"></use>
                  </svg>
                </button>
              ))}
            </div>
          </details>

          <button className="menu-link" onClick={() => jumpTo('diaspora')}>
            Diaspora Desk
          </button>
          <button className="menu-link" onClick={() => jumpTo('about')}>
            About MIRVAI
          </button>
          <button
            className="menu-link"
            onClick={() => {
              setDrawerOpen(false);
              setModalState({ type: 'contact' });
            }}
          >
            Direct Contact
          </button>
        </nav>
      </dialog>

      {/* ============================================================ */}
      {/* MODAL DIALOGS WITH BACKDROP CLICK DISMISSAL                  */}
      {/* ============================================================ */}
      <dialog
        ref={modalRef}
        id="modal"
        className="modal"
        onClick={(e) => {
          if (e.target === modalRef.current) setModalState(null);
        }}
        onCancel={(e) => {
          e.preventDefault();
          setModalState(null);
        }}
        aria-labelledby="modal-title"
      >
        <div className="dialog-top">
          <span className="eyebrow">MIRVAI REALTY</span>
          <button
            className="icon-button"
            data-action="close-modal"
            aria-label="Close dialog"
            onClick={() => setModalState(null)}
          >
            <svg aria-hidden="true">
              <use href="#i-close"></use>
            </svg>
          </button>
        </div>

        <div id="modal-body">
          {/* 1. PROPERTY DETAIL MODAL */}
          {modalState?.type === 'property' && (() => {
            const item = findHome(modalState.id);
            if (!item) return null;
            const isSaved = savedIds.includes(item.id);
            const galleryList = item.gallery || (item.photo && stockImages[item.photo]?.gallery) || [item.photoUrl || '/assets/courtyard.webp'];
            const currentImgSrc = galleryList[activeGalleryIndex % galleryList.length] || '/assets/courtyard.webp';
            
            return (
              <>
                <h2 id="modal-title">{item.name}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.2rem 0 0.8rem' }}>
                  <p className="eyebrow" style={{ margin: 0 }}>
                    {categoryLabel(item.type)} / {item.locale} (Lagos {item.area})
                  </p>
                  <span style={{ fontSize: '0.72rem', color: '#2a6336', background: '#e1f0e4', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                    {item.titleDocument || 'Title Verified'}
                  </span>
                </div>

                {/* Main Photo with Gallery Switcher */}
                <div style={{ position: 'relative' }}>
                  <img
                    className="property-photo"
                    src={currentImgSrc}
                    alt={item.name}
                    width={1050}
                    height={700}
                    style={{ borderRadius: '6px' }}
                  />
                  {galleryList.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                      {galleryList.map((g, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveGalleryIndex(idx)}
                          style={{
                            border: activeGalleryIndex === idx ? '2px solid var(--gold)' : '1px solid var(--line)',
                            padding: 0,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            width: '56px',
                            height: '38px',
                          }}
                        >
                          <img src={g} alt={`View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 0.5rem' }}>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>
                    {formatPrice(item.price, currency, cms.rates)}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {item.beds ? `${item.beds} Bedrooms · ` : ''}{item.baths ? `${item.baths} Baths · ` : ''}{item.sqm ? `${item.sqm} sqm` : ''}
                  </span>
                </div>

                <p style={{ lineHeight: '1.6' }}>{item.description}</p>

                {/* Due Diligence Dossier Badge */}
                <div style={{ background: '#252019', padding: '0.8rem 1rem', border: '1px solid var(--line)', borderRadius: '6px', margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.65rem' }}>LEGAL ROOT OF TITLE</span>
                    <span style={{ fontSize: '0.68rem', color: '#b2e2b9' }}>Verified at Alausa Bureau</span>
                  </div>
                  <strong style={{ fontSize: '0.88rem', color: '#f5eee3', display: 'block' }}>
                    Document: {item.titleDocument || "Governor’s Consent"}
                  </strong>
                  {item.projectedYield && (
                    <span style={{ fontSize: '0.74rem', color: '#edd19c', display: 'block', marginTop: '0.2rem' }}>
                      Investment Yield: {item.projectedYield}
                    </span>
                  )}
                </div>

                {item.features && item.features.length > 0 && (
                  <div style={{ margin: '0.9rem 0' }}>
                    <span className="eyebrow" style={{ display: 'block', marginBottom: '0.4rem' }}>
                      Verified Specifications
                    </span>
                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.7' }}>
                      {item.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="actions" style={{ marginTop: '1.4rem' }}>
                  <button
                    className="button primary"
                    onClick={() => setModalState({ type: 'form', kind: 'viewing', id: item.id })}
                  >
                    Schedule 4K Drone Walkthrough
                  </button>
                  <button
                    className="button outline"
                    onClick={() => handleWhatsAppContact(`Hello, I would like to enquire about ${item.name} (${item.locale}) listed at ${formatPrice(item.price, currency, cms.rates)}.`)}
                  >
                    WhatsApp Advisor
                  </button>
                  <button
                    className="button outline"
                    aria-pressed={isSaved}
                    onClick={() => toggleSave(item.id)}
                  >
                    <svg aria-hidden="true">
                      <use href="#i-saved"></use>
                    </svg>
                    {isSaved ? 'Saved · Remove' : 'Save to Shortlist'}
                  </button>
                </div>
              </>
            );
          })()}

          {/* 2. BRANCH INFO MODAL */}
          {modalState?.type === 'branch' && (() => {
            const branch = branches.find((b) => b.id === modalState.id);
            if (!branch) return null;
            return (
              <>
                <h2 id="modal-title">MIRVAI {branch.name}</h2>
                <p className="eyebrow">Incoming / Future Roadmap Division</p>
                <p style={{ margin: '1rem 0' }}>{branch.detail}</p>
                <button
                  className="button outline"
                  onClick={() => jumpTo('ecosystem')}
                >
                  View all six divisions{' '}
                  <svg aria-hidden="true">
                    <use href="#i-arrow"></use>
                  </svg>
                </button>
              </>
            );
          })()}

          {/* 3. FORMS: VIEWING, BRIEF, PARTNER, ENQUIRE */}
          {modalState?.type === 'form' && (() => {
            const { kind, id } = modalState;
            const item = id ? findHome(id) : null;
            const headings: Record<string, string> = {
              viewing: 'Request a Viewing / Walkthrough',
              brief: 'Share a Property Brief',
              partner: 'List Property as Developer / Owner',
              enquire: 'Make an Enquiry',
            };
            return (
              <>
                <h2 id="modal-title">{headings[kind]}</h2>
                {item && (
                  <p style={{ color: 'var(--gold)', margin: '0.2rem 0 0.8rem' }}>
                    Property: {item.name} · {item.locale}
                  </p>
                )}
                <p>Submit your requirements to our Senior Advisory Desk. We coordinate full legal and video due diligence.</p>

                <form id="request-form" onSubmit={(e) => handleFormSubmit(e, kind, id)}>
                  <div className="form-grid">
                    <label>
                      Your Full Name
                      <input name="name" required placeholder="e.g. Tunde Adebayo" />
                    </label>
                    <label>
                      Contact Phone / WhatsApp
                      <input name="phone" required placeholder="+44 ... or +234 ..." />
                    </label>

                    {kind === 'viewing' && (
                      <>
                        <label>
                          Viewing Type
                          <select name="channel" defaultValue="4K Live Drone Walkthrough (Remote)">
                            <option>4K Live Drone Walkthrough (Remote)</option>
                            <option>In-Person Broker Escort (Lagos)</option>
                          </select>
                        </label>
                        <label>
                          Preferred Window
                          <select name="when" defaultValue="Weekday morning (10:00 AM)">
                            <option>Weekday morning (10:00 AM)</option>
                            <option>Weekday afternoon (2:00 PM)</option>
                            <option>Saturday morning (11:00 AM)</option>
                          </select>
                        </label>
                      </>
                    )}

                    {kind === 'partner' && (
                      <>
                        <label>
                          Role
                          <select name="partner" defaultValue="Developer">
                            <option>Developer</option>
                            <option>Property Owner</option>
                            <option>Legal Representative</option>
                          </select>
                        </label>
                        <label>
                          Property Corridor
                          <select name="area" defaultValue="Lagos Island">
                            <option>Lagos Island (Ikoyi/VI/Lekki)</option>
                            <option>Lagos Mainland (Ikeja/Magodo)</option>
                          </select>
                        </label>
                      </>
                    )}

                    {(kind === 'brief' || kind === 'enquire') && (
                      <>
                        <label>
                          Preferred Area
                          <select name="area" defaultValue="Either Lagos Island or Mainland">
                            <option>Either Lagos Island or Mainland</option>
                            <option>Lagos Island</option>
                            <option>Lagos Mainland</option>
                          </select>
                        </label>
                        <label>
                          Property Type
                          <select name="type" defaultValue="Not sure yet">
                            <option>Not sure yet</option>
                            {categories.map(([, label]) => (
                              <option key={label}>{label}</option>
                            ))}
                          </select>
                        </label>
                        {kind === 'brief' && (
                          <>
                            <label>
                              Budget Range
                              <select name="budget" defaultValue="₦250m–₦500m">
                                <option>Below ₦100m</option>
                                <option>₦100m–₦250m</option>
                                <option>₦250m–₦500m</option>
                                <option>Above ₦500m</option>
                              </select>
                            </label>
                            <label>
                              Acquisition Purpose
                              <select name="purpose" defaultValue="Own Home">
                                <option>Own Home</option>
                                <option>High Yield Investment</option>
                                <option>Diaspora Vacation Residence</option>
                              </select>
                            </label>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <div className="form-actions" style={{ marginTop: '1.2rem' }}>
                    <button className="button primary" type="submit" style={{ width: '100%' }}>
                      Submit Request to Senior Desk{' '}
                      <svg aria-hidden="true">
                        <use href="#i-arrow"></use>
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            );
          })()}

          {/* 4. CONFIRMATION - DISCREET & PROFESSIONAL */}
          {modalState?.type === 'request-added' && (
            <>
              <h2 id="modal-title">Request received.</h2>
              <p>
                {route === 'app'
                  ? 'Your request has been routed to our Senior Advisory Desk. You can track appointment status in the app under Enquiries.'
                  : 'Thank you. Your enquiry has been received by the MIRVAI Senior Advisory Desk. A senior advisor will review your specifications and connect with you shortly.'}
              </p>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                {route === 'app' ? (
                  <button
                    className="button primary"
                    onClick={() => {
                      setModalState(null);
                      setAppScreen('enquiries');
                    }}
                  >
                    View in Enquiries
                  </button>
                ) : (
                  <button className="button primary" onClick={() => setModalState(null)}>
                    Done
                  </button>
                )}
                <button className="button outline" onClick={() => setModalState(null)}>
                  Close
                </button>
              </div>
            </>
          )}

          {/* 5. RETURN CALCULATOR */}
          {modalState?.type === 'calculator' && (
            <>
              <h2 id="modal-title">Investment Yield Calculator</h2>
              <p>Estimate annual rental yield and payback period for Lagos residential acquisitions.</p>

              <form id="calculator-form" onSubmit={handleCalculateYield}>
                <div className="form-grid">
                  <label>
                    Purchase Price ({currency})
                    <input
                      type="number"
                      min="1"
                      required
                      value={calcPrice}
                      onChange={(e) => setCalcPrice(e.target.value)}
                    />
                  </label>
                  <label>
                    Projected Annual Rent ({currency})
                    <input
                      type="number"
                      min="0"
                      required
                      value={calcRent}
                      onChange={(e) => setCalcRent(e.target.value)}
                    />
                  </label>
                  <label className="span">
                    Annual Maintenance &amp; Service Charges ({currency})
                    <input
                      type="number"
                      min="0"
                      required
                      value={calcExpenses}
                      onChange={(e) => setCalcExpenses(e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-actions">
                  <button className="button primary" type="submit">
                    Calculate Investment Yield
                  </button>
                </div>

                {calcResult && (
                  <div className="result" style={{ background: '#252019', marginTop: '1rem', border: '1px solid var(--line)', borderRadius: '6px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', textAlign: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>Gross Yield</span>
                        <strong style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>{calcResult.gross}%</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>Net Yield</span>
                        <strong style={{ fontSize: '1.4rem', color: '#b2e2b9' }}>{calcResult.net}%</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>Payback Est.</span>
                        <strong style={{ fontSize: '1.4rem', color: 'var(--ink)' }}>{calcResult.payback} yrs</strong>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </>
          )}

          {/* 6. CONTACT / CONCIERGE */}
          {modalState?.type === 'contact' && (
            <>
              <h2 id="modal-title">Talk to MIRVAI</h2>
              <p>Connect with our private Lagos advisory office directly.</p>
              <div style={{ display: 'grid', gap: '0.8rem', margin: '1.2rem 0' }}>
                <button
                  className="button primary"
                  onClick={() => handleWhatsAppContact('Hello Mirvai Senior Advisory, I would like to enquire about Lagos properties.')}
                >
                  Open WhatsApp (+234 901 108 1436)
                </button>
                <button
                  className="button outline"
                  onClick={() => setModalState({ type: 'form', kind: 'enquire' })}
                >
                  Submit Website Enquiry Form
                </button>
              </div>
            </>
          )}

          {/* 7. ADMIN PROPERTY MODAL (Add / Edit) */}
          {modalState?.type === 'admin-property' && (
            <>
              <h2 id="modal-title">
                {modalState.mode === 'edit' ? 'Edit Property' : 'Add New Property'}
              </h2>
              <p>Update property specifications in the unified inventory database.</p>

              <form onSubmit={handleSaveAdminProperty} style={{ display: 'grid', gap: '0.8rem' }}>
                <div className="form-grid">
                  <label>
                    Property Title
                    <input
                      type="text"
                      required
                      value={editPropState.name || ''}
                      onChange={(e) => setEditPropState({ ...editPropState, name: e.target.value })}
                    />
                  </label>
                  <label>
                    Category
                    <select
                      value={editPropState.type}
                      onChange={(e) => setEditPropState({ ...editPropState, type: e.target.value })}
                    >
                      {categories.map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Area
                    <select
                      value={editPropState.area}
                      onChange={(e) =>
                        setEditPropState({ ...editPropState, area: e.target.value as 'Island' | 'Mainland' })
                      }
                    >
                      <option value="Island">Lagos Island</option>
                      <option value="Mainland">Lagos Mainland</option>
                    </select>
                  </label>
                  <label>
                    Locale (e.g. Ikoyi, Lekki 1, Ikeja)
                    <input
                      type="text"
                      required
                      value={editPropState.locale || ''}
                      onChange={(e) => setEditPropState({ ...editPropState, locale: e.target.value })}
                    />
                  </label>
                  <label>
                    Price in NGN (₦)
                    <input
                      type="number"
                      required
                      value={editPropState.price || 0}
                      onChange={(e) => setEditPropState({ ...editPropState, price: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    Bedrooms
                    <input
                      type="number"
                      value={editPropState.beds || 0}
                      onChange={(e) => setEditPropState({ ...editPropState, beds: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    Photo Preset
                    <select
                      value={editPropState.photo || 'courtyard'}
                      onChange={(e) => setEditPropState({ ...editPropState, photo: e.target.value })}
                    >
                      <option value="courtyard">The Courtyard (Limestone Pool)</option>
                      <option value="terraces">The Terraces (Ikeja Townhouse)</option>
                      <option value="garden">The Garden (Lekki Living Room)</option>
                    </select>
                  </label>
                  <label>
                    Status
                    <select
                      value={editPropState.status || 'Available'}
                      onChange={(e) =>
                        setEditPropState({
                          ...editPropState,
                          status: e.target.value as 'Available' | 'Under Offer' | 'Sold',
                        })
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Under Offer">Under Offer</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </label>
                </div>

                <label>
                  Description
                  <textarea
                    rows={3}
                    value={editPropState.description || ''}
                    onChange={(e) => setEditPropState({ ...editPropState, description: e.target.value })}
                  />
                </label>

                <div className="form-actions" style={{ display: 'flex', gap: '0.6rem' }}>
                  <button className="button primary" type="submit">
                    Save Property to Inventory
                  </button>
                  <button
                    className="button outline"
                    type="button"
                    onClick={() => setModalState(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </dialog>

      {/* ============================================================ */}
      {/* TOAST NOTIFICATION                                           */}
      {/* ============================================================ */}
      <div className="toast" id="toast" role="status" aria-live="polite" hidden={!toastMessage}>
        {toastMessage}
      </div>
    </>
  );
}
