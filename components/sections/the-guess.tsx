"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'
import { useGuess } from '@/context/guess-context'

const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']
const cuisines = ['Italian', 'Mexican', 'Middle Eastern', 'Kosher', 'American']

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-5 py-3 font-serif text-base sm:text-lg border rounded-sm
        transition-all duration-300
        ${selected
          ? 'bg-menu-border text-menu-bg border-menu-border'
          : 'bg-transparent text-menu-text border-menu-border/40 hover:border-menu-border/70'
        }
      `}
    >
      {label}
    </motion.button>
  )
}

// ─── Question Card ────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  options,
  selectedOption,
  onSelect,
  questionNumber,
}: {
  question: string
  options: string[]
  selectedOption: string | null
  onSelect: (option: string) => void
  questionNumber: number
}) {
  const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl mx-auto"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex w-8 h-8 rounded-full border border-menu-border/50 text-menu-border text-sm font-mono items-center justify-center mb-6"
      >
        {questionNumber}
      </motion.span>

      <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-menu-text mb-10 leading-snug font-display">
        {question}
      </h3>

      <div className="flex flex-wrap gap-3 justify-center">
        {options.map((option, index) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <OptionButton
              label={option}
              selected={selectedOption === option}
              onClick={() => onSelect(option)}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedOption && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-8 text-center text-menu-gold/70 font-serif italic"
          >
            Noted.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Survey Toast ─────────────────────────────────────────────────────────────

function SurveyToast({ onClose }: { onClose: () => void }) {
  const [showImages, setShowImages] = useState(false)

  return (
    <>
      {/* Backdrop — click outside to close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Toast panel */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[min(460px,94vw)]"
      >
        <div className="bg-[#131920] border border-b-0 border-menu-border/28 rounded-t-[4px] px-[22px] py-[22px] shadow-[0_-6px_28px_rgba(0,0,0,0.45)]">

          {/* Intro */}
          <p className="font-serif italic text-[13px] leading-relaxed text-menu-gold/60 mb-4 pb-4 border-b border-menu-border/10">
            We ran a survey asking around{' '}
            <span className="not-italic text-menu-text font-medium">50 people</span>{' '}
            about their perception of restaurant sanitation. Here&apos;s what they said.
          </p>

          {/* Summary */}
          <div className="flex flex-col gap-[10px] mb-4">
            <div className="flex gap-3 items-start">
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-menu-border pt-[3px] min-w-[52px]">
                Top pick
              </span>
              <p className="font-sans text-[12px] leading-relaxed text-menu-gold/72">
                <span className="text-menu-text font-medium">Chinese</span> and{' '}
                <span className="text-menu-text font-medium">Indian</span> cuisines were
                ranked #1 worst for sanitation by the majority of respondents.
              </p>
            </div>

            <div className="w-full h-px bg-menu-border/10" />

            <div className="flex gap-3 items-start">
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-menu-border pt-[3px] min-w-[52px]">
                Why?
              </span>
              <p className="font-sans text-[12px] leading-relaxed text-menu-gold/72">
                <span className="text-menu-text font-medium">43%</span> said personal
                experience shaped their view — but{' '}
                <span className="text-menu-text font-medium">25%</span> admitted it was
                down to{' '}
                <span className="text-menu-text font-medium">general stereotypes</span>,
                not actual knowledge.
              </p>
            </div>

            <div className="w-full h-px bg-menu-border/10" />

            <div className="flex gap-3 items-start">
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-menu-border pt-[3px] min-w-[52px]">
                And yet
              </span>
              <p className="font-sans text-[12px] leading-relaxed text-menu-gold/72">
                Most people rated sanitation as{' '}
                <span className="text-menu-text font-medium">very important</span> when
                choosing a restaurant — scoring it a 4 or 10 out of 10.
              </p>
            </div>
          </div>

          {/* Toggle images */}
          <button
            onClick={() => setShowImages(v => !v)}
            className="text-[10px] uppercase tracking-[0.18em] font-sans text-menu-border/50 border-b border-menu-border/20 pb-px hover:text-menu-border hover:border-menu-border/45 transition-colors duration-200"
          >
            {showImages ? 'Hide the full results ↑' : 'See the full results →'}
          </button>

          {/* Images */}
          <AnimatePresence>
            {showImages && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2 mt-4">
                  <img
                    src="/survey-sanitation-importance.png"
                    alt="Survey: how important is sanitation when choosing a restaurant"
                    className="w-full rounded-sm border border-menu-border/15"
                  />
                  <img
                    src="/survey-cuisine-ranking.png"
                    alt="Survey: cuisine type ranked worst for sanitation"
                    className="w-full rounded-sm border border-menu-border/15"
                  />
                  <img
                    src="/survey-perception-reason.png"
                    alt="Survey: primary reason for sanitation perception"
                    className="w-full rounded-sm border border-menu-border/15"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer — visible close button */}
          <div className="flex justify-end mt-4 pt-3 border-t border-menu-border/10">
            <button
              onClick={onClose}
              className="
                flex items-center gap-2 px-4 py-2 rounded-sm
                font-sans text-[11px] uppercase tracking-[0.18em]
                border border-menu-border/35 text-menu-gold/70
                hover:border-menu-border/65 hover:text-menu-gold
                transition-all duration-200
              "
            >
              Close ↓
            </button>
          </div>

        </div>
      </motion.div>
    </>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function TheGuess() {
  const { boroughGuess, cuisineGuess, setBoroughGuess, setCuisineGuess, hasGuessed } = useGuess()
  const { ref: sectionRef, isInView: sectionInView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [toastOpen, setToastOpen] = useState(false)

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 relative overflow-hidden bg-menu-bg"
    >
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Blue gradient glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(61, 90, 115, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-20 relative z-10"
      >
        <span className="text-xs uppercase tracking-[0.4em] mb-4 block text-menu-border">
          Before we begin
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium font-display text-menu-text">
          What do you think?
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={sectionInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex items-center justify-center gap-3 origin-center"
        >
          <span className="w-12 h-px bg-menu-border/40" />
          <span className="w-1 h-1 rounded-full bg-menu-border/60" />
          <span className="w-12 h-px bg-menu-border/40" />
        </motion.div>
      </motion.div>

      {/* Questions */}
      <div className="relative z-10 space-y-32">
        <QuestionCard
          question="Which NYC borough do you think has the worst restaurant inspection scores?"
          options={boroughs}
          selectedOption={boroughGuess}
          onSelect={setBoroughGuess}
          questionNumber={1}
        />
        <QuestionCard
          question="Which cuisine type do you think gets the worst scores?"
          options={cuisines}
          selectedOption={cuisineGuess}
          onSelect={setCuisineGuess}
          questionNumber={2}
        />
      </div>

      {/* Inline completion block */}
      <AnimatePresence>
        {hasGuessed && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-2xl mx-auto mt-24 text-center"
          >
            <p className="font-serif italic text-lg sm:text-xl leading-relaxed text-menu-gold/60 mb-2">
              We&apos;ll come back to your answers while exploring the data.
            </p>
            <p className="font-serif text-xl sm:text-2xl font-medium text-menu-text mb-8">
              Keep scrolling.
            </p>

            {/* Scroll line */}
            <div className="flex flex-col items-center mb-10">
              <motion.div
                animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-8 bg-menu-border/28 origin-center"
              />
            </div>

            {/* Curious prompt */}
            <p className="font-sans text-[11px] tracking-[0.05em] text-menu-border/45 mb-4">
              But first — curious what 50 others said about cuisine perception?
            </p>

            <motion.button
              onClick={() => setToastOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block bg-transparent border border-menu-border/28 text-menu-gold/55 font-sans text-[11px] uppercase tracking-[0.22em] px-5 py-[10px] rounded-sm hover:border-menu-border/55 hover:text-menu-gold transition-all duration-200"
            >
              We asked 50 people 3 questions →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-menu-border/25" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-menu-border/25" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-menu-border/25" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-menu-border/25" />

      {/* Survey toast */}
      <AnimatePresence>
        {toastOpen && (
          <SurveyToast onClose={() => setToastOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  )
}