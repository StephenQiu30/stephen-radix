import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { BasicLayout } from '@/components/layout/basic-layout'
import { Footer } from '@/components/layout/footer'
import React from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <BasicLayout>
            {children}
            <Footer />
          </BasicLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
