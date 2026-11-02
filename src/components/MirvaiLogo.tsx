import React from 'react';

interface MirvaiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  variant?: 'full' | 'monogram' | 'badge';
  className?: string;
}

export const MirvaiLogo: React.FC<MirvaiLogoProps> = ({
  size = 'md',
  showTagline = true,
  variant = 'full',
  className = '',
}) => {
  if (variant === 'monogram') {
    return (
      <div className={`relative flex items-center justify-center rounded-xl overflow-hidden border border-[#d5a55d]/40 bg-[#0e1f16] shadow-md ${
        size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-base'
      } ${className}`}>
        <img
          src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
          alt="Mirvai"
          className="w-full h-full object-cover scale-125 brightness-110"
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#d5a55d]/40 bg-[#08170f] shadow-inner shrink-0">
          <img
            src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
            alt="Mirvai Crest"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-brand text-sm tracking-[0.22em] text-[#f0eee8] font-bold uppercase leading-none">
            Mirvai
          </span>
          {showTagline && (
            <span className="text-[9px] tracking-[0.25em] text-[#d5a55d] font-medium uppercase mt-1">
              Find · Grow · Invest
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full variant (Hero or Splash)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className={`relative rounded-2xl overflow-hidden border border-[#d5a55d]/40 shadow-2xl bg-[#06130b] mb-3 ${
        size === 'hero' ? 'w-28 h-28' : size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'
      }`}>
        <img
          src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
          alt="Mirvai Realty & Investment"
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="font-brand text-xl sm:text-2xl font-bold tracking-[0.28em] text-[#f7e8ce] uppercase">
        M I R V A I
      </h2>
      <div className="flex items-center gap-2 my-1">
        <span className="h-[1px] w-6 bg-[#c69a58]/40"></span>
        <span className="text-[10px] tracking-[0.3em] text-[#c69a58] font-semibold uppercase">
          Realty &amp; Investment
        </span>
        <span className="h-[1px] w-6 bg-[#c69a58]/40"></span>
      </div>
      <p className="text-[9px] tracking-[0.35em] text-[#8fa397] uppercase">
        Find . Invest . Grow .
      </p>
    </div>
  );
};
