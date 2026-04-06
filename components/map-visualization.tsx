"use client"

import { Play, Pause, AlertCircle, TrendingUp } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

export function MapVisualization() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [year, setYear] = useState(2003)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [totalIncidents, setTotalIncidents] = useState(0) // New state
  const sectionRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // ── Tell the map to change when year state changes ───────────────────
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "SET_YEAR", year }, "*")
    }
  }, [year])

  // ── Listen for percentage updates sent back from the iframe ──────────
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check for the new type 'UPDATE_DATA'
      if (event.data.type === "UPDATE_DATA") {
        setPercentage(Math.round(event.data.percentage))
        setTotalIncidents(event.data.total) // Set the total
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // ── Scroll progress ──────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height))
    setScrollProgress(progress)
    if (progress > 0.5 && !hasAnimated) setHasAnimated(true)
  }, [hasAnimated])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // ── Auto-play ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setYear((prev) => (prev >= 2025 ? 2003 : prev + 1))
    }, 1500)
    return () => clearInterval(interval)
  }, [isPlaying])

  const sliderProgress = ((year - 2003) / (2025 - 2003)) * 100

  return (
    <section ref={sectionRef} className="relative min-h-[200vh]">
      <div className="sticky top-0 min-h-screen flex items-center py-12">
        <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">

          {/* ── Header ── */}
          <div
            className="mb-8"
            style={{
              opacity: scrollProgress > 0.05 ? 1 : 0,
              transform: scrollProgress > 0.05 ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <p className="text-primary font-sans text-xs tracking-[0.25em] uppercase mb-2">
              Visualization I
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              A Geography of <span className="text-[#d97757]">Persistence</span>
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed text-lg mt-4">
              While San Francisco has changed drastically since 2003, the spatial patterns of these incidents have remained
              remarkably fixed. Use the timeline to see how hotspots refuse to fade.
            </p>
          </div>

          {/* ── 2. Static Insight Callout (Now between Header and Map) ── */}
          <div
            className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4"
            style={{
              opacity: scrollProgress > 0.1 ? 1 : 0,
              transform: scrollProgress > 0.1 ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out 0.1s",
            }}
          >
            {/* Total Volume */}
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">Total Citywide</p>
              <div className="text-3xl font-serif font-bold text-foreground tabular-nums">
                {totalIncidents.toLocaleString()} <span className="text-sm font-sans font-normal text-muted-foreground">Reports</span>
              </div>
            </div>

            {/* Mission Share */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-[#d97757]/5 border border-[#d97757]/20 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="text-4xl font-serif font-black text-[#d97757] leading-none mb-1 tabular-nums">
                    {percentage}%
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#d97757]/70 font-bold">Mission Share</p>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1 text-sm">
                    <AlertCircle size={16} className="text-[#d97757]" />
                    Mission District Concentration
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In {year}, {percentage}% of all citywide reported incidents occurred within the Mission district boundaries.
                  </p>
                </div>
              </div>
              
              {/* Static visual background bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-[#d97757]/10 w-full">
                <div 
                  className="h-full bg-[#d97757] transition-all duration-700 ease-out" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Map card with overlay controls ── */}
          <div
            className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden"
            style={{
              background: "#151719",
              border: "1px solid rgba(217,119,87,0.2)",
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transform: scrollProgress > 0.15 ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* The map */}
            <iframe
              ref={iframeRef}
              src="/prostitution_heatmap_final.html"
              className="w-full h-full border-0"
              scrolling="no"
            />

            {/* Year — top right */}
            <div
              className="absolute top-4 right-5 font-serif font-bold tabular-nums pointer-events-none select-none"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#d97757",
                opacity: 0.9,
                textShadow: "0 2px 16px rgba(0,0,0,0.8), 0 0 40px rgba(13,13,15,0.6)",
                lineHeight: 1,
              }}
            >
              {year}
            </div>

            {/* Bottom gradient + controls */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(13,13,15,0.96))",
              }}
            >
              <div className="flex items-center gap-3">

                {/* Play / Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
                  style={{
                    width: 32,
                    height: 32,
                    background: "#d97757",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {isPlaying
                    ? <Pause style={{ width: 13, height: 13, color: "#fff" }} />
                    : <Play style={{ width: 13, height: 13, color: "#fff", marginLeft: 1 }} />
                  }
                </button>

                {/* Slider track */}
                <div className="relative flex-1" style={{ height: 3 }}>
                  {/* Background track */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                  />
                  {/* Filled portion */}
                  <div
                    className="absolute left-0 top-0 h-full rounded-full pointer-events-none"
                    style={{ width: `${sliderProgress}%`, background: "#d97757", transition: "width 0.1s" }}
                  />
                  {/* Invisible native input for interaction */}
                  <input
                    type="range"
                    min="2003"
                    max="2025"
                    step="1"
                    value={year}
                    onChange={(e) => {
                      setYear(parseInt(e.target.value))
                      setIsPlaying(false)
                    }}
                    className="absolute inset-0 w-full cursor-pointer opacity-0"
                    style={{ height: "100%", margin: 0 }}
                  />
                  {/* Thumb */}
                  <div
                    className="absolute top-1/2 pointer-events-none rounded-full"
                    style={{
                      width: 12,
                      height: 12,
                      background: "#d97757",
                      border: "2px solid rgba(245,192,122,0.5)",
                      transform: "translate(-50%, -50%)",
                      left: `${sliderProgress}%`,
                      transition: "left 0.1s",
                    }}
                  />
                </div>

                {/* End label */}
                <span
                  className="flex-shrink-0 tabular-nums"
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", minWidth: "2rem", textAlign: "right" }}
                >
                  2025
                </span>

              </div>
            </div>
          </div>

          {/* ── Figure caption ── */}
          <div
            className="mt-5 text-sm text-muted-foreground/80 pl-4"
            style={{
              borderLeft: "2px solid rgba(217,119,87,0.3)",
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transition: "opacity 0.6s ease 0.4s",
            }}
          >
            <span className="text-foreground font-medium">Figure 1:</span> Spatiotemporal Evolution of Prostitution in San Francisco (2003–2025) This heat map shows incident density across San Francisco Police Department (SFPD) districts. Hover over any area to see the district name and the number of incidents per year. The data highlights persistent hotspots in the Tenderloin and Mission districts. Despite citywide trends over the last two decades, these incidents have remained localized to specific urban corridors.
          </div>


        </div>
      </div>
    </section>
  )
}