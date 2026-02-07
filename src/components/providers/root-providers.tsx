'use client'

import * as React from 'react'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Provider } from 'react-redux'
import store from '@/store'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { clearLoginUser, setLoginUser } from '@/store/modules/user/userSlice'
import { getLoginUser } from '@/api/user/userController'

function InitUser() {
  const dispatch = useAppDispatch()

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
