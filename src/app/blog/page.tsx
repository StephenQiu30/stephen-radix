'use client'

import * as React from 'react'
import { PostCard } from '@/components/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { useRouter, useSearchParams } from 'next/navigation'
import { listPostVoByPage } from '@/api/post/postController'
import { searchPostByPage } from '@/api/search/searchController'
import { getUserVoByIds } from '@/api/user/userController'
import { BookOpen, FileWarning, Loader2, Plus, Search } from 'lucide-react'
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
        sortField: 'createTime',
        sortOrder: 'descend',
      })

      if (res && res.code === 0 && res.data) {
        let records = (res.data.records || []) as PostAPI.PostVO[]
        const totalCount = Number(res.data.total) || 0

        // 1. Collect all unique userIDs that need hydration
        const userIdsToFetch = Array.from(
          new Set(records.map(r => r.userId).filter(id => !!id))
        ) as number[]

        // 2. Hydrate user info if we have IDs
        if (userIdsToFetch.length > 0) {
          try {
            const userRes = await getUserVoByIds({ ids: userIdsToFetch })
            if (userRes && userRes.code === 0 && userRes.data) {
              const userMap = new Map(userRes.data.map(u => [u.id, u]))
              records = records.map(record => ({
                ...record,
                userVO: record.userVO || userMap.get(record.userId),
              }))
            }
          } catch (userErr) {
            console.error('Hydration failed:', userErr)
          }
        }

        // Just in case some are still missing (e.g. user deleted or fetch failed)
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
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-32 pb-20 md:pt-40 lg:px-8">
        {/* 页面标题区 */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            BLOG & INSIGHTS
          </div>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            文章与见解
          </h1>

          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed font-normal text-balance">
            探索来自我们团队和社区的最新更新、深度技术文章和开发教程。
          </p>
        </div>

        {/* 控制栏：搜索与筛选 */}
        <div className="sticky top-20 z-30 mx-auto mb-16 max-w-4xl">
          <div className="bg-white/60 border-white/40 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:border-white/60 flex flex-col gap-3 rounded-2xl border p-2 backdrop-blur-3xl transition-all sm:flex-row sm:gap-2 sm:rounded-full dark:border-white/10 dark:bg-zinc-900/60">
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
