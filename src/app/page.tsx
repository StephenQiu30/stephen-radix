'use client'

import * as React from 'react'
import { MessageSquare, Sparkles, Zap, Brain, Shield, Globe, ArrowRight, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// 注册 GSAP 插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// 动画变体配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export default function Home() {
  const [animatedText, setAnimatedText] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [userCount, setUserCount] = React.useState(0)
  const [messageCount, setMessageCount] = React.useState(0)
  const statsRef = React.useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0])

  const fullText = '你好！我是AI助手，有什么可以帮助你的吗？'

  // GSAP 数字滚动动画
  useGSAP(() => {
    if (statsRef.current) {
      gsap.to(statsRef.current, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          once: true,
        },
        onComplete: () => {
          gsap.to(
            {},
            {
              duration: 2,
              onUpdate: function () {
                const progress = this.progress()
                setUserCount(Math.floor(progress * 10000))
                setMessageCount(Math.floor(progress * 10000000))
              },
            }
          )
        },
      })
    }
  }, [])

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    let index = 0

    const startTyping = () => {
      setIsTyping(true)
      setAnimatedText('')
      index = 0

      const typeNextChar = () => {
        if (index < fullText.length) {
          setAnimatedText(fullText.slice(0, index + 1))
          index++
          timeout = setTimeout(typeNextChar, 50)
        } else {
          setIsTyping(false)
        }
      }

      typeNextChar()
    }

    startTyping()
    const interval = setInterval(startTyping, 5000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: '智能对话',
      description: '基于先进的大语言模型，理解自然语言，提供准确回答',
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: '创意生成',
      description: '生成文本、代码、图像等多种创意内容',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: '即时响应',
      description: '毫秒级响应速度，流畅的交互体验',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: '安全可靠',
      description: '端到端加密，保护您的隐私和数据安全',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: '多语言支持',
      description: '支持100+种语言，打破语言障碍',
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: '持续学习',
      description: '不断优化模型，提供更智能的服务',
    },
  ]

  const messages = [
    { role: 'user', content: '帮我写一段代码' },
    { role: 'assistant', content: '当然！请告诉我你想要实现什么功能？' },
    { role: 'user', content: '一个简单的待办事项应用' },
    { role: 'assistant', content: '好的，我来帮你创建一个待办事项应用...' },
  ]

  return (
    <div className="from-background via-background to-primary/5 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="mb-20 grid items-center gap-12 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-8" style={{ y: y1, opacity: opacity1 }}>
            <motion.div
              className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Sparkles className="h-4 w-4" />
              全新AI助手上线
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tight md:text-6xl"
              variants={itemVariants}
            >
              下一代{' '}
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                AI聊天平台
              </span>
            </motion.h1>

            <motion.p className="text-muted-foreground max-w-lg text-xl" variants={itemVariants}>
              体验最先进的AI助手，智能对话、创意生成、问题解决，一切尽在掌握
            </motion.p>

            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <Button size="lg" className="gap-2 px-8 text-lg" asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  现在试用
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-lg" asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  了解更多
                </motion.button>
              </Button>
            </motion.div>

            <motion.div className="flex items-center gap-6 pt-4" variants={itemVariants}>
              <motion.div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i, idx) => (
                  <motion.div
                    key={i}
                    className="from-primary to-primary/60 border-background flex h-10 w-10 items-center justify-center rounded-full border-2 bg-gradient-to-br text-sm font-medium text-white"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {i}
                  </motion.div>
                ))}
              </motion.div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.span
                      key={i}
                      className="text-yellow-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">10,000+ 用户信赖</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="from-primary/20 to-primary/5 absolute -inset-4 rounded-2xl bg-gradient-to-r blur-2xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="relative border-2 shadow-2xl">
                <CardHeader className="from-primary/10 to-primary/5 border-b bg-gradient-to-r">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Bot className="text-primary h-5 w-5" />
                    </motion.div>
                    <CardTitle className="text-lg">AI助手</CardTitle>
                    <motion.span
                      className="ml-auto rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-500"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      在线
                    </motion.span>
                  </div>
                </CardHeader>
                <CardContent className="h-80 space-y-4 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + idx * 0.2, duration: 0.4 }}
                      >
                        <motion.div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </motion.div>
                      </motion.div>
                    ))}
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                    >
                      <div className="bg-primary/10 border-primary/20 max-w-[80%] rounded-2xl border-2 px-4 py-3">
                        <p className="text-sm">
                          {animatedText}
                          {isTyping && (
                            <span className="bg-primary ml-1 inline-block h-4 w-2 animate-pulse" />
                          )}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="输入消息..."
                      className="bg-muted focus:ring-primary flex-1 rounded-lg border-0 px-4 py-2 focus:ring-2 focus:outline-none"
                      disabled
                    />
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div className="mb-12 text-center" variants={itemVariants}>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">强大的AI功能</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              集成最新AI技术，为您提供全方位的智能服务
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="group hover:border-primary/50 h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <motion.div
                      className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, type: 'spring' }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="space-y-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          ref={statsRef}
        >
          <motion.h2 className="text-3xl font-bold md:text-4xl" variants={itemVariants}>
            准备好开始了吗？
          </motion.h2>
          <motion.p
            className="text-muted-foreground mx-auto max-w-2xl text-lg"
            variants={itemVariants}
          >
            加入数万用户，体验AI带来的革命性变化
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-4" variants={itemVariants}>
            <Button size="lg" className="gap-2 px-8 py-6 text-lg" asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Sparkles className="h-5 w-5" />
                免费开始使用
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 pt-8"
            variants={itemVariants}
          >
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-primary text-3xl font-bold">
                {messageCount > 0 ? `${(messageCount / 1000000).toFixed(1)}M` : '10M+'}
              </div>
              <div className="text-muted-foreground text-sm">消息处理</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-primary text-3xl font-bold">99.9%</div>
              <div className="text-muted-foreground text-sm">可用性</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-primary text-3xl font-bold">100+</div>
              <div className="text-muted-foreground text-sm">语言支持</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
