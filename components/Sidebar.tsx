"use client"

import { Home, Sparkles, FolderKanban, Users, Wrench, Code, Rows3 } from "lucide-react"
import SidebarClient from "./SidebarClient"

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/connections", label: "Connections", icon: Users },
    { href: "/hackathons", label: "Hackathons", icon: Sparkles },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/vibeban", label: "Vibe Ban", icon: Rows3 },
    { href: "/skillsets", label: "Skill Sets", icon: Code },
    { href: "/builderspaces", label: "Builder Spaces", icon: Wrench },
  ]

  return (
    <SidebarClient navItems={navItems} isActive={() => false}>
      {children}
    </SidebarClient>
  )
}
