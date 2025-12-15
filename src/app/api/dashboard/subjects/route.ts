import { NextRequest, NextResponse } from 'next/server';
import { createSubject } from '@/app/_lib/actions/subjects';
import type { SubjectDto } from '@/app/_lib/interfaces/types';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as SubjectDto;
    const created = await createSubject(payload);
    return NextResponse.json(created);
  } catch (error) {
    console.error('[api][dashboard][subjects] creation failed', error);
    return NextResponse.json(
      { message: 'Unable to create subject right now.' },
      { status: 500 }
    );
  }
}
