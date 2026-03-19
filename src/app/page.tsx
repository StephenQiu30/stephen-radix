'use client'

import React, { useRef, memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PostCard, PostCardSkeleton } from '@/components/blog/post-card'
import { searchPostByPage } from '@/api/search/searchController'

gsap.registerPlugin(ScrollTrigger)

// --- Sub-components ---

const HeroSection = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.hero-reveal', {
      y: 80,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power4.out',
      clearProps: 'all',
    })
  }, { scope: container })

  return (
    <section ref={container} className="relative flex flex-col lg:flex-row items-start justify-between gap-16 mb-80">
      <div className="flex-1">
        <div className="hero-reveal bg-primary h-1.5 w-16 mb-12 rounded-full" />
        <h1 className="hero-reveal text-foreground text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9] mb-12 select-none">
          Day by<br />
          day.
        </h1>
        <div className="hero-reveal flex items-center gap-6 text-foreground/30 text-[11px] font-black tracking-[0.5em] uppercase mb-16">
          <span>持续进化</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>长期主义</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>极致匠心</span>
        </div>

        <div className="hero-reveal max-w-xl">
          <p className="text-xl md:text-2xl font-black leading-relaxed tracking-tight text-foreground/80">
            日拱一卒，功不唐捐。<br />
            在平凡的日常中，通过持续的进化，构建属于未来的技术版图。
          </p>
        </div>
      </div>

      <div className="hero-reveal w-full lg:w-[450px] shrink-0">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-tr from-primary/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
          <div className="relative flex flex-col gap-10 rounded-[48px] border border-border bg-background/80 backdrop-blur-3xl p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_48px_96px_-24px_hsl(var(--primary)/0.2)]">
            <div className="flex items-start justify-between">
              <div className="bg-primary text-primary-foreground h-16 w-16 rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl shadow-primary/20">
                S.
              </div>
              <div className="text-right pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 font-mono mb-1">Status</p>
                <div className="flex items-center gap-2 justify-end">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                  <p className="text-xs font-black text-foreground">当前在线</p>
                </div>
              </div>
            </div>

            <div className="space-y-12 pl-1">
              <p className="text-foreground text-2xl font-black leading-tight tracking-tight">
                在跨越维度的代码中，寻求纯粹的直觉。<br />
                在每一次细微的迭代中，沉淀灵感的厚度。
              </p>

              <Link href="/blog" className="flex items-center justify-between group/btn pt-8 border-t border-border/60">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80 group-hover:text-primary transition-colors">探索全部见解</span>
                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center transition-all duration-500 group-hover/btn:rotate-45 group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-110">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

const PhilosophySection = memo(() => {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(sectionRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      clearProps: 'all',
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="section-reveal mb-80 w-full py-24 border-y border-border/10">
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground">
        「所谓极致，<br />
        是把微不足道的细节做到<span className="text-foreground underline underline-offset-[20px] decoration-border/40 decoration-4">完美</span>。」
      </h2>
      <p className="mt-12 text-foreground/60 text-[11px] font-black tracking-[0.6em] uppercase">— 见解哲学</p>
    </section>
  )
})

PhilosophySection.displayName = 'PhilosophySection'

const FeaturedPosts = () => {
  const [posts, setPosts] = useState<PostAPI.PostVO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await searchPostByPage({
          current: 1,
          pageSize: 6,
          sortField: 'createTime',
          sortOrder: 'descend',
        })
        if (res.code === 0 && res.data?.records) {
          setPosts(res.data.records as unknown as PostAPI.PostVO[])
        }
      } catch (err) {
        console.error('Failed to fetch posts from ES:', err)
      } finally {
        setIsLoading(false)
        // Refresh ScrollTrigger after content load
        setTimeout(() => ScrollTrigger.refresh(), 100)
      }
    }
    fetchPosts()
  }, [])

  useGSAP(() => {
    if (!isLoading) {
      gsap.from('.post-reveal', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        clearProps: 'all'
      })
    }
  }, { scope: containerRef, dependencies: [isLoading] })

  return (
    <section ref={containerRef} className="mb-80 w-full">
      <div className="flex items-center justify-between mb-24">
        <div className="flex items-baseline gap-4">
          <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-foreground/60">
            精选见解
          </h3>
          <span className="text-xs font-bold text-foreground/40 italic">/ 06</span>
        </div>
        <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-foreground/80 hover:text-foreground transition-all flex items-center gap-2 group">
          <span className="group-hover:mr-2 transition-all">所有见解 archive</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-40 min-h-[400px]">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} index={i} />
          ))
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-reveal">
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>
    </section>
  )
}

// --- Main Page ---

export default function LandingPage() {
  return (
    <main className="container mx-auto min-h-screen pt-32 pb-40 px-6 selection:bg-foreground selection:text-background relative">
      <HeroSection />
      <PhilosophySection />
      <FeaturedPosts />
      <div className="h-24" />
    </main>
  )
}
