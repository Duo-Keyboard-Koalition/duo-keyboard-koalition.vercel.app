'use client'

import Image from 'next/image'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="relative h-40 w-40">
        {/* Outer pulsing circles */}
        <div className="animate-circle-pulse absolute inset-[-30px] rounded-full border-2 border-primary/40"></div>
        <div
          className="animate-circle-pulse absolute inset-[-30px] rounded-full border-2 border-primary/40"
          style={{ animationDelay: '0.7s' }}
        ></div>
        <div
          className="animate-circle-pulse absolute inset-[-30px] rounded-full border-2 border-primary/40"
          style={{ animationDelay: '1.4s' }}
        ></div>

        {/* Outer rotating circle with gradient */}
        <div className="animate-circle-rotate loading-glow-outer absolute inset-[-20px] rounded-full border-2 border-transparent border-b-primary border-l-primary border-r-primary border-t-primary"></div>

        {/* Middle rotating circle (reverse) */}
        <div
          className="animate-circle-rotate loading-glow-inner absolute inset-[-10px] rounded-full border-2 border-transparent border-b-primary border-l-primary border-r-primary border-t-primary"
          style={{ animationDirection: 'reverse' }}
        ></div>

        {/* Inner pulsing circle */}
        <div className="animate-circle-pulse absolute inset-0 rounded-full border-2 border-primary/50"></div>

        {/* Logo in center */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="animate-logo-pulse">
            <Image
              src="/aurajay.png"
              alt="Duo Keyboard Koalition Logo"
              width={80}
              height={80}
              className="loading-logo-glow h-20 w-20"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
