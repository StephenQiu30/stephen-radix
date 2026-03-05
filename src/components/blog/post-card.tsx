'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { ArrowRight, ArrowUpRight, Bookmark, Heart, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: PostAPI.PostVO
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const { id, title, content, cover, tags, thumbNum = 0, favourNum = 0, createTime, userVO } = post

  const excerpt =
    (
      content
        ?.replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        .replace(/[#*`>~_]/g, '')
        .trim() || ''
    ).slice(0, 100) + ((content?.length ?? 0) > 100 ? '...' : '')

  const formattedDate = createTime
    ? new Date(createTime).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className={cn('group h-full relative', className)}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/30 transition-all duration-300 hover:border-primary/30 hover:shadow-sm group">
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
            <h2 className="text-foreground/40 font-bold text-xl md:text-2xl leading-tight tracking-tight line-clamp-3 text-center transition-colors group-hover:text-primary/40">
              {title || 'Untitled Post'}
            </h2>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <UserAvatar user={userVO} size="sm" className="h-5 w-5 opacity-80" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-tight">
              {userVO?.userName || 'Anonymous'}
            </span>
            <span className="text-[11px] text-muted-foreground/40">·</span>
            <span className="text-[11px] font-medium text-muted-foreground/40">{formattedDate}</span>
          </div>

          <h3 className="text-foreground group-hover:text-primary leading-snug text-lg font-bold tracking-tight transition-colors duration-200">
            {title || 'Untitled'}
          </h3>

          <p className="text-muted-foreground/70 line-clamp-2 text-sm leading-relaxed">
            {excerpt}
          </p>
        </div>

        {/* Footer with Stats */}
        <div className="flex items-center justify-between px-6 pb-5 pt-1">
          <div className="flex items-center gap-4 text-muted-foreground/40">
            <div className="flex items-center gap-1 transition-colors hover:text-red-500/70">
              <Heart className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold">{thumbNum}</span>
            </div>
            <div className="flex items-center gap-1 transition-colors hover:text-primary">
              <Bookmark className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold">{favourNum}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[12px] font-bold text-primary opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            阅读全文
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        <Link href={`/blog/${id}`} className="absolute inset-0 z-20">
          <span className="sr-only">View Post</span>
        </Link>
      </div>
    </motion.div>
  )
}
