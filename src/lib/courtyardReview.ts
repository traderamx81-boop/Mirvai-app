export type SurfaceView = 'website' | 'app' | 'team';
export type AppScreen = 'home' | 'saved' | 'enquiries' | 'profile';

export const WHATSAPP_NUMBER = '2349011081436';
export const WHATSAPP_DISPLAY = '+234 901 108 1436';

export const TIMELINE_OPTIONS = [
  'Within 1 month',
  '1 – 3 months',
  '3 – 6 months',
  '6 – 12 months',
  'Just exploring',
] as const;

export const BUDGET_OPTIONS = [
  'Flexible / Discuss',
  'Under ₦100M',
  '₦100M – ₦250M',
  '₦250M – ₦500M',
  '₦500M+',
] as const;

export const BASED_IN_OPTIONS = [
  'Nigeria',
  'United Kingdom',
  'United States / Canada',
  'Europe',
  'Other',
] as const;

export const STATUS_OPTIONS = ['Available', 'Under Offer', 'Sold'] as const;

export const LAGOS_LOCATION_SUGGESTIONS = [
  'Ikoyi',
  'Lekki Phase 1',
  'Victoria Island',
  'Oniru',
  'Banana Island',
  'Lagos Island',
  'Ikeja GRA',
  'Magodo',
  'Ikorodu',
  'Epe',
  'Lagos Mainland',
] as const;

