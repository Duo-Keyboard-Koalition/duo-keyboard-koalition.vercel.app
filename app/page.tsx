'use client'

import { Suspense } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading'
import AuthForm from '@/components/AuthForm'
import { ExternalLink } from 'lucide-react'

function HomePageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const view = (searchParams.get('view') as 'signin' | 'signup') || 'signin'

  // If user is logged in, redirect to dashboard
  if (user) {
    router.replace('/dashboard')
    return null
  }

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <h1 className="cyber-glow mb-4 text-5xl font-bold italic text-white">
        DUO KEYBOARD KOALITION
      </h1>
      <p className="mb-8 text-xl text-[#FFA500]">Hack. Build. Create.</p>

      <AuthForm view={view} error={null} message={null} />

      <div className="mt-8">
        <p className="text-sm text-gray-500">
          Visit our public landing page at{' '}
          <a
            href="https://duo-keyboard-koalition.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[#FFA500] hover:underline"
          >
            duo-keyboard-koalition.github.io
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-white">
      <Suspense
        fallback={
          <div className="text-center">
            <Loading />
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        }
      >
        <HomePageContent />
      </Suspense>
    </div>
  )
}
