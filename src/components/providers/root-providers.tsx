'use client'

import * as React from 'react'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Provider } from 'react-redux'
import store from '@/store'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearLoginUser, setLoginUser } from '@/store/modules/user/userSlice'
import { getLoginUser } from '@/api/user/userController'
import { toast } from 'sonner'
import { FullScreenLoader } from '@/components/common/full-screen-loader'

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = (await getLoginUser({
          validateStatus: (status: number) =>
            (status >= 200 && status < 300) || status === 401 || status === 403,
        })) as unknown as UserAPI.BaseResponseUserVO
        if (res.code === 0 && res.data) {
          dispatch(setLoginUser(res.data))
        } else {
          dispatch(clearLoginUser())
        }
      } catch (error) {
        const status = (error as any)?.response?.status
        if (status !== 401 && status !== 403) {
          console.error('获取用户信息失败:', error)
        }
        if (status === 401 || status === 403) {
          dispatch(clearLoginUser())
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchCurrentUser()
  }, [dispatch])

  // WebSocket Connection Logic
  const socketRef = React.useRef<WebSocket | null>(null)
  const reconnectTimerRef = React.useRef<NodeJS.Timeout>(null)

  useEffect(() => {
    const connectWebSocket = () => {
      if (!user) return

      // Determine WebSocket URL based on current environment
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = process.env.NEXT_PUBLIC_API_BASE_URL
        ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).host
        : 'localhost:8080'
      const wsUrl = `${protocol}//${host}/api/ws/notification/${user.id}`

      const ws = new WebSocket(wsUrl)
      socketRef.current = ws

      ws.onopen = () => {
        // console.log('WebSocket Connected')
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (message.type === 'notification' || message.title) {
            toast.info(message.title || '收到新通知', {
              description: message.content,
            })
            window.dispatchEvent(new Event('notification-updated'))
          }
        } catch (e) {
          console.error('WebSocket message parse error', e)
        }
      }

      ws.onclose = () => {
        socketRef.current = null
        // Reconnect after 5 seconds
        if (user) {
          reconnectTimerRef.current = setTimeout(connectWebSocket, 5000)
        }
      }

      ws.onerror = (error) => {
        // console.error('WebSocket Error:', error)
        ws.close()
      }
    }

    if (user) {
      connectWebSocket()
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
    }
  }, [user])


  if (isLoading) {
    return <FullScreenLoader />
  }

  return <>{children}</>
}

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthLoader>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </AuthLoader>
    </Provider>
  )
}
