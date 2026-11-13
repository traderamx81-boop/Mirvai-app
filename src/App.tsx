import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppScreen,
  createReviewRequest,
  filterHomes,
  homeById,
  homes,
  loadReviewState,
  markRequestAsReviewed,
  pathForView,
  resolveViewFromPath,
  ReviewState,
  saveReviewState,
  SurfaceView,
  toggleId,
} from './lib/courtyardReview';
import { ReviewWebsiteView } from './components/ReviewWebsiteView';
import { ReviewAppView } from './components/ReviewAppView';
import { ReviewTeamView } from './components/ReviewTeamView';
import { ActiveModal, ReviewDialogs } from './components/ReviewDialogs';

const ACCEPTED_PORTRAIT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_PORTRAIT_BYTES = 8 * 1024 * 1024;

export function App() {
  const [state, setState] = useState<ReviewState>(() => loadReviewState());
  const [view, setView] = useState<SurfaceView>(() => resolveViewFromPath(window.location.pathname));
  const [appScreen, setAppScreen] = useState<AppScreen>('home');
  const [webFilter, setWebFilter] = useState<string>('all');
  const [webArea, setWebArea] = useState<string>('all');
  const [appFilter, setAppFilter] = useState<string>('all');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [portraitUrl, setPortraitUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const portraitRef = useRef<string>('');

  useEffect(() => {
    saveReviewState(state);
  }, [state]);

  useEffect(() => {
    portraitRef.current = portraitUrl;
  }, [portraitUrl]);

  useEffect(() => {
    const onPopState = () => {
      setMenuOpen(false);
      setActiveModal(null);
      setView(resolveViewFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    return () => {
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
    () => filterHomes(webFilter, webArea, state.drafts, homes),
    [webFilter, webArea, state.drafts]
  );

  const appListings = useMemo(
    () => filterHomes(appFilter, 'all', state.drafts, homes),
    [appFilter, state.drafts]
  );

  const savedListings = useMemo(
    () =>
      state.saved
        .map((id) => homeById(id))
        .filter((item): item is NonNullable<typeof item> =>
          Boolean(item && !state.drafts.includes(item.id))
        ),
    [state.saved, state.drafts]
  );

  const handleToggleSave = (propertyId: string) => {
    setState((prev) => ({
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

  const handleSubmitForm = (kind: 'viewing' | 'enquire', summary: string, propertyId?: string) => {
    const newRequest = createReviewRequest(kind, summary, propertyId);
    setState((prev) => ({
      ...prev,
      requests: [newRequest, ...prev.requests].slice(0, 40),
    }));
    setActiveModal({ type: 'submitted' });
  };

  const handleGoEnquiries = () => {
    setActiveModal(null);
    navigateToView('app', true);
    setAppScreen('enquiries');
  };

  const handleMarkReviewed = (requestId: string) => {
    setState((prev) => ({
      ...prev,
      requests: markRequestAsReviewed(prev.requests, requestId),
    }));
    showToast('Sample request marked as reviewed.');
  };

  const handleToggleInventoryDraft = (propertyId: string) => {
    setState((prev) => ({
      ...prev,
      drafts: toggleId(prev.drafts, propertyId),
    }));
    showToast('Sample inventory updated.');
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
            listings={webListings}
            onFilterChange={setWebFilter}
            onAreaChange={setWebArea}
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
            visibleListings={appListings}
            savedListings={savedListings}
            requests={state.requests}
            portraitUrl={portraitUrl}
            onSelectScreen={setAppScreen}
            onFilterChange={setAppFilter}
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
            requests={state.requests}
            drafts={state.drafts}
            onMarkReviewed={handleMarkReviewed}
            onToggleInventoryDraft={handleToggleInventoryDraft}
          />
        )}
      </main>

      <ReviewDialogs
        menuOpen={menuOpen}
        activeModal={activeModal}
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
