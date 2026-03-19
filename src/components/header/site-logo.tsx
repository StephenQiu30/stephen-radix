import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SiteLogoProps {
  className?: string
  showText?: boolean
  onClick?: () => void
}

export function SiteLogo({ className, showText = true, onClick }: SiteLogoProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Stephen Radix'
  const logoLetter = siteName.charAt(0).toUpperCase()

  return (
    <Link href="/" onClick={onClick} className={cn('site-logo group flex items-center space-x-2', className)}>
      <div className="bg-gradient-to-br from-primary to-primary/80 flex h-9 w-9 items-center justify-center rounded-[12px] shadow-lg shadow-primary/10 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 active:scale-95">
        <span className="text-primary-foreground text-xl font-black tracking-tight">{logoLetter}</span>
      </div>
      {showText && (
        <span className="text-lg font-black tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
          {siteName}
        </span>
      )}
    </Link>
  )
}
