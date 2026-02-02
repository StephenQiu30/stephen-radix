'use client'

import * as React from 'react'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Provider } from 'react-redux'
import store from '@/store'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { clearLoginUser, setLoginUser } from '@/store/modules/user/userSlice'
import { getLoginUser } from '@/api/userController'

function InitUser() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const res = (await getLoginUser()) as unknown as API.BaseResponseLoginUserVO
          if (res.code === 0 && res.data) {
            dispatch(setLoginUser(res.data))
          } else {
            dispatch(clearLoginUser())
          }
        } catch (error) {
          console.error('获取用户信息失败:', error)
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
