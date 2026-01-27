'use client'

import * as React from 'react'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save,
  ArrowLeft,
  Mail,
  Phone,
  User as UserIcon,
  FileText,
  Sparkles,
  Shield,
  Camera,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { updateMyUser } from '@/api/userController'
import { useAppDispatch } from '@/store/hooks'
import { setLoginUser } from '@/store/modules/user/userSlice'
import { getLoginUser } from '@/api/userController'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function SettingsPage() {
  const { user } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [activeField, setActiveField] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    userAvatar: '',
    userName: '',
    userProfile: '',
    userEmail: '',
    userPhone: '',
  })

  const [changes, setChanges] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (user) {
      setFormData({
        userAvatar: user.userAvatar || '',
        userName: user.userName || '',
        userProfile: (user as any).userProfile || '',
        userEmail: user.userEmail || '',
        userPhone: (user as any).userPhone || '',
      })
    }
  }, [user])

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setFormData(prev => ({ ...prev, [field]: newValue }))

      // 追踪变更
      setChanges(prev => {
        const newChanges = new Set(prev)
        if (newValue !== (user as any)[field]) {
          newChanges.add(field)
        } else {
          newChanges.delete(field)
        }
        return newChanges
      })
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const res = (await updateMyUser({
        id: user.id,
        ...formData,
      } as API.UserEditRequest)) as unknown as API.BaseResponseBoolean

      if (res.code === 0 && res.data) {
        setMessage({ type: 'success', text: '个人资料更新成功！✨' })

        // 重新获取用户信息
        setTimeout(async () => {
          try {
            const userRes = (await getLoginUser()) as unknown as API.BaseResponseLoginUserVO
            if (userRes.code === 0 && userRes.data) {
              dispatch(setLoginUser(userRes.data))
              setChanges(new Set())
            }
          } catch (error) {
            console.error('获取用户信息失败:', error)
          }
        }, 800)
      } else {
        setMessage({ type: 'error', text: res.message || '更新失败，请重试' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '更新失败，请重试' })
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[600px] items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Shield className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="mb-2 text-2xl font-bold">需要登录</h2>
          <p className="text-muted-foreground">请先登录以访问个人设置</p>
        </Card>
      </div>
    )
  }

  const hasChanges = changes.size > 0

  return (
    <motion.div
      className="container mx-auto max-w-5xl space-y-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 顶部导航 - 大气的设计 */}
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div className="flex items-center gap-4">
          <Link href="/user/profile">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              编辑资料
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">更新您的个人信息和偏好设置</p>
          </div>
        </div>
        <Badge
          className={`px-4 py-2 text-sm transition-all ${hasChanges ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        >
          {hasChanges ? `${changes.size} 项未保存` : '已同步'}
        </Badge>
      </motion.div>

      {/* 主要内容 */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* 左侧 - 用户预览卡片 */}
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <Card className="sticky top-24 overflow-hidden border-2">
            {/* 渐变背景 */}
            <div className="from-primary/30 via-primary/20 to-background relative h-40 bg-gradient-to-br">
              <div className="bg-grid-white/10 absolute inset-0" />
              <motion.div
                className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            <CardContent className="relative -mt-20 px-8 pb-8">
              {/* 头像 */}
              <motion.div
                className="mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
              >
                <div className="group relative inline-block">
                  <UserAvatar
                    user={{ ...user, ...formData }}
                    size="lg"
                    className="border-background border-4 shadow-2xl"
                  />
                  <div className="bg-primary text-primary-foreground hover:bg-primary/90 absolute -right-2 -bottom-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all hover:scale-110">
                    <Camera className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>

              {/* 用户名预览 */}
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">{formData.userName || '未设置用户名'}</h2>
                <p className="text-muted-foreground line-clamp-3 min-h-[60px]">
                  {formData.userProfile || '这个人很懒，什么都没留下... 🎭'}
                </p>

                {/* 变更指示器 */}
                <AnimatePresence>
                  {hasChanges && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="pt-4"
                    >
                      <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>{changes.size} 项更改待保存</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧 - 编辑表单 */}
        <motion.div className="space-y-6 lg:col-span-2" variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserIcon className="text-primary h-5 w-5" />
                  基本信息
                </CardTitle>
                <CardDescription>更新您的个人基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* 用户名 */}
                <FormField
                  icon={<UserIcon className="h-5 w-5" />}
                  label="用户名"
                  value={formData.userName}
                  onChange={handleInputChange('userName')}
                  placeholder="请输入用户名"
                  required
                  isActive={activeField === 'userName'}
                  onFocus={() => setActiveField('userName')}
                  onBlur={() => setActiveField(null)}
                  hasChanged={changes.has('userName')}
                />

                {/* 个人简介 */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <FileText className="text-primary h-5 w-5" />
                    个人简介
                    {changes.has('userProfile') && (
                      <Badge variant="secondary" className="ml-auto">
                        已修改
                      </Badge>
                    )}
                  </Label>
                  <Textarea
                    value={formData.userProfile}
                    onChange={handleInputChange('userProfile')}
                    placeholder="介绍一下自己，让更多人了解你... ✨"
                    className="focus:border-primary focus:ring-primary/20 min-h-[120px] resize-none text-base transition-all focus:ring-2"
                    onFocus={() => setActiveField('userProfile')}
                    onBlur={() => setActiveField(null)}
                  />
                  <p className="text-muted-foreground text-sm">
                    {formData.userProfile.length}/200 字符
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 联系方式 */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Mail className="text-primary h-5 w-5" />
                  联系方式
                </CardTitle>
                <CardDescription>管理您的联系方式和隐私设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* 邮箱 */}
                <FormField
                  icon={<Mail className="h-5 w-5" />}
                  label="邮箱地址"
                  type="email"
                  value={formData.userEmail}
                  onChange={handleInputChange('userEmail')}
                  placeholder="your@email.com"
                  isActive={activeField === 'userEmail'}
                  onFocus={() => setActiveField('userEmail')}
                  onBlur={() => setActiveField(null)}
                  hasChanged={changes.has('userEmail')}
                />

                {/* 电话 */}
                <FormField
                  icon={<Phone className="h-5 w-5" />}
                  label="电话号码"
                  type="tel"
                  value={formData.userPhone}
                  onChange={handleInputChange('userPhone')}
                  placeholder="请输入电话号码"
                  isActive={activeField === 'userPhone'}
                  onFocus={() => setActiveField('userPhone')}
                  onBlur={() => setActiveField(null)}
                  hasChanged={changes.has('userPhone')}
                />
              </CardContent>
            </Card>

            {/* 消息提示 */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className={`rounded-xl border-2 p-6 ${
                    message.type === 'success'
                      ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {message.type === 'success' ? (
                      <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
                    ) : (
                      <Shield className="h-6 w-6 flex-shrink-0" />
                    )}
                    <p className="text-base font-semibold">{message.text}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 操作按钮 */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link href="/user/profile">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={loading}
                  className="px-8"
                >
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !hasChanges}
                className="gap-2 px-8 shadow-lg transition-all hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    保存更改 {hasChanges && `(${changes.size})`}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 表单字段组件
function FormField({
  icon,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  isActive,
  onFocus,
  onBlur,
  hasChanged,
}: {
  icon: React.ReactNode
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  required?: boolean
  isActive?: boolean
  onFocus?: () => void
  onBlur?: () => void
  hasChanged?: boolean
}) {
  return (
    <motion.div
      className={`space-y-3 rounded-xl border-2 p-6 transition-all duration-300 ${
        isActive
          ? 'border-primary bg-primary/5 shadow-primary/10 shadow-lg'
          : 'bg-muted/30 hover:border-primary/30 border-transparent'
      }`}
      animate={{ scale: isActive ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Label className="flex items-center gap-2 text-base font-semibold">
        <div
          className={`rounded-lg p-1.5 transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}
        >
          {icon}
        </div>
        {label}
        {hasChanged && (
          <Badge variant="secondary" className="ml-auto text-xs">
            已修改
          </Badge>
        )}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        className="h-12 text-base transition-all"
      />
    </motion.div>
  )
}
