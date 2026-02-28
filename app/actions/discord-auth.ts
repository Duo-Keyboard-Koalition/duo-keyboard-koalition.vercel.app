'use server'

import { headers } from 'next/headers'
import { signInWithDiscord } from '@/app/actions/auth'

export async function handleDiscordAuth(): Promise<void> {
  // Get URL from headers (server-side)
  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('host')
  const baseUrl = origin
    ? origin.startsWith('http')
      ? origin
      : origin.includes('localhost')
        ? `http://${origin}`
        : `https://${origin}`
    : 'http://localhost:3000'

  const windowLocationHref = origin
    ? origin.startsWith('http')
      ? origin
      : `https://${origin}`
    : undefined

  if (windowLocationHref) {
    console.log('Discord login - window.location.href:', windowLocationHref)
  }

  await signInWithDiscord(baseUrl, windowLocationHref)
}
