'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

function InputField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block mb-2"
        style={{
          fontFamily: 'Jost, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--gray-600)',
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: '#DC2626', marginTop: '6px' }}>
          {error}
        </p>
      )}
    </div>
  )
}

const inputStyle = {
  fontFamily: 'Jost, sans-serif',
  fontWeight: 300,
  fontSize: '0.9rem',
  color: 'var(--gray-900)',
  backgroundColor: 'var(--gray-50)',
  border: '1px solid var(--gray-200)',
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
  letterSpacing: '0.02em',
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    })
    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: 'var(--cream)' }}
      >
        <div className="text-center max-w-md">
          <CheckCircle2 size={40} style={{ color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontSize: '2rem',
              color: 'var(--navy)',
              marginBottom: '1rem',
            }}
          >
            Check your inbox
          </h2>
          <p
            style={{
              fontFamily: 'Jost, sans-serif',
              fontWeight: 300,
              fontSize: '0.9rem',
              color: 'var(--gray-600)',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
            }}
          >
            We sent a verification link to your email address.
            Click it to activate your Cressida account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--navy)',
              color: 'var(--cream)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '14px 32px',
            }}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--white)' }}>

      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
        style={{ backgroundColor: 'var(--navy)', position: 'relative', overflow: 'hidden' }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%',
            left: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184,149,74,0.08) 0%, transparent 70%)',
          }}
        />
        <Link
          href="/"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--cream)',
          }}
        >
          Cressida
        </Link>

        <div>
          <div style={{ height: '1px', width: '40px', backgroundColor: 'var(--gold)', marginBottom: '2rem' }} />
          <p
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: '1.8rem',
              color: 'var(--cream)',
              lineHeight: 1.3,
              maxWidth: '360px',
            }}
          >
            &quot;Fashion is the armor to survive the reality of everyday life.&quot;
          </p>
          <p
            className="mt-4"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontWeight: 300,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'var(--gold-light)',
            }}
          >
            — BILL CUNNINGHAM
          </p>
        </div>

        <p
          style={{
            fontFamily: 'Jost, sans-serif',
            fontWeight: 300,
            fontSize: '0.75rem',
            color: 'rgba(250,250,247,0.3)',
            letterSpacing: '0.08em',
          }}
        >
          © {new Date().getFullYear()} Cressida
        </p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <Link
            href="/"
            className="lg:hidden block text-center mb-10"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.75rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--navy)',
            }}
          >
            Cressida
          </Link>

          <div className="mb-10">
            <p className="eyebrow mb-3">Join us</p>
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: '2.2rem',
                color: 'var(--navy)',
              }}
            >
              Create Account
            </h1>
          </div>

          {error && (
            <div
              className="mb-6 px-4 py-3 text-sm"
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

          <div className="space-y-5">
            <InputField label="Full Name" error={errors.full_name?.message}>
              <input
                {...register('full_name')}
                type="text"
                placeholder="Jane Doe"
                style={inputStyle}
              />
            </InputField>

            <InputField label="Email Address" error={errors.email?.message}>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                style={inputStyle}
              />
            </InputField>

            <InputField label="Password" error={errors.password?.message}>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-50"
                  style={{ color: 'var(--gray-400)' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 300, color: 'var(--gray-400)', marginTop: '6px' }}>
                Min 8 characters, one uppercase letter and one number
              </p>
            </InputField>

            <InputField label="Confirm Password" error={errors.confirm_password?.message}>
              <div className="relative">
                <input
                  {...register('confirm_password')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-50"
                  style={{ color: 'var(--gray-400)' }}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </InputField>

            <button
              onClick={handleSubmit(onSubmit)}
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
              }}
            >
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> Creating account...</>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <p
            className="text-center mt-8"
            style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-400)' }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              className="hover-line"
              style={{ color: 'var(--navy)', fontWeight: 400 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}