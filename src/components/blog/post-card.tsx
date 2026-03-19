'use client'

import * as React from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { UserAvatar } from '@/components/header/user-avatar'
import { ArrowUpRight, Bookmark, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from '@/lib/dayjs'

gsap.registerPlugin(ScrollTrigger)

interface PostCardProps {
  post: PostAPI.PostVO
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const { id, title, content, cover, thumbNum = 0, favourNum = 0, createTime, userVO } = post

  useGSAP(() => {
    // Entrance Animation
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 95%',
        toggleActions: 'play none none none'
      }
    })
  }, { scope: cardRef })

  const onMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -4,
      scale: 1.005,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  const excerpt =
    (
      content
        ?.replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        .replace(/[#*`>~_]/g, '')
        .trim() || ''
    ).slice(0, 100) + ((content?.length ?? 0) > 100 ? '...' : '')

  const formattedDate = createTime ? dayjs(createTime).format('LL') : ''

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn('group h-full relative cursor-pointer', className)}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border/10 bg-card/40 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] group">
        {/* Cover Area */}
        {cover ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/10">
            <img
              src={cover}
              alt={title || ''}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ) : (
          /* Subtle Typography Cover (Minimalist) */
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/20 border-b border-border/10 flex items-center justify-center p-6">
            <h2 className="text-foreground/40 font-black text-xl md:text-2xl leading-tight tracking-tight line-clamp-3 text-center transition-colors group-hover:text-primary/40">
              {title || '无标题文章'}
            </h2>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <UserAvatar user={userVO} size="sm" className="h-5 w-5 opacity-80" />
            <span className="text-[11px] font-bold text-foreground/80 tracking-tight">
              {userVO?.userName || '匿名用户'}
            </span>
            <span className="text-[11px] text-foreground/30">·</span>
            <span className="text-[11px] font-bold text-foreground/40">{formattedDate}</span>
          </div>

          <h3 className="text-foreground group-hover:text-primary leading-snug text-lg font-black tracking-tight transition-all duration-300">
            {title || '无标题'}
          </h3>

          <p className="text-foreground/70 line-clamp-2 text-sm font-bold leading-relaxed">
            {excerpt}
          </p>
        </div>

        {/* Footer with Stats */}
        <div className="flex items-center justify-between px-6 pb-5 pt-1">
          <div className="flex items-center gap-4 text-foreground/40">
            <div className="flex items-center gap-1.5 transition-colors hover:text-primary/70">
              <Heart className="h-3.5 w-3.5" />
              <span className="text-[11px] font-black">{thumbNum}</span>
            </div>
            <div className="flex items-center gap-1.5 transition-colors hover:text-primary">
              <Bookmark className="h-3.5 w-3.5" />
              <span className="text-[11px] font-black">{favourNum}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] font-black text-primary opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            阅读全文
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        <Link href={`/blog/${id}`} className="absolute inset-0 z-20">
          <span className="sr-only">查看全文</span>
        </Link>
      </div>
    </div>
  )
}

export function PostCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div 
      className="shimmer flex h-full flex-col overflow-hidden rounded-[24px] border border-border/10 bg-card/40"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="aspect-[16/10] w-full bg-muted/20" />
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div className="flex items-center gap-2">
           <div className="h-5 w-5 rounded-full bg-border/20" />
           <div className="h-3 w-20 bg-border/20 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-border/20 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-border/10 rounded" />
          <div className="h-3 w-2/3 bg-border/10 rounded" />
        </div>
      </div>
    </div>
  )
}
