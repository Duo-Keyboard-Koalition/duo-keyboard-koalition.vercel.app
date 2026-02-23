"use client"

import Image from "next/image"
import { Github, ExternalLink, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  name: string
  description: string
  image?: string
  github?: string
  demo?: string
  team?: string[]
  tags?: string[]
}

// Sample projects - would be loaded from database in production
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "MechKey Configurator",
    description: "A web-based tool for customizing mechanical keyboard layouts and RGB lighting effects.",
    github: "https://github.com",
    demo: "https://example.com",
    team: ["Alice", "Bob"],
    tags: ["React", "TypeScript", "WebUSB"]
  },
  {
    id: "2",
    name: "Switch Sound Analyzer",
    description: "AI-powered tool that analyzes and categorizes mechanical keyboard switch sounds.",
    github: "https://github.com",
    team: ["Charlie", "Diana", "Eve"],
    tags: ["Python", "TensorFlow", "Audio Processing"]
  },
  {
    id: "3",
    name: "Group Buy Tracker",
    description: "Track and manage group buys for custom keyboard parts and accessories.",
    demo: "https://example.com",
    team: ["Frank"],
    tags: ["Next.js", "Supabase", "Tailwind"]
  }
]

export default function ProjectsPage() {
  const handleDiscordJoin = () => {
    window.open('https://discord.gg/6GaWZAawUc', '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50 w-full">
        <nav className="w-full px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <a href="/" className="flex items-center">
              <Image
                src="/Aurajay - NoBG.png"
                alt="DKK Logo"
                width={40}
                height={40}
                className="w-10 h-10 mr-3 flex-shrink-0"
              />
              <span className="text-xl font-bold text-white">
                <span className="text-cyan-400">DUO KEYBOARD </span>
                <span className="text-white">KOALITION</span>
              </span>
            </a>
            <div className="flex items-center gap-6">
              <a href="/#about" className="text-white hover:text-cyan-400 transition-colors">About</a>
              <a href="/#projects" className="text-white hover:text-cyan-400 transition-colors">Projects</a>
              <a href="/#events" className="text-white hover:text-cyan-400 transition-colors">Events</a>
              <Button
                variant="default"
                onClick={() => window.location.href = '/?view=signin'}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Sign In
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Projects Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Community Projects</h2>
          <p className="text-gray-400 text-lg">
            Explore innovative projects built by our community members during hackathons and collaborations.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sampleProjects.map((project) => (
            <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors">
              <div className="h-40 bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center">
                <Image
                  src="/Aurajay - NoBG.png"
                  alt={project.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain opacity-50"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {project.team && project.team.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Users className="w-4 h-4" />
                    <span>{project.team.join(", ")}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => window.open(project.github, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  )}
                  {project.demo && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                      onClick={() => window.open(project.demo, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <Star className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Build Something Amazing</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join the Koalition to collaborate on projects, participate in hackathons, and showcase your work to the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-cyan-400 hover:bg-cyan-400/90 text-black px-8 py-4"
              onClick={() => window.location.href = '/?view=signup'}
            >
              Create Account
            </Button>
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 px-8 py-4"
              onClick={handleDiscordJoin}
            >
              Join Discord
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/Aurajay - NoBG.png"
              alt="DKK Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-sm text-gray-400">
              © {new Date().getFullYear()} Duo Keyboard Koalition. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={handleDiscordJoin}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Discord
            </button>
            <a
              href="https://app.getriver.io/beta/duo-keyboard-koalition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Events
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
