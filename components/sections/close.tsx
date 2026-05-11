"use client"
import { motion } from 'framer-motion'

export function Close() {
  return (
    <section className="py-32 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      <div className="max-w-xl mx-auto px-6 text-center relative z-10">

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

        {/* P1 — Bias hides */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-12">
            Bias rarely announces itself. It hides in pattern recognition. In urgency. In caution.
            In the quiet feeling that "this just makes sense." Our perceptions of restaurant hygiene
            reveal more about our own biases than we might expect.
          </p>
        </motion.div>

        {/* P2 — What the data showed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-12">
            Cuisines we trust and cuisines we avoid scored within only a few points of each other.
            Boroughs we judge from the outside looked remarkably similar to the ones we celebrate.
            And when the scores did shift, they sometimes reflected forces outside the kitchen as
            much as conditions inside it.
          </p>
        </motion.div>

        {/* P3 — Not a verdict */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-12">
            An inspection score is not a verdict. It's a snapshot of a restaurant moving through a
            system shaped not only by food safety, but by geography, timing, public attention, and
            human judgment.
          </p>
        </motion.div>

        {/* Divider */}
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
            So the next time you choose where to eat, ask yourself:
          </p>
          <p className="font-serif text-base sm:text-lg italic text-muted-foreground/80 leading-relaxed">
            Are you responding to evidence… or to a story your brain already believes?
          </p>
        </motion.div>

      </div>
    </section>
  )
}