"use client"

import Image from "next/image"
import { Calendar, ExternalLink, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventsPage() {
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

      {/* Events Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Events & Calendar</h2>
          <p className="text-gray-400 text-lg">
            Stay updated with our latest hackathons, workshops, and community events.
          </p>
        </div>

        {/* Main Events Platform Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-12">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">DKK Events Platform</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Visit our dedicated events platform to browse all upcoming hackathons, workshops, and community gatherings.
              You can RSVP to events, track your participation, and connect with other attendees.
            </p>
            <Button
              className="bg-cyan-400 hover:bg-cyan-400/90 text-black px-8 py-4 text-lg"
              onClick={() => window.open('https://app.getriver.io/beta/duo-keyboard-koalition', '_blank')}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Visit Events Platform
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <Calendar className="w-10 h-10 text-cyan-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Hackathons</h4>
            <p className="text-gray-400">
              Participate in competitive hackathons and build amazing projects with the community.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <Clock className="w-10 h-10 text-cyan-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Workshops</h4>
            <p className="text-gray-400">
              Learn new skills and technologies through hands-on workshops led by community members.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <Users className="w-10 h-10 text-cyan-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Meetups</h4>
            <p className="text-gray-400">
              Connect with fellow hackers at informal meetups and networking events.
            </p>
          </div>
        </div>

        {/* Discord CTA */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">Stay in the Loop</h3>
            <p className="text-gray-400 mb-6">
              Join our Discord server to get real-time updates about events and connect with the community.
            </p>
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 px-8 py-4"
              onClick={handleDiscordJoin}
            >
              Join Discord Server
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
