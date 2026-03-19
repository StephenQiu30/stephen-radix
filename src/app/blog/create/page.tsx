'use client'

import * as React from 'react'
import { ArrowLeft, Image as ImageIcon, Loader2, Save, Send } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { uploadFile } from '@/api/file/fileController'
import { addPost } from '@/api/post/postController'
import { toast } from 'sonner'
import { MarkdownEditor } from '@/components/blog/markdown-editor'
import { FileUploadBizEnum } from '@/enums/FileUploadBizEnum'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function CreatePostPage() {
  const container = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  // ... existing state ...
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [cover, setCover] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  useGSAP(
    () => {
      gsap.from('.gsap-reveal', {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
      })
    },
    { scope: container }
  )

  React.useEffect(() => {
    // ... rest of the file ...
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
      const res = await uploadFile({ fileUploadRequest: { biz: FileUploadBizEnum.POST_COVER } }, {}, file)
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
    <div ref={container} className="bg-background text-foreground fixed inset-0 z-[50] flex flex-col font-sans overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.03),transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.03),transparent_40%)]" />
      
      {/* Navigation & Actions Header */}
      <nav className="gsap-reveal border-border/5 bg-background/60 flex h-14 items-center justify-between border-b px-6 backdrop-blur-2xl">
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
                  className="text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full px-4 font-medium transition-colors"
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 shadow-sm transition-all font-medium"
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
 
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-col bg-background/30">
          <div className="mx-auto flex w-full flex-col px-6 py-12 md:px-12 lg:px-20 xl:px-32 2xl:px-48 min-h-full">
            {/* Cover Image Area */}
            <div className="gsap-reveal group relative mb-8">
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
                <div 
                  className="group/cover relative w-full overflow-hidden rounded-xl border border-dashed border-border/10 bg-muted/5 transition-all hover:border-primary/20 hover:bg-primary/5 cursor-pointer flex items-center justify-center py-8 mb-4"
                  onClick={() => {
                    const input = document.getElementById('cover-input') as HTMLInputElement;
                    input?.click();
                  }}
                >
                  <div className="flex items-center gap-3 text-muted-foreground transition-colors group-hover/cover:text-primary">
                    <div className="bg-background shadow-sm h-8 w-8 rounded-full flex items-center justify-center border border-border/10">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase">添加文章封面图</span>
                  </div>
                  <input
                    id="cover-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleUploadCover(file)
                    }}
                  />
                </div>
              )}
            </div>

            {/* Title Input */}
            <div className="gsap-reveal group relative mb-10">
              <Textarea
                placeholder="输入标题..."
                value={title}
                onChange={e => {
                  setTitle(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                rows={1}
                className="placeholder:text-muted-foreground/20 w-full resize-none overflow-hidden border-none bg-transparent p-0 text-3xl sm:text-4xl md:text-5xl leading-[1.2] font-black tracking-tight text-foreground focus-visible:ring-0 transition-all mb-2"
              />
              <div className="h-1 w-20 bg-primary/10 rounded-full transition-all duration-500 group-focus-within:w-40 group-focus-within:bg-primary/40" />
            </div>

            {/* Tags Input */}
            <div className="gsap-reveal group/tags mb-12 flex items-center gap-4 border-b border-border/5 pb-6 focus-within:border-primary/20 transition-all">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary text-xs font-black shadow-sm ring-1 ring-primary/10 group-focus-within/tags:bg-primary group-focus-within/tags:text-primary-foreground group-focus-within/tags:ring-primary transition-all">#</div>
              <Input
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="添加标签 (用逗号分隔)..."
                className="placeholder:text-muted-foreground/20 text-muted-foreground focus-visible:text-foreground w-full border-none bg-transparent px-0 text-[15px] font-bold focus-visible:ring-0 transition-colors"
              />
            </div>

            {/* Editor */}
            <div className="gsap-reveal flex flex-1 flex-col mt-2">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="开始讲述你的故事..."
                className="flex-1 min-h-[60vh] border-none bg-transparent px-0 shadow-none rounded-none"
                viewMode="split"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
