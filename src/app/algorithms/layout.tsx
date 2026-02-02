import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '算法可视化 - Stephen Radix',
  description: '通过精美的交互式动画，深入探索经典排序算法的运行机制。',
}

export default function AlgorithmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
