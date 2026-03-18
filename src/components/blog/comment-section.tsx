'use client'

import * as React from 'react'
import { Loader2, MessageSquare } from 'lucide-react'
import { CommentInput } from './comment-input'
import { CommentItem } from './comment-item'
import { listPostCommentVoByPage } from '@/api/post/postCommentController'

interface CommentSectionProps {
  postId: string
  onTotalChange?: (total: number) => void
}

export function CommentSection({ postId, onTotalChange }: CommentSectionProps) {
  const [flatComments, setFlatComments] = React.useState<PostAPI.PostCommentVO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)

  // Memoized comment tree
  const treeComments = React.useMemo(() => {
    if (!flatComments.length) return []

    const commentMap = new Map<any, PostAPI.PostCommentVO>()
    const roots: PostAPI.PostCommentVO[] = []

    // First pass: create a map of all comments
    flatComments.forEach(comment => {
      if (comment.id) {
        commentMap.set(String(comment.id), { ...comment, children: [] })
      }
    })

    // Second pass: link children to parents
    commentMap.forEach(comment => {
      const parentIdStr = comment.parentId ? String(comment.parentId) : null
      if (parentIdStr && parentIdStr !== '0' && commentMap.has(parentIdStr)) {
        const parent = commentMap.get(parentIdStr)
        if (parent) {
          if (!parent.children) parent.children = []
          parent.children.push(comment)
        }
      } else {
        roots.push(comment)
      }
    })

    // Sort roots by createTime (newest first)
    return roots.sort((a, b) => {
      return new Date(b.createTime || '').getTime() - new Date(a.createTime || '').getTime()
    })
  }, [flatComments])

  const fetchComments = React.useCallback(async () => {
    try {
      // Sort by createTime descending to show newest first
      const res = await listPostCommentVoByPage({
        postId: postId as any,
        current: 1,
        pageSize: 20,
      })
      if (res.code === 0 && res.data) {
        setFlatComments(res.data.records || [])
        setTotal(res.data.total || 0)
        onTotalChange?.(res.data.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }, [postId, onTotalChange])

  React.useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId, fetchComments])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 space-y-12 duration-700 bg-muted/5 rounded-[40px] p-8 md:p-12 border border-border/5">
      <div className="flex items-center gap-5">
        <div className="bg-primary h-12 w-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
        <div>
          <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">
            参与讨论 ({total})
          </h3>
          <p className="text-foreground/60 text-[11px] font-bold tracking-widest uppercase mt-1">
            已有 {total} 条深度见解 · 开启你的对话
          </p>
        </div>
      </div>

      {/* Main Input */}
      <CommentInput postId={postId} onSuccess={fetchComments} />

      {/* Comment List */}
      <div className="mt-8 space-y-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-muted-foreground/50 h-8 w-8 animate-spin" />
          </div>
        ) : treeComments.length > 0 ? (
          treeComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplySuccess={fetchComments}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <MessageSquare className="h-6 w-6 opacity-30 mb-3" />
            <p className="text-sm">暂无评论，成为第一个留言的人吧。</p>
          </div>
        )}
      </div>
    </div>
  )
}
