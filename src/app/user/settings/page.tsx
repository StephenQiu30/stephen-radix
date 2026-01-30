'use client'

import * as React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Settings,
  X,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { updateMyUser, getLoginUser } from '@/api/userController'
import { uploadFile } from '@/api/fileController'
import { setLoginUser } from '@/store/modules/user/userSlice'

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

interface ExtendedUser extends API.LoginUserVO {
  userProfile?: string
  userPhone?: string
}

export default function SettingsPage() {
  const { user: baseUser } = useAppSelector((state: RootState) => state.user)
  const user = baseUser as ExtendedUser
  const dispatch = useAppDispatch()
  const [loading, setLoading] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [activeField, setActiveField] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

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
        userProfile: user.userProfile || '',
        userEmail: user.userEmail || '',
        userPhone: user.userPhone || '',
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 基础校验
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '请上传图片文件' })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: '图片大小建议在 2MB 以内' })
      return
    }

    setUploading(true)
    try {
      const res = (await uploadFile(
        { biz: 'user_avatar' },
        file
      )) as unknown as API.BaseResponseString
      if (res.code === 0 && res.data) {
        setFormData(prev => ({ ...prev, userAvatar: res.data! }))
        setChanges(prev => new Set(prev).add('userAvatar'))
        setMessage({ type: 'success', text: '头像上传成功，保存后生效' })
      } else {
        setMessage({ type: 'error', text: res.message || '头像上传失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，上传失败' })
    } finally {
      setUploading(false)
    }
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
        setMessage({ type: 'success', text: '个人资料保存成功！✨' })

        // 刷新用户信息
        const userRes = (await getLoginUser()) as unknown as API.BaseResponseLoginUserVO
        if (userRes.code === 0 && userRes.data) {
          dispatch(setLoginUser(userRes.data))
          setChanges(new Set())
        }
      } else {
        setMessage({ type: 'error', text: res.message || '更新失败，请重试' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '请求出错' })
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[600px] items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-xl">
          <Shield className="text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-50" />
          <h2 className="mb-2 text-2xl font-bold">需要登录</h2>
          <p className="text-muted-foreground mb-6">请先登录以访问个人设置</p>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const hasChanges = changes.size > 0

  return (
    <motion.div
      className="container mx-auto max-w-5xl space-y-8 py-8 md:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 顶部导航 */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <Link href="/user/profile">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary h-12 w-12 rounded-full transition-all"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              个人设置
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">定制您的专属档案和私密偏好</p>
          </div>
        </div>
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold shadow-lg">
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                {changes.size} 项未保存更改
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 左侧 - 预览与头像 (4cols) */}
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <Card className="sticky top-24 overflow-hidden border-2 shadow-lg">
            <div className="from-primary/40 via-primary/20 relative h-32 bg-gradient-to-br to-transparent">
              <div className="bg-grid-white/10 absolute inset-0" />
            </div>

            <CardContent className="relative -mt-16 px-6 pb-8 text-center">
              <div className="group relative mx-auto mb-6 inline-block">
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <UserAvatar
                    user={{ ...user, ...formData }}
                    size="xl"
                    className="ring-background border-background h-32 w-32 border-4 shadow-2xl ring-4"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    size="icon"
                    className="bg-primary text-primary-foreground absolute -right-2 -bottom-2 h-10 w-10 rounded-full shadow-xl transition-transform hover:scale-110"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{formData.userName || user.userName}</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  {user.userRole === 'admin' ? '✨ 管理员' : '成员档案'}
                </p>
                <div className="bg-muted/50 mt-4 rounded-xl p-4">
                  <p className="text-muted-foreground text-xs leading-relaxed italic">
                    "{formData.userProfile || '还没写个人简介...'}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧 - 编辑区域 (8cols) */}
        <motion.div className="lg:col-span-8" variants={itemVariants}>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 p-1">
                <TabsTrigger value="profile" className="gap-2 text-base font-semibold">
                  <UserIcon className="h-4 w-4" /> 档案信息
                </TabsTrigger>
                <TabsTrigger value="contact" className="gap-2 text-base font-semibold">
                  <Mail className="h-4 w-4" /> 联系方式
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="profile" className="space-y-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-xl">基本资料</CardTitle>
                      <CardDescription>这些信息将公开显示在您的个人档案中</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        icon={<UserIcon className="h-5 w-5" />}
                        label="用户昵称"
                        value={formData.userName}
                        onChange={handleInputChange('userName')}
                        placeholder="想一个响亮的名字"
                        required
                        isActive={activeField === 'userName'}
                        onFocus={() => setActiveField('userName')}
                        onBlur={() => setActiveField(null)}
                        hasChanged={changes.has('userName')}
                      />

                      <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-base font-bold">
                          <FileText className="text-primary h-5 w-5" /> 个人简介
                          {changes.has('userProfile') && <Badge className="ml-auto">已修改</Badge>}
                        </Label>
                        <Textarea
                          value={formData.userProfile}
                          onChange={handleInputChange('userProfile')}
                          placeholder="向世界介绍你自己..."
                          className="focus:border-primary focus:ring-primary/20 min-h-[140px] resize-none text-base transition-all focus:ring-2"
                          onFocus={() => setActiveField('userProfile')}
                          onBlur={() => setActiveField(null)}
                        />
                        <div className="flex justify-between px-1 text-xs">
                          <span className="text-muted-foreground">支持 Markdown 语法建议</span>
                          <span
                            className={
                              formData.userProfile.length > 180
                                ? 'font-bold text-red-500'
                                : 'text-muted-foreground'
                            }
                          >
                            {formData.userProfile.length}/200
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-xl">隐私与安全</CardTitle>
                      <CardDescription>管理您的账户绑定与验证方式</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        icon={<Mail className="h-5 w-5" />}
                        label="电子邮箱"
                        type="email"
                        value={formData.userEmail}
                        onChange={handleInputChange('userEmail')}
                        placeholder="example@mail.com"
                        isActive={activeField === 'userEmail'}
                        onFocus={() => setActiveField('userEmail')}
                        onBlur={() => setActiveField(null)}
                        hasChanged={changes.has('userEmail')}
                      />
                      <FormField
                        icon={<Phone className="h-5 w-5" />}
                        label="手机号码"
                        type="tel"
                        value={formData.userPhone}
                        onChange={handleInputChange('userPhone')}
                        placeholder="绑定手机，安全加倍"
                        isActive={activeField === 'userPhone'}
                        onFocus={() => setActiveField('userPhone')}
                        onBlur={() => setActiveField(null)}
                        hasChanged={changes.has('userPhone')}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </AnimatePresence>
            </Tabs>

            {/* 消息回显 */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`mt-6 rounded-xl border-2 p-5 ${
                    message.type === 'success'
                      ? 'border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400'
                      : 'border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {message.type === 'success' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Shield className="h-6 w-6" />
                    )}
                    <span className="font-bold">{message.text}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8 rounded-full"
                      onClick={() => setMessage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 操作条 */}
            <div className="mt-8 flex items-center justify-end gap-4">
              <Link href="/user/profile">
                <Button variant="ghost" className="px-6 font-semibold" type="button">
                  放弃修改
                </Button>
              </Link>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !hasChanges}
                className="min-w-[140px] gap-2 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    保存更改
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

// 提取 FormField 组件以提高复用性和整洁度
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
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-base font-bold">
        <div
          className={`rounded-lg p-1.5 transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}
        >
          {icon}
        </div>
        {label}
        {hasChanged && (
          <Badge variant="secondary" className="ml-auto text-xs font-medium">
            已修改
          </Badge>
        )}
      </Label>
      <motion.div animate={{ scale: isActive ? 1.005 : 1 }}>
        <Input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={onFocus}
          onBlur={onBlur}
          className="focus:border-primary h-14 border-2 text-base transition-all focus:ring-0"
        />
      </motion.div>
    </div>
  )
}
