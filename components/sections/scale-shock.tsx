"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'

interface AnimatedCounterProps {
  value: number
  label: string
  duration?: number
  index: number
}

function AnimatedCounter({ value, label, duration = 2500, index }: AnimatedCounterProps) {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true })
  const [displayCount, setDisplayCount] = useState("0")
  const [isAnimating, setIsAnimating] = useState(false)
  const hasAnimated = useRef(false)
  
  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true
    setIsAnimating(true)
    
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Extra smooth easing with slight overshoot feel
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -12 * progress)
      const currentCount = Math.floor(easeOutExpo * value)
      
      setDisplayCount(currentCount.toLocaleString())
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }
    
    // Small delay before starting
    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, index * 250)
    
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(animationFrame)
    }
  }, [isInView, value, duration, index])
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.9, 
        delay: index * 0.18,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="min-h-[35vh] flex flex-col items-center justify-center px-6"
    >
      <div className="relative">
        {/* Decorative lines */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: index * 0.18 + 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-center"
        />
        
        <motion.span 
          className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground tabular-nums block"
          animate={isAnimating ? { 
            filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'],
          } : {}}
          transition={{ 
            duration: 0.15, 
            repeat: isAnimating ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          {displayCount}
        </motion.span>
      </div>
      
      <motion.span 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: index * 0.18 + 0.8 }}
        className="mt-6 font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground"
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

export function ScaleShock() {
  const { ref: sectionRef, isInView: sectionInView } = useInView({ threshold: 0.1, triggerOnce: true })
  
  return (
    <section ref={sectionRef} className="py-32 relative">
      {/* Section header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto px-6 mb-12 text-center"
      >
        <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
          The Data
        </span>
        <h2 
          className="text-3xl sm:text-4xl font-medium text-foreground"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          By the numbers
        </h2>
      </motion.div>
      
      <AnimatedCounter value={279322} label="violation rows" index={0} />
      <AnimatedCounter value={83638} label="inspections" index={1} duration={2300} />
      <AnimatedCounter value={27533} label="restaurants" index={2} duration={2100} />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto px-6 mt-24 text-center"
      >
        <p className="font-serif text-lg leading-relaxed text-muted-foreground">
          Places with longer violation notes were getting penalized in the raw data. 
          These numbers represent the collapse from raw records to meaningful units of analysis.
        </p>
        
        {/* Decorative divider */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex items-center justify-center gap-4 origin-center"
        >
          <span className="w-12 h-px bg-border" />
          <span className="w-2 h-2 rounded-full bg-primary/40" />
          <span className="w-12 h-px bg-border" />
        </motion.div>
      </motion.div>
    </section>
  )
}
