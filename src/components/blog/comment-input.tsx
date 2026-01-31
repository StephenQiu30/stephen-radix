'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store'
import { toast } from 'sonner'
import { addPostComment } from '@/api/postCommentController'

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
  placeholder = '写下你的评论...',
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
      })) as any
      if (res.code === 0) {
        toast.success('评论发表成功')
        setContent('')
        onSuccess?.()
      } else {
        toast.error(res.message || '发表评论失败')
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
      toast.error('发表评论失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="bg-muted border-border/40 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-sm">
          {user?.userAvatar ? (
            <img src={user.userAvatar} alt={user.userName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-muted-foreground text-sm font-medium">
              {user?.userName?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="relative">
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={placeholder}
              className="bg-background/50 border-border/40 focus:border-primary/50 focus:ring-primary/20 min-h-25 resize-none rounded-2xl p-4 pr-12 text-sm shadow-sm backdrop-blur-sm transition-all"
              autoFocus={autoFocus}
            />
          </div>
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={submitting}
                className="text-muted-foreground hover:text-foreground rounded-full px-4"
              >
                取消
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim() || submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 shadow-sm transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  发布中
                </>
              ) : (
                <>
                  发布
                  <Send className="ml-2 h-3 w-3" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
