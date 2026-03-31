'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (
    pathname === '/portal/login' ||
    pathname === '/portal/change-password' ||
    pathname === '/portal/cotizaciones'
  ) {
    return <>{children}</>;
  }

  return <PortalAuthLayout>{children}</PortalAuthLayout>;
}

function PortalAuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === '/portal/cotizaciones') {
      setChecked(true);
      return;
    }
    if (loading) return;
    if (!user || user.role !== 'cliente') {
      router.replace('/portal/login');
    } else if (user.mustChangePassword) {
      router.replace('/portal/change-password');
    } else {
      setChecked(true);
    }
  }, [user, loading, router, pathname]);

  if (pathname === '/portal/cotizaciones') {
    return <>{children}</>;
  }

  if (loading || !checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#0a2a6e] via-[#0d1f4e] to-[#1565c0]">
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/LOGO.png" alt="PERITUS" className="h-10 w-auto brightness-0 invert animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2a6e] via-[#0d1f4e] to-[#1565c0]">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/LOGO.png" alt="PERITUS" className="h-14 w-auto brightness-0 invert" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white">{user?.displayName}</span>
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.replace('/portal/login');
              }}
              className="flex items-center gap-1.5 text-sm text-white hover:text-white/80 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
    </div>
  );
}
