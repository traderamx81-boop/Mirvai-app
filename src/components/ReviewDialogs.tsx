import React, { useEffect, useRef, useState } from 'react';
import {
  BASED_IN_OPTIONS,
  BUDGET_OPTIONS,
  buildWhatsAppUrl,
  categories,
  categoryLabel,
  EnquiryPayload,
  homeById,
  HomeListing,
  LAGOS_LOCATION_SUGGESTIONS,
  ngn,
  parseVideoEmbed,
  resolveListingGallery,
  TIMELINE_OPTIONS,
  WHATSAPP_DISPLAY,
} from '../lib/courtyardReview';

export type ActiveModal =
  | { type: 'property'; id: string }
  | { type: 'form'; kind: 'viewing' | 'enquire'; id?: string }
  | { type: 'submitted' }
  | { type: 'contact' }
  | null;

interface ReviewDialogsProps {
  menuOpen: boolean;
  activeModal: ActiveModal;
  listings: HomeListing[];
  savedIds: string[];
  toastMessage: string | null;
  onCloseMenu: () => void;
  onBrowseProperties: () => void;
  onMenuFilterSelect: (categoryId: string) => void;
  onOpenContactFromMenu: () => void;
  onCloseModal: () => void;
  onToggleSave: (propertyId: string) => void;
  onOpenForm: (kind: 'viewing' | 'enquire', propertyId?: string) => void;
  onSubmitForm: (
    kind: 'viewing' | 'enquire',
    summary: string,
    propertyId?: string,
    extra?: EnquiryPayload
  ) => void;
  onGoEnquiries: () => void;
}

