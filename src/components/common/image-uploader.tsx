'use client'

import * as React from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { uploadFile } from '@/api/file/fileController'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FileUploadBizEnum } from '@/enums/FileUploadBizEnum'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ImageUploaderProps {
  value?: string
  onChange?: (value: string) => void
  biz?: string
  className?: string
  placeholder?: string
}

export function ImageUploader({
  value,
  onChange,
  biz = FileUploadBizEnum.POST_COVER,
  className,
  placeholder = '点击或拖拽上传图片',
}: ImageUploaderProps) {
  const [loading, setLoading] = React.useState(false)
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件')
      return
    }

    // Validate size (e.g., 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过 10MB')
      return
    }

    setLoading(true)
    try {
      const res = await uploadFile({ fileUploadRequest: { biz } }, {}, file)
      if (res.code === 0 && res.data?.url) {
        onChange?.(res.data.url)
        toast.success('图片上传成功', {
          description: res.data.fileName || '已成功保存到云端',
        })
      } else {
        toast.error(res.message || '上传失败')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || '上传失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
    toast.info('已移除图片')
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out',
          dragActive
            ? 'border-primary bg-primary/5 ring-8 ring-primary/5'
            : 'border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/30 hover:shadow-lg',
          value ? 'h-56 border-none bg-muted/20' : 'h-40',
          loading && 'pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !value && !loading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mt-2 text-sm font-medium text-foreground/60">正在努力上传...</span>
          </div>
        )}

        {value ? (
          <div className="relative h-full w-full overflow-hidden group">
            {biz === FileUploadBizEnum.USER_AVATAR ? (
              <div className="flex h-full w-full items-center justify-center p-4">
                <Avatar className="h-32 w-32 shadow-2xl ring-4 ring-background transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage src={value} alt="Uploaded avatar" className="object-cover" />
                  <AvatarFallback className="bg-muted text-2xl font-semibold">
                    {placeholder.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <img
                src={value}
                alt="Uploaded image"
                className="h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:blur-[2px]"
              />
            )}

            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-300 backdrop-blur-[4px] group-hover:opacity-100">
              <div className="flex translate-y-4 gap-3 transition-transform duration-300 group-hover:translate-y-0 text-white">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full px-5 font-semibold shadow-lg hover:bg-white hover:text-black"
                        onClick={e => {
                          e.stopPropagation()
                          inputRef.current?.click()
                        }}
                      >
                        更换
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>更换当前图片</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full px-5 font-semibold shadow-lg"
                        onClick={handleRemove}
                      >
                        移除
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>彻底移除此图片</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center transition-all duration-300 group-hover:scale-105">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner transition-colors group-hover:bg-primary/10">
              <ImagePlus className="h-8 w-8 text-muted-foreground/60 transition-colors group-hover:text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-tight">{placeholder}</p>
              <p className="text-muted-foreground/60 text-xs">
                支持 JPG, PNG, WebP (建议 10MB 以内)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
