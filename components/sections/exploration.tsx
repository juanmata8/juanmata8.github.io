"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const boroughs = ['All Boroughs', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']

const cuisines = [
  'American', 'Italian', 'Mediterranean', 'Jewish/Kosher',
  'Mexican', 'Middle Eastern', 'Indian', 'Chinese',
]

const grades = ['All', 'A', 'B', 'C']

const MAP_SRC = '/nyc_borough_map.html'

type Stats = {
  total: number | null
  avgScore: number | null
  inspections: number | null
}

export function Exploration() {
  const [selectedBorough, setSelectedBorough] = useState('All Boroughs')
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedGrades, setSelectedGrades] = useState<string[]>(['All'])
  const [stats, setStats] = useState<Stats>({ total: null, avgScore: null, inspections: null })
  const [mapReady, setMapReady] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    )
  }

  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev => {
      if (grade === 'All') return ['All']
      const without = prev.filter(g => g !== 'All')
      const next = without.includes(grade)
        ? without.filter(g => g !== grade)
        : [...without, grade]
      return next.length === 0 ? ['All'] : next
    })
  }

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data) return
      if (e.data.type === 'MAP_READY') {
        setMapReady(true)
      } else if (e.data.type === 'UPDATE_STATS') {
        setStats({
          total: e.data.total,
          avgScore: e.data.avgScore,
          inspections: e.data.inspections,
        })
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    if (!mapReady || !iframeRef.current?.contentWindow) return
    const gradesPayload = selectedGrades.includes('All') ? [] : selectedGrades
    iframeRef.current.contentWindow.postMessage({
      type: 'SET_FILTERS',
      borough: selectedBorough,
      cuisines: selectedCuisines,
      grades: gradesPayload,
    }, '*')
  }, [mapReady, selectedBorough, selectedCuisines, selectedGrades])

  const fmt = (n: number | null) =>
    n == null ? '—' : n.toLocaleString('en-US')

  return (
    <section className="py-24 border-t border-border">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto px-6 mb-16"
      >
        <div className="flex items-center gap-6 mb-8">
          <span className="flex-1 h-px bg-border" />
          <span className="font-sans font-bold text-s uppercase tracking-[0.4em] text-primary mb-4 block">
            Now You Try
          </span>
          <span className="flex-1 h-px bg-border" />
        </div>

        <h2
          className="text-center text-4xl sm:text-5xl font-medium text-foreground"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          Explore the data
        </h2>
      </motion.div>

      <p className="font-serif text-base text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto -mt-8 mb-12">
        Use the borough, cuisine, and grade filters to sort the data on the map.
        Try selecting a few cuisines and comparing them.
        Selecting no cuisine is equivalent to viewing them all.
      </p>

      {/* Controls */}
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid md:grid-cols-3 gap-8 mb-8"
        >
          {/* Borough selector */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
              Find Your Neighborhood
            </label>
            <select
              value={selectedBorough}
              onChange={(e) => setSelectedBorough(e.target.value)}
              className="w-full p-3 bg-card border border-border font-serif text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300 hover:border-primary/50"
            >
              {boroughs.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Cuisine multi-select */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
              Compare Cuisines
            </label>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine, index) => (
                <motion.button
                  key={cuisine}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3 py-1.5 text-xs font-sans transition-all duration-300 ${selectedCuisines.includes(cuisine)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                  {cuisine}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Grade selector */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
              Inspection Grade
            </label>
            <div className="flex flex-wrap gap-2">
              {grades.map((grade, index) => (
                <motion.button
                  key={grade}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleGrade(grade)}
                  className={`px-3 py-1.5 text-xs font-sans transition-all duration-300 min-w-[44px] ${selectedGrades.includes(grade)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                  {grade}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Avg Score banner — sits just above the map */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-4 mb-3 px-4 py-2.5 bg-card border border-border"
        >
          <p className="font-serif text-sm text-muted-foreground leading-snug">
            The average score barely changes depending on the borough. Geography does not affect grades.
          </p>
          <div className="flex items-center gap-6 shrink-0">
            {[
              { label: 'Restaurants', value: fmt(stats.total) },
              { label: 'Inspections', value: fmt(stats.inspections) },
              { label: 'Avg. Score', value: stats.avgScore == null ? '—' : stats.avgScore.toFixed(1) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                  {label}
                </span>
                <span className="font-mono text-lg text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Map iframe */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="aspect-[16/10] bg-secondary/30 border border-border relative overflow-hidden"
        >
          <iframe
            ref={iframeRef}
            src={MAP_SRC}
            title="NYC Restaurant Inspections Map"
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none', background: 'var(--background)' }}
          />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-serif text-sm text-muted-foreground">
                Loading map…
              </span>
            </div>
          )}
        </motion.div>


      </div>
    </section>
  )
}