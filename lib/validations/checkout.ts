import { z } from 'zod'

export const checkoutSchema = z.object({
  // Personal info
  full_name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),

  // Shipping address
  line1: z.string().min(5, 'Enter a valid street address'),
  line2: z.string().optional(), // Apartment/suite — not required
  city: z.string().min(2, 'Enter a valid city'),
  state: z.string().min(2, 'Enter a valid state/province'),
  postal_code: z.string().min(4, 'Enter a valid postal code'),
  country: z.string().min(2, 'Enter a valid country'),
})

// Auto-generated type — used in CheckoutForm component
export type CheckoutInput = z.infer<typeof checkoutSchema>
