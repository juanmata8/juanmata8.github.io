"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// ─── 1. NARRATIVE STEPS (unchanged) ────────────────────────────────────────
const narrativeSteps = [
  {
    id: 'personal-hygiene',
    index: '01',
    title: 'Cleanliness starts with people',
    content:
      'Nearly every cuisine falls within the same range. The kitchen habits that inspectors flag most often, such as handwashing, surface sanitation, and food handling, are universal problems, not cultural ones. In fact, Middle Eastern restaurants have the fewest violations in this category. Chinese and Jewish/Kosher restaurants have the most violations, but only by a handful per 100 restaurants.',
    src: '/cleveland_01_personal_hygiene.html',
  },
  {
    id: 'handling-protocols',
    index: '02',
    title: 'How food is handled matters most',
    content:
      "No cuisine stands out as particularly careless when it comes to food storage or cross-contamination. Middle Eastern cuisine tops this category, but consider the scale: Roughly 45 violations occur per 100 Middle Eastern restaurants, compared to 30 per 100 Italian restaurants. That's an extra violation for every few restaurants!",
    src: '/cleveland_02_handling_protocols.html',
  },
  {
    id: 'pest-control',
    index: '03',
    title: 'The invisible guests',
    content:
      "Rats and roaches don't discriminate based on cuisine. Every cuisine falls within a range of 100 to 130 violations per 100 restaurants, which is the tightest spread of any category. The city's pest problem stems from building issues, not kitchen culture.",
    src: '/cleveland_03_pest_control.html',
  },
  {
    id: 'thermal-safety',
    index: '04',
    title: 'Temperature is life and death',
    content:
      'This is the closest any category comes to showing a significant difference. Indian and Chinese cuisines score the highest, likely due to their complex cooking processes involving longer holding times. However, no cuisine is exempt from this category.',
    src: '/cleveland_04_thermal_safety.html',
  },
  {
    id: 'infrastructure',
    index: '05',
    title: 'The building beneath the kitchen',
    content:
      'They have the most violations overall, as well as the most equal distribution. Each cuisine has between 160 and 180 violations per 100 restaurants. A broken ventilation fan or a cracked floor tile does not discriminate based on menu items.',
    src: '/cleveland_05_infrastructure.html',
  },
]

// ─── 2. VIOLATION MAP — what each category actually penalizes ───────────────
const CATEGORY_VIOLATIONS: Record<string, { code: string; label: string }[]> = {
  'personal-hygiene': [
    { code: '06A', label: 'Personal cleanliness inadequate' },
    { code: '06B', label: 'Tobacco or eating in food prep area' },
    { code: '06C', label: 'Food not protected from contamination' },
    { code: '06D', label: 'Food contact surface not sanitized' },
    { code: '06E', label: 'Sanitized utensil improperly stored' },
    { code: '06F', label: 'Wiping cloths improperly stored' },
    { code: '06G', label: 'HACCP plan not approved' },
    { code: '06H', label: 'HACCP records not maintained' },
  ],
  'handling-protocols': [
    { code: '04A', label: 'Food Protection Certificate not held' },
    { code: '04B', label: 'Food worker working while sick' },
    { code: '04C', label: 'Bare hand contact with food' },
    { code: '04D', label: 'Handwashing after toilet or coughing' },
    { code: '04E', label: 'Toxic chemical improperly stored' },
    { code: '04F', label: 'Food prep area contaminated' },
    { code: '04H', label: 'Food adulterated or cross-contaminated' },
    { code: '04I', label: 'Non-TCS food re-served' },
    { code: '04J', label: 'Thermometer not provided' },
    { code: '04P', label: 'Food containing prohibited substance' },
    { code: '05A', label: 'Sewage disposal improper' },
    { code: '05B', label: 'Harmful gas or CO detected' },
    { code: '05C', label: 'Food contact surface improperly constructed' },
    { code: '05D', label: 'No handwashing facility' },
    { code: '05E', label: 'Toilet facility not provided' },
    { code: '05F', label: 'Insufficient cold or hot holding equipment' },
    { code: '05H', label: 'No SOP for refillable containers' },
    { code: '09E', label: 'Wash hands sign not posted' },
    { code: '03I', label: 'Juice packaged on-premises, no label' },
    { code: '28-05', label: 'Food adulterated or misbranded' },
  ],
  'pest-control': [
    { code: '04K', label: 'Evidence of rats' },
    { code: '04L', label: 'Evidence of mice' },
    { code: '04M', label: 'Live roaches present' },
    { code: '04N', label: 'Filth flies or nuisance pests' },
    { code: '04O', label: 'Live animal other than fish' },
    { code: '08A', label: 'Harborage conditions for rodents/insects' },
    { code: '08B', label: 'Garbage receptacle not pest resistant' },
    { code: '08C', label: 'Pesticide improperly used' },
    { code: '28-06', label: 'No pest management contract on premises' },
  ],
  'thermal-safety': [
    { code: '02A', label: 'TCS food not cooked to minimum temp' },
    { code: '02B', label: 'Hot food not held at or above 140°F' },
    { code: '02C', label: 'Cooked food not reheated before service' },
    { code: '02D', label: 'Pre-cooked TCS not held at proper temp' },
    { code: '02F', label: 'Raw meat or fish served undercooked' },
    { code: '02G', label: 'Cold TCS food held above 41°F' },
    { code: '02H', label: 'TCS food not cooled by approved method' },
    { code: '02I', label: 'TCS food not cooled from 140°F to 70°F' },
    { code: '03A', label: 'Food from unapproved source' },
    { code: '03B', label: 'Shellfish not from approved source' },
    { code: '03C', label: 'Unclean or cracked eggs kept or used' },
    { code: '03D', label: 'Food package not in good condition' },
    { code: '03E', label: 'No potable water supply' },
    { code: '03F', label: 'Unpasteurized milk served' },
    { code: '03G', label: 'Raw fruit or vegetable not properly washed' },
  ],
  'infrastructure': [
    { code: '07A', label: 'Officer duties obstructed' },
    { code: '09A', label: 'Damaged canned food not segregated' },
    { code: '09B', label: 'Thawing procedure improper' },
    { code: '09C', label: 'Food contact surface not maintained' },
    { code: '09D', label: 'Food operation in living/sleeping quarters' },
    { code: '10A', label: 'Toilet facility not maintained' },
    { code: '10B', label: 'Anti-siphonage device not provided' },
    { code: '10C', label: 'Lighting inadequate' },
    { code: '10D', label: 'Ventilation not provided or inadequate' },
    { code: '10E', label: 'Accurate thermometer not in fridge' },
    { code: '10F', label: 'Non-food contact surface unacceptable' },
    { code: '10G', label: 'Dishwashing or ware washing improper' },
    { code: '10H', label: 'Proper sanitization not provided' },
    { code: '10I', label: 'Single service item reused' },
    { code: '10J', label: 'Hand wash sign not posted' },
    { code: '28-07', label: 'Unapproved outdoor or sidewalk cooking' },
  ],
}

