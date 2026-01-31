'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { Calendar, Clock } from 'lucide-react'

interface PostHeaderProps {
  post: API.PostVO
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
    <header className="relative mb-16 space-y-10 text-center">
      <div className="mx-auto max-w-4xl px-4">
        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-foreground mb-8 text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          {title || '无标题文章'}
        </motion.h1>

        {/* 优化的作者信息和元数据展示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10"
        >
          {/* 作者胶囊 */}
          <div className="bg-secondary/10 border-border/5 hover:bg-secondary/20 flex items-center gap-3 rounded-full border p-1.5 pr-6 backdrop-blur-sm transition-colors">
            <UserAvatar
              user={userVO}
              size="md"
              className="border-background h-10 w-10 border shadow-sm"
            />
            <div className="text-left">
              <p className="text-foreground text-sm leading-none font-semibold">
                {userVO?.userName || '匿名用户'}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs font-medium">作者</p>
            </div>
          </div>

          {/* 文章元数据 */}
          <div className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 opacity-70" />
              <span>{formattedDate}</span>
            </div>
            <div className="bg-border/50 h-4 w-px" />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-70" />
              <span>{readingTime} 分钟阅读</span>
            </div>
          </div>
        </motion.div>

        {/* 标签 (Subtle, at bottom) */}
        {tags && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-muted-foreground border-border/40 bg-transparent px-3 py-0.5 text-xs font-normal"
              >
                #{tag}
              </Badge>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  )
}
