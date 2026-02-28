'use client'

import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, AlertCircle } from 'lucide-react'

export default function UnauthorizedPage() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    // Flush auth context by signing out and clearing state
    try {
      await signOut()
      // Clear any remaining auth state
      if (typeof window !== 'undefined') {
        // Clear localStorage if any auth data is stored
        localStorage.clear()
        // Clear sessionStorage
        sessionStorage.clear()
      }
      // Redirect to home/login page
      router.push('/')
    } catch (error) {
      console.error('Error clearing auth:', error)
      // Force redirect even if signOut fails
      router.push('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-red-500/30 bg-[#0a0a1a]/80 p-8 text-center backdrop-blur-sm">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/50 bg-red-500/20">
              <AlertCircle className="h-10 w-10 text-red-400" />
            </div>
          </div>

          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <Image
              src="/aurajay.png"
              alt="Duo Keyboard Koalition Logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <h1 className="text-2xl font-bold italic text-white">
              DUO KEYBOARD KOALITION
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="mb-4 text-2xl font-semibold text-red-300">
            Authentication Required
          </h2>
          <p className="mb-2 text-gray-300">
            Your session has expired or you need to log in to access this page.
          </p>
          <p className="mb-8 text-sm text-gray-400">
            Please log in again to continue.
          </p>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="mb-4 w-full rounded-lg bg-primary py-3 font-bold text-black transition-colors hover:bg-primary/90"
          >
            Log In Again
          </Button>

          {/* Trust Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-primary/70">
            <Shield className="h-3 w-3 text-primary" />
            <span>Secure Authentication</span>
          </div>
        </div>
      </div>
    </div>
  )
}
