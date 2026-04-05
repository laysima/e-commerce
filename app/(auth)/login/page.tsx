'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--white)' }}
    >
      {/* Left — Decorative Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
        style={{ backgroundColor: 'var(--navy)', position: 'relative', overflow: 'hidden' }}
      >
        {/* Glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184,149,74,0.1) 0%, transparent 70%)',
          }}
        />
        {/* Logo */}
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

        {/* Quote */}
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
            &quot;Style is a way to say who you are without having to speak.&quot;
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
            — RACHEL ZOE
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

          {/* Header */}
          <div className="mb-10">
            <p className="eyebrow mb-3">Welcome back</p>
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: '2.2rem',
                color: 'var(--navy)',
              }}
            >
              Sign In
            </h1>
          </div>

          {/* Error */}
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

          <div className="space-y-6">
            {/* Email */}
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
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full outline-none transition-all"
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.9rem',
                  color: 'var(--gray-900)',
                  backgroundColor: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                  padding: '12px 16px',
                  letterSpacing: '0.02em',
                }}
              />
              {errors.email && (
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: '#DC2626', marginTop: '6px' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-600)',
                  }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="hover-line"
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 300,
                    color: 'var(--gold)',
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full outline-none transition-all"
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: 300,
                    fontSize: '0.9rem',
                    color: 'var(--gray-900)',
                    backgroundColor: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)',
                    padding: '12px 42px 12px 16px',
                  }}
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
              {errors.password && (
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: '#DC2626', marginTop: '6px' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
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
                <><Loader2 size={14} className="animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--gray-100)' }} />
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', color: 'var(--gray-400)', letterSpacing: '0.1em' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--gray-100)' }} />
          </div>

          {/* Google */}
          <button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/api/auth/callback` },
              })
            }}
            className="w-full flex items-center justify-center gap-3 transition-all hover:opacity-70"
            style={{
              border: '1px solid var(--gray-200)',
              backgroundColor: 'var(--white)',
              color: 'var(--gray-600)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              padding: '13px',
            }}
          >
            Continue with Google
          </button>

          {/* Register Link */}
          <p
            className="text-center mt-8"
            style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-400)' }}
          >
            New to Cressida?{' '}
            <Link
              href="/register"
              className="hover-line"
              style={{ color: 'var(--navy)', fontWeight: 400 }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}