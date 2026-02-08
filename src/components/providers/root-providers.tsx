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

function InitUser() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const [socket, setSocket] = useState<WebSocket | null>(null)

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
      }
    }
    fetchCurrentUser()
  }, [dispatch])

  // WebSocket Connection Logic
  useEffect(() => {
    if (user && !socket) {
      // Determine WebSocket URL based on current environment
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = process.env.NEXT_PUBLIC_API_BASE_URL
        ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).host
        : 'localhost:8080'
      const wsUrl = `${protocol}//${host}/api/ws/notification/${user.id}`

      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('WebSocket Connected')
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          // Assume message structure: { type: 'notification', data: { title, content } }
          if (message.type === 'notification' || message.title) {
            toast.info(message.title || '收到新通知', {
              description: message.content,
            })
            // Dispatch event to update unread count (can use a custom event or Redux action)
            window.dispatchEvent(new Event('notification-updated'))
          }
        } catch (e) {
          console.error('WebSocket message parse error', e)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket Disconnected')
        setSocket(null)
      }

      setSocket(ws)

      return () => {
        ws.close()
      }
    } else if (!user && socket) {
      socket.close()
      setSocket(null)
    }
  }, [user, socket])

  return null
}

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitUser />
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        {children}
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </Provider>
  )
}
