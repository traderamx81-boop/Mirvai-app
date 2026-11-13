import React, { useEffect, useRef } from 'react';
import {
  categories,
  categoryLabel,
  homeById,
  ngn,
  stockImages,
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
  savedIds: string[];
  toastMessage: string | null;
  onCloseMenu: () => void;
  onBrowseProperties: () => void;
  onMenuFilterSelect: (categoryId: string) => void;
  onOpenContactFromMenu: () => void;
  onCloseModal: () => void;
  onToggleSave: (propertyId: string) => void;
  onOpenForm: (kind: 'viewing' | 'enquire', propertyId?: string) => void;
  onSubmitForm: (kind: 'viewing' | 'enquire', summary: string, propertyId?: string) => void;
  onGoEnquiries: () => void;
}

export const ReviewDialogs: React.FC<ReviewDialogsProps> = ({
  menuOpen,
  activeModal,
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
      modal.scrollTop = 0;
      if (!modal.open) {
        modal.showModal();
      }
    } else if (modal.open) {
      modal.close();
    }
  }, [activeModal]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeModal?.type !== 'form') return;
    const formData = new FormData(e.currentTarget);
    const summary = Array.from(formData.values()).join(' · ');
    onSubmitForm(activeModal.kind, summary, activeModal.id);
  };

  const renderModalContent = () => {
    if (!activeModal) return null;

    if (activeModal.type === 'property') {
      const item = homeById(activeModal.id);
      if (!item) return null;
      const isSaved = savedIds.includes(item.id);
      const art = item.photo ? stockImages[item.photo] : undefined;

      return (
        <>
          <h2 id="modal-title">{item.name}</h2>
          <p className="eyebrow">
            {categoryLabel(item.type)} / {item.locale}
          </p>
          {art && (
            <img
              className="property-photo"
              src={art.src}
              alt={art.alt}
              width={1050}
              height={700}
            />
          )}
          <p>
            <strong>{ngn(item.price)}</strong> · sample asking price
            {item.beds ? ` · ${item.beds} bedrooms` : ''}
          </p>
          <p>{item.description}</p>
          <p className="fineprint">
            Example for this design review, not a verified or available listing.
          </p>
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
      const item = homeById(activeModal.id);
      const heading = activeModal.kind === 'viewing' ? 'Request a viewing' : 'Make an enquiry';

      return (
        <>
          <h2 id="modal-title">{heading}</h2>
          {item && (
            <p>
              {item.name} · {item.locale}
            </p>
          )}
          <p>
            Try the flow as Demo Buyer. No personal details are needed and nothing is sent to MIRVAI.
          </p>
          <form
            id="request-form"
            key={`${activeModal.kind}-${activeModal.id || 'general'}`}
            onSubmit={handleFormSubmit}
          >
            <div className="form-grid">
              {activeModal.kind === 'viewing' ? (
                <>
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
                </>
              ) : (
                <>
                  <label>
                    Preferred area
                    <select name="area" defaultValue="Either Lagos Island or Mainland">
                      <option>Either Lagos Island or Mainland</option>
                      <option>Lagos Island</option>
                      <option>Lagos Mainland</option>
                    </select>
                  </label>
                  <label>
                    Property type
                    <select name="type" defaultValue="Not sure yet">
                      <option>Not sure yet</option>
                      {categories.map(([, label]) => (
                        <option key={label}>{label}</option>
                      ))}
                    </select>
                  </label>
                </>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="button primary">
                Add sample request{' '}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </button>
            </div>
          </form>
        </>
      );
    }

    if (activeModal.type === 'submitted') {
      return (
        <>
          <h2 id="modal-title">Sample request added.</h2>
          <p>
            You can see the request in App Enquiries and Team view. No viewing was booked and no
            message was sent.
          </p>
          <button type="button" className="button primary" onClick={onGoEnquiries}>
            Open App Enquiries{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </button>
        </>
      );
    }

    return (
      <>
        <h2 id="modal-title">Talk to MIRVAI</h2>
        <p>
          In the live experience, choose WhatsApp or a website enquiry. In-app messaging is a future
          feature. This preview won’t open WhatsApp or send anything.
        </p>
        <button type="button" className="button primary" onClick={() => onOpenForm('enquire')}>
          Try a website enquiry{' '}
          <svg aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </button>
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
          <span className="eyebrow">MIRVAI / DESIGN REVIEW</span>
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
