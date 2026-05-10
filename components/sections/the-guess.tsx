"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'
import { useGuess } from '@/context/guess-context'

const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']
const cuisines = ['Italian', 'Mexican', 'Middle Eastern', 'Kosher', 'American']

function OptionButton({ 
  label, 
  selected, 
  onClick 
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
        relative px-5 py-3 font-serif text-base sm:text-lg transition-all duration-300
        border rounded-sm
        ${selected 
          ? 'bg-menu-border text-menu-bg border-menu-border' 
          : 'bg-transparent text-menu-text border-menu-border/40 hover:border-menu-border/70'
        }
      `}
    >
      {label}
      {selected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute inset-0 bg-menu-border rounded-sm -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </motion.button>
  )
}

function QuestionCard({ 
  question, 
  options, 
  selectedOption, 
  onSelect,
  questionNumber 
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
      {/* Question number */}
      <motion.span 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex w-8 h-8 rounded-full border border-menu-border/50 text-menu-border text-sm font-mono items-center justify-center mb-6"
      >
        {questionNumber}
      </motion.span>
      
      {/* Question text */}
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-menu-text mb-10 leading-snug font-display">
        {question}
      </h3>
      
      {/* Options grid */}
      <div className="flex flex-wrap gap-3 justify-center">
        {options.map((option, index) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.4 + (index * 0.08),
              ease: [0.22, 1, 0.36, 1] 
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
      
      {/* Selected confirmation */}
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

export function TheGuess() {
  const { boroughGuess, cuisineGuess, setBoroughGuess, setCuisineGuess, hasGuessed } = useGuess()
  const { ref: sectionRef, isInView: sectionInView } = useInView({ threshold: 0.1, triggerOnce: true })
  
  return (
    <section 
      ref={sectionRef}
      className="py-32 px-6 relative overflow-hidden bg-menu-bg"
    >
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />
      
      {/* Subtle blue gradient glow */}
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
      
      {/* Completion message */}
      <AnimatePresence>
        {hasGuessed && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-32 text-center relative z-10"
          >
            <p className="font-serif text-xl sm:text-2xl italic max-w-lg mx-auto leading-relaxed text-menu-gold/70">
              We&apos;ll come back to your answers. <br />
              <span className="text-menu-text">Keep scrolling.</span>
            </p>
            
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="mt-10 flex flex-col items-center"
            >
              <div className="w-px h-12 bg-menu-border/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Corner decorations in blue */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-menu-border/25" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-menu-border/25" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-menu-border/25" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-menu-border/25" />
    </section>
  )
}
