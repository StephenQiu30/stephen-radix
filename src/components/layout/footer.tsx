import Link from "next/link"
import { Github, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
  author?: string
  githubUrl?: string
  email?: string
}

export function Footer({
  className,
  author = "StephenQiu30",
  githubUrl = "https://github.com/StephenQiu30",
  email = "mailto:Popcornqhd@gmail.com",
}: FooterProps) {
  return (
    <footer className={cn("border-t bg-muted/30", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright & Author */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {author}. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
            <Link
              href={email}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
