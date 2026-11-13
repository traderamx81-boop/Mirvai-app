import React, { useState } from 'react';
import {
  categories,
  categoryLabel,
  HomeListing,
  ngn,
  parseVideoEmbed,
  resolveListingGallery,
  resolveListingImage,
  ReviewRequest,
  STATUS_OPTIONS,
} from '../lib/courtyardReview';
import { uploadMediaFile } from '../lib/convexSync';

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
  images: string[];
  videoUrl: string;
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
  images: [],
  videoUrl: '',
  description: '',
  publish: true,
});

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
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

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
    setNewImageUrl('');
    setEditor(emptyEditor());
    setEditorOpen(true);
  };

  const openEditForm = (item: HomeListing) => {
    const gallery = resolveListingGallery(item).map((g) => g.src);
    setFormError(null);
    setConfirmDeleteId(null);
    setNewImageUrl('');
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
      images: gallery,
      videoUrl: item.videoUrl || '',
      description: item.description,
      publish: !drafts.includes(item.id),
    });
    setEditorOpen(true);
  };

  const handleMultiImageUpload = async (
    fileList: FileList | null,
    resetInput: () => void
  ) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    const validFiles = files.filter(
      (f) => validTypes.includes(f.type) && f.size <= 15 * 1024 * 1024
    );

    if (validFiles.length === 0) {
      onNotify('Choose JPG, PNG, WebP, or AVIF images up to 15 MB each.');
      resetInput();
      return;
    }

    setUploadingImage(true);
    try {
      const uploadedUrls = await Promise.all(validFiles.map((file) => uploadMediaFile(file)));
      setEditor((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls.filter((u) => !prev.images.includes(u))],
      }));
      onNotify(
        uploadedUrls.length === 1
          ? '1 listing photo added.'
          : `${uploadedUrls.length} listing photos added.`
      );
    } catch {
      onNotify('Unable to process one or more image files.');
    } finally {
      setUploadingImage(false);
      resetInput();
    }
  };

  const handleVideoUpload = async (file: File | undefined, resetInput: () => void) => {
    if (!file) return;
    const isVideo =
      file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
    if (!isVideo || file.size > 60 * 1024 * 1024) {
      onNotify('Choose an MP4, WebM, or MOV video file up to 60 MB.');
      resetInput();
      return;
    }

    setUploadingVideo(true);
    try {
      const uploadedUrl = await uploadMediaFile(file);
      setEditor((prev) => ({ ...prev, videoUrl: uploadedUrl }));
      onNotify('Property video uploaded.');
    } catch {
      onNotify('Unable to upload video file.');
    } finally {
      setUploadingVideo(false);
      resetInput();
    }
  };

  const handleAddImageUrl = () => {
    const clean = newImageUrl.trim();
    if (!clean) return;
    setEditor((prev) => ({
      ...prev,
      images: prev.images.includes(clean) ? prev.images : [...prev.images, clean],
    }));
    setNewImageUrl('');
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setEditor((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.images.length) return prev;
      const copy = [...prev.images];
      const [moved] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, moved);
      return { ...prev, images: copy };
    });
  };

  const makeCoverImage = (index: number) => {
    setEditor((prev) => {
      if (index <= 0 || index >= prev.images.length) return prev;
      const copy = [...prev.images];
      const [chosen] = copy.splice(index, 1);
      copy.unshift(chosen);
      return { ...prev, images: copy };
    });
  };

  const removeImageAt = (index: number) => {
    setEditor((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

    const cleanImages = editor.images.map((u) => u.trim()).filter(Boolean);
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
      photo: undefined,
      photoUrl: cleanImages[0] || undefined,
      images: cleanImages,
      videoUrl: editor.videoUrl.trim() || undefined,
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

  const parsedPreviewVideo = parseVideoEmbed(editor.videoUrl);

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
            Manage live property listings, upload multiple photos and walkthrough videos, control
            publish states, and review incoming buyer enquiries across Website and App.
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

                <label className="span">
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

                <div className="span admin-media-section">
                  <div className="admin-media-head">
                    <strong>Property photos ({editor.images.length})</strong>
                    <span>First photo is used as the cover card image.</span>
                  </div>

                  <div className="admin-image-box">
                    <label>
                      {uploadingImage ? 'Uploading photos…' : 'Upload multiple images'}
                      <input
                        name="listingPhotosUpload"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const input = e.currentTarget;
                          void handleMultiImageUpload(input.files, () => {
                            input.value = '';
                          });
                        }}
                      />
                    </label>

                    <div className="admin-url-adder">
                      <input
                        name="listingPhotoUrl"
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImageUrl();
                          }
                        }}
                        placeholder="Or paste photo URL (https://…)"
                      />
                      <button
                        type="button"
                        className="button outline"
                        onClick={handleAddImageUrl}
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {editor.images.length > 0 && (
                    <div className="admin-gallery-grid">
                      {editor.images.map((src, idx) => (
                        <div key={`${src}-${idx}`} className="admin-thumb-card">
                          <div className="admin-thumb-media">
                            <img src={src} alt={`Property photo ${idx + 1}`} />
                            {idx === 0 && <span className="admin-cover-tag">Cover</span>}
                          </div>
                          <div className="admin-thumb-actions">
                            {idx > 0 && (
                              <button
                                type="button"
                                className="button outline"
                                onClick={() => makeCoverImage(idx)}
                                title="Set as cover image"
                              >
                                Cover
                              </button>
                            )}
                            <button
                              type="button"
                              className="button outline"
                              disabled={idx === 0}
                              onClick={() => moveImage(idx, -1)}
                              aria-label={`Move photo ${idx + 1} left`}
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              className="button outline"
                              disabled={idx === editor.images.length - 1}
                              onClick={() => moveImage(idx, 1)}
                              aria-label={`Move photo ${idx + 1} right`}
                            >
                              →
                            </button>
                            <button
                              type="button"
                              className="button danger"
                              onClick={() => removeImageAt(idx)}
                              aria-label={`Remove photo ${idx + 1}`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="span admin-media-section">
                  <div className="admin-media-head">
                    <strong>Property walkthrough video (optional)</strong>
                    <span>MP4, WebM, MOV upload or YouTube / Vimeo link.</span>
                  </div>

                  <div className="admin-image-box">
                    <label>
                      {uploadingVideo ? 'Uploading video…' : 'Upload video file'}
                      <input
                        name="listingVideoUpload"
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/*"
                        disabled={uploadingVideo}
                        onChange={(e) => {
                          const input = e.currentTarget;
                          void handleVideoUpload(input.files?.[0], () => {
                            input.value = '';
                          });
                        }}
                      />
                    </label>

                    <label className="admin-video-url-field">
                      Or paste video URL
                      <input
                        name="listingVideoUrl"
                        type="url"
                        value={editor.videoUrl}
                        onChange={(e) =>
                          setEditor((p) => ({ ...p, videoUrl: e.target.value }))
                        }
                        placeholder="https://… or YouTube / Vimeo link"
                      />
                    </label>
                  </div>

                  {parsedPreviewVideo && (
                    <div className="admin-video-preview-row">
                      {parsedPreviewVideo.kind === 'video' ? (
                        <video
                          className="admin-video-preview"
                          src={parsedPreviewVideo.src}
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <iframe
                          className="admin-video-preview"
                          src={parsedPreviewVideo.src}
                          title="Video preview"
                          allowFullScreen
                        />
                      )}
                      <button
                        type="button"
                        className="button danger"
                        onClick={() => setEditor((p) => ({ ...p, videoUrl: '' }))}
                      >
                        Remove video
                      </button>
                    </div>
                  )}
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
                <button
                  type="submit"
                  className="button primary"
                  disabled={uploadingImage || uploadingVideo}
                >
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
                const photoCount = resolveListingGallery(item).length;
                const hasVideo = Boolean(parseVideoEmbed(item.videoUrl));
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
                        {item.status || 'Available'} · {isDraft ? 'Draft (Hidden)' : 'Published'} ·{' '}
                        {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
                        {hasVideo ? ' · Video' : ''}
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
