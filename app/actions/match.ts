'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

interface FormData {
  brand: string
  influencer: string
  brandValues: string[]
  missionStatement: string
  targetEmotion: string
}

export async function submitMatchForm(formData: FormData) {
  const cookieStore = await cookies()

  // Store form data in cookie for results page
  cookieStore.set('matchFormData', JSON.stringify(formData), {
    maxAge: 60 * 60, // 1 hour
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  // Call the API
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/influencers/match`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      cookieStore.set(
        'matchError',
        errorData.message || 'Failed to fetch influencer matches',
        {
          maxAge: 60 * 60,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        },
      )
      redirect('/results')
    }

    const data = await response.json()

    // Store matches in cookie
    cookieStore.set('matchResults', JSON.stringify(data.matches), {
      maxAge: 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    redirect('/results')
  } catch (error) {
    cookieStore.set(
      'matchError',
      error instanceof Error ? error.message : 'An error occurred',
      {
        maxAge: 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    )
    redirect('/results')
  }
}
