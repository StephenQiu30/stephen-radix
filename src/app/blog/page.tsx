'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { PostCard } from '@/components/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchPostByPage } from '@/api/search/searchController'
import { BookOpen, FileWarning, Loader2, Plus, Search, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store'

function BlogList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearchText = searchParams.get('q') || ''
  const { user } = useAppSelector((state: RootState) => state.user)
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
    <div className="relative min-h-screen bg-background selection:bg-primary/10">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 md:pt-32 lg:px-8 relative z-10">
        {/* Minimalist Hero Section */}
        <div className="mx-auto mb-20 max-w-3xl text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase border-l border-primary/30"
          >
            Blog & Insights
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              文章与深度见解
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-muted-foreground/80 mx-auto max-w-lg text-sm font-medium leading-relaxed md:text-base"
            >
              分享技术洞见与开发实践，沉淀思考与成长。
            </motion.p>
          </div>
        </div>

        {/* Minimalist Search Bar */}
        <div className="mx-auto mb-20 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative flex items-center group"
          >
            <Search className="absolute left-4 h-4 w-4 text-muted-foreground/40 transition-colors group-focus-within:text-primary/60" />
            <form onSubmit={handleSearch} className="w-full">
              <Input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索感兴趣的话题..."
                className="w-full pl-11 pr-24 h-12 rounded-full border-border/60 bg-muted/20 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/30 text-sm font-medium"
              />
            </form>
          </motion.div>
        </div>

        {/* Article Grid Container */}
        <div className="min-h-[400px]">
          {loading && currentPage === 1 ? (
            <LoadingSkeleton type="grid" count={6} />
          ) : error ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center space-y-6">
              <div className="w-16 h-16 rounded-[24px] bg-destructive/10 flex items-center justify-center">
                <FileWarning className="text-destructive h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold tracking-tight">{error}</h3>
                <p className="text-sm text-muted-foreground font-medium">暂时无法获取内容，请稍后再试</p>
              </div>
              <Button variant="outline" onClick={fetchPosts} className="rounded-full px-6 h-10 text-sm font-bold border-2">
                重试加载
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center space-y-5">
              <div className="w-16 h-16 rounded-[24px] bg-muted/40 flex items-center justify-center">
                <BookOpen className="text-muted-foreground/30 h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold tracking-tight text-foreground/80">未找到相关文章</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {searchText ? `没有找到关于 "${searchText}" 的内容` : '这里静悄悄的，开启你的创作之旅吧'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index % 3 * 0.1, duration: 0.5 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modernized Loading/Load More Section */}
        <div className="mt-28 pb-20 flex justify-center">
          {hasMore ? (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={loadingMore}
              className="group relative h-13 min-w-[170px] rounded-full px-8 text-sm font-bold tracking-tight shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-[1.5px] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    加载中...
                  </>
                ) : (
                  <>
                    探索更多内容
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </Button>
          ) : posts.length > 0 ? (
            <div className="flex flex-col items-center gap-5">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
              <p className="text-[10px] font-black tracking-[0.25em] uppercase text-muted-foreground/30">
                End of content
              </p>
            </div>
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
