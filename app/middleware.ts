import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // If logged in and trying to access login → redirect to dashboard
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  // If NOT logged in and trying to access dashboard → redirect to login
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}
