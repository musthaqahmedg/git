import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseServer } from '@/lib/supabase';

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('photo');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No photo received.' }, { status: 400 });
    }
    const ext = TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ error: 'Use a JPG, PNG or WebP photo.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Photo is too large. Keep it under 5 MB.' }, { status: 400 });
    }

    const db = supabaseServer();
    const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;
    const { error } = await db.storage
      .from('job-photos')
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data } = db.storage.from('job-photos').getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
