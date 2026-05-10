"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'
import { useGuess } from '@/context/guess-context'

const modelResults = [
  { factor: 'Location alone', r2: 0.006, delay: 0 },
  { factor: 'Cuisine alone', r2: 0.022, delay: 200 },
  { factor: 'Both, plus density and trends', r2: 0.210, delay: 400 },
  { factor: "Add a restaurant's own history", r2: 0.815, delay: 600 }
]

// Simulated reader stats - in production, this could come from an API
const readerStats: Record<string, number> = {
  'Manhattan': 28,
  'Brooklyn': 41,
  'Queens': 15,
  'Bronx': 12,
  'Staten Island': 4,
  'American': 22,
  'Chinese': 38,
  'Pizza': 18,
  'Mexican': 14,
  'Cafe/Coffee': 8
}

function AnimatedR2({ value, isInView }: { value: number; isInView: boolean }) {
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimated = useRef(false)
  
  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true
    
    let startTime: number
    let animationFrame: number
    const duration = 1800
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayValue(easeOutExpo * value)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, value])
  
  return <span>{displayValue.toFixed(3)}</span>
}

function GuessCallback() {
  const { boroughGuess, cuisineGuess, hasGuessed } = useGuess()
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true })
  
  if (!hasGuessed) return null
  
  const boroughPercent = boroughGuess ? readerStats[boroughGuess] || 0 : 0
  const cuisinePercent = cuisineGuess ? readerStats[cuisineGuess] || 0 : 0
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[70vh] flex items-center justify-center px-6 py-24"
      style={{ backgroundColor: 'var(--dark-bg)' }}
    >
      <div className="max-w-2xl mx-auto text-center relative">
        {/* Corner decorations */}
        <div className="absolute -top-8 -left-8 w-12 h-12 border-t border-l opacity-20" style={{ borderColor: '#c4a76c' }} />
        <div className="absolute -top-8 -right-8 w-12 h-12 border-t border-r opacity-20" style={{ borderColor: '#c4a76c' }} />
        <div className="absolute -bottom-8 -left-8 w-12 h-12 border-b border-l opacity-20" style={{ borderColor: '#c4a76c' }} />
        <div className="absolute -bottom-8 -right-8 w-12 h-12 border-b border-r opacity-20" style={{ borderColor: '#c4a76c' }} />
        
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.4em] mb-8 block"
          style={{ color: '#c4a76c' }}
        >
          Remember your guess?
        </motion.span>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p 
            className="font-serif text-xl sm:text-2xl md:text-3xl leading-relaxed"
            style={{ color: '#f5f0e6' }}
          >
            You guessed{' '}
            <span style={{ color: '#c4a76c' }} className="font-medium">
              {boroughGuess}
            </span>
            .{' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ color: '#a09080' }}
            >
              {boroughPercent}% of readers did too.
            </motion.span>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <p 
            className="font-serif text-xl sm:text-2xl md:text-3xl leading-relaxed"
            style={{ color: '#f5f0e6' }}
          >
            You thought{' '}
            <span style={{ color: '#c4a76c' }} className="font-medium">
              {cuisineGuess}
            </span>
            {' '}food was worst.{' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{ color: '#a09080' }}
            >
              {cuisinePercent}% agreed.
            </motion.span>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex items-center justify-center gap-3 origin-center"
        >
          <span className="w-16 h-px" style={{ backgroundColor: '#c4a76c', opacity: 0.4 }} />
          <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: '#c4a76c', opacity: 0.6 }} />
          <span className="w-16 h-px" style={{ backgroundColor: '#c4a76c', opacity: 0.4 }} />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-lg sm:text-xl font-serif italic"
          style={{ color: '#a09080' }}
        >
          The data says it barely matters.
        </motion.p>
      </div>
    </motion.div>
  )
}

function ModelResult({ factor, r2, delay, isLast }: { factor: string; r2: number; delay: number; isLast: boolean }) {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true })
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.9, 
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="min-h-[50vh] flex flex-col items-center justify-center px-6"
    >
      <motion.p 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-serif text-lg sm:text-xl text-muted-foreground mb-6 text-center max-w-md italic"
      >
        {factor}:
      </motion.p>
      
      <div className="relative">
        {/* Decorative bracket for final result */}
        <AnimatePresence>
          {isLast && isInView && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -inset-6 border-2 border-primary/30"
            />
          )}
        </AnimatePresence>
        
        <p 
          className={`font-mono tracking-tight text-foreground relative z-10 ${
            isLast 
              ? 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary' 
              : 'text-4xl sm:text-5xl md:text-6xl'
          }`}
        >
          R² = <AnimatedR2 value={r2} isInView={isInView} />
        </p>
      </div>
      
      {isLast && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 max-w-lg text-center"
        >
          <p className="font-serif text-base sm:text-lg text-muted-foreground leading-relaxed">
            Place and cuisine explain almost nothing. What predicts a restaurant&apos;s score 
            is the restaurant itself, over time.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export function ModelReveal() {
  return (
    <section className="relative">
      {/* Guess callback - appears before the model results */}
      <GuessCallback />
      
      {/* Model results section */}
      <div className="py-24 border-t border-border relative bg-background">
        {/* Decorative vertical line */}
        <div className="absolute left-1/2 top-32 bottom-32 w-px bg-border/40 -translate-x-1/2" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mx-auto px-6 mb-16 text-center relative z-10"
        >
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
            The Model
          </span>
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-medium text-foreground"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Testing the patterns
          </h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex items-center justify-center gap-3 origin-center"
          >
            <span className="w-10 h-px bg-border" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span className="w-10 h-px bg-border" />
          </motion.div>
        </motion.div>
        
        {modelResults.map((result, index) => (
          <ModelResult 
            key={result.factor}
            factor={result.factor}
            r2={result.r2}
            delay={result.delay}
            isLast={index === modelResults.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
