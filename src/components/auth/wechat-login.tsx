'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { checkWxLoginStatus, getWxLoginQrCode } from '@/api/user/userController'
import { AlertCircle, ArrowLeft, Loader2, RefreshCw, QrCode } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

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
      // Small delay for smooth transition
      setTimeout(() => setLoading(false), 300)
    }
  }, [setError])

  // Start polling for login status
  React.useEffect(() => {
    if (!sceneId) return

    let expireTimeout: NodeJS.Timeout

    const pollStatus = async () => {
      try {
        const res = (await checkWxLoginStatus({
          sceneId: sceneId,
        })) as unknown as UserAPI.BaseResponseLoginUserVO
        
        if (res.code === 0 && res.data) {
          // Login successful
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
          }
          toast.success('微信登录成功', {
            description: `欢迎回来，${res.data.userName}`,
          })
          onLoginSuccess(res.data)
        }
      } catch {
        // Continue polling on error
      }
    }

    // Poll every 2 seconds
    pollingRef.current = setInterval(pollStatus, 2000)

    // QR code expires after 5 minutes
    expireTimeout = setTimeout(
      () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current)
        }
        setExpired(true)
      },
      5 * 60 * 1000
    )

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
      clearTimeout(expireTimeout)
    }
  }, [sceneId, onLoginSuccess])

  // Fetch QR code on mount
  React.useEffect(() => {
    fetchQrCode()
  }, [fetchQrCode])

  const handleRefresh = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
    }
    fetchQrCode()
  }

  return (
    <div className="flex flex-col items-center space-y-8 py-4">
      <div className="relative group">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex h-52 w-52 items-center justify-center rounded-[2rem] bg-gray-50 dark:bg-zinc-900 shadow-inner"
            >
              <div className="relative">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                <QrCode className="absolute inset-0 m-auto h-5 w-5 text-primary/60" />
              </div>
            </motion.div>
          ) : qrCodeUrl ? (
            <motion.div
              key="qrcode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-3 rounded-[2rem] bg-white dark:bg-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.05] dark:ring-white/[0.05]"
            >
              <div className="relative h-44 w-44 overflow-hidden rounded-[1.5rem]">
                <img
                  src={qrCodeUrl}
                  alt="微信登录二维码"
                  className={`h-full w-full object-cover transition-all duration-500 ${expired ? 'scale-105 blur-[3px] grayscale' : 'hover:scale-110'}`}
                />
                <AnimatePresence>
                  {expired && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-md dark:bg-black/60"
                    >
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        二维码已过期
                      </span>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleRefresh}
                        className="h-9 rounded-full bg-[#07c160] px-4 font-semibold hover:bg-[#06ad56] shadow-lg"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        立即刷新
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-52 w-52 flex-col items-center justify-center gap-4 rounded-[2rem] bg-red-50 dark:bg-red-950/20"
            >
              <AlertCircle className="h-10 w-10 text-red-500/50" />
              <Button variant="outline" size="sm" onClick={handleRefresh} className="rounded-full">
                点击重试
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Decorative corner accents */}
        {!loading && !expired && qrCodeUrl && (
          <>
            <div className="absolute -top-1 -left-1 h-4 w-4 rounded-tl-xl border-t-2 border-l-2 border-[#07c160] opacity-50" />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-br-xl border-b-2 border-r-2 border-[#07c160] opacity-50" />
          </>
        )}
      </div>

      <div className="space-y-3 text-center">
        <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          打开微信扫一扫
        </h3>
        <p className="mx-auto max-w-[220px] text-xs font-medium leading-relaxed text-gray-500/80">
          请扫描二维码关注公众号完成登录<br />
          <span className="mt-1 inline-block opacity-60">安全 · 快速 · 无需密码</span>
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="group h-12 w-full rounded-2xl text-sm font-bold text-gray-500 transition-all hover:bg-gray-100 dark:text-zinc-500 dark:hover:bg-zinc-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        返回其他方式
      </Button>
    </div>
  )
}
