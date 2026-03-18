'use client'

import * as React from 'react'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth/auth-modal'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookMarked, FileText, Heart, User as UserIcon, Calendar, Github, Award, AtSign, Shield, Zap, Edit, Loader2, ArrowRight } from 'lucide-react'
import { PostCard } from '@/components/blog/post-card'
import { searchPostByPage } from '@/api/search/searchController'

import { listMyThumbPostByPage } from '@/api/post/postThumbController'
import { listMyFavourPostByPage } from '@/api/post/postFavourController'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function ProfilePage() {
  const { user } = useAppSelector((state: RootState) => state.user)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  // 选项卡状态与数据
  const [activeTab, setActiveTab] = React.useState('about')
  const [posts, setPosts] = React.useState<PostAPI.PostVO[]>([])
  const [likedPosts, setLikedPosts] = React.useState<PostAPI.PostVO[]>([])
  const [favoritedPosts, setFavoritedPosts] = React.useState<PostAPI.PostVO[]>([])

  const [loadingPosts, setLoadingPosts] = React.useState(false)
  const [loadingLikes, setLoadingLikes] = React.useState(false)
  const [loadingFavorites, setLoadingFavorites] = React.useState(false)

  // Fetch functions
  const fetchMyPosts = async () => {
    try {
      setLoadingPosts(true)
      const res = await searchPostByPage({
        userId: user?.id,
        current: 1,
        pageSize: 20,
      })
      if (res.code === 0 && res.data?.records) {
        setPosts(res.data.records as PostAPI.PostVO[])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoadingPosts(false)
    }
  }

  const fetchMyLikes = async () => {
    try {
      setLoadingLikes(true)
      const res = await listMyThumbPostByPage({ current: 1, pageSize: 20 })
      if (res.code === 0 && res.data?.records) {
        setLikedPosts(res.data.records)
      }
    } catch (error) {
      console.error('Failed to fetch liked posts:', error)
    } finally {
      setLoadingLikes(false)
    }
  }

  const fetchMyFavorites = async () => {
    try {
      setLoadingFavorites(true)
      const res = await listMyFavourPostByPage({ current: 1, pageSize: 20 })
      if (res.code === 0 && res.data?.records) {
        setFavoritedPosts(res.data.records)
      }
    } catch (error) {
      console.error('Failed to fetch favorited posts:', error)
    } finally {
      setLoadingFavorites(false)
    }
  }

  // Effect to load data when tab changes or component mounts
  React.useEffect(() => {
    if (!user) return
    // 并行获取所有关键数据以填充侧边栏数字
    if (posts.length === 0 && !loadingPosts) fetchMyPosts()
    if (likedPosts.length === 0 && !loadingLikes) fetchMyLikes()
    if (favoritedPosts.length === 0 && !loadingFavorites) fetchMyFavorites()
  }, [user])

  if (!user) {
    return (
      <>
        <LoginPromptCard
          onLoginClick={() => setAuthModalOpen(true)}
          title="需要登录"
          description="请先登录以查看个人资料"
        />
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    )
  }

  // 计算账户年龄
  const accountAge = user?.createTime
    ? Math.floor((Date.now() - new Date(user.createTime).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // 用户角色配置
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

  const roleInfo = roleConfig[(user?.userRole as keyof typeof roleConfig) || 'user']
  const RoleIcon = roleInfo.icon

  return (
    <motion.div
      className="mx-auto w-full container px-6 pt-8 md:pt-12 pb-40 relative z-10 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 顶部标题栏 */}
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div className="space-y-1.5">
          <h1 className="text-foreground text-4xl font-black tracking-tight">
            个人中心
          </h1>
          <p className="text-foreground/60 text-lg font-medium">
            你好，{user?.userName || '探索者'}。这是你的数字化身份。
          </p>
        </div>
        <Link href="/user/settings">
          <Button
            size="lg"
            className="rounded-full px-8 h-12 text-sm font-black tracking-tight shadow-xl hover:shadow-primary/20 transition-all border-none"
          >
            <Edit className="h-4 w-4 mr-2" />
            编辑资料
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 左侧 - 用户名片 (4cols) */}
        <motion.div className="lg:col-span-4 lg:sticky lg:top-24 self-start" variants={itemVariants}>
          <Card className="border-border/50 bg-card/30 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden flex flex-col relative w-full">
            {/* Minimal Apple-Style Themed Header (Simplified) */}
            <div className="h-32 relative bg-muted/30 border-b border-border/50">
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-xl px-3 py-1 rounded-full border border-border/10 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">在线</span>
              </div>
            </div>

            <CardContent className="relative px-8 pt-0 pb-8">
              {/* 头像 */}
              <div className="-mt-16 mb-6 flex justify-center">
                <div className="relative">
                  <UserAvatar
                    user={user}
                    size="xl"
                    className="border-background h-32 w-32 border-[6px] shadow-xl"
                  />
                  <div className="border-background absolute right-2 bottom-2 h-5 w-5 rounded-full border-4 bg-emerald-500 shadow-sm" />
                </div>
              </div>

              {/* 基本信息 */}
              <div className="space-y-5 text-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-foreground">
                    {user?.userName || '未设置用户名'}
                  </h2>
                  <p className="text-foreground/40 flex items-center justify-center gap-1.5 text-[10px] font-black tracking-widest uppercase">
                    <AtSign className="h-3 w-3" />
                    {user?.userEmail?.split('@')[0] || 'unknown'}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-muted/50 text-foreground/60 font-black px-3 py-1 rounded-full text-[10px] tracking-wider uppercase border-transparent"
                  >
                    <RoleIcon className="mr-1.5 h-3 w-3 opacity-60" />
                    {roleInfo.label}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="border-border/50 text-foreground/40 font-black px-3 py-1 rounded-full text-[10px] tracking-wider uppercase"
                  >
                    <Award className="mr-1.5 h-3 w-3 opacity-60" />
                    Lv.1 成员
                  </Badge>
                </div>

                <div className="px-2 pt-2">
                  <p className="text-foreground/60 leading-relaxed text-sm font-bold">
                    "{user?.userProfile || '致力于构建更美好的数字化世界...'}"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="bg-muted/20 rounded-[20px] p-4 flex flex-col items-center justify-center border border-border/10 hover:bg-muted/30 transition-all cursor-default group/stat">
                    <StatItem
                      label="天数"
                      value={accountAge}
                      icon={<Zap className="w-4 h-4 text-foreground/30 mb-1 group-hover/stat:text-primary group-hover/stat:fill-primary transition-all duration-300" />}
                    />
                  </div>
                  <div className="bg-muted/20 rounded-[20px] p-4 flex flex-col items-center justify-center border border-border/10 hover:bg-muted/30 transition-all cursor-default group/stat">
                    <StatItem
                      label="动态"
                      value={loadingPosts && posts.length === 0 ? '—' : posts.length}
                      icon={<FileText className="w-4 h-4 text-foreground/30 mb-1 group-hover/stat:text-primary transition-all duration-300" />}
                    />
                  </div>
                  <div className="bg-muted/20 rounded-[20px] p-4 flex flex-col items-center justify-center border border-border/10 hover:bg-muted/30 transition-all cursor-default group/stat">
                    <StatItem
                      label="获赞"
                      value={loadingLikes && likedPosts.length === 0 ? '—' : likedPosts.length}
                      icon={<Heart className="w-4 h-4 text-foreground/30 mb-1 group-hover/stat:text-primary group-hover/stat:fill-primary transition-all duration-300" />}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧 - 动态与详情模块 (8cols) */}
        <motion.div className="space-y-6 lg:col-span-8" variants={itemVariants}>
          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
            <TabsList className="bg-muted/30 h-14 w-full justify-start rounded-2xl p-1.5 border border-border/10 backdrop-blur-2xl">
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-xl px-8 h-full text-[13px] font-black tracking-tight transition-all"
              >
                <UserIcon className="mr-2.5 h-4 w-4 opacity-40 shrink-0" />
                关于我
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-xl px-8 h-full text-[13px] font-black tracking-tight transition-all"
              >
                <FileText className="mr-2.5 h-4 w-4 opacity-40 shrink-0" />
                我的动态 {loadingPosts && posts.length === 0 ? '' : `(${posts.length})`}
              </TabsTrigger>
              <TabsTrigger
                value="likes"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-xl px-8 h-full text-[13px] font-black tracking-tight transition-all"
              >
                <Heart className="mr-2.5 h-4 w-4 opacity-40 shrink-0" />
                赞过 {loadingLikes && likedPosts.length === 0 ? '' : `(${likedPosts.length})`}
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-xl px-8 h-full text-[13px] font-black tracking-tight transition-all"
              >
                <BookMarked className="mr-2.5 h-4 w-4 opacity-40 shrink-0" />
                收藏 {loadingFavorites && favoritedPosts.length === 0 ? '' : `(${favoritedPosts.length})`}
              </TabsTrigger>
            </TabsList>

            {/* 关于我 Tab (原基本信息) */}
            <TabsContent value="about" className="space-y-6 outline-none">
              <Card className="border-border/50 bg-card/10 backdrop-blur-sm shadow-sm rounded-3xl group transition-all duration-500 hover:border-primary/10">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="flex items-center gap-2.5 text-lg font-black tracking-tight text-foreground">
                    基本资料
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                    <InfoItem
                      label="用户昵称"
                      value={user?.userName || '未设置'}
                    />
                    <InfoItem
                      label="电子邮箱"
                      value={user?.userEmail || '未绑定'}
                    />
                    <InfoItem
                      label="手机号码"
                      value={user?.userPhone || '未绑定'}
                    />
                    <InfoItem
                      label="系统 ID"
                      value={user?.id ? `#${user.id}` : '未知'}
                    />
                    {user?.githubLogin && (
                      <InfoItem
                        label="GitHub"
                        value={
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            {user?.githubUrl ? (
                              <a
                                href={user.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {user.githubLogin}
                              </a>
                            ) : (
                              user?.githubLogin
                            )}
                          </div>
                        }
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 账户历程 */}
              <Card className="border-border/50 bg-card/10 backdrop-blur-sm shadow-sm rounded-3xl group transition-all duration-500 hover:border-primary/10">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="flex items-center gap-2.5 text-lg font-black tracking-tight text-foreground">
                    活跃历程
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                    <InfoItem
                      label="注册日期"
                      value={
                        user?.createTime
                          ? new Date(user.createTime).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : '未知'
                      }
                    />
                    <InfoItem label="常用活跃地" value="已开启地理屏蔽" />
                  </div>
                  <div className="bg-muted/20 mt-10 flex items-center gap-4 rounded-2xl p-5 border border-border/5">
                    <div className="bg-background flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
                      <Shield className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black tracking-tight">账户健康度极佳</h4>
                      <p className="text-foreground/40 text-[11px] font-bold">已通过所有安全协议验证</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 账户安全 & 隐私 Actions */}
              <div className="flex gap-4">
                <Link href="/user/settings" className="flex-1">
                  <Button
                    variant="outline"
                    className="border-border/40 bg-card/10 backdrop-blur-sm shadow-sm hover:bg-muted/40 h-16 w-full justify-between rounded-2xl px-8 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-xl">
                        <Edit className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black tracking-tight">完善个人资料</p>
                        <p className="text-[11px] text-foreground/40 font-bold">更新您的头像、昵称与个人描述</p>
                      </div>
                    </div>
                    <ArrowRight className="text-foreground/20 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* 我的帖子 Tab */}
            <TabsContent value="posts" className="outline-none">
              {loadingPosts ? (
                <Card className="border-black/5 dark:border-white/5 bg-background shadow-sm rounded-[24px] min-h-[400px] flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </Card>
              ) : posts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {posts.map((post) => (
                    <PostCard key={`post-${post.id}`} post={post} />
                  ))}
                </div>
              ) : (
                <Card className="border-black/5 dark:border-white/5 bg-background shadow-sm rounded-[24px] min-h-[400px] flex items-center justify-center p-8">
                  <div className="text-center space-y-3">
                    <div className="bg-secondary/40 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold">暂无动态</h3>
                    <p className="text-muted-foreground text-sm">你还没有发布过任何帖子，去写点什么吧</p>
                    <Button className="mt-4 rounded-xl shadow-sm">
                      <Edit className="mr-2 h-4 w-4" /> 发布新帖
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* 我的点赞 Tab */}
            <TabsContent value="likes" className="outline-none">
              {loadingLikes ? (
                <Card className="border-black/5 dark:border-white/5 bg-background shadow-sm rounded-[24px] min-h-[400px] flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </Card>
              ) : likedPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {likedPosts.map((post) => (
                    <PostCard key={`liked-${post.id}`} post={post} />
                  ))}
                </div>
              ) : (
                <Card className="border-black/5 dark:border-white/5 bg-background shadow-sm rounded-[24px] min-h-[400px] flex items-center justify-center p-8">
                  <div className="text-center space-y-3">
                    <div className="bg-secondary/40 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold">还没有点赞</h3>
                    <p className="text-muted-foreground text-sm">去社区逛逛，给喜欢的帖子点个赞吧</p>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* 我的收藏 Tab */}
            <TabsContent value="favorites" className="outline-none">
              {loadingFavorites ? (
                <Card className="border-black/5 dark:border-white/5 bg-background shadow-sm rounded-[24px] min-h-[400px] flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </Card>
              ) : favoritedPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {favoritedPosts.map((post) => (
                    <PostCard key={`favour-${post.id}`} post={post} />
                  ))}
                </div>
              ) : (
                <Card className="border-black/5 dark:border-white/5 bg-background shadow-sm rounded-[24px] min-h-[400px] flex items-center justify-center p-8">
                  <div className="text-center space-y-3">
                    <div className="bg-secondary/40 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookMarked className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold">收藏空空如也</h3>
                    <p className="text-muted-foreground text-sm">遇到干货文章别忘了收藏哦</p>
                  </div>
                </Card>
              )}
            </TabsContent>


          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 指标统计项
function StatItem({
  label,
  value,
  icon,
}: {
  label: string
  value: number | string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      {icon}
      <div className="text-foreground text-xl md:text-2xl font-black tracking-tight">{value}</div>
      <div className="text-foreground/40 text-[10px] md:text-xs font-black uppercase tracking-widest">{label}</div>
    </div>
  )
}

// 详细信息项
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
    <div className="space-y-1.5">
      <p className="text-foreground/40 text-[10px] font-black tracking-[0.2em] uppercase">
        {label}
      </p>
      <div className="text-foreground text-base font-black tracking-tight">{value}</div>
      {description && <p className="text-foreground/60 text-xs font-bold">{description}</p>}
    </div>
  )
}
