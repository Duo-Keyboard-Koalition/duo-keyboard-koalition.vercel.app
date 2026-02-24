"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import Loading from "@/components/Loading"
import { Dashboard } from "@/components/vibeban/dashboard"

export default function VibeBanPage() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/unauthorized"
    }
  }, [loading, user])

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return null
  }

  return <Dashboard />
}