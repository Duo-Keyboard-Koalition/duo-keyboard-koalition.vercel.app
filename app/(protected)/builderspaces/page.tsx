export default function BuilderSpaces() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pt-20 text-white">
      <h1 className="mb-3 bg-gradient-to-r from-primary via-[#FFB84D] to-[#CC8400] bg-clip-text text-center text-4xl font-bold text-transparent">
        Builder Spaces
      </h1>
      <p className="mb-12 text-center text-xl text-gray-300">
        Dedicated workspaces and collaboration areas for keyboard builders
      </p>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-4xl">🏠</div>
            <div>
              <h2 className="text-xl font-semibold text-primary">
                Virtual Workspace
              </h2>
              <p className="text-sm text-gray-400">
                Online collaboration space
              </p>
            </div>
          </div>
          <p className="mb-4 text-gray-300">
            Join our virtual workspace where builders share screens, collaborate
            in real-time, and get instant feedback on their projects.
          </p>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
              12 active builders
            </span>
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
              Live
            </span>
          </div>
          <button className="w-full rounded-lg bg-primary/20 py-2 text-primary transition-colors hover:bg-primary/30">
            Join Workspace
          </button>
        </div>

        <div className="rounded-lg border border-purple-500/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-purple-500/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-4xl">💬</div>
            <div>
              <h2 className="text-xl font-semibold text-purple-300">
                Design Studio
              </h2>
              <p className="text-sm text-gray-400">Case & keycap design</p>
            </div>
          </div>
          <p className="mb-4 text-gray-300">
            A focused space for discussing case designs, keycap profiles, and
            aesthetic choices. Share renders and get design critiques.
          </p>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
              8 active designers
            </span>
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
              Live
            </span>
          </div>
          <button className="w-full rounded-lg bg-purple-500/20 py-2 text-purple-300 transition-colors hover:bg-purple-500/30">
            Enter Studio
          </button>
        </div>

        <div className="rounded-lg border border-pink-500/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-pink-500/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-4xl">🔧</div>
            <div>
              <h2 className="text-xl font-semibold text-pink-300">
                Hardware Lab
              </h2>
              <p className="text-sm text-gray-400">PCB & circuit design</p>
            </div>
          </div>
          <p className="mb-4 text-gray-300">
            Technical workspace for PCB design, circuit analysis, and hardware
            troubleshooting. Get help with component selection and layout
            optimization.
          </p>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300">
              15 active engineers
            </span>
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
              Live
            </span>
          </div>
          <button className="w-full rounded-lg bg-pink-500/20 py-2 text-pink-300 transition-colors hover:bg-pink-500/30">
            Access Lab
          </button>
        </div>

        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-4xl">💻</div>
            <div>
              <h2 className="text-xl font-semibold text-primary">
                Firmware Workshop
              </h2>
              <p className="text-sm text-gray-400">Code & programming</p>
            </div>
          </div>
          <p className="mb-4 text-gray-300">
            Collaborative coding space for firmware development, QMK
            configuration, and custom feature implementation. Pair program and
            share code snippets.
          </p>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
              9 active developers
            </span>
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
              Live
            </span>
          </div>
          <button className="w-full rounded-lg bg-primary/20 py-2 text-primary transition-colors hover:bg-primary/30">
            Join Workshop
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-primary/30 bg-background/80 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-bold text-primary">
          Create Your Own Space
        </h2>
        <p className="mb-6 text-gray-300">
          Start a dedicated workspace for your project, team, or interest group.
          Invite collaborators and build together.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-primary/20 bg-background p-4">
            <div className="mb-2 text-2xl">🎯</div>
            <h3 className="mb-2 font-semibold text-white">Project Space</h3>
            <p className="text-sm text-gray-400">
              Dedicated workspace for a specific keyboard project
            </p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-background p-4">
            <div className="mb-2 text-2xl">👥</div>
            <h3 className="mb-2 font-semibold text-white">Team Space</h3>
            <p className="text-sm text-gray-400">
              Collaborative space for your building team
            </p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-background p-4">
            <div className="mb-2 text-2xl">📚</div>
            <h3 className="mb-2 font-semibold text-white">Learning Space</h3>
            <p className="text-sm text-gray-400">
              Educational space for tutorials and workshops
            </p>
          </div>
        </div>
        <button className="mt-6 w-full rounded-lg border border-primary/30 bg-primary/20 px-6 py-3 text-primary transition-colors hover:bg-primary/30 md:w-auto">
          + Create New Space
        </button>
      </div>
    </div>
  )
}
