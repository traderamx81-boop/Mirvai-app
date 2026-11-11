import React, { useState, useEffect, useRef } from 'react';

interface TypewriterHeroProps {
  subtext: string;
  onExploreClick?: () => void;
}

export const TypewriterHero: React.FC<TypewriterHeroProps> = ({
  subtext,
  onExploreClick,
}) => {
  const EYEBROW_TARGET = 'LAGOS ISLAND & MAINLAND';
  const TITLE_TARGET = 'Come home to Lagos.';
  const SUBTEXT_TARGET = subtext || 'Thoughtfully selected homes. Clear guidance from your first viewing to the final paperwork.';

  const [eyebrowText, setEyebrowText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [subTextDisplay, setSubTextDisplay] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [activeStage, setActiveStage] = useState<'eyebrow' | 'title' | 'subtext' | 'done'>('eyebrow');
  const [isSkipped, setIsSkipped] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEyebrowText(EYEBROW_TARGET);
      setTitleText(TITLE_TARGET);
      setSubTextDisplay(SUBTEXT_TARGET);
      setShowButton(true);
      setActiveStage('done');
      setIsSkipped(true);
    }
  }, [SUBTEXT_TARGET]);

  useEffect(() => {
    if (isSkipped) return;

    let timeoutId: number;

    // Stage 1: Eyebrow
    if (activeStage === 'eyebrow') {
      if (eyebrowText.length < EYEBROW_TARGET.length) {
        timeoutId = window.setTimeout(() => {
          setEyebrowText(EYEBROW_TARGET.slice(0, eyebrowText.length + 1));
        }, 48); // slow, elegant typing
      } else {
        timeoutId = window.setTimeout(() => {
          setActiveStage('title');
        }, 400); // graceful pause before headline
      }
    }

    // Stage 2: Headline ("Come home to Lagos.")
    else if (activeStage === 'title') {
      if (titleText.length < TITLE_TARGET.length) {
        timeoutId = window.setTimeout(() => {
          setTitleText(TITLE_TARGET.slice(0, titleText.length + 1));
        }, 62); // slow luxury pace
      } else {
        timeoutId = window.setTimeout(() => {
          setActiveStage('subtext');
        }, 450); // graceful pause before subtext
      }
    }

    // Stage 3: Subtext
    else if (activeStage === 'subtext') {
      if (subTextDisplay.length < SUBTEXT_TARGET.length) {
        timeoutId = window.setTimeout(() => {
          setSubTextDisplay(SUBTEXT_TARGET.slice(0, subTextDisplay.length + 1));
        }, 24); // fluid, rhythmic pace
      } else {
        timeoutId = window.setTimeout(() => {
          setActiveStage('done');
          setShowButton(true); // Stage 4: Fade in button
        }, 350);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [activeStage, eyebrowText, titleText, subTextDisplay, SUBTEXT_TARGET, isSkipped]);

  // Render title with the "to Lagos." segment in italics
  const renderTitle = () => {
    const splitPoint = 'Come home '.length;
    if (titleText.length <= splitPoint) {
      return (
        <>
          {titleText}
          {activeStage === 'title' && <span className="typewriter-cursor" aria-hidden="true">|</span>}
        </>
      );
    }

    const firstPart = titleText.slice(0, splitPoint);
    const secondPart = titleText.slice(splitPoint);

    return (
      <>
        {firstPart}
        <br />
        <em>{secondPart}</em>
        {activeStage === 'title' && <span className="typewriter-cursor" aria-hidden="true">|</span>}
      </>
    );
  };

  const skipAnimation = () => {
    if (activeStage !== 'done') {
      setEyebrowText(EYEBROW_TARGET);
      setTitleText(TITLE_TARGET);
      setSubTextDisplay(SUBTEXT_TARGET);
      setShowButton(true);
      setActiveStage('done');
      setIsSkipped(true);
    }
  };

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      onClick={skipAnimation}
      style={{ cursor: activeStage !== 'done' ? 'pointer' : 'default' }}
      title={activeStage !== 'done' ? 'Click to reveal immediately' : undefined}
    >
      <p className="eyebrow hero-location" style={{ minHeight: '1.4rem' }}>
        {eyebrowText}
        {activeStage === 'eyebrow' && <span className="typewriter-cursor" aria-hidden="true">|</span>}
        {eyebrowText.length === EYEBROW_TARGET.length && (
          <span style={{ opacity: 0.6, marginLeft: '0.4rem', letterSpacing: '0.12em' }}>
            · Diaspora Advisory
          </span>
        )}
      </p>

      <h1 id="hero-title" style={{ minHeight: 'clamp(6rem, 14vw, 10rem)' }}>
        {renderTitle()}
      </h1>

      <p className="hero-copy" style={{ minHeight: '3.6rem' }}>
        {subTextDisplay}
        {activeStage === 'subtext' && <span className="typewriter-cursor" aria-hidden="true">|</span>}
      </p>

      <div
        className="hero-action-container"
        style={{
          minHeight: '52px',
          opacity: showButton ? 1 : 0,
          transform: showButton ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: showButton ? 'auto' : 'none',
        }}
      >
        <a
          className="button primary hero-explore-btn"
          href="#properties"
          onClick={(e) => {
            if (onExploreClick) {
              e.preventDefault();
              onExploreClick();
            }
          }}
        >
          Explore homes{' '}
          <svg aria-hidden="true" style={{ width: '16px', height: '16px', marginLeft: '0.35rem' }}>
            <use href="#i-down"></use>
          </svg>
        </a>
      </div>
    </section>
  );
};
