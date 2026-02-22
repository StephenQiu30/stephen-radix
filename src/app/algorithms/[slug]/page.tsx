import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import fs from 'fs'
import path from 'path'
import { Button } from '@/components/ui/button'
import { ALGORITHMS } from '@/lib/sorting-algorithms'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MarkdownRender, MarkdownToc } from '@/components/blog'
import { AlgorithmVisualizerWrapper } from '@/components/algorithms/algorithm-visualizer-wrapper'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function AlgorithmDetailPage({ params }: Props) {
  const { slug } = await params
  const algorithm = ALGORITHMS.find(a => a.id === slug)

  if (!algorithm) {
    notFound()
  }

  // Read markdown content
  const contentDirectory = path.join(process.cwd(), 'src/content/algorithms')
  const fullPath = path.join(contentDirectory, `${slug}.md`)

  let markdownContent = ''
  try {
    markdownContent = fs.readFileSync(fullPath, 'utf8')
  } catch (err) {
    // Fallback if file doesn't exist (though we created them)
    // console.error(`Failed to read markdown for ${slug}:`, err)
    markdownContent = `## 暂无详细介绍\n\n该算法的详细介绍暂未添加。`
  }

  return (
    <div className="bg-background selection:bg-primary/20 text-foreground min-h-screen pb-32 font-sans">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white/5">
            <Link href="/algorithms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回列表
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-muted-foreground mr-2 hidden sm:inline-block">算法可视化</span>
              <span className="text-white/20">/</span>
              <span className="text-foreground font-semibold">{algorithm.name}</span>
            </div>
          </div>
          <div className="flex w-[100px] justify-end">
            <AlgorithmVisualizerWrapper algorithmId={algorithm.id} />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-7xl px-6 py-12">
        <TooltipProvider>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px] xl:gap-24">
            <div className="mx-auto w-full max-w-4xl min-w-0 space-y-16">
              {/* Hero Section */}
              <div className="space-y-8 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  {algorithm.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 rounded-full px-4 py-1 text-sm font-medium backdrop-blur-md transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  <h1 className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text pb-2 text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
                    {algorithm.name}
                  </h1>

                  <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed font-light sm:text-xl">
                    {algorithm.description}
                  </p>
                </div>

                {/* Key Characteristics Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4 sm:gap-6">
                  <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardContent className="space-y-2 p-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-muted-foreground flex cursor-help items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                            平均时间 <Info className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>指在随机数据输入下算法预期的运行时间复杂度。</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="font-mono text-xl font-bold tracking-tight text-blue-500">
                        {algorithm.averageCase}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardContent className="space-y-2 p-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-muted-foreground flex cursor-help items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                            最坏时间 <Info className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>指在最不利数据输入下（如逆序）算法的运行时间复杂度。</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="font-mono text-xl font-bold tracking-tight text-red-500">
                        {algorithm.worstCase}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardContent className="space-y-2 p-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-muted-foreground flex cursor-help items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                            空间复杂度 <Info className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>算法执行过程中所需的额外内存空间。</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="font-mono text-xl font-bold tracking-tight text-purple-500">
                        {algorithm.spaceComplexity}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardContent className="space-y-2 p-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-muted-foreground flex cursor-help items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                            稳定性 <Info className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>稳定算法能保证两个相等元素的相对顺序在排序后保持不变。</p>
                        </TooltipContent>
                      </Tooltip>
                      <div
                        className={`text-xl font-bold tracking-tight ${algorithm.stable ? 'text-green-500' : 'text-orange-500'}`}
                      >
                        {algorithm.stable ? '稳定' : '不稳定'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Content Section with Glassmorphism */}
              <div className="prose-container relative">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 blur-3xl" />
                <Card className="bg-card/40 relative border-white/10 shadow-2xl shadow-black/5 backdrop-blur-xl">
                  <CardContent className="p-8 md:p-12">
                    <MarkdownRender content={markdownContent} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar TOC */}
            <aside className="relative hidden lg:block">
              <div className="sticky top-24">
                <MarkdownToc content={markdownContent} />
              </div>
            </aside>
          </div>
        </TooltipProvider>
      </main>
    </div>
  )
}
