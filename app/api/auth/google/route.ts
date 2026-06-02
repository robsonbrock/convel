import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAsync } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseAsync();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectTo = `${appUrl}/api/auth/callback`;

    console.log('[Google Auth] Starting OAuth flow:', { appUrl, redirectTo });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('[Google Auth] Error:', error);
      return NextResponse.json(
        { message: 'Erro ao conectar com Google' },
        { status: 400 }
      );
    }

    console.log('[Google Auth] OAuth URL returned:', data.url);
    return NextResponse.json({ url: data.url }, { status: 200 });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { message: 'Erro ao processar autenticação' },
      { status: 500 }
    );
  }
}
