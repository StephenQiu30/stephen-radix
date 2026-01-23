import Link from 'next/link'
import { ArrowRight, BarChart3, FileText, Settings, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <Zap className="h-4 w-4" />
            欢迎使用 Stephen Radix
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            现代化响应式
            <span className="text-primary"> 前端解决方案</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
            基于 Next.js、React、Radix UI 和 shadcn/ui Yellow 主题构建的完整前端项目架构。
            提供开箱即用的布局、组件和状态管理。
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/dashboard">
                开始使用
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">查看文档</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">核心特性</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            完整的前端解决方案，包含现代化的 UI 组件和响应式布局
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature Cards */}
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="数据统计"
            description="强大的数据可视化和分析工具，帮助你深入了解业务指标"
            href="/analytics"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="用户管理"
            description="完整的用户管理系统，支持认证、授权和角色管理"
            href="/users"
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8" />}
            title="内容管理"
            description="灵活的文章和内容管理系统，支持富文本和媒体文件"
            href="/articles"
          />
          <FeatureCard
            icon={<Settings className="h-8 w-8" />}
            title="系统设置"
            description="全面的系统配置选项，轻松自定义应用行为和外观"
            href="/settings"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="高性能"
            description="基于 Next.js 16 和 React 19，提供极致的性能表现"
            href="/docs"
          />
          <FeatureCard
            icon={<div className="h-8 w-8 rounded bg-yellow-400" />}
            title="Yellow 主题"
            description="精美的 shadcn/ui Yellow 主题，支持亮色和暗色模式切换"
            href="/docs"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <StatCard number="99.9%" label="系统可用性" />
          <StatCard number="10k+" label="活跃用户" />
          <StatCard number="50+" label="UI 组件" />
          <StatCard number="24/7" label="技术支持" />
        </div>
      </section>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group bg-card cursor-pointer rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="text-primary mb-4 transition-transform group-hover:scale-110">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  )
}

interface StatCardProps {
  number: string
  label: string
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-primary mb-2 text-3xl font-bold md:text-4xl">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  )
}
