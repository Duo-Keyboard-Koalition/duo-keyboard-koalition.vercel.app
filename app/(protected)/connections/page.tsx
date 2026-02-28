export default function Connections() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pt-20 text-white">
      <h1 className="mb-3 bg-gradient-to-r from-primary via-[#FFB84D] to-[#CC8400] bg-clip-text text-center text-4xl font-bold text-transparent">
        Builder Connections
      </h1>
      <p className="mb-12 text-center text-xl text-gray-300">
        Connect with fellow keyboard builders and creators
      </p>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/50">
          <div className="mb-4 text-4xl">🤝</div>
          <h2 className="mb-3 text-xl font-semibold text-primary">
            Find Collaborators
          </h2>
          <p className="text-gray-300">
            Discover builders working on similar projects or complementary
            skills. Team up and create something amazing together.
          </p>
        </div>

        <div className="rounded-lg border border-purple-500/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-purple-500/50">
          <div className="mb-4 text-4xl">💬</div>
          <h2 className="mb-3 text-xl font-semibold text-purple-300">
            Community Chat
          </h2>
          <p className="text-gray-300">
            Join discussions, share ideas, and get feedback from experienced
            builders in the community.
          </p>
        </div>

        <div className="rounded-lg border border-pink-500/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-pink-500/50">
          <div className="mb-4 text-4xl">🎯</div>
          <h2 className="mb-3 text-xl font-semibold text-pink-300">
            Mentorship
          </h2>
          <p className="text-gray-300">
            Connect with mentors who can guide you through your building
            journey, or offer your expertise to newcomers.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-primary/30 bg-background/80 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-bold text-primary">
          Active Builders
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-background p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-500 text-xl">
              KB
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Keyboard Builder</h3>
              <p className="text-sm text-gray-400">
                Working on: Custom 65% layout
              </p>
            </div>
            <button className="rounded-lg bg-primary/20 px-4 py-2 text-primary transition-colors hover:bg-primary/30">
              Connect
            </button>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-background p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xl">
              CB
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Case Designer</h3>
              <p className="text-sm text-gray-400">
                Working on: 3D printed cases
              </p>
            </div>
            <button className="rounded-lg bg-primary/20 px-4 py-2 text-primary transition-colors hover:bg-primary/30">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
