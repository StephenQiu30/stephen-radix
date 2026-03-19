'use client'

import React, { useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function FullScreenLoader() {
  const container = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Stephen Radix'
  const logoLetter = siteName.charAt(0).toUpperCase()

  useGSAP(() => {
    const tl = gsap.timeline()
    
    // Entrance
    tl.from('.gsap-reveal', {
      scale: 0.8,
      opacity: 0,
      y: 10,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power4.out',
    })

    // Infinite Pulse
    gsap.to(logoRef.current, {
      scale: 1.05,
      opacity: 0.9,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }, { scope: container })

  return (
    <div ref={container} className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center gap-6">
      <div className="gsap-reveal relative">
        <div
          ref={logoRef}
          className="bg-primary flex h-24 w-24 items-center justify-center rounded-[2rem] shadow-2xl shadow-primary/20"
        >
          <span className="text-primary-foreground text-5xl font-black">{logoLetter}</span>
        </div>

        <div className="absolute -right-2 -bottom-2">
          <div className="bg-background rounded-full p-1.5 shadow-xl ring-1 ring-border/10">
            <Loader2 className="text-primary h-7 w-7 animate-spin" />
          </div>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="gsap-reveal text-foreground text-2xl font-black tracking-tighter uppercase mb-1">
          {siteName}
        </h1>
        <p className="gsap-reveal text-muted-foreground text-xs font-bold tracking-[0.3em] uppercase opacity-60">
          正在加载资源...
        </p>
      </div>
    </div>
  )
}