// ─── 3a. VIOLATIONS ACCORDION — lives in the sticky left panel ──────────────
//
// Separate component so it gets its own `open` state that resets to false
// whenever the active step changes (because AnimatePresence unmounts it).

function ViolationsAccordion({
  violations,
}: {
  violations: { code: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-4 border-l-2 border-primary pl-4 py-3 bg-background/60 rounded-r-md"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
        aria-expanded={open}
      >
        <span className="font-medium">What gets penalized in this category</span>
        <ChevronDown
          className={`w-3 h-3 ml-auto shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {violations.map((v) => (
                <div
                  key={v.code}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <code className="font-mono text-[11px] text-primary shrink-0 pt-px">
                    {v.code}
                  </code>
                  <span>{v.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── 3b. NARRATIVE STEP — scrolling right panel, no accordion here anymore ──

function NarrativeStep({
  step,
  isActive,
}: {
  step: (typeof narrativeSteps)[number]
  isActive: boolean
}) {
  return (
    <div className="min-h-screen flex items-center px-6 lg:px-10">
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0.25,
          x: isActive ? 0 : 16,
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
  )
}

// ─── 4. MAIN COMPONENT (mostly unchanged, narrative now uses NarrativeStep) ──
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
      const scrolled = -rect.top
      const totalScrollable = rect.height - viewportHeight
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))
      const stepCount = narrativeSteps.length
      const current = Math.min(stepCount - 1, Math.floor(progress * stepCount))

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
          Violations break down into five categories. Scroll to see how each cuisine
          compares. (Note: Hover over the dots to see more information.)
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row">

        {/* Sticky iframe panel */}
        <div className="lg:w-[60%] lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center bg-secondary/10 p-4 lg:p-8 relative">

          {/* iframe — animates in/out on step change */}
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

          {/* Violations accordion — sits below the chart, swaps with the step */}
          <AnimatePresence mode="wait">
            {narrativeSteps.map((step, index) => {
              if (activeStep !== index) return null
              const violations = CATEGORY_VIOLATIONS[step.id] ?? []
              if (!violations.length) return null
              return (
                <ViolationsAccordion key={step.id} violations={violations} />
              )
            })}
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
                  backgroundColor:
                    activeStep === i ? 'var(--primary)' : 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Scrolling narrative — now uses NarrativeStep sub-component */}
        <div ref={narrativeRef} className="lg:w-[40%] py-12 lg:py-0">
          {narrativeSteps.map((step, index) => (
            <NarrativeStep
              key={step.id}
              step={step}
              isActive={activeStep === index}
            />
          ))}
        </div>

      </div>
    </section>
  )
}