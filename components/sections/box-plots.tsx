"use client"

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'
import boxplotData from '@/public/boxplot_cuisine.json'

type CuisineStat = {
  name: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  color: string
}

const X_MAX: number = boxplotData.x_max ?? 50
const cuisineData: CuisineStat[] = boxplotData.cuisines

// Convert a score value to a percentage of the chart width.
const pct = (v: number) => (v / X_MAX) * 100

function BoxPlot({ data, index, isInView }: { data: CuisineStat; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="flex items-center gap-3 sm:gap-4 group"
    >
      {/* Wider label column to fit "Middle Eastern", "Jewish/Kosher", "Mediterranean" */}
      <span className="w-28 sm:w-32 shrink-0 text-right font-serif text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {data.name}
      </span>

      <div className="flex-1 h-10 relative">
        {/* Whisker line: min → max */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 h-px bg-muted-foreground/40 origin-left"
          style={{
            left: `${pct(data.min)}%`,
            width: `${pct(data.max - data.min)}%`
          }}
        />

        {/* Min whisker cap */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-muted-foreground/40"
          style={{ left: `${pct(data.min)}%` }}
        />

        {/* Max whisker cap */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-muted-foreground/40"
          style={{ left: `${pct(data.max)}%` }}
        />

        {/* IQR Box: q1 → q3 */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.7, delay: index * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-y-1/2 h-6 origin-left group-hover:h-7 transition-all duration-300"
          style={{
            left: `${pct(data.q1)}%`,
            width: `${pct(data.q3 - data.q1)}%`,
            backgroundColor: data.color,
            opacity: 0.7
          }}
        />

        {/* Median line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-8 bg-foreground"
          style={{ left: `${pct(data.median)}%` }}
        />
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
        className="w-8 shrink-0 text-left font-mono text-xs text-muted-foreground"
      >
        {Math.round(data.median)}
      </motion.span>
    </motion.div>
  )
}

export function BoxPlots() {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref} className="py-24 border-t border-border bg-background">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="font-sans font-bold text-s uppercase tracking-[0.4em] text-primary mb-4 block">
            Today's Special
          </span>
          <h2
            className="text-4xl sm:text-5xl font-medium text-foreground mb-6"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Test your stereotypes
          </h2>
          <p className="font-serif text-lg text-muted-foreground leading-relaxed max-w-xl">
            You just made your guess. Now, take a look at the chart. Each bar shows the distribution of inspection scores for a specific type of cuisine. 
            The line in the middle shows the median score. The cleaner the restaurant, the closer its score is to the left. Does what you see match your expectations?
          </p>
        </motion.div>

        {/* Box plots */}
        <div className="space-y-4 mb-12">
          {cuisineData.map((data, index) => (
            <BoxPlot key={data.name} data={data} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Scale legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-4 border-t border-border/50"
        >
          <span>0 (Best)</span>
          <span>Inspection Score</span>
          <span>{X_MAX}+ (Worst)</span>
        </motion.div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 p-6 bg-secondary/30 border-l-2 border-primary"
        >
          <p className="font-serif text-base text-foreground leading-relaxed">
            <span className="text-primary font-medium">The kitchen notes:</span> The median score for each cuisine is <strong>12 or 13</strong>, comfortably within the A range. 
            The cuisine you picked as the "worst" probably received a similar score to the one you gave to your favorite. Take a look at the width of each bar. 
            The wider the bar, the greater the variance. Some cuisines are more consistent than others.
          </p>
        </motion.div>
      </div>
    </section>
  )
}