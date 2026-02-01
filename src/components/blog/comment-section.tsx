'use client'

import * as React from 'react'
import { Loader2, MessageSquare } from 'lucide-react'
import { CommentInput } from './comment-input'
import { CommentItem } from './comment-item'
import { listPostCommentVoByPage } from '@/api/postCommentController'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = React.useState<API.PostCommentVO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)

  // Helper to build comment tree
  const buildCommentTree = (comments: API.PostCommentVO[]) => {
    const commentMap = new Map<any, API.PostCommentVO>()
    const roots: API.PostCommentVO[] = []

    // First pass: create a map of all comments
    comments.forEach(comment => {
      // Ensure children array exists
      const commentWithChildren = { ...comment, children: [] }
      commentMap.set(comment.id, commentWithChildren)
    })

    // Second pass: link children to parents
    commentMap.forEach(comment => {
      if (comment.parentId && Number(comment.parentId) !== 0 && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId)
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
  }

  const fetchComments = React.useCallback(async () => {
    try {
      // Sort by createTime descending to show newest first
      const res = (await listPostCommentVoByPage({
        postId: postId as any,
        current: 1,
        pageSize: 20,
      })) as any
      if (res.code === 0 && res.data) {
        const flatComments = res.data.records || []
        const treeComments = buildCommentTree(flatComments)
        setComments(treeComments)
        setTotal(res.data.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }, [postId])

  React.useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId, fetchComments])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 space-y-8 duration-700">
      <div className="mb-6 flex items-center gap-2">
        <div className="bg-primary/10 rounded-lg p-2">
          <MessageSquare className="text-primary h-5 w-5" />
        </div>
        <h3 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
          评论 ({total})
        </h3>
      </div>

      {/* Main Input */}
      <CommentInput postId={postId} onSuccess={fetchComments} />

      {/* Comment List */}
      <div className="mt-8 space-y-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-muted-foreground/50 h-8 w-8 animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplySuccess={fetchComments}
            />
          ))
        ) : (
          <div className="text-muted-foreground/50 bg-muted/20 border-border/20 flex flex-col items-center justify-center rounded-3xl border border-dashed py-12 text-center">
            <div className="bg-secondary/30 mb-3 rounded-full p-4">
              <MessageSquare className="h-6 w-6 opacity-50" />
            </div>
            <p className="text-sm">暂无评论，快来抢沙发吧</p>
          </div>
        )}
      </div>
    </div>
  )
}
