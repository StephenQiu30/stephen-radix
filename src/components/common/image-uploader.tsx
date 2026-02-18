'use client'

import * as React from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { uploadFile } from '@/api/file/fileController'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FileUploadBizEnum } from '@/enums/FileUploadBizEnum'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
  placeholder = '点击或拖拽上传封面',
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

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB')
      return
    }

    setLoading(true)
    try {
      const res = await uploadFile({ biz }, file)
      if (res.code === 0 && res.data) {
        onChange?.(res.data)
        toast.success('图片上传成功')
      } else {
        toast.error(res.message || '上传失败')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('上传失败，请重试')
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
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
          value ? 'bg-muted/20 h-48 border-none' : 'h-32',
          loading && 'pointer-events-none opacity-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !value && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        {loading ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs font-medium">上传中...</span>
          </div>
        ) : value ? (
          biz === FileUploadBizEnum.USER_AVATAR ? (
            <div className="flex h-full w-full items-center justify-center">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={value} alt="Uploaded avatar" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex gap-2">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={e => {
                            e.stopPropagation()
                            inputRef.current?.click()
                          }}
                        >
                          更换
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>更换图片</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={handleRemove}>
                          移除
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>移除图片</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ) : (
            <>
              <img
                src={value}
                alt="Uploaded cover"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex gap-2">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={e => {
                            e.stopPropagation()
                            inputRef.current?.click()
                          }}
                        >
                          更换
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>更换图片</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={handleRemove}>
                          移除
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>移除图片</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </>
          )
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-2 p-4 text-center">
            <div className="bg-muted rounded-full p-3">
              <ImagePlus className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">{placeholder}</p>
            <p className="text-muted-foreground/60 text-xs">支持 JPG, PNG, WebP (最大 5MB)</p>
          </div>
        )}
      </div>
    </div>
  )
}
