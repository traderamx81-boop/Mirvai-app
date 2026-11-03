import Link from "next/link";

interface MirvaiBrandProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function MirvaiBrand({ href = "/", onClick, className = "" }: MirvaiBrandProps) {
  return (
    <Link
      className={`brand brand-wordmark inline-flex items-center gap-3 group ${className}`}
      href={href}
      onClick={onClick}
      aria-label="Mirvai Group Real Estate Home"
    >
      {/* Solid Gold Square Badge with Dark Serif M matching reference image */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-sm bg-[#cca462] shadow-sm flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 select-none">
        <span className="font-serif text-2xl sm:text-[26px] font-bold text-[#082216] tracking-normal leading-none">
          M
        </span>
      </div>
      <div className="flex flex-col justify-center">
        <span className="font-serif tracking-[0.28em] text-[#082216] dark:text-[#f0eee8] text-sm sm:text-base font-bold uppercase leading-tight group-hover:text-[#cca462] transition-colors">
          MIRVAI
        </span>
        <span className="tracking-[0.22em] text-[#9b7b46] dark:text-[#cca462] text-[8px] sm:text-[9px] font-semibold uppercase mt-0.5">
          GROUP · REAL ESTATE
        </span>
      </div>
    </Link>
  );
}
