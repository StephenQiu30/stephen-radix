'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { Calendar, Clock, ChevronRight } from 'lucide-react'

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
    <header className="relative mb-16 pt-12 md:pt-20 text-center w-full max-w-4xl mx-auto px-4">
      {/* 标签栏 - 精致漂浮式 */}
      {tags && tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 transition-colors px-3 py-1 font-semibold tracking-wide uppercase text-xs rounded-full"
            >
              {tag}
            </Badge>
          ))}
        </motion.div>
      )}

      {/* 极致宽大的标题区 - 极具视觉张力 */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-foreground tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold leading-[1.1] mb-12 text-balance"
      >
        {title || '无标题文章'}
      </motion.h1>

      {/* 作者与元数据信息：一体化玻璃态胶囊 (Glassmorphism Pill) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-secondary/30 border border-border/40 backdrop-blur-xl rounded-[2rem] p-2 pl-3 pr-6 w-fit shadow-sm"
      >
        <div className="flex items-center gap-3">
          <UserAvatar
            user={userVO}
            size="sm"
            className="ring-background shadow-md ring-2 h-10 w-10 transition-transform hover:scale-105"
          />
          <div className="flex flex-col items-start pr-4 border-r border-border/50">
            <span className="text-foreground font-bold tracking-tight text-sm">
              {userVO?.userName || '匿名作者'}
            </span>
            <span className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
              Author
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 text-[13px] font-medium text-muted-foreground/80">
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Calendar className="w-4 h-4 opacity-70" />
            <time dateTime={createTime}>{formattedDate}</time>
          </div>
          <div className="w-[3px] h-[3px] rounded-full bg-border" />
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Clock className="w-4 h-4 opacity-70" />
            <span>{readingTime} 分钟阅读</span>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
