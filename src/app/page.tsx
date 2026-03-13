'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, BookOpen, ChevronRight, Code2, Cpu, Globe, Layout, MessageSquare, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  const { scrollY } = useScroll()
  const yHero = useTransform(scrollY, [0, 500], [0, 100])
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scale = useSpring(useTransform(scrollY, [0, 500], [1, 0.95]), springConfig)

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      title: '深度博客',
      description: '分享前沿技术、架构设计与工程实践，沉淀技术思考。',
      className: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30',
      href: '/blog',
    },
    {
      icon: <Layout className="h-6 w-6 text-emerald-500" />,
      title: '极简设计',
      description: '采用现代化的设计语言，提供极致的阅读与交互体验。',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30',
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-orange-500" />,
      title: '智能助手',
      description: '集成 AI 服务，为您提供智能化的内容推荐与问答支持。',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30',
    },
    {
      icon: <Globe className="h-6 w-6 text-purple-500" />,
      title: '全栈生态',
      description: '从前端的极致体验到后端的分布式架构，全方位展示现代 Web 开发。',
      className: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30',
    },
  ]

  return (
    <div className="bg-background min-h-screen overflow-x-hidden font-sans selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-20">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[10%] h-[70vw] w-[70vw] rounded-full bg-primary/5 opacity-40 blur-[120px] filter" />
          <div className="absolute bottom-[-10%] right-[10%] h-[50vw] w-[50vw] rounded-full bg-indigo-500/5 opacity-40 blur-[120px] filter" />
        </div>

        <motion.div
          style={{ y: yHero, opacity: opacityHero, scale }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/50 px-4 py-1.5 text-sm font-medium text-black/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Stephen Radix v2.0</span>
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-8 text-6xl font-bold tracking-tight text-foreground md:text-8xl lg:text-9xl"
          >
            探索技术。<br />
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text pb-2 text-transparent">
              链接未来。
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mt-8 max-w-2xl text-xl leading-relaxed font-medium md:text-2xl"
          >
            沉淀、分享、成长。
            <br className="hidden md:block" />
            在代码与灵感的交汇处，发现更多可能。
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-14 rounded-full bg-foreground px-10 text-lg font-semibold text-background shadow-xl transition-all hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="/blog">
                开始阅读 <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-foreground/10 bg-background/50 px-10 text-lg font-semibold backdrop-blur-md transition-all hover:bg-foreground/5 active:scale-95"
              asChild
            >
              <Link href="/user/profile">关于我</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Sections */}
      <section className="relative px-6 py-32 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl text-foreground">核心驱动。</h2>
            <p className="text-muted-foreground mt-6 text-xl font-medium md:text-2xl">
              为您打造极致的数字化体验。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={cn(
                  'group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 shadow-sm transition-all duration-500 hover:shadow-2xl',
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
                  <div className="space-y-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold tracking-tight text-foreground">{feature.title}</h3>
                      <p className="mt-4 text-muted-foreground text-lg leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  {feature.href && (
                    <div className="mt-10">
                      <Link 
                        href={feature.href}
                        className="inline-flex items-center text-primary font-bold hover:underline"
                      >
                        了解更多 <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Technical Showcase */}
      <section className="px-6 py-40 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-center gap-24 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                <Code2 className="h-4 w-4" />
                <span>技术架构</span>
              </div>
              <h2 className="text-5xl font-bold tracking-tight md:text-7xl leading-[1.1]">
                现代、可靠、<br />
                <span className="text-muted-foreground/60">可扩展。</span>
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                基于 Next.js 15 和 Spring Cloud 微服务架构，构建高性能、高可用的全栈应用流程。
              </p>

              <div className="grid gap-8 pt-6">
                {[
                  { icon: Zap, title: '极致性能', desc: '服务端渲染、边缘计算、毫秒级响应。' },
                  { icon: Cpu, title: '分布式架构', desc: '容器化部署，跨服务治理。' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="bg-primary/5 p-4 rounded-2xl">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{item.title}</h4>
                      <p className="mt-2 text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-[3.5rem] bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent p-1 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="h-full w-full rounded-[3.4rem] bg-card flex items-center justify-center p-12 relative overflow-hidden">
                  <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 bg-primary/10 blur-[100px] rounded-full" />
                  <div className="relative z-10 w-full font-mono text-sm space-y-4">
                    <div className="flex gap-2 mb-8">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-primary font-bold">@Service</p>
                    <p className="text-foreground/80"><span className="text-primary/60">public class</span> <span className="text-blue-500 font-bold">StephenRadix</span> {'{'}</p>
                    <p className="pl-6 text-foreground/70"><span className="text-primary/60">private final</span> <span className="text-purple-500">Innovation</span> vision;</p>
                    <p className="pl-6 text-foreground/70"><span className="text-primary/60">private final</span> <span className="text-purple-500">Quality</span> standard;</p>
                    <p className="pl-6">&nbsp;</p>
                    <p className="pl-6 text-foreground/80"><span className="text-primary/60">public void</span> <span className="text-blue-500 font-bold">deliverValue</span>() {'{'}</p>
                    <p className="pl-12 text-foreground/70"><span className="text-emerald-500 font-bold">vision</span>.accelerate();</p>
                    <p className="pl-12 text-foreground/70"><span className="text-emerald-500 font-bold">standard</span>.exceed();</p>
                    <p className="pl-6 text-foreground/80">{'}'}</p>
                    <p className="text-foreground/80">{'}'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-40">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-6xl font-bold tracking-tight md:text-8xl">开启深度阅读。</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl font-medium md:text-2xl">
              加入 50,000+ 开发者，获取最新的技术动态与深度见解。
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="h-20 rounded-full px-16 text-2xl font-bold shadow-2xl hover:scale-105 transition-all"
                asChild
              >
                <Link href="/blog">
                  阅读博客 <ArrowRight className="ml-3 h-8 w-8" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
