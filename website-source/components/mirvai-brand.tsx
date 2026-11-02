import Link from "next/link";

interface MirvaiBrandProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function MirvaiBrand({ href = "/", onClick, className = "" }: MirvaiBrandProps) {
  return (
    <Link
      className={`brand brand-wordmark flex items-center gap-2.5 sm:gap-3 group ${className}`}
      href={href}
      onClick={onClick}
      aria-label="Mirvai Realty & Investment Home"
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#d5a55d]/60 bg-[#08170f] shadow-md flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
        <img
          src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
          alt="Mirvai Crest"
          className="w-full h-full object-cover scale-110"
        />
      </div>
      <div className="flex flex-col justify-center">
        <span className="font-serif sm:font-sans tracking-[0.24em] text-[#f0eee8] text-sm sm:text-base font-bold uppercase leading-none group-hover:text-[#deb26d] transition-colors">
          MIRVAI
        </span>
        <span className="tracking-[0.22em] text-[#d5a55d] text-[8px] sm:text-[9px] font-semibold uppercase mt-1">
          FIND · GROW · INVEST
        </span>
      </div>
    </Link>
  );
}
