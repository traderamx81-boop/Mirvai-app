import { ConvexClient } from 'convex/browser';
import { anyApi } from 'convex/server';
import { CONVEX_URL } from './convex-client';
import {
  defaultHomes,
  HomeListing,
  ReviewRequest,
  categoryLabel,
} from './courtyardReview';

const TIMEOUT_MS = 3500;

async function convexFetch(
  endpoint: 'query' | 'mutation',
  path: string,
  args: Record<string, any>
): Promise<{ ok: true; value: any } | { ok: false }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${CONVEX_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, args }),
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false };
    const json = await res.json();
    if (json?.status === 'success') {
      return { ok: true, value: json.value };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

export function mapConvexProperties(rawProps: any[]): {
  listings: HomeListing[];
  drafts: string[];
} {
  const drafts: string[] = [];
  const listings: HomeListing[] = rawProps.map((p: any) => {
    const id = String(p.slug || p._id);
    if (p.isDraft) drafts.push(id);
    return {
      id,
      convexId: p._id,
      name: String(p.name || 'Untitled Property'),
      type: String(p.type || 'detached'),
      area: p.area === 'Mainland' ? 'Mainland' : 'Island',
      locale: String(p.locale || 'Lagos'),
      price: Number(p.price) || 0,
      beds: p.beds !== undefined ? Number(p.beds) : undefined,
      status: String(p.status || 'Available'),
      photo: p.photo,
      photoUrl: p.photoUrl,
      description: String(p.description || ''),
    };
  });
  return { listings, drafts };
}

export function mapConvexRequests(rawReqs: any[]): ReviewRequest[] {
  return rawReqs.map((r: any) => ({
    id: String(r.externalId || r._id),
    convexId: r._id,
    kind: r.kind === 'Viewing' ? 'Viewing' : 'Enquiry',
    title: String(r.title || 'MIRVAI'),
    summary: String(r.summary || ''),
    location: r.location,
    timeline: r.timeline,
    propertyType: r.propertyType,
    budget: r.budget,
    clientName: r.clientName,
    clientContact: r.clientContact,
    basedIn: r.basedIn,
    notes: r.notes,
    reviewed: Boolean(r.reviewed),
    createdAt: r.timestamp,
  }));
}

export async function syncListingCreateOrUpdate(
  action: 'add' | 'update',
  listing: HomeListing,
  isDraft: boolean
): Promise<string | undefined> {
  // 1. Upsert into Convex `properties` table by slug
  const convexRes = await convexFetch('mutation', 'properties:upsert', {
    slug: listing.id,
    name: listing.name,
    type: listing.type,
    area: listing.area,
    locale: listing.locale,
    price: listing.price,
    beds: listing.beds,
    photo: listing.photo,
    photoUrl: listing.photoUrl,
    description: listing.description,
    status: listing.status || 'Available',
    isDraft,
    features: [],
  });

  // 2. Also persist to Express /api/properties cleanly (non-blocking local dev persistence)
  try {
    const payload = {
      id: listing.id,
      title: listing.name,
      location: `${listing.locale}, Lagos ${listing.area}`,
      type: categoryLabel(listing.type),
      category: listing.type,
      price: listing.price,
      status: isDraft ? 'Draft' : listing.status || 'Available',
      description: listing.description,
      image_url: listing.photoUrl || listing.photo || '',
    };
    const method = action === 'add' ? 'POST' : 'PUT';
    const url =
      action === 'add' ? '/api/properties' : `/api/properties/${encodeURIComponent(listing.id)}`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Graceful fallback: localStorage + Convex remain authoritative
  }

  return convexRes.ok && typeof convexRes.value === 'string'
    ? convexRes.value
    : listing.convexId;
}

export async function syncListingDelete(listing: HomeListing): Promise<void> {
  await convexFetch('mutation', 'properties:removeBySlugOrId', {
    ...(listing.convexId ? { id: listing.convexId } : {}),
    slug: listing.id,
  });

  try {
    await fetch(`/api/properties/${encodeURIComponent(listing.id)}`, {
      method: 'DELETE',
    });
  } catch {
    // Graceful fallback
  }
}

export async function syncEnquiryCreate(req: ReviewRequest): Promise<string | undefined> {
  const convexRes = await convexFetch('mutation', 'requests:create', {
    externalId: req.id,
    kind: req.kind,
    title: req.title,
    summary: req.summary,
    location: req.location,
    timeline: req.timeline,
    propertyType: req.propertyType,
    budget: req.budget,
    clientName: req.clientName,
    clientContact: req.clientContact,
    basedIn: req.basedIn,
    notes: req.notes,
  });

  try {
    await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  } catch {
    // Graceful fallback
  }

  return convexRes.ok && typeof convexRes.value === 'string' ? convexRes.value : undefined;
}

export async function syncEnquiryReview(req: ReviewRequest, reviewed: boolean): Promise<void> {
  await convexFetch('mutation', 'requests:setReviewed', {
    ...(req.convexId ? { id: req.convexId } : {}),
    externalId: req.id,
    reviewed,
  });

  try {
    await fetch(`/api/enquiries/${encodeURIComponent(req.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewed }),
    });
  } catch {
    // Graceful fallback
  }
}

export async function uploadImageAsset(dataUrl: string, filename: string): Promise<string> {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, filename }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.url) return json.url;
    }
  } catch {
    // Return compressed dataUrl cleanly when hosted statically (e.g., Vercel)
  }
  return dataUrl;
}

export async function fetchConvexSnapshot(): Promise<{
  deployed: boolean;
  listings?: HomeListing[];
  drafts?: string[];
  requests?: ReviewRequest[];
}> {
  const [propsRes, reqsRes] = await Promise.all([
    convexFetch('query', 'properties:list', { includeDrafts: true }),
    convexFetch('query', 'requests:list', {}),
  ]);

  if (!propsRes.ok && !reqsRes.ok) {
    return { deployed: false };
  }

  const result: {
    deployed: boolean;
    listings?: HomeListing[];
    drafts?: string[];
    requests?: ReviewRequest[];
  } = { deployed: true };

  if (propsRes.ok && Array.isArray(propsRes.value)) {
    if (propsRes.value.length === 0) {
      await convexFetch('mutation', 'properties:seedDefaults', {
        items: defaultHomes.map((h) => ({
          slug: h.id,
          name: h.name,
          type: h.type,
          area: h.area,
          locale: h.locale,
          price: h.price,
          beds: h.beds,
          photo: h.photo,
          photoUrl: h.photoUrl,
          description: h.description,
          status: h.status || 'Available',
          isDraft: false,
        })),
      });
      const seededRes = await convexFetch('query', 'properties:list', { includeDrafts: true });
      if (seededRes.ok && Array.isArray(seededRes.value) && seededRes.value.length > 0) {
        const mapped = mapConvexProperties(seededRes.value);
        result.listings = mapped.listings;
        result.drafts = mapped.drafts;
      }
    } else {
      const mapped = mapConvexProperties(propsRes.value);
      result.listings = mapped.listings;
      result.drafts = mapped.drafts;
    }
  }

  if (reqsRes.ok && Array.isArray(reqsRes.value)) {
    result.requests = mapConvexRequests(reqsRes.value);
  }

  return result;
}

export function subscribeToConvexRealtime(callbacks: {
  onProperties: (listings: HomeListing[], drafts: string[]) => void;
  onRequests: (requests: ReviewRequest[]) => void;
}): () => void {
  let cancelled = false;
  let client: ConvexClient | null = null;
  let unsubProps: (() => void) | undefined;
  let unsubReqs: (() => void) | undefined;

  void fetchConvexSnapshot().then((snapshot) => {
    if (cancelled || !snapshot.deployed) return;

    if (snapshot.listings && snapshot.listings.length > 0) {
      callbacks.onProperties(snapshot.listings, snapshot.drafts ?? []);
    }
    if (snapshot.requests && snapshot.requests.length > 0) {
      callbacks.onRequests(snapshot.requests);
    }

    try {
      client = new ConvexClient(CONVEX_URL);
      const safeError = () => {
        unsubProps?.();
        unsubReqs?.();
      };

      const propsSub = client.onUpdate(
        anyApi.properties.list,
        { includeDrafts: true },
        (rawProps) => {
          if (cancelled || !Array.isArray(rawProps) || rawProps.length === 0) return;
          const mapped = mapConvexProperties(rawProps);
          callbacks.onProperties(mapped.listings, mapped.drafts);
        },
        safeError
      );
      unsubProps = () => propsSub.unsubscribe();

      const reqsSub = client.onUpdate(
        anyApi.requests.list,
        {},
        (rawReqs) => {
          if (cancelled || !Array.isArray(rawReqs)) return;
          callbacks.onRequests(mapConvexRequests(rawReqs));
        },
        safeError
      );
      unsubReqs = () => reqsSub.unsubscribe();
    } catch {
      // Fall back cleanly if WebSocket client unavailable
    }
  });

  return () => {
    cancelled = true;
    unsubProps?.();
    unsubReqs?.();
    if (client) {
      void client.close().catch(() => {});
    }
  };
}
