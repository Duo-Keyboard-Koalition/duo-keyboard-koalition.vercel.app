"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

export type Hackathon = {
  id: string
  title: string
  description: string
  status: "upcoming" | "active" | "ended"
  start_date: string | null
  end_date: string | null
  max_team_size: number
  tags: string[]
  participant_count?: number
  is_registered?: boolean
}

const STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  active: { label: "🟢 Active", classes: "bg-green-500/20 text-green-300 border border-green-500/30" },
  upcoming: { label: "🔵 Upcoming", classes: "bg-blue-500/20 text-blue-300 border border-blue-500/30" },
  ended: { label: "⚫ Ended", classes: "bg-gray-500/20 text-gray-400 border border-gray-500/30" },
}

const TAG_COLORS = [
  "bg-primary/20 text-primary",
  "bg-purple-500/20 text-purple-300",
  "bg-pink-500/20 text-pink-300",
  "bg-cyan-500/20 text-cyan-300",
]

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return "TBD"
  const s = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  if (!end) return `From ${s}`
  const e = new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  return `${s} – ${e}`
}

type Props = {
  hackathon: Hackathon
  userId: string | null
}

export default function HackathonCard({ hackathon, userId }: Props) {
  const [registered, setRegistered] = useState(hackathon.is_registered ?? false)
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(hackathon.participant_count ?? 0)
  const supabase = createClient()

  const statusStyle = STATUS_STYLES[hackathon.status] ?? STATUS_STYLES.upcoming

  async function handleJoin() {
    if (!userId || registered || hackathon.status === "ended") return
    setLoading(true)
    const { error } = await supabase
      .from("hackathon_registrations")
      .insert({ hackathon_id: hackathon.id, user_id: userId })
    if (!error) {
      setRegistered(true)
      setCount((c) => c + 1)
    }
    setLoading(false)
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 hover:border-primary/50 transition-colors flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-primary leading-tight">{hackathon.title}</h2>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusStyle.classes}`}>
          {statusStyle.label}
        </span>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed flex-1">{hackathon.description}</p>

      <div className="flex flex-wrap gap-2">
        {hackathon.tags.map((tag, i) => (
          <span key={tag} className={`px-3 py-1 rounded-full text-xs ${TAG_COLORS[i % TAG_COLORS.length]}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>📅 {formatDateRange(hackathon.start_date, hackathon.end_date)}</span>
        <span>👥 {count} participant{count !== 1 ? "s" : ""}</span>
      </div>

      <button
        onClick={handleJoin}
        disabled={!userId || registered || hackathon.status === "ended" || loading}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          registered
            ? "bg-green-500/20 text-green-300 border border-green-500/30 cursor-default"
            : hackathon.status === "ended"
            ? "bg-gray-500/10 text-gray-500 cursor-not-allowed"
            : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
        }`}
      >
        {loading ? "Joining…" : registered ? "✅ Registered" : hackathon.status === "ended" ? "Ended" : "Join Hackathon"}
      </button>
    </div>
  )
}
