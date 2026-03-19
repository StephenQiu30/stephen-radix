'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store'
import { toast } from 'sonner'
import { addPostComment } from '@/api/post/postCommentController'

import { UserAvatar } from '@/components/header/user-avatar'

interface CommentInputProps {
  postId: string
  parentId?: number
  onSuccess?: () => void
  onCancel?: () => void
  autoFocus?: boolean
  placeholder?: string
}

export function CommentInput({
  postId,
  parentId = 0,
  onSuccess,
  onCancel,
  autoFocus = false,
  placeholder = '写下你的评论见解...',
}: CommentInputProps) {
  const { user } = useAppSelector((state: RootState) => state.user)
  const [content, setContent] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    if (!user) {
      toast.error('请先登录')
      return
    }

    setSubmitting(true)
    try {
      const res = (await addPostComment({
        postId: postId as any,
        content,
        parentId,
      })) as unknown as PostAPI.BaseResponseLong
      if (res.code === 0) {
        toast.success('分享评论见解')
        setContent('')
        onSuccess?.()
      } else {
        toast.error(res.message || '分享失败')
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
      toast.error('评论发表失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <UserAvatar
          user={user}
          size="md"
          className="h-12 w-12 border-2 border-border/10 shadow-sm shrink-0"
        />
        <div className="flex-1 space-y-4">
          <div className="relative group">
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={placeholder}
              className="bg-card/40 border-border/10 focus:border-primary/30 focus:bg-background/90 focus:ring-0 min-h-[160px] resize-none rounded-[2rem] p-8 text-base shadow-sm transition-all duration-500 placeholder:text-foreground/10 placeholder:font-black leading-relaxed overflow-hidden"
              autoFocus={autoFocus}
            />
          </div>
          <div className="flex justify-end items-center gap-4">
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={submitting}
                className="text-foreground/40 hover:text-foreground hover:bg-muted/50 rounded-full px-6 h-10 font-bold transition-all"
              >
                取消
              </Button>
            )}
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!content.trim() || submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 h-14 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all font-black tracking-tight"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  见解同步中
                </>
              ) : (
                <>
                  发布见解
                  <Send className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
