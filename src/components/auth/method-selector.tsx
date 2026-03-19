'use client'

import { Button } from '@/components/ui/button'
import { Github, Mail, ScanLine } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import * as React from 'react'

interface MethodSelectorProps {
  onGitHubLogin: () => void
  onEmailClick: () => void
  onWeChatClick: () => void
}

export function MethodSelector({
  onGitHubLogin,
  onEmailClick,
  onWeChatClick,
}: MethodSelectorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.method-btn', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-4">
      <Button
        variant="outline"
        onClick={onGitHubLogin}
        className="method-btn group relative flex h-32 flex-col items-center justify-center gap-3 rounded-[2rem] border-border/50 bg-card/30 backdrop-blur-xl p-4 transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 border border-border/10 transition-all duration-500 group-hover:bg-background group-hover:scale-110 group-hover:rotate-6">
          <Github className="h-6 w-6 text-foreground/70 transition-colors group-hover:text-primary" />
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-[13px] font-black tracking-tight text-foreground">GitHub</span>
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">快捷登录</span>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={onEmailClick}
        className="method-btn group relative flex h-32 flex-col items-center justify-center gap-3 rounded-[2rem] border-border/50 bg-card/30 backdrop-blur-xl p-4 transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 border border-border/10 transition-all duration-500 group-hover:bg-background group-hover:scale-110 group-hover:rotate-6">
          <Mail className="h-6 w-6 text-foreground/70 transition-colors group-hover:text-primary" />
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-[13px] font-black tracking-tight text-foreground">邮箱</span>
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">验证码</span>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={onWeChatClick}
        className="method-btn group relative flex h-32 flex-col items-center justify-center gap-3 rounded-[2rem] border-border/50 bg-card/30 backdrop-blur-xl p-4 transition-all duration-500 hover:scale-[1.02] hover:border-[#07c160]/30 hover:bg-[#07c160]/5 hover:shadow-2xl hover:shadow-[#07c160]/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 border border-border/10 transition-all duration-500 group-hover:bg-background group-hover:scale-110 group-hover:rotate-6">
          <ScanLine className="h-6 w-6 text-foreground/70 transition-colors group-hover:text-[#07c160]" />
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-[13px] font-black tracking-tight text-foreground">微信</span>
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">扫码登录</span>
        </div>
      </Button>
    </div>
  )
}
