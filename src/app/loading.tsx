'use client'

import React, { useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Loading() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.animate-skeleton', {
      opacity: 0,
      y: 10,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
    })
  }, { scope: container })

  return (
    <div ref={container} className="container mx-auto space-y-12 p-12 pt-32 min-h-screen">
      <div className="animate-skeleton flex items-center space-x-6">
        <Skeleton className="h-16 w-16 rounded-[24px]" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-[350px] rounded-full" />
          <Skeleton className="h-4 w-[250px] rounded-full" />
        </div>
      </div>
      
      <div className="space-y-8">
        <Skeleton className="animate-skeleton h-[300px] w-full rounded-[32px]" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Skeleton className="animate-skeleton h-[200px] rounded-[24px]" />
          <Skeleton className="animate-skeleton h-[200px] rounded-[24px]" />
          <Skeleton className="animate-skeleton h-[200px] rounded-[24px]" />
        </div>
      </div>
    </div>
  )
}
