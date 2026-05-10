"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const narrativeSteps = [
  {
    id: 'personal-hygiene',
    index: '01',
    title: 'Cleanliness starts with people',
    content: 'Nearly every cuisine falls within the same range. The kitchen habits that inspectors flag most often, such as handwashing, surface sanitation, and food handling, are universal problems, not cultural ones. In fact, Middle Eastern restaurants have the fewest violations in this category. Chinese and Jewish/Kosher restaurants have the most violations, but only by a handful per 100 restaurants..',
    src: '/cleveland_01_personal_hygiene.html',
  },
  {
    id: 'handling-protocols',
    index: '02',
    title: 'How food is handled matters most',
    content: 'No cuisine stands out as particularly careless when it comes to food storage or cross-contamination. Middle Eastern cuisine tops this category, but consider the scale: Roughly 45 violations occur per 100 Middle Eastern restaurants, compared to 30 per 100 Italian restaurants. That\'s an extra violation for every few restaurants!',
    src: '/cleveland_02_handling_protocols.html',
  },
  {
    id: 'pest-control',
    index: '03',
    title: 'The invisible guests',
    content: 'Rats and roaches don\'t discriminate based on cuisine. Every cuisine falls within a range of 100 to 130 violations per 100 restaurants, which is the tightest spread of any category. The city\'s pest problem stems from building issues, not kitchen culture.',
    src: '/cleveland_03_pest_control.html',
  },
  {
    id: 'thermal-safety',
    index: '04',
    title: 'Temperature is life and death',
    content: 'This is the closest any category comes to showing a significant difference. Indian and Chinese cuisines score the highest, likely due to their complex cooking processes involving longer holding times. However, no cuisine is exempt from this category.',
    src: '/cleveland_04_thermal_safety.html',
  },
  {
    id: 'infrastructure',
    index: '05',
    title: 'The building beneath the kitchen',
    content: 'They have the most violations overall, as well as the most equal distribution. Each cuisine has between 160 and 180 violations per 100 restaurants. A broken ventilation fan or a cracked floor tile does not discriminate based on menu items.',
    src: '/cleveland_05_infrastructure.html',
  },
]

export function StickyInvestigation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const narrativeRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const narrative = narrativeRef.current
      if (!narrative) return

      const rect = narrative.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // How far we've scrolled into the narrative container
      const scrolled = -rect.top
      const totalScrollable = rect.height - viewportHeight

      // 0 = haven't entered, 1 = scrolled all the way through
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))

      // Divide [0, 1] into 5 equal slices, one per step
      const stepCount = narrativeSteps.length
      const current = Math.min(
        stepCount - 1,
        Math.floor(progress * stepCount)
      )

      setActiveStep(current)
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
          Light Beginnings
        </span>
        <h2
          className="text-4xl sm:text-5xl font-medium text-foreground"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          What shapes a score?
        </h2>
        <p className="font-serif text-base text-muted-foreground mt-4 leading-relaxed">
          Violations break down into five categories. Scroll to see how each cuisine compares. (Note: Hover over the dots to see more information.)
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row">

        {/* Sticky iframe panel */}
        <div className="lg:w-[60%] lg:sticky lg:top-0 lg:h-screen flex items-center justify-center bg-secondary/10 p-4 lg:p-8 relative">
          <AnimatePresence mode="wait">
            {narrativeSteps.map((step, index) =>
              activeStep === index ? (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <iframe
                    src={step.src}
                    className="w-full"
                    style={{ height: '340px', border: 'none' }}
                    title={step.title}
                  />
                </motion.div>
              ) : null
            )}
          </AnimatePresence>

          {/* Step indicator dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {narrativeSteps.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeStep === i ? 20 : 6,
                  height: 6,
                  backgroundColor: activeStep === i ? 'var(--primary)' : 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Scrolling narrative — each step is exactly 100vh */}
        <div ref={narrativeRef} className="lg:w-[40%] py-12 lg:py-0">
          {narrativeSteps.map((step, index) => (
            <div
              key={step.id}
              className="min-h-screen flex items-center px-6 lg:px-10"
            >
              <motion.div
                animate={{
                  opacity: activeStep === index ? 1 : 0.25,
                  x: activeStep === index ? 0 : 16,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-sm"
              >
                <span className="font-mono text-xs text-primary mb-3 block">
                  {step.index}
                </span>
                <h3
                  className="text-3xl sm:text-4xl font-medium mb-5 text-foreground"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  {step.title}
                </h3>
                <p className="font-serif text-base leading-[1.85] text-muted-foreground">
                  {step.content}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}