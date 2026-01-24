import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { BasicLayout } from '@/components/layout/basic-layout'
import { Footer } from '@/components/layout/footer'
import { StoreProvider } from '@/components/providers/store-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            <BasicLayout>
              {children}
              <Footer />
            </BasicLayout>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
