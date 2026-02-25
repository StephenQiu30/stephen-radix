'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Provider } from 'react-redux'
import store from '@/store'
import { toast, Toaster } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearLoginUser, setLoginUser } from '@/store/modules/user/userSlice'
import { getLoginUser } from '@/api/user/userController'
import { FullScreenLoader } from '@/components/common/full-screen-loader'

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
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
  const heartbeatTimerRef = React.useRef<NodeJS.Timeout>(null)

  useEffect(() => {
    const connectWebSocket = () => {
      if (!user) return

      // Determine WebSocket URL - Notifications are on port 9090 via Netty
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const hostname = process.env.NEXT_PUBLIC_API_BASE_URL
        ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).hostname
        : 'localhost'
      const wsUrl = `${protocol}//${hostname}:9090/websocket`

      const ws = new WebSocket(wsUrl)
      socketRef.current = ws

      ws.onopen = () => {
        // Send Auth message immediately after connection
        const token = localStorage.getItem('token')
        if (token && user.id) {
          ws.send(
            JSON.stringify({
              type: 0, // AUTH
              userId: user.id,
              token: token,
            })
          )
        }

        // Start heartbeat - every 30 seconds
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current)
        heartbeatTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 1 })) // HEARTBEAT
          }
        }, 30000)
      }

      ws.onmessage = event => {
        try {
          const message = JSON.parse(event.data)
          // Handle notification messages from backend
          // The backend might push SYSTEM_NOTICE(3), COMMENT_NOTICE(4), etc.
          // Or a simplified structure. Based on current card logic, we emit update event.
          if (message.type >= 3 && message.type <= 7) {
            toast.info(message.title || '新通知', {
              description: message.content || message.data,
            })
            window.dispatchEvent(new Event('notification-updated'))
          } else if (message.type === 0 && message.data === '认证成功') {
            // Auth success - can log if needed
          }
        } catch (e) {
          console.error('WebSocket message parse error', e)
        }
      }

      ws.onclose = () => {
        socketRef.current = null
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current)
          heartbeatTimerRef.current = null
        }
        // Reconnect after 5 seconds
        if (user) {
          reconnectTimerRef.current = setTimeout(connectWebSocket, 5000)
        }
      }

      ws.onerror = () => {
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
        reconnectTimerRef.current = null
      }
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current)
        heartbeatTimerRef.current = null
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
