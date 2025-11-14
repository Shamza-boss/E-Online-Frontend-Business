// utils/serverFetch.ts
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiFetchOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}

export async function serverFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  // Normalize the endpoint
  const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const proxyPath = `/api/proxy/${normalized}`;

  // Build our own headers object so we can freely assign into it
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Determine URL and append server‐side headers if running on server
  let fetchUrl: string;
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // ---------------------
    // Server‐side invocation
    // ---------------------
    const session = await auth();
    if (!session) redirect('/signin');

    if (session.apiAccessToken) {
      requestHeaders['Authorization'] = `Bearer ${session.apiAccessToken}`;
    }

    fetchUrl = `${process.env.BASE_API_URL}/api/${normalized}`;
  } else {
    // ---------------------
    // Client‐side invocation
    // ---------------------
    fetchUrl = proxyPath;
  }

  // Build the fetch options
  const fetchOpts: RequestInit & { next?: { revalidate?: number } } = {
    method,
    credentials: 'include',
    headers: requestHeaders,
  };

  // Ensure data is always fresh when calling through the app router
  fetchOpts.cache = 'no-store';
  fetchOpts.next = { revalidate: 0 };

  // Attach body for JSON or FormData
  if (
    body &&
    !(body instanceof FormData) &&
    !['GET', 'HEAD'].includes(method)
  ) {
    fetchOpts.body = typeof body === 'string' ? body : JSON.stringify(body);
  } else if (body instanceof FormData) {
    fetchOpts.body = body;
    // Let the browser set the correct multipart Content-Type
    delete requestHeaders['Content-Type'];
  }

  // Timeout handling
  const controller = new AbortController();
  fetchOpts.signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(fetchUrl, fetchOpts);

    if (res.status === 401) {
      console.error('[Auth Error]: Received 401 from backend', {
        url: fetchUrl,
        headers: requestHeaders,
      });
      redirect('/signin');
    }

    if (!res.ok) {
      const text = await res.text();
      const ref = crypto.randomUUID();
      console.error(`[API Error – ${ref}]: ${res.status} – ${text}`);
      redirect(`/error/server-error?ref=${ref}` as const);
    }

    // Handle empty/no-content
    const responseText = await res.text();
    if (!responseText) return null as unknown as T;

    return JSON.parse(responseText) as T;
  } catch (error: any) {
    const ref = crypto.randomUUID();
    console.error(`[API Error – ${ref}]: Connection failed`, {
      error,
      url: fetchUrl,
      headers: requestHeaders,
    });

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
