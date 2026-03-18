'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, Heart, MessageSquare, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface PostActionBarProps {
  hasThumb: boolean
  hasFavour: boolean
  onThumb: () => void
  onFavour: () => void
  onComment: () => void
  onShare: () => void
  className?: string
  title?: string // For QR code alt text
  commentNum?: number
  thumbNum?: number
  favourNum?: number
}

export function PostActionBar({
  hasThumb,
  hasFavour,
  onThumb,
  onFavour,
  onComment,
  className,
  title = 'Share',
  commentNum = 0,
  thumbNum = 0,
  favourNum = 0,
}: PostActionBarProps) {
  const [currentUrl, setCurrentUrl] = React.useState('')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  return (
    <div className={cn('fixed bottom-8 left-1/2 z-40 -translate-x-1/2', className)}>
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.2 }}
        className="flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-zinc-900/90 px-2.5 py-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent dark:from-white/[0.05] pointer-events-none" />
        <div className="relative flex items-center gap-1.5 text-foreground/80">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-10 rounded-full px-4 transition-all duration-300 hover:bg-muted/40',
              hasThumb && 'text-primary bg-primary/10 hover:bg-primary/20 shadow-sm'
            )}
            onClick={onThumb}
          >
            <Heart className={cn('h-[18px] w-[18px] mr-2 transition-all duration-300', hasThumb && 'fill-current scale-110')} />
            {thumbNum > 0 && <span className="text-[13px] font-black tracking-tight">{thumbNum}</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-10 rounded-full px-4 transition-all duration-300 hover:bg-muted/40',
              hasFavour && 'text-primary bg-primary/10 hover:bg-primary/20 shadow-sm'
            )}
            onClick={onFavour}
          >
            <Bookmark className={cn('h-[18px] w-[18px] mr-2 transition-all duration-300', hasFavour && 'fill-current scale-110')} />
            {favourNum > 0 && <span className="text-[13px] font-black tracking-tight">{favourNum}</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-10 rounded-full px-4 transition-all duration-300 hover:bg-muted/40"
            onClick={onComment}
          >
            <MessageSquare className="h-[18px] w-[18px] mr-2" />
            {commentNum > 0 && <span className="text-[13px] font-black tracking-tight">{commentNum}</span>}
          </Button>
        </div>

        <div className="relative mx-3 h-4 w-px bg-border/40" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              <Share2 className="h-[18px] w-[18px]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-zinc-900/95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-none backdrop-blur-xl" align="center" side="top" sideOffset={20}>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-black/5">
                <QRCodeSVG value={currentUrl} size={140} level="M" />
              </div>
              <p className="text-foreground/70 text-[11px] font-semibold tracking-wider uppercase">Share</p>
            </div>
          </PopoverContent>
        </Popover>
      </motion.div>
    </div>
  )
}

