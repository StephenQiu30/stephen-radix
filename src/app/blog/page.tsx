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
    <div className="bg-background text-foreground min-h-screen">
      <motion.div
        className="mx-auto w-full max-w-[1400px] px-6 pt-16 pb-20 md:pt-24 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 页面标题区 */}
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.div
            variants={itemVariants}
            className="bg-primary/10 text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          >
            <BookOpen className="h-8 w-8" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="mb-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl"
          >
            文章与见解
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-2xl text-lg leading-relaxed"
          >
            探索来自我们团队和社区的最新更新、深度文章和教程。
          </motion.p>
        </div>

        {/* 控制栏：搜索与筛选 */}
        <motion.div
          variants={itemVariants}
          className="bg-background/80 border-border/40 sticky top-16 z-30 mb-8 rounded-2xl border px-4 py-3 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Tab Switcher */}
            <div className="bg-muted/50 flex p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('latest')}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300",
                  activeTab === 'latest'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                最新发布
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300",
                  activeTab === 'popular'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                热门精选
              </button>
            </div>

            {/* Search & Create */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder="搜索文章..."
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    className="border-border/50 bg-secondary/30 focus:bg-background h-9 rounded-xl pl-9 transition-all"
                  />
                </form>
              </div>
              <div className="h-4 w-[1px] bg-border/50 mx-1 hidden sm:block" />
              <Link href="/blog/create">
                <Button
                  className="h-9 rounded-xl px-4 shadow-sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  写文章
                </Button>
              </Link>
            </div>
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
