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
  Fingerprint
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
      bg: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Lightning Fast',
      description: 'Real-time processing for instant responses.',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-orange-500/10 to-red-500/10'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure by Design',
      description: 'Enterprise-grade encryption protecting your data.',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Knowledge',
      description: 'Access to a world of information in any language.',
      className: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10'
    },
  ]

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden px-6 pt-20">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/20 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/20 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
        </div>

        <motion.div
          style={{ y: yHero, opacity: opacityHero, scale }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-8"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-md border border-white/10 text-sm font-medium text-secondary-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Introducing the new AI Experience</span>
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-semibold tracking-tighter text-foreground leading-[1.05]"
          >
            Intelligence. <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-4">
              Reimagined.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed tracking-tight"
          >
            The most advanced AI assistant, designed to seamlessly integrate into your workflow.
            Beautiful, fast, and secure.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl hover:scale-105" asChild>
              <Link href="/editor">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all" asChild>
              <Link href="#features">
                Learn more
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero Image Mockup (Abstract representation) */}
        <motion.div
          className="absolute bottom-0 w-full max-w-6xl mx-auto h-[40vh] bg-gradient-to-t from-background to-transparent z-20 pointer-events-none"
        />
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-32 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6">
              Everything you need. <span className="text-muted-foreground">Nothing you don&apos;t.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border bg-background/50 backdrop-blur-xl p-8 hover:shadow-xl transition-all duration-300",
                  feature.className
                )}
              >
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", feature.bg)} />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / Parallax Section */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-semibold">
                  <Code2 className="h-4 w-4" />
                  <span>Developer Friendly</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">
                  Built for <br />
                  <span className="text-muted-foreground">creators and makers.</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Powerful APIs, comprehensive documentation, and a community of developers ready to help you build the next big thing.
                </p>

                <ul className="space-y-4 pt-4">
                  {[
                    { icon: Fingerprint, text: 'Secure Authentication' },
                    { icon: Cpu, text: 'Advanced Model Tuning' },
                    { icon: Globe, text: 'Global Content Delivery' }
                  ].map((Item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="flex items-center gap-3 text-lg font-medium"
                    >
                      <div className="p-2 rounded-full bg-secondary">
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
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-gray-900 to-gray-800 shadow-2xl p-8 relative overflow-hidden border border-white/10">
                {/* Abstract UI Mockup */}
                <div className="absolute inset-x-8 top-8 bottom-0 bg-background/90 rounded-t-2xl shadow-2xl border border-white/5 overflow-hidden">
                  <div className="h-10 border-b flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-1/3 bg-secondary rounded animate-pulse" />
                    <div className="h-32 bg-secondary/50 rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-3 w-3/4 bg-secondary rounded" />
                      <div className="h-3 w-1/2 bg-secondary rounded" />
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-1 rounded-[3rem] ring-1 ring-inset ring-white/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter">
              Start building today.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers and businesses who trust our platform.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform" asChild>
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
