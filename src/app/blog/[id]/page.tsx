'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, useScroll, useSpring } from 'framer-motion'
import { MarkdownRender, MarkdownToc, PostHeader, CommentSection } from '@/components/blog'
import { Button } from '@/components/ui/button'
import { getPostVoById } from '@/api/postController'
import { doThumb } from '@/api/postThumbController'
import { doPostFavour } from '@/api/postFavourController'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import {
  ArrowLeft,
  Bookmark,
  FileWarning,
  Heart,
  Loader2,
  MessageSquare,
  Share2,
} from 'lucide-react'
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
    <div className="bg-background relative min-h-screen pb-32">
      {/* Background Gradients - Matches Homepage */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] h-[50vw] w-[50vw] rounded-full bg-blue-400/5 opacity-40 blur-[100px]" />
        <div className="absolute top-[10%] right-[10%] h-[40vw] w-[40vw] rounded-full bg-indigo-400/5 opacity-40 blur-[100px]" />
      </div>

      {/* Reading Progress Bar */}
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1 origin-left"
        style={{ scaleX }}
      />

      {/* Navbar Placeholder (Simplified) */}
      <div className="relative z-10 flex h-16 items-center px-6">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_250px] xl:gap-24">
          <article className="prose prose-neutral dark:prose-invert mx-auto w-full max-w-3xl">
            <PostHeader post={post} />

            <MarkdownRender content={post.content || ''} />

            {/* Author Bio Footer */}
            <div className="border-border/40 mt-16 border-t pt-10">
              <div className="flex flex-col gap-8">
                {/* User Profile Card */}
                <div className="flex items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-all hover:shadow-2xl dark:bg-white/5">
                  <div className="flex items-center gap-6">
                    <div className="border-background relative h-20 w-20 overflow-hidden rounded-full border-2 shadow-sm">
                      {post.userVO?.userAvatar ? (
                        <img
                          src={post.userVO.userAvatar}
                          alt={post.userVO.userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-2xl font-bold">
                          {post.userVO?.userName?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground/80 text-sm font-medium tracking-wider uppercase">
                        作者
                      </p>
                      <h3 className="text-foreground text-2xl font-bold">
                        {post.userVO?.userName || '匿名用户'}
                      </h3>
                      <p className="text-muted-foreground pt-1 text-sm">
                        感谢阅读！希望这篇文章对你有所帮助。
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground border-primary/20 h-10 rounded-full px-8 font-medium"
                  >
                    关注
                  </Button>
                </div>

                {/* Comment Section */}
                <CommentSection postId={postId} />
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
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/70 p-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl dark:border-white/10 dark:bg-black/70">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10',
              hasThumb && 'bg-red-50 text-red-500 hover:text-red-600 dark:bg-red-950/30'
            )}
            onClick={handleThumb}
          >
            <Heart className={cn('h-5 w-5', hasThumb && 'fill-current')} />
            <span className="sr-only">Like</span>
          </Button>

          <div className="mx-1 h-6 w-px bg-black/10 dark:bg-white/10" />

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10',
              hasFavour &&
                'bg-yellow-50 text-yellow-500 hover:text-yellow-600 dark:bg-yellow-950/30'
            )}
            onClick={handleFavour}
          >
            <Bookmark className={cn('h-5 w-5', hasFavour && 'fill-current')} />
            <span className="sr-only">Bookmark</span>
          </Button>

          <div className="mx-1 h-6 w-px bg-black/10 dark:bg-white/10" />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10"
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
