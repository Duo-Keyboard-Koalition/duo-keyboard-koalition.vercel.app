"use client"

import Image from "next/image"
import { Shield, Code2, Users, Trophy, Rocket, ExternalLink } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useSearchParams } from "next/navigation"
import { useEffect, Suspense, useState } from "react"
import AuthForm from "@/components/AuthForm"
import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"

function HomePageContent() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      setShouldRedirect(true)
      window.location.href = "/dashboard"
    }
  }, [user, loading])

  if (loading) {
    return <Loading />
  }

  if (user) {
    return null
  }

  const error = searchParams.get("error") ? decodeURIComponent(searchParams.get("error")!) : null
  const message = searchParams.get("message") ? decodeURIComponent(searchParams.get("message")!) : null
  const view = searchParams.get("view") === "signup" ? "signup" : "signin"

  const handleDiscordJoin = () => {
    window.open('https://discord.gg/6GaWZAawUc', '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50 w-full">
        <nav className="w-full px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
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
            </div>
            <div className="flex items-center gap-6">
              <a href="/about" className="text-white hover:text-cyan-400 transition-colors">About</a>
              <a href="/projects" className="text-white hover:text-cyan-400 transition-colors">Projects</a>
              <a href="/events" className="text-white hover:text-cyan-400 transition-colors">Events</a>
              <AuthForm view={view} error={error} message={message} compact />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-black">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-purple-900/20 to-black"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full w-full px-4 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center text-center animate-fade-in-up">
            <h1 className="flex flex-col lg:flex-row items-center text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
              <Image
                src="/Aurajay - NoBG.png"
                alt="DKK Logo"
                width={208}
                height={208}
                className="w-32 h-32 md:w-48 md:h-48 lg:w-52 lg:h-52 mb-4 lg:mb-0"
              />
              <div className="lg:ml-6">
                <span className="text-cyan-400">DUO KEYBOARD </span>
                <span className="text-white">KOALITION</span>
              </div>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/projects"
                className="px-8 py-4 text-lg font-semibold bg-cyan-400 text-black rounded-md shadow-md hover:bg-cyan-400/80 transition-all duration-200"
              >
                Explore Projects
              </a>
              <a
                href="/events"
                className="px-8 py-4 text-lg font-semibold border-2 border-cyan-400 text-cyan-400 rounded-md shadow-md hover:bg-cyan-400/20 transition-all duration-200"
              >
                View Events
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 text-cyan-400 animate-bounce">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white">Welcome to the Koalition</h2>
          <p className="text-gray-400 text-lg">
            The Duo Keyboard Koalition is a community of passionate hackers, coders, and tech enthusiasts who come together to collaborate, learn, and take on hackathons with a competitive spirit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <Code2 className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Hack Together</h3>
            <p className="text-gray-400">Collaborate on innovative projects and push the boundaries of technology.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <Users className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Community</h3>
            <p className="text-gray-400">Join a supportive network of like-minded tech enthusiasts.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <Trophy className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Compete</h3>
            <p className="text-gray-400">Participate in hackathons and coding competitions as a team.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <Rocket className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Grow</h3>
            <p className="text-gray-400">Learn new skills and advance your technical expertise.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-black/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">About the Duo Keyboard Koalition</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-gray-300">
              <p>
                The <strong className="text-cyan-400">Duo Keyboard Koalition</strong> is a community of passionate hackers, coders, and tech enthusiasts who come together to collaborate, learn, and take on hackathons with a competitive spirit. Originally formed by a group of people who met at hackathons, the Koalition has evolved into a space where members push each other to innovate, build meaningful projects, and grow their skills.
              </p>
              <p>
                The vibe is part competitive, part collaborative—like a team of modern-day &quot;pirates&quot; setting out on adventures in tech, always ready to tackle the next challenge. Whether you&apos;re looking to brainstorm new ideas, work on side projects, or prepare for upcoming hackathons, the Duo Keyboard Koalition is a supportive and driven community where you can connect with like-minded people and bring exciting ideas to life.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/Aurajay - NoBG.png"
                alt="DKK Logo"
                width={256}
                height={256}
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Community Projects</h2>
          <p className="text-gray-400 text-center mb-12 text-lg">
            Explore innovative projects built by our community members during hackathons and collaborations.
          </p>
          <div className="text-center">
            <Button className="bg-cyan-400 hover:bg-cyan-400/90 text-black" onClick={() => window.location.href = '/projects'}>
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Events & Calendar</h2>
          <p className="text-gray-400 text-center mb-12 text-lg">
            Stay updated with our latest hackathons, workshops, and community events.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Upcoming Events</h3>
              <p className="text-gray-400 mb-4">Check out our events platform for the full schedule.</p>
              <Button
                variant="outline"
                className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                onClick={() => window.open('https://app.getriver.io/beta/duo-keyboard-koalition', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Events Platform
              </Button>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Join Our Discord</h3>
              <p className="text-gray-400 mb-4">Connect with the community and stay in the loop.</p>
              <Button
                variant="outline"
                className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                onClick={handleDiscordJoin}
              >
                Join Discord Server
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Join the Koalition?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Sign in to access the community dashboard, connect with other hackers, and start building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-cyan-400 hover:bg-cyan-400/90 text-black px-8 py-6 text-lg"
              onClick={() => window.location.href = '/?view=signup'}
            >
              Create Account
            </Button>
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 px-8 py-6 text-lg"
              onClick={() => window.location.href = '/?view=signin'}
            >
              Sign In
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

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePageContent />
    </Suspense>
  )
}
