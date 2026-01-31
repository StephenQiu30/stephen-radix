'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, BarChart3, Code2, Cpu, GitBranch, Layers, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import SortingVisualizer from '@/components/algorithms/sorting-visualizer'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function AlgorithmLandingPage() {
  const { scrollY } = useScroll()
  const yHero = useTransform(scrollY, [0, 500], [0, 150])
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scale = useSpring(useTransform(scrollY, [0, 500], [1, 0.9]), springConfig)

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
      title: '可视化学习',
      description: '通过精美的交互式动画，直观理解复杂的排序逻辑。',
      className: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20',
    },
    {
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      title: '实时处理',
      description: '在浏览器中即时观看算法排序过程。',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20',
    },
    {
      icon: <GitBranch className="h-6 w-6 text-green-500" />,
      title: '经典算法',
      description: '掌握冒泡排序、快速排序、归并排序等核心算法。',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20',
    },
    {
      icon: <Layers className="h-6 w-6 text-purple-500" />,
      title: '复杂度分析',
      description: '调整数据集大小和速度，直观对比不同算法的性能差异。',
      className: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20',
    },
  ]

  return (
    <div className="bg-background selection:bg-primary/20 min-h-screen overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 pt-32 pb-20 md:pt-48">
        {/* Background Gradients - Subtle Apple Style */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-blue-400/10 opacity-50 blur-[120px]" />
          <div className="absolute top-[-10%] right-[20%] h-[50vw] w-[50vw] rounded-full bg-indigo-400/10 opacity-50 blur-[120px]" />
        </div>

        <motion.div
          style={{ y: yHero, opacity: opacityHero, scale }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center"
        >
          <motion.div variants={fadeInUp}>
            <span className="bg-background/80 text-foreground/80 inline-flex items-center gap-2 rounded-full border border-black/5 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-md dark:border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              <span>算法可视化大师</span>
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-8 text-6xl leading-[1.05] font-semibold tracking-tighter text-black md:text-8xl lg:text-9xl dark:text-white"
          >
            排序算法。
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text pb-2 text-transparent">
              直观呈现。
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mt-8 max-w-2xl text-xl leading-relaxed font-medium md:text-2xl"
          >
            体验计算机科学的优雅与美感。
            <br className="hidden md:block" />
            通过交互式动画，深入理解核心算法逻辑。
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full bg-black px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              asChild
            >
              <Link href="#visualizer">开始体验</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-black/10 bg-transparent px-8 text-base font-medium backdrop-blur-sm transition-all hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              asChild
            >
              <Link href="https://github.com/stephenqiu/stephen-radix" target="_blank">
                查看源码
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Visualizer Section */}
      <section id="visualizer" className="relative z-20 -mt-12 px-4 pb-32 md:-mt-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <SortingVisualizer />
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="bg-secondary/20 relative px-6 py-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <h2 className="text-4xl font-semibold tracking-tighter md:text-6xl">
              为何使用可视化？
            </h2>
            <p className="text-muted-foreground mt-4 text-xl md:text-2xl">
              让枯燥的代码变得鲜活生动。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl dark:border-white/5 dark:bg-black/20',
                  feature.className
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                    feature.bg
                  )}
                />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-white/10">
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-2xl font-semibold tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / Parallax Section */}
      <section className="overflow-hidden px-6 py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="grid items-center gap-20 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/50 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Code2 className="h-4 w-4" />
                  <span>开发者优先</span>
                </div>
                <h2 className="text-4xl font-semibold tracking-tighter md:text-6xl">
                  为学生和专业人士 <br />
                  <span className="text-muted-foreground">精心打造。</span>
                </h2>
                <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                  无论您是在学习计算机主要课程，还是在分析算法效率，我们的工具都能为您提供所需的清晰度。
                </p>

                <ul className="space-y-4 pt-4">
                  {[
                    { icon: Cpu, text: '算法效率分析' },
                    { icon: Layers, text: '逐步可视化演示' },
                    { icon: Sparkles, text: '现代简洁的界面' },
                  ].map((Item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 text-lg font-medium"
                    >
                      <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-full">
                        <Item.icon className="h-5 w-5" />
                      </div>
                      {Item.text}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border border-black/5 bg-gradient-to-tr from-gray-50 to-white p-8 shadow-2xl dark:border-white/10 dark:from-gray-900 dark:to-black">
                <div className="bg-grid-black/[0.02] dark:bg-grid-white/[0.02] absolute inset-0" />
                <div className="relative z-10 w-full max-w-sm rounded-xl bg-gray-900 p-6 shadow-2xl">
                  <div className="mb-4 flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="font-mono text-xs leading-relaxed text-blue-300">
                    <p className="text-purple-400">
                      const<span className="text-white"> bubbleSort</span> ={' '}
                      <span className="text-yellow-400">async</span> (arr) =&gt; {'{'}
                    </p>
                    <p className="pl-4">let swapped;</p>
                    <p className="pl-4">do {'{'}</p>
                    <p className="pl-8">
                      swapped = <span className="text-red-400">false</span>;
                    </p>
                    <p className="pl-8">for (let i = 0; i &lt; arr.length - 1; i++) {'{'}</p>
                    <p className="pl-12">if (arr[i] &gt; arr[i + 1]) {'{'}</p>
                    <p className="pl-16">let temp = arr[i];</p>
                    <p className="pl-16">arr[i] = arr[i + 1];</p>
                    <p className="pl-16">arr[i + 1] = temp;</p>
                    <p className="pl-16">
                      swapped = <span className="text-green-400">true</span>;
                    </p>
                    <p className="pl-12">{'}'}</p>
                    <p className="pl-8">{'}'}</p>
                    <p className="pl-4">{'}'} while (swapped);</p>
                    <p>{'}'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-40">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-semibold tracking-tighter md:text-7xl">
              准备好学习了吗？
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl font-medium md:text-2xl">
              立即使用我们的交互式工具，开始可视化排序算法。
            </p>
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                size="lg"
                className="h-16 rounded-full px-12 text-xl font-semibold shadow-2xl transition-transform hover:scale-105"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                开始排序 <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
