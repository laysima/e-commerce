'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [supabase] = useState(() => createClient())
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    setError(null)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    })
    if (resetError) {
      setError(resetError.message)
      setIsLoading(false)
      return
    }
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <main className="auth-success">
        <p className="section-index">Check your inbox</p>
        <h1>Reset link sent.</h1>
        <p>If an account exists for that email address, we&apos;ve sent a link to reset your password.</p>
        <Link href="/login" className="editorial-link editorial-link--dark">Return to sign in <span aria-hidden="true">↗</span></Link>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-page__statement">
        <Link href="/" className="site-wordmark">Cressida</Link>
        <div>
          <p className="section-index section-index--light">Account recovery</p>
          <h1>Let&apos;s get you<br /><em>back in.</em></h1>
        </div>
        <p>Enter the email address on your account and we&apos;ll send a link to reset your password.</p>
      </section>

      <section className="auth-page__form">
        <Link href="/" className="auth-page__mobile-mark">Cressida</Link>
        <div className="auth-form">
          <header><p className="section-index">Forgot password</p><h2>Reset your password</h2></header>
          {error && <p className="form-message form-message--error">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              <span>Email address</span>
              <input {...register('email')} type="email" placeholder="you@example.com" />
              {errors.email && <small>{errors.email.message}</small>}
            </label>
            <button className="auth-submit" type="submit" disabled={isLoading}>
              <span>{isLoading ? 'Sending…' : 'Send reset link'}</span><span aria-hidden="true">↗</span>
            </button>
          </form>
          <p className="auth-switch">Remembered it after all? <Link href="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  )
}
