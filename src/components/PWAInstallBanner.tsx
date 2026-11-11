import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  // When installable on Android / Desktop Chrome / Edge
  if (isInstallable) {
    return (
      <div className="pwa-banner" role="region" aria-label="Install Mirvai App">
        <div className="pwa-banner-text">
          <strong>MIRVAI Client App</strong>
          <span>Install to your home screen for instant offline access and private advisory</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button className="button primary" onClick={install}>
            Install App
          </button>
          <button
            className="icon-button"
            aria-label="Dismiss banner"
            onClick={() => setDismissed(true)}
            style={{ padding: '0.2rem' }}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <div className="pwa-banner" role="region" aria-label="Install Mirvai on iPhone">
          <div className="pwa-banner-text">
            <strong>Install on iPhone / iPad</strong>
            <span>Add Mirvai to your Home Screen for a native standalone experience</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button className="button primary" onClick={() => setShowIOSGuide(true)}>
              How to Install
            </button>
            <button
              className="icon-button"
              aria-label="Dismiss banner"
              onClick={() => setDismissed(true)}
              style={{ padding: '0.2rem' }}
            >
              ✕
            </button>
          </div>
        </div>

        {showIOSGuide && (
          <dialog
            open
            className="modal"
            style={{ zIndex: 9999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIOSGuide(false);
            }}
          >
            <div className="dialog-top">
              <span className="eyebrow">INSTALL ON IOS SAFARI</span>
              <button className="icon-button" onClick={() => setShowIOSGuide(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <h2>Add to Home Screen</h2>
            <p>To run MIRVAI as a standalone app on your iPhone or iPad:</p>
            <ol style={{ paddingLeft: '1.2rem', margin: '1rem 0', color: 'var(--muted)', lineHeight: '1.7' }}>
              <li>
                Tap the <strong>Share</strong> button (box with an arrow pointing up) in Safari’s bottom toolbar.
              </li>
              <li>
                Scroll down and select <strong>Add to Home Screen</strong>.
              </li>
              <li>
                Confirm <strong>Add</strong> at top right.
              </li>
            </ol>
            <p className="fineprint">
              The app will launch full screen with its own icon, without Safari navigation bars.
            </p>
            <button className="button primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setShowIOSGuide(false)}>
              Got it
            </button>
          </dialog>
        )}
      </>
    );
  }

  // Fallback for general browsers: show an install info card
  return (
    <div className="pwa-banner" role="region" aria-label="Mirvai App Installation">
      <div className="pwa-banner-text">
        <strong>Installable Mobile App</strong>
        <span>Open in Chrome or Safari on your phone to install directly or package for Google Play Store</span>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <button
          className="button outline"
          style={{ fontSize: '0.75rem', minHeight: '34px', padding: '0.3rem 0.6rem' }}
          onClick={() => {
            alert('To install on your phone:\n1. Open this link on your phone in Chrome or Safari.\n2. Tap the browser menu (⋮ or Share) and choose "Add to Home screen" or "Install app".');
          }}
        >
          Install Instructions
        </button>
        <button
          className="icon-button"
          aria-label="Dismiss banner"
          onClick={() => setDismissed(true)}
          style={{ padding: '0.2rem' }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
