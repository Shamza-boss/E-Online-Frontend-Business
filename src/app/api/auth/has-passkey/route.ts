import { prisma } from '@/app/_lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email')?.trim().toLowerCase();

  if (!email)
    return NextResponse.json({ error: 'email required' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ existsInPrisma: false, hasPasskey: false });
  }

  const count = await prisma.authenticator.count({
    where: { userId: user.id },
  });
  return NextResponse.json({ existsInPrisma: true, hasPasskey: count > 0 });
}
