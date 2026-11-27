import Razorpay from 'razorpay';
import crypto from 'crypto';

// Created on first use so builds don't need payment keys.
let client: Razorpay | null = null;
function getRazorpay() {
  if (!client) {
    client = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return client;
}

export async function createOrder(amount: number, jobAcceptanceId: string) {
  try {
    const order = await getRazorpay().orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: jobAcceptanceId,
      notes: {
        jobAcceptanceId,
      },
    });
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw error;
  }
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export async function capturePayment(
  paymentId: string
) {
  try {
    const payment = await getRazorpay().payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Razorpay fetch error:', error);
    throw error;
  }
}
