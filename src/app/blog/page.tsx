'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { PostCard } from '@/components/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchPostByPage } from '@/api/search/searchController'
import { BookOpen, FileWarning, Loader2, Plus, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'

function BlogList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearchText = searchParams.get('q') || ''
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 12

  const [posts, setPosts] = React.useState<PostAPI.PostVO[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchText, setSearchText] = React.useState(currentSearchText)

  // 获取文章列表 (From ES directly, userVO is included in the DTO)
  const fetchPosts = React.useCallback(async () => {
    if (currentPage === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)
    try {
      const res = await searchPostByPage({
        current: currentPage,
        pageSize,
        searchText: currentSearchText || undefined,
        sortField: 'createTime',
        sortOrder: 'descend',
      })

      if (res && res.code === 0 && res.data) {
        let records = (res.data.records || []) as PostAPI.PostVO[]
        const totalCount = Number(res.data.total) || 0

        // Map ES response to state. The nested userObj from ES is often named 'user' or 'userVO'
        records = records.map(record => ({
          ...record,
          userVO: record.userVO || (record as any).user,
        }))

        if (currentPage === 1) {
          setPosts(records)
        } else {
          setPosts(prev => {
            const newRecords = records.filter(record => !prev.some(p => p.id === record.id))
            return [...prev, ...newRecords]
          })
        }
        setTotal(totalCount)
      } else {
        setError(res?.message || '加载文章列表失败')
      }
    } catch (err: any) {
      console.error('获取文章列表失败:', err)
      setError('网络请求失败，请尝试刷新页面')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [currentPage, currentSearchText])

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchText) {
      params.set('q', searchText)
    } else {
      params.delete('q')
    }
    router.push(`/blog?${params.toString()}`)
    setCurrentPage(1)
  }

  const hasMore = posts.length < total

  return (
    <div className="from-background via-background to-primary/2 selection:bg-primary/20 min-h-screen bg-gradient-to-br pb-20 font-sans text-foreground">
      {/* 极简网格背景 */}
      <div className="bg-grid-black/[0.02] dark:bg-grid-white/[0.02] absolute inset-0 pointer-events-none z-0" />

      <div className="mx-auto w-full max-w-7xl px-6 pt-12 md:pt-16 lg:px-8 relative z-10">

        {/* 页面标题区 */}
        <div className="mx-auto mb-20 max-w-4xl space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full border border-black/5 bg-black/5 px-4 py-1.5 text-sm font-medium backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/20"
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            BLOG & INSIGHTS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground text-6xl font-semibold tracking-tighter md:text-7xl lg:text-8xl dark:text-zinc-200"
          >
            文章与 <br />
            <span className="from-primary to-primary/60 bg-gradient-to-b bg-clip-text text-transparent">
              深度见解
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-light md:text-2xl dark:text-zinc-500"
          >
            探索来自我们团队和社区的最新更新、<br className="hidden sm:block" />深度技术文章和开发教程。
          </motion.p>
        </div>

        {/* 控制栏：搜索与筛选 */}
        <div className="sticky top-20 z-30 mx-auto mb-16 max-w-2xl transform-gpu">
          <div className="bg-background/70 border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgb(var(--primary),0.08)] focus-within:border-primary/30 flex flex-col gap-3 rounded-3xl border p-2 backdrop-blur-2xl transition-all duration-300 sm:flex-row sm:gap-2 sm:rounded-full">
            <div className="relative flex flex-1 items-center group/search">
              <div className="bg-primary/5 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:ml-1">
                <Search className="h-4 w-4" />
              </div>
              <form onSubmit={handleSearch} className="h-full w-full">
                <Input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="text-foreground placeholder:text-muted-foreground/50 h-10 w-full border-none bg-transparent px-3 text-[15px] font-medium transition-colors focus-visible:ring-0 sm:h-12"
                />
              </form>
            </div>

            {/* Create Button */}
            <Link href="/blog/create" className="shrink-0 sm:pr-1 sm:py-1">
              <Button className="bg-primary text-primary-foreground h-10 w-full rounded-2xl px-6 font-semibold tracking-wide shadow-sm transition-transform hover:scale-105 sm:h-10 sm:w-auto sm:rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                写文章
              </Button>
            </Link>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="min-h-[200px]">
          {loading && currentPage === 1 ? (
            <LoadingSkeleton type="grid" count={8} />
          ) : error ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <FileWarning className="text-destructive/50 mb-4 h-12 w-12" />
              <h3 className="text-destructive mb-2 text-lg font-semibold">{error}</h3>
              <Button variant="outline" onClick={fetchPosts} className="mt-4 rounded-full">
                重试
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <BookOpen className="text-muted-foreground/30 mb-4 h-12 w-12" />
              <h3 className="mb-2 text-xl font-medium">暂无文章</h3>
              <p className="text-muted-foreground">
                {searchText ? '请尝试调整搜索关键词。' : '成为第一个写文章的人。'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* 加载更多 */}
        <div className="mt-20 flex justify-center">
          {hasMore ? (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={loadingMore}
              className="border-white/40 bg-white/40 h-12 min-w-[160px] rounded-full px-8 text-[15px] font-semibold tracking-tight shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中...
                </>
              ) : (
                '加载更多文章'
              )}
            </Button>
          ) : posts.length > 0 ? (
            <p className="text-muted-foreground text-sm">没有更多文章了</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      }
    >
      <BlogList />
    </React.Suspense>
  )
}
