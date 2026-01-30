'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Image as ImageIcon, Loader2, Save, Send, Settings2, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MarkdownEditor } from '@/components/blog/markdown-editor'
import { addPost } from '@/api/postController'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ImageUploader } from '@/components/common/image-uploader'

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [cover, setCover] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSave = () => {
    localStorage.setItem('blog_draft', JSON.stringify({ title, content, tags, cover }))
    toast.success('Saved to local drafts')
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Publishing story...')

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
        toast.success('Published successfully!', { id: toastId })
        router.push('/blog')
      } else {
        toast.error(`Failed to publish: ${res.message || 'Unknown error'}`, { id: toastId })
      }
    } catch (error: any) {
      toast.error(`Network error: ${error.message || 'Failed to connect'}`, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation & Actions Header */}
      <nav className="border-border/40 bg-background/80 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 backdrop-blur-xl transition-all">
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
          <div className="text-muted-foreground text-sm font-medium">Drafting</div>
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
            Save
          </Button>

          {/* Metadata Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-secondary"
              >
                <Settings2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h4 className="leading-none font-medium">Story Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. React, Design"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Image</Label>
                  <ImageUploader value={cover} onChange={setCover} biz="post_cover" />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            className="bg-foreground text-background hover:bg-foreground/90 rounded-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl px-6 py-12"
      >
        {/* Title Input */}
        <div className="relative mb-8">
          <textarea
            placeholder="Title"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
            rows={1}
            className="placeholder:text-muted-foreground/30 w-full resize-none overflow-hidden bg-transparent text-5xl leading-tight font-bold tracking-tight focus:outline-none md:text-6xl"
          />
        </div>

        {/* Editor */}
        <div className="min-h-[500px]">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Tell your story..."
            className="border-none shadow-none"
            viewMode="edit" // Force edit mode by default logic or handle inside
          />
        </div>
      </motion.div>
    </div>
  )
}
