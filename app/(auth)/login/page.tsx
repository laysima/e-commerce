'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { describeAuthError } from '@/lib/auth-errors'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [supabase] = useState(() => createClient())
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)
    setUnconfirmedEmail(null)
    setResendState('idle')

    const { error: signInError } = await supabase.auth.signInWithPassword(data)
    if (signInError) {
      // Supabase rejects sign-in until the address has been verified. Surface a
      // recoverable message instead of the raw "Email not confirmed" string.
      if (/email not confirmed|not confirmed/i.test(signInError.message)) {
        setUnconfirmedEmail(data.email)
        setError('This account still needs to be confirmed. Check your inbox for the verification link.')
      } else {
        setError(describeAuthError(signInError.message))
      }
      setIsLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  const resendConfirmation = async () => {
    if (!unconfirmedEmail) return
    setResendState('sending')
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: unconfirmedEmail,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (resendError) {
      setError(describeAuthError(resendError.message))
      setResendState('idle')
      return
    }
    setResendState('sent')
  }

  return (
    <main className="auth-page">
      <section className="auth-page__statement">
        <Link href="/" className="site-wordmark">Cressida</Link>
        <div>
          <p className="section-index section-index--light">Your private wardrobe</p>
          <h1>Return to the<br /><em>pieces you chose.</em></h1>
        </div>
        <p>Saved edits, order history, and a quieter route through the collection.</p>
      </section>

      <section className="auth-page__form">
        <Link href="/" className="auth-page__mobile-mark">Cressida</Link>
        <div className="auth-form">
          <header><p className="section-index">Welcome back</p><h2>Sign in</h2></header>
          {error && <p className="form-message form-message--error">{error}</p>}
          {unconfirmedEmail && (
            <p className="form-message form-message--notice">
              {resendState === 'sent' ? (
                <>Verification link sent again to {unconfirmedEmail}.</>
              ) : (
                <>
                  Didn&apos;t receive it?{' '}
                  <button type="button" onClick={resendConfirmation} disabled={resendState === 'sending'}>
                    {resendState === 'sending' ? 'Sending…' : 'Resend the link'}
                  </button>
                </>
              )}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              <span>Email address</span>
              <input {...register('email')} type="email" placeholder="you@example.com" />
              {errors.email && <small>{errors.email.message}</small>}
            </label>
            <label>
              <span>Password</span>
              <div className="auth-password">
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Your password" />
                <button type="button" onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              {errors.password && <small>{errors.password.message}</small>}
            </label>
            <div className="auth-form__utility"><Link href="/forgot-password">Forgot password?</Link></div>
            <button className="auth-submit" type="submit" disabled={isLoading}>
              <span>{isLoading ? 'Signing in…' : 'Sign in'}</span>
            </button>
          </form>
          <div className="auth-alternative">
            <span>Or</span>
            <button
              type="button"
              onClick={() => supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/api/auth/callback` },
              })}
            >
              Continue with Google
            </button>
          </div>
          <p className="auth-switch">New to Cressida? <Link href="/register">Create an account</Link></p>
        </div>
      </section>
    </main>
  )
}
