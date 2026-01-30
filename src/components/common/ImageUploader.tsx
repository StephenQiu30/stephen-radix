'use client'

import * as React from 'react'
import { ImagePlus, Loader2, X, UploadCloud } from 'lucide-react'
import { uploadFile } from '@/api/fileController'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
    biz = 'post_cover',
    className,
    placeholder = 'Click or drag to upload cover',
}: ImageUploaderProps) {
    const [loading, setLoading] = React.useState(false)
    const [dragActive, setDragActive] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        if (!file) return

        // Validate type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        // Validate size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
            return
        }

        setLoading(true)
        try {
            const res = (await uploadFile({ biz }, file)) as any
            if (res.code === 0 && res.data) {
                onChange?.(res.data)
                toast.success('Image uploaded successfully')
            } else {
                toast.error(res.message || 'Upload failed')
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Upload failed, please try again')
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
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200",
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                    value ? "border-none h-48 bg-muted/20" : "h-32",
                    loading && "opacity-50 pointer-events-none"
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
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="text-xs font-medium">Uploading...</span>
                    </div>
                ) : value ? (
                    <div className="relative h-full w-full group">
                        <img
                            src={value}
                            alt="Uploaded cover"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        inputRef.current?.click()
                                    }}
                                >
                                    Replace
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleRemove}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                        <div className="rounded-full bg-muted p-3">
                            <ImagePlus className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium">{placeholder}</p>
                        <p className="text-xs text-muted-foreground/60">Supports JPG, PNG, WebP (Max 5MB)</p>
                    </div>
                )}
            </div>
        </div>
    )
}
