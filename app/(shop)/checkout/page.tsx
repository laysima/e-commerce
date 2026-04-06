'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Loader2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/checkout'
import Link from 'next/link'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// ── Inner form that uses Stripe hooks ──
function CheckoutForm({
  clientSecret,
  total,
  onSuccess,
}: {
  clientSecret: string
  total: number
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    if (!stripe || !elements) return
    setIsProcessing(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders?success=true`,
      },
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed')
      setIsProcessing(false)
      return
    }

    onSuccess()
  }

  return (
    <div>
      <PaymentElement />

      {error && (
        <div
          className="mt-4 px-4 py-3 text-sm"
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            fontFamily: 'Jost, sans-serif',
            fontWeight: 300,
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={isProcessing || !stripe}
        className="w-full flex items-center justify-center gap-3 mt-6 transition-opacity hover:opacity-80 disabled:opacity-40"
        style={{
          backgroundColor: 'var(--navy)',
          color: 'var(--cream)',
          fontFamily: 'Jost, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '16px',
        }}
      >
        {isProcessing ? (
          <><Loader2 size={14} className="animate-spin" /> Processing...</>
        ) : (
          `Pay ${formatPrice(total)}`
        )}
      </button>
    </div>
  )
}

// ── Main Checkout Page ──
export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderComplete, setOrderComplete] = useState(false)

  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmitAddress = async (data: CheckoutInput) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        shippingAddress: data,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setClientSecret(result.clientSecret)
    setTotal(result.total)
    setIsLoading(false)
  }

  const handleOrderSuccess = () => {
    clearCart()
    setOrderComplete(true)
    setTimeout(() => router.push('/orders?success=true'), 2000)
  }

  // Empty cart
  if (items.length === 0 && !orderComplete) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: 'var(--white)' }}
      >
        <ShoppingBag size={32} style={{ color: 'var(--gray-200)', marginBottom: '1.5rem' }} />
        <h2
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 400,
            fontSize: '1.8rem',
            color: 'var(--navy)',
            marginBottom: '1rem',
          }}
        >
          Your bag is empty
        </h2>
        <Link
          href="/products"
          className="transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'var(--navy)',
            color: 'var(--cream)',
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '14px 32px',
            display: 'inline-block',
          }}
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  // Order complete
  if (orderComplete) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: 'var(--white)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(184,149,74,0.1)' }}
        >
          <span style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>✓</span>
        </div>
        <h2
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 400,
            fontSize: '2rem',
            color: 'var(--navy)',
            marginBottom: '1rem',
          }}
        >
          Order Confirmed
        </h2>
        <p
          style={{
            fontFamily: 'Jost, sans-serif',
            fontWeight: 300,
            fontSize: '0.9rem',
            color: 'var(--gray-400)',
          }}
        >
          Redirecting you to your orders...
        </p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>

      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--gray-100)',
          backgroundColor: 'var(--cream)',
          padding: '4rem 0 3rem',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <p className="eyebrow mb-3">Secure Checkout</p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--navy)',
            }}
          >
            Complete Your Order
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Left — Address + Payment ── */}
          <div>
            {!clientSecret ? (
              <>
                {/* Shipping Address Form */}
                <div className="mb-2">
                  <p className="eyebrow mb-6">Shipping Address</p>

                  {error && (
                    <div
                      className="mb-6 px-4 py-3 text-sm"
                      style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#DC2626',
                        fontFamily: 'Jost, sans-serif',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div className="space-y-5">

                    {/* Full Name + Email */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block mb-2"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--gray-600)',
                          }}
                        >
                          Full Name
                        </label>
                        <input
                          {...register('full_name')}
                          placeholder="Jane Doe"
                          className="w-full outline-none"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.88rem',
                            color: 'var(--gray-900)',
                            backgroundColor: 'var(--gray-50)',
                            border: '1px solid var(--gray-200)',
                            padding: '11px 14px',
                          }}
                        />
                        {errors.full_name && (
                          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#DC2626', marginTop: '4px' }}>
                            {errors.full_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block mb-2"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--gray-600)',
                          }}
                        >
                          Email
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="you@example.com"
                          className="w-full outline-none"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.88rem',
                            color: 'var(--gray-900)',
                            backgroundColor: 'var(--gray-50)',
                            border: '1px solid var(--gray-200)',
                            padding: '11px 14px',
                          }}
                        />
                        {errors.email && (
                          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#DC2626', marginTop: '4px' }}>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label
                        className="block mb-2"
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontSize: '0.68rem',
                          fontWeight: 500,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'var(--gray-600)',
                        }}
                      >
                        Street Address
                      </label>
                      <input
                        {...register('line1')}
                        placeholder="123 Main Street"
                        className="w-full outline-none"
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontWeight: 300,
                          fontSize: '0.88rem',
                          color: 'var(--gray-900)',
                          backgroundColor: 'var(--gray-50)',
                          border: '1px solid var(--gray-200)',
                          padding: '11px 14px',
                        }}
                      />
                      {errors.line1 && (
                        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#DC2626', marginTop: '4px' }}>
                          {errors.line1.message}
                        </p>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label
                        className="block mb-2"
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontSize: '0.68rem',
                          fontWeight: 500,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'var(--gray-600)',
                        }}
                      >
                        Apartment, Suite, etc. (optional)
                      </label>
                      <input
                        {...register('line2')}
                        placeholder="Apt 4B"
                        className="w-full outline-none"
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontWeight: 300,
                          fontSize: '0.88rem',
                          color: 'var(--gray-900)',
                          backgroundColor: 'var(--gray-50)',
                          border: '1px solid var(--gray-200)',
                          padding: '11px 14px',
                        }}
                      />
                    </div>

                    {/* City + State */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block mb-2"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--gray-600)',
                          }}
                        >
                          City
                        </label>
                        <input
                          {...register('city')}
                          placeholder="New York"
                          className="w-full outline-none"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.88rem',
                            color: 'var(--gray-900)',
                            backgroundColor: 'var(--gray-50)',
                            border: '1px solid var(--gray-200)',
                            padding: '11px 14px',
                          }}
                        />
                        {errors.city && (
                          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#DC2626', marginTop: '4px' }}>
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block mb-2"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--gray-600)',
                          }}
                        >
                          State / Province
                        </label>
                        <input
                          {...register('state')}
                          placeholder="NY"
                          className="w-full outline-none"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.88rem',
                            color: 'var(--gray-900)',
                            backgroundColor: 'var(--gray-50)',
                            border: '1px solid var(--gray-200)',
                            padding: '11px 14px',
                          }}
                        />
                        {errors.state && (
                          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#DC2626', marginTop: '4px' }}>
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Postal + Country */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block mb-2"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--gray-600)',
                          }}
                        >
                          Postal Code
                        </label>
                        <input
                          {...register('postal_code')}
                          placeholder="10001"
                          className="w-full outline-none"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.88rem',
                            color: 'var(--gray-900)',
                            backgroundColor: 'var(--gray-50)',
                            border: '1px solid var(--gray-200)',
                            padding: '11px 14px',
                          }}
                        />
                        {errors.postal_code && (
                          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#DC2626', marginTop: '4px' }}>
                            {errors.postal_code.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block mb-2"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--gray-600)',
                          }}
                        >
                          Country
                        </label>
                        <input
                          {...register('country')}
                          placeholder="United States"
                          className="w-full outline-none"
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.88rem',
                            color: 'var(--gray-900)',
                            backgroundColor: 'var(--gray-50)',
                            border: '1px solid var(--gray-200)',
                            padding: '11px 14px',
                          }}
                        />
                        {errors.country && (
                          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#DC2626', marginTop: '4px' }}>
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Continue to Payment */}
                    <button
                      onClick={handleSubmit(onSubmitAddress)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 transition-opacity hover:opacity-80 disabled:opacity-40"
                      style={{
                        backgroundColor: 'var(--navy)',
                        color: 'var(--cream)',
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: '15px',
                        marginTop: '8px',
                      }}
                    >
                      {isLoading ? (
                        <><Loader2 size={14} className="animate-spin" /> Loading...</>
                      ) : (
                        'Continue to Payment'
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Payment Form */}
                <p className="eyebrow mb-6">Payment Details</p>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#0C1322',
                        colorBackground: '#FAFAF7',
                        fontFamily: 'Jost, sans-serif',
                        borderRadius: '0px',
                        colorText: '#1A1A18',
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    clientSecret={clientSecret}
                    total={total}
                    onSuccess={handleOrderSuccess}
                  />
                </Elements>

                {/* Back button */}
                <button
                  onClick={() => setClientSecret(null)}
                  className="mt-4 transition-opacity hover:opacity-50"
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 300,
                    color: 'var(--gray-400)',
                    letterSpacing: '0.05em',
                  }}
                >
                  ← Back to shipping
                </button>
              </>
            )}
          </div>

          {/* ── Right — Order Summary ── */}
          <div>
            <p className="eyebrow mb-6">Order Summary</p>

            {/* Items */}
            <div
              className="space-y-4 mb-6"
              style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '1.5rem' }}
            >
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div
                    className="relative shrink-0"
                    style={{
                      width: '56px',
                      height: '70px',
                      backgroundColor: 'var(--gray-50)',
                    }}
                  >
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    <span
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                      style={{
                        backgroundColor: 'var(--navy)',
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.6rem',
                        fontWeight: 500,
                      }}
                    >
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="line-clamp-1"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 400,
                        fontSize: '0.95rem',
                        color: 'var(--navy)',
                      }}
                    >
                      {item.product.name}
                    </p>
                    {item.variant && (
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', fontWeight: 300, color: 'var(--gray-400)' }}>
                        {item.variant.name}: {item.variant.value}
                      </p>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontWeight: 400,
                      fontSize: '0.9rem',
                      color: 'var(--navy)',
                      flexShrink: 0,
                    }}
                  >
                    {formatPrice(
                      (item.product.price + (item.variant?.price_modifier ?? 0)) * item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', fontWeight: 300, color: 'var(--gray-400)' }}>
                  Subtotal
                </span>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', fontWeight: 400, color: 'var(--navy)' }}>
                  {formatPrice(totalPrice())}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', fontWeight: 300, color: 'var(--gray-400)' }}>
                  Shipping
                </span>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', fontWeight: 300, color: 'var(--gray-400)' }}>
                  {totalPrice() >= 15000 ? 'Free' : formatPrice(995)}
                </span>
              </div>
              <div className="gold-divider my-3" />
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy)' }}>
                  Total
                </span>
                <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: '1.3rem', color: 'var(--navy)' }}>
                  {formatPrice(totalPrice() >= 15000 ? totalPrice() : totalPrice() + 995)}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div
              className="mt-8 p-5 space-y-3"
              style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--gray-100)' }}
            >
              {[
                '🔒 256-bit SSL encrypted checkout',
                '↩ Free returns within 30 days',
                '✦ Authenticity guaranteed',
              ].map(item => (
                <p
                  key={item}
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 300,
                    color: 'var(--gray-600)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}