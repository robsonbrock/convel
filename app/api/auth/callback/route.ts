import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');

  if (error) {
    console.error('[Auth Callback] OAuth error:', error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${error}`, request.url)
    );
  }

  console.log('[Auth Callback] Redirecting to dashboard');
  // Redirect to dashboard and let the Supabase client handle session detection
  return NextResponse.redirect(
    new URL('/dashboard', request.url)
  );
}
