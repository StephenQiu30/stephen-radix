'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Command, Github, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface GitHubAuthStatusProps {
  status: 'loading' | 'success' | 'error'
  message: string
  progress: number
  onRetry?: () => void
}

export function GitHubAuthStatus({ status, message, progress, onRetry }: GitHubAuthStatusProps) {
  const container = React.useRef<HTMLDivElement>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const progressBarRef = React.useRef<HTMLDivElement>(null)
  const statusIconRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Initial Entrance
    gsap.from(cardRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: 'power4.out',
    })

    gsap.from('.gsap-avatar', {
      x: (i) => (i === 0 ? -20 : 20),
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out',
    })
  }, { scope: container })

  // Animate Progress Bar
  useGSAP(() => {
    gsap.to(progressBarRef.current, {
      width: `${progress}%`,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, { dependencies: [progress] })

  // Animate Status Transitions
  useGSAP(() => {
    if (status === 'success') {
      gsap.from(statusIconRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      })
    }
  }, { dependencies: [status] })

  return (
    <div ref={container} className="flex min-h-screen w-full items-center justify-center bg-background p-4 text-foreground transition-colors duration-500">
      <div ref={cardRef} className="relative z-10 w-full max-w-[420px]">
        <Card className="relative overflow-hidden rounded-[32px] border-border/40 bg-card/50 shadow-xl backdrop-blur-md">
          <div className="flex flex-col items-center p-10 text-center">
            {/* Logo 连接区域 */}
            <div className="relative mb-8 flex w-full items-center justify-center gap-6">
              {/* GitHub Avatar */}
              <div className="gsap-avatar">
                <Avatar className="h-16 w-16 rounded-[20px] shadow-sm ring-1 ring-border/10">
                  <AvatarFallback className="bg-[#24292f] text-white">
                    <Github className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
 
              {/* 连接进度条 */}
              <div className="relative h-1 w-12 overflow-hidden rounded-full bg-border/20">
                <div
                  ref={progressBarRef}
                  className={`absolute inset-y-0 left-0 rounded-full transition-colors duration-500 ${
                    status === 'error'
                      ? 'bg-destructive'
                      : status === 'success'
                        ? 'bg-primary'
                        : 'bg-primary/60'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
 
              {/* App Avatar */}
              <div className="gsap-avatar">
                <Avatar className="h-16 w-16 rounded-[20px] bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                  <AvatarFallback className="bg-transparent">
                    <Command className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
 
              {/* 状态图标覆盖 */}
              {status === 'success' && (
                <div
                  ref={statusIconRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-1 shadow-sm ring-1 ring-border/20"
                >
                  <CheckCircle2 className="h-5 w-5 fill-current text-primary" />
                </div>
              )}
            </div>

            {/* 状态文本 */}
            <div className="mb-8 space-y-3">
              <h2 className="text-2xl font-black tracking-tight">
                {status === 'loading'
                  ? '正在连接 GitHub...'
                  : status === 'success'
                    ? '验证成功'
                    : '验证失败'}
              </h2>
              <p className="text-[15px] font-bold text-black/50 dark:text-white/50">{message}</p>
            </div>

            {/* 操作按钮 */}
            {status === 'error' && (
              <div className="flex w-full flex-col gap-3">
                <Button
                  onClick={onRetry}
                  className="h-14 w-full rounded-[20px] bg-[#0071E3] text-[15px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#0077ED] hover:scale-[1.02] active:scale-95"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重试连接
                </Button>
                <Link href="/" className="w-full">
                  <Button
                    variant="ghost"
                    className="h-12 w-full rounded-2xl text-[15px] font-bold hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    返回首页
                  </Button>
                </Link>
              </div>
            )}

            {status === 'success' && (
              <div className="flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#34C759] border-t-transparent" />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 底部版权信息 - Apple Style */}
      <div className="absolute bottom-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">
        <p>&copy; 2026 Stephen Radix. All rights reserved.</p>
        <p className="mt-2 flex justify-center gap-6">
          <span className="cursor-pointer hover:text-primary transition-colors">Privacy</span>
          <span className="cursor-pointer hover:text-primary transition-colors">Terms</span>
        </p>
      </div>
    </div>
  )
}
