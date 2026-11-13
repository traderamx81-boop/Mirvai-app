import { CONVEX_URL } from './convex-client';
import {
  HomeListing,
  ReviewRequest,
  categoryLabel,
} from './courtyardReview';

const TIMEOUT_MS = 3500;

async function convexFetch(endpoint: 'query' | 'mutation', path: string, args: Record<string, any>) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${CONVEX_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, args }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.status === 'success') {
      return json.value;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function syncListingCreateOrUpdate(
  action: 'add' | 'update',
  listing: HomeListing,
  isDraft: boolean
): Promise<string | undefined> {
  // 1. Try Convex mutation gracefully
  if (action === 'add' || !listing.convexId) {
    const createdId = await convexFetch('mutation', 'properties:add', {
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
    if (typeof createdId === 'string') {
      return createdId;
    }
  } else if (listing.convexId) {
    await convexFetch('mutation', 'properties:update', {
      id: listing.convexId,
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
    });
  }

  // 2. Also persist to local Express /api/properties cleanly (non-blocking)
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
    const url = action === 'add' ? '/api/properties' : `/api/properties/${encodeURIComponent(listing.id)}`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Graceful fallback: localStorage state remains authoritative offline
  }

  return listing.convexId;
}

export async function syncListingDelete(listing: HomeListing): Promise<void> {
  if (listing.convexId) {
    await convexFetch('mutation', 'properties:remove', { id: listing.convexId });
  }
  try {
    await fetch(`/api/properties/${encodeURIComponent(listing.id)}`, {
      method: 'DELETE',
    });
  } catch {
    // Graceful fallback
  }
}

export async function syncEnquiryCreate(req: ReviewRequest): Promise<string | undefined> {
  const convexId = await convexFetch('mutation', 'requests:create', {
    kind: req.kind,
    title: req.title,
    summary: req.summary,
    clientName: req.clientName,
    clientContact: req.clientContact,
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

  return typeof convexId === 'string' ? convexId : undefined;
}

export async function syncEnquiryReview(req: ReviewRequest, reviewed: boolean): Promise<void> {
  if (req.convexId) {
    await convexFetch('mutation', 'requests:setReviewed', {
      id: req.convexId,
      reviewed,
    });
  }
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
    // Return local compressed dataUrl directly if offline
  }
  return dataUrl;
}

export async function fetchConvexSnapshot(): Promise<{
  listings?: HomeListing[];
  drafts?: string[];
  requests?: ReviewRequest[];
} | null> {
  const [rawProps, rawReqs] = await Promise.all([
    convexFetch('query', 'properties:list', { includeDrafts: true }),
    convexFetch('query', 'requests:list', {}),
  ]);

  if (!Array.isArray(rawProps) && !Array.isArray(rawReqs)) {
    return null;
  }

  const result: {
    listings?: HomeListing[];
    drafts?: string[];
    requests?: ReviewRequest[];
  } = {};

  if (Array.isArray(rawProps) && rawProps.length > 0) {
    const drafts: string[] = [];
    result.listings = rawProps.map((p: any) => {
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
    result.drafts = drafts;
  }

  if (Array.isArray(rawReqs) && rawReqs.length > 0) {
    result.requests = rawReqs.map((r: any) => ({
      id: String(r._id),
      convexId: r._id,
      kind: r.kind === 'Viewing' ? 'Viewing' : 'Enquiry',
      title: String(r.title || 'MIRVAI'),
      summary: String(r.summary || ''),
      clientName: r.clientName,
      clientContact: r.clientContact,
      reviewed: Boolean(r.reviewed),
    }));
  }

  return result;
}
