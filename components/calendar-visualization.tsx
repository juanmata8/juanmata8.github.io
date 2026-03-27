"use client"

import { Calendar, Heart, AlertTriangle } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

export function CalendarVisualization() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [valentineCount, setValentineCount] = useState(0)
  const [covidCount, setCovidCount] = useState(0)
  const [hasCountStarted, setHasCountStarted] = useState(false)
  const [calendarData, setCalendarData] = useState<number[]>([]);
  
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const sectionHeight = rect.height
    
    const scrolled = windowHeight - rect.top
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight))
    setScrollProgress(progress)
    
    if (progress > 0.4 && !hasCountStarted) {
      setHasCountStarted(true)
    }
  }, [hasCountStarted])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Animated counters
  useEffect(() => {
    if (!hasCountStarted) return
    
    const duration = 1200
    const start = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setValentineCount(Math.round(23 * eased))
      setCovidCount(Math.round(78 * eased))
      
      if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [hasCountStarted])

  // Generate fake calendar data for animation
  // 2. Generate the data only ONCE after the component mounts
  useEffect(() => {
    const data = []
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        const isWeekend = day === 0 || day === 6
        const base = isWeekend ? 0.6 : 0.3
        const variation = Math.random() * 0.4
        data.push(base + variation)
      }
    }
    setCalendarData(data)
  }, []) // Empty dependency array means it only runs on the client

  // 3. Handle the initial render (when data is empty)
  if (calendarData.length === 0) {
    return null; // Or a loading skeleton
  }

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
                Visualization III
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

          {/* Calendar heatmap visualization */}
          <div 
            className="relative bg-card rounded-2xl border border-border overflow-hidden"
            style={{
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transform: scrollProgress > 0.15 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="p-6 sm:p-8">
              {/* Month labels */}
              <div className="flex justify-between mb-2 text-[10px] text-muted-foreground/60 px-1">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>

              {/* Animated calendar grid */}
              <div className="grid grid-cols-52 gap-[2px] sm:gap-1">
                {calendarData.map((intensity, i) => {
                  const cellProgress = 0.15 + (i / calendarData.length) * 0.3
                  const isVisible = scrollProgress > cellProgress
                  
                  // Highlight Valentine's day area (week 7, day 4-ish)
                  const isValentine = i >= 45 && i <= 50
                  // Highlight COVID period (weeks 10-15)
                  const isCovid = i >= 70 && i <= 100
                  
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-[2px] sm:rounded-sm transition-all duration-300"
                      style={{
                        backgroundColor: isCovid 
                          ? `oklch(0.3 0.01 260 / ${intensity * 0.3})`
                          : isValentine
                            ? `oklch(0.65 0.2 30 / ${intensity + 0.2})`
                            : `oklch(0.65 0.2 30 / ${intensity * 0.8})`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'scale(1)' : 'scale(0)',
                        transition: `all 0.3s ease ${(i % 52) * 0.01}s`,
                      }}
                    />
                  )
                })}
              </div>

              {/* Day of week labels */}
              <div className="flex justify-start gap-[2px] sm:gap-1 mt-2 text-[8px] sm:text-[10px] text-muted-foreground/40">
                <span className="w-[calc(100%/52)]">Mon</span>
                <span className="w-[calc(100%/52)]" />
                <span className="w-[calc(100%/52)]">Wed</span>
                <span className="w-[calc(100%/52)]" />
                <span className="w-[calc(100%/52)]">Fri</span>
                <span className="w-[calc(100%/52)]" />
                <span className="w-[calc(100%/52)]">Sun</span>
              </div>
            </div>

            {/* Legend */}
            <div 
              className="absolute top-4 right-4 flex items-center gap-2 text-xs text-muted-foreground"
              style={{
                opacity: scrollProgress > 0.3 ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            >
              <span>Less</span>
              <div className="flex gap-[2px]">
                {[0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                  <div 
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: `oklch(0.65 0.2 30 / ${intensity})` }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
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
            <span className="text-foreground font-medium">Figure 3:</span> Daily incident counts, 
            2003-2025. Weekends run consistently hotter than weekdays.
          </div>

          {/* Insight cards with staggered animation */}
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {/* Valentine's Day */}
            <div 
              className="group p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl relative overflow-hidden"
              style={{
                opacity: scrollProgress > 0.4 ? 1 : 0,
                transform: scrollProgress > 0.4 ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Animated heart */}
              <div 
                className="absolute -top-4 -right-4 text-primary/10"
                style={{
                  transform: scrollProgress > 0.45 ? 'scale(1) rotate(12deg)' : 'scale(0) rotate(0deg)',
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
                }}
              >
                <Heart className="w-24 h-24" fill="currentColor" />
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground font-semibold">
                    Valentine&apos;s Day Spike
                  </h3>
                </div>
                
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-serif font-bold text-primary tabular-nums">
                    +{valentineCount}%
                  </span>
                  <span className="text-muted-foreground text-sm">vs. average</span>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  February 14th consistently shows elevated activity—a pattern holding steady 
                  across all 22 years of data.
                </p>
              </div>
            </div>

            {/* COVID collapse */}
            <div 
              className="group p-6 bg-card border border-border rounded-2xl relative overflow-hidden"
              style={{
                opacity: scrollProgress > 0.45 ? 1 : 0,
                transform: scrollProgress > 0.45 ? 'translateX(0)' : 'translateX(40px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Animated warning */}
              <div 
                className="absolute -top-4 -right-4 text-muted-foreground/10"
                style={{
                  transform: scrollProgress > 0.5 ? 'scale(1) rotate(-12deg)' : 'scale(0) rotate(0deg)',
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
                }}
              >
                <AlertTriangle className="w-24 h-24" />
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground font-semibold">
                    COVID-19 Collapse
                  </h3>
                </div>
                
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-serif font-bold text-muted-foreground tabular-nums">
                    -{covidCount}%
                  </span>
                  <span className="text-muted-foreground/60 text-sm">March 2020</span>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The largest single-month decline in the dataset&apos;s history. When the streets 
                  emptied, so did this economy.
                </p>
              </div>
            </div>
          </div>

          {/* Closing narrative */}
          <div className="mt-12 space-y-6">
            <p 
              className="font-sans text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: scrollProgress > 0.55 ? 1 : 0,
                transform: scrollProgress > 0.55 ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              When lockdowns emptied San Francisco&apos;s streets, this economy nearly vanished. 
              But look at the recovery: by late 2021, activity had returned with{' '}
              <span className="text-primary font-medium">new intensity</span>.
            </p>
            
            <p 
              className="font-serif text-2xl text-foreground italic"
              style={{
                opacity: scrollProgress > 0.65 ? 1 : 0,
                transform: scrollProgress > 0.65 ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              The night shift had adapted. It always does.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
