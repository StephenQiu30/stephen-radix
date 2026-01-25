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
    <Link href="/public" onClick={onClick} className={cn('flex items-center space-x-2', className)}>
      <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
        <span className="text-primary-foreground text-lg font-bold">{logoLetter}</span>
      </div>
      {showText && <span className="text-lg font-bold">{siteName}</span>}
    </Link>
  )
}
