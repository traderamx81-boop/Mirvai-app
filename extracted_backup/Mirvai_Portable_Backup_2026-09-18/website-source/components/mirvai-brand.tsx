import Link from "next/link";

export default function MirvaiBrand({ href = "/", onClick }: { href?: string; onClick?: () => void }) {
  return (
    <Link className="brand brand-wordmark" href={href} onClick={onClick} aria-label="Mirvai Group home">
      <span className="brand-mark" aria-hidden="true">M</span>
      <span className="brand-name"><strong>MIRVAI</strong><small>GROUP · REAL ESTATE</small></span>
    </Link>
  );
}
