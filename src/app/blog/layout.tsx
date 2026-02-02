import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文章与见解 - Stephen Radix',
  description: '探索来自我们团队和社区的最新更新、深度技术文章和开发教程。',
}

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
