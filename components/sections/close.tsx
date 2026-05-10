"use client"
import { motion } from 'framer-motion'

export function Close() {
  return (
    <section className="py-32 border-t border-border relative overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      <div className="max-w-xl mx-auto px-6 text-center relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
            What we learned
          </span>
          <h2
            className="text-4xl sm:text-5xl font-medium text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The grade on the door is only part of the story
          </h2>
        </motion.div>

        {/* First paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-12">
            The letter grades on restaurant windows tell a story — but not the one you think.
            They don&apos;t reveal which neighborhoods are &quot;dirty&quot; or which cuisines are &quot;risky.&quot;
            They reveal which restaurants have been looked at, how often, and how they responded.
          </p>
        </motion.div>

        {/* Second paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-12">
            We came in expecting the data to confirm what we already believed. Instead, it
            showed us the opposite. Cuisines we trust and cuisines we distrust scored
            within a handful of points of each other. Boroughs we judge from the outside
            looked just like the ones we celebrate. And when the score did shift, it sometimes
            reflected the world outside the kitchen more than what was happening inside it.
          </p>
        </motion.div>

        {/* Third paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-16">
            An inspection score is not a verdict. It&apos;s a snapshot of a restaurant navigating
            a system shaped by geography, timing, attention, and human judgment as much as
            by what&apos;s on the stove.
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className="w-16 h-px bg-primary/30" />
          <span className="w-2 h-2 rounded-full bg-primary/40" />
          <span className="w-16 h-px bg-primary/30" />
        </motion.div>

        {/* Final takeaway */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-3xl sm:text-4xl md:text-5xl font-medium leading-snug text-foreground mb-6"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            The map lies. So do our instincts.
          </p>
          <p className="font-serif text-base sm:text-lg italic text-muted-foreground/80 leading-relaxed">
            Next time you walk past a restaurant — ask what you actually know,
            and what you only assumed.
          </p>
        </motion.div>

      </div>
    </section>
  )
}