import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Exclude static files, API routes, or media assets
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000';

  // Check if host matches subdomain structure (e.g. guest.localhost:3000 or guest.mbnp.my.id)
  if (host !== appDomain && host.endsWith(appDomain)) {
    const subdomain = host.replace(`.${appDomain}`, '');
    if (subdomain && subdomain !== 'www' && subdomain !== 'admin') {
      // Rewrite the path to /subdomain/[subdomain]/[path]
      url.pathname = `/subdomain/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
