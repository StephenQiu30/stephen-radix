'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { checkWxLoginStatus, getWxLoginQrCode } from '@/api/user/userController'
import { AlertCircle, ArrowLeft, Loader2, RefreshCw, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface WeChatLoginProps {
  onBack: () => void
  onLoginSuccess: (user: UserAPI.LoginUserVO) => void
  error: string
  setError: (error: string) => void
}

export function WeChatLogin({ onBack, onLoginSuccess, error, setError }: WeChatLoginProps) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('')
  const [sceneId, setSceneId] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)
  const [expired, setExpired] = React.useState(false)
  const pollingRef = React.useRef<NodeJS.Timeout | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const fetchQrCode = React.useCallback(async () => {
    setLoading(true)
    setExpired(false)
    setError('')

    try {
      const res = (await getWxLoginQrCode()) as unknown as UserAPI.BaseResponseWxLoginResponse
      if (res.code === 0 && res.data) {
        setQrCodeUrl(res.data.qrCodeUrl || '')
        setSceneId(res.data.sceneId || '')
      } else {
        setError(res.message || '获取二维码失败')
      }
    } catch (err: any) {
      setError(err.message || '获取二维码失败')
    } finally {
      setTimeout(() => setLoading(false), 300)
    }
  }, [setError])

  // Start polling
  React.useEffect(() => {
    if (!sceneId) return
    let expireTimeout: NodeJS.Timeout
    const pollStatus = async () => {
      try {
        const res = (await checkWxLoginStatus({ sceneId })) as unknown as UserAPI.BaseResponseLoginUserVO
        if (res.code === 0 && res.data) {
          if (pollingRef.current) clearInterval(pollingRef.current)
          toast.success('微信登录成功', { description: `欢迎回来，${res.data.userName}` })
          onLoginSuccess(res.data)
        }
      } catch {}
    }
    pollingRef.current = setInterval(pollStatus, 2000)
    expireTimeout = setTimeout(() => {
      if (pollingRef.current) clearInterval(pollingRef.current)
      setExpired(true)
    }, 5 * 60 * 1000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
      clearTimeout(expireTimeout)
    }
  }, [sceneId, onLoginSuccess])

  React.useEffect(() => {
    fetchQrCode()
  }, [fetchQrCode])

  useGSAP(() => {
    if (!loading) {
      gsap.from('.wechat-animate', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      })
    }
  }, { scope: containerRef, dependencies: [loading] })

  const handleRefresh = () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    fetchQrCode()
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center space-y-8 py-4">
      <div className="relative group wechat-animate">
        <div className="absolute inset-0 bg-[#07c160]/10 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-1000" />
        
        <div className="relative h-56 w-56 flex items-center justify-center rounded-[2.5rem] bg-card/30 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-[#07c160]/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#07c160]/40">生成中</span>
            </div>
          ) : qrCodeUrl ? (
            <div className="relative h-full w-full">
              <img
                src={qrCodeUrl}
                alt="微信登录二维码"
                className={`h-full w-full object-cover rounded-[1.5rem] transition-all duration-700 ${expired ? 'blur-md grayscale opacity-30 shadow-none' : 'group-hover:scale-105 shadow-sm'}`}
              />
              {expired && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-foreground/40">二维码已过期</span>
                  <Button
                    onClick={handleRefresh}
                    size="sm"
                    className="h-10 rounded-full bg-[#07c160] px-6 font-black text-[11px] tracking-tight hover:bg-[#06ad56] shadow-xl shadow-[#07c160]/20"
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    立即刷新
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-10 w-10 text-red-500/20" />
              <Button variant="outline" size="sm" onClick={handleRefresh} className="rounded-full font-black text-[11px] tracking-tight bg-background">
                重试
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 text-center wechat-animate">
        <h3 className="text-xl font-black tracking-tight text-foreground">
          微信扫一扫
        </h3>
        <p className="mx-auto max-w-[240px] text-[11px] font-black leading-relaxed text-foreground/30 uppercase tracking-widest">
          安全 · 快速 · 无需密码
        </p>
      </div>

      {error && (
        <div className="wechat-animate flex items-center gap-3 rounded-2xl bg-red-500/5 border border-red-500/10 p-4 text-[10px] font-black tracking-tight text-red-600 uppercase tracking-widest">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="wechat-animate group h-12 w-full rounded-full text-[11px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground hover:bg-muted/30 transition-all duration-500"
      >
        <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        返回登录方式
      </Button>
    </div>
  )
}
