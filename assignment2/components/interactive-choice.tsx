"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface InteractiveChoiceProps {
  selected: string | null
  onSelect: (choice: string) => void
}

const revealMessages: Record<string, { text: string; isCorrect: boolean }> = {
  tenderloin: {
    text: "An understandable guess. The Tenderloin was historically the epicenter of street-level activity. But the data reveals a surprising shift—by 2021, the center of gravity had moved south.",
    isCorrect: false,
  },
  mission: {
    text: "Correct. Today, prostitution activity is highly concentrated in the Mission District. Our analysis of over 20 years of SFPD incident data shows a dramatic geographic shift that began accelerating after 2015.",
    isCorrect: true,
  },
  unknown: {
    text: "That's the honest answer. Most San Franciscans—even lifelong residents—would be surprised by what the data reveals. The answer is the Mission District, where activity has concentrated since 2021.",
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
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null)
  const reveal = selected ? revealMessages[selected] : null

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.2, rootMargin: '-50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      id="interactive-choice" 
      ref={sectionRef}
      className="py-24 sm:py-32 scroll-mt-8 relative"
    >
      {/* Subtle background gradient on section */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.18 0.02 260 / 0.5), transparent)',
          opacity: isInView ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      />

      <div className="relative">
        {/* Section label */}
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

        {/* Main question */}
        <div className="overflow-hidden mb-6">
          <h2 
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            Where would they go?
          </h2>
        </div>

        {/* Context paragraph */}
        <p 
          className="font-sans text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
          }}
        >
          If a visitor to San Francisco asked you where prostitution activity is most concentrated 
          today—at midnight on a Friday—what would you tell them?
        </p>

        {/* Choice buttons - Pudding style cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {choices.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => onSelect(choice.id)}
              onMouseEnter={() => setHoveredChoice(choice.id)}
              onMouseLeave={() => setHoveredChoice(null)}
              disabled={!!selected}
              className={`
                relative px-6 py-5 rounded-xl font-sans text-base text-left
                cursor-pointer overflow-hidden group
                transition-all duration-500 ease-out
                ${selected === choice.id
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : selected
                    ? "bg-card/50 text-muted-foreground border border-border/50"
                    : "bg-card text-card-foreground border border-border hover:border-primary/60 hover:bg-card/80"
                }
              `}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView 
                  ? `translateY(0) scale(${hoveredChoice === choice.id && !selected ? 1.02 : 1})` 
                  : 'translateY(40px) scale(0.95)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.45 + index * 0.08}s`,
                boxShadow: hoveredChoice === choice.id && !selected 
                  ? '0 10px 40px -10px oklch(0.65 0.2 30 / 0.3)' 
                  : 'none',
              }}
            >
              {/* Morphing background on hover */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl"
                style={{
                  opacity: hoveredChoice === choice.id && !selected ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              />

              {/* Content */}
              <span className="relative flex items-center gap-3">
                {choice.id !== "unknown" && (
                  <span 
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full
                      transition-all duration-300
                      ${selected === choice.id 
                        ? "bg-primary-foreground/20" 
                        : "bg-primary/10 group-hover:bg-primary/20"
                      }
                    `}
                  >
                    <MapPin className={`w-4 h-4 ${selected === choice.id ? "text-primary-foreground" : "text-primary"}`} />
                  </span>
                )}
                {choice.id === "unknown" && (
                  <span 
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-lg
                      transition-all duration-300
                      ${selected === choice.id 
                        ? "bg-primary-foreground/20" 
                        : "bg-muted group-hover:bg-muted/80"
                      }
                    `}
                  >
                    ?
                  </span>
                )}
                <span className="font-medium">{choice.label}</span>
              </span>

              {/* Selection indicator */}
              {selected === choice.id && (
                <div 
                  className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary-foreground"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Hint text */}
        {!selected && (
          <p 
            className="text-xs text-muted-foreground/50 font-sans"
            style={{
              opacity: isInView ? 1 : 0,
              transition: 'opacity 0.8s ease 1s',
            }}
          >
            Click to reveal the answer
          </p>
        )}

        {/* Reveal panel with morphing animation */}
        <div 
          className={`
            overflow-hidden transition-all duration-700 ease-out
            ${reveal ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          {reveal && (
            <div 
              className={`
                relative mt-8 p-8 rounded-2xl overflow-hidden
                ${reveal.isCorrect 
                  ? "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30" 
                  : "bg-card border border-border"
                }
              `}
              style={{
                animation: 'morphIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              {/* Animated highlight line */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1 ${reveal.isCorrect ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                style={{
                  animation: 'expandHeight 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
                  transformOrigin: 'top',
                  transform: 'scaleY(0)',
                }}
              />

              {/* Text content with word-by-word fade in */}
              <p className="font-sans text-lg text-foreground leading-relaxed">
                {reveal.text.split(' ').map((word, i) => (
                  <span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    style={{
                      opacity: 0,
                      animation: `wordFadeIn 0.4s ease forwards`,
                      animationDelay: `${0.3 + i * 0.02}s`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </p>
              
              {reveal.isCorrect && (
                <p 
                  className="mt-6 text-sm text-primary/80 font-sans"
                  style={{
                    opacity: 0,
                    animation: 'fadeSlideUp 0.6s ease 1.5s forwards',
                  }}
                >
                  Continue scrolling to explore the data behind this transformation.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes morphIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes expandHeight {
          to {
            transform: scaleY(1);
          }
        }
        @keyframes wordFadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes fadeSlideUp {
          to {
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </section>
  )
}
