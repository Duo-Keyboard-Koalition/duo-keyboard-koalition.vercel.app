import { createClient } from '@/utils/supabase/server'
import { getBuilderProfiles } from '@/lib/builderspaces'
import Link from 'next/link'

export default async function BuilderSpaces() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const profiles = await getBuilderProfiles()
  const hasProfile = profiles.some(p => p.user_id === user?.id)

  return (
    <div className="max-w-6xl mx-auto pt-20 text-white px-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#FFB84D] to-[#CC8400]">
        Builder Spaces
      </h1>
      <p className="text-xl text-center mb-4 text-gray-300">
        The DKK member hub — builders, hackers, and makers
      </p>

      {!hasProfile && (
        <div className="mb-8 p-4 border border-primary/40 bg-primary/10 rounded-lg text-center">
          <p className="text-primary font-semibold mb-2">You don&apos;t have a builder profile yet.</p>
          <p className="text-gray-400 text-sm mb-3">Set one up to appear in the hub and connect with the crew.</p>
          <Link
            href="/builderspaces/setup"
            className="inline-block px-6 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-colors"
          >
            + Set Up Builder Profile
          </Link>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-2xl mb-2">🏗️</p>
          <p>No builders yet. Be the first to set up a profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className="bg-background/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {profile.display_name[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-white">{profile.display_name}</h2>
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary/70 hover:text-primary"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{profile.bio}</p>
              )}

              {profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.skills.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-600 text-xs">
                Joined {new Date(profile.joined_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
