"use client"

import { Heart, AlertTriangle } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

export function CalendarVisualization() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [valentineCount, setValentineCount] = useState(0)
  const [covidCount, setCovidCount] = useState(0)
  const [hasCountStarted, setHasCountStarted] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const scrolled = windowHeight - rect.top
    const progress = Math.max(0, Math.min(1, scrolled / rect.height))
    setScrollProgress(progress)
    if (progress > 0.4 && !hasCountStarted) setHasCountStarted(true)
  }, [hasCountStarted])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Animated counters with the new target data
  useEffect(() => {
    if (!hasCountStarted) return
    const duration = 1200
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) 
      
      setValentineCount(Math.round(855 * eased))
      setCovidCount(parseFloat((87.8 * eased).toFixed(1))) 
      
      if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [hasCountStarted])

  return (
    <section ref={sectionRef} className="relative min-h-[200vh]">
      <div className="sticky top-0 min-h-screen flex items-center py-12">
        <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div
            className="mb-8"
            style={{
              opacity: scrollProgress > 0.05 ? 1 : 0,
              transform: scrollProgress > 0.05 ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="overflow-hidden mb-2">
              <p
                className="text-primary font-sans text-xs tracking-[0.25em] uppercase"
                style={{
                  transform: scrollProgress > 0.08 ? 'translateY(0)' : 'translateY(100%)',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                Visualization II
              </p>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {['The', 'Calendar', 'Effect'].map((word, i) => (
                <span key={word} className="inline-block overflow-hidden mr-[0.2em]">
                  <span
                    className="inline-block"
                    style={{
                      transform: scrollProgress > 0.1 ? 'translateY(0)' : 'translateY(100%)',
                      transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h2>
            <p
              className="font-sans text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: scrollProgress > 0.12 ? 1 : 0,
                transform: scrollProgress > 0.12 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Some patterns only emerge when you zoom out.
            </p>
          </div>

          {/* Real matplotlib heatmap image */}
          <div
            className="relative bg-card rounded-2xl border border-border overflow-hidden"
            style={{
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transform: scrollProgress > 0.15 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <img
              src="/calendar_heatmap.png"
              alt="Calendar heatmap of daily prostitution incidents in SF, 2016–2025"
              className="w-full h-auto block"
            />
          </div>

          {/* Figure caption */}
          <div
            className="mt-6 text-sm text-muted-foreground/80 pl-4 border-l-2 border-primary/30"
            style={{
              opacity: scrollProgress > 0.35 ? 1 : 0,
              transform: scrollProgress > 0.35 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="text-foreground font-medium">Figure 2:</span> Temporal Trends of Daily Prostitution Arrests in San Francisco (2016–2025) This heat map calendar illustrates the daily number of prostitution arrests over the course of ten years. Color intensity represents the number of incidents per day. A sharp decline is evident beginning in 2020. Frequent, high-density clusters from the mid-2010s disappear, leaving only sporadic data points in recent years. This illustrates a sustained and significant decrease in overall recorded activity that persisted well into 2025.
          </div>

          {/* Insight cards */}
          <div className="mt-10 grid sm:grid-cols-2 gap-4">

            {/* Valentine's Enforcement Spike */}
            <div 
              className="group p-6 bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl relative overflow-hidden"
              style={{
                opacity: scrollProgress > 0.4 ? 1 : 0,
                transform: scrollProgress > 0.4 ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div 
                className="absolute -top-4 -right-4 text-red-500/10"
                style={{
                  transform: scrollProgress > 0.45 ? 'scale(1) rotate(12deg)' : 'scale(0) rotate(0deg)',
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
                }}
              >
                <Heart className="w-24 h-24" fill="currentColor" />
              </div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground font-semibold">
                    Valentine&apos;s Spike (Feb 15)
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-serif font-bold text-red-500 tabular-nums">
                    +{valentineCount}%
                  </span>
                  <span className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">
                    Above Daily Average
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Across a 10-year average, Feb 15th accounts for <strong className="text-foreground">2.61%</strong> of
                  annual incidents. This <strong className="text-foreground">855% increase</strong> over a standard
                  day is a classic enforcement outlier, typically driven by coordinated police sweeps like
                  <em className="italic text-foreground"> &quot;Operation: Cupid&quot; </em>
                  <a
                    href="https://www.wrtv.com/longform/dear-john-when-men-buy-sex-its-the-women-who-pay-for-it"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-red-500 hover:underline font-medium"
                  >
                    [1]
                  </a>.
                </p>
              </div>
            </div>

            {/* COVID-19 Collapse */}
            <div
              className="group p-6 bg-slate-500/5 border border-slate-500/20 rounded-2xl relative overflow-hidden"
              style={{
                opacity: scrollProgress > 0.45 ? 1 : 0,
                transform: scrollProgress > 0.45 ? 'translateX(0)' : 'translateX(40px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                className="absolute -top-4 -right-4 text-slate-500/10"
                style={{
                  transform: scrollProgress > 0.5 ? 'scale(1) rotate(-12deg)' : 'scale(0) rotate(0deg)',
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
                }}
              >
                <AlertTriangle className="w-24 h-24" />
              </div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground font-semibold">
                    COVID-19 Collapse
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-serif font-bold text-slate-600 tabular-nums">
                    -{covidCount}%
                  </span>
                  <span className="text-muted-foreground/60 text-xs uppercase tracking-widest font-semibold">
                    March 2020
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  The most dramatic <strong className="text-foreground">structural break</strong> in the dataset.
                  As lockdowns cleared the streets, reported incidents fell by nearly 90%, mirroring global
                  trends where stay-at-home restrictions effectively halted the physical street economy
                  <a
                    href="https://doi.org/10.1038/s41562-021-01139-z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-slate-500 hover:underline font-medium"
                  >
                    [2]
                  </a>.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}