'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { ArrowRight, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface LoginPromptCardProps {
  onLoginClick: () => void
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function LoginPromptCard({
  onLoginClick,
  title = '需要登录',
  description = '请登录以查看个人资料',
  icon,
}: LoginPromptCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } })
    
    tl.from('.prompt-card', {
      y: 40,
      opacity: 0,
      scale: 0.98,
      delay: 0.1,
    })
    .from('.prompt-icon', {
      scale: 0,
      rotate: -15,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)',
    }, '-=0.8')
    .from('.prompt-text', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
    }, '-=0.8')
    .from('.prompt-actions', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
    }, '-=0.8')
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="flex w-full items-center justify-center py-12">
      <div className="w-full max-w-lg p-6 prompt-card">
        <div className="relative group">
          {/* Decorative Glows */}
          <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <Card className="relative border-border/10 bg-background/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="flex flex-col items-center space-y-10 pt-16 pb-8">
              {/* Icon Container */}
              <div className="relative prompt-icon">
                <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-primary/5 text-primary border border-primary/10 shadow-inner">
                  {icon || <Lock className="h-12 w-12 stroke-[1.25]" />}
                </div>
                <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>

              {/* Typography Section */}
              <div className="space-y-4 text-center">
                <h2 className="prompt-text text-foreground text-4xl font-black tracking-tighter leading-none">
                  {title}
                </h2>
                <p className="prompt-text text-foreground/40 mx-auto max-w-[280px] text-lg font-bold tracking-tight leading-relaxed italic">
                  {description}
                </p>
              </div>
            </CardHeader>

            <CardFooter className="flex flex-col gap-6 p-12 pt-0 prompt-actions">
              <Button
                onClick={onLoginClick}
                size="lg"
                className="h-16 w-full rounded-2xl bg-primary text-primary-foreground text-lg font-black tracking-tight shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                立即登录
                <ArrowRight className="ml-2 h-5 w-5 stroke-[3]" />
              </Button>
              
              <Link href="/" className="w-full text-center">
                <span className="text-foreground/20 text-[11px] font-black uppercase tracking-[0.4em] hover:text-primary transition-colors cursor-pointer block">
                  返回首页 ARCHIVE
                </span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
