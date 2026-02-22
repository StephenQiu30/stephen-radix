'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LoginPromptCardProps {
  onLoginClick: () => void
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function LoginPromptCard({
  onLoginClick,
  title = '开启您的专属空间',
  description = '登录解锁更多精彩内容',
  icon,
}: LoginPromptCardProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden">
      {/* 全屏模糊背景 */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        transition={{ duration: 0.8 }}
        className="bg-background/60 dark:bg-background/80 absolute inset-0"
      />

      {/* 中心内容 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        className="relative z-50 flex w-full max-w-lg flex-col items-center p-8 text-center"
      >
        <Card className="from-background via-secondary to-background border-border/50 relative w-full overflow-hidden bg-gradient-to-br shadow-xl transition-transform duration-500 group-hover:scale-105">
          <CardHeader className="flex flex-col items-center space-y-6 pt-10 pb-2">
            {/* 图标区域 */}
            <div className="group relative">
              <motion.div
                className="bg-primary/20 absolute inset-0 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              <div className="ring-border/50 bg-background/50 relative rounded-3xl p-6 ring-1 backdrop-blur-sm">
                {icon || <Lock className="text-primary h-10 w-10" />}
              </div>
              <motion.div
                className="absolute -top-3 -right-3 rounded-full bg-yellow-400/90 p-2 text-yellow-900 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            </div>

            {/* 标题与描述 */}
            <div className="space-y-2 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="from-foreground to-foreground/50 bg-gradient-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                  {title}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardDescription className="text-muted-foreground max-w-sm text-lg leading-relaxed font-medium">
                  {description}
                </CardDescription>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="pb-2">{/* Potential slot for extra content */}</CardContent>

          <CardFooter className="flex w-full flex-col gap-4 p-8 pt-4 sm:flex-row">
            <Button
              onClick={onLoginClick}
              size="lg"
              className="shadow-primary/20 hover:shadow-primary/40 h-12 w-full rounded-full border-none bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105"
            >
              立即登录
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Link href="/" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="border-border/50 bg-background/50 hover:bg-secondary/80 h-12 w-full rounded-full backdrop-blur-sm transition-all hover:scale-105"
              >
                返回首页
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
