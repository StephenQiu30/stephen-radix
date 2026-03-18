'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UserAvatar } from '@/components/header/user-avatar'
import { Badge } from '@/components/ui/badge'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import dayjs from '@/lib/dayjs'
import {
  ArrowLeft,
  Award,
  Calendar,
  FileWarning,
  Loader2,
  Shield,
  User as UserIcon,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { searchUserByPage, searchPostByPage } from '@/api/search/searchController'
import { PostCard } from '@/components/blog/post-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function UserDetailPage() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = React.useState<UserAPI.UserVO | null>(null)
  const [posts, setPosts] = React.useState<PostAPI.PostVO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [loadingPosts, setLoadingPosts] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Use ES search to find user by ID
        const userRes = (await searchUserByPage({
          id: userId as any,
          current: 1,
          pageSize: 1,
        })) as unknown as SearchAPI.BaseResponsePage

        if (userRes.code === 0 && userRes.data?.records && (userRes.data.records as any).length > 0) {
          const userData = (userRes.data.records as any)[0] as UserAPI.UserVO
          setUser(userData)

          // Fetch user's posts from ES
          setLoadingPosts(true)
          const postsRes = await searchPostByPage({
            userId: userId as any,
            current: 1,
            pageSize: 20,
          })
          if (postsRes.code === 0 && postsRes.data?.records) {
            setPosts(postsRes.data.records as PostAPI.PostVO[])
          }
          setLoadingPosts(false)
        } else {
          setError('用户不存在')
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err)
        setError('获取信息失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-secondary-foreground/50 h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
        <FileWarning className="text-muted-foreground/30 h-16 w-16" />
        <h2 className="text-foreground text-2xl font-semibold">{error || 'User not found'}</h2>
        <Link href="/">
          <Button variant="outline" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </div>
    )
  }

  // Use dayjs for dates and relative time
  const joinedDate = user.createTime ? dayjs(user.createTime).format('MMMM D, YYYY') : 'Unknown'
  const joinedAgo = user.createTime ? dayjs(user.createTime).fromNow(true) : '0 days'
  useGSAP(
    () => {
      if (!loading && user) {
        gsap.from('.animate-in', {
          opacity: 0,
          y: 30,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
        })
      }
    },
    { scope: containerRef, dependencies: [loading, user] }
  )

  // Role config (Read-Only)
  const roleConfig = {
    admin: {
      label: '管理员',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800',
      icon: Shield,
    },
    ban: {
      label: '已封禁',
      color: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800',
      icon: Shield,
    },
    user: {
      label: '普通用户',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800',
      icon: UserIcon,
    },
  }

  const roleInfo = roleConfig[user.userRole as keyof typeof roleConfig] || roleConfig.user
  const RoleIcon = roleInfo.icon

  return (
    <div ref={containerRef} className="container mx-auto px-6 max-w-7xl py-12 md:py-24 space-y-20 selection:bg-primary/20">
      {/* Header - Back Button Only */}
      <div className="animate-in flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center text-[13px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
      </div>

      {/* Huge Typography Profile Header */}
      <div className="animate-in space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <Badge variant="secondary" className="animate-in bg-muted/50 text-muted-foreground font-bold px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase mb-4">
              {roleInfo.label} • Lv.1 Member
            </Badge>
            <h1 className="animate-in text-foreground text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] text-balance">
              {user.userName || 'Unknown'}
            </h1>
            <p className="animate-in text-muted-foreground/60 max-w-xl text-xl font-medium tracking-tight leading-relaxed">
              {user.userProfile || 'No description provided.'}
            </p>
          </div>
          <div className="animate-in shrink-0">
            <div className="relative group">
              <UserAvatar
                user={user}
                size="xl"
                className="h-32 w-32 md:h-48 md:w-48 border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons & Quick Stats */}
        <div className="animate-in flex flex-wrap items-center gap-12 pt-8 border-t border-border/10">
          <StatItem label="Joined" value={joinedAgo} />
          <StatItem label="Stories" value={posts.length} />
          <StatItem label="Likes" value={0} />
          <div className="ml-auto">
            {user.id === (params as any).id && (
              <Link href="/user/settings">
                <Button variant="outline" className="rounded-full px-8 h-12 font-bold tracking-tight border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="animate-in space-y-12">
        <Tabs defaultValue="posts" className="w-full space-y-12">
          <TabsList className="bg-transparent h-auto p-0 gap-8 border-b border-border/10 rounded-none w-full justify-start">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:border-primary border-b-2 border-transparent px-0 pb-4 rounded-none text-xl font-bold tracking-tight text-muted-foreground transition-all"
            >
              Published Stories ({posts.length})
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:border-primary border-b-2 border-transparent px-0 pb-4 rounded-none text-xl font-bold tracking-tight text-muted-foreground transition-all"
            >
              Member Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="animate-in space-y-12 outline-none pt-4">
            <div className="grid gap-16 md:grid-cols-2">
              <InfoItem
                label="Display Name"
                value={user.userName || 'Not set'}
                description="The name visible to the community."
              />
              <InfoItem
                label="Unique Identifier"
                value={user.id ? `#${user.id}` : 'Unknown'}
                description="System identification code."
              />
              <InfoItem
                label="Member Since"
                value={joinedDate}
              />
            </div>
          </TabsContent>

          <TabsContent value="posts" className="animate-in outline-none pt-4">
            {loadingPosts ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/30" />
              </div>
            ) : posts.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={`post-${post.id}`} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 text-center">
                <FileWarning className="text-muted-foreground/20 h-16 w-16" />
                <p className="text-muted-foreground/60 text-lg font-medium">No published stories yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StatItem({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-foreground text-3xl font-bold tracking-tighter">{value}</div>
      <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">{label}</div>
    </div>
  )
}

function InfoItem({
  label,
  value,
  description,
}: {
  label: string
  value: React.ReactNode
  description?: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground font-bold text-[10px] tracking-widest uppercase">
        {label}
      </p>
      <div className="text-foreground text-2xl font-bold tracking-tight leading-tight">{value}</div>
      {description && <p className="text-muted-foreground/60 text-sm font-medium tracking-tight">{description}</p>}
    </div>
  )
}