export const resolveViewFromPath = (pathname: string, hash = ''): SurfaceView => {
  const normalizedPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const normalizedHash = hash.toLowerCase().replace(/^#/, '').replace(/\/+$/, '');
  const target = normalizedPath === '/' && normalizedHash ? normalizedHash : normalizedPath;

  if (target === '/app' || target.startsWith('/app/')) return 'app';
  if (
    target === '/team' ||
    target === '/team-view' ||
    target === '/admin' ||
    target.startsWith('/team/') ||
    target.startsWith('/admin/')
  ) {
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
  convexId?: string;
  name: string;
  type: string;
  area: 'Island' | 'Mainland';
  locale: string;
  price: number;
  beds?: number;
  status?: string;
  photo?: string;
  photoUrl?: string;
  images?: string[];
  videoUrl?: string;
  description: string;
}

export interface ReviewRequest {
  id: string;
  convexId?: string;
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
}

export interface ReviewState {
  listings: HomeListing[];
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
  willow: {
    src: '/properties/adeniyi-jones-terrace/01-exterior.jpg',
    alt: 'Contemporary gated semi-detached facade in Lagos Mainland',
  },
  atelier: {
    src: '/properties/adeniyi-jones-terrace/02-living-area.jpg',
    alt: 'Bright contemporary living room with refined architectural finishes',
  },
  grove: {
    src: '/assets/grove.jpg',
    alt: 'Sunlit cleared residential land plot framed by warm limestone boundary walls',
  },
};

export const defaultHomes: readonly HomeListing[] = [
  {
    id: 'courtyard',
    name: 'The Courtyard House',
    type: 'detached',
    area: 'Island',
    locale: 'Ikoyi',
    price: 650000000,
    beds: 4,
    status: 'Available',
    photo: 'courtyard',
    images: [
      '/assets/courtyard.webp',
      '/properties/adeniyi-jones-terrace/02-living-area.jpg',
      '/properties/adeniyi-jones-terrace/03-kitchen-view.jpg',
      '/properties/adeniyi-jones-terrace/09-bedroom.jpg',
    ],
    description:
      'A contemporary detached home organised around a quiet courtyard, with generous living areas, double-height reception, chef kitchen, and an indoor-outdoor outlook.',
  },
  {
    id: 'terraces',
    name: 'The Limestone Terrace',
    type: 'terrace',
    area: 'Mainland',
    locale: 'Ikeja',
    price: 265000000,
    beds: 4,
    status: 'Available',
    photo: 'terraces',
    images: [
      '/assets/terraces.webp',
      '/properties/adeniyi-jones-terrace/07-kitchen.jpg',
      '/properties/adeniyi-jones-terrace/08-staircase.jpg',
      '/properties/adeniyi-jones-terrace/04-bathroom.jpg',
    ],
    description:
      'A terrace duplex with a planted entrance, warm natural stone finishes, all en-suite bedrooms, and generous space for everyday family life in Ikeja.',
  },
  {
    id: 'garden',
    name: 'The Garden Residence',
    type: 'apartment',
    area: 'Island',
    locale: 'Lekki',
    price: 175000000,
    beds: 3,
    status: 'Available',
    photo: 'garden',
    images: [
      '/assets/garden.webp',
      '/properties/adeniyi-jones-terrace/05-landing.jpg',
      '/properties/adeniyi-jones-terrace/06-bathtub.jpg',
    ],
    description:
      'A light-filled three-bedroom apartment in Lekki with welcoming entertaining spaces, floor-to-ceiling openings, 24-hour power, and space to unwind.',
  },
  {
    id: 'willow',
    name: 'Willow House',
    type: 'semi',
    area: 'Mainland',
    locale: 'Magodo',
    price: 245000000,
    beds: 4,
    status: 'Available',
    photo: 'willow',
    images: [
      '/properties/adeniyi-jones-terrace/01-exterior.jpg',
      '/properties/adeniyi-jones-terrace/02-living-area.jpg',
      '/properties/adeniyi-jones-terrace/10-shower.jpg',
    ],
    description:
      'A semi-detached home in Magodo with four en-suite bedrooms, private compound parking, fitted modern kitchen, and a layout suited to family living.',
  },
  {
    id: 'atelier',
    name: 'The Atelier',
    type: 'off-plan',
    area: 'Island',
    locale: 'Oniru',
    price: 198000000,
    beds: 3,
    status: 'Available',
    photo: 'atelier',
    images: [
      '/properties/adeniyi-jones-terrace/02-living-area.jpg',
      '/properties/adeniyi-jones-terrace/03-kitchen-view.jpg',
    ],
    description:
      'A contemporary off-plan residence in Oniru with milestone payment schedules, clean architectural proportions, and direct Victoria Island access.',
  },
  {
    id: 'grove',
    name: 'The Grove Plot',
    type: 'land',
    area: 'Mainland',
    locale: 'Ikorodu',
    price: 42000000,
    status: 'Available',
    photo: 'grove',
    images: ['/assets/grove.jpg'],
    description:
      'Dry cleared residential land plot ready for verification of survey coordinates, registered title documentation, and immediate perimeter development.',
  },
];

// Alias kept for backwards compatibility
export const homes = defaultHomes;

const resolveSingleImageSource = (
  value: string | undefined,
  altFallback: string
): { src: string; alt: string } | null => {
  const clean = value?.trim();
  if (!clean) return null;
  if (stockImages[clean]) return stockImages[clean];
  if (
    clean.startsWith('/') ||
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return { src: clean, alt: altFallback };
  }
  return null;
};

export const resolveListingGallery = (
  item: Pick<HomeListing, 'name' | 'photo' | 'photoUrl' | 'images'>
): { src: string; alt: string }[] => {
  const result: { src: string; alt: string }[] = [];
  const seen = new Set<string>();

  const pushUnique = (entry: { src: string; alt: string } | null) => {
    if (!entry || seen.has(entry.src)) return;
    seen.add(entry.src);
    result.push(entry);
  };

  pushUnique(resolveSingleImageSource(item.photoUrl, item.name));

  if (Array.isArray(item.images)) {
    item.images.forEach((img, idx) => {
      pushUnique(
        resolveSingleImageSource(
          img,
          idx === 0 ? item.name : `${item.name} — view ${idx + 1}`
        )
      );
    });
  }

  if (result.length === 0) {
    pushUnique(resolveSingleImageSource(item.photo, item.name));
  }

  return result;
};

export const resolveListingImage = (
  item: Pick<HomeListing, 'name' | 'photo' | 'photoUrl' | 'images'>
): { src: string; alt: string } | null => {
  const gallery = resolveListingGallery(item);
  return gallery[0] || null;
};

export type ParsedVideo =
  | { kind: 'embed'; src: string }
  | { kind: 'video'; src: string }
  | null;

export const parseVideoEmbed = (rawUrl?: string): ParsedVideo => {
  const url = rawUrl?.trim();
  if (!url) return null;

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (ytMatch?.[1]) {
    return {
      kind: 'embed',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch?.[1]) {
    return {
      kind: 'embed',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  if (
    url.startsWith('/') ||
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:video/') ||
    url.startsWith('blob:')
  ) {
    return { kind: 'video', src: url };
  }

  return null;
};

export const homeById = (
  id?: string,
  source: readonly HomeListing[] = defaultHomes
): HomeListing | undefined => source.find((entry) => entry.id === id);

export const filterHomes = (
  categoryFilter: string,
  areaFilter: string,
  drafts: readonly string[],
  source: readonly HomeListing[] = defaultHomes,
  searchQuery = ''
): HomeListing[] => {
  const q = searchQuery.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  return source.filter((item) => {
    if (drafts.includes(item.id)) return false;
    if (categoryFilter !== 'all' && item.type !== categoryFilter) return false;
    if (areaFilter !== 'all' && item.area !== areaFilter) return false;

    if (tokens.length > 0) {
      const searchable = [
        item.locale,
        item.area,
        `Lagos ${item.area}`,
        item.name,
        categoryLabel(item.type),
        item.description,
        item.status || '',
      ]
        .join(' ')
        .toLowerCase();
      if (!tokens.every((token) => searchable.includes(token))) return false;
    }

    return true;
  });
};

export const STORAGE_KEY = 'mirvai-courtyard-ecosystem-review-2';
const LEGACY_STORAGE_KEY = 'mirvai-courtyard-ecosystem-review-1';

export const emptyReviewState = (): ReviewState => ({
  listings: defaultHomes.map((item) => ({ ...item })),
  saved: [],
  requests: [],
  drafts: [],
});

export const loadReviewState = (): ReviewState => {
  const base = emptyReviewState();
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.listings) && parsed.listings.length > 0) {
      base.listings = parsed.listings.map((item: HomeListing) => {
        if (item.images !== undefined || item.photoUrl) return item;
        const fallback = defaultHomes.find((d) => d.id === item.id);
        return fallback?.images ? { ...item, images: [...fallback.images] } : item;
      });
    }
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

export const upsertListing = (
  listings: readonly HomeListing[],
  listing: HomeListing
): HomeListing[] => {
  const exists = listings.some((item) => item.id === listing.id);
  if (exists) {
    return listings.map((item) => (item.id === listing.id ? { ...listing } : item));
  }
  return [{ ...listing }, ...listings];
};

export const removeListing = (
  listings: readonly HomeListing[],
  id: string
): HomeListing[] => listings.filter((item) => item.id !== id);

export interface EnquiryPayload {
  location?: string;
  timeline?: string;
  propertyType?: string;
  budget?: string;
  clientName?: string;
  clientContact?: string;
  basedIn?: string;
  notes?: string;
}

export const createReviewRequest = (
  kind: 'viewing' | 'enquire',
  summary: string,
  propertyId?: string,
  id?: string,
  sourceListings: readonly HomeListing[] = defaultHomes,
  extra?: EnquiryPayload
): ReviewRequest => ({
  id: id || globalThis.crypto?.randomUUID?.() || Date.now().toString(36),
  kind: kind === 'viewing' ? 'Viewing' : 'Enquiry',
  title: homeById(propertyId, sourceListings)?.name || 'MIRVAI',
  summary,
  location: extra?.location,
  timeline: extra?.timeline,
  propertyType: extra?.propertyType,
  budget: extra?.budget,
  clientName: extra?.clientName,
  clientContact: extra?.clientContact,
  basedIn: extra?.basedIn,
  notes: extra?.notes,
  reviewed: false,
});

export const markRequestAsReviewed = (
  requests: readonly ReviewRequest[],
  id: string
): ReviewRequest[] =>
  requests.map((req) => (req.id === id ? { ...req, reviewed: true } : req));

export const buildWhatsAppUrl = (opts?: {
  propertyName?: string;
  location?: string;
  propertyType?: string;
  timeline?: string;
  phone?: string;
}): string => {
  const phoneDigits = (opts?.phone || WHATSAPP_NUMBER).replace(/[^0-9]/g, '') || WHATSAPP_NUMBER;
  const parts: string[] = ['Hello Mirvai,'];
  if (opts?.propertyName) {
    parts.push(`I am interested in ${opts.propertyName}.`);
  } else {
    parts.push('I would like to make a property enquiry.');
  }
  if (opts?.location?.trim()) parts.push(`Preferred location: ${opts.location.trim()}.`);
  if (opts?.propertyType && opts.propertyType !== 'Not sure yet') {
    parts.push(`Type: ${opts.propertyType}.`);
  }
  if (opts?.timeline) parts.push(`Timeline: ${opts.timeline}.`);

  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(parts.join(' '))}`;
};
