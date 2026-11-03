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
      <div className={`relative flex items-center justify-center rounded-sm bg-[#cca462] shadow-sm select-none ${
        size === 'sm' ? 'w-8 h-8 text-lg' : size === 'lg' ? 'w-14 h-14 text-3xl' : 'w-10 h-10 text-2xl'
      } ${className}`}>
        <span className="font-serif font-bold text-[#082216]">M</span>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className="w-10 h-10 rounded-sm bg-[#cca462] shadow-sm shrink-0 flex items-center justify-center select-none">
          <span className="font-serif text-2xl font-bold text-[#082216]">M</span>
        </div>
        <div className="flex flex-col">
          <span className="font-brand text-sm tracking-[0.28em] text-[#082216] dark:text-[#f0eee8] font-bold uppercase leading-tight">
            MIRVAI
          </span>
          {showTagline && (
            <span className="text-[8px] sm:text-[9px] tracking-[0.22em] text-[#9b7b46] dark:text-[#cca462] font-semibold uppercase mt-0.5">
              GROUP · REAL ESTATE
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full variant (Hero or Splash)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className={`relative rounded-2xl border border-[#d5a55d]/50 shadow-2xl bg-[#06130b] mb-3 flex items-center justify-center ${
        size === 'hero' ? 'w-24 h-24 text-4xl' : size === 'lg' ? 'w-20 h-20 text-3xl' : 'w-14 h-14 text-2xl'
      }`}>
        <span className="font-serif font-bold text-[#d5a55d]">M</span>
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
