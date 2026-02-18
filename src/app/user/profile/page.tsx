'use client'

import * as React from 'react'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { AtSign, Award, Calendar, Edit, GitBranch, Github, Shield, User as UserIcon, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth/auth-modal'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'

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
      className="container mx-auto max-w-6xl space-y-8 py-8 md:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 顶部标题栏 */}
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div className="space-y-1">
          <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            个人档案
          </h1>
          <p className="text-muted-foreground text-lg">
            你好，{user?.userName || '探索者'}。这是你的个人中心。
          </p>
        </div>
        <Link href="/user/settings">
          <Button
            size="lg"
            className="gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Edit className="h-4 w-4" />
            编辑资料
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 左侧 - 用户名片 (4cols) */}
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <div className="border-border/40 bg-card/50 overflow-hidden rounded-[2rem] border shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
            {/* 简约背景 */}
            <div className="h-32 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-400/10">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-background/80 shadow-sm backdrop-blur-md">
                  Active
                </Badge>
              </div>
            </div>

            <div className="relative px-8 pb-8">
              {/* 头像 */}
              <div className="-mt-16 mb-6 flex justify-center">
                <div className="relative">
                  <UserAvatar
                    user={user}
                    size="xl"
                    className="border-background h-32 w-32 border-[6px] shadow-xl"
                  />
                  <div className="border-background absolute right-2 bottom-2 h-5 w-5 rounded-full border-4 bg-green-500 shadow-sm" />
                </div>
              </div>

              {/* 基本信息 */}
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {user?.userName || '未设置用户名'}
                  </h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm font-medium">
                    <AtSign className="h-3 w-3" />
                    {user?.userEmail?.split('@')[0] || 'unknown'}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <Badge variant="secondary" className="bg-secondary/50 font-medium">
                    <RoleIcon className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                    {roleInfo.label}
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 text-primary font-medium">
                    <Award className="mr-1.5 h-3.5 w-3.5" />
                    Lv.1 成员
                  </Badge>
                </div>

                <div className="bg-secondary/30 rounded-2xl p-6 text-sm">
                  <p className="text-muted-foreground leading-relaxed">
                    "{user?.userProfile || '这个人很懒，什么都没留下...'}"
                  </p>
                </div>

                {/* 核心数据 */}
                <div className="border-border/40 mt-8 grid grid-cols-3 gap-4 border-t pt-8">
                  <StatItem label="天数" value={accountAge} icon={<Zap />} />
                  <StatItem label="动态" value={0} />
                  <StatItem label="获赞" value={0} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 右侧 - 详情模块 (8cols) */}
        <motion.div className="space-y-6 lg:col-span-8" variants={itemVariants}>
          {/* 基本信息网格 */}
          <div className="border-border/40 bg-card/50 rounded-[2rem] border shadow-sm backdrop-blur-xl">
            <div className="border-border/40 border-b px-8 py-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <UserIcon className="text-primary h-5 w-5" />
                基本信息
              </h3>
            </div>
            <div className="p-8">
              <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                <InfoItem
                  label="用户昵称"
                  value={user?.userName || '未设置'}
                  description="在社区展示的名字"
                />
                <InfoItem
                  label="电子邮箱"
                  value={user?.userEmail || '未绑定'}
                  description="用于接收重要通知"
                />
                <InfoItem
                  label="手机号码"
                  value={user?.userPhone || '未绑定'}
                  description="账号安全验证"
                />
                <InfoItem
                  label="用户 ID"
                  value={user?.id ? `#${user.id}` : '未知'}
                  description="系统唯一识别码"
                />
                {user?.githubLogin && (
                  <InfoItem
                    label="GitHub"
                    value={
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        {user?.githubUrl ? (
                          <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {user.githubLogin}
                          </a>
                        ) : (
                          user?.githubLogin
                        )}
                      </div>
                    }
                    description="已绑定的 GitHub 账号"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 账户历程 */}
          <div className="border-border/40 bg-card/50 rounded-[2rem] border shadow-sm backdrop-blur-xl">
            <div className="border-border/40 border-b px-8 py-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="text-primary h-5 w-5" />
                账户历程
              </h3>
            </div>
            <div className="p-8">
              <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
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
              <div className="bg-secondary/20 mt-8 flex items-center gap-4 rounded-xl p-4">
                <div className="bg-background flex h-10 w-10 items-center justify-center rounded-full shadow-sm">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">账户状态良好</h4>
                  <p className="text-muted-foreground text-xs">通过所有安全验证</p>
                </div>
              </div>
            </div>
          </div>

          {/* 账户安全 & 隐私 */}
          <div className="flex gap-4">
            <Link href="/user/settings" className="flex-1">
              <Button
                variant="outline"
                className="border-border/40 bg-card/50 hover:bg-secondary/50 h-14 w-full justify-between rounded-xl px-6 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <Edit className="h-4 w-4" />
                  <span>完善个人资料</span>
                </div>
                <div className="text-muted-foreground text-xl">→</div>
              </Button>
            </Link>
          </div>
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
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="text-foreground text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-muted-foreground text-xs font-medium">{label}</div>
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
    <div className="space-y-1">
      <p className="text-muted-foreground/60 text-xs font-medium tracking-wider uppercase">
        {label}
      </p>
      <div className="text-foreground text-base font-semibold">{value}</div>
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
    </div>
  )
}
