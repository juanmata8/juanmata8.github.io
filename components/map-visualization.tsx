"use client"

import { Map, Play, Pause } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

export function MapVisualization() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [year, setYear] = useState(2003)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [percentage, setPercentage] = useState(0)
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // ── LOGIC 1: Tell the Map to change when the Year state changes ──────
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SET_YEAR',
        year: year
      }, '*');
    }
  }, [year]);

  // ── LOGIC 2: Listen for the Percentage sent from Python/Plotly ───────
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_PCT') {
        setPercentage(Math.round(event.data.percentage));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height))
    setScrollProgress(progress)
    if (progress > 0.5 && !hasAnimated) setHasAnimated(true)
  }, [hasAnimated])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setYear((prev) => (prev >= 2025 ? 2003 : prev + 1))
    }, 800)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <section ref={sectionRef} className="relative min-h-[200vh]">
      <div className="sticky top-0 min-h-screen flex items-center py-12">
        <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">
          
          {/* ── HEADER: Title and Year Aligned ── */}
          <div 
            className="mb-8"
            style={{
              opacity: scrollProgress > 0.05 ? 1 : 0,
              transform: scrollProgress > 0.05 ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="overflow-hidden mb-2">
              <p className="text-primary font-sans text-xs tracking-[0.25em] uppercase">Visualization I</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                  The Spatial Evolution
              </h2>
              {/* Year moved here, aligned with the heading */}
              <div className="text-5xl sm:text-6xl font-serif font-bold text-primary opacity-40 tabular-nums leading-none">
                {year}
              </div>
            </div>

            <p className="font-sans text-muted-foreground leading-relaxed text-lg mt-4">
              Watch how incident locations have migrated across San Francisco over two decades.
            </p>
          </div>

          {/* ── MAP FIGURE ── */}
          <div 
            className="relative w-full aspect-[4/3] sm:aspect-video bg-[#151719] rounded-2xl overflow-hidden border border-border"
            style={{
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transform: scrollProgress > 0.15 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <iframe 
                ref={iframeRef}
                src="/prostitution_map.html" 
                className="w-full h-full border-0"
                scrolling="no"
            />
          </div>

          {/* ── CONTROLS: Now under the figure ── */}
          <div 
            className="mt-6 flex items-center gap-4 bg-background/50 backdrop-blur-md rounded-xl p-4 border border-border/50"
            style={{
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transition: 'all 0.8s ease-out 0.2s',
            }}
          >
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            
            <div className="flex-1">
              <input 
                type="range" min="2003" max="2025" value={year}
                onChange={(e) => {
                  setYear(parseInt(e.target.value))
                  setIsPlaying(false)
                }}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Figure caption */}
          <div className="mt-6 text-sm text-muted-foreground/80 pl-4 border-l-2 border-primary/30">
            <span className="text-foreground font-medium">Figure 1:</span> Migration from Tenderloin to Mission District.
          </div>

          {/* Insight callout */}
          <div className="mt-10 relative overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl relative">
              <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                <div className="text-5xl sm:text-6xl font-serif font-bold text-primary tabular-nums">
                  {percentage}%
                </div>
                <div>
                  <p className="font-sans text-lg text-foreground font-medium mb-2">
                    Mission District Concentration
                  </p>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    By this year, {percentage}% of all reported incidents are concentrated within the Mission district, shifting away from historical hubs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}