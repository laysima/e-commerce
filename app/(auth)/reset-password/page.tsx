'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true)
    setError(null)
    const { error: updateError } = await supabase.auth.updateUser({ password: data.password })
    if (updateError) {
      setError(
        updateError.message.includes('session')
          ? 'Your reset link has expired. Request a new one below.'
          : updateError.message
      )
      setIsLoading(false)
      return
    }
    router.push('/account')
    router.refresh()
  }

  return (
    <main className="auth-page">
      <section className="auth-page__statement">
        <Link href="/" className="site-wordmark">Cressida</Link>
        <div>
          <p className="section-index section-index--light">Account recovery</p>
          <h1>Choose a new<br /><em>password.</em></h1>
        </div>
        <p>Make it something you&apos;ll remember — at least eight characters, with a number and a capital letter.</p>
      </section>

      <section className="auth-page__form">
        <Link href="/" className="auth-page__mobile-mark">Cressida</Link>
        <div className="auth-form">
          <header><p className="section-index">Reset password</p><h2>New password</h2></header>
          {error && (
            <p className="form-message form-message--error">
              {error} {error.includes('expired') && <Link href="/forgot-password">Request a new link</Link>}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              <span>New password</span>
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
              <span>{isLoading ? 'Saving…' : 'Save new password'}</span><span aria-hidden="true">↗</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
