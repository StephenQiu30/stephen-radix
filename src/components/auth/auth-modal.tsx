'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoginUser } from '@/store/modules'
import { userLogin, userRegister } from '@/api/userController'
import { AlertCircle, CheckCircle2, Loader2, User as UserIcon, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  const [loginForm, setLoginForm] = React.useState({
    userAccount: '',
    userPassword: '',
  })

  const [registerForm, setRegisterForm] = React.useState({
    userAccount: '',
    userPassword: '',
    checkPassword: '',
  })

  // Start Clear error when switching tabs
  React.useEffect(() => {
    setError('')
    setSuccess('')
  }, [activeTab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!loginForm.userAccount.trim()) {
      setError('请输入账号')
      setLoading(false)
      return
    }

    if (loginForm.userPassword.length < 8) {
      setError('密码长度不能少于 8 位')
      setLoading(false)
      return
    }

    try {
      const res = (await userLogin(loginForm)) as unknown as API.BaseResponseLoginUserVO
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!registerForm.userAccount.trim()) {
      setError('请输入账号')
      return
    }

    if (registerForm.userAccount.length < 4) {
      setError('账号长度不能少于 4 位')
      return
    }

    if (registerForm.userPassword.length < 8) {
      setError('密码长度不能少于 8 位')
      return
    }

    if (registerForm.userPassword !== registerForm.checkPassword) {
      setError('两次密码输入不一致')
      return
    }

    setLoading(true)

    try {
      const res = (await userRegister({
        userAccount: registerForm.userAccount,
        userPassword: registerForm.userPassword,
        checkPassword: registerForm.checkPassword,
      })) as unknown as API.BaseResponseLong
      if (res.code === 0) {
        setActiveTab('login')
        setSuccess('注册成功，请登录')
        setRegisterForm({ userAccount: '', userPassword: '', checkPassword: '' })
      } else {
        setError(res.message || '注册失败')
      }
    } catch (err: any) {
      setError(err.message || '注册失败，请重试')
    } finally {
      setLoading(false)
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
                {activeTab === 'login' ? '欢迎回来' : '创建账户'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1.5 text-base">
                {activeTab === 'login' ? '登录以继续访问' : '注册以开始体验'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 pb-8">
          <Tabs
            value={activeTab}
            onValueChange={v => setActiveTab(v as 'login' | 'register')}
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-100/80 p-1 dark:bg-gray-800/80">
              <TabsTrigger
                value="login"
                className="rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                登录
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                注册
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6 space-y-4 focus-visible:outline-none">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="login-account"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    账号
                  </Label>
                  <Input
                    id="login-account"
                    placeholder="请输入您的账号"
                    value={loginForm.userAccount}
                    onChange={e => setLoginForm({ ...loginForm, userAccount: e.target.value })}
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50"
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="login-password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    密码
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="请输入密码"
                    value={loginForm.userPassword}
                    onChange={e => setLoginForm({ ...loginForm, userPassword: e.target.value })}
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50"
                    required
                    minLength={8}
                    autoComplete="current-password"
                  />
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
                  {loading ? '登录中...' : '登 录'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-4 focus-visible:outline-none">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="register-account"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    账号
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-account"
                      placeholder="设置账号（至少 4 位）"
                      value={registerForm.userAccount}
                      onChange={e =>
                        setRegisterForm({ ...registerForm, userAccount: e.target.value })
                      }
                      className={cn(
                        'h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50',
                        registerForm.userAccount && registerForm.userAccount.length < 4
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : ''
                      )}
                      required
                      minLength={4}
                      autoComplete="username"
                    />
                    {registerForm.userAccount && (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        {registerForm.userAccount.length >= 4 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[11px]">至少 4 位字符</p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    密码
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="设置密码（至少 8 位）"
                      value={registerForm.userPassword}
                      onChange={e =>
                        setRegisterForm({ ...registerForm, userPassword: e.target.value })
                      }
                      className={cn(
                        'h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50',
                        registerForm.userPassword && registerForm.userPassword.length < 8
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : ''
                      )}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    {registerForm.userPassword && (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        {registerForm.userPassword.length >= 8 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[11px]">至少 8 位字符</p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-check-password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    确认密码
                  </Label>
                  <Input
                    id="register-check-password"
                    type="password"
                    placeholder="请再次输入密码"
                    value={registerForm.checkPassword}
                    onChange={e =>
                      setRegisterForm({ ...registerForm, checkPassword: e.target.value })
                    }
                    className={cn(
                      'h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50',
                      registerForm.checkPassword &&
                        registerForm.userPassword !== registerForm.checkPassword
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : ''
                    )}
                    required
                    autoComplete="new-password"
                  />
                  {registerForm.checkPassword && (
                    <p
                      className={cn(
                        'flex items-center gap-1 text-[11px] font-medium',
                        registerForm.userPassword === registerForm.checkPassword
                          ? 'text-green-600'
                          : 'text-red-500'
                      )}
                    >
                      {registerForm.userPassword === registerForm.checkPassword ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> 密码一致
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> 密码不一致
                        </>
                      )}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50/50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-[#0071e3] text-base font-medium text-white shadow-lg transition-all hover:bg-[#0077ed] hover:shadow-xl active:scale-[0.98] disabled:opacity-70 dark:bg-[#0071e3] dark:hover:bg-[#0077ed]"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? '注册中...' : '注 册'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
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
