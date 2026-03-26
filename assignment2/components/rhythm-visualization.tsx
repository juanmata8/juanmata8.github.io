"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type CrimeCategory = "prostitution" | "other"

const hourlyData = {
  prostitution: [
    { hour: "00", value: 85 },
    { hour: "01", value: 72 },
    { hour: "02", value: 58 },
    { hour: "03", value: 35 },
    { hour: "04", value: 18 },
    { hour: "05", value: 8 },
    { hour: "06", value: 5 },
    { hour: "07", value: 4 },
    { hour: "08", value: 6 },
    { hour: "09", value: 8 },
    { hour: "10", value: 12 },
    { hour: "11", value: 15 },
    { hour: "12", value: 18 },
    { hour: "13", value: 22 },
    { hour: "14", value: 28 },
    { hour: "15", value: 35 },
    { hour: "16", value: 48 },
    { hour: "17", value: 62 },
    { hour: "18", value: 78 },
    { hour: "19", value: 88 },
    { hour: "20", value: 95 },
    { hour: "21", value: 98 },
    { hour: "22", value: 100 },
    { hour: "23", value: 92 },
  ],
  other: [
    { hour: "00", value: 42 },
    { hour: "01", value: 35 },
    { hour: "02", value: 28 },
    { hour: "03", value: 22 },
    { hour: "04", value: 18 },
    { hour: "05", value: 15 },
    { hour: "06", value: 25 },
    { hour: "07", value: 38 },
    { hour: "08", value: 55 },
    { hour: "09", value: 68 },
    { hour: "10", value: 75 },
    { hour: "11", value: 82 },
    { hour: "12", value: 88 },
    { hour: "13", value: 85 },
    { hour: "14", value: 82 },
    { hour: "15", value: 85 },
    { hour: "16", value: 90 },
    { hour: "17", value: 95 },
    { hour: "18", value: 100 },
    { hour: "19", value: 92 },
    { hour: "20", value: 78 },
    { hour: "21", value: 65 },
    { hour: "22", value: 55 },
    { hour: "23", value: 48 },
  ],
}

