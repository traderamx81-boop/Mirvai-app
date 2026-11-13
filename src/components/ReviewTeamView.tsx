import React, { useState } from 'react';
import {
  categories,
  categoryLabel,
  HomeListing,
  ngn,
  resolveListingImage,
  ReviewRequest,
  STATUS_OPTIONS,
} from '../lib/courtyardReview';
import { uploadImageAsset } from '../lib/convexSync';

interface ReviewTeamViewProps {
  hidden: boolean;
  listings: HomeListing[];
  requests: ReviewRequest[];
  drafts: string[];
  onNavigateWebsite: () => void;
  onNavigateApp: () => void;
  onMarkReviewed: (requestId: string) => void;
  onToggleInventoryDraft: (propertyId: string) => void;
  onSaveListing: (listing: HomeListing, publish: boolean) => void;
  onDeleteListing: (listing: HomeListing) => void;
  onNotify: (message: string) => void;
}

interface EditorFormState {
  id: string;
  convexId?: string;
  name: string;
  type: string;
  area: 'Island' | 'Mainland';
  locale: string;
  price: string;
  beds: string;
  status: string;
  photoUrl: string;
  photoKey: string;
  description: string;
  publish: boolean;
}

const emptyEditor = (): EditorFormState => ({
  id: '',
  name: '',
  type: 'detached',
  area: 'Island',
  locale: '',
  price: '',
  beds: '4',
  status: 'Available',
  photoUrl: '',
  photoKey: '',
  description: '',
  publish: true,
});

function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const result = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1080;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}

