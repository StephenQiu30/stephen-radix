import { cn } from '@/lib/utils'
import { UserCircle } from 'lucide-react'
import type { UserVO } from '@/api/typings'

interface UserAvatarProps {
  user?: UserVO | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
  alt?: string
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
}

const iconSizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
}

export function UserAvatar({ user, size = 'md', className, alt }: UserAvatarProps) {
  const sizeClass = sizeMap[size]
  const iconSizeClass = iconSizeMap[size]
  const avatarUrl = user?.userAvatar
  const userName = user?.userName || alt || '用户头像'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={userName}
        className={cn('flex-shrink-0 rounded-full object-cover', sizeClass, className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-full',
        size === 'lg' ? 'bg-primary/10' : 'bg-muted',
        sizeClass,
        className
      )}
    >
      <UserCircle
        className={cn(size === 'lg' ? 'text-primary' : 'text-muted-foreground', iconSizeClass)}
      />
    </div>
  )
}
