import { NextRequest, NextResponse } from 'next/server';
import { createAcademics } from '@/app/_lib/actions/academics';
import type { AcademicLevelDto } from '@/app/_lib/interfaces/types';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as AcademicLevelDto;
    const created = await createAcademics(payload);
    return NextResponse.json(created);
  } catch (error) {
    console.error('[api][dashboard][academic-levels] creation failed', error);
    return NextResponse.json(
      { message: 'Unable to create academic level right now.' },
      { status: 500 }
    );
  }
}
