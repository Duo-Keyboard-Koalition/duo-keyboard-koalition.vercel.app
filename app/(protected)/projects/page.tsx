"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import Loading from "@/components/Loading"
import { ExternalLink, FolderKanban, Sparkles, Users } from "lucide-react"

export default function Projects() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/unauthorized"
    }
  }, [loading, user])

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto pt-20 text-white px-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#FFB84D] to-[#CC8400]">
        Projects
      </h1>
      <p className="text-xl text-center mb-12 text-gray-300">
        Explore what the DKK community is building
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-background/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FolderKanban className="w-7 h-7 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Showcase</h2>
          </div>
          <p className="text-gray-300 mb-5">
            Browse featured builds and community project highlights.
          </p>
          <a
            href="https://duo-keyboard-koalition.github.io/projects"
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors border border-primary/30"
          >
            <ExternalLink className="w-4 h-4" />
            Open Project Board
          </a>
        </div>

        <div className="bg-background/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-7 h-7 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Ideas</h2>
          </div>
          <p className="text-gray-300 mb-5">
            Share new keyboard concepts and get feedback from builders.
          </p>
          <div className="px-3 py-2 text-center rounded-lg border border-primary/20 text-gray-300 bg-background">
            Coming soon
          </div>
        </div>

        <div className="bg-background/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-7 h-7 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Collaborate</h2>
          </div>
          <p className="text-gray-300 mb-5">
            Connect with teammates and build your next project together.
          </p>
          <a
            href="/connections"
            className="w-full inline-flex items-center justify-center py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors border border-primary/30"
          >
            Find Collaborators
          </a>
        </div>
      </div>
    </div>
  )
}
