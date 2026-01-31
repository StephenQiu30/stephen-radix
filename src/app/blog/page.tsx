'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PostCard } from '@/components/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { listPostVoByPage } from '@/api/postController'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileWarning,
  Loader2,
  Plus,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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

export default function BlogPage() {
  const [posts, setPosts] = React.useState<API.PostVO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchText, setSearchText] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<'latest' | 'popular'>('latest')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const pageSize = 12

  // 获取文章列表
  const fetchPosts = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = (await listPostVoByPage({
        current: currentPage,
        pageSize,
        searchText: searchText || undefined,
        sortField: 'createTime',
        sortOrder: 'descend',
      })) as any

      if (res && res.code === 0) {
        const data = res.data || {}
        const records = Array.isArray(data) ? data : data.records || data.list || []
        const totalCount = data.total ?? data.totalCount ?? records.length

        setPosts(records)
        setTotal(totalCount)
      } else {
        setError(res?.message || '加载文章列表失败')
        setPosts([])
        setTotal(0)
      }
    } catch (err: any) {
      console.error('获取文章列表失败:', err)
      setError('网络请求失败，请尝试刷新页面')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchText])

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const totalPages = Math.ceil(total / pageSize)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPosts()
  }

  return (
    <div className="bg-background text-foreground min-h-screen relative overflow-hidden">
      {/* Background Gradients - Matches Homepage */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-blue-400/10 opacity-50 blur-[120px]" />
        <div className="absolute right-[20%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-indigo-400/10 opacity-50 blur-[120px]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <motion.div
        className="mx-auto w-full max-w-[1400px] px-6 pt-32 pb-20 md:pt-40 lg:px-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 页面标题区 */}
        <div className="mb-24 flex flex-col items-center text-center relative z-10">
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 backdrop-blur-md"
          >
            BLOG & INSIGHTS
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-8 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl"
          >
            <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              文章与见解
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-2xl text-lg leading-relaxed font-normal md:text-xl text-balance"
          >
            探索来自我们团队和社区的最新更新、深度技术文章和开发教程。
          </motion.p>
        </div>

        {/* 控制栏：搜索与筛选 */}
        <motion.div
          variants={itemVariants}
          className="sticky top-20 z-30 mb-12 mx-auto max-w-4xl"
        >
          <div className="bg-background/60 border-border/40 backdrop-blur-xl shadow-lg border rounded-full p-2 flex flex-col sm:flex-row gap-2 transition-all hover:border-border/60 hover:shadow-xl">
            {/* Tab Switcher */}
            <div className="bg-muted/50 p-1 rounded-full flex shrink-0">
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

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <form onSubmit={handleSearch} className="h-full">
                <Input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full h-full rounded-full border-none bg-transparent hover:bg-muted/30 focus:bg-muted/50 pl-10 pr-4 transition-colors"
                />
              </form>
            </div>

            {/* Create Button */}
            <Link href="/blog/create" className="shrink-0">
              <Button className="rounded-full h-full px-6 w-full sm:w-auto shadow-none bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4 mr-2" />
                写文章
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 文章列表 */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[400px] items-center justify-center"
            >
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              variants={itemVariants}
              className="flex min-h-[400px] flex-col items-center justify-center text-center"
            >
              <FileWarning className="text-destructive/50 mb-4 h-12 w-12" />
              <h3 className="text-destructive mb-2 text-lg font-semibold">{error}</h3>
              <Button variant="outline" onClick={fetchPosts} className="mt-4 rounded-full">
                重试
              </Button>
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div
              key="empty"
              variants={itemVariants}
              className="flex min-h-[400px] flex-col items-center justify-center text-center"
            >
              <BookOpen className="text-muted-foreground/30 mb-4 h-12 w-12" />
              <h3 className="mb-2 text-xl font-medium">暂无文章</h3>
              <p className="text-muted-foreground">
                {searchText ? '请尝试调整搜索关键词。' : '成为第一个写文章的人。'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {posts.map((post, i) => (
                <motion.div key={post.id} variants={itemVariants} custom={i} layout>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 分页 */}
        {!loading && totalPages > 1 && (
          <motion.div variants={itemVariants} className="mt-20 flex justify-center">
            <div className="border-border/50 bg-secondary/30 flex items-center gap-2 rounded-full border p-2 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 px-2">
                <span className="text-sm font-medium">{currentPage}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground text-sm">{totalPages}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