export function RhythmVisualization() {
  const [activeCategory, setActiveCategory] = useState<CrimeCategory>("prostitution")
  const [hoveredHour, setHoveredHour] = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [chartAnimated, setChartAnimated] = useState(false)

  // Scrollytelling progress calculation
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const sectionHeight = rect.height
    
    // Calculate how far through the section we are
    const scrolled = windowHeight - rect.top
    const totalScrollable = sectionHeight
    const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))
    setScrollProgress(progress)
    
    // Sticky state
    const sticky = rect.top <= 0 && rect.bottom > windowHeight
    setIsSticky(sticky)
    
    // Trigger chart animation
    if (progress > 0.15 && !chartAnimated) {
      setChartAnimated(true)
    }
  }, [chartAnimated])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const data = hourlyData[activeCategory]
  const maxValue = Math.max(...data.map(d => d.value))

  // Calculate which narrative step we're on based on scroll progress
  const narrativeStep = Math.floor(scrollProgress * 5)

  return (
    <section ref={sectionRef} className="relative min-h-[250vh]">
      {/* Sticky container for the visualization */}
      <div 
        ref={stickyRef}
        className="sticky top-0 min-h-screen flex items-center py-12"
      >
        <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">
          {/* Section header - fades in first */}
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
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {['The', 'Rhythm', 'of', 'the', 'Night'].map((word, i) => (
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
          </div>

          {/* Toggle buttons with morphing animation */}
          <div 
            className="flex gap-3 mb-8"
            style={{
              opacity: scrollProgress > 0.12 ? 1 : 0,
              transform: scrollProgress > 0.12 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {(['prostitution', 'other'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  relative px-5 py-2.5 rounded-full font-sans text-sm cursor-pointer overflow-hidden
                  transition-all duration-500 ease-out
                  ${activeCategory === category
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground bg-transparent border border-border hover:border-muted-foreground/50"
                  }
                `}
              >
                {/* Animated background pill */}
                <span 
                  className={`
                    absolute inset-0 bg-primary rounded-full
                    transition-transform duration-500 ease-out
                    ${activeCategory === category ? 'scale-100' : 'scale-0'}
                  `}
                />
                <span className="relative z-10 capitalize">
                  {category === 'other' ? 'Other Crimes' : category}
                </span>
              </button>
            ))}
          </div>

          {/* Main chart container */}
          <div 
            className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 overflow-hidden"
            style={{
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transform: scrollProgress > 0.15 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Gradient overlay that shifts with time */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: activeCategory === 'prostitution'
                  ? 'linear-gradient(135deg, oklch(0.65 0.2 30 / 0.05), transparent 60%)'
                  : 'linear-gradient(135deg, oklch(0.5 0.01 260 / 0.1), transparent 60%)',
                transition: 'background 0.8s ease',
              }}
            />

            {/* Y-axis label */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 -rotate-90 text-[10px] text-muted-foreground/60 tracking-widest uppercase"
              style={{
                opacity: chartAnimated ? 1 : 0,
                transition: 'opacity 0.5s ease 0.5s',
              }}
            >
              Relative Frequency
            </div>

            {/* Chart area */}
            <div className="relative ml-6">
              {/* Bars container */}
              <div className="flex items-end justify-between h-56 sm:h-72 gap-[2px] sm:gap-1">
                {data.map((item, index) => {
                  const height = (item.value / maxValue) * 100
                  const isHighlight = activeCategory === 'prostitution' && 
                    (parseInt(item.hour) >= 18 || parseInt(item.hour) <= 1)
                  const isHovered = hoveredHour === item.hour
                  
                  return (
                    <div 
                      key={item.hour}
                      className="relative flex-1 flex flex-col items-center cursor-pointer"
                      onMouseEnter={() => setHoveredHour(item.hour)}
                      onMouseLeave={() => setHoveredHour(null)}
                    >
                      {/* Tooltip with smooth morph */}
                      <div 
                        className={`
                          absolute -top-16 left-1/2 z-20
                          bg-foreground text-background px-3 py-2 rounded-xl text-xs
                          shadow-xl shadow-black/20
                          transition-all duration-300 ease-out
                          ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
                        `}
                        style={{ transform: `translateX(-50%) ${isHovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)'}` }}
                      >
                        <div className="font-semibold text-center">{item.hour}:00</div>
                        <div className="text-muted-foreground/80 text-center">{item.value}%</div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-foreground" />
                      </div>
                      
                      {/* Bar with staggered animation */}
                      <div 
                        className={`
                          w-full rounded-t-sm
                          transition-all duration-300 ease-out
                          ${isHighlight ? 'bg-primary' : 'bg-muted-foreground/25'}
                          ${isHovered ? 'brightness-125 scale-x-110' : ''}
                        `}
                        style={{ 
                          height: chartAnimated ? `${height}%` : '0%',
                          transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.025}s, filter 0.2s ease, transform 0.2s ease`,
                        }}
                      />
                    </div>
                  )
                })}
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-4 text-[10px] sm:text-xs text-muted-foreground/70">
                {['00:00', '06:00', '12:00', '18:00', '23:00'].map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>

            {/* Peak hours indicator */}
            {activeCategory === 'prostitution' && (
              <div 
                className="absolute top-4 right-4 flex items-center gap-2 text-xs text-muted-foreground"
                style={{
                  opacity: chartAnimated ? 1 : 0,
                  transform: chartAnimated ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'all 0.6s ease 1.2s',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Peak hours (18:00-01:00)
              </div>
            )}
          </div>

          {/* Figure caption */}
          <div 
            className="mt-6 text-sm text-muted-foreground/80"
            style={{
              opacity: scrollProgress > 0.25 ? 1 : 0,
              transform: scrollProgress > 0.25 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="text-foreground font-medium">Figure 2:</span> Hourly distribution 
            comparing prostitution incidents with general crime patterns.
          </div>

          {/* KEY INSIGHT - The user's requested quote */}
          <div 
            className="mt-10 relative"
            style={{
              opacity: scrollProgress > 0.35 ? 1 : 0,
              transform: scrollProgress > 0.35 ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
              {/* Animated shimmer */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, oklch(0.65 0.2 30 / 0.1), transparent)',
                  animation: scrollProgress > 0.4 ? 'shimmerPass 3s ease-in-out infinite' : 'none',
                }}
              />
              
              {/* Quote marks */}
              <span 
                className="absolute top-4 left-4 text-6xl text-primary/20 font-serif leading-none select-none"
                style={{
                  opacity: scrollProgress > 0.38 ? 1 : 0,
                  transform: scrollProgress > 0.38 ? 'scale(1)' : 'scale(0.5)',
                  transition: 'all 0.5s ease',
                }}
              >
                &ldquo;
              </span>
              
              <blockquote className="relative font-serif text-xl sm:text-2xl text-foreground leading-relaxed">
                {/* Word by word reveal */}
                {'Prostitution operates on a precise circadian logic. It peaks in the late evening window: public visibility decreases to provide cover, but street activity remains sufficient to provide a client base.'.split(' ').map((word, i) => {
                  const wordProgress = 0.4 + (i * 0.008)
                  const isVisible = scrollProgress > wordProgress
                  const isHighlight = ['precise', 'circadian', 'logic', 'cover', 'client', 'base'].includes(word.replace(/[.,]/g, ''))
                  
                  return (
                    <span
                      key={i}
                      className={`inline-block mr-[0.25em] ${isHighlight ? 'text-primary font-semibold' : ''}`}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.4s ease',
                      }}
                    >
                      {word}
                    </span>
                  )
                })}
              </blockquote>
            </div>
          </div>

          {/* Narrative text blocks that reveal with scroll */}
          <div className="mt-12 space-y-6">
            <p 
              className="font-sans text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: scrollProgress > 0.55 ? 1 : 0,
                transform: scrollProgress > 0.55 ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              The data reveals what locals have long suspected: this is fundamentally a{' '}
              <span className="text-primary font-medium">nocturnal economy</span>. 
              While most criminal activity follows the sun—peaking during afternoon hours—prostitution 
              tells a different story entirely.
            </p>
            
            <p 
              className="font-sans text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: scrollProgress > 0.65 ? 1 : 0,
                transform: scrollProgress > 0.65 ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Activity ramps up at <span className="text-primary font-medium">6:00 PM</span>, 
              reaches its zenith around <span className="text-primary font-medium">10:00 PM</span>, 
              and remains elevated past midnight. By 4:00 AM, the streets fall quiet again.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmerPass {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  )
}
