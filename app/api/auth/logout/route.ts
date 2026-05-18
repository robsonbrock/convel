import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: 'Logout bem-sucedido' },
    { status: 200 }
  );

  response.cookies.delete('token');

  return response;
}
