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

  // Never treat reserved hosts or raw IP addresses as tenant subdomains
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(currentHost);
  const isReserved = RESERVED_HOSTS.includes(currentHost) || isIpAddress;

  if (!isReserved) {
    // Case 1: Local development with subdomain (e.g. "brand.localhost")
    if (currentHost.endsWith('.localhost')) {
      const sub = currentHost.replace('.localhost', '');
      if (sub && sub !== 'localhost') {
        tenantSubdomain = sub;
      }
    }
    // Case 2: Production subdomain (e.g. "brand.upfilly.com")
    else if (currentHost.endsWith(`.${ROOT_DOMAIN}`)) {
      const sub = currentHost.replace(`.${ROOT_DOMAIN}`, '');
      if (sub && !['www', 'api', 'admin', 'app', 'mail', 'cname', 'staging', 'chat', 'script', 'store'].includes(sub)) {
        tenantSubdomain = sub;
      }
    }
    // Case 3: Custom domain (e.g. "affiliates.clientbrand.com")
    else if (!currentHost.includes(ROOT_DOMAIN)) {
      tenantSubdomain = currentHost;
    }
  }

  // Set request headers for downstream Server Components / API handlers
  const requestHeaders = new Headers(req.headers);
  if (tenantSubdomain) {
    requestHeaders.set('x-tenant-subdomain', tenantSubdomain);
  }

  // When accessing a tenant subdomain on root '/', rewrite to the tenant white-label portal
  if (tenantSubdomain && url.pathname === '/') {
    const rewriteResponse = NextResponse.rewrite(new URL('/white-label-dashboard', req.url), {
      request: {
        headers: requestHeaders,
      },
    });
    rewriteResponse.headers.set('x-tenant-subdomain', tenantSubdomain);
    return rewriteResponse;
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
