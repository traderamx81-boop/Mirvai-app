import React, { useRef } from 'react';
import {
  AppScreen,
  categories,
  categoryLabel,
  HomeListing,
  ngn,
  ReviewRequest,
  stockImages,
} from '../lib/courtyardReview';

interface ReviewAppViewProps {
  hidden: boolean;
  appScreen: AppScreen;
  appFilter: string;
  visibleListings: HomeListing[];
  savedListings: HomeListing[];
  requests: ReviewRequest[];
  portraitUrl: string;
  onSelectScreen: (screen: AppScreen) => void;
  onFilterChange: (categoryId: string) => void;
  onJumpToWebsiteProperties: () => void;
  onOpenMenu: () => void;
  onOpenProperty: (propertyId: string) => void;
  onEnquire: (propertyId?: string) => void;
  onPortraitFileChange: (file: File | undefined, resetInput: () => void) => void;
  onClearPortrait: () => void;
}

export const ReviewAppView: React.FC<ReviewAppViewProps> = ({
  hidden,
  appScreen,
  appFilter,
  visibleListings,
  savedListings,
  requests,
  portraitUrl,
  onSelectScreen,
  onFilterChange,
  onJumpToWebsiteProperties,
  onOpenMenu,
  onOpenProperty,
  onEnquire,
  onPortraitFileChange,
  onClearPortrait,
}) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const filterOptions: [string, string][] = [['all', 'All properties'], ...categories];

  const handleScreenSelect = (next: AppScreen) => {
    onSelectScreen(next);
    if (screenRef.current) {
      screenRef.current.scrollTop = 0;
    }
  };

  const renderAppCards = (list: HomeListing[], emptyMessage: string) => {
    if (list.length === 0) {
      return <p className="empty">{emptyMessage}</p>;
    }
    return list.map((item) => {
      const art = item.photo ? stockImages[item.photo] : undefined;
      return (
        <article key={item.id} className="app-card">
          <button
            type="button"
            className="property-image"
            aria-label={`View ${item.name}`}
            onClick={() => onOpenProperty(item.id)}
          >
            {art ? (
              <img loading="lazy" src={art.src} alt={art.alt} width={1050} height={700} />
            ) : (
              <span className="image-placeholder">
                <svg aria-hidden="true">
                  <use href="#i-home" />
                </svg>{' '}
                Concept listing
              </span>
            )}
          </button>
          <div>
            <p className="mini-meta">
              {item.locale} · Lagos {item.area} · {categoryLabel(item.type)}
            </p>
            <h3>
              <button type="button" onClick={() => onOpenProperty(item.id)}>
                {item.name}
              </button>
            </h3>
            <span className="price">
              {ngn(item.price)} <span className="mini-meta">· sample price</span>
            </span>
          </div>
        </article>
      );
    });
  };

  return (
    <section id="app" data-surface="" hidden={hidden} className="workspace">
      <div className="workspace-inner app-layout">
        <aside className="workspace-notes">
          <p className="eyebrow">THE CLIENT APP / PROTOTYPE</p>
          <h1>
            At home,
            <br />
            <em>wherever you are.</em>
          </h1>
          <p>
            Find a home, save it and request a viewing. Your sample activity stays on this device
            and also appears in the Team view.
          </p>
          <ol className="journey">
            <li>Explore the Lagos Collection.</li>
            <li>Open a property to save it or try a viewing.</li>
            <li>Check Enquiries for the request.</li>
          </ol>
          <button type="button" className="text-button" onClick={onJumpToWebsiteProperties}>
            Browse website properties{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </button>
        </aside>

        <div className="device">
          <div className="device-head">
            <button
              type="button"
              className="icon-button"
              onClick={onOpenMenu}
              aria-label="Open app menu"
            >
              <svg aria-hidden="true">
                <use href="#i-menu" />
              </svg>
            </button>
            <div className="wordmark">MIRVAI</div>
            <button
              type="button"
              className="icon-button"
              onClick={() => handleScreenSelect('profile')}
              aria-label="Open profile"
            >
              <svg aria-hidden="true">
                <use href="#i-profile" />
              </svg>
            </button>
          </div>

          <div className="device-content" id="app-screen" ref={screenRef}>
            {appScreen === 'home' && (
              <>
                <div className="device-banner">
                  <p className="eyebrow">Lagos Island &amp; Mainland</p>
                  <h2>Explore homes.</h2>
                  <p>See what fits your next chapter.</p>
                </div>
                <img
                  className="device-cover"
                  src="/assets/courtyard.webp"
                  alt={stockImages.courtyard.alt}
                />
                <div className="screen-inner">
                  <div className="filters" aria-label="App property categories">
                    {filterOptions.map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        data-filter={id}
                        data-filter-surface="app"
                        aria-pressed={appFilter === id}
                        onClick={() => onFilterChange(id)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="app-cards">
                    {renderAppCards(
                      visibleListings,
                      'No sample properties match this selection. Try another category or area.'
                    )}
                  </div>
                  <p className="fineprint">Sample properties and prices.</p>
                </div>
              </>
            )}

            {appScreen === 'saved' && (
              <div className="screen-inner">
                <p className="eyebrow">YOUR SHORTLIST</p>
                <h2>Saved homes.</h2>
                <div className="app-cards">
                  {renderAppCards(
                    savedListings,
                    'No saved homes yet. Open a sample listing and save it to your shortlist.'
                  )}
                </div>
              </div>
            )}

            {appScreen === 'enquiries' && (
              <div className="screen-inner">
                <p className="eyebrow">YOUR ACTIVITY</p>
                <h2>Enquiries.</h2>
                <p className="inline-note">
                  This is a local demo. Website messaging is incoming; no one receives these
                  requests.
                </p>
                {requests.length === 0 ? (
                  <p className="empty">No requests yet. Try a sample viewing or enquiry.</p>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} className="item-row">
                      <div>
                        <strong>
                          {req.kind} · {req.title}
                        </strong>
                        <span>{req.summary}</span>
                        <span>{req.reviewed ? 'Reviewed in demo' : 'New · demo only'}</span>
                      </div>
                    </div>
                  ))
                )}
                <div className="actions">
                  <button
                    type="button"
                    className="button dark"
                    onClick={() => onEnquire()}
                  >
                    Try a general enquiry
                  </button>
                </div>
              </div>
            )}

            {appScreen === 'profile' && (
              <div className="screen-inner">
                <p className="eyebrow">YOUR DASHBOARD</p>
                <h2>Client profile.</h2>
                {portraitUrl ? (
                  <img
                    className="avatar"
                    src={portraitUrl}
                    alt="Your local profile photo preview"
                  />
                ) : (
                  <div className="avatar" aria-label="Demo avatar">
                    M
                  </div>
                )}
                <p>Demo buyer</p>
                <p className="inline-note">
                  Choose a profile photo to preview it here. The image is not uploaded or kept after
                  this page closes.
                </p>
                <label className="form-field">
                  Profile photo{' '}
                  <input
                    id="portrait"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => {
                      const input = e.currentTarget;
                      onPortraitFileChange(input.files?.[0], () => {
                        input.value = '';
                      });
                    }}
                  />
                </label>
                {portraitUrl && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={onClearPortrait}
                  >
                    Remove photo
                  </button>
                )}
                <p className="inline-note">
                  Live accounts, messages and payments are not connected.
                </p>
              </div>
            )}
          </div>

          <nav className="dock" aria-label="Client app">
            <button
              type="button"
              data-app="home"
              aria-pressed={appScreen === 'home'}
              onClick={() => handleScreenSelect('home')}
            >
              <svg aria-hidden="true">
                <use href="#i-home" />
              </svg>
              Explore
            </button>
            <button
              type="button"
              data-app="saved"
              aria-pressed={appScreen === 'saved'}
              onClick={() => handleScreenSelect('saved')}
            >
              <svg aria-hidden="true">
                <use href="#i-saved" />
              </svg>
              Saved
            </button>
            <button
              type="button"
              data-app="enquiries"
              aria-pressed={appScreen === 'enquiries'}
              onClick={() => handleScreenSelect('enquiries')}
            >
              <svg aria-hidden="true">
                <use href="#i-chat" />
              </svg>
              Enquiries
            </button>
            <button
              type="button"
              data-app="profile"
              aria-pressed={appScreen === 'profile'}
              onClick={() => handleScreenSelect('profile')}
            >
              <svg aria-hidden="true">
                <use href="#i-profile" />
              </svg>
              Profile
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
};
