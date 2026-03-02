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
import { ArrowLeft, ChevronLeft, FileWarning, Loader2 } from 'lucide-react'
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
    <div className="bg-background relative min-h-screen pb-32 pt-4 md:pt-12">
      <motion.div
        className="bg-gradient-to-r from-primary to-indigo-500 fixed top-0 right-0 left-0 z-50 h-[3px] origin-left shadow-[0_0_10px_rgba(var(--primary),0.5)]"
        style={{ scaleX }}
      />

      {/* Mobile Navbar */}
      <div className="relative z-10 flex h-14 items-center px-4 md:hidden border-b border-border/40 bg-background/80 backdrop-blur-2xl mb-4 sticky top-0">
        <Link href="/blog" className="flex items-center text-[15px] font-medium text-foreground/80 hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5 mr-0.5" />
          返回博客
        </Link>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 md:pt-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px] xl:gap-24 relative">
          <motion.article
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[680px]"
          >
            {/* Minimal Back Button (Apple Style) */}
            <div className="hidden md:flex mb-10">
              <Link
                href="/blog"
                className="group flex items-center text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <div className="flex bg-muted/40 group-hover:bg-muted/60 p-1 rounded-full mr-2 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                返回博客
              </Link>
            </div>

            <PostHeader post={post} />

            <MarkdownRender content={post.content || ''} />

            {/* Author Bio Footer (Minimalist) */}
            <hr className="my-16 border-border/40" />
            <div className="mx-auto w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 rounded-2xl border border-border/50 bg-muted/20 p-6 sm:p-8 hover:bg-muted/40 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
                  <Link href={`/user/${post.userVO?.id}`} className="shrink-0 relative group">
                    <div className="relative bg-muted h-16 w-16 overflow-hidden rounded-full shadow-sm ring-1 ring-border/50 transition-transform duration-300 group-hover:scale-105">
                      {post.userVO?.userAvatar ? (
                        <img
                          src={post.userVO.userAvatar}
                          alt={post.userVO.userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xl font-medium">
                          {post.userVO?.userName?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="space-y-1.5 flex-1 pt-0.5">
                    <div>
                      <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase mb-0.5">
                        Author
                      </p>
                      <Link href={`/user/${post.userVO?.id}`}>
                        <h3 className="text-foreground hover:text-primary text-xl font-bold tracking-tight transition-colors">
                          {post.userVO?.userName || '匿名用户'}
                        </h3>
                      </Link>
                    </div>
                    <p className="text-muted-foreground/80 text-sm leading-relaxed max-w-[440px]">
                      {post.userVO?.userProfile || '感谢阅读！希望这篇文章对你有所帮助。如果不介意的话，点个赞支持一下吧！'}
                    </p>
                  </div>
                </div>
                <Link href={`/user/${post.userVO?.id}`} className="self-stretch sm:self-auto flex items-center mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto rounded-full px-6 h-10 font-medium"
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
          </motion.article>

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
