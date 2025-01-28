// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-revalidate-token');
  
  if (token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const { path, tag } = await request.json();

  if (path) {
    revalidatePath(path);
  }
  
  if (tag) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}