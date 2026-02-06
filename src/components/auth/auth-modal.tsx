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

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [emailForm, setEmailForm] = React.useState({
    email: '',
    code: '',
  })
  const [countdown, setCountdown] = React.useState(0)

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
      <DialogContent className="overflow-hidden border-none bg-white/80 p-0 shadow-2xl backdrop-blur-xl sm:max-w-[420px] dark:bg-[#1c1c1e]/90">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#0071e3] to-[#0077ed]" />

        <DialogHeader className="space-y-4 px-8 pt-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 shadow-inner dark:from-gray-800 dark:to-gray-900">
              {user?.userAvatar ? (
                <img
                  src={user.userAvatar}
                  alt={user.userName || '用户头像'}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-white dark:ring-white/10"
                />
              ) : (
                <UserIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                登录 / 注册
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1.5 text-base">
                使用邮箱或 GitHub 快捷登录
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 pb-8 pt-6">
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={handleGitHubLogin}
              className="h-11 w-full gap-2 rounded-xl border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Github className="h-5 w-5" />
              使用 GitHub 登录
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/50 px-2 text-gray-500 backdrop-blur-sm dark:bg-[#1c1c1e]/50">
                  或者使用邮箱
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  邮箱地址
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={emailForm.email}
                    onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 pl-10 transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50"
                    required
                  />
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  验证码
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="code"
                    placeholder="6位验证码"
                    value={emailForm.code}
                    onChange={e => setEmailForm({ ...emailForm, code: e.target.value })}
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50"
                    required
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={loading || countdown > 0}
                    className="h-11 min-w-[100px] shrink-0 rounded-xl border-gray-200"
                  >
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50/50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50/50 p-3 text-sm text-green-600 dark:bg-green-900/10 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#0071e3] text-base font-medium text-white shadow-lg transition-all hover:bg-[#0077ed] hover:shadow-xl active:scale-[0.98] disabled:opacity-70 dark:bg-[#0071e3] dark:hover:bg-[#0077ed]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? '登录 / 注册' : '登录 / 注册'}
              </Button>
            </form>
          </div>
        </div>

        <div className="bg-gray-50/50 px-8 py-4 text-center dark:bg-gray-800/30">
          <p className="text-muted-foreground text-xs">
            登录即代表您同意我们的
            <a
              href="#"
              className="hover:text-primary mx-1 font-medium underline underline-offset-2"
            >
              服务条款
            </a>
            和
            <a
              href="#"
              className="hover:text-primary mx-1 font-medium underline underline-offset-2"
            >
              隐私政策
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