export const ReviewDialogs: React.FC<ReviewDialogsProps> = ({
  menuOpen,
  activeModal,
  listings,
  savedIds,
  toastMessage,
  onCloseMenu,
  onBrowseProperties,
  onMenuFilterSelect,
  onOpenContactFromMenu,
  onCloseModal,
  onToggleSave,
  onOpenForm,
  onSubmitForm,
  onGoEnquiries,
}) => {
  const drawerRef = useRef<HTMLDialogElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const [enqLocation, setEnqLocation] = useState('');
  const [enqTimeline, setEnqTimeline] = useState<string>(TIMELINE_OPTIONS[1]);
  const [enqType, setEnqType] = useState<string>('Not sure yet');
  const [enqBudget, setEnqBudget] = useState<string>(BUDGET_OPTIONS[0]);
  const [enqName, setEnqName] = useState('');
  const [enqContact, setEnqContact] = useState('');
  const [enqBasedIn, setEnqBasedIn] = useState<string>(BASED_IN_OPTIONS[0]);
  const [enqNotes, setEnqNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (menuOpen && !drawer.open) {
      drawer.showModal();
    } else if (!menuOpen && drawer.open) {
      drawer.close();
    }
  }, [menuOpen]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    if (activeModal) {
      if (activeModal.type === 'property') {
        setActiveMediaIdx(0);
      }
      if (activeModal.type === 'form') {
        const item = homeById(activeModal.id, listings);
        setEnqLocation(item ? `${item.locale}, Lagos ${item.area}` : '');
        setEnqTimeline(TIMELINE_OPTIONS[1]);
        setEnqType(item ? categoryLabel(item.type) : 'Not sure yet');
        setEnqBudget(BUDGET_OPTIONS[0]);
        setEnqName('');
        setEnqContact('');
        setEnqBasedIn(BASED_IN_OPTIONS[0]);
        setEnqNotes('');
        setFormError(null);
      }
      modal.scrollTop = 0;
      if (!modal.open) {
        modal.showModal();
      }
    } else if (modal.open) {
      modal.close();
    }
  }, [activeModal, listings]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeModal?.type !== 'form') return;

    if (activeModal.kind === 'viewing') {
      const formData = new FormData(e.currentTarget);
      const summary = Array.from(formData.values()).join(' · ');
      onSubmitForm('viewing', summary, activeModal.id);
      return;
    }

    const cleanLocation = enqLocation.trim();
    const cleanName = enqName.trim();
    const cleanContact = enqContact.trim();
    if (!cleanLocation || !cleanName || !cleanContact) {
      setFormError('Please enter your preferred location, name, and phone or email.');
      return;
    }

    const summaryParts = [
      cleanLocation,
      enqType,
      enqTimeline,
      enqBudget,
    ];
    if (enqNotes.trim()) summaryParts.push(enqNotes.trim());

    onSubmitForm('enquire', summaryParts.join(' · '), activeModal.id, {
      location: cleanLocation,
      timeline: enqTimeline,
      propertyType: enqType,
      budget: enqBudget,
      clientName: cleanName,
      clientContact: cleanContact,
      basedIn: enqBasedIn,
      notes: enqNotes.trim() || undefined,
    });
  };

  const renderModalContent = () => {
    if (!activeModal) return null;

    if (activeModal.type === 'property') {
      const item = homeById(activeModal.id, listings);
      if (!item) return null;
      const isSaved = savedIds.includes(item.id);
      const gallery = resolveListingGallery(item);
      const video = parseVideoEmbed(item.videoUrl);
      const slides: Array<
        | { kind: 'image'; src: string; alt: string }
        | { kind: 'video'; src: string; mode: 'video' | 'embed'; poster?: string }
      > = gallery.map((img) => ({ kind: 'image', src: img.src, alt: img.alt }));

      if (video) {
        slides.push({
          kind: 'video',
          src: video.src,
          mode: video.kind,
          poster: gallery[0]?.src,
        });
      }

      const safeIdx = slides.length > 0 ? Math.min(activeMediaIdx, slides.length - 1) : 0;
      const currentSlide = slides[safeIdx];

      return (
        <>
          <h2 id="modal-title">{item.name}</h2>
          <p className="eyebrow">
            {categoryLabel(item.type)} / {item.locale} · Lagos {item.area}
          </p>

          {slides.length > 0 && currentSlide && (
            <div className="property-media">
              <div className="media-stage">
                {currentSlide.kind === 'image' ? (
                  <img
                    className="property-photo"
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    width={1050}
                    height={700}
                  />
                ) : currentSlide.mode === 'embed' ? (
                  <iframe
                    className="property-video-frame"
                    src={currentSlide.src}
                    title={`${item.name} video walkthrough`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={currentSlide.src}
                    className="property-video"
                    src={currentSlide.src}
                    poster={currentSlide.poster}
                    controls
                    playsInline
                    preload="metadata"
                  />
                )}

                {slides.length > 1 && (
                  <div className="media-bar">
                    <span className="media-counter">
                      {currentSlide.kind === 'video'
                        ? 'Video walkthrough'
                        : `Photo ${safeIdx + 1} of ${gallery.length}`}
                    </span>
                    <div className="media-nav-buttons">
                      <button
                        type="button"
                        className="media-nav-btn"
                        aria-label="Previous media"
                        onClick={() =>
                          setActiveMediaIdx((safeIdx - 1 + slides.length) % slides.length)
                        }
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className="media-nav-btn"
                        aria-label="Next media"
                        onClick={() => setActiveMediaIdx((safeIdx + 1) % slides.length)}
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {slides.length > 1 && (
                <div className="media-thumbs" role="tablist" aria-label="Property gallery">
                  {slides.map((slide, idx) => (
                    <button
                      key={`${slide.kind}-${slide.src}-${idx}`}
                      type="button"
                      role="tab"
                      aria-selected={safeIdx === idx}
                      className={`media-thumb ${safeIdx === idx ? 'is-active' : ''}`}
                      onClick={() => setActiveMediaIdx(idx)}
                      aria-label={
                        slide.kind === 'video'
                          ? 'Play property video'
                          : `Show photo ${idx + 1}`
                      }
                    >
                      {slide.kind === 'image' ? (
                        <img src={slide.src} alt="" loading="lazy" />
                      ) : (
                        <span className="media-thumb-video">
                          <span aria-hidden="true">▶</span>
                          <small>Video</small>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <p>
            <strong>{ngn(item.price)}</strong> · {item.status || 'Available'}
            {item.beds ? ` · ${item.beds} bedrooms` : ''}
          </p>
          <p>{item.description}</p>
          <div className="actions">
            <button
              type="button"
              className="button primary"
              onClick={() => onOpenForm('viewing', item.id)}
            >
              Request a viewing
            </button>
            <button
              type="button"
              className="button outline"
              onClick={() => onOpenForm('enquire', item.id)}
            >
              Enquire
            </button>
            <button
              type="button"
              className="button outline"
              aria-pressed={isSaved}
              onClick={() => onToggleSave(item.id)}
            >
              <svg aria-hidden="true">
                <use href="#i-saved" />
              </svg>
              {isSaved ? 'Saved · remove' : 'Save home'}
            </button>
          </div>
        </>
      );
    }

    if (activeModal.type === 'form') {
      const item = homeById(activeModal.id, listings);
      const heading = activeModal.kind === 'viewing' ? 'Request a viewing' : 'Make an enquiry';
      const whatsappHref = buildWhatsAppUrl({
        propertyName: item?.name,
        location: enqLocation,
        propertyType: enqType,
        timeline: enqTimeline,
      });

      return (
        <>
          <h2 id="modal-title">{heading}</h2>
          {item && (
            <p>
              {item.name} · {item.locale}
            </p>
          )}

          {activeModal.kind === 'viewing' ? (
            <>
              <p>
                Choose your preferred viewing format and timing. Requests sync directly to the
                MIRVAI desk.
              </p>
              <form
                id="request-form"
                key={`viewing-${activeModal.id || 'general'}`}
                onSubmit={handleFormSubmit}
              >
                <div className="form-grid">
                  <label>
                    Viewing type
                    <select name="channel" defaultValue="Video walkthrough">
                      <option>Video walkthrough</option>
                      <option>In-person viewing</option>
                    </select>
                  </label>
                  <label>
                    Preferred time
                    <select name="when" defaultValue="Weekday morning">
                      <option>Weekday morning</option>
                      <option>Weekday afternoon</option>
                      <option>Saturday morning</option>
                    </select>
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="button primary">
                    Request viewing{' '}
                    <svg aria-hidden="true">
                      <use href="#i-arrow" />
                    </svg>
                  </button>
                  <a
                    className="button whatsapp-button"
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp {WHATSAPP_DISPLAY} ↗
                  </a>
                </div>
              </form>
            </>
          ) : (
            <>
              <p>
                Share your preferred location, timeline, and requirements, or message our advisory
                desk directly on WhatsApp.
              </p>
              <form
                id="request-form"
                key={`enquire-${activeModal.id || 'general'}`}
                onSubmit={handleFormSubmit}
                noValidate
              >
                <div className="form-grid">
                  <label>
                    Preferred location / area *
                    <input
                      name="location"
                      type="text"
                      list="lagos-locations"
                      required
                      value={enqLocation}
                      onChange={(e) => setEnqLocation(e.target.value)}
                      placeholder="e.g. Lekki Phase 1, Ikoyi, Ikeja…"
                    />
                    <datalist id="lagos-locations">
                      {LAGOS_LOCATION_SUGGESTIONS.map((loc) => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                  </label>

                  <label>
                    How soon are you buying?
                    <select
                      name="timeline"
                      value={enqTimeline}
                      onChange={(e) => setEnqTimeline(e.target.value)}
                    >
                      {TIMELINE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Property type
                    <select
                      name="propertyType"
                      value={enqType}
                      onChange={(e) => setEnqType(e.target.value)}
                    >
                      <option value="Not sure yet">Not sure yet</option>
                      {categories.map(([, label]) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Budget range
                    <select
                      name="budget"
                      value={enqBudget}
                      onChange={(e) => setEnqBudget(e.target.value)}
                    >
                      {BUDGET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Your name *
                    <input
                      name="name"
                      type="text"
                      required
                      value={enqName}
                      onChange={(e) => setEnqName(e.target.value)}
                      placeholder="Full name"
                    />
                  </label>

                  <label>
                    Phone or email *
                    <input
                      name="contact"
                      type="text"
                      required
                      value={enqContact}
                      onChange={(e) => setEnqContact(e.target.value)}
                      placeholder="WhatsApp number or email"
                    />
                  </label>

                  <label className="span">
                    Where are you based?
                    <select
                      name="basedIn"
                      value={enqBasedIn}
                      onChange={(e) => setEnqBasedIn(e.target.value)}
                    >
                      {BASED_IN_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="span">
                    Requirements / notes (optional)
                    <textarea
                      name="notes"
                      rows={2}
                      value={enqNotes}
                      onChange={(e) => setEnqNotes(e.target.value)}
                      placeholder="Bedrooms, purpose (home or investment), or specific questions"
                    />
                  </label>
                </div>

                {formError && <p className="form-error">{formError}</p>}

                <div className="form-actions">
                  <button type="submit" className="button primary">
                    Send enquiry{' '}
                    <svg aria-hidden="true">
                      <use href="#i-arrow" />
                    </svg>
                  </button>

                  <a
                    className="button whatsapp-button"
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp {WHATSAPP_DISPLAY} ↗
                  </a>
                </div>
              </form>
            </>
          )}
        </>
      );
    }

    if (activeModal.type === 'submitted') {
      return (
        <>
          <h2 id="modal-title">Enquiry submitted.</h2>
          <p>
            Your request has been logged for the MIRVAI team and is available inside Enquiries.
          </p>
          <div className="form-actions">
            <button type="button" className="button primary" onClick={onGoEnquiries}>
              Open App Enquiries{' '}
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </button>
            <a
              className="button whatsapp-button"
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {WHATSAPP_DISPLAY} ↗
            </a>
          </div>
        </>
      );
    }

    return (
      <>
        <h2 id="modal-title">Talk to MIRVAI</h2>
        <p>
          Speak directly with our Lagos advisory team on WhatsApp or send a tailored property
          enquiry below.
        </p>
        <div className="form-actions">
          <a
            className="button whatsapp-button"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp ({WHATSAPP_DISPLAY}) ↗
          </a>
          <button type="button" className="button primary" onClick={() => onOpenForm('enquire')}>
            Make a website enquiry{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <dialog
        id="menu-panel"
        ref={drawerRef}
        className="drawer"
        aria-labelledby="menu-title"
        onClose={onCloseMenu}
      >
        <div className="dialog-top">
          <span className="eyebrow" id="menu-title">
            MIRVAI / MENU
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={onCloseMenu}
            aria-label="Close menu"
          >
            <svg aria-hidden="true">
              <use href="#i-close" />
            </svg>
          </button>
        </div>

        <nav aria-label="MIRVAI navigation">
          <button type="button" className="menu-main" onClick={onBrowseProperties}>
            The Lagos Collection{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </button>

          <details className="menu-categories">
            <summary>Browse property types</summary>
            <div id="menu-types">
              {categories.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className="menu-link"
                  onClick={() => onMenuFilterSelect(id)}
                >
                  {label}
                  <svg aria-hidden="true">
                    <use href="#i-arrow" />
                  </svg>
                </button>
              ))}
            </div>
          </details>

          <button type="button" className="menu-link" onClick={onOpenContactFromMenu}>
            Contact
          </button>
        </nav>
      </dialog>

      <dialog
        id="modal"
        ref={modalRef}
        className="modal"
        aria-labelledby="modal-title"
        onClose={onCloseModal}
      >
        <div className="dialog-top">
          <span className="eyebrow">MIRVAI / ENQUIRY</span>
          <button
            type="button"
            className="icon-button"
            onClick={onCloseModal}
            aria-label="Close dialog"
          >
            <svg aria-hidden="true">
              <use href="#i-close" />
            </svg>
          </button>
        </div>
        <div id="modal-body">{renderModalContent()}</div>
      </dialog>

      <div className="toast" id="toast" role="status" aria-live="polite" hidden={!toastMessage}>
        {toastMessage}
      </div>
    </>
  );
};
