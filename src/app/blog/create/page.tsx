'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Image as ImageIcon, Loader2, Save, Send, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadFile } from '@/api/fileController'
import { addPost } from '@/api/postController'
import { toast } from 'sonner'
import { MarkdownEditor } from '@/components/blog/markdown-editor'

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [cover, setCover] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSave = () => {
    localStorage.setItem('blog_draft', JSON.stringify({ title, content, tags, cover }))
    toast.success('已保存到草稿箱')
  }

  const handleUploadCover = async (file: File) => {
    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件')
      return
    }
    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB')
      return
    }

    const toastId = toast.loading('正在上传封面...')
    try {
      const res = (await uploadFile({ biz: 'post_cover' }, file)) as any
      if (res.code === 0 && res.data) {
        setCover(res.data)
        toast.success('封面上传成功', { id: toastId })
      } else {
        toast.error(res.message || '上传失败', { id: toastId })
      }
    } catch (error) {
      toast.error('上传失败，请重试', { id: toastId })
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('请输入标题和内容')
      return
    }

    setLoading(true)
    const toastId = toast.loading('正在发布文章...')

    try {
      const tagList = tags
        .split(/[,，]/)
        .map(t => t.trim())
        .filter(Boolean)

      const res = (await addPost({
        title,
        content,
        tags: tagList,
        cover,
      })) as any

      if (res.code === 0) {
        toast.success('发布成功！', { id: toastId })
        router.push('/blog')
      } else {
        toast.error(`发布失败: ${res.message || '未知错误'}`, { id: toastId })
      }
    } catch (error: any) {
      toast.error(`网络请求失败: ${error.message || '连接失败'}`, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background text-foreground fixed inset-0 z-[50] flex flex-col font-sans">
      {/* Navigation & Actions Header */}
      <nav className="border-border/40 bg-background/80 flex h-14 items-center justify-between border-b px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/blog">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="text-muted-foreground text-sm font-medium">撰写文章</div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            保存草稿
          </Button>

          <Button
            className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            发布
          </Button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col px-8 py-10">
          {/* Cover Image Area */}
          <div className="group relative mb-8">
            {cover ? (
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-sm">
                <img src={cover} alt="Cover" className="h-full w-full object-cover" />
                <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="bg-background/80 flex gap-2 rounded-lg p-1 backdrop-blur-md">
                    <label className="hover:bg-muted inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors">
                      更换封面
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadCover(file)
                        }}
                      />
                    </label>
                    <button
                      onClick={() => setCover('')}
                      className="hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                    >
                      移除
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 flex gap-2">
                <label className="text-muted-foreground hover:bg-secondary/50 inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors">
                  <ImageIcon className="h-4 w-4" />
                  添加封面
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleUploadCover(file)
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="relative mb-4">
            <textarea
              placeholder="输入标题..."
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              rows={1}
              className="placeholder:text-muted-foreground/40 w-full resize-none overflow-hidden bg-transparent text-5xl leading-tight font-bold tracking-tight focus:outline-none md:text-6xl"
            />
          </div>

          {/* Tags Input */}
          <div className="mb-8 flex items-center gap-2">
            <div className="text-muted-foreground/50 text-lg">#</div>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="添加标签 (用逗号分隔)..."
              className="placeholder:text-muted-foreground/40 text-muted-foreground focus:text-foreground w-full bg-transparent text-lg font-medium focus:outline-none"
            />
          </div>

          {/* Editor */}
          <div className="flex flex-1 flex-col">
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="开始讲述你的故事..."
              className="min-h-[500px] border-none bg-transparent px-0 shadow-none"
              viewMode="edit"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
