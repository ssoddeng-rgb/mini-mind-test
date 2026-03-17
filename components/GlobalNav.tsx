'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:border-white/20 transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shadow-lg"
        aria-label="홈으로 이동"
      >
        <span className="text-base">🏠</span>
        <span className="hidden sm:inline">홈</span>
      </Link>
    </div>
  );
}
