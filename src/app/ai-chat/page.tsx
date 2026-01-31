'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  MessageSquare,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// 动画变体
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
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

export default function AIChatLandingPage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0])
  const scale1 = useTransform(scrollY, [0, 300], [1, 0.95])

  // GSAP 数字动画
  const statsRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (statsRef.current) {
      gsap.from(statsRef.current.children, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          once: true,
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      })
    }
  }, [])

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: '智能对话',
      description: '基于最先进的大语言模型，理解自然语言，提供准确回答',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: '即时响应',
      description: '毫秒级响应速度，流畅的对话体验，无需等待',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: '安全可靠',
      description: '端到端加密，保护您的隐私和数据安全，符合安全标准',
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: '持续学习',
      description: '不断优化模型，提供更智能的服务，越用越好用',
    },
  ]

  const benefits = [
    { label: '24/7 可用', icon: <Clock className="h-5 w-5" /> },
    { label: '多语言支持', icon: <Users className="h-5 w-5" /> },
    { label: '轻松集成', icon: <CheckCircle2 className="h-5 w-5" /> },
  ]

  // 模拟对话数据
  const conversations = [
    {
      role: 'user' as const,
      content: '你好，能帮我写一段 Python 代码吗？',
    },
    {
      role: 'assistant' as const,
      content: '当然可以！我很乐意帮你编写 Python 代码。请告诉我你需要实现什么功能？',
    },
    {
      role: 'user' as const,
      content: '我需要一个计算器程序',
    },
    {
      role: 'assistant' as const,
      content:
        '好的！这是一个简单的 Python 计算器程序：\n\n```python\ndef calculator():\n    print("简单计算器")\n    num1 = float(input("第一个数字: "))\n    num2 = float(input("第二个数字: "))\n    \n    print("\n选择运算:")\n    print("1. 加法")\n    print("2. 减法")\n    print("3. 乘法")\n    print("4. 除法")\n    \n    choice = input("输入选择(1/2/3/4): ")\n    \n    if choice == \'1\':\n        print(num1, "+", num2, "=", num1 + num2)\n    elif choice == \'2\':\n        print(num1, "-", num2, "=", num1 - num2)\n    elif choice == \'3\':\n        print(num1, "*", num2, "=", num1 * num2)\n    elif choice == \'4\':\n        print(num1, "/", num2, "=", num1 / num2)\n    else:\n        print("无效输入")\n\ncalculator()\n```\n\n这个程序支持基本的四则运算。你可以根据需要扩展更多功能！',
    },
  ]

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-b">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="bg-primary/5 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="bg-primary/5 absolute right-1/4 bottom-0 h-96 w-96 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 4,
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl">
          <motion.div
            className="space-y-8 text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex">
              <div className="bg-primary/10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <Sparkles className="text-primary h-4 w-4" />
                <span className="font-medium">AI 驱动的下一代对话体验</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl leading-[1.1] font-bold tracking-tight md:text-7xl lg:text-8xl"
            >
              重新定义
              <br />
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                人机对话
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed md:text-2xl"
            >
              强大的 AI 助手，随时为您服务。智能、快速、安全，让沟通变得更加简单。
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button size="lg" className="h-14 gap-2 rounded-full px-8 text-lg" asChild>
                <Link href="/editor">
                  立即体验 <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full px-8 text-lg"
                asChild
              >
                <Link href="#features">了解更多</Link>
              </Button>
            </motion.div>

            {/* Benefits */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-6 pt-8"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span className="text-primary">{benefit.icon}</span>
                  <span>{benefit.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Demo Preview */}
          <motion.div className="mt-20" style={{ y: y1, opacity: opacity1, scale: scale1 }}>
            <Card className="mx-auto max-w-3xl overflow-hidden border-2 shadow-2xl">
              <div className="bg-muted/30 flex items-center gap-2 border-b px-6 py-4">
                <Bot className="text-primary h-5 w-5" />
                <span className="font-semibold">AI 助手演示</span>
              </div>
              <CardContent className="p-0">
                <div className="max-h-96 space-y-4 overflow-y-auto p-6">
                  {conversations.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-6 py-3 ${
                          msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">为什么选择我们</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              我们致力于提供最优秀的 AI 对话体验
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="hover:border-primary/50 h-full border-2 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-primary mb-6">{feature.icon}</div>
                    <h3 className="mb-4 text-2xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div ref={statsRef} className="grid gap-12 text-center md:grid-cols-3">
            <div>
              <div className="text-primary mb-2 text-5xl font-bold md:text-6xl">99.9%</div>
              <div className="text-muted-foreground">可用性</div>
            </div>
            <div>
              <div className="text-primary mb-2 text-5xl font-bold md:text-6xl">100K+</div>
              <div className="text-muted-foreground">活跃用户</div>
            </div>
            <div>
              <div className="text-primary mb-2 text-5xl font-bold md:text-6xl">10M+</div>
              <div className="text-muted-foreground">对话次数</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-32">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="space-y-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">准备好开始了吗？</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              加入成千上万的用户，体验 AI 带来的革命性变化
            </p>
            <Button size="lg" className="h-14 gap-2 rounded-full px-8 text-lg" asChild>
              <Link href="/editor">
                免费开始使用 <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
