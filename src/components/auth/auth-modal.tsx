'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoginUser } from '@/store/modules'
import {
  getGitHubAuthorizeUrl,
  sendEmailLoginCode,
  userLoginByEmail,
} from '@/api/user/userController'
import { User as UserIcon, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MethodSelector } from './method-selector'
import { EmailLogin } from './email-login'
import { WeChatLogin } from './wechat-login'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ViewType = 'choice' | 'email' | 'wechat'

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [view, setView] = React.useState<ViewType>('choice')
  const [emailForm, setEmailForm] = React.useState({
    email: '',
    code: '',
  })
  const [countdown, setCountdown] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Reset view when modal opens
  React.useEffect(() => {
    if (open) {
      setView('choice')
      setError('')
      setSuccess('')
    }
  }, [open])

  // Countdown timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const handleSendCode = async () => {
    if (!emailForm.email) {
      setError('请输入邮箱地址')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
      setError('请输入有效的邮箱地址')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = (await sendEmailLoginCode({
        email: emailForm.email,
      })) as unknown as UserAPI.BaseResponseInteger
      if (res.code === 0) {
        setSuccess('验证码已发送')
        setCountdown(60)
      } else {
        setError(res.message || '发送失败')
      }
    } catch (err: any) {
      setError(err.message || '发送失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    if (!emailForm.email || !emailForm.code) {
      setError('请输入邮箱和验证码')
      setLoading(false)
      return
    }
    try {
      const res = (await userLoginByEmail(emailForm)) as unknown as UserAPI.BaseResponseLoginUserVO
      if (res.code === 0 && res.data) {
        if (res.data.token && typeof window !== 'undefined') {
          localStorage.setItem('token', res.data.token)
        }
        dispatch(setLoginUser(res.data))
        onOpenChange(false)
        setSuccess('登录成功')
      } else {
        setError(res.message || '登录失败')
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    try {
      const res = (await getGitHubAuthorizeUrl()) as unknown as UserAPI.BaseResponseString
      if (res.code === 0 && res.data) {
        window.location.href = res.data
      } else {
        setError(res.message || '获取 GitHub 授权链接失败')
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试')
    }
  }

  const handleWeChatLoginSuccess = (loginUser: UserAPI.LoginUserVO) => {
    if (loginUser.token && typeof window !== 'undefined') {
      localStorage.setItem('token', loginUser.token)
    }
    dispatch(setLoginUser(loginUser))
    onOpenChange(false)
  }

  useGSAP(() => {
    if (open) {
      gsap.from('.auth-modal-content', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      })
    }
  }, { scope: containerRef, dependencies: [open, view] })

  const getTitle = () => {
    switch (view) {
      case 'email': return '邮箱登录'
      case 'wechat': return '扫码登录'
      default: return '欢迎回来'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-none bg-background/50 backdrop-blur-3xl p-0 shadow-2xl sm:max-w-[440px] rounded-[2.5rem] selection:bg-primary/20">
        <div ref={containerRef} className="auth-modal-content relative flex flex-col">
          <DialogHeader className="space-y-6 px-10 pt-16">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <Avatar className="relative h-24 w-24 border-[6px] border-background shadow-2xl transition-transform duration-700 group-hover:scale-110">
                  <AvatarImage src={user?.userAvatar} alt={user?.userName || '用户头像'} />
                  <AvatarFallback className="bg-muted backdrop-blur-2xl">
                    <UserIcon className="h-10 w-10 text-foreground/20" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2 text-center">
                <DialogTitle className="text-3xl font-black tracking-tight text-foreground">
                  {getTitle()}
                </DialogTitle>
                <DialogDescription className="text-foreground/40 text-sm font-bold tracking-tight px-4">
                  {view === 'choice' ? '选择您偏好的方式登录账户' : '请根据指示完成身份验证'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-10 pt-10 pb-12">
            <div className="min-h-[160px]">
              {view === 'choice' && (
                <MethodSelector
                  onGitHubLogin={handleGitHubLogin}
                  onEmailClick={() => setView('email')}
                  onWeChatClick={() => setView('wechat')}
                />
              )}
              {view === 'email' && (
                <EmailLogin
                  emailForm={emailForm}
                  setEmailForm={setEmailForm}
                  onSendCode={handleSendCode}
                  onSubmit={handleEmailLogin}
                  onBack={() => setView('choice')}
                  loading={loading}
                  countdown={countdown}
                  error={error}
                  success={success}
                />
              )}
              {view === 'wechat' && (
                <WeChatLogin
                  onBack={() => setView('choice')}
                  onLoginSuccess={handleWeChatLoginSuccess}
                  error={error}
                  setError={setError}
                />
              )}
            </div>
          </div>

          <div className="bg-muted/20 px-10 py-6 text-center border-t border-border/5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed text-foreground/20 italic">
              登录即代表您同意
              <a href="#" className="mx-1 text-foreground/40 hover:text-primary transition-colors underline underline-offset-4 decoration-border/10">服务条款</a>
              与
              <a href="#" className="mx-1 text-foreground/40 hover:text-primary transition-colors underline underline-offset-4 decoration-border/10">隐私政策</a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
