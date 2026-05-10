"use client"

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'

const provocations = [
  "You think you know which neighborhoods are dirty.",
  "You think you know which cuisines to avoid.",
  "You're wrong about both."
]

function ProvocationLine({ text, index }: { text: string; index: number }) {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true })
  
  return (
    <div 
      ref={ref}
      className="min-h-[50vh] flex items-center justify-center px-6"
    >
      <motion.p 
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 40, filter: 'blur(8px)' }}
        transition={{ 
          duration: 1, 
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center max-w-3xl leading-snug italic text-menu-text"
      >
        {text}
      </motion.p>
    </div>
  )
}

export function Provocation() {
  return (
    <section 
      className="py-32 relative overflow-hidden bg-menu-bg"
    >
      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />
      
      {/* Decorative corner flourishes in blue */}
      <div className="absolute top-10 left-10 w-16 h-16 border-t border-l border-menu-border/25" />
      <div className="absolute top-10 right-10 w-16 h-16 border-t border-r border-menu-border/25" />
      <div className="absolute bottom-10 left-10 w-16 h-16 border-b border-l border-menu-border/25" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b border-r border-menu-border/25" />
      
      {/* Vertical decorative line in blue */}
      <div className="absolute left-1/2 top-20 bottom-20 w-px bg-menu-border/15 -translate-x-1/2" />
      
      {provocations.map((text, index) => (
        <ProvocationLine 
          key={index} 
          text={text} 
          index={index}
        />
      ))}
    </section>
  )
}
