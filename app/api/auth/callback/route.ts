import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${error}`, request.url)
    );
  }

  // Redirect to dashboard - Supabase handles session via its own cookies
  return NextResponse.redirect(
    new URL('/dashboard', request.url)
  );
}
