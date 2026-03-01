'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  CommentSection,
  MarkdownRender,
  MarkdownToc,
  PostActionBar,
  PostHeader,
} from '@/components/blog'
import { Button } from '@/components/ui/button'
import { getPostVoById } from '@/api/post/postController'
import { doThumb } from '@/api/post/postThumbController'
import { doFavour } from '@/api/post/postFavourController'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { ArrowLeft, FileWarning, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const { user } = useAppSelector((state: RootState) => state.user)

  const [post, setPost] = React.useState<PostAPI.PostVO | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [hasThumb, setHasThumb] = React.useState(false)
  const [hasFavour, setHasFavour] = React.useState(false)
  const [thumbNum, setThumbNum] = React.useState(0)
  const [favourNum, setFavourNum] = React.useState(0)
  const [commentNum, setCommentNum] = React.useState(0)

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
        const res = (await getPostVoById({
          id: postId as any,
        })) as unknown as PostAPI.BaseResponsePostVO
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
      const res = (await doThumb({
        postId: postId as any,
      })) as unknown as PostAPI.BaseResponseInteger
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
      const res = (await doFavour({
        postId: postId as any,
      })) as unknown as PostAPI.BaseResponseInteger
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
      {/* Background Gradients - Removed for a clean, plain typography-focused aesthetic */}

      {/* Reading Progress Bar (Subtle/Thinner) */}
      <motion.div
        className="bg-gradient-to-r from-primary to-indigo-500 fixed top-0 right-0 left-0 z-50 h-[3px] origin-left shadow-[0_0_10px_rgba(var(--primary),0.5)]"
        style={{ scaleX }}
      />

      {/* Floating Glass Back Button */}
      <div className="fixed top-6 left-6 z-40 hidden md:block">
        <Link href="/blog">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/50 backdrop-blur-xl border-border/40 shadow-sm hover:shadow-md transition-all h-10 w-10 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Mobile Navbar Placeholder (Simplified) */}
      <div className="relative z-10 flex h-[72px] items-center px-6 md:hidden">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          返回博客
        </Link>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 md:pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px] xl:gap-24">
          <article className="mx-auto w-full max-w-3xl">
            <PostHeader post={post} />

            <MarkdownRender content={post.content || ''} />

            {/* Author Bio Footer (Clean & Elegant) */}
            <hr className="my-16 border-border/30" />
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 rounded-[2rem] border border-border/20 bg-muted/10 p-8 sm:p-10 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <Link href={`/user/${post.userVO?.id}`} className="shrink-0 relative group">
                    <div className="absolute -inset-1 rounded-full bg-primary/20 blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-background h-20 w-20 overflow-hidden rounded-full shadow-sm ring-2 ring-background">
                      {post.userVO?.userAvatar ? (
                        <img
                          src={post.userVO.userAvatar}
                          alt={post.userVO.userName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-2xl font-medium bg-secondary/50">
                          {post.userVO?.userName?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="space-y-3 flex-1 pt-1">
                    <div>
                      <p className="text-primary/80 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
                        Author
                      </p>
                      <Link href={`/user/${post.userVO?.id}`}>
                        <h3 className="text-foreground hover:text-primary text-xl font-bold tracking-tight transition-colors">
                          {post.userVO?.userName || '匿名用户'}
                        </h3>
                      </Link>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-[400px]">
                      {post.userVO?.userProfile || '感谢阅读！希望这篇文章对你有所帮助。如果不介意的话，点个赞支持一下吧！'}
                    </p>
                  </div>
                </div>
                <Link href={`/user/${post.userVO?.id}`} className="self-stretch sm:self-auto flex items-center mt-4 sm:mt-0">
                  <Button
                    variant="default"
                    className="w-full sm:w-auto rounded-full px-6 shadow-md hover:shadow-lg transition-all"
                  >
                    查看主页
                  </Button>
                </Link>
              </div>

              {/* Comment Section */}
              <div id="comments" className="scroll-mt-32 mt-16 pb-16">
                <CommentSection postId={postId} onTotalChange={setCommentNum} />
              </div>
            </div>
          </article>

          {/* Desktop MarkdownToc */}
          <aside className="hidden lg:block relative">
            <div className="sticky top-24 pl-4">
              <MarkdownToc content={post.content || ''} />
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Action Bar */}
      <PostActionBar
        hasThumb={hasThumb}
        hasFavour={hasFavour}
        onThumb={handleThumb}
        onFavour={handleFavour}
        onShare={handleShare}
        onComment={() => {
          document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
        }}
        commentNum={commentNum}
        thumbNum={thumbNum}
        favourNum={favourNum}
      />
    </div>
  )
}
