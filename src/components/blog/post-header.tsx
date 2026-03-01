'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { Sparkles, Calendar, Clock } from 'lucide-react'

interface PostHeaderProps {
  post: PostAPI.PostVO
}

export function PostHeader({ post }: PostHeaderProps) {
  const { title, cover, tags, createTime, userVO, content } = post

  // 估算阅读时间
  const readingTime = content ? Math.max(1, Math.ceil(content.length / 300)) : 1

  // 格式化日期
  const formattedDate = createTime
    ? new Date(createTime).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : ''

  return (
    <header className="relative mb-20 space-y-10 text-center">
      <div className="mx-auto max-w-4xl px-4">
        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-foreground mb-10 text-5xl leading-[1.15] font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          {title || '无标题文章'}
        </motion.h1>

        {/* 优化的作者信息和元数据展示 (Unified Minimalist Row) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm font-medium sm:gap-6 sm:text-base"
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            <UserAvatar
              user={userVO}
              size="sm"
              className="ring-background h-8 w-8 shadow-sm ring-2"
            />
            <span className="text-foreground font-semibold tracking-wide">{userVO?.userName || '匿名用户'}</span>
          </div>

          <span className="hidden opacity-30 sm:inline-block">•</span>

          {/* Date */}
          <div className="flex items-center gap-2">
            <span className="opacity-80 font-normal">{formattedDate}</span>
          </div>

          <span className="hidden opacity-30 sm:inline-block">•</span>

          {/* Read Time */}
          <div className="flex items-center gap-2">
            <span className="opacity-80 font-normal">{readingTime} 分钟阅读</span>
          </div>
        </motion.div>

        {/* Apple Intelligence Style AI Summary */}
        {post.aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-left"
          >
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-zinc-50/50 p-6 shadow-sm backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/50">
              <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-50 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(600px circle at left top, rgba(120,119,198,0.1), transparent 40%)' }} />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-sm ring-4 ring-indigo-50 dark:ring-indigo-500/10">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2 relative z-10">
                  <h3 className="text-sm font-semibold tracking-tight text-foreground/90">AI 总结</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{post.aiSummary}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2"
          >
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide uppercase transition-colors"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  )
}
