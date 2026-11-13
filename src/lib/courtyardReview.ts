export type SurfaceView = 'website' | 'app' | 'team';
export type AppScreen = 'home' | 'saved' | 'enquiries' | 'profile';

export const resolveViewFromPath = (pathname: string): SurfaceView => {
  const normalized = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (normalized === '/app' || normalized.startsWith('/app/')) return 'app';
  if (normalized === '/team' || normalized === '/team-view' || normalized.startsWith('/team/')) {
    return 'team';
  }
  return 'website';
};

export const pathForView = (view: SurfaceView): string => {
  if (view === 'app') return '/app';
  if (view === 'team') return '/team';
  return '/';
};

export interface HomeListing {
  id: string;
  name: string;
  type: string;
  area: 'Island' | 'Mainland';
  locale: string;
  price: number;
  beds?: number;
  photo?: string;
  description: string;
}

export interface ReviewRequest {
  id: string;
  kind: 'Viewing' | 'Enquiry';
  title: string;
  summary: string;
  reviewed: boolean;
}

export interface ReviewState {
  saved: string[];
  requests: ReviewRequest[];
  drafts: string[];
}

export const categories: readonly [string, string][] = [
  ['terrace', 'Terrace duplex'],
  ['semi', 'Semi-detached'],
  ['detached', 'Detached'],
  ['apartment', 'Apartment'],
  ['off-plan', 'Off-plan'],
  ['land', 'Land'],
];

export const categoryLabel = (id: string): string =>
  categories.find(([key]) => id === key)?.[1] || 'Property';

export const ngn = (amount: number): string =>
  '₦' + new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(amount);

export const stockImages: Record<string, { src: string; alt: string }> = {
  courtyard: {
    src: '/assets/courtyard.webp',
    alt: 'Contemporary limestone courtyard and reflecting pool',
  },
  terraces: {
    src: '/assets/terraces.webp',
    alt: 'Warm limestone townhouse with a planted entrance',
  },
  garden: {
    src: '/assets/garden.webp',
    alt: 'Calm contemporary living room with natural materials',
  },
};

export const homes: readonly HomeListing[] = [
  {
    id: 'courtyard',
    name: 'The Courtyard House',
    type: 'detached',
    area: 'Island',
    locale: 'Ikoyi',
    price: 650000000,
    beds: 4,
    photo: 'courtyard',
    description:
      'A contemporary detached home organised around a quiet courtyard, with generous living areas and an indoor-outdoor outlook.',
  },
  {
    id: 'terraces',
    name: 'The Limestone Terrace',
    type: 'terrace',
    area: 'Mainland',
    locale: 'Ikeja',
    price: 265000000,
    beds: 4,
    photo: 'terraces',
    description:
      'A terrace duplex with a planted entrance, warm natural finishes and space for everyday family life.',
  },
  {
    id: 'garden',
    name: 'The Garden Residence',
    type: 'apartment',
    area: 'Island',
    locale: 'Lekki',
    price: 175000000,
    beds: 3,
    photo: 'garden',
    description:
      'A light-filled apartment with a welcoming living area and space to unwind.',
  },
  {
    id: 'willow',
    name: 'Willow House',
    type: 'semi',
    area: 'Mainland',
    locale: 'Magodo',
    price: 245000000,
    beds: 4,
    description:
      'A sample semi-detached home with four bedrooms and a layout suited to family living.',
  },
  {
    id: 'atelier',
    name: 'The Atelier',
    type: 'off-plan',
    area: 'Island',
    locale: 'Oniru',
    price: 198000000,
    beds: 3,
    description:
      'A sample off-plan home. In a real enquiry, ask about delivery milestones, payment terms and documentation.',
  },
  {
    id: 'grove',
    name: 'The Grove Plot',
    type: 'land',
    area: 'Mainland',
    locale: 'Ikorodu',
    price: 42000000,
    description:
      'A sample land listing. In a real enquiry, check the survey, title and permitted use before committing.',
  },
];

export const homeById = (id?: string): HomeListing | undefined =>
  homes.find((entry) => entry.id === id);

export const filterHomes = (
  categoryFilter: string,
  areaFilter: string,
  drafts: readonly string[],
  source: readonly HomeListing[] = homes
): HomeListing[] =>
  source.filter(
    (item) =>
      !drafts.includes(item.id) &&
      (categoryFilter === 'all' || item.type === categoryFilter) &&
      (areaFilter === 'all' || item.area === areaFilter)
  );

export const STORAGE_KEY = 'mirvai-courtyard-ecosystem-review-1';

export const emptyReviewState = (): ReviewState => ({
  saved: [],
  requests: [],
  drafts: [],
});

export const loadReviewState = (): ReviewState => {
  const base = emptyReviewState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.saved)) base.saved = parsed.saved;
    if (Array.isArray(parsed.requests)) base.requests = parsed.requests;
    if (Array.isArray(parsed.drafts)) base.drafts = parsed.drafts;
  } catch {
    // Fallback cleanly to empty in-memory state
  }
  return base;
};

export const saveReviewState = (state: ReviewState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // In-memory fallback
  }
};

export const toggleId = (list: readonly string[], id: string): string[] =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

export const createReviewRequest = (
  kind: 'viewing' | 'enquire',
  summary: string,
  propertyId?: string,
  id?: string
): ReviewRequest => ({
  id: id || globalThis.crypto?.randomUUID?.() || Date.now().toString(36),
  kind: kind === 'viewing' ? 'Viewing' : 'Enquiry',
  title: homeById(propertyId)?.name || 'MIRVAI',
  summary,
  reviewed: false,
});

export const markRequestAsReviewed = (
  requests: readonly ReviewRequest[],
  id: string
): ReviewRequest[] =>
  requests.map((req) => (req.id === id ? { ...req, reviewed: true } : req));
