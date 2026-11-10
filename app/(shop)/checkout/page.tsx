'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/checkout'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import PageBand from '@/components/shop/PageBand'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

function StepLabel({ title, step }: { title: string; step: string }) {
  return (
    <div className="landing-label checkout-step">
      <p>{title} <ChevronDown aria-hidden="true" size={13} strokeWidth={2} /></p>
      <span>__{step}</span>
    </div>
  )
}

function Field({
  label,
  registration,
  error,
  ...inputProps
}: {
  label: string
  registration: UseFormRegisterReturn
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="checkout-field">
      <label htmlFor={registration.name}>{label}</label>
      <input id={registration.name} aria-invalid={Boolean(error)} {...registration} {...inputProps} />
      {error && <p>{error}</p>}
    </div>
  )
}

// ── Inner form that uses Stripe hooks ──
function CheckoutForm({
  total,
  onSuccess,
}: {
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
      {error && <div className="checkout-error">{error}</div>}
      <button onClick={handlePay} disabled={isProcessing || !stripe} className="checkout-submit">
        {isProcessing ? 'Processing payment…' : `Pay ${formatPrice(total)}`}
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
      <div className="checkout">
        <PageBand title="Your bag is empty" compact />
        <div className="checkout-state">
          <p>Nothing here yet. Find the ones that feel like you.</p>
          <Link href="/products" className="checkout-submit">Continue shopping</Link>
        </div>
      </div>
    )
  }

  // Order complete
  if (orderComplete) {
    return (
      <div className="checkout">
        <PageBand title="Order confirmed" compact />
        <div className="checkout-state">
          <p>Thank you. Redirecting you to your orders...</p>
        </div>
      </div>
    )
  }

  const shipping = totalPrice() >= 15000 ? 0 : 995

  return (
    <div className="checkout">
      <PageBand title="Checkout" compact />

      <div className="checkout-grid">
        <div className="checkout-main-column">
          {!clientSecret ? (
            <>
              <StepLabel title="Shipping address" step="001" />
              {error && <div className="checkout-error">{error}</div>}

              <div className="checkout-fields">
                <Field label="Full name" registration={register('full_name')} error={errors.full_name?.message} placeholder="Jane Doe" autoComplete="name" />
                <Field label="Email" registration={register('email')} error={errors.email?.message} type="email" placeholder="you@example.com" autoComplete="email" />
                <div className="checkout-field--wide">
                  <Field label="Street address" registration={register('line1')} error={errors.line1?.message} placeholder="123 Main Street" autoComplete="address-line1" />
                </div>
                <div className="checkout-field--wide">
                  <Field label="Apartment, suite, etc. (optional)" registration={register('line2')} placeholder="Apt 4B" autoComplete="address-line2" />
                </div>
                <Field label="City" registration={register('city')} error={errors.city?.message} placeholder="New York" autoComplete="address-level2" />
                <Field label="State / Province" registration={register('state')} error={errors.state?.message} placeholder="NY" autoComplete="address-level1" />
                <Field label="Postal code" registration={register('postal_code')} error={errors.postal_code?.message} placeholder="10001" autoComplete="postal-code" />
                <Field label="Country" registration={register('country')} error={errors.country?.message} placeholder="United States" autoComplete="country-name" />
              </div>

              <button onClick={handleSubmit(onSubmitAddress)} disabled={isLoading} className="checkout-submit">
                {isLoading ? 'Preparing payment…' : 'Continue to payment'}
              </button>
            </>
          ) : (
            <>
              <StepLabel title="Payment details" step="002" />
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#d11f24',
                      colorBackground: '#ffffff',
                      fontFamily: '"Helvetica Neue", Arial, sans-serif',
                      borderRadius: '0px',
                      colorText: '#111111',
                    },
                  },
                }}
              >
                <CheckoutForm total={total} onSuccess={handleOrderSuccess} />
              </Elements>
              <button onClick={() => setClientSecret(null)} className="checkout-back">Back to shipping</button>
            </>
          )}
        </div>

        <aside className="checkout-summary">
          <StepLabel title="Your order" step="003" />

          <div className="checkout-items">
            {items.map(item => (
              <div className="checkout-item" key={item.id}>
                <div className="checkout-item__image">
                  {item.product.images?.[0] && <Image src={item.product.images[0]} alt={item.product.name} fill sizes="72px" />}
                  <span>{item.quantity}</span>
                </div>
                <div className="checkout-item__name">
                  <p>{item.product.name}</p>
                  {item.variant && <small>{item.variant.name}: {item.variant.value}</small>}
                </div>
                <p>{formatPrice((item.product.price + (item.variant?.price_modifier ?? 0)) * item.quantity)}</p>
              </div>
            ))}
          </div>

          <dl className="checkout-totals">
            <div><dt>Subtotal</dt><dd>{formatPrice(totalPrice())}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="checkout-totals__grand"><dt>Total</dt><dd>{formatPrice(totalPrice() + shipping)}</dd></div>
          </dl>

          <ul className="checkout-notes-list">
            <li>256-bit SSL encrypted checkout</li>
            <li>Free returns within 30 days</li>
            <li>Authenticity guaranteed</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
