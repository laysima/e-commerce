'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [supabase] = useState(() => createClient())
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    })
    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <main className="auth-success">
        <p className="section-index">Account requested</p>
        <h1>Check your inbox.</h1>
        <p>We sent a verification link to your email address. Follow it to activate your Cressida account.</p>
        <Link href="/login" className="editorial-link editorial-link--dark">Return to sign in <span aria-hidden="true">↗</span></Link>
      </main>
    )
  }

  return (
    <main className="auth-page auth-page--register">
      <section className="auth-page__statement">
        <Link href="/" className="site-wordmark">Cressida</Link>
        <div>
          <p className="section-index section-index--light">A personal edit</p>
          <h1>Keep what<br /><em>speaks to you.</em></h1>
        </div>
        <p>Create a private place for saved pieces, orders, and future releases.</p>
      </section>

      <section className="auth-page__form">
        <Link href="/" className="auth-page__mobile-mark">Cressida</Link>
        <div className="auth-form">
          <header><p className="section-index">Join Cressida</p><h2>Create account</h2></header>
          {error && <p className="form-message form-message--error">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              <span>Full name</span>
              <input {...register('full_name')} type="text" placeholder="Your name" />
              {errors.full_name && <small>{errors.full_name.message}</small>}
            </label>
            <label>
              <span>Email address</span>
              <input {...register('email')} type="email" placeholder="you@example.com" />
              {errors.email && <small>{errors.email.message}</small>}
            </label>
            <label>
              <span>Password</span>
              <div className="auth-password">
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Minimum eight characters" />
                <button type="button" onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              {errors.password && <small>{errors.password.message}</small>}
            </label>
            <label>
              <span>Confirm password</span>
              <div className="auth-password">
                <input {...register('confirm_password')} type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" />
                <button type="button" onClick={() => setShowConfirm(value => !value)}>{showConfirm ? 'Hide' : 'Show'}</button>
              </div>
              {errors.confirm_password && <small>{errors.confirm_password.message}</small>}
            </label>
            <button className="auth-submit" type="submit" disabled={isLoading}>
              <span>{isLoading ? 'Creating account…' : 'Create account'}</span><span aria-hidden="true">↗</span>
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  )
}