export const ReviewTeamView: React.FC<ReviewTeamViewProps> = ({
  hidden,
  listings,
  requests,
  drafts,
  onNavigateWebsite,
  onNavigateApp,
  onMarkReviewed,
  onToggleInventoryDraft,
  onSaveListing,
  onDeleteListing,
  onNotify,
}) => {
  const [inventoryQuery, setInventoryQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editor, setEditor] = useState<EditorFormState>(emptyEditor);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const reviewedCount = requests.filter((req) => req?.reviewed).length;
  const publishedCount = listings.filter((item) => !drafts.includes(item.id)).length;
  const draftCount = listings.length - publishedCount;
  const newRequestsCount = requests.length - reviewedCount;

  const metrics: [number, string][] = [
    [publishedCount, 'Published listings'],
    [draftCount, 'Draft listings'],
    [newRequestsCount, 'New enquiries'],
    [reviewedCount, 'Reviewed requests'],
  ];

  const openAddForm = () => {
    setFormError(null);
    setConfirmDeleteId(null);
    setEditor(emptyEditor());
    setEditorOpen(true);
  };

  const openEditForm = (item: HomeListing) => {
    const resolved = resolveListingImage(item);
    setFormError(null);
    setConfirmDeleteId(null);
    setEditor({
      id: item.id,
      convexId: item.convexId,
      name: item.name,
      type: item.type,
      area: item.area,
      locale: item.locale,
      price: String(item.price),
      beds: item.beds !== undefined ? String(item.beds) : '',
      status: item.status || 'Available',
      photoUrl: item.photoUrl || resolved?.src || '',
      photoKey: item.photo || '',
      description: item.description,
      publish: !drafts.includes(item.id),
    });
    setEditorOpen(true);
  };

  const handleImageUpload = async (file: File | undefined, resetInput: () => void) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
      onNotify('Choose a JPG, PNG, WebP or AVIF image up to 10 MB.');
      resetInput();
      return;
    }
    setUploadingImage(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      const uploadedUrl = await uploadImageAsset(dataUrl, file.name);
      setEditor((prev) => ({ ...prev, photoUrl: uploadedUrl }));
      onNotify('Listing image ready.');
    } catch {
      onNotify('Unable to process image file.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = editor.name.trim();
    const cleanLocale = editor.locale.trim();
    const cleanDesc = editor.description.trim();
    const numericPrice = Number(editor.price.replace(/[^0-9.]/g, ''));

    if (!cleanName || !cleanLocale || !cleanDesc || !numericPrice || numericPrice <= 0) {
      setFormError('Please provide title, location, a valid NGN price, and description.');
      return;
    }

    const id =
      editor.id ||
      `${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'listing'}-${Date.now().toString(36)}`;

    const saved: HomeListing = {
      id,
      convexId: editor.convexId,
      name: cleanName,
      type: editor.type,
      area: editor.area,
      locale: cleanLocale,
      price: Math.round(numericPrice),
      beds: editor.beds.trim() ? Number(editor.beds) : undefined,
      status: editor.status || 'Available',
      photo: editor.photoKey || undefined,
      photoUrl: editor.photoUrl.trim() || undefined,
      description: cleanDesc,
    };

    onSaveListing(saved, editor.publish);
    setEditorOpen(false);
    setFormError(null);
  };

  const filteredListings = listings.filter((item) => {
    const q = inventoryQuery.trim().toLowerCase();
    if (!q) return true;
    return [item.name, item.locale, item.area, categoryLabel(item.type), item.status || '']
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  return (
    <section id="team" data-surface="" hidden={hidden} className="workspace">
      <div className="workspace-inner team-layout">
        <header className="section-intro">
          <div>
            <p className="eyebrow">MIRVAI / ADMIN &amp; OPERATIONS</p>
            <h1>Team view.</h1>
            <div className="team-header-actions">
              <button type="button" className="button outline" onClick={onNavigateWebsite}>
                ← Website
              </button>
              <button type="button" className="button outline" onClick={onNavigateApp}>
                Client App
              </button>
            </div>
          </div>
          <p>
            Manage live property listings, upload photography, control publish states, and review
            incoming buyer enquiries across Website and App.
          </p>
        </header>

        <div id="team-metrics" className="team-metrics">
          {metrics.map(([count, caption]) => (
            <div key={caption}>
              <b>{count}</b>
              <span>{caption}</span>
            </div>
          ))}
        </div>

        <section className="team-panel">
          <div className="team-panel-head">
            <h2>Property inventory</h2>
            <div className="admin-toolbar">
              <input
                type="search"
                aria-label="Filter inventory"
                placeholder="Search listings or location…"
                value={inventoryQuery}
                onChange={(e) => setInventoryQuery(e.target.value)}
              />
              <button type="button" className="button primary" onClick={openAddForm}>
                + Add new listing
              </button>
            </div>
          </div>

          {editorOpen && (
            <form className="admin-form" onSubmit={handleEditorSubmit} noValidate>
              <h3>{editor.id ? `Edit: ${editor.name || 'Listing'}` : 'Add new property listing'}</h3>
              <div className="admin-form-grid">
                <label>
                  Property title *
                  <input
                    name="listingName"
                    required
                    value={editor.name}
                    onChange={(e) => setEditor((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Banana Island Waterfront Villa"
                  />
                </label>

                <label>
                  Property type
                  <select
                    name="listingType"
                    value={editor.type}
                    onChange={(e) => setEditor((p) => ({ ...p, type: e.target.value }))}
                  >
                    {categories.map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Region (Island / Mainland)
                  <select
                    name="listingArea"
                    value={editor.area}
                    onChange={(e) =>
                      setEditor((p) => ({
                        ...p,
                        area: e.target.value === 'Mainland' ? 'Mainland' : 'Island',
                      }))
                    }
                  >
                    <option value="Island">Lagos Island</option>
                    <option value="Mainland">Lagos Mainland</option>
                  </select>
                </label>

                <label>
                  Specific location / neighbourhood *
                  <input
                    name="listingLocale"
                    required
                    value={editor.locale}
                    onChange={(e) => setEditor((p) => ({ ...p, locale: e.target.value }))}
                    placeholder="e.g. Ikoyi, Lekki Phase 1, Ikeja"
                  />
                </label>

                <label>
                  Asking price (NGN ₦) *
                  <input
                    name="listingPrice"
                    type="number"
                    min={1}
                    required
                    value={editor.price}
                    onChange={(e) => setEditor((p) => ({ ...p, price: e.target.value }))}
                    placeholder="650000000"
                  />
                </label>

                <label>
                  Bedrooms (optional)
                  <input
                    name="listingBeds"
                    type="number"
                    min={0}
                    value={editor.beds}
                    onChange={(e) => setEditor((p) => ({ ...p, beds: e.target.value }))}
                    placeholder="4"
                  />
                </label>

                <label>
                  Availability status
                  <select
                    name="listingStatus"
                    value={editor.status}
                    onChange={(e) => setEditor((p) => ({ ...p, status: e.target.value }))}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Image URL (or upload below)
                  <input
                    name="listingPhotoUrl"
                    type="url"
                    value={editor.photoUrl}
                    onChange={(e) =>
                      setEditor((p) => ({ ...p, photoUrl: e.target.value, photoKey: '' }))
                    }
                    placeholder="https://… or /assets/courtyard.webp"
                  />
                </label>

                <div className="span">
                  <div className="admin-image-box">
                    {editor.photoUrl ? (
                      <img
                        className="admin-image-preview"
                        src={editor.photoUrl}
                        alt="Listing preview"
                      />
                    ) : null}
                    <label>
                      {uploadingImage ? 'Processing image…' : 'Upload property image'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const input = e.currentTarget;
                          void handleImageUpload(input.files?.[0], () => {
                            input.value = '';
                          });
                        }}
                      />
                    </label>
                    {editor.photoUrl && (
                      <button
                        type="button"
                        className="button outline"
                        onClick={() =>
                          setEditor((p) => ({ ...p, photoUrl: '', photoKey: '' }))
                        }
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>

                <label className="span">
                  Description *
                  <textarea
                    name="listingDescription"
                    required
                    rows={3}
                    value={editor.description}
                    onChange={(e) => setEditor((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Architectural highlights, bedrooms, finishes, title documentation, and surroundings…"
                  />
                </label>

                <div className="span">
                  <label className="admin-check-row">
                    <input
                      type="checkbox"
                      checked={editor.publish}
                      onChange={(e) => setEditor((p) => ({ ...p, publish: e.target.checked }))}
                    />
                    Publish immediately (visible on Website and Client App)
                  </label>
                </div>
              </div>

              {formError && <p className="form-error">{formError}</p>}

              <div className="form-actions">
                <button type="submit" className="button primary">
                  {editor.id ? 'Save changes' : 'Create listing'}
                </button>
                <button
                  type="button"
                  className="button outline"
                  onClick={() => {
                    setEditorOpen(false);
                    setFormError(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div id="team-inventory">
            {filteredListings.length === 0 ? (
              <p className="empty">No listings match that search.</p>
            ) : (
              filteredListings.map((item) => {
                const isDraft = drafts.includes(item.id);
                const art = resolveListingImage(item);
                const awaitingConfirm = confirmDeleteId === item.id;

                return (
                  <div key={item.id} className="inventory-row">
                    {art ? (
                      <img className="inventory-thumb" src={art.src} alt={art.alt} />
                    ) : (
                      <div className="inventory-thumb inventory-thumb-empty" aria-hidden="true">
                        <svg>
                          <use href="#i-home" />
                        </svg>
                      </div>
                    )}

                    <div className="inventory-meta">
                      <strong>{item.name}</strong>
                      <span>
                        {item.locale} · Lagos {item.area} · {categoryLabel(item.type)} ·{' '}
                        {ngn(item.price)}
                      </span>
                      <span>
                        {item.status || 'Available'} · {isDraft ? 'Draft (Hidden)' : 'Published'}
                      </span>
                    </div>

                    <div className="inventory-actions">
                      <button
                        type="button"
                        className="button outline"
                        onClick={() => openEditForm(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button outline"
                        onClick={() => onToggleInventoryDraft(item.id)}
                      >
                        {isDraft ? 'Publish' : 'Unpublish'}
                      </button>
                      {awaitingConfirm ? (
                        <>
                          <button
                            type="button"
                            className="button danger"
                            onClick={() => {
                              onDeleteListing(item);
                              setConfirmDeleteId(null);
                            }}
                          >
                            Confirm delete
                          </button>
                          <button
                            type="button"
                            className="button outline"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="button danger"
                          onClick={() => setConfirmDeleteId(item.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="team-panel">
          <h2>Buyer requests</h2>
          <div id="team-enquiries">
            {requests.length === 0 ? (
              <p className="empty">
                Nothing to review yet. Submit a viewing or enquiry from Website or App to see it
                here.
              </p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="item-row">
                  <div>
                    <strong>
                      {req.kind} · {req.title}
                    </strong>
                    <span>{req.summary}</span>
                    {req.clientContact && (
                      <span>
                        {req.clientName ? `${req.clientName} · ` : ''}
                        {req.clientContact}
                        {req.basedIn ? ` (${req.basedIn})` : ''}
                      </span>
                    )}
                    <span>{req.reviewed ? 'Reviewed' : 'New request'}</span>
                  </div>
                  {!req.reviewed && (
                    <button
                      type="button"
                      className="button outline"
                      onClick={() => onMarkReviewed(req.id)}
                    >
                      Mark reviewed
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
};
