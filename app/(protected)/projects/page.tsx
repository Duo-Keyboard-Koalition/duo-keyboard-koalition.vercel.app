'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Loading from '@/components/Loading'
import { ExternalLink, FolderKanban, Sparkles, Users } from 'lucide-react'

export default function Projects() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/unauthorized'
    }
  }, [loading, user])

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pt-20 text-white">
      <h1 className="mb-3 bg-gradient-to-r from-primary via-[#FFB84D] to-[#CC8400] bg-clip-text text-center text-4xl font-bold text-transparent">
        Projects
      </h1>
      <p className="mb-12 text-center text-xl text-gray-300">
        Explore what the DKK community is building
      </p>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <FolderKanban className="h-7 w-7 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Showcase</h2>
          </div>
          <p className="mb-5 text-gray-300">
            Browse featured builds and community project highlights.
          </p>
          <a
            href="https://duo-keyboard-koalition.github.io/projects"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/20 py-2 text-primary transition-colors hover:bg-primary/30"
          >
            <ExternalLink className="h-4 w-4" />
            Open Project Board
          </a>
        </div>

        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Ideas</h2>
          </div>
          <p className="mb-5 text-gray-300">
            Share new keyboard concepts and get feedback from builders.
          </p>
          <div className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-center text-gray-300">
            Coming soon
          </div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <Users className="h-7 w-7 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Collaborate</h2>
          </div>
          <p className="mb-5 text-gray-300">
            Connect with teammates and build your next project together.
          </p>
          <a
            href="/connections"
            className="inline-flex w-full items-center justify-center rounded-lg border border-primary/30 bg-primary/20 py-2 text-primary transition-colors hover:bg-primary/30"
          >
            Find Collaborators
          </a>
        </div>
      </div>
    </div>
  )
}
