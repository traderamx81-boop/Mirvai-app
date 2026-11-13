import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppScreen,
  createReviewRequest,
  EnquiryPayload,
  filterHomes,
  homeById,
  HomeListing,
  loadReviewState,
  markRequestAsReviewed,
  pathForView,
  removeListing,
  resolveViewFromPath,
  ReviewState,
  saveReviewState,
  SurfaceView,
  toggleId,
  upsertListing,
} from './lib/courtyardReview';
import {
  subscribeToConvexRealtime,
  syncEnquiryCreate,
  syncEnquiryReview,
  syncListingCreateOrUpdate,
  syncListingDelete,
} from './lib/convexSync';
import { ReviewWebsiteView } from './components/ReviewWebsiteView';
import { ReviewAppView } from './components/ReviewAppView';
import { ReviewTeamView } from './components/ReviewTeamView';
import { ActiveModal, ReviewDialogs } from './components/ReviewDialogs';

const ACCEPTED_PORTRAIT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_PORTRAIT_BYTES = 8 * 1024 * 1024;
const SYNC_CHANNEL = 'mirvai-courtyard-sync';

export function App() {
  const [state, setState] = useState<ReviewState>(() => loadReviewState());
  const [view, setView] = useState<SurfaceView>(() =>
    resolveViewFromPath(window.location.pathname, window.location.hash)
  );
  const [appScreen, setAppScreen] = useState<AppScreen>('home');
  const [webFilter, setWebFilter] = useState<string>('all');
  const [webArea, setWebArea] = useState<string>('all');
  const [webQuery, setWebQuery] = useState<string>('');
  const [appFilter, setAppFilter] = useState<string>('all');
  const [appQuery, setAppQuery] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [portraitUrl, setPortraitUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const portraitRef = useRef<string>('');
  const channelRef = useRef<BroadcastChannel | null>(null);

  const persistAndBroadcast = (nextState: ReviewState) => {
    saveReviewState(nextState);
    try {
      channelRef.current?.postMessage(nextState);
    } catch {
      // BroadcastChannel unavailable in older runtimes
    }
  };

  useEffect(() => {
    saveReviewState(state);
  }, [state]);

  useEffect(() => {
    portraitRef.current = portraitUrl;
  }, [portraitUrl]);

  // Cross-tab realtime sync + popstate routing + live Convex WebSocket subscription
  useEffect(() => {
    let mounted = true;

    try {
      const bc = new BroadcastChannel(SYNC_CHANNEL);
      bc.onmessage = (event) => {
        if (mounted && event.data && Array.isArray(event.data.listings)) {
          setState(event.data as ReviewState);
        }
      };
      channelRef.current = bc;
    } catch {
      // BroadcastChannel optional
    }

    const onStorage = () => {
      if (mounted) {
        setState(loadReviewState());
      }
    };

    const onPopState = () => {
      setMenuOpen(false);
      setActiveModal(null);
      setView(resolveViewFromPath(window.location.pathname, window.location.hash));
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);

    const stopConvex = subscribeToConvexRealtime({
      onProperties: (listings, drafts) => {
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          listings: listings.length > 0 ? listings : prev.listings,
          drafts,
        }));
      },
      onRequests: (requests) => {
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          requests: requests.length > 0 ? requests : prev.requests,
        }));
      },
    });

    return () => {
      mounted = false;
      stopConvex();
      channelRef.current?.close();
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (portraitRef.current) URL.revokeObjectURL(portraitRef.current);
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const navigateToView = (next: SurfaceView, scrollToTop = true, hash = '') => {
    const nextUrl = pathForView(next) + hash;
    if (window.location.pathname + window.location.hash !== nextUrl) {
      window.history.pushState(null, '', nextUrl);
    }
    setView(next);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  const jumpToWebsiteSection = (sectionId: string) => {
    setMenuOpen(false);
    setActiveModal(null);
    navigateToView('website', false, `#${sectionId}`);
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView();
    });
  };

  const webListings = useMemo(
    () => filterHomes(webFilter, webArea, state.drafts, state.listings, webQuery),
    [webFilter, webArea, state.drafts, state.listings, webQuery]
  );

  const appListings = useMemo(
    () => filterHomes(appFilter, 'all', state.drafts, state.listings, appQuery),
    [appFilter, state.drafts, state.listings, appQuery]
  );

  const savedListings = useMemo(
    () =>
      state.saved
        .map((id) => homeById(id, state.listings))
        .filter((item): item is HomeListing =>
          Boolean(item && !state.drafts.includes(item.id))
        ),
    [state.saved, state.drafts, state.listings]
  );

  const updateStateAndSync = (updater: (prev: ReviewState) => ReviewState) => {
    setState((prev) => {
      const next = updater(prev);
      persistAndBroadcast(next);
      return next;
    });
  };

  const handleToggleSave = (propertyId: string) => {
    updateStateAndSync((prev) => ({
      ...prev,
      saved: toggleId(prev.saved, propertyId),
    }));
  };

  const handleOpenProperty = (propertyId: string) => {
    setMenuOpen(false);
    setActiveModal({ type: 'property', id: propertyId });
  };

  const handleOpenForm = (kind: 'viewing' | 'enquire', propertyId?: string) => {
    setMenuOpen(false);
    setActiveModal({ type: 'form', kind, id: propertyId });
  };

  const handleOpenContact = () => {
    setMenuOpen(false);
    setActiveModal({ type: 'contact' });
  };

  const handleSubmitForm = (
    kind: 'viewing' | 'enquire',
    summary: string,
    propertyId?: string,
    extra?: EnquiryPayload
  ) => {
    const newRequest = createReviewRequest(
      kind,
      summary,
      propertyId,
      undefined,
      state.listings,
      extra
    );
    updateStateAndSync((prev) => ({
      ...prev,
      requests: [newRequest, ...prev.requests].slice(0, 100),
    }));
    setActiveModal({ type: 'submitted' });

    void syncEnquiryCreate(newRequest).then((convexId) => {
      if (convexId) {
        updateStateAndSync((prev) => ({
          ...prev,
          requests: prev.requests.map((r) =>
            r.id === newRequest.id ? { ...r, convexId } : r
          ),
        }));
      }
    });
  };

  const handleGoEnquiries = () => {
    setActiveModal(null);
    navigateToView('app', true);
    setAppScreen('enquiries');
  };

  const handleMarkReviewed = (requestId: string) => {
    const target = state.requests.find((r) => r.id === requestId);
    updateStateAndSync((prev) => ({
      ...prev,
      requests: markRequestAsReviewed(prev.requests, requestId),
    }));
    showToast('Enquiry marked as reviewed.');
    if (target) {
      void syncEnquiryReview(target, true);
    }
  };

  const handleToggleInventoryDraft = (propertyId: string) => {
    const willBeDraft = !state.drafts.includes(propertyId);
    const listing = state.listings.find((item) => item.id === propertyId);

    updateStateAndSync((prev) => ({
      ...prev,
      drafts: toggleId(prev.drafts, propertyId),
    }));
    showToast(willBeDraft ? 'Listing moved to draft.' : 'Listing published live.');

    if (listing) {
      void syncListingCreateOrUpdate('update', listing, willBeDraft);
    }
  };

  const handleSaveListing = (listing: HomeListing, publish: boolean) => {
    const isExisting = state.listings.some((item) => item.id === listing.id);
    const isDraft = !publish;

    updateStateAndSync((prev) => ({
      ...prev,
      listings: upsertListing(prev.listings, listing),
      drafts: publish
        ? prev.drafts.filter((id) => id !== listing.id)
        : prev.drafts.includes(listing.id)
          ? prev.drafts
          : [...prev.drafts, listing.id],
    }));

    showToast(isExisting ? 'Listing updated.' : 'New listing created.');

    void syncListingCreateOrUpdate(isExisting ? 'update' : 'add', listing, isDraft).then(
      (convexId) => {
        if (convexId && !listing.convexId) {
          updateStateAndSync((prev) => ({
            ...prev,
            listings: prev.listings.map((item) =>
              item.id === listing.id ? { ...item, convexId } : item
            ),
          }));
        }
      }
    );
  };

  const handleDeleteListing = (listing: HomeListing) => {
    updateStateAndSync((prev) => ({
      ...prev,
      listings: removeListing(prev.listings, listing.id),
      drafts: prev.drafts.filter((id) => id !== listing.id),
      saved: prev.saved.filter((id) => id !== listing.id),
    }));
    showToast('Listing deleted.');
    void syncListingDelete(listing);
  };

  const handleMenuFilterSelect = (categoryId: string) => {
    setMenuOpen(false);
    if (view === 'app') {
      setAppScreen('home');
      setAppFilter(categoryId);
      requestAnimationFrame(() => {
        const screen = document.getElementById('app-screen');
        if (screen) screen.scrollTop = 0;
        const btn = document.querySelector<HTMLButtonElement>(
          `[data-filter-surface="app"][data-filter="${categoryId}"]`
        );
        btn?.focus({ preventScroll: true });
      });
    } else {
      setWebFilter(categoryId);
      jumpToWebsiteSection('properties');
    }
  };

  const handleBrowseFromMenu = () => {
    setMenuOpen(false);
    if (view === 'app') {
      setAppScreen('home');
      const screen = document.getElementById('app-screen');
      if (screen) screen.scrollTop = 0;
    } else {
      jumpToWebsiteSection('properties');
    }
  };

  const handlePortraitFileChange = (file: File | undefined, resetInput: () => void) => {
    if (!file) return;
    if (!ACCEPTED_PORTRAIT_TYPES.includes(file.type) || file.size > MAX_PORTRAIT_BYTES) {
      showToast('Choose a JPG, PNG, WebP or AVIF image up to 8 MB.');
      resetInput();
      return;
    }
    if (portraitUrl) URL.revokeObjectURL(portraitUrl);
    setPortraitUrl(URL.createObjectURL(file));
  };

  const handleClearPortrait = () => {
    if (portraitUrl) URL.revokeObjectURL(portraitUrl);
    setPortraitUrl('');
  };

  return (
    <>
      <svg className="symbols" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <symbol id="i-menu" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h12" />
        </symbol>
        <symbol id="i-close" viewBox="0 0 24 24">
          <path d="m6 6 12 12M18 6 6 18" />
        </symbol>
        <symbol id="i-down" viewBox="0 0 24 24">
          <path d="M6 6l12 12M8 18h10V8" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M4 12h15m-6-6 6 6-6 6" />
        </symbol>
        <symbol id="i-home" viewBox="0 0 24 24">
          <path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" />
        </symbol>
        <symbol id="i-saved" viewBox="0 0 24 24">
          <path d="M6 3h12v18l-6-4-6 4z" />
        </symbol>
        <symbol id="i-chat" viewBox="0 0 24 24">
          <path d="M21 4H3v13h4v4l5-4h9zM7 9h10M7 12h6" />
        </symbol>
        <symbol id="i-profile" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2" />
        </symbol>
        <symbol id="i-lock" viewBox="0 0 24 24">
          <rect x="5" y="10" width="14" height="11" rx="1" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
        </symbol>
      </svg>

      <main>
        {view === 'website' && (
          <ReviewWebsiteView
            hidden={false}
            webFilter={webFilter}
            webArea={webArea}
            webQuery={webQuery}
            listings={webListings}
            onFilterChange={setWebFilter}
            onAreaChange={setWebArea}
            onQueryChange={setWebQuery}
            onResetFilters={() => {
              setWebFilter('all');
              setWebArea('all');
              setWebQuery('');
            }}
            onOpenMenu={() => setMenuOpen(true)}
            onEnquire={(id) => handleOpenForm('enquire', id)}
            onContact={handleOpenContact}
            onOpenProperty={handleOpenProperty}
          />
        )}

        {view === 'app' && (
          <ReviewAppView
            hidden={false}
            appScreen={appScreen}
            appFilter={appFilter}
            appQuery={appQuery}
            visibleListings={appListings}
            savedListings={savedListings}
            requests={state.requests}
            portraitUrl={portraitUrl}
            onSelectScreen={setAppScreen}
            onFilterChange={setAppFilter}
            onQueryChange={setAppQuery}
            onJumpToWebsiteProperties={() => jumpToWebsiteSection('properties')}
            onOpenMenu={() => setMenuOpen(true)}
            onOpenProperty={handleOpenProperty}
            onEnquire={(id) => handleOpenForm('enquire', id)}
            onPortraitFileChange={handlePortraitFileChange}
            onClearPortrait={handleClearPortrait}
          />
        )}

        {view === 'team' && (
          <ReviewTeamView
            hidden={false}
            listings={state.listings}
            requests={state.requests}
            drafts={state.drafts}
            onNavigateWebsite={() => navigateToView('website', true)}
            onNavigateApp={() => navigateToView('app', true)}
            onMarkReviewed={handleMarkReviewed}
            onToggleInventoryDraft={handleToggleInventoryDraft}
            onSaveListing={handleSaveListing}
            onDeleteListing={handleDeleteListing}
            onNotify={showToast}
          />
        )}
      </main>

      <ReviewDialogs
        menuOpen={menuOpen}
        activeModal={activeModal}
        listings={state.listings}
        savedIds={state.saved}
        toastMessage={toastMessage}
        onCloseMenu={() => setMenuOpen(false)}
        onBrowseProperties={handleBrowseFromMenu}
        onMenuFilterSelect={handleMenuFilterSelect}
        onOpenContactFromMenu={handleOpenContact}
        onCloseModal={() => setActiveModal(null)}
        onToggleSave={handleToggleSave}
        onOpenForm={handleOpenForm}
        onSubmitForm={handleSubmitForm}
        onGoEnquiries={handleGoEnquiries}
      />
    </>
  );
}

export default App;
