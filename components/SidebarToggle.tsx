'use client'

import { Menu, X } from 'lucide-react'

export default function SidebarToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="ml-auto text-primary transition-colors hover:text-[#FFB84D]"
      aria-label="Toggle sidebar"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  )
}
