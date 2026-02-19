'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Lock, ArrowRight, Sparkles } from 'lucide-react'
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
                className="absolute inset-0 bg-background/60 dark:bg-background/80"
            />

            {/* 中心内容 */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
                className="relative z-50 flex flex-col items-center text-center p-8 max-w-lg w-full"
            >
                <Card className="relative bg-gradient-to-br from-background via-secondary to-background border-border/50 shadow-xl group-hover:scale-105 transition-transform duration-500 w-full overflow-hidden">
                    <CardHeader className="flex flex-col items-center space-y-6 pt-10 pb-2">
                        {/* 图标区域 */}
                        <div className="relative group">
                            <motion.div
                                className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            />
                            <div className="relative p-6 rounded-3xl ring-1 ring-border/50 bg-background/50 backdrop-blur-sm">
                                {icon || <Lock className="w-10 h-10 text-primary" />}
                            </div>
                            <motion.div
                                className="absolute -top-3 -right-3 bg-yellow-400/90 text-yellow-900 p-2 rounded-full shadow-lg"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                            >
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        </div>

                        {/* 标题与描述 */}
                        <div className="text-center space-y-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <CardTitle className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                                    {title}
                                </CardTitle>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <CardDescription className="text-lg text-muted-foreground max-w-sm leading-relaxed font-medium">
                                    {description}
                                </CardDescription>
                            </motion.div>
                        </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                        {/* Potential slot for extra content */}
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-4 w-full p-8 pt-4">
                        <Button
                            onClick={onLoginClick}
                            size="lg"
                            className="w-full h-12 text-base font-semibold rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 border-none"
                        >
                            立即登录
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        <Link href="/" className="w-full">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full h-12 rounded-full border-border/50 bg-background/50 hover:bg-secondary/80 backdrop-blur-sm transition-all hover:scale-105"
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
