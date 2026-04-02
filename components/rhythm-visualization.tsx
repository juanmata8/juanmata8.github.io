"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// ── Constants ─────────────────────────────────────────────────────────────────

type Crime =
  | "LARCENY/THEFT" | "VEHICLE THEFT" | "MISSING PERSON" | "WARRANTS"
  | "STOLEN PROPERTY" | "BURGLARY" | "EMBEZZLEMENT" | "PROSTITUTION"

const LOCKED_CRIME: Crime = "PROSTITUTION"

const CRIMES: Crime[] = [
  "PROSTITUTION", "LARCENY/THEFT", "VEHICLE THEFT", "MISSING PERSON",
  "WARRANTS", "STOLEN PROPERTY", "BURGLARY", "EMBEZZLEMENT",
]

const PALETTE: Record<Crime, string> = {
  "PROSTITUTION":    "#ff8c00",
  "LARCENY/THEFT":   "#4CC9F0",
  "VEHICLE THEFT":   "#F72585",
  "MISSING PERSON":  "#B8F35D",
  "WARRANTS":        "#FFD166",
  "STOLEN PROPERTY": "#06D6A0",
  "BURGLARY":        "#EF476F",
  "EMBEZZLEMENT":    "#C77DFF",
}

const YEARS = Array.from({ length: 23 }, (_, i) => 2003 + i)  // 2003–2025
const DEFAULT_YEAR = 2025

// ── Component ─────────────────────────────────────────────────────────────────

export function RhythmVisualization() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSet, setActiveSet]   = useState<Set<Crime>>(new Set([LOCKED_CRIME]))
  const [year, setYear]             = useState(DEFAULT_YEAR)
  const sectionRef = useRef<HTMLDivElement>(null)
  const iframeRef  = useRef<HTMLIFrameElement>(null)

  // ── Scroll ───────────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect     = sectionRef.current.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height))
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // ── Bridge helpers ───────────────────────────────────────────────────────
  const post = useCallback((msg: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(msg, "*")
  }, [])

  // When iframe loads, sync full state (year + all crime visibilities)
  const handleIframeLoad = useCallback(() => {
    post({ type: "SET_YEAR", year })
    CRIMES.forEach(crime => {
      if (crime !== LOCKED_CRIME) {
        post({ type: "SET_TRACE_VISIBILITY", crime, visible: activeSet.has(crime) })
      }
    })
  }, [post, year, activeSet])

  // Year change — update state and bridge
  const handleYearChange = useCallback((next: number) => {
    setYear(next)
    post({ type: "SET_YEAR", year: next })
  }, [post])

  // Crime toggle — update state and bridge
  const toggleCrime = useCallback((crime: Crime) => {
    if (crime === LOCKED_CRIME) return
    setActiveSet(prev => {
      const next    = new Set(prev)
      const visible = !next.has(crime)
      visible ? next.add(crime) : next.delete(crime)
      post({ type: "SET_TRACE_VISIBILITY", crime, visible })
      return next
    })
  }, [post])

  // ── Reveal helper ────────────────────────────────────────────────────────
  const reveal = (threshold: number, extra?: React.CSSProperties): React.CSSProperties => ({
    opacity:    scrollProgress > threshold ? 1 : 0,
    transform:  scrollProgress > threshold ? "translateY(0)" : "translateY(40px)",
    transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
    ...extra,
  })

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} className="relative min-h-[200vh]">
      <div className="sticky top-0 min-h-screen flex items-center py-12">
        <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="mb-6" style={reveal(0.05)}>
            <p className="text-primary font-sans text-xs tracking-[0.25em] uppercase mb-2">
              Visualization III
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              The Rhythm of the Night
            </h2>
          </div>

          {/* Controls row — year picker + crime chips */}
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-5"
            style={reveal(0.12)}
          >
            {/* Year selector */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Year
              </span>
              <div className="relative">
                <select
                  value={year}
                  onChange={e => handleYearChange(Number(e.target.value))}
                  className="appearance-none bg-transparent font-mono text-sm
                             pl-3 pr-7 py-1.5 rounded-full cursor-pointer
                             text-foreground transition-colors duration-200
                             hover:border-muted-foreground/50
                             focus:outline-none focus:ring-0"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {YEARS.map(y => (
                    <option key={y} value={y} className="bg-[#151719]">{y}</option>
                  ))}
                </select>
                {/* Custom chevron */}
                <svg
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                  width="10" height="6" viewBox="0 0 10 6" fill="none"
                >
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="text-muted-foreground" />
                </svg>
              </div>
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-border hidden sm:block" />

            {/* Crime chips */}
            <div className="flex flex-wrap gap-2">
              {CRIMES.map(crime => {
                const locked = crime === LOCKED_CRIME
                const active = activeSet.has(crime)
                const color  = PALETTE[crime]

                return (
                  <button
                    key={crime}
                    onClick={() => toggleCrime(crime)}
                    disabled={locked}
                    className="relative px-3 py-1.5 rounded-full font-mono text-[11px]
                               tracking-wide transition-all duration-300 ease-out
                               disabled:cursor-default"
                    style={{
                      border:     `1px solid ${active || locked ? color : "rgba(255,255,255,0.12)"}`,
                      background: active || locked ? `${color}18` : "transparent",
                      color:      active || locked ? color : "rgba(255,255,255,0.35)",
                      boxShadow:  active || locked ? `0 0 10px ${color}20` : "none",
                    }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                      style={{ background: active || locked ? color : "rgba(255,255,255,0.2)" }}
                    />
                    {crime}
                    {locked && (
                      <span
                        className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded font-bold tracking-widest"
                        style={{ background: color, color: "#000" }}
                      >
                        ON
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chart iframe */}
          <div
            className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-2xl"
            style={{
              height: 490,
              ...reveal(0.15, {
                transform: scrollProgress > 0.15
                  ? "translateY(0) scale(1)"
                  : "translateY(30px) scale(0.98)",
              }),
            }}
          >
            <iframe
              ref={iframeRef}
              src="/prostitution_crime_hourly_animated_by_year.html"
              className="w-full h-full border-none"
              title="Hourly Crime Distribution — Midnight Centred"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              onLoad={handleIframeLoad}
            />
          </div>

          {/* Caption */}
          {/* Figure caption */}
          <div
            className="mt-6 text-sm text-muted-foreground/80 pl-4 border-l-2 border-primary/30"
            style={{
              opacity: scrollProgress > 0.35 ? 1 : 0,
              transform: scrollProgress > 0.35 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="text-foreground font-medium">Figure 3:</span> This interactive chart plots the normalised share of daily incidents on the y-axis, representing the percentage of a given crime's total volume that occurs at a specific time. It is centred on midnight to highlight nocturnal cycles. Users can navigate through the years (2003–2025) and select different categories to compare temporal signatures against the prostitution baseline. Hovering over data points reveals the specific hourly share for each selected crime. While most crimes are distributed more evenly or peak during the day, this visualisation shows that prostitution exhibits a unique and significant night-time spike, reaching the highest hourly share of any category in the dataset.

          </div>


          {/* Pull-quote */}
          <div className="mt-10" style={reveal(0.4)}>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
              <blockquote className="font-serif text-xl sm:text-2xl text-foreground leading-relaxed">
                &ldquo;Prostitution follows a{" "}
                <span className="text-primary font-semibold">precise operational window</span>.
                Its surge occurs in the late evening due to the perfect balance of nighttime coverage and foot traffic.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}