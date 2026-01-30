'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import {
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Bot,
  Globe,
  Code2,
  Cpu,
  Fingerprint,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function AIChatLandingPage() {
  const { scrollY } = useScroll()
  const yHero = useTransform(scrollY, [0, 500], [0, 150])
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scale = useSpring(useTransform(scrollY, [0, 500], [1, 0.9]), springConfig)

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Natural Conversation',
      description: 'Interact with AI that understands context and nuance like a human.',
      className: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Lightning Fast',
      description: 'Real-time processing for instant responses.',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure by Design',
      description: 'Enterprise-grade encryption protecting your data.',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Knowledge',
      description: 'Access to a world of information in any language.',
      className: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10',
    },
  ]

  return (
    <div className="bg-background selection:bg-primary/20 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-blue-500/20 opacity-40 mix-blend-screen blur-[120px]" />
          <div className="absolute right-[-10%] bottom-[-20%] h-[50vw] w-[50vw] rounded-full bg-purple-500/20 opacity-40 mix-blend-screen blur-[120px]" />
        </div>

        <motion.div
          style={{ y: yHero, opacity: opacityHero, scale }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 text-center"
        >
          <motion.div variants={fadeInUp}>
            <span className="bg-secondary/50 text-secondary-foreground inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Introducing the new AI Experience</span>
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-foreground text-6xl leading-[1.05] font-semibold tracking-tighter md:text-8xl"
          >
            Intelligence. <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text pb-4 text-transparent">
              Reimagined.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed tracking-tight md:text-2xl"
          >
            The most advanced AI assistant, designed to seamlessly integrate into your workflow.
            Beautiful, fast, and secure.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-14 rounded-full px-8 text-lg shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              asChild
            >
              <Link href="/editor">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-white/20 px-8 text-lg backdrop-blur-sm transition-all hover:bg-white/10"
              asChild
            >
              <Link href="#features">Learn more</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero Image Mockup (Abstract representation) */}
        <motion.div className="from-background pointer-events-none absolute bottom-0 z-20 mx-auto h-[40vh] w-full max-w-6xl bg-gradient-to-t to-transparent" />
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="bg-secondary/30 px-6 py-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-24"
          >
            <h2 className="mb-6 text-4xl font-semibold tracking-tighter md:text-6xl">
              Everything you need.{' '}
              <span className="text-muted-foreground">Nothing you don&apos;t.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'group bg-background/50 relative overflow-hidden rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300 hover:shadow-xl',
                  feature.className
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                    feature.bg
                  )}
                />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="mb-8">
                    <div className="bg-secondary text-foreground mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-2xl font-semibold tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / Parallax Section */}
      <section className="overflow-hidden px-6 py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="grid items-center gap-20 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-500">
                  <Code2 className="h-4 w-4" />
                  <span>Developer Friendly</span>
                </div>
                <h2 className="text-4xl font-semibold tracking-tighter md:text-6xl">
                  Built for <br />
                  <span className="text-muted-foreground">creators and makers.</span>
                </h2>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  Powerful APIs, comprehensive documentation, and a community of developers ready to
                  help you build the next big thing.
                </p>

                <ul className="space-y-4 pt-4">
                  {[
                    { icon: Fingerprint, text: 'Secure Authentication' },
                    { icon: Cpu, text: 'Advanced Model Tuning' },
                    { icon: Globe, text: 'Global Content Delivery' },
                  ].map((Item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 text-lg font-medium"
                    >
                      <div className="bg-secondary rounded-full p-2">
                        <Item.icon className="h-5 w-5" />
                      </div>
                      {Item.text}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-tr from-gray-900 to-gray-800 p-8 shadow-2xl">
                {/* Abstract UI Mockup */}
                <div className="bg-background/90 absolute inset-x-8 top-8 bottom-0 overflow-hidden rounded-t-2xl border border-white/5 shadow-2xl">
                  <div className="flex h-10 items-center gap-2 border-b px-4">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="bg-secondary h-4 w-1/3 animate-pulse rounded" />
                    <div className="bg-secondary/50 h-32 rounded-xl" />
                    <div className="space-y-2">
                      <div className="bg-secondary h-3 w-3/4 rounded" />
                      <div className="bg-secondary h-3 w-1/2 rounded" />
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-1 rounded-[3rem] ring-1 ring-white/10 ring-inset" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-40">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-semibold tracking-tighter md:text-7xl">
              Start building today.
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl md:text-2xl">
              Join thousands of developers and businesses who trust our platform.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-16 rounded-full px-10 text-xl shadow-2xl transition-transform hover:scale-105"
                asChild
              >
                <Link href="/editor">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
