import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simplified middleware - no authentication required
// All Supabase functionality has been removed from this project
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Add security headers
  res.headers.set('x-frame-options', 'DENY');
  res.headers.set('x-content-type-options', 'nosniff');
  res.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
