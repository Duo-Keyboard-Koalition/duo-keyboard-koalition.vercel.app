"use client"

import Image from "next/image"
import { Code2, Users, Trophy, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
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

      {/* About Section */}
      <section className="py-16 px-4">
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

          {/* Features Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-white">What We Offer</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <Code2 className="w-12 h-12 text-cyan-400 mb-4" />
                <h4 className="text-xl font-bold mb-2 text-white">Hack Together</h4>
                <p className="text-gray-400">Collaborate on innovative projects and push the boundaries of technology.</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <Users className="w-12 h-12 text-cyan-400 mb-4" />
                <h4 className="text-xl font-bold mb-2 text-white">Community</h4>
                <p className="text-gray-400">Join a supportive network of like-minded tech enthusiasts.</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <Trophy className="w-12 h-12 text-cyan-400 mb-4" />
                <h4 className="text-xl font-bold mb-2 text-white">Compete</h4>
                <p className="text-gray-400">Participate in hackathons and coding competitions as a team.</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <Rocket className="w-12 h-12 text-cyan-400 mb-4" />
                <h4 className="text-xl font-bold mb-2 text-white">Grow</h4>
                <p className="text-gray-400">Learn new skills and advance your technical expertise.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Join the Koalition</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Ready to become part of our hacker community? Sign in to get started.
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
