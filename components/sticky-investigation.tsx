"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const narrativeSteps = [
  {
    id: 'ecosystems',
    title: 'Geography of food ecosystems',
    content: 'Cuisines are not uniformly distributed across the city. Each borough hosts a distinct food ecosystem—a reflection of immigration patterns, rent economics, and neighborhood character. Manhattan sees more French and Japanese; Queens dominates in South Asian and Latin American cuisines.',
    visualization: 'heatmap'
  },
  {
    id: 'density',
    title: 'Population pressure',
    content: 'You might expect denser neighborhoods to have worse inspection outcomes. More foot traffic, more pressure, more violations. But the correlation is weak: -0.20. Density alone explains almost nothing about restaurant scores.',
    visualization: 'scatter'
  },
  {
    id: 'time',
    title: 'Time and recovery',
    content: 'The inspection system captures correction cycles, not just failures. Restaurants improve after bad scores. The median score across boroughs has trended downward over time—not because kitchens got dirtier, but because the system incentivizes improvement.',
    visualization: 'trend'
  }
]

function VisualizationPlaceholder({ type, isActive }: { type: string; isActive: boolean }) {
  const visualizations: Record<string, { label: string; color: string }> = {
    heatmap: { label: 'Borough × Cuisine Heatmap', color: 'var(--chart-1)' },
    scatter: { label: 'Manhattan NTA Scatter', color: 'var(--chart-3)' },
    trend: { label: 'Borough Median Trend', color: 'var(--chart-2)' }
  }
  
  const viz = visualizations[type] || { label: 'Visualization', color: 'var(--chart-1)' }
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0.2, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full flex flex-col items-center justify-center p-8"
    >
      <div 
        className="w-full max-w-md aspect-square border border-dashed flex items-center justify-center relative overflow-hidden"
        style={{ borderColor: viz.color }}
      >
        {/* Animated background pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 0.1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{ 
            background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${viz.color} 10px, ${viz.color} 11px)`
          }}
        />
        
        <div className="text-center relative z-10">
          <motion.div 
            animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-4 rounded-sm"
            style={{ backgroundColor: viz.color, opacity: isActive ? 0.4 : 0.2 }}
          />
          <span className="font-sans text-sm text-muted-foreground">
            {viz.label}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function StickyInvestigation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const section = sectionRef.current
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionHeight = rect.height
      const windowHeight = window.innerHeight
      
      const scrollProgress = (-sectionTop + windowHeight * 0.3) / (sectionHeight - windowHeight * 0.7)
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress))
      
      const stepIndex = Math.min(
        Math.floor(clampedProgress * narrativeSteps.length),
        narrativeSteps.length - 1
      )
      setActiveStep(stepIndex)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <section ref={sectionRef} className="relative">
      {/* Section header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto px-6 py-16 text-center"
      >
        <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
          The Investigation
        </span>
        <h2 
          className="text-4xl sm:text-5xl font-medium text-foreground"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          What shapes a score?
        </h2>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row">
        {/* Sticky visualization panel */}
        <div className="lg:w-[55%] lg:sticky lg:top-0 lg:h-screen flex items-center justify-center bg-secondary/20 p-6">
          <AnimatePresence mode="wait">
            {narrativeSteps.map((step, index) => (
              activeStep === index && (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <VisualizationPlaceholder 
                    type={step.visualization} 
                    isActive={true}
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
        
        {/* Scrolling narrative */}
        <div className="lg:w-[45%] py-24 lg:py-0">
          {narrativeSteps.map((step, index) => (
            <motion.div 
              key={step.id}
              className="min-h-screen flex items-center px-6 lg:px-12"
            >
              <motion.div 
                initial={{ opacity: 0.3, x: 20 }}
                animate={{ 
                  opacity: activeStep === index ? 1 : 0.3,
                  x: activeStep === index ? 0 : 20
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-md"
              >
                <span className="font-mono text-xs text-primary mb-4 block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 
                  className="text-3xl sm:text-4xl font-medium mb-6 text-foreground"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  {step.title}
                </h3>
                <p className="font-serif text-lg leading-[1.8] text-muted-foreground">
                  {step.content}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
