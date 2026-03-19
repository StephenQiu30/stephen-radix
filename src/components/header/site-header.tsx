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
      defaults: { ease: 'expo.out', duration: 1.2 }
    })

    // Initial state set immediately
    gsap.set(headerRef.current, { 
      y: -40, 
      opacity: 0,
      visibility: 'visible'
    })

    // Animate Header and all its children simultaneously
    tl.to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.5,
    })

    // Simultaneous reveal of children with a subtle scale and lift
    tl.from(['.site-logo', '.menu-item', '.action-item'], {
      opacity: 0,
      y: 5,
      scale: 0.98,
      duration: 1.2,
      stagger: 0, // No stagger - all at once as per user request
      clearProps: 'all'
    }, '-=1.2') // Start at exactly the same time as the header animation
  }, { scope: headerRef })

  return (
    <header ref={headerRef} className="bg-background/80 sticky top-0 z-50 w-full border-b border-border/10 backdrop-blur-md">
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
