import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { message: 'Erro ao conectar com Google' },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: data.url }, { status: 200 });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { message: 'Erro ao processar autenticação' },
      { status: 500 }
    );
  }
}
