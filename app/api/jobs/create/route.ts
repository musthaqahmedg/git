import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

const MAX_PHOTOS = 3;

export async function POST(req: Request) {
  try {
    const { service_type, location, pay, customer_name, description, bring, photos } =
      await req.json();

    if (!service_type || !location || !customer_name || !(Number(pay) > 0)) {
      return NextResponse.json(
        { error: 'Fill in the service, place, price and your name.' },
        { status: 400 }
      );
    }

    // Only accept photos that were uploaded to this project's job-photos bucket.
    const photoPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/job-photos/`;
    const photoUrls = (Array.isArray(photos) ? photos : [])
      .filter((u): u is string => typeof u === 'string' && u.startsWith(photoPrefix))
      .slice(0, MAX_PHOTOS);

    const { data, error } = await supabaseServer()
      .from('jobs')
      .insert({
        service_type: String(service_type).slice(0, 60),
        location: String(location).slice(0, 200),
        pay: Number(pay),
        customer_name: String(customer_name).slice(0, 80),
        description: description ? String(description).slice(0, 1000) : null,
        bring: bring ? String(bring).slice(0, 300) : null,
        photos: photoUrls,
        status: 'available',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ job: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
