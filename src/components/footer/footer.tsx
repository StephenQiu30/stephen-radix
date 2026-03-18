import Link from 'next/link'
import { Github, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
  author?: string
  githubUrl?: string
  email?: string
  icpNumber?: string
}

export function Footer({
  className,
  author = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'StephenQiu30',
  githubUrl = process.env.NEXT_PUBLIC_AUTHOR_GITHUB || 'https://github.com/StephenQiu30',
  email = `mailto:${process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'Popcornqhd@gmail.com'}`,
  icpNumber = process.env.NEXT_PUBLIC_ICP_NUMBER || '',
}: FooterProps) {
  return (
    <footer className={cn('bg-background border-t border-border/10 py-12', className)}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span>© {new Date().getFullYear()} {author}. 保留所有权利.</span>
            {icpNumber && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                备案号：{icpNumber}
              </a>
            )}
          </div>

          <div className="flex items-center gap-6">
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-2 transition-colors">
              GitHub <Github className="h-3 w-3" />
            </Link>
            <Link href={email} className="hover:text-foreground flex items-center gap-2 transition-colors">
              Email <Mail className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex items-center gap-8">
             <Link href="/blog" className="hover:text-foreground">博客见解</Link>
             <Link href="/user/settings" className="hover:text-foreground">账户设置</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
