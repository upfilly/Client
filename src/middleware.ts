import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, css, and public static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|assets|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Clean host (remove port in development e.g. "brand.localhost:3000" -> "brand.localhost")
  const currentHost = hostname.split(':')[0].toLowerCase();

  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'upfilly.com';
  const RESERVED_HOSTS = ['upfilly.com', 'www.upfilly.com', 'localhost', '127.0.0.1'];

  let tenantSubdomain: string | null = null;

  // Case 1: Local development with subdomain (e.g. "brand.localhost")
  if (currentHost.endsWith('.localhost')) {
    tenantSubdomain = currentHost.replace('.localhost', '');
  }
  // Case 2: Production subdomain (e.g. "brand.upfilly.com" or "brand.upfilly.com")
  else if (currentHost.includes('.')) {
    const parts = currentHost.split('.');
    if (parts.length > 2) {
      const candidate = parts[0];
      if (!['www', 'api', 'admin', 'app', 'mail', 'cname', 'staging'].includes(candidate)) {
        tenantSubdomain = candidate;
      }
    }
  }
  // Case 3: Custom domain (e.g. "affiliates.clientbrand.com")
  else if (!RESERVED_HOSTS.includes(currentHost)) {
    tenantSubdomain = currentHost;
  }

  // Set request headers for downstream Server Components / API handlers
  const requestHeaders = new Headers(req.headers);
  if (tenantSubdomain) {
    requestHeaders.set('x-tenant-subdomain', tenantSubdomain);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Also expose on response headers for browser inspection
  if (tenantSubdomain) {
    response.headers.set('x-tenant-subdomain', tenantSubdomain);
  }

  return response;
}
