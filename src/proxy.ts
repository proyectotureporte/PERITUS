import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (
    pathname === '/portal/login' ||
    pathname === '/portal/change-password' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/cotizacion') ||
    pathname.startsWith('/api/registro-peritus') ||
    pathname === '/registro'
  ) {
    return NextResponse.next();
  }

  // Protect /portal routes
  if (pathname.startsWith('/portal')) {
    const token = request.cookies.get('crm-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'cliente') {
      const response = NextResponse.redirect(new URL('/portal/login', request.url));
      response.cookies.delete('crm-token');
      return response;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub);
    requestHeaders.set('x-user-role', payload.role);
    requestHeaders.set('x-user-name', payload.displayName);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Protect API routes
  if (pathname.startsWith('/api/')) {
    const cookieToken = request.cookies.get('crm-token')?.value;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Token invalido' }, { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub);
    requestHeaders.set('x-user-role', payload.role);
    requestHeaders.set('x-user-name', payload.displayName);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/portal/:path*',
    '/api/:path*',
  ],
};
