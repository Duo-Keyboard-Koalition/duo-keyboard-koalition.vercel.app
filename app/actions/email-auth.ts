'use server'

import { headers } from 'next/headers'
import { signInWithEmail, signUp } from '@/app/actions/auth'

export async function handleEmailAuth(
  prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const isSignUp = formData.get('isSignUp') === 'true'

  // Get URL from headers (server-side)
  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('host')
  const windowLocationHref = origin
    ? origin.startsWith('http')
      ? origin
      : `https://${origin}`
    : undefined

  if (windowLocationHref) {
    console.log(
      `${isSignUp ? 'Sign up' : 'Email login'} - window.location.href:`,
      windowLocationHref,
    )
  }

  try {
    if (isSignUp) {
      await signUp(email, password, windowLocationHref)
    } else {
      await signInWithEmail(email, password, windowLocationHref)
    }
    return {}
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}
