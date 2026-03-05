'use client'

import * as React from 'react'
import { ArrowLeft, Image as ImageIcon, Loader2, Save, Send } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { uploadFile } from '@/api/file/fileController'
import { addPost } from '@/api/post/postController'
import { toast } from 'sonner'
import { MarkdownEditor } from '@/components/blog/markdown-editor'
import { FileUploadBizEnum } from '@/enums/FileUploadBizEnum'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [cover, setCover] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    // Load draft from local storage on mount
    const draftStr = localStorage.getItem('blog_draft')
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr)
        if (draft.title) setTitle(draft.title)
        if (draft.content) setContent(draft.content)
        if (draft.tags) setTags(draft.tags)
        if (draft.title || draft.content || draft.tags || draft.cover) {
          toast.info('已恢复未保存的草稿内容')
        }
      } catch (err) {
        console.error('Failed to parse blog draft', err)
      }
    }
  }, [])

  // Auto-save draft every 30 seconds if there's content changes
  React.useEffect(() => {
    const isContentEmpty = !title.trim() && !content.trim() && !tags.trim() && !cover;
    if (isContentEmpty) return;

    const timer = setInterval(() => {
      localStorage.setItem('blog_draft', JSON.stringify({ title, content, tags, cover }))
      // We don't show toast on auto-save to avoid annoyance, just silently save
    }, 30000) // 30 seconds

    return () => clearInterval(timer)
  }, [title, content, tags, cover])

  const handleSave = () => {
    const isContentEmpty = !title.trim() && !content.trim() && !tags.trim() && !cover;
    if (isContentEmpty) {
      toast.error('没有任何内容需要保存')
      return;
    }
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
      const res = await uploadFile({ fileUploadRequest: { biz: FileUploadBizEnum.POST_COVER } }, file)
      if (res.code === 0 && res.data?.url) {
        setCover(res.data.url)
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
      let tagList: string[] = []
      if (tags.trim()) {
        tagList = tags
          .split(/[,，]/)
          .map(t => t.trim())
          .filter(Boolean)
      }

      const res = await addPost({
        title,
        content,
        tags: tagList,
        cover,
      })

      if (res.code === 0) {
        toast.success('发布成功！', { id: toastId })
        localStorage.removeItem('blog_draft')
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
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-full px-4 font-medium transition-colors"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  保存草稿
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>保存当前内容到本地草稿箱</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 shadow-sm transition-all font-medium"
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
              </TooltipTrigger>
              <TooltipContent>
                <p>发布文章到博客</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>

      <div className="flex flex-1 overflow-auto bg-background">
        <div className="mx-auto flex w-full flex-col px-6 py-8 md:px-12 lg:px-20 xl:px-32 2xl:px-48 min-h-full">
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
          <div className="relative mb-6">
            <textarea
              placeholder="输入标题..."
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              rows={1}
              className="placeholder:text-muted-foreground/30 w-full resize-none overflow-hidden bg-transparent text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.1] font-bold tracking-tight text-foreground focus:outline-none transition-colors"
            />
          </div>

          {/* Tags Input */}
          <div className="mb-10 flex items-center gap-3 border-b border-border/40 pb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/70 text-sm font-semibold">#</div>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="添加标签 (用逗号分隔)..."
              className="placeholder:text-muted-foreground/40 text-muted-foreground focus:text-foreground w-full bg-transparent text-[15px] font-medium focus:outline-none transition-colors"
            />
          </div>

          {/* Editor */}
          <div className="flex flex-1 flex-col mt-2">
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="开始讲述你的故事..."
              className="flex-1 min-h-[60vh] border-none bg-transparent px-0 shadow-none rounded-none"
              viewMode="edit"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
