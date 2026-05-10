"use client"

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'

const cuisineRankings = [
  { name: 'Japanese', avgScore: 12.3, aRate: 89 },
  { name: 'French', avgScore: 12.8, aRate: 87 },
  { name: 'Italian', avgScore: 13.5, aRate: 85 },
  { name: 'Korean', avgScore: 14.1, aRate: 84 },
  { name: 'Thai', avgScore: 14.8, aRate: 82 },
  { name: 'American', avgScore: 15.2, aRate: 81 },
  { name: 'Indian', avgScore: 15.9, aRate: 79 },
  { name: 'Mexican', avgScore: 16.4, aRate: 78 },
  { name: 'Pizza', avgScore: 16.8, aRate: 77 },
  { name: 'Chinese', avgScore: 17.5, aRate: 75 },
  { name: 'Caribbean', avgScore: 18.2, aRate: 73 },
  { name: 'Bakery', avgScore: 18.9, aRate: 71 },
]

function DotPlotRow({ data, index, isInView, maxScore }: { 
  data: typeof cuisineRankings[0]; 
  index: number; 
  isInView: boolean;
  maxScore: number;
}) {
  const position = (data.avgScore / maxScore) * 100
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="flex items-center gap-4 py-2 group hover:bg-secondary/20 transition-colors duration-300 -mx-2 px-2"
    >
      {/* Rank number */}
      <span className="w-6 font-mono text-xs text-muted-foreground/60">
        {index + 1}.
      </span>
      
      {/* Cuisine name */}
      <span className="w-24 font-serif text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {data.name}
      </span>
      
      {/* Dot plot track */}
      <div className="flex-1 h-8 relative">
        {/* Background track */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border/50 -translate-y-1/2" />
        
        {/* Connecting line from left to dot */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-0 h-px bg-primary/40 -translate-y-1/2 origin-left"
          style={{ width: `${position}%` }}
        />
        
        {/* The dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.06 + 0.5, 
            ease: [0.22, 1, 0.36, 1],
            type: "spring",
            stiffness: 200
          }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary group-hover:scale-125 transition-transform duration-300"
          style={{ left: `${position}%` }}
        />
      </div>
      
      {/* Score value */}
      <motion.span 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 + 0.6 }}
        className="w-12 text-right font-mono text-sm text-foreground"
      >
        {data.avgScore}
      </motion.span>
      
      {/* A-rate */}
      <motion.span 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 + 0.7 }}
        className="w-12 text-right font-mono text-xs text-muted-foreground"
      >
        {data.aRate}% A
      </motion.span>
    </motion.div>
  )
}

export function ClevelandDotPlot() {
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: true })
  const maxScore = Math.max(...cuisineRankings.map(d => d.avgScore)) * 1.15
  
  return (
    <section ref={ref} className="py-24 border-t border-border bg-secondary/10">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
            Ranking
          </span>
          <h2 
            className="text-4xl sm:text-5xl font-medium text-foreground mb-6"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            The full picture
          </h2>
          <p className="font-serif text-lg text-muted-foreground leading-relaxed max-w-xl">
            Now let&apos;s rank all major cuisines by their average inspection score. 
            The dots show how close the scores actually are — the entire range spans 
            just 6 points.
          </p>
        </motion.div>
        
        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 text-xs font-sans uppercase tracking-wider text-muted-foreground/60 mb-4 pb-2 border-b border-border/50"
        >
          <span className="w-6">#</span>
          <span className="w-24">Cuisine</span>
          <span className="flex-1 text-center">Average Score</span>
          <span className="w-12 text-right">Score</span>
          <span className="w-12 text-right">A Rate</span>
        </motion.div>
        
        {/* Dot plot rows */}
        <div className="space-y-0">
          {cuisineRankings.map((data, index) => (
            <DotPlotRow 
              key={data.name} 
              data={data} 
              index={index} 
              isInView={isInView}
              maxScore={maxScore}
            />
          ))}
        </div>
        
        {/* Insight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 p-6 bg-background border border-border"
        >
          <p className="font-serif text-base text-foreground leading-relaxed">
            <span className="text-primary font-medium">The pattern emerges:</span> Yes, there 
            are differences — Japanese restaurants average 5 points better than Bakeries. But consider: 
            the difference between an A and a B grade is 14 points. Cuisine type alone can&apos;t 
            explain who gets which grade.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
