export default function Hackathons() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pt-20 text-white">
      <h1 className="mb-3 bg-gradient-to-r from-primary via-[#FFB84D] to-[#CC8400] bg-clip-text text-center text-4xl font-bold text-transparent">
        Hackathons & Events
      </h1>
      <p className="mb-12 text-center text-xl text-gray-300">
        Join keyboard building competitions and community events
      </p>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <h2 className="text-xl font-semibold text-primary">
                Duo Keyboard Build-Off
              </h2>
              <p className="text-sm text-gray-400">Active • Ends in 5 days</p>
            </div>
          </div>
          <p className="mb-4 text-gray-300">
            Build the most innovative dual-layout keyboard. Showcase your
            creativity and technical skills.
          </p>
          <div className="mb-4 flex gap-2">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
              Hardware
            </span>
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
              Design
            </span>
          </div>
          <button className="w-full rounded-lg bg-primary/20 py-2 text-primary transition-colors hover:bg-primary/30">
            Join Hackathon
          </button>
        </div>

        <div className="rounded-lg border border-purple-500/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-purple-500/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <h2 className="text-xl font-semibold text-purple-300">
                Rapid Prototype Challenge
              </h2>
              <p className="text-sm text-gray-400">
                Upcoming • Starts in 2 weeks
              </p>
            </div>
          </div>
          <p className="mb-4 text-gray-300">
            Design and build a functional keyboard prototype in 48 hours. Speed
            and innovation are key.
          </p>
          <div className="mb-4 flex gap-2">
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
              Speed Build
            </span>
            <span className="rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300">
              Innovation
            </span>
          </div>
          <button className="w-full rounded-lg bg-purple-500/20 py-2 text-purple-300 transition-colors hover:bg-purple-500/30">
            Register Interest
          </button>
        </div>

        <div className="rounded-lg border border-pink-500/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-pink-500/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-3xl">🎨</div>
            <div>
              <h2 className="text-xl font-semibold text-pink-300">
                Aesthetic Design Contest
              </h2>
              <p className="text-sm text-gray-400">Ongoing • Monthly</p>
            </div>
          </div>
          <p className="mb-4 text-gray-300">
            Showcase your keyboard&apos;s visual design. Winners featured in
            community gallery.
          </p>
          <div className="mb-4 flex gap-2">
            <span className="rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300">
              Design
            </span>
            <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
              Aesthetics
            </span>
          </div>
          <button className="w-full rounded-lg bg-pink-500/20 py-2 text-pink-300 transition-colors hover:bg-pink-500/30">
            Submit Entry
          </button>
        </div>

        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-3xl">🔧</div>
            <div>
              <h2 className="text-xl font-semibold text-primary">
                Firmware Hackathon
              </h2>
              <p className="text-sm text-gray-400">
                Upcoming • Starts in 1 month
              </p>
            </div>
          </div>
          <p className="mb-4 text-gray-300">
            Build innovative firmware features and QMK/VIA configurations. Push
            the boundaries of keyboard software.
          </p>
          <div className="mb-4 flex gap-2">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
              Firmware
            </span>
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
              Software
            </span>
          </div>
          <button className="w-full rounded-lg bg-primary/20 py-2 text-primary transition-colors hover:bg-primary/30">
            Learn More
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-primary/30 bg-background/80 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-bold text-primary">Past Winners</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-primary/20 bg-background p-4">
            <div className="mb-2 text-2xl">🥇</div>
            <h3 className="mb-1 font-semibold text-white">Modular 65%</h3>
            <p className="text-sm text-gray-400">by @keyboard_master</p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-background p-4">
            <div className="mb-2 text-2xl">🥈</div>
            <h3 className="mb-1 font-semibold text-white">Ergo Split Pro</h3>
            <p className="text-sm text-gray-400">by @ergo_builder</p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-background p-4">
            <div className="mb-2 text-2xl">🥉</div>
            <h3 className="mb-1 font-semibold text-white">Wireless TKL</h3>
            <p className="text-sm text-gray-400">by @wireless_wizard</p>
          </div>
        </div>
      </div>
    </div>
  )
}
