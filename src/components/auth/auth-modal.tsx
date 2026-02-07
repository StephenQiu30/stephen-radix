'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoginUser } from '@/store/modules'
import { emailLogin, getGitHubAuthUrl, sendEmailCode } from '@/api/user/userController'
import { AlertCircle, CheckCircle2, Github, Loader2, Mail, User as UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface LoginMethodChoicesProps {
  onGitHubLogin: () => void
  onEmailClick: () => void
}

function LoginMethodChoices({ onGitHubLogin, onEmailClick }: LoginMethodChoicesProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={onGitHubLogin}
        className="group relative flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#0071e3]/30 hover:bg-[#0071e3]/5 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-[#0071e3]/50 dark:hover:bg-[#0071e3]/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
          <Github className="h-6 w-6 text-gray-900 transition-colors group-hover:text-[#0071e3] dark:text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">GitHub</span>
          <span className="text-[10px] text-gray-500">快捷登录</span>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={onEmailClick}
        className="group relative flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#0071e3]/30 hover:bg-[#0071e3]/5 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-[#0071e3]/50 dark:hover:bg-[#0071e3]/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
          <Mail className="h-6 w-6 text-gray-900 transition-colors group-hover:text-[#0071e3] dark:text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">邮箱</span>
          <span className="text-[10px] text-gray-500">验证码登录</span>
        </div>
      </Button>
    </div>
  )
}

interface EmailLoginFormProps {
  emailForm: { email: string; code: string }
  setEmailForm: React.Dispatch<React.SetStateAction<{ email: string; code: string }>>
  onSendCode: () => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  loading: boolean
  countdown: number
  error: string
  success: string
}

function EmailLoginForm({
  emailForm,
  setEmailForm,
  onSendCode,
  onSubmit,
  onBack,
  loading,
  countdown,
  error,
  success,
}: EmailLoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          邮箱地址
        </Label>
        <div className="relative group">
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={emailForm.email}
            onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
            className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 pl-11 transition-all focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10 group-hover:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800"
            required
          />
          <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-[#0071e3]" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          验证码
        </Label>
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Input
              id="code"
              placeholder="6位验证码"
              value={emailForm.code}
              onChange={e => setEmailForm({ ...emailForm, code: e.target.value })}
              className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 pl-11 transition-all focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10 group-hover:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800"
              required
              maxLength={6}
            />
            <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-[#0071e3]" />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onSendCode}
            disabled={loading || countdown > 0}
            className="h-12 min-w-[120px] shrink-0 rounded-xl border-2 border-gray-100 bg-white font-medium text-gray-600 hover:border-[#0071e3]/30 hover:bg-[#0071e3]/5 hover:text-[#0071e3] disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {countdown > 0 ? `${countdown}s` : '发送验证码'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-gradient-to-r from-[#0071e3] to-[#0077ed] text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 dark:shadow-blue-900/30"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          登录 / 注册
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-10 w-full rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
        >
          返回方式选择
        </Button>
      </div>
    </form>
  )
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [view, setView] = React.useState<'choice' | 'email'>('choice')
  const [emailForm, setEmailForm] = React.useState({
    email: '',
    code: '',
  })
  const [countdown, setCountdown] = React.useState(0)

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
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = (await sendEmailCode({ email: emailForm.email })) as unknown as UserAPI.BaseResponseInteger
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
      const res = (await emailLogin(emailForm)) as unknown as UserAPI.BaseResponseUserVO
      if (res.code === 0 && res.data) {
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
      const res = (await getGitHubAuthUrl()) as unknown as UserAPI.BaseResponseString
      if (res.code === 0 && res.data) {
        window.location.href = res.data
      } else {
        setError(res.message || '获取 GitHub 授权链接失败')
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-none bg-white p-0 shadow-2xl sm:max-w-[420px] dark:bg-[#1c1c1e]">
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#0071e3] via-[#42a5f5] to-[#0077ed]" />

        <DialogHeader className="space-y-6 px-8 pt-10">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#0071e3]/20 to-[#0077ed]/0 blur-sm" />
              <Avatar className="relative h-20 w-20 ring-4 ring-white shadow-lg dark:ring-[#1c1c1e]">
                <AvatarImage src={user?.userAvatar} alt={user?.userName || '用户头像'} />
                <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <UserIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center space-y-2">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {view === 'choice' ? '欢迎回来' : '邮箱登录'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                {view === 'choice' ? '选择一种方式登录您的账户' : '输入您的邮箱地址以继续'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 pb-10 pt-6">
          <div className="min-h-[120px]">
            {view === 'choice' ? (
              <LoginMethodChoices
                onGitHubLogin={handleGitHubLogin}
                onEmailClick={() => setView('email')}
              />
            ) : (
              <EmailLoginForm
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
          </div>
        </div>

        <div className="bg-gray-50/80 backdrop-blur-sm px-8 py-5 text-center dark:bg-gray-800/50">
          <p className="text-muted-foreground text-xs text-center leading-relaxed">
            登录即代表您同意我们的
            <a
              href="#"
              className="hover:text-primary mx-1 font-medium text-gray-700 underline underline-offset-2 transition-colors hover:text-[#0071e3] dark:text-gray-300 dark:hover:text-[#0071e3]"
            >
              服务条款
            </a>
            和
            <a
              href="#"
              className="hover:text-primary mx-1 font-medium text-gray-700 underline underline-offset-2 transition-colors hover:text-[#0071e3] dark:text-gray-300 dark:hover:text-[#0071e3]"
            >
              隐私政策
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
