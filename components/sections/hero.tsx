"use client"

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const coverY = useTransform(scrollYProgress, [0, 0.8], ["0%", "-100%"])
  const coverOpacity = useTransform(scrollYProgress, [0.5, 0.9], [1, 0])
  const coverPointerEvents = useTransform(scrollYProgress, (v) => v > 0.9 ? "none" : "auto")
  
  return (
    <section ref={containerRef} className="relative h-[200vh]">
      <motion.div 
        style={{ 
          y: coverY, 
          opacity: coverOpacity,
          pointerEvents: coverPointerEvents,
        }}
        className="fixed inset-0 z-50 flex flex-col justify-center items-center px-6 will-change-transform"
      >
        <div className="absolute inset-0 bg-menu-bg" />
        
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(61, 90, 115, 0.3) 0%, transparent 60%)',
          }}
        />
        
        <div className="absolute inset-6 sm:inset-12 border border-menu-border/30" />
        <div className="absolute inset-8 sm:inset-14 border border-menu-border/15" />
        
        <div className="absolute top-10 sm:top-16 left-10 sm:left-16 w-8 h-8">
          <div className="absolute top-0 left-0 w-full h-px bg-menu-border/60" />
          <div className="absolute top-0 left-0 w-px h-full bg-menu-border/60" />
        </div>
        <div className="absolute top-10 sm:top-16 right-10 sm:right-16 w-8 h-8">
          <div className="absolute top-0 right-0 w-full h-px bg-menu-border/60" />
          <div className="absolute top-0 right-0 w-px h-full bg-menu-border/60" />
        </div>
        <div className="absolute bottom-10 sm:bottom-16 left-10 sm:left-16 w-8 h-8">
          <div className="absolute bottom-0 left-0 w-full h-px bg-menu-border/60" />
          <div className="absolute bottom-0 left-0 w-px h-full bg-menu-border/60" />
        </div>
        <div className="absolute bottom-10 sm:bottom-16 right-10 sm:right-16 w-8 h-8">
          <div className="absolute bottom-0 right-0 w-full h-px bg-menu-border/60" />
          <div className="absolute bottom-0 right-0 w-px h-full bg-menu-border/60" />
        </div>
        
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs uppercase tracking-[0.5em] mb-8 block text-menu-border">
              Social Data Analysis
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight leading-[0.9] font-display"
          >
            <span className="block text-menu-text">Don't Judge a Kitchen</span>
            <span className="block text-menu-border">by Its Cover</span>
          </motion.h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex items-center justify-center gap-3 origin-center"
          >
            <span className="w-16 h-px bg-menu-border/50" />
            <span className="w-1.5 h-1.5 rotate-45 bg-menu-border/70" />
            <span className="w-16 h-px bg-menu-border/50" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3, ease: "easeOut" }}
            className="mt-8 text-lg sm:text-xl font-serif italic max-w-md mx-auto text-menu-gold/80"
          >
            “If you follow your intuition, you will often misclassify a random event as a systematic pattern.”
            — Daniel Kahneman, Thinking, Fast and Slow
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[20px] tracking-[0.4em] uppercase text-menu-gold/60">
            Open the menu
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-px h-6 bg-menu-border/40" />
            <div className="w-2 h-2 border-b border-r rotate-45 border-menu-border/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}