import { z } from 'zod'

// Rules for the login form
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Rules for the register form — stricter password requirements
export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirm_password: z.string(),
}).refine(
  // Custom rule — both password fields must match
  data => data.password === data.confirm_password,
  {
    message: "Passwords don't match",
    path: ['confirm_password'],
  }
)

// These types are auto-generated from the schemas above
// Use them in your form components for type safety
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>