// Supabase auth errors are terse and often internal-sounding ("over_email_send_rate_limit").
// Translate the ones users actually hit into something actionable.
export function describeAuthError(message: string): string {
  const text = message.toLowerCase()

  if (text.includes('rate limit') || text.includes('too many requests')) {
    return 'Too many verification emails have been requested recently. Please wait a few minutes and try again.'
  }

  if (text.includes('already registered') || text.includes('user already')) {
    return 'An account with this email already exists. Try signing in instead.'
  }

  if (text.includes('email not confirmed') || text.includes('not confirmed')) {
    return 'This account still needs to be confirmed. Check your inbox for the verification link.'
  }

  if (text.includes('invalid login credentials')) {
    return 'That email and password combination does not match an account.'
  }

  if (text.includes('password should be') || text.includes('weak password')) {
    return 'Please choose a stronger password — at least eight characters, with a number and a capital letter.'
  }

  return message
}
