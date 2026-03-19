'use client'

import * as React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowLeft, Camera, CheckCircle2, Loader2, Shield, X } from 'lucide-react'
import Link from 'next/link'
import { AuthModal } from '@/components/auth/auth-modal'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
import { getLoginUser, editUser } from '@/api/user/userController'
import { uploadFile } from '@/api/file/fileController'
import { FileUploadBizEnum } from '@/enums/FileUploadBizEnum'
import { setLoginUser } from '@/store/modules/user/userSlice'

interface ExtendedUser extends UserAPI.UserVO {
  userProfile?: string
  userPhone?: string
}

export default function SettingsPage() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { user: baseUser } = useAppSelector((state: RootState) => state.user)
  const user = baseUser as ExtendedUser
  const dispatch = useAppDispatch()
  
  const [loading, setLoading] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  const [formData, setFormData] = React.useState({
    userAvatar: '',
    userName: '',
    userProfile: '',
    userEmail: '',
    userPhone: '',
  })

  const [changes, setChanges] = React.useState<Set<string>>(new Set())

  const isUnauthorized = !user

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

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setFormData(prev => ({ ...prev, [field]: newValue }))
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
      const res = await uploadFile({ fileUploadRequest: { biz: FileUploadBizEnum.USER_AVATAR } }, {}, file)
      if (res.code === 0 && res.data?.url) {
        setFormData(prev => ({ ...prev, userAvatar: res.data!.url! }))
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

  useGSAP(() => {
    if (isUnauthorized) {
      gsap.from('.login-overlay-content', {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'expo.out',
      })
    } else {
      gsap.from('.animate-in', {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
      })
    }
  }, { scope: containerRef, dependencies: [isUnauthorized] })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isUnauthorized) return
    setLoading(true)
    setMessage(null)
    try {
      const res = (await editUser({ ...formData } as UserAPI.UserEditRequest)) as unknown as UserAPI.BaseResponseBoolean
      if (res.code === 0 && res.data) {
        setMessage({ type: 'success', text: '设置已更新 ✨' })
        const userRes = (await getLoginUser()) as unknown as UserAPI.BaseResponseUserVO
        if (userRes.code === 0 && userRes.data) {
          dispatch(setLoginUser(userRes.data))
          setChanges(new Set())
        }
      } else {
        setMessage({ type: 'error', text: res.message || '更新失败' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '发生错误' })
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  const hasChanges = changes.size > 0

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      {/* Login Overlay */}
      {isUnauthorized && (
        <div className="fixed inset-0 z-[40] flex items-center justify-center p-6 mt-20 bg-background/50 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="relative z-20 w-full max-w-lg login-overlay-content">
            <LoginPromptCard
              onLoginClick={() => setAuthModalOpen(true)}
              title="账户设置"
              description="请登录以管理您的个人偏好与账户信息"
            />
          </div>
        </div>
      )}

      <div
        className={`container mx-auto px-6 max-w-7xl py-6 md:py-10 space-y-8 selection:bg-primary/20 transition-all duration-1000 ${
          isUnauthorized ? 'blur-2xl grayscale-[0.5] pointer-events-none opacity-40 select-none' : 'opacity-100'
        }`}
      >
        {/* Header */}
        <div className="animate-in flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/10 pb-8">
          <div className="space-y-3">
            <Link href="/user/profile" className="group flex items-center text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-all duration-500">
              <ArrowLeft className="h-3.5 w-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
              返回个人主页
            </Link>
            <div className="space-y-1">
              <h1 className="text-foreground text-3xl font-black tracking-tight leading-loose">
                账号设置
              </h1>
              <p className="text-muted-foreground/40 text-[13px] font-bold tracking-tight italic">管理您的个人偏好与账户信息，定制专属体验。</p>
            </div>
          </div>
          {hasChanges && (
            <div className="bg-primary/10 text-primary border border-primary/20 rounded-full px-5 py-2 text-[10px] font-black tracking-widest uppercase shadow-sm">
              发现 {changes.size} 项未保存更改
            </div>
          )}
        </div>

        <div className="grid gap-12 lg:grid-cols-12 pt-4">
          {/* Sidebar */}
          <div className="animate-in lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-10">
            <div className="relative group mx-auto md:mx-0 w-fit">
              <UserAvatar
                user={isUnauthorized ? {} : { ...user, ...formData }}
                className="relative h-48 w-48 md:h-64 md:w-64 border-[8px] border-background shadow-2xl transition-all duration-700 ease-out group-hover:scale-[1.02]"
              />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              <Button
                size="icon"
                className="bg-primary text-primary-foreground absolute bottom-5 right-5 h-14 w-14 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 z-10"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                type="button"
              >
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
              </Button>
            </div>
            <div className="space-y-5">
              <h3 className="text-3xl font-black tracking-tight text-foreground">{isUnauthorized ? '探索者' : (formData.userName || user.userName)}</h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase">
                {isUnauthorized ? '访客身份' : (user.userRole === 'admin' ? '系统管理员' : '正式成员')}
              </Badge>
              <p className="text-foreground/40 text-base leading-relaxed font-bold italic tracking-tight">
                "{isUnauthorized ? '致力于构建更美好的数字化世界...' : (formData.userProfile || '致力于构建更美好的数字化世界...')}"
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="animate-in lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-12">
              <Tabs defaultValue="profile" className="w-full space-y-8">
                <TabsList className="bg-muted/30 h-14 w-full md:w-fit justify-start rounded-[1.25rem] p-1.5 border border-border/5 backdrop-blur-3xl">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl px-10 h-full text-[13px] font-black tracking-tight transition-all duration-300">
                    基本资料
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl px-10 h-full text-[13px] font-black tracking-tight transition-all duration-300">
                    联系方式与安全
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-10 outline-none pt-4">
                  <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                    <FormField label="显示名称" value={formData.userName} onChange={handleInputChange('userName')} placeholder="输入您的昵称" hasChanged={changes.has('userName')} />
                    <div className="sm:col-span-2 space-y-4">
                      <Label className="text-foreground/30 font-black text-[10px] tracking-[0.25em] uppercase flex items-center gap-2 mb-1">
                        个人简介 {changes.has('userProfile') && <span className="bg-primary h-1.5 w-1.5 rounded-full shadow-sm" />}
                      </Label>
                      <Textarea
                        value={formData.userProfile}
                        onChange={handleInputChange('userProfile')}
                        placeholder="介绍一下你自己..."
                        className="border-border/5 bg-card/40 focus:bg-card/60 focus:border-primary/20 min-h-[160px] resize-none rounded-[2.5rem] p-8 text-lg font-black tracking-tight focus:ring-0 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-10 outline-none pt-4">
                  <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                    <FormField label="电子邮箱" type="email" value={formData.userEmail} onChange={handleInputChange('userEmail')} placeholder="hello@example.com" hasChanged={changes.has('userEmail')} />
                    <FormField label="手机号码" type="tel" value={formData.userPhone} onChange={handleInputChange('userPhone')} placeholder="未绑定" hasChanged={changes.has('userPhone')} />
                  </div>
                </TabsContent>
              </Tabs>

              {message && (
                <div className={`flex items-center gap-4 rounded-[2rem] border p-6 text-sm font-bold tracking-tight shadow-xl ${message.type === 'success' ? 'border-green-500/10 bg-green-500/5 text-green-600' : 'border-red-500/10 bg-red-500/5 text-red-600'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                  <span className="flex-1">{message.text}</span>
                  <X className="h-5 w-5 cursor-pointer" onClick={() => setMessage(null)} />
                </div>
              )}

              <div className="flex items-center justify-end gap-6 pt-12 border-t border-border/10">
                <Button type="submit" size="lg" disabled={loading || !hasChanges} className="rounded-full px-12 h-14 text-sm font-black tracking-tight shadow-2xl transition-all bg-primary">
                  {loading ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : '保存所有更改'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, type = 'text', value, onChange, placeholder, hasChanged }: { label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; hasChanged?: boolean }) {
  return (
    <div className="space-y-4">
      <Label className="text-foreground/30 font-black text-[10px] tracking-[0.25em] uppercase flex items-center gap-2 mb-1">
        {label} {hasChanged && <span className="bg-primary h-1.5 w-1.5 rounded-full" />}
      </Label>
      <Input type={type} value={value} onChange={onChange} placeholder={placeholder} className="border-border/5 bg-card/40 focus:bg-card/60 focus:border-primary/20 h-16 rounded-[2.5rem] px-8 text-lg font-black tracking-tight focus:ring-0 transition-all shadow-sm" />
    </div>
  )
}
