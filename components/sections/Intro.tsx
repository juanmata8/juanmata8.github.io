"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, useTransform as useMotionTransform } from 'framer-motion'

// Animated counter that counts up when in view
function CountUp({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      // Ease out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  )
}

export function Intro() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0])

  // Track when section is in view to trigger underline draw
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: "-150px" })

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center items-center px-6 bg-background py-24"
    >
      <motion.div
        style={{ opacity, y }}
        className="text-center max-w-3xl mx-auto"
      >

        <h3 className="font-display text-2xl sm:text-3xl text-foreground mb-4">
          Setting the table
        </h3>

        <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
          New York City, 2011-2025
        </span>

        <h2
          ref={headingRef}
          className="relative text-4xl sm:text-5xl md:text-6xl font-medium text-foreground mb-6 font-display leading-tight inline-block"
        >
          <span className="block">
            <CountUp end={24104} duration={2} />{' '}restaurants.
          </span>
          <span className="block">
            <CountUp end={47310} duration={2.4} />{' '}inspections.
          </span>

          {/* Hand-drawn underline that draws in */}
          <motion.svg
            className="absolute -bottom-2 left-0 w-full"
            height="8"
            viewBox="0 0 400 8"
            preserveAspectRatio="none"
            initial={{ opacity: 0 }}
            animate={headingInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.8, duration: 0.3 }}
          >
            <motion.path
              d="M2 4 Q 100 2, 200 4 T 398 4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-primary/40"
              initial={{ pathLength: 0 }}
              animate={headingInView ? { pathLength: 1 } : {}}
              transition={{
                delay: 1.8,
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          </motion.svg>
        </h2>

        <p className="text-lg sm:text-xl text-muted-foreground font-serif leading-relaxed max-w-xl mx-auto mb-10 mt-8">
          This data, spanning from 2011 to 2025, comes from the New York City Department of Health
          and Mental Hygiene. Only graded inspections with valid{' '}
          <span className="inline-flex items-center gap-1 mx-1">
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-base">A</span>
            <span className="text-sm text-muted-foreground/70">(score 0–13)</span>
          </span>{' '}
          <span className="inline-flex items-center gap-1 mx-1">
            <span className="font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded text-base">B</span>
            <span className="text-sm text-muted-foreground/70">(score 14–27)</span>
          </span>{' '}
          and{' '}
          <span className="inline-flex items-center gap-1 mx-1">
            <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded text-base">C</span>
            <span className="text-sm text-muted-foreground/70">(score 28+)</span>
          </span>{' '}
          grades were included. Visits that were not graded, pre-permit checks, 
          and inspections that occurred during periods when grades were not assigned 
          (such as during the pandemic) were excluded. 
          The dataset only includes active restaurants.
        </p>

        <button
          onClick={() => {
            const el = document.getElementById('methodology')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          className="inline-flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition-colors duration-300 font-sans cursor-pointer group"
        >
          <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-6" />
          <span>Read our methodology</span>
          <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-6" />
        </button>

        <div className="mt-12 flex items-center justify-center gap-4">
          <span className="w-8 h-px bg-border" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span className="w-8 h-px bg-border" />
        </div>
      </motion.div>
    </section>
  )
}