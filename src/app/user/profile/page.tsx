'use client'

import * as React from 'react'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  User as UserIcon,
  MapPin,
  Link as LinkIcon,
  Edit,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="p-8">
          <p className="text-muted-foreground text-center">请先登录查看个人信息</p>
        </Card>
      </div>
    )
  }

  // 计算账户年龄
  const accountAge = user.createTime
    ? Math.floor((Date.now() - new Date(user.createTime).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // 用户角色配置
  const roleConfig = {
    admin: {
      label: '管理员',
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      icon: Shield,
    },
    ban: { label: '已封禁', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: Shield },
    user: {
      label: '普通用户',
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      icon: UserIcon,
    },
  }

  const roleInfo = roleConfig[user.userRole as keyof typeof roleConfig] || roleConfig.user
  const RoleIcon = roleInfo.icon

  return (
    <motion.div
      className="container mx-auto max-w-6xl space-y-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 顶部标题栏 - 更简洁的设计 */}
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">个人中心</h1>
          <p className="text-muted-foreground mt-1">管理您的账户信息</p>
        </div>
        <Link href="/user/settings">
          <Button size="default" className="gap-2 shadow-sm transition-all hover:shadow-md">
            <Edit className="h-4 w-4" />
            编辑资料
          </Button>
        </Link>
      </motion.div>

      {/* 主要内容区域 - 使用网格布局 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左侧 - 用户卡片 */}
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-lg">
            {/* 渐变背景 */}
            <div className="from-primary/20 via-primary/10 to-background relative h-32 bg-gradient-to-br">
              <div className="bg-grid-white/5 absolute inset-0" />
            </div>

            <CardContent className="relative px-6 pb-6">
              {/* 头像 */}
              <motion.div
                className="-mt-16 mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.6, stiffness: 200 }}
              >
                <div className="relative inline-block">
                  <UserAvatar
                    user={user}
                    size="lg"
                    className="border-background border-4 shadow-xl"
                  />
                  <div className="bg-background border-primary absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                  </div>
                </div>
              </motion.div>

              {/* 用户名和简介 */}
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">{user.userName || '未设置用户名'}</h2>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {(user as any).userProfile || '这个人很懒，什么都没留下 🎭'}
                </p>
                <Badge className={`mx-auto ${roleInfo.color}`}>
                  <RoleIcon className="mr-1 h-3 w-3" />
                  {roleInfo.label}
                </Badge>
              </div>

              {/* 统计信息 */}
              <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">{accountAge}</div>
                  <div className="text-muted-foreground text-xs">天</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">0</div>
                  <div className="text-muted-foreground text-xs">动态</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">0</div>
                  <div className="text-muted-foreground text-xs">关注</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧 - 详细信息 */}
        <motion.div className="space-y-6 lg:col-span-2" variants={itemVariants}>
          {/* 基本信息 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <UserIcon className="text-primary h-5 w-5" />
                基本信息
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<UserIcon className="h-4 w-4" />}
                  label="用户名"
                  value={user.userName || '未设置'}
                />
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="邮箱"
                  value={user.userEmail || '未设置'}
                />
                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label="电话"
                  value={(user as any).userPhone || '未设置'}
                />
                <InfoItem
                  icon={<Shield className="h-4 w-4" />}
                  label="用户角色"
                  value={
                    <Badge className={roleInfo.color}>
                      <RoleIcon className="mr-1 h-3 w-3" />
                      {roleInfo.label}
                    </Badge>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 账户信息 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Award className="text-primary h-5 w-5" />
                账户信息
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="注册时间"
                  value={
                    user.createTime
                      ? new Date(user.createTime).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '未知'
                  }
                />
                <InfoItem icon={<MapPin className="h-4 w-4" />} label="最后活跃" value="刚刚" />
                <InfoItem
                  icon={<LinkIcon className="h-4 w-4" />}
                  label="用户 ID"
                  value={`#${user.id || 'N/A'}`}
                />
                <InfoItem
                  icon={<Shield className="h-4 w-4" />}
                  label="账户状态"
                  value={
                    <Badge className="border-green-500/20 bg-green-500/10 text-green-500">
                      <div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      正常
                    </Badge>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 快捷操作 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Edit className="text-primary h-5 w-5" />
                快捷操作
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/user/settings">
                  <Button
                    variant="outline"
                    className="hover:border-primary hover:text-primary w-full justify-start transition-colors"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    编辑个人资料
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="hover:border-primary hover:text-primary w-full justify-start transition-colors"
                  disabled
                >
                  <Shield className="mr-2 h-4 w-4" />
                  账户安全设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 信息项组件
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <motion.div
      className="group hover:bg-muted/50 hover:border-primary/50 flex items-start gap-3 rounded-lg border p-4 transition-all"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex-shrink-0 rounded-lg p-2.5 transition-colors">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
        <p className="mt-1 truncate font-semibold">{value}</p>
      </div>
    </motion.div>
  )
}
