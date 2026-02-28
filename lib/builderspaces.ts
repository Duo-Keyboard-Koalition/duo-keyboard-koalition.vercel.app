import { createClient } from '@/utils/supabase/client'

export interface BuilderProfile {
  id: string
  user_id: string
  display_name: string
  bio: string | null
  github_url: string | null
  skills: string[]
  builds: string[]
  avatar_url: string | null
  joined_at: string
}

export async function getBuilderProfiles(): Promise<BuilderProfile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('builder_profiles')
    .select('*')
    .order('joined_at', { ascending: false })

  if (error) {
    console.error('Error fetching builder profiles:', error)
    return []
  }
  return data ?? []
}

export async function getMyProfile(userId: string): Promise<BuilderProfile | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('builder_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}
