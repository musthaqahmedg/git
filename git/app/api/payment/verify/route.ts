import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { supabaseServer } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, jobAcceptanceId, amount, commissionPercent } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Calculate commission
    const commission = (amount * (commissionPercent || 10)) / 100;
    const driverAmount = amount - commission;

    const supabase = supabaseServer();

    // Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        commission_amount: commission,
        driver_amount: driverAmount,
        status: 'success',
      })
      .eq('razorpay_order_id', orderId);

    if (updateError) throw updateError;

    // Update job acceptance status
    const { error: jobError } = await supabase
      .from('job_acceptances')
      .update({
        status: 'completed',
        final_amount: amount,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobAcceptanceId);

    if (jobError) throw jobError;

    // Update task status
    const { data: job } = await supabase
      .from('job_acceptances')
      .select('task_id')
      .eq('id', jobAcceptanceId)
      .single();

    if (job) {
      await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', job.task_id);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      commission,
      driverAmount,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
