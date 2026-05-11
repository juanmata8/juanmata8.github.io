"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'

const CUISINE_COEFS: Record<string, number> = {
  American: 0,
  Italian: -0.08,
  Mediterranean: -0.26,
  Mexican: -0.40,
  "Jewish/Kosher": -0.51,
  "Middle Eastern": -0.53,
  Chinese: -0.99,
  Indian: -1.46,
}

const BORO_COEFS: Record<string, number> = {
  Bronx: 0,
  Brooklyn: 0.02,
  Manhattan: 0.14,
  "Staten Island": 0.19,
  Queens: -0.29,
}

const HISTORY_COEFS: Record<string, number> = {
  First: -0.32,
  A: 0,
  B: -8.72,
  C: -8.22,
}

const HISTORY_BASE_INTERCEPT = 2.8

const INSIGHTS: Record<string, string> = {
  A: "If a restaurant earned an A last time, it will most likely earn one again. Past performance is the strongest indicator of future success, even stronger than the type of cuisine or the restaurant's location.",
  B: "A previous B grade is a flashing red light. Once a restaurant drops below an A grade, the model predicts that it will drop again, regardless of cuisine or neighborhood.",
  C: "A previous C is the loudest warning the data provides. There are problems in the kitchen that tend to stick around.",
  First: "A brand-new restaurant has no track record. While the cuisine and location can provide some guidance, it's mostly guesswork without a history.",
}

const factors = [
  {
    id: 'cuisine',
    label: 'Cuisine Type',
    options: ['American', 'Italian', 'Mediterranean', 'Mexican', 'Chinese', 'Indian'],
  },
  {
    id: 'borough',
    label: 'Borough',
    options: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
  },
  {
    id: 'history',
    label: 'Past Performance',
    options: [
      { label: 'First inspection', val: 'First' },
      { label: 'Previously A', val: 'A' },
      { label: 'Previously B', val: 'B' },
      { label: 'Previously C', val: 'C' },
    ],
  },
]

// Real normalized coefficients from the full model, normalized to max abs = 1.0
const ALL_FEATURES_COEFS = [
  { feature: 'Previously B',     group: 'Past grade', coef: -1.000 },
  { feature: 'Previously C',     group: 'Past grade', coef: -0.937 },
  { feature: 'First inspection', group: 'Past grade', coef: -0.040 },
  { feature: 'Indian',           group: 'Cuisine',    coef: -0.066 },
  { feature: 'Middle Eastern',   group: 'Cuisine',    coef: -0.057 },
  { feature: 'Chinese',          group: 'Cuisine',    coef: -0.047 },
  { feature: 'Italian',          group: 'Cuisine',    coef: -0.013 },
  { feature: 'Jewish / Kosher',  group: 'Cuisine',    coef: -0.002 },
  { feature: 'Mediterranean',    group: 'Cuisine',    coef:  0.011 },
  { feature: 'Mexican',          group: 'Cuisine',    coef:  0.021 },
  { feature: 'Queens',           group: 'Borough',    coef: -0.014 },
  { feature: 'Staten Island',    group: 'Borough',    coef:  0.017 },
  { feature: 'Manhattan',        group: 'Borough',    coef:  0.023 },
  { feature: 'Brooklyn',         group: 'Borough',    coef:  0.050 },
]

const GROUP_COLORS: Record<string, string> = {
  'Past grade': '#A32D2D',
  'Cuisine':    '#BA7517',
  'Borough':    '#185FA5',
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}

function calcProbs(cuisine: string, borough: string, history: string) {
  const logit =
    HISTORY_BASE_INTERCEPT +
    (CUISINE_COEFS[cuisine] ?? 0) +
    (BORO_COEFS[borough] ?? 0) +
    (HISTORY_COEFS[history] ?? 0)
  const pA = Math.min(0.99, Math.max(0.01, sigmoid(logit)))
  const pB = (1 - pA) * 0.65
  const pC = 1 - pA - pB
  return { pA, pB, pC }
}

function ProbabilityBar({
  label, probability, color, isInView, index,
}: {
  label: string
  probability: number
  color: string
  isInView: boolean
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-center gap-3"
    >
      <span className="w-16 font-serif text-sm text-muted-foreground">{label}</span>
      <div className="flex-1 h-8 bg-secondary/30 relative overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(probability * 100)}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <motion.span
        key={probability}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-14 font-mono text-sm text-foreground text-right"
      >
        {Math.round(probability * 100)}%
      </motion.span>
    </motion.div>
  )
}

