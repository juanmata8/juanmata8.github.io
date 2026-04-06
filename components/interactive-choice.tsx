"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface InteractiveChoiceProps {
  selected: string | null
  onSelect: (choice: string | null) => void // Changed to allow null for toggling
}

const revealMessages: Record<string, { text: string; isCorrect: boolean }> = {
  tenderloin: {
    text: "It's an understandable guess. The Tenderloin is one of the districts with the highest level of prostitution activity. However, it has never been the hottest spot.",
    isCorrect: false,
  },
  mission: {
    text: "Correct. Prostitution is highly concentrated in the Mission District.",
    isCorrect: true,
  },
  unknown: {
    text: "That's the honest answer. Even lifelong San Franciscans would be surprised by what the data reveals. The answer is the Mission District, which has been the epicenter of prostitution acitvity.",
    isCorrect: false,
  },
}

const choices = [
  { id: "tenderloin", label: "Tenderloin" },
  { id: "mission", label: "Mission" },
  { id: "unknown", label: "I don't know" },
]

export function InteractiveChoice({ selected, onSelect }: InteractiveChoiceProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null)
  const reveal = selected ? revealMessages[selected] : null

  useEffect(() => {
    setIsLoaded(true)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold: 0.2, rootMargin: '-50px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Handler to allow switching or deselecting
  const handleSelect = (id: string) => {
    if (selected === id) {
      onSelect(null) // Unselect if clicking the same one
    } else {
      onSelect(id) // Switch to new choice
    }
  }

  return (
    <section 
      id="interactive-choice" 
      ref={sectionRef}
      className="py-24 sm:py-32 scroll-mt-8 relative min-h-[80vh] flex flex-col justify-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.18 0.02 260 / 0.5), transparent)',
          opacity: isInView ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 w-full">
        <div className="overflow-hidden mb-3">
          <p 
            className="text-primary font-sans text-xs tracking-[0.25em] uppercase"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            }}
          >
            Test Your Intuition
          </p>
        </div>

        <div className="overflow-hidden mb-6">
          <h2 
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            Which district would they go to?
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {choices.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              onMouseEnter={() => setHoveredChoice(choice.id)}
              onMouseLeave={() => setHoveredChoice(null)}
              // DISABLED REMOVED HERE to allow clicking others
              className={`
                relative px-6 py-5 rounded-xl font-sans text-base text-left
                cursor-pointer overflow-hidden group
                transition-all duration-500 ease-out
                ${selected === choice.id
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "bg-card text-card-foreground border border-border hover:border-primary/60 hover:bg-card/80"
                }
              `}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView 
                  ? `translateY(0) scale(${hoveredChoice === choice.id ? 1.02 : 1})` 
                  : 'translateY(40px) scale(0.95)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.45 + index * 0.08}s`,
              }}
            >
              <span className="relative flex items-center gap-3">
                {choice.id !== "unknown" ? (
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${selected === choice.id ? "bg-primary-foreground/20" : "bg-primary/10 group-hover:bg-primary/20"}`}>
                    <MapPin className={`w-4 h-4 ${selected === choice.id ? "text-primary-foreground" : "text-primary"}`} />
                  </span>
                ) : (
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-lg transition-all duration-300 ${selected === choice.id ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-muted/80"}`}>?</span>
                )}
                <span className="font-medium">{choice.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Reveal panel with key for smoother transition when switching */}
        <div className={`overflow-hidden transition-all duration-700 ease-out ${reveal ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {reveal && (
            <div 
              key={selected} // Adding a key forces a slight re-animation when switching content
              className={`relative mt-8 p-8 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500 ${reveal.isCorrect ? "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30" : "bg-card border border-border"}`}
            >
              <p className="font-sans text-lg text-foreground leading-relaxed">
                {reveal.text}
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{
          opacity: isLoaded && isInView ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.5s',
        }}
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50 font-sans">
          Scroll to explore
        </span>
        <div className="relative w-5 h-8 rounded-full border border-muted-foreground/30">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
            style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0% { top: 6px; opacity: 1; }
          50% { top: 18px; opacity: 0.3; }
          100% { top: 6px; opacity: 1; }
        }
      `}</style>
    </section>
  )
}