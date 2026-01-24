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
import { Loader2, User as UserIcon, UserCircle } from 'lucide-react'

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

  const [loginForm, setLoginForm] = React.useState({
    userAccount: '',
    userPassword: '',
  })

  const [registerForm, setRegisterForm] = React.useState({
    userAccount: '',
    userPassword: '',
    checkPassword: '',
  })

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
      const res = await userLogin(loginForm)
      if (res.code === 0 && res.data) {
        dispatch(setLoginUser(res.data))
        onOpenChange(false)
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
      const res = await userRegister({
        userAccount: registerForm.userAccount,
        userPassword: registerForm.userPassword,
        checkPassword: registerForm.checkPassword,
      })
      if (res.code === 0) {
        setActiveTab('login')
        setError('注册成功，请登录')
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
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center">
            {user?.userAvatar ? (
              <img
                src={user.userAvatar}
                alt={user.userName || '用户头像'}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                <UserCircle className="text-primary h-10 w-10" />
              </div>
            )}
          </div>
          <div className="text-center">
            <DialogTitle className="text-2xl">欢迎回来</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              登录或注册以继续
            </DialogDescription>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="login-account">
                  账号
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="login-account"
                  placeholder="请输入您的账号"
                  value={loginForm.userAccount}
                  onChange={e => setLoginForm({ ...loginForm, userAccount: e.target.value })}
                  required
                  autoComplete="username"
                />
                <p className="text-muted-foreground text-xs">请输入您注册时使用的账号</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">
                  密码
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="请输入密码（至少 8 位）"
                  value={loginForm.userPassword}
                  onChange={e => setLoginForm({ ...loginForm, userPassword: e.target.value })}
                  required
                  minLength={8}
                  autoComplete="current-password"
                />
                <p className="text-muted-foreground text-xs">
                  密码长度至少 8 位，建议包含字母和数字
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg p-3 text-sm">
                  <UserIcon className="h-4 w-4" />
                  {error}
                </div>
              )}

              <DialogFooter>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? '登录中...' : '登录'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="register-account">
                  账号
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="register-account"
                  placeholder="请输入账号（至少 3 位）"
                  value={registerForm.userAccount}
                  onChange={e => setRegisterForm({ ...registerForm, userAccount: e.target.value })}
                  required
                  minLength={3}
                  autoComplete="username"
                />
                <p className="text-muted-foreground text-xs">账号长度至少 3 位，仅支持字母和数字</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">
                  密码
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="请输入密码（至少 8 位）"
                  value={registerForm.userPassword}
                  onChange={e => setRegisterForm({ ...registerForm, userPassword: e.target.value })}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <p className="text-muted-foreground text-xs">
                  密码长度至少 8 位，建议包含字母、数字和特殊字符
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-check-password">
                  确认密码
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="register-check-password"
                  type="password"
                  placeholder="请再次输入密码"
                  value={registerForm.checkPassword}
                  onChange={e =>
                    setRegisterForm({ ...registerForm, checkPassword: e.target.value })
                  }
                  required
                  autoComplete="new-password"
                />
                {registerForm.checkPassword && (
                  <p
                    className={
                      registerForm.userPassword === registerForm.checkPassword
                        ? 'text-green-600'
                        : 'text-destructive'
                    }
                  >
                    {registerForm.userPassword === registerForm.checkPassword
                      ? '✓ 密码一致'
                      : '✗ 密码不一致'}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg p-3 text-sm">
                  <UserIcon className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="bg-muted rounded-lg p-3 text-xs">
                <p className="font-medium">注册须知：</p>
                <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-1">
                  <li>账号和密码请妥善保管</li>
                  <li>遵守社区规则，文明发言</li>
                  <li>禁止发布违法违规内容</li>
                </ul>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? '注册中...' : '注册'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
