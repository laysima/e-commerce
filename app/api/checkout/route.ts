import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to checkout' },
        { status: 401 }
      )
    }

    const { items, shippingAddress } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty' },
        { status: 400 }
      )
    }

    // Calculate total from items
    const total = items.reduce((sum: number, item: { product: { price: number }, variant?: { price_modifier: number }, quantity: number }) => {      const price = item.product.price + (item.variant?.price_modifier ?? 0)
      return sum + price * item.quantity
    }, 0)

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      metadata: {
        user_id: user.id,
        shipping_address: JSON.stringify(shippingAddress),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      total,
    })
    } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}