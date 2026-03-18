import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import dayjs from '@/lib/dayjs'

interface PostHeaderProps {
  post: PostAPI.PostVO
  className?: string
}

export function PostHeader({ post, className }: PostHeaderProps) {
  const { title, createTime, tags, content } = post

  const readingTime = content ? Math.max(1, Math.ceil(content.length / 300)) : 1

  const formattedDate = createTime ? dayjs(createTime).format('LL') : ''

  return (
    <header className={cn('relative mb-12 w-full', className)}>
      <h1 className="text-foreground tracking-tight text-3xl md:text-4xl lg:text-5xl font-black leading-[1.2] mb-6 text-balance">
        {title || '无标题文章'}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
        <div className="flex items-center gap-5 text-foreground/80 text-lg md:text-xl font-bold tracking-tight">
          <time dateTime={createTime}>{formattedDate}</time>
          <span className="w-2 h-2 rounded-full bg-primary/20" />
          <span>{readingTime} 分钟阅读见解</span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-muted/30 text-foreground/60 font-black px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all hover:bg-muted hover:text-primary border-transparent"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
