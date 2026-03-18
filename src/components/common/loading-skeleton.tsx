'use client'

import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
    type?: 'grid' | 'list'
    count?: number
    className?: string
}

export function LoadingSkeleton({ type = 'grid', count = 8, className }: LoadingSkeletonProps) {
    if (type === 'list') {
        return (
            <div className={cn('space-y-4', className)}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted/20 border border-border/10 flex gap-3 rounded-[20px] p-4 backdrop-blur-sm">
                        <Skeleton className="h-9 w-9 shrink-0 rounded-[10px] bg-muted/40" />
                        <div className="flex-1 space-y-3 pt-0.5">
                            <div className="flex justify-between items-center pr-2">
                                <Skeleton className="h-4 w-1/4 rounded-full bg-muted/40" />
                                <Skeleton className="h-2.5 w-8 rounded-full bg-muted/20" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3.5 w-full rounded-full bg-muted/30" />
                                <Skeleton className="h-3.5 w-4/5 rounded-full bg-muted/30" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div
            className={cn(
                'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                className
            )}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
