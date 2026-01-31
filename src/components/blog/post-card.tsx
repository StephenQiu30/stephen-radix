'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { ArrowUpRight, Bookmark, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: API.PostVO
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const { id, title, content, cover, tags, thumbNum = 0, favourNum = 0, createTime, userVO } = post

  // 生成摘要 (取前 100 个字符)
  const excerpt =
    (content?.replace(/[#*`>\[\]]/g, '') || '').slice(0, 100) +
    ((content?.length ?? 0) > 100 ? '...' : '')

  // 格式化日期
  const formattedDate = createTime
    ? new Date(createTime).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : ''

  return (
    <motion.div initial="initial" whileHover="hover" className={cn('group h-full', className)}>
      <Link href={`/blog/${id}`} className="block h-full">
        <div className="relative h-full overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 shadow-sm transition-all duration-500 hover:shadow-2xl backdrop-blur-2xl">
          {/* 封面图 */}
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            {cover ? (
              <img
                src={cover}
                alt={title || ''}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className={cn(
                "absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500",
                // Minimalist backgrounds: softly tinted grays/whites or extremely subtle gradients
                [
                  'bg-slate-50 dark:bg-slate-900/50',
                  'bg-gray-50 dark:bg-gray-900/50',
                  'bg-zinc-50 dark:bg-zinc-900/50',
                  'bg-neutral-50 dark:bg-neutral-900/50',
                  'bg-stone-50 dark:bg-stone-900/50',
                ][(typeof id === 'number' ? id : (title?.length || 0)) % 5]
              )}>
                {/* Very Subtle Gradient Overlay for depth */}
                <div className={cn(
                  "absolute inset-0 opacity-30 bg-gradient-to-br",
                  [
                    'from-blue-100/50 to-transparent dark:from-blue-900/20',
                    'from-emerald-100/50 to-transparent dark:from-emerald-900/20',
                    'from-orange-100/50 to-transparent dark:from-orange-900/20',
                    'from-rose-100/50 to-transparent dark:from-rose-900/20',
                    'from-violet-100/50 to-transparent dark:from-violet-900/20',
                  ][(typeof id === 'number' ? id : (title?.length || 0)) % 5]
                )} />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-grid-black/[0.015] dark:bg-grid-white/[0.015]" />

                {/* Title Display */}
                <div className="relative z-10 w-full group-hover:scale-105 transition-transform duration-500">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground/80 leading-snug line-clamp-3">
                    {title || '无标题'}
                  </h3>
                  <div className="mt-4 mx-auto w-12 h-1 rounded-full bg-foreground/10 group-hover:bg-primary/20 transition-colors" />
                </div>
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Tags overlay */}
            {tags && tags.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-background/80 text-foreground/90 shadow-sm backdrop-blur-md border border-white/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 内容区 */}
          <div className="flex flex-1 flex-col p-6">
            {/* 作者和日期 */}
            <div className="text-muted-foreground/60 mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <UserAvatar user={userVO} size="sm" className="h-5 w-5" />
                <span>{userVO?.userName || '匿名'}</span>
              </div>
              <span>{formattedDate}</span>
            </div>

            {/* 标题 */}
            <h3 className="text-foreground group-hover:text-primary mb-3 line-clamp-2 text-xl font-bold tracking-tight transition-colors duration-300">
              {title || '无标题'}
            </h3>

            {/* 摘要 */}
            <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
              {excerpt}
            </p>

            {/* 底部互动 */}
            <div className="border-border/40 mt-auto flex items-center justify-between border-t pt-4">
              <div className="text-muted-foreground/70 flex items-center gap-4">
                <span className="hover:text-foreground flex items-center gap-1.5 text-xs transition-colors">
                  <Heart className="h-3.5 w-3.5" />
                  {thumbNum}
                </span>
                <span className="hover:text-foreground flex items-center gap-1.5 text-xs transition-colors">
                  <Bookmark className="h-3.5 w-3.5" />
                  {favourNum}
                </span>
              </div>

              <div className="text-primary flex items-center gap-1 text-xs font-medium opacity-0 transition-all duration-300 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
                阅读全文
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
