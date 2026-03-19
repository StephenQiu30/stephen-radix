'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function NotFound() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.gsap-reveal', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
    })
  }, { scope: container })

  return (
    <div ref={container} className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="space-y-8 px-4 text-center">
        {/* 404 大号数字 */}
        <div className="gsap-reveal relative">
          <h1 className="text-primary/20 text-[120px] leading-none font-bold md:text-[180px]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl">🔍</div>
          </div>
        </div>

        {/* 标题和描述 */}
        <div className="gsap-reveal space-y-4">
          <h2 className="text-foreground text-2xl font-semibold md:text-3xl">页面未找到</h2>
          <p className="text-muted-foreground mx-auto max-w-md text-lg text-bold font-black tracking-tight uppercase">
            抱歉，您访问的页面不存在或已被移动。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="gsap-reveal flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-10 h-14 font-black tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
