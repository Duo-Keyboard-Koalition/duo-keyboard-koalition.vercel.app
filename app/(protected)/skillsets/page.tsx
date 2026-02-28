export default function SkillSets() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pt-20 text-white">
      <h1 className="mb-3 bg-gradient-to-r from-primary via-[#FFB84D] to-[#CC8400] bg-clip-text text-center text-4xl font-bold text-transparent">
        Skill Sets & Expertise
      </h1>
      <p className="mb-12 text-center text-xl text-gray-300">
        Discover builders by their skills and learn from the community
      </p>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 text-center backdrop-blur-sm transition-colors hover:border-primary/50">
          <div className="mb-4 text-5xl">🔨</div>
          <h2 className="mb-3 text-xl font-semibold text-primary">
            Hardware Design
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            PCB design, circuit layout, component selection
          </p>
          <div className="font-semibold text-primary">24 builders</div>
        </div>

        <div className="rounded-lg border border-purple-500/30 bg-background/80 p-6 text-center backdrop-blur-sm transition-colors hover:border-purple-500/50">
          <div className="mb-4 text-5xl">💻</div>
          <h2 className="mb-3 text-xl font-semibold text-purple-300">
            Firmware Development
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            QMK, VIA, custom firmware programming
          </p>
          <div className="font-semibold text-purple-300">18 builders</div>
        </div>

        <div className="rounded-lg border border-pink-500/30 bg-background/80 p-6 text-center backdrop-blur-sm transition-colors hover:border-pink-500/50">
          <div className="mb-4 text-5xl">🎨</div>
          <h2 className="mb-3 text-xl font-semibold text-pink-300">
            Case Design
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            3D modeling, CAD, case fabrication
          </p>
          <div className="font-semibold text-pink-300">31 builders</div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 text-center backdrop-blur-sm transition-colors hover:border-primary/50">
          <div className="mb-4 text-5xl">⌨️</div>
          <h2 className="mb-3 text-xl font-semibold text-primary">
            Keycap Design
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            Custom keycap profiles, colorways, legends
          </p>
          <div className="font-semibold text-primary">15 builders</div>
        </div>

        <div className="rounded-lg border border-purple-500/30 bg-background/80 p-6 text-center backdrop-blur-sm transition-colors hover:border-purple-500/50">
          <div className="mb-4 text-5xl">🔧</div>
          <h2 className="mb-3 text-xl font-semibold text-purple-300">
            Assembly & Modding
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            Soldering, lubing, stabilizer tuning
          </p>
          <div className="font-semibold text-purple-300">42 builders</div>
        </div>

        <div className="rounded-lg border border-pink-500/30 bg-background/80 p-6 text-center backdrop-blur-sm transition-colors hover:border-pink-500/50">
          <div className="mb-4 text-5xl">📐</div>
          <h2 className="mb-3 text-xl font-semibold text-pink-300">
            Ergonomics
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            Ergonomic layouts, hand positioning, comfort
          </p>
          <div className="font-semibold text-pink-300">12 builders</div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-background/80 p-6 text-center backdrop-blur-sm transition-colors hover:border-primary/50">
          <div className="mb-4 text-5xl">🎬</div>
          <h2 className="mb-3 text-xl font-semibold text-primary">
            Documentation
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            Build guides, tutorials, technical writing
          </p>
          <div className="font-semibold text-primary">9 builders</div>
        </div>

        <div className="rounded-lg border border-purple-500/30 bg-background/80 p-6 text-center backdrop-blur-sm transition-colors hover:border-purple-500/50">
          <div className="mb-4 text-5xl">⚡</div>
          <h2 className="mb-3 text-xl font-semibold text-purple-300">
            Testing & QA
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            Switch testing, quality assurance, validation
          </p>
          <div className="font-semibold text-purple-300">7 builders</div>
        </div>
      </div>

      <div className="rounded-lg border border-primary/30 bg-background/80 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-bold text-primary">
          Top Contributors
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-background p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-500 text-2xl font-bold">
              KB
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-white">Keyboard Master</h3>
              <p className="mb-2 text-sm text-gray-400">
                Hardware Design • Firmware Development • Case Design
              </p>
              <div className="flex gap-2">
                <span className="rounded bg-primary/20 px-2 py-1 text-xs text-primary">
                  Expert
                </span>
                <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                  Mentor
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-xs text-gray-400">Projects</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-background p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-2xl font-bold">
              CB
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-white">
                Case Builder Pro
              </h3>
              <p className="mb-2 text-sm text-gray-400">
                Case Design • 3D Modeling • Assembly
              </p>
              <div className="flex gap-2">
                <span className="rounded bg-pink-500/20 px-2 py-1 text-xs text-pink-300">
                  Expert
                </span>
                <span className="rounded bg-primary/20 px-2 py-1 text-xs text-primary">
                  Contributor
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-300">89</div>
              <div className="text-xs text-gray-400">Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
