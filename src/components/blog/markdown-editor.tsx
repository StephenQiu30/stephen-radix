'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold,
  Italic,
  List as ListIcon,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
  Type,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownRender } from '@/components/blog/markdown-render'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  viewMode?: 'edit' | 'preview' | 'split'
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  viewMode = 'split',
}: MarkdownEditorProps) {
  const [view, setView] = React.useState<'edit' | 'preview' | 'split'>(viewMode)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Sync internal view state if prop changes (optional, but good for init)
  React.useEffect(() => {
    if (viewMode) setView(viewMode)
  }, [viewMode])

  // 处理工具栏操作
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)

    const newValue = text.substring(0, start) + before + selected + after + text.substring(end)
    onChange(newValue)

    // 恢复焦点并设置选择范围
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const toolbarItems = [
    { icon: Bold, label: 'Bold', action: () => insertText('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertText('*', '*') },
    { icon: Type, label: 'Heading', action: () => insertText('### ') },
    { icon: ListIcon, label: 'List', action: () => insertText('- ') },
    { icon: ListOrdered, label: 'Ordered List', action: () => insertText('1. ') },
    { icon: Code, label: 'Code', action: () => insertText('```\n', '\n```') },
    { icon: LinkIcon, label: 'Link', action: () => insertText('[', '](url)') },
    { icon: ImageIcon, label: 'Image', action: () => insertText('![alt](', ')') },
  ]

  return (
    <div
      className={cn(
        'bg-card/50 flex flex-col rounded-xl border transition-all duration-300',
        isFullscreen &&
        'bg-background fixed inset-0 z-50 h-screen w-screen rounded-none border-none',
        !isFullscreen && 'min-h-[500px]',
        className
      )}
    >
      {/* 浮动/固定工具栏 */}
      <div
        className={cn(
          'border-border/40 flex items-center justify-between border-b px-4 py-2 backdrop-blur-sm',
          isFullscreen ? 'bg-background/80 sticky top-0 z-10' : 'bg-muted/20 rounded-t-xl'
        )}
      >
        <div className="flex items-center gap-1">
          {toolbarItems.map((item, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8"
              onClick={item.action}
              title={item.label}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 pl-4">
          {/* View Switcher */}
          <div className="bg-muted/30 hidden items-center rounded-lg p-1 lg:flex">
            <Button
              variant={view === 'edit' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-3 text-xs"
              onClick={() => setView('edit')}
            >
              Edit
            </Button>
            <Button
              variant={view === 'split' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-3 text-xs"
              onClick={() => setView('split')}
            >
              Split
            </Button>
            <Button
              variant={view === 'preview' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-3 text-xs"
              onClick={() => setView('preview')}
            >
              Preview
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-8 w-8"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 编辑与预览区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 移动端/小屏 Tab 切换 */}
        <div className="flex h-full w-full flex-col lg:hidden">
          {/* 使用简单的条件渲染代替 Tabs 组件以减少层级 */}
          {view === 'edit' ? (
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder || 'Start writing...'}
              className="h-full w-full resize-none rounded-none border-none bg-transparent p-6 font-mono text-base leading-relaxed focus-visible:ring-0"
            />
          ) : (
            <div className="flex-1 overflow-auto p-6">
              <MarkdownRender content={value} />
            </div>
          )}
          {/* 底部简单的切换器 */}
          <div className="border-border/40 flex border-t">
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium',
                view === 'edit' ? 'text-primary bg-muted/20' : 'text-muted-foreground'
              )}
              onClick={() => setView('edit')}
            >
              Edit
            </button>
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium',
                view === 'preview' ? 'text-primary bg-muted/20' : 'text-muted-foreground'
              )}
              onClick={() => setView('preview')}
            >
              Preview
            </button>
          </div>
        </div>

        {/* PC/宽屏分栏 */}
        <div className="divide-border/40 hidden h-full w-full divide-x lg:flex">
          <div
            className={cn(
              'transition-all duration-300',
              view === 'edit' && 'w-full',
              view === 'preview' && 'w-0 overflow-hidden opacity-0',
              view === 'split' && 'w-1/2'
            )}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder || 'Start writing...'}
              className="h-full w-full resize-none border-none bg-transparent p-8 font-mono text-[15px] leading-relaxed focus:outline-none"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>
          <div
            className={cn(
              'bg-muted/5 overflow-auto transition-all duration-300',
              view === 'preview' && 'w-full',
              view === 'edit' && 'w-0 overflow-hidden opacity-0',
              view === 'split' && 'w-1/2'
            )}
          >
            <div className="mx-auto max-w-4xl p-8">
              <MarkdownRender content={value || '*No content to preview*'} />
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      {!isFullscreen && (
        <div className="border-border/40 bg-muted/10 text-muted-foreground flex items-center justify-between border-t px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <span>Words: {value.length}</span>
          </div>
          <span>Markdown Supported</span>
        </div>
      )}
    </div>
  )
}
