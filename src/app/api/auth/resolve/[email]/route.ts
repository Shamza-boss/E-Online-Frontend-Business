import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ email: string }> }
) {
  const { email } = await ctx.params;
  const api = process.env.BASE_API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!api) {
    return NextResponse.json(
      { error: 'BASE_API_URL not configured' },
      { status: 500 }
    );
  }

  const clean = decodeURIComponent(email).trim().toLowerCase();
  const url = `${api}/api/auth/resolve/${encodeURIComponent(clean)}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    // proxy the upstream response as-is
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Upstream request failed' },
      { status: 502 }
    );
  }
}
