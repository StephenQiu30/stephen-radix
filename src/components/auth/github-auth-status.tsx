'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, CheckCircle2, ArrowRight, RefreshCw, Command } from 'lucide-react'
import Link from 'next/link'

interface GitHubAuthStatusProps {
    status: 'loading' | 'success' | 'error'
    message: string
    progress: number
    onRetry?: () => void
}

export function GitHubAuthStatus({
    status,
    message,
    progress,
    onRetry,
}: GitHubAuthStatusProps) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F5F7] p-4 text-[#1D1D1F] dark:bg-[#000000] dark:text-[#F5F5F7]">
            {/* 动态背景光效 */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="relative z-10 w-full max-w-[420px]"
            >
                <Card className="relative overflow-hidden border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/60 rounded-[32px]">
                    <div className="flex flex-col items-center p-10 text-center">

                        {/* Logo 连接区域 */}
                        <div className="relative mb-10 flex w-full items-center justify-center gap-6">
                            {/* GitHub Avatar */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Avatar className="h-20 w-20 rounded-[22px] shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                                    <AvatarFallback className="bg-[#24292f] text-white text-2xl">
                                        <Github className="h-10 w-10" />
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>

                            {/* 连接进度条 */}
                            <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                                <motion.div
                                    className={`absolute inset-y-0 left-0 rounded-full transition-colors duration-500 ${status === 'error' ? 'bg-red-500' :
                                            status === 'success' ? 'bg-[#34C759]' : 'bg-[#0071E3]'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeInOut" }}
                                />
                            </div>

                            {/* App Avatar */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Avatar className="h-20 w-20 rounded-[22px] shadow-lg ring-1 ring-black/5 dark:ring-white/10 bg-gradient-to-br from-blue-500 to-indigo-600">
                                    <AvatarFallback className="bg-transparent text-white">
                                        <Command className="h-10 w-10" />
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>

                            {/* 状态图标覆盖 */}
                            <AnimatePresence>
                                {status === 'success' && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black rounded-full p-1 shadow-sm"
                                    >
                                        <CheckCircle2 className="h-6 w-6 text-[#34C759] fill-current" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 状态文本 */}
                        <motion.div
                            layout
                            className="space-y-3 mb-8"
                        >
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {status === 'loading' ? '正在连接 GitHub...' :
                                    status === 'success' ? '验证成功' : '验证失败'}
                            </h2>
                            <p className="text-[15px] font-medium text-black/50 dark:text-white/50">
                                {message}
                            </p>
                        </motion.div>

                        {/* 操作按钮 */}
                        <AnimatePresence mode="wait">
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col gap-3 w-full"
                                >
                                    <Button
                                        onClick={onRetry}
                                        className="h-12 w-full rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-[15px] shadow-sm hover:shadow-md transition-all active:scale-95"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        重试连接
                                    </Button>
                                    <Link href="/" className="w-full">
                                        <Button
                                            variant="ghost"
                                            className="h-12 w-full rounded-2xl text-[15px] font-medium hover:bg-black/5 dark:hover:bg-white/10"
                                        >
                                            返回首页
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex justify-center"
                                >
                                    <div className="h-10 w-10 rounded-full border-2 border-[#34C759] border-t-transparent animate-spin" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>

            {/* 底部版权信息 - Apple Style */}
            <div className="absolute bottom-8 text-center text-xs font-medium text-black/30 dark:text-white/30">
                <p>&copy; 2026 Stephen Radix. All rights reserved.</p>
                <p className="mt-1 flex gap-4 justify-center">
                    <span>Privacy</span>
                    <span>Terms</span>
                </p>
            </div>
        </div>
    )
}
