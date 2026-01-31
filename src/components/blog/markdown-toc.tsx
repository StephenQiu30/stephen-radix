'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Heading {
  id: string
  text: string
  level: number
}

interface TOCProps {
  content: string
}

export function MarkdownToc({ content }: TOCProps) {
  const [headings, setHeadings] = React.useState<Heading[]>([])
  const [activeId, setActiveId] = React.useState<string>('')
  const [isOpen, setIsOpen] = React.useState(true)

  // 提取目录
  React.useEffect(() => {
    const headingRegex = /^(#{1,4})\s+(.+)$/gm
    const extractedHeadings: Heading[] = []
    const slugCounts: Record<string, number> = {}
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]

      let id = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]+/g, '')

      if (slugCounts[id]) {
        slugCounts[id]++
        id = `${id}-${slugCounts[id] - 1}`
      } else {
        slugCounts[id] = 1
      }

      extractedHeadings.push({ id, text, level })
    }
    setHeadings(extractedHeadings)
  }, [content])

  // 监听滚动，更新激活项
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -60% 0px' }
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-24 max-h-[calc(100vh-120px)] w-full transition-all duration-300">
      <div className="bg-card/50 hover:bg-card group-hover:border-border mb-4 flex items-center justify-between rounded-xl border border-transparent p-2 transition-all">
        <div className="text-muted-foreground/80 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
          <List className="text-primary h-4 w-4" />
          <span>文章目录</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-muted relative ml-1 border-l-2 pl-0">
              {headings.map(heading => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={e => {
                    e.preventDefault()
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }}
                  className={cn(
                    'hover:text-primary relative block py-2 text-sm transition-all duration-200',
                    heading.level === 1 && 'pl-4 font-semibold',
                    heading.level === 2 && 'pl-4',
                    heading.level === 3 && 'pl-8',
                    heading.level === 4 && 'pl-12',
                    activeId === heading.id ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {activeId === heading.id && (
                    <motion.div
                      layoutId="active-toc"
                      className="bg-primary absolute left-[-2px] h-6 w-0.5 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <span className="line-clamp-1">{heading.text}</span>
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-muted-foreground/50 text-[10px] italic">目录已隐藏</p>
        </motion.div>
      )}
    </div>
  )
}
