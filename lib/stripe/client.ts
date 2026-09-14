import Stripe from 'stripe'

let stripeClient: Stripe | null = null

// Created on first use rather than at import time. Next evaluates route modules
// while building, and constructing Stripe without a key there fails the build.
export function getStripe() {
  if (stripeClient) return stripeClient

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: '2025-01-27.acacia',
  })
  return stripeClient
}
