import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use service role for webhook processing
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface WompiEvent {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      reference: string;
      amount_in_cents: number;
      currency: string;
      payment_method_type: string;
      customer_email: string;
    };
  };
  sent_at: string;
  timestamp: number;
  signature: {
    checksum: string;
    properties: string[];
  };
}

function verifySignature(body: WompiEvent, secret: string): boolean {
  const { signature, data, timestamp } = body;

  // Build string to hash based on properties
  const properties = signature.properties;
  const values: string[] = [];

  properties.forEach((prop: string) => {
    const parts = prop.split('.');
    let value: Record<string, unknown> | unknown = data;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[part];
      }
    }
    values.push(String(value));
  });

  values.push(String(timestamp));
  values.push(secret);

  const stringToHash = values.join('');
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');

  return hash === signature.checksum;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as WompiEvent;

    // Verify webhook signature
    const secret = process.env.WOMPI_EVENTS_SECRET;
    if (secret && !verifySignature(body, secret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const { event, data } = body;
    const { transaction } = data;

    console.log(`Processing webhook event: ${event}`, transaction);

    // Handle different event types
    switch (event) {
      case 'transaction.updated': {
        // Find payment by gateway transaction ID or reference
        const { data: payment, error: findError } = await supabase
          .from('payments')
          .select('*')
          .or(`gateway_transaction_id.eq.${transaction.id},id.eq.${transaction.reference}`)
          .single();

        if (findError || !payment) {
          console.error('Payment not found:', transaction.reference);
          return NextResponse.json({ received: true });
        }

        // Update payment status based on transaction status
        let newStatus = payment.status;
        if (transaction.status === 'APPROVED') {
          newStatus = 'escrow';
        } else if (transaction.status === 'DECLINED' || transaction.status === 'ERROR') {
          newStatus = 'pending';
        } else if (transaction.status === 'VOIDED') {
          newStatus = 'refunded';
        }

        const { error: updateError } = await supabase
          .from('payments')
          .update({
            status: newStatus,
            gateway_transaction_id: transaction.id,
            payment_method: transaction.payment_method_type,
            metadata: {
              ...((payment.metadata as Record<string, unknown>) || {}),
              wompi_status: transaction.status,
              last_updated: new Date().toISOString(),
            },
          })
          .eq('id', payment.id);

        if (updateError) {
          console.error('Error updating payment:', updateError);
        }

        // If payment is approved, update case payment status
        if (newStatus === 'escrow') {
          await supabase
            .from('cases')
            .update({ payment_status: 'escrow' })
            .eq('id', payment.case_id);

          // Create timeline entry
          await supabase.from('case_timeline').insert({
            case_id: payment.case_id,
            actor_id: payment.payer_id,
            action: 'payment_received',
            description: `Pago de $${transaction.amount_in_cents / 100} ${transaction.currency} recibido`,
            metadata: {
              amount: transaction.amount_in_cents / 100,
              currency: transaction.currency,
              payment_method: transaction.payment_method_type,
            },
          });

          // Send email notification
          const { data: payerProfile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', payment.payer_id)
            .single();

          if (payerProfile) {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: payerProfile.email,
                template: 'payment_received',
                data: {
                  amount: `$${(transaction.amount_in_cents / 100).toLocaleString()} ${transaction.currency}`,
                  caseNumber: payment.case_id,
                  paymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/cliente/pagos`,
                },
              }),
            });
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
