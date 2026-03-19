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
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-4 items-center">
      <Button
        variant="outline"
        onClick={onGitHubLogin}
        className="method-btn group relative flex h-36 flex-col items-center justify-center rounded-[2.5rem] border-border/50 bg-card/30 backdrop-blur-xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/10"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-muted/50 border border-border/10 transition-all duration-500 group-hover:bg-background group-hover:scale-110 group-hover:rotate-6 mb-4">
          <Github className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
        </div>
        <div className="flex flex-col items-center justify-center gap-1 h-12">
          <span className="text-[15px] font-black tracking-tight text-foreground leading-none">GitHub</span>
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] leading-none">快捷登录</span>
        </div>
      </Button>
 
      <Button
        variant="outline"
        onClick={onEmailClick}
        className="method-btn group relative flex h-36 flex-col items-center justify-center rounded-[2.5rem] border-border/50 bg-card/30 backdrop-blur-xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/10"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-muted/50 border border-border/10 transition-all duration-500 group-hover:bg-background group-hover:scale-110 group-hover:rotate-6 mb-4">
          <Mail className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
        </div>
        <div className="flex flex-col items-center justify-center gap-1 h-12">
          <span className="text-[15px] font-black tracking-tight text-foreground leading-none">邮箱</span>
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] leading-none">验证码</span>
        </div>
      </Button>
 
      <Button
        variant="outline"
        onClick={onWeChatClick}
        className="method-btn group relative flex h-36 flex-col items-center justify-center rounded-[2.5rem] border-border/50 bg-card/30 backdrop-blur-xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-[#07c160]/30 hover:bg-[#07c160]/5 hover:shadow-2xl hover:shadow-[#07c160]/10"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-muted/50 border border-border/10 transition-all duration-500 group-hover:bg-background group-hover:scale-110 group-hover:rotate-6 mb-4">
          <ScanLine className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-[#07c160]" />
        </div>
        <div className="flex flex-col items-center justify-center gap-1 h-12">
          <span className="text-[15px] font-black tracking-tight text-foreground leading-none">微信</span>
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] leading-none">扫码登录</span>
        </div>
      </Button>
    </div>
  )
}
