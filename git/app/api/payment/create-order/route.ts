import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay';
import { supabaseServer } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { jobAcceptanceId, amount } = await req.json();

    if (!jobAcceptanceId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await createOrder(amount, jobAcceptanceId);

    // Save order to database
    const supabase = supabaseServer();
    const { error } = await supabase
      .from('payments')
      .insert({
        job_acceptance_id: jobAcceptanceId,
        razorpay_order_id: order.id,
        amount: amount,
        status: 'pending',
      });

    if (error) throw error;

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
