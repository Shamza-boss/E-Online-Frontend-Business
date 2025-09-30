// app/api/proxy/[...proxy]/route.ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Proxy route should always be dynamic and uncached
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BACKEND_URL = process.env.BASE_API_URL;

async function proxyRequest(req: NextRequest, params: string[]) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const path = params.join('/');
  let url = `${BACKEND_URL}/api/${path}`;
  const qs = req.nextUrl.search;
  if (qs) url += qs;

  const headers: Record<string, string> = {
    ...Object.fromEntries(req.headers.entries()),
    'X-User-Id': session.user.id,
    'X-User-Role': session.user.role.toString(),
    'X-User-InstitutionId': session.user.institutionId,
  };

  const init: RequestInit = {
    method: req.method,
    headers,
  };
  // only include body for non-GET/HEAD
  if (!['GET', 'HEAD'].includes(req.method)) {
    const raw = await req.text();
    try {
      const parsed = JSON.parse(raw);
      init.body = JSON.stringify({ dto: parsed });
    } catch {
      init.body = raw;
    }
  }

  const res = await fetch(url, init);

  const body = await res.arrayBuffer();
  const response = new NextResponse(body, { status: res.status });
  res.headers.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await context.params;
  return proxyRequest(req, proxy);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await context.params;
  return proxyRequest(req, proxy);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await context.params;
  return proxyRequest(req, proxy);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await context.params;
  return proxyRequest(req, proxy);
}
