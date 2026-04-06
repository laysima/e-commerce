import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook error'
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    )
  }

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const supabase = await createClient()

    const userId = paymentIntent.metadata.user_id
    const shippingAddress = JSON.parse(
      paymentIntent.metadata.shipping_address || '{}'
    )

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'processing',
        total: paymentIntent.amount,
        shipping_address: shippingAddress,
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    console.log('Order created:', order.id)
  }

  return NextResponse.json({ received: true })
}