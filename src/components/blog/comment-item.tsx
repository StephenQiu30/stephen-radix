'use client'

import * as React from 'react'
import { MessageSquare, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CommentInput } from './comment-input'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface CommentItemProps {
  comment: API.PostCommentVO
  postId: string
  onReplySuccess?: () => void
}

export function CommentItem({ comment, postId, onReplySuccess }: CommentItemProps) {
  const [isReplying, setIsReplying] = React.useState(false)
  const { user } = useAppSelector((state: RootState) => state.user)

  return (
    <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="bg-muted border-border/40 mt-1 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-sm">
          {comment.userVO?.userAvatar ? (
            <img
              src={comment.userVO.userAvatar}
              alt={comment.userVO.userName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-sm font-medium">
              {comment.userVO?.userName?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">
                {comment.userVO?.userName || '匿名用户'}
              </span>
              <span className="text-muted-foreground/60 text-xs">
                {comment.createTime ? dayjs(comment.createTime).fromNow() : ''}
              </span>
            </div>
          </div>

          {/* Body */}
          {/* Body */}
          <div className="text-foreground/90 text-sm leading-relaxed">
            <div className="wrap-break-word whitespace-pre-wrap">{comment.content}</div>
          </div>

          {/* Actions */}
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <MessageSquare className="h-3 w-3" />
              回复
            </button>

            {user && user.id === comment.userId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-primary flex items-center gap-1 transition-colors focus:outline-none">
                    <MoreHorizontal className="h-3 w-3" />
                    更多
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={async () => {
                      if (!comment.id) return
                      try {
                        const { deletePostComment } = await import('@/api/postCommentController')
                        const res = (await deletePostComment({ id: comment.id })) as any
                        if (res.code === 0) {
                          onReplySuccess?.() // Trigger refresh
                        } else {
                          // Could add toast here
                        }
                      } catch (e) {
                        console.error('Delete failed', e)
                      }
                    }}
                  >
                    删除评论
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="border-border/40 mt-4 border-l-2 pl-4">
              <CommentInput
                postId={postId}
                parentId={comment.id}
                onSuccess={() => {
                  setIsReplying(false)
                  onReplySuccess?.()
                }}
                onCancel={() => setIsReplying(false)}
                autoFocus
                placeholder={`回复 @${comment.userVO?.userName || '匿名用户'}...`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.children && comment.children.length > 0 && (
        <div className="border-border/20 mt-4 ml-5 space-y-6 border-l pl-8">
          {comment.children.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplySuccess={onReplySuccess}
            />
          ))}
        </div>
      )}
    </div>
  )
}
