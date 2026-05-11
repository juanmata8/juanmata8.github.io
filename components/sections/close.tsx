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

        {/* P1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-12">
            The letter grades displayed in restaurant windows tell a story, but not necessarily the one you would expect. 
            They don't indicate which neighborhoods are "dirty" or which cuisines are "risky." 
            Rather, they show which restaurants have been inspected, how often they have been inspected, and how they have responded.
          </p>
        </motion.div>

        {/* P2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-12">
            We came in expecting the data to confirm our beliefs. 
            Instead, it showed us the opposite. 
            The scores of the cuisines we trusted and the ones we distrusted were only a few points apart. 
            Boroughs that we judged from the outside looked just like the ones we celebrated. 
            Sometimes, when the score shifted, 
            it reflected the world outside the kitchen more than what was happening inside it.
          </p>
        </motion.div>

        {/* P3 — Good news */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-3">
            The most important takeaway is actually reassuring. 
            The system generally works well, and the feedback is overwhelmingly positive. 
            Even where violations cluster, they are concentrated among a small group of restaurants. 
            The top 15% of restaurants account for about half of all penalty points. 
            The vast majority of kitchens across the city are safe, clean, and focused on feeding people.
          </p>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-primary/60 mb-12">
            Full distribution and power-law analysis in the technical notebooks ↓
          </p>
        </motion.div>

        {/* P4 — Two truths */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg sm:text-xl leading-[1.9] text-muted-foreground mb-16">
            However, the data reminds us of another truth: the system is human-made and, therefore, flawed. 
            While inspection scores are helpful, they are not verdicts on cuisine or culture. 
            They are snapshots shaped by timing, attention, and sometimes subtle biases that we don't see because we aren't looking for them. 
            To accurately interpret these grades, we must leave our assumptions at the door.
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
            The kitchen is probably fine. 
          </p>
          <p className="font-serif text-base sm:text-lg italic text-muted-foreground/80 leading-relaxed">
            The next time you walk past a restaurant, take a moment to think about the difference between what you know and what you've assumed.
          </p>
        </motion.div>

      </div>
    </section>
  )
}