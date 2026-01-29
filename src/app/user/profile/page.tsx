'use client'

import * as React from 'react'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  AtSign,
  Fingerprint,
  Zap,
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

interface ExtendedUser extends API.LoginUserVO {
  userProfile?: string
  userPhone?: string
}

export default function ProfilePage() {
  const { user: baseUser } = useAppSelector((state: RootState) => state.user)
  const user = baseUser as ExtendedUser

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="max-w-md p-8 text-center shadow-lg">
            <Shield className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground mb-6">请先登录查看个人信息</p>
            <Link href="/">
              <Button>返回首页</Button>
            </Link>
          </Card>
        </motion.div>
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
          <p className="text-muted-foreground text-lg">你好，{user.userName || '探索者'}。这是你的个人中心。</p>
        </div>
        <Link href="/user/settings">
          <Button size="lg" className="gap-2 shadow-lg transition-all hover:scale-105 active:scale-95">
            <Edit className="h-4 w-4" />
            编辑资料
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 左侧 - 用户名片 (4cols) */}
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <Card className="overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl">
            {/* 炫酷背景 */}
            <div className="from-primary/30 via-primary/10 to-transparent relative h-40 bg-gradient-to-br">
              <div className="bg-grid-white/10 absolute inset-0" />
              <div className="absolute top-4 right-4 animate-pulse">
                <Badge variant="secondary" className="bg-background/50 backdrop-blur-md">
                  Active
                </Badge>
              </div>
            </div>

            <CardContent className="relative px-8 pb-8">
              {/* 头像 */}
              <div className="-mt-16 mb-6 flex justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="relative"
                >
                  <UserAvatar
                    user={user}
                    size="xl"
                    className="ring-background border-background h-32 w-32 border-4 shadow-2xl ring-4"
                  />
                  <div className="bg-green-500 border-background absolute right-2 bottom-2 h-6 w-6 rounded-full border-4 shadow-sm" />
                </motion.div>
              </div>

              {/* 基本信息 */}
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold">{user.userName || '未设置用户名'}</h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm font-medium">
                    <AtSign className="h-3 w-3" />
                    {user.userEmail?.split('@')[0] || 'unknown'}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <Badge variant="outline" className={`px-3 py-1 font-semibold ${roleInfo.color}`}>
                    <RoleIcon className="mr-1.5 h-3.5 w-3.5" />
                    {roleInfo.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/5 text-primary px-3 py-1 font-semibold"
                  >
                    <Award className="mr-1.5 h-3.5 w-3.5" />
                    Lv.1 成员
                  </Badge>
                </div>

                <div className="bg-muted/30 relative mt-6 rounded-xl p-6 transition-colors hover:bg-muted/50">
                  <p className="text-muted-foreground text-sm italic leading-relaxed">
                    "{user.userProfile || '这个人很懒，什么都没留下，也许正在积蓄力量 ⚡️'}"
                  </p>
                </div>

                {/* 核心数据 */}
                <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-8">
                  <StatItem label="成长天数" value={accountAge} icon={<Zap />} />
                  <StatItem label="发布动态" value={0} />
                  <StatItem label="获赞数" value={0} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧 - 详情模块 (8cols) */}
        <motion.div className="space-y-8 lg:col-span-8" variants={itemVariants}>
          {/* 基本信息网格 */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <AtSign className="text-primary h-5 w-5" />
                联系方式 & 身份
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <InfoItem
                  icon={<UserIcon className="h-5 w-5" />}
                  label="用户昵称"
                  value={user.userName || '未设置'}
                  description="在社区展示的名字"
                />
                <InfoItem
                  icon={<Mail className="h-5 w-5" />}
                  label="电子邮箱"
                  value={user.userEmail || '未绑定'}
                  description="用于接收重要通知"
                />
                <InfoItem
                  icon={<Phone className="h-5 w-5" />}
                  label="手机号码"
                  value={user.userPhone || '未绑定'}
                  description="账号安全验证"
                />
                <InfoItem
                  icon={<Fingerprint className="h-5 w-5" />}
                  label="用户 ID"
                  value={user.id ? `#${user.id}` : '未知'}
                  description="系统唯一识别码"
                />
              </div>
            </CardContent>
          </Card>

          {/* 账户历程 */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Calendar className="text-primary h-5 w-5" />
                账户历程
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <InfoItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="注册日期"
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
                <InfoItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="常用活跃地"
                  value="已开启地理屏蔽"
                />
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-4 rounded-xl border border-dashed p-4">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                      <Zap className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">账户状态良好</h4>
                      <p className="text-muted-foreground text-sm">
                        你已通过所有安全验证，账户处于最高信任等级。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 账户安全 & 隐私 */}
          <div className="flex items-center gap-4">
            <Link href="/user/settings" className="flex-1">
              <Button
                variant="outline"
                className="h-20 w-full flex-col gap-2 rounded-2xl border-2 transition-all hover:border-primary hover:bg-primary/5"
              >
                <Edit className="h-6 w-6" />
                <span>完善个人资料</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              disabled
              className="h-20 flex-1 flex-col gap-2 rounded-2xl border-2 transition-all opacity-60"
            >
              <Shield className="h-6 w-6" />
              <span>实验室功能</span>
            </Button>
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
    <div className="group flex flex-col items-center gap-1 transition-transform hover:scale-110">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-primary h-3.5 w-3.5">{icon}</span>}
        <span className="text-2xl font-black">{value}</span>
      </div>
      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
  )
}

// 详细信息项
function InfoItem({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  description?: string
}) {
  return (
    <motion.div
      className="group relative flex items-start gap-4 rounded-2xl border border-transparent p-4 transition-all hover:border-primary/20 hover:bg-primary/5"
      whileHover={{ y: -2 }}
    >
      <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mt-1 flex-shrink-0 rounded-xl p-2.5 transition-colors">
        {icon}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{label}</p>
        <p className="text-lg font-bold truncate leading-tight">{value}</p>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>
    </motion.div>
  )
}
