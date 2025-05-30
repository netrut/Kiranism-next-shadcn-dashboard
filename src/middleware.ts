import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isAuthRoute = createRouteMatcher(['/auth/(.*)']);

// This helper function handles GitHub Codespace environment
function handleGitHubCodespace(req: NextRequest): NextResponse | null {
  const url = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') || url.host;
  
  if (host.includes('.app.github.dev')) {
    const headers = new Headers(req.headers);
    headers.set('x-forwarded-host', host);
    headers.set('origin', url.origin);
    
    return NextResponse.next({
      request: {
        headers
      }
    });
  }
  return null;
}

export default clerkMiddleware((auth, req) => {
  // Handle GitHub Codespace environment
  const codespaceResponse = handleGitHubCodespace(req);
  if (codespaceResponse) return codespaceResponse;

  // Let Clerk handle the request
  return NextResponse.next();
});

// Stop Middleware running on static files and api routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml, etc. (public files)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico).*)',
  ]
};
