'use client'

import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { BasicLayout } from '@/components/layout/basic-layout'
import { Footer } from '@/components/footer/footer'
import React from 'react'
import { Provider } from 'react-redux'
import store from '@/store'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            <BasicLayout>
              {children}
              <Footer />
            </BasicLayout>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}
