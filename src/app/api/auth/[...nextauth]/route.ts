// app/api/auth/[...nextauth]/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

import { handlers } from '@/auth';
export const { GET, POST } = handlers;
