'use client'

import * as React from 'react'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SiteLogo } from '@/components/header/site-logo'
import { Menus } from '@/components/header/menus'
import { MobileMenuContent } from '@/components/header/mobile-menu-content'
import { HeaderActions } from '@/components/header/header-actions'

export function SiteHeader() {
  const headerRef = React.useRef<HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1.2 }
    })

    // Header bar slide down
    tl.from(headerRef.current, {
      y: -80,
      opacity: 0,
      duration: 1.5,
    })

    // Staggered children entrance - Menus first
    tl.from('.menu-item', {
      y: 15,
      opacity: 0,
      stagger: 0.1,
      clearProps: 'all'
    }, '-=1.2') // Start very early during header animation

    tl.from('.site-logo', {
      y: 15,
      opacity: 0,
      clearProps: 'all'
    }, '-=0.8')

    tl.from('.action-item', {
      y: 15,
      opacity: 0,
      stagger: 0.08,
      clearProps: 'all'
    }, '-=0.8')
  }, { scope: headerRef })

  return (
    <header ref={headerRef} className="bg-background/80 sticky top-0 z-50 w-full border-b border-border/10 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto grid h-20 grid-cols-3 items-center px-6">
        <div className="flex items-center gap-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
              <MobileMenuContent onClose={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <SiteLogo showText={true} className="hidden sm:flex shrink-0" />
          <SiteLogo showText={false} className="sm:hidden shrink-0" />
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <Menus />
        </div>

        <div className="flex items-center justify-end">
          <HeaderActions authModalOpen={authModalOpen} onAuthModalOpenChange={setAuthModalOpen} />
        </div>
      </div>
    </header>
  )
}
