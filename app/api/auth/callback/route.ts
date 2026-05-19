import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  console.log('[Callback] Received request:', {
    url: request.url,
    code: code ? '***' : null,
    error,
    host: request.headers.get('host'),
  });

  if (error) {
    const errorUrl = request.headers.get('x-forwarded-proto') && request.headers.get('host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}/auth/login?error=${error}`
      : new URL(`/auth/login?error=${error}`, request.url).toString();
    return NextResponse.redirect(errorUrl);
  }

  if (!code) {
    const noCodeUrl = request.headers.get('x-forwarded-proto') && request.headers.get('host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}/auth/login?error=no_code`
      : new URL('/auth/login?error=no_code', request.url).toString();
    return NextResponse.redirect(noCodeUrl);
  }

  try {
    const supabase = getSupabase();

    console.log('[Callback] Exchanging code for session...');
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    console.log('[Callback] Exchange result:', {
      hasData: !!data,
      hasSession: !!data?.session,
      hasToken: !!data?.session?.access_token,
      error: exchangeError?.message,
    });

    if (exchangeError) {
      const errorUrl = request.headers.get('x-forwarded-proto') && request.headers.get('host')
        ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}/auth/login?error=exchange_failed`
        : new URL('/auth/login?error=exchange_failed', request.url).toString();
      console.error('[Callback] Exchange error:', exchangeError);
      return NextResponse.redirect(errorUrl);
    }

    const dashboardUrl = request.headers.get('x-forwarded-proto') && request.headers.get('host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}/dashboard`
      : new URL('/dashboard', request.url).toString();

    const response = NextResponse.redirect(dashboardUrl);

    // Set auth cookie
    if (data.session?.access_token) {
      response.cookies.set({
        name: 'token',
        value: data.session.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
      console.log('[Callback] Cookie set, redirecting to:', dashboardUrl);
    } else {
      console.warn('[Callback] No access token found in session');
    }

    return response;
  } catch (error) {
    console.error('[Callback] Fatal error:', error);
    const errorUrl = request.headers.get('x-forwarded-proto') && request.headers.get('host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}/auth/login?error=callback_failed`
      : new URL('/auth/login?error=callback_failed', request.url).toString();
    return NextResponse.redirect(errorUrl);
  }
}
