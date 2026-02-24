"use client"

import { createContext, useContext, type ReactNode, useState, useEffect, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

// Types for AuthContext
interface AuthContextType {
  // State
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean

  // Actions
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | null>(null)

// Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode
}

// AuthProvider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  // Derived state
  const isAuthenticated = !!user

  // Initialize auth state
  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true)
        setError(null)

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          console.log("User authenticated:", session.user.id)
        } else {
          setUser(null)
          console.log("No active session")
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
        setError(err instanceof Error ? err.message : "Authentication error")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event)

      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  // Sign out
  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Flush auth context completely
      setUser(null)
      setError(null)
      
      // Clear any client-side storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
    } catch (error) {
      console.error("Error signing out:", error)
      setError(error instanceof Error ? error.message : "Sign out error")
      // Still clear state even if signOut fails
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
    } finally {
      setLoading(false)
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    try {
      setLoading(true)
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        throw error
      }

      if (currentUser) {
        setUser(currentUser)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setError(error instanceof Error ? error.message : "Refresh error")
    } finally {
      setLoading(false)
    }
  }

  // Auth context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    signOut: handleSignOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// useAuth Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

