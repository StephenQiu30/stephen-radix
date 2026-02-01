'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Bookmark, Heart, MessageSquare, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

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
        <div className={cn("fixed bottom-8 left-1/2 z-40 -translate-x-1/2", className)}>
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/70 p-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl dark:border-white/10 dark:bg-black/70">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10',
                        hasThumb && 'bg-red-50 text-red-500 hover:text-red-600 dark:bg-red-950/30'
                    )}
                    onClick={onThumb}
                >
                    <Heart className={cn('h-5 w-5', hasThumb && 'fill-current')} />
                    <span className="sr-only">Like</span>
                </Button>

                <Separator />

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10',
                        hasFavour &&
                        'bg-yellow-50 text-yellow-500 hover:text-yellow-600 dark:bg-yellow-950/30'
                    )}
                    onClick={onFavour}
                >
                    <Bookmark className={cn('h-5 w-5', hasFavour && 'fill-current')} />
                    <span className="sr-only">Bookmark</span>
                </Button>

                <Separator />

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10"
                    onClick={onComment}
                >
                    <MessageSquare className="h-5 w-5" />
                    <span className="sr-only">Comment</span>
                </Button>

                <Separator />

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            <Share2 className="h-5 w-5" />
                            <span className="sr-only">Share</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="center" side="top" sideOffset={16}>
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-white p-2 rounded-lg border shadow-sm">
                                <QRCodeSVG
                                    value={currentUrl}
                                    size={128}
                                    level="M"
                                    className="h-32 w-32"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">Scan to Share</p>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

function Separator() {
    return <div className="mx-1 h-6 w-px bg-black/10 dark:bg-white/10" />
}
