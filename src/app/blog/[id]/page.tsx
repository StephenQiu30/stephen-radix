'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, useScroll, useSpring } from 'framer-motion'
import { MarkdownRender, PostHeader, MarkdownToc } from '@/components/blog'
import { Button } from '@/components/ui/button'
import { getPostVoById } from '@/api/postController'
import { doThumb } from '@/api/postThumbController'
import { doPostFavour } from '@/api/postFavourController'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { ArrowLeft, Bookmark, FileWarning, Heart, Loader2, Share2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const { user } = useAppSelector((state: RootState) => state.user)

  const [post, setPost] = React.useState<API.PostVO | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [hasThumb, setHasThumb] = React.useState(false)
  const [hasFavour, setHasFavour] = React.useState(false)
  const [thumbNum, setThumbNum] = React.useState(0)
  const [favourNum, setFavourNum] = React.useState(0)

  // Scroll Progress
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // 获取文章详情
  React.useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = (await getPostVoById({ id: postId as any })) as any
        if (res && res.code === 0 && res.data) {
          setPost(res.data)
          setHasThumb(res.data.hasThumb || false)
          setHasFavour(res.data.hasFavour || false)
          setThumbNum(res.data.thumbNum || 0)
          setFavourNum(res.data.favourNum || 0)
        } else {
          setError(`${res?.message || 'Story not found'} (ID: ${postId})`)
          setPost(null)
        }
      } catch (err: any) {
        console.error('Failed to load story:', err)
        setError('Network error, please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  const handleThumb = async () => {
    if (!user) return router.push('/')
    try {
      const res = (await doThumb({ postId: postId as any })) as any
      if (res.code === 0) {
        const delta = res.data || 0
        setHasThumb(delta > 0)
        setThumbNum(prev => prev + delta)
      }
    } catch (err) {
      console.error('Like failed', err)
    }
  }

  const handleFavour = async () => {
    if (!user) return router.push('/')
    try {
      const res = (await doPostFavour({ postId: postId as any })) as any
      if (res.code === 0) {
        const delta = res.data || 0
        setHasFavour(delta > 0)
        setFavourNum(prev => prev + delta)
      }
    } catch (err) {
      console.error('Favorite failed', err)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Share Story',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-secondary-foreground/50 h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
        <FileWarning className="text-muted-foreground/30 h-16 w-16" />
        <h2 className="text-foreground text-2xl font-semibold">Story unavailable</h2>
        <Link href="/blog">
          <Button variant="outline" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Stories
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Reading Progress Bar */}
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1 origin-left"
        style={{ scaleX }}
      />

      {/* Navbar Placeholder (Simplified) */}
      <div className="flex h-16 items-center px-6">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_250px] xl:gap-24">
          <article className="prose prose-neutral dark:prose-invert mx-auto w-full max-w-3xl">
            <PostHeader post={post} />

            <MarkdownRender content={post.content || ''} />

            {/* Author Bio Footer */}
            <div className="border-border mt-20 border-t pt-12">
              <div className="flex items-center gap-4">
                <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
                  {post.userVO?.userName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    {post.userVO?.userName || 'Anonymous'}
                  </p>
                  <p className="text-muted-foreground text-sm">Thanks for reading!</p>
                </div>
              </div>
            </div>
          </article>

          {/* Desktop MarkdownToc */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <MarkdownToc content={post.content || ''} />
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2">
        <div className="border-border/50 bg-background/80 flex items-center gap-2 rounded-full border p-2 shadow-lg backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'hover:bg-secondary/80 rounded-full',
              hasThumb && 'text-red-500 hover:text-red-600'
            )}
            onClick={handleThumb}
          >
            <Heart className={cn('h-5 w-5', hasThumb && 'fill-current')} />
            <span className="sr-only">Like</span>
          </Button>

          <div className="bg-border/50 h-4 w-px" />

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'hover:bg-secondary/80 rounded-full',
              hasFavour && 'text-yellow-500 hover:text-yellow-600'
            )}
            onClick={handleFavour}
          >
            <Bookmark className={cn('h-5 w-5', hasFavour && 'fill-current')} />
            <span className="sr-only">Bookmark</span>
          </Button>

          <div className="bg-border/50 h-4 w-px" />

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary/80 rounded-full"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
