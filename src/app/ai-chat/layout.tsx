import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 助手 - Stephen Radix',
  description: '您的智能编程与学习助手。',
}

export default function AIChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
