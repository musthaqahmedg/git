import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { service_type, location, pay, customer_name } = await req.json();

    if (!service_type || !location || !customer_name || !(Number(pay) > 0)) {
      return NextResponse.json(
        { error: 'Fill in the service, place, price and your name.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer()
      .from('jobs')
      .insert({
        service_type: String(service_type).slice(0, 60),
        location: String(location).slice(0, 200),
        pay: Number(pay),
        customer_name: String(customer_name).slice(0, 80),
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
