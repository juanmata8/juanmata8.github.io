"use client"

import { Map, Play, Pause } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

export function MapVisualization() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [year, setYear] = useState(2003)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [percentage, setPercentage] = useState(0)
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Scrollytelling progress
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const sectionHeight = rect.height
    
    const scrolled = windowHeight - rect.top
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight))
    setScrollProgress(progress)
    
    // Trigger count animation
    if (progress > 0.5 && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [hasAnimated])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Animated counter
  useEffect(() => {
    if (!hasAnimated) return
    let start = 0
    const end = 67
    const duration = 1500
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setPercentage(Math.round(start + (end - start) * eased))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }, [hasAnimated])

  // Auto-play years
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setYear((prev) => (prev >= 2025 ? 2003 : prev + 1))
    }, 350)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Calculate map gradient position based on year
  const getHeatmapPosition = (y: number) => {
    const progress = (y - 2003) / (2025 - 2003)
    // Tenderloin (north) to Mission (south) transition
    const x = 45 + progress * 15
    const yPos = 30 + progress * 40
    return { x, y: yPos }
  }
  
  const heatPosition = getHeatmapPosition(year)

  return (
    <section ref={sectionRef} className="relative min-h-[200vh]">
      {/* Sticky visualization container */}
      <div className="sticky top-0 min-h-screen flex items-center py-12">
        <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">
          {/* Section header with staggered reveal */}
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
                Visualization I
              </p>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {['The', 'Spatial', 'Evolution'].map((word, i) => (
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
              className="font-sans text-muted-foreground leading-relaxed text-lg"
              style={{
                opacity: scrollProgress > 0.12 ? 1 : 0,
                transform: scrollProgress > 0.12 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Watch how incident locations have migrated across San Francisco over two decades.
            </p>
          </div>

          {/* Map visualization */}
          <div 
            className="relative w-full aspect-[4/3] sm:aspect-video bg-card rounded-2xl overflow-hidden border border-border"
            style={{
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transform: scrollProgress > 0.15 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* SF Map background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Simplified SF outline */}
                <path 
                  d="M20 10 L80 15 L85 70 L70 90 L30 85 L15 50 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5"
                  className="text-muted-foreground"
                />
                {/* Grid lines */}
                {[...Array(10)].map((_, i) => (
                  <line 
                    key={`h${i}`}
                    x1="10" y1={10 + i * 9} x2="90" y2={10 + i * 9}
                    stroke="currentColor"
                    strokeWidth="0.1"
                    className="text-border"
                  />
                ))}
                {[...Array(10)].map((_, i) => (
                  <line 
                    key={`v${i}`}
                    x1={10 + i * 9} y1="10" x2={10 + i * 9} y2="95"
                    stroke="currentColor"
                    strokeWidth="0.1"
                    className="text-border"
                  />
                ))}
              </svg>
            </div>

            {/* Animated heatmap gradient */}
            <div 
              className="absolute inset-0 transition-all duration-700 ease-out pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 35% 30% at ${heatPosition.x}% ${heatPosition.y}%, 
                    oklch(0.65 0.2 30 / 0.4), 
                    oklch(0.5 0.15 30 / 0.2) 40%, 
                    transparent 70%)
                `,
              }}
            />

            {/* Secondary heat spot (fading as primary grows) */}
            <div 
              className="absolute inset-0 transition-all duration-700 ease-out pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 25% 20% at 42% 32%, oklch(0.55 0.12 30 / ${Math.max(0, 0.25 - (year - 2003) * 0.012)}), transparent 60%)`,
              }}
            />

            {/* Map icon and year display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Map 
                className="w-12 h-12 text-muted-foreground/20 mb-4"
                style={{
                  transform: isPlaying ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              />
              
              {/* Large year display */}
              <div 
                className="text-6xl sm:text-7xl font-serif font-bold text-primary tabular-nums"
                style={{
                  textShadow: '0 0 40px oklch(0.65 0.2 30 / 0.3)',
                }}
              >
                {year}
              </div>
              
              <p className="text-sm text-muted-foreground/60 mt-2">
                {year <= 2010 ? 'Tenderloin concentration' : year <= 2018 ? 'Gradual dispersion' : 'Mission concentration'}
              </p>
            </div>

            {/* Playback controls */}
            <div 
              className="absolute bottom-4 left-4 right-4 flex items-center gap-4 bg-background/90 backdrop-blur-md rounded-xl p-4 border border-border/50"
              style={{
                opacity: scrollProgress > 0.2 ? 1 : 0,
                transform: scrollProgress > 0.2 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`
                  w-12 h-12 flex items-center justify-center rounded-full 
                  transition-all duration-300 cursor-pointer
                  ${isPlaying 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40" 
                    : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                  }
                `}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              
              <div className="flex-1">
                <input 
                  type="range" 
                  min="2003" 
                  max="2025" 
                  value={year}
                  onChange={(e) => {
                    setYear(parseInt(e.target.value))
                    setIsPlaying(false)
                  }}
                  className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground/70 mt-2">
                  <span>2003</span>
                  <span>2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Figure caption */}
          <div 
            className="mt-6 text-sm text-muted-foreground/80 pl-4 border-l-2 border-primary/30"
            style={{
              opacity: scrollProgress > 0.3 ? 1 : 0,
              transform: scrollProgress > 0.3 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="text-foreground font-medium">Figure 1:</span> Spatial distribution 
            of incidents, 2003-2025. Note the migration from Tenderloin to Mission District.
          </div>

          {/* Key insight callout with animated counter */}
          <div 
            className="mt-10 relative overflow-hidden"
            style={{
              opacity: scrollProgress > 0.4 ? 1 : 0,
              transform: scrollProgress > 0.4 ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="p-8 bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl relative">
              {/* Decorative element */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2"
                style={{
                  transform: scrollProgress > 0.45 ? 'translate(50%, -50%) scale(1)' : 'translate(50%, -50%) scale(0)',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                }}
              />
              
              <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                <div 
                  className="text-5xl sm:text-6xl font-serif font-bold text-primary tabular-nums"
                  style={{
                    textShadow: '0 0 30px oklch(0.65 0.2 30 / 0.2)',
                  }}
                >
                  {percentage}%
                </div>
                <div>
                  <p className="font-sans text-lg text-foreground font-medium mb-2">
                    The 2021 Concentration
                  </p>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    By 2021, over two-thirds of all reported incidents occurred within a 0.5-mile 
                    radius of 16th Street BART—a striking shift from the historically dispersed pattern.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative text */}
          <div className="mt-10 space-y-6">
            <p 
              className="font-sans text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: scrollProgress > 0.55 ? 1 : 0,
                transform: scrollProgress > 0.55 ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              In the early 2000s, activity was concentrated in the{' '}
              <span className="text-primary font-medium">Tenderloin</span>—San Francisco&apos;s 
              historically marginalized neighborhood. But watch what happens after 2015.
            </p>
            <p 
              className="font-sans text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: scrollProgress > 0.65 ? 1 : 0,
                transform: scrollProgress > 0.65 ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              The heat signature drifts southward, following transit corridors and 
              seeking the shadow zones between gentrifying neighborhoods.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
