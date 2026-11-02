import { useState, useEffect } from 'react';

export function useSearchParams(): URLSearchParams {
  const [params, setParams] = useState<URLSearchParams>(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  });

  useEffect(() => {
    const handleNav = () => {
      setParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('mirvai:navigate', handleNav);
    window.addEventListener('popstate', handleNav);
    return () => {
      window.removeEventListener('mirvai:navigate', handleNav);
      window.removeEventListener('popstate', handleNav);
    };
  }, []);

  return params;
}

export function usePathname(): string {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  });

  useEffect(() => {
    const handleNav = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('mirvai:navigate', handleNav);
    window.addEventListener('popstate', handleNav);
    return () => {
      window.removeEventListener('mirvai:navigate', handleNav);
      window.removeEventListener('popstate', handleNav);
    };
  }, []);

  return pathname;
}

export function useRouter() {
  return {
    push: (url: string) => {
      try {
        window.history.pushState(null, '', url);
      } catch {}
      window.dispatchEvent(new CustomEvent('mirvai:navigate', { detail: { href: url } }));
    },
    replace: (url: string) => {
      try {
        window.history.replaceState(null, '', url);
      } catch {}
      window.dispatchEvent(new CustomEvent('mirvai:navigate', { detail: { href: url } }));
    },
    back: () => {
      window.history.back();
    },
    forward: () => {
      window.history.forward();
    },
    refresh: () => {
      window.location.reload();
    },
  };
}

export function notFound(): never {
  throw new Error('NEXT_NOT_FOUND');
}

export function redirect(url: string): void {
  try {
    window.history.pushState(null, '', url);
  } catch {}
  window.dispatchEvent(new CustomEvent('mirvai:navigate', { detail: { href: url } }));
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 2) {
    return { slug: parts[1] } as unknown as T;
  }
  return {} as T;
}

