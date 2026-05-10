"use client"

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'

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
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
            First Look
          </span>
          <h2
            className="text-4xl sm:text-5xl font-medium text-foreground mb-6"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Test your stereotypes
          </h2>
          <p className="font-serif text-lg text-muted-foreground leading-relaxed max-w-xl">
            We tend to have assumptions about which cuisines are "cleaner" or "dirtier."
            The box plots below show score distributions for the most common cuisine types.
            Notice how much the distributions overlap.
          </p>
        </motion.div>

        {/* Box plot image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/boxplot_cuisine.png"
            alt="Inspection score distribution by cuisine"
            className="w-full"
            style={{ mixBlendMode: "multiply" }}
          />
        </motion.div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 p-6 bg-secondary/30 border-l-2 border-primary"
        >
          <p className="font-serif text-base text-foreground leading-relaxed">
            <span className="text-primary font-medium">The surprise:</span> The median scores
            differ by only a few points across all major cuisine types. The variation
            <em> within</em> each cuisine is far greater than the variation <em>between</em> them.
          </p>
        </motion.div>

      </div>
    </section>
  )
}