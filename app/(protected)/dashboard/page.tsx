'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Loading'
import { ExternalLink, FolderKanban, Users, Link2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/unauthorized'
    }
  }, [user, loading])

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/aurajay.png"
              alt="Duo Keyboard Koalition Logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <div>
              <h1 className="cyber-glow mb-2 text-3xl font-bold italic text-white">
                DUO KEYBOARD KOALITION
              </h1>
              <p className="text-primary">Welcome to your dashboard</p>
            </div>
          </div>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>

        {/* Quick Links */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="cyber-box rounded-lg border border-primary/30 bg-card/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-3">
              <FolderKanban className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-semibold text-primary">Projects</h2>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              Explore community projects and showcase your work.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                window.open(
                  'https://duo-keyboard-koalition.github.io/projects',
                  '_blank',
                )
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Projects
            </Button>
          </div>

          <div className="cyber-box rounded-lg border border-primary/30 bg-card/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-semibold text-primary">Community</h2>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              Connect with other hackers and build together.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                window.open('https://discord.gg/6GaWZAawUc', '_blank')
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Join Discord
            </Button>
          </div>

          <div className="cyber-box rounded-lg border border-primary/30 bg-card/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-3">
              <Link2 className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-semibold text-primary">Home</h2>
            </div>
            <p className="mb-4 text-sm text-gray-400">Visit our home page.</p>
            <Link href="/">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* User Profile */}
        <div className="cyber-box mb-6 rounded-lg border border-primary/30 bg-card/80 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-primary">
            Your Profile
          </h2>
          <div className="space-y-2 text-gray-300">
            <p>
              <span className="font-medium text-primary">Email:</span>{' '}
              {user.email}
            </p>
            <p>
              <span className="font-medium text-primary">User ID:</span>{' '}
              {user.id}
            </p>
            {user.user_metadata?.full_name && (
              <p>
                <span className="font-medium text-primary">Name:</span>{' '}
                {user.user_metadata.full_name}
              </p>
            )}
          </div>
        </div>

        {/* User Data (JSON) */}
        <div className="cyber-box rounded-lg border border-primary/30 bg-card/80 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-primary">
            User Data (JSON)
          </h2>
          <div className="overflow-auto rounded-lg border border-primary/20 bg-background p-4">
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-300">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
