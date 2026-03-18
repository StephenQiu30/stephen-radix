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
import { ArrowLeft, Camera, CheckCircle2, Loader2, Shield, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { AuthModal } from '@/components/auth/auth-modal'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
import { getLoginUser, editUser } from '@/api/user/userController'
import { uploadFile } from '@/api/file/fileController'
import { FileUploadBizEnum } from '@/enums/FileUploadBizEnum'
import { setLoginUser } from '@/store/modules/user/userSlice'

// GSAP handle motions

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
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [activeField, setActiveField] = React.useState<string | null>(null)
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
      const res = await uploadFile(
        { fileUploadRequest: { biz: FileUploadBizEnum.USER_AVATAR } },
        {},
        file
      )
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

  useGSAP(
    () => {
      if (user) {
        gsap.from('.animate-in', {
          opacity: 0,
          y: 30,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
        })
      }
    },
    { scope: containerRef, dependencies: [user] }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const res = (await editUser({
        ...formData,
      } as UserAPI.UserEditRequest)) as unknown as UserAPI.BaseResponseBoolean

      if (res.code === 0 && res.data) {
        setMessage({ type: 'success', text: 'Settings updated successfully! ✨' })

        // 刷新用户信息
        const userRes = (await getLoginUser()) as unknown as UserAPI.BaseResponseUserVO
        if (userRes.code === 0 && userRes.data) {
          dispatch(setLoginUser(userRes.data))
          setChanges(new Set())
        }
      } else {
        setMessage({ type: 'error', text: res.message || 'Update failed' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error occurred' })
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  if (!user) {
    return (
      <>
        <LoginPromptCard onLoginClick={() => setAuthModalOpen(true)} />
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    )
  }

  const hasChanges = changes.size > 0

  return (
    <div ref={containerRef} className="container mx-auto px-6 max-w-7xl py-12 md:py-24 space-y-16 selection:bg-primary/20">
      {/* 顶部导航 */}
      <div className="animate-in flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border/10 pb-12">
        <div className="space-y-6">
          <Link href="/user/profile" className="group flex items-center text-[13px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300">
            <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Profile
          </Link>
          <div className="space-y-2">
            <h1 className="text-foreground text-7xl md:text-8xl font-bold tracking-tighter leading-[0.85]">
              Settings
            </h1>
            <p className="text-muted-foreground/60 text-xl font-medium tracking-tight">Manage your account preferences and info.</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="bg-primary text-primary-foreground rounded-full px-6 py-2 text-sm font-bold tracking-tight shadow-xl shadow-primary/20 transition-all">
            {changes.size} unsaved changes
          </div>
        )}
      </div>

      <div className="grid gap-16 lg:grid-cols-12">
        {/* 左侧 - 预览与头像 (4cols) */}
        <div className="animate-in lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
          <div className="relative group mx-auto md:mx-0 w-fit">
            <UserAvatar
              user={{ ...user, ...formData }}
              className="h-48 w-48 md:h-64 md:w-64 border-[8px] border-background shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
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
              className="bg-primary/90 text-primary-foreground absolute bottom-4 right-4 h-14 w-14 rounded-full shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-bold tracking-tight">{formData.userName || user.userName}</h3>
            <p className="text-muted-foreground font-bold text-[10px] tracking-widest uppercase py-1 px-3 bg-muted w-fit rounded-full">
              {user.userRole === 'admin' ? 'Administrator' : 'Explorer Member'}
            </p>
            <p className="text-muted-foreground/60 text-lg leading-relaxed font-medium tracking-tight">
              "{formData.userProfile || 'No description yet...'}"
            </p>
          </div>
        </div>

        {/* 右侧 - 编辑区域 (8cols) */}
        <div className="animate-in lg:col-span-8">
          <form onSubmit={handleSubmit} className="space-y-12">
            <Tabs defaultValue="profile" className="w-full space-y-12">
              <TabsList className="bg-transparent h-auto p-0 gap-8 border-b border-border/10 rounded-none w-full justify-start">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:border-primary border-b-2 border-transparent px-0 pb-4 rounded-none text-xl font-bold tracking-tight text-muted-foreground transition-all"
                >
                  Personal Profile
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:border-primary border-b-2 border-transparent px-0 pb-4 rounded-none text-xl font-bold tracking-tight text-muted-foreground transition-all"
                >
                  Contact & Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-12 outline-none pt-4">
                <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                  <FormField
                    label="Display Name"
                    value={formData.userName}
                    onChange={handleInputChange('userName')}
                    placeholder="Enter your name"
                    required
                    hasChanged={changes.has('userName')}
                  />

                  <div className="sm:col-span-2 space-y-3">
                    <Label className="text-muted-foreground font-bold text-[10px] tracking-widest uppercase flex items-center gap-2">
                      Bio Description
                      {changes.has('userProfile') && (
                        <span className="text-primary">•</span>
                      )}
                    </Label>
                    <Textarea
                      value={formData.userProfile}
                      onChange={handleInputChange('userProfile')}
                      placeholder="Tell us about yourself..."
                      className="border-border/10 bg-muted/20 focus:bg-muted/40 focus:border-primary/20 min-h-[160px] resize-none rounded-[2rem] p-6 text-lg font-medium tracking-tight focus:ring-0 transition-all"
                    />
                    <div className="text-muted-foreground/40 text-right text-[10px] font-bold tracking-widest uppercase">
                      {formData.userProfile.length} / 200
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-12 outline-none pt-4">
                <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                  <FormField
                    label="Email Address"
                    type="email"
                    value={formData.userEmail}
                    onChange={handleInputChange('userEmail')}
                    placeholder="hello@example.com"
                    hasChanged={changes.has('userEmail')}
                  />
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={formData.userPhone}
                    onChange={handleInputChange('userPhone')}
                    placeholder="Not linked"
                    hasChanged={changes.has('userPhone')}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* 消息回显 */}
            {message && (
              <div
                className={`flex items-center gap-4 rounded-[2rem] border p-6 text-sm font-bold tracking-tight shadow-xl shadow-black/5 ${message.type === 'success'
                  ? 'border-green-500/10 bg-green-500/5 text-green-600'
                  : 'border-red-500/10 bg-red-500/5 text-red-600'
                  }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                ) : (
                  <Shield className="h-6 w-6 shrink-0" />
                )}
                <span className="flex-1">{message.text}</span>
                <button type="button" onClick={() => setMessage(null)} className="hover:opacity-60 transition-opacity">
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* 操作条 */}
            <div className="flex items-center justify-end gap-6 pt-12 border-t border-border/10">
              <Button
                type="submit"
                size="lg"
                disabled={loading || !hasChanges}
                className="rounded-full px-12 h-14 text-lg font-bold tracking-tight shadow-2xl shadow-primary/20 transition-all enabled:hover:scale-[1.02] enabled:active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  hasChanged,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  required?: boolean
  hasChanged?: boolean
}) {
  return (
    <div className="space-y-4">
      <Label className="text-muted-foreground font-bold text-[10px] tracking-widest uppercase flex items-center gap-2">
        {label}
        {hasChanged && <span className="bg-primary h-1 w-1 rounded-full" />}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border-border/10 bg-muted/20 focus:bg-muted/40 focus:border-primary/20 h-16 rounded-[2rem] px-6 text-lg font-medium tracking-tight focus:ring-0 transition-all h-14"
      />
    </div>
  )
}
