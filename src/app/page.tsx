'use client'

import * as React from 'react'
import { MessageSquare, Sparkles, Zap, Brain, Shield, Globe, ArrowRight, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const [animatedText, setAnimatedText] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  
  const fullText = "你好！我是AI助手，有什么可以帮助你的吗？"
  
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
      description: '基于先进的大语言模型，理解自然语言，提供准确回答'
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: '创意生成',
      description: '生成文本、代码、图像等多种创意内容'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: '即时响应',
      description: '毫秒级响应速度，流畅的交互体验'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: '安全可靠',
      description: '端到端加密，保护您的隐私和数据安全'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: '多语言支持',
      description: '支持100+种语言，打破语言障碍'
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: '持续学习',
      description: '不断优化模型，提供更智能的服务'
    }
  ]
  
  const messages = [
    { role: 'user', content: '帮我写一段代码' },
    { role: 'assistant', content: '当然！请告诉我你想要实现什么功能？' },
    { role: 'user', content: '一个简单的待办事项应用' },
    { role: 'assistant', content: '好的，我来帮你创建一个待办事项应用...' }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              全新AI助手上线
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              下一代{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                AI聊天平台
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              体验最先进的AI助手，智能对话、创意生成、问题解决，一切尽在掌握
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 text-lg px-8">
                现在试用
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                了解更多
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-background flex items-center justify-center text-white text-sm font-medium"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">10,000+ 用户信赖</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-2xl" />
            <Card className="relative border-2 shadow-2xl">
              <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">AI助手</CardTitle>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                    在线
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 h-80 overflow-y-auto">
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-primary/10 border-2 border-primary/20">
                      <p className="text-sm">
                        {animatedText}
                        {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="输入消息..."
                    className="flex-1 px-4 py-2 rounded-lg bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled
                  />
                  <Button size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">强大的AI功能</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              集成最新AI技术，为您提供全方位的智能服务
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">准备好开始了吗？</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            加入数万用户，体验AI带来的革命性变化
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2 text-lg px-8 py-6">
              <Sparkles className="h-5 w-5" />
              免费开始使用
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10M+</div>
              <div className="text-sm text-muted-foreground">消息处理</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">可用性</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">语言支持</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
