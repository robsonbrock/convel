import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${appUrl}/dashboard`,
      },
    });

    if (error || !data.url) {
      return NextResponse.json(
        { message: 'Erro ao conectar com Google' },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { message: 'Erro ao processar autenticação' },
      { status: 500 }
    );
  }
}
