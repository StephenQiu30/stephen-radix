'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PostCard } from '@/components/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchPostByPage } from '@/api/search/searchController'
import { BookOpen, FileWarning, Loader2, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
}

function BlogList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearchText = searchParams.get('q') || ''
  const [currentPage, setCurrentPage] = React.useState(1)
  const [activeTab, setActiveTab] = React.useState<'latest' | 'popular'>('latest')
  const pageSize = 12

  const [posts, setPosts] = React.useState<PostAPI.PostVO[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchText, setSearchText] = React.useState(currentSearchText)

  // 获取文章列表
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
        sortField: activeTab === 'latest' ? 'create_time' : 'thumbNum',
        sortOrder: 'descend',
      })

      if (res && res.code === 0 && res.data) {
        let records = (res.data.records || []) as PostAPI.PostVO[]
        const totalCount = Number(res.data.total) || 0

        // Handle possible backend mapping issue (user -> userVO)
        records = records.map(record => ({
          ...record,
          userVO: record.userVO || (record as any).user,
        }))

        if (currentPage === 1) {
          setPosts(records)
        } else {
          setPosts(prev => {
            const newRecords = records.filter(
              record => !prev.some(p => p.id === record.id)
            )
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
  }, [currentPage, currentSearchText, activeTab])

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
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      {/* Background Gradients - Matches Homepage */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-blue-400/10 opacity-50 blur-[120px]" />
        <div className="absolute top-[-10%] right-[20%] h-[50vw] w-[50vw] rounded-full bg-indigo-400/10 opacity-50 blur-[120px]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none absolute inset-0" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-32 pb-20 md:pt-40 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 页面标题区 */}
        <div className="relative z-10 mb-24 flex flex-col items-center text-center">
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 backdrop-blur-md dark:text-blue-400"
          >
            BLOG & INSIGHTS
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-8 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl"
          >
            <span className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-transparent">
              文章与见解
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-2xl text-lg leading-relaxed font-normal text-balance md:text-xl"
          >
            探索来自我们团队和社区的最新更新、深度技术文章和开发教程。
          </motion.p>
        </div>

        {/* 控制栏：搜索与筛选 */}
        <motion.div variants={itemVariants} className="sticky top-20 z-30 mx-auto mb-12 max-w-4xl">
          <div className="bg-background/60 border-border/40 hover:border-border/60 flex flex-col gap-3 rounded-3xl border p-2 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl sm:flex-row sm:gap-2 sm:rounded-full">
            {/* Tab Switcher */}
            <div className="bg-muted/50 flex shrink-0 rounded-full p-1">
              <button
                onClick={() => setActiveTab('latest')}
                className={cn(
                  'rounded-full px-6 py-2 text-sm font-medium transition-all duration-300',
                  activeTab === 'latest'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                最新发布
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={cn(
                  'rounded-full px-6 py-2 text-sm font-medium transition-all duration-300',
                  activeTab === 'popular'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                热门精选
              </button>
            </div>

            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
              <form onSubmit={handleSearch} className="h-full">
                <Input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="hover:bg-muted/30 focus:bg-muted/50 h-10 w-full rounded-2xl border-none bg-transparent pr-4 pl-10 transition-colors sm:h-full sm:rounded-full"
                />
              </form>
            </div>

            {/* Create Button */}
            <Link href="/blog/create" className="shrink-0">
              <Button className="bg-primary text-primary-foreground h-10 w-full rounded-2xl px-6 shadow-none transition-opacity hover:opacity-90 sm:h-full sm:w-auto sm:rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                写文章
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 文章列表 - Simplified Animation */}
        <div className="min-h-[200px]">
          {loading && currentPage === 1 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {posts.map((post, i) => (
                <motion.div
                  key={post.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (i % pageSize) * 0.05 }}
                  layout
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
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
              className="h-12 min-w-[160px] rounded-full px-8 font-medium shadow-sm transition-all hover:scale-105 hover:shadow-md"
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
      </motion.div>
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