export function LogisticRegression() {
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: true })

  const [selections, setSelections] = useState<Record<string, string>>({
    cuisine: 'American',
    borough: 'Manhattan',
    history: 'First',
  })

  const { pA, pB, pC } = calcProbs(
    selections.cuisine,
    selections.borough,
    selections.history,
  )

  const select = (group: string, val: string) =>
    setSelections(prev => ({ ...prev, [group]: val }))

  return (
    <section ref={ref} className="py-24 border-t border-border bg-background">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-2xl"
        >
          <span className="font-sans font-bold text-s uppercase tracking-[0.4em] text-primary mb-4 block">
            Signature Plate
          </span>
          <h2
            className="text-4xl sm:text-5xl font-medium text-foreground mb-6"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Try to guess an A
          </h2>
          <p className="font-serif text-lg text-muted-foreground leading-relaxed">
            We trained a model on 9,292 NYC restaurants to ask a simple question:
            what actually predicts how a restaurant will score next time?
            <br /><br />
            The answer wasn't cuisine. Nor was it the borough.{' '}
            <strong className="text-foreground">It was almost exclusively the previous score.</strong>{' '}
            A restaurant that has scored well in the past will likely score well again,
            regardless of what it serves or where it is located.
            <br /><br />
            In other words,{' '}
            <strong className="text-foreground">the kitchen's track record is the only thing that matters.</strong>{' '}
            Not the neighborhood. Not the flag on the menu.
          </p>
        </motion.div>

        {/* Controls + Probability */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          {/* Left — chip selectors */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <label className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
                Cuisine Type
              </label>
              <div className="flex flex-wrap gap-2">
                {(factors[0].options as string[]).map(opt => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => select('cuisine', opt)}
                    className={`px-3 py-2 text-sm font-serif border transition-all duration-200 ${
                      selections.cuisine === opt
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
                Borough
              </label>
              <div className="flex flex-wrap gap-2">
                {(factors[1].options as string[]).map(opt => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => select('borough', opt)}
                    className={`px-3 py-2 text-sm font-serif border transition-all duration-200 ${
                      selections.borough === opt
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
                Past Performance
              </label>
              <div className="flex flex-wrap gap-2">
                {(factors[2].options as { label: string; val: string }[]).map(opt => (
                  <motion.button
                    key={opt.val}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => select('history', opt.val)}
                    className={`px-3 py-2 text-sm font-serif border transition-all duration-200 ${
                      selections.history === opt.val
                        ? opt.val === 'A'
                          ? 'bg-green-800 text-white border-green-800'
                          : 'bg-primary text-primary-foreground border-primary'
                        : opt.val === 'A'
                          ? 'bg-background text-green-700 border-green-300 hover:border-green-600'
                          : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — probability bars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-secondary/20 p-6 border border-border"
          >
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Predicted chance of each grade
            </h3>
            <div className="space-y-4">
              <ProbabilityBar label="Grade A" probability={pA} color="var(--chart-3)" isInView={isInView} index={0} />
              <ProbabilityBar label="Grade B" probability={pB} color="var(--chart-1)" isInView={isInView} index={1} />
              <ProbabilityBar label="Grade C" probability={pC} color="var(--chart-2)" isInView={isInView} index={2} />
            </div>
            <div className="mt-8 pt-6 border-t border-border/50">
              <AnimatePresence mode="wait">
                <motion.p
                  key={selections.history}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="font-serif text-sm text-muted-foreground leading-relaxed"
                >
                  {INSIGHTS[selections.history]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Variable weight table — real normalized coefficients from full model */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="border-t border-border pt-10"
        >
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
            Variable weight in the full model
          </p>
          <p className="font-serif text-sm text-muted-foreground/70 mb-6 max-w-xl">
            Each number shows how strongly a factor pushes toward or away from an A grade. 
            The biggest drag on the model is a previous B grade, which is −1.0. 
            Everything else is a fraction of that.
          </p>

          <div className="border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground text-left px-4 py-2">Feature</th>
                  <th className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground text-left px-4 py-2">Group</th>
                  <th className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground text-right px-4 py-2 w-20">Coef.</th>
                  <th className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground px-4 py-2 w-36 hidden sm:table-cell">Weight</th>
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES_COEFS.map(({ feature, group, coef }) => {
                  const isPastGrade = group === 'Past grade'
                  const isNeg = coef < 0
                  const barWidth = `${Math.abs(coef) * 100}%`
                  const barColor = GROUP_COLORS[group]
                  return (
                    <tr
                      key={feature}
                      className={`border-b border-border/50 ${isPastGrade ? 'bg-card' : ''}`}
                    >
                      <td className={`px-4 py-2.5 font-serif ${isPastGrade ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {feature}
                        {feature === 'Previously B' && (
                          <span className="ml-2 font-sans text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded-sm uppercase tracking-wide">dominant</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="font-sans text-[10px] px-1.5 py-0.5 rounded-sm"
                          style={{ backgroundColor: `${barColor}18`, color: barColor }}
                        >
                          {group}
                        </span>
                      </td>
                      <td className={`font-mono text-right px-4 py-2.5 text-xs ${isPastGrade ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {coef > 0 ? '+' : ''}{coef.toFixed(3)}
                      </td>
                      <td className="px-4 py-2.5 hidden sm:table-cell">
                        <div className="h-2 bg-secondary rounded-sm overflow-hidden relative">
                          <div
                            className="h-full rounded-sm absolute"
                            style={{
                              width: barWidth,
                              backgroundColor: barColor,
                              opacity: isPastGrade ? 1 : 0.55,
                              ...(isNeg ? { right: 0 } : { left: 0 }),
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border/50">
              <p className="font-serif text-xs text-muted-foreground/50 italic">
                The reference categories are American cuisine and the Bronx. Previously, the reference category was A, and all other coefficients were measured relative to it.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}