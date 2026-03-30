"use client"

import { useEffect, useState, useRef } from "react"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const heroHeight = heroRef.current?.offsetHeight || 1000
  const scrollProgress = Math.min(1, scrollY / heroHeight)
  const opacity = Math.max(0, 1 - scrollProgress * 1.5)
  const scale = 1 + scrollProgress * 0.15
  const blur = scrollProgress * 10

  // Helper for smooth scrolling to sections
  const scrollToMethodology = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('methodology');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      ref={heroRef}
      className="relative min-h-[120vh] flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Morphing gradient background */}
      <div
        className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          background: `
            radial-gradient(ellipse 120% 80% at 50% 20%, oklch(0.22 0.03 260 / 0.9) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 80% 80%, oklch(0.25 0.12 30 / 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 15% 70%, oklch(0.2 0.04 280 / 0.5) 0%, transparent 40%),
            oklch(0.11 0.005 260)
          `
        }}
      />

      {/* Animated fog layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, oklch(0.12 0.01 260 / 0.3) 70%)',
            animation: 'fogDrift 20s ease-in-out infinite',
            opacity: isLoaded ? 0.6 : 0,
            transition: 'opacity 2s ease',
          }}
        />
      </div>

      {/* Floating light particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${5 + (i * 3.1) % 90}%`,
              top: `${10 + (i * 5.7) % 80}%`,
              background: i % 5 === 0
                ? 'oklch(0.65 0.2 30 / 0.6)'
                : 'oklch(0.7 0.02 260 / 0.4)',
              transform: `translateY(${scrollY * (0.05 + (i % 10) * 0.015)}px)`,
              opacity: isLoaded ? (0.3 + (i % 3) * 0.2) : 0,
              transition: `opacity 1.5s ease ${i * 0.03}s`,
              animation: `particleFloat ${4 + i % 4}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Main content with parallax */}
      <div
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
        style={{
          opacity,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        {/* Overline with reveal */}
        <div className="overflow-hidden mb-8">
          <p
            className="text-primary font-sans text-xs sm:text-sm tracking-[0.4em] uppercase"
            style={{
              transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
              opacity: isLoaded ? 1 : 0,
              transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 0.8s ease 0.3s',
            }}
          >
            Social Data Analysis
          </p>
        </div>

        {/* Title with word-by-word stagger */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.9] tracking-tight mb-6">
          {['The', 'Night', 'Shift'].map((word, i) => (
            <span key={word} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
              <span
                className={`inline-block ${word === 'Night' ? 'text-primary' : 'text-foreground'}`}
                style={{
                  transform: isLoaded
                    ? 'translateY(0) rotate(0deg)'
                    : 'translateY(110%) rotate(3deg)',
                  opacity: isLoaded ? 1 : 0,
                  transition: `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.08}s, opacity 0.6s ease ${0.4 + i * 0.08}s`,
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <div className="overflow-hidden mb-10">
          <p
            className="font-serif text-xl sm:text-2xl md:text-3xl text-muted-foreground text-balance"
            style={{
              transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
              opacity: isLoaded ? 1 : 0,
              transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s, opacity 0.8s ease 0.7s',
            }}
          >
            Mapping the Hidden Rhythm of San Francisco
          </p>
        </div>

        {/* Animated divider */}
        <div
          className="h-px w-32 mx-auto mb-10 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          style={{
            transform: isLoaded ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.9s',
          }}
        />

        {/* Opening paragraphs with stagger */}
        <div className="max-w-xl mx-auto space-y-6">
          <p
            className="font-sans text-base sm:text-lg text-muted-foreground leading-relaxed"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 1s',
            }}
          >
            We all have that friend who travels to Amsterdam too often, claiming to be on a "business trip," but who always ends up in the Red Light District.
          </p>

          <blockquote
            className="relative font-serif text-xl sm:text-2xl text-primary/90 italic py-4"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 1.15s',
            }}
          >
            <span
              className="absolute -left-4 -top-2 text-5xl text-primary/20 font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              &ldquo;
            </span>
            Which places in San Francisco should he visit to experience this?
            <span
              className="absolute -right-2 bottom-0 text-5xl text-primary/20 font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              &rdquo;
            </span>
          </blockquote>


        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{
          opacity: isLoaded && opacity > 0.5 ? 1 : 0,
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
        @keyframes fogDrift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(2%, 1%) rotate(1deg); }
          66% { transform: translate(-1%, -1%) rotate(-1deg); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-8px) translateX(3px); }
          50% { transform: translateY(-4px) translateX(-2px); }
          75% { transform: translateY(-12px) translateX(1px); }
        }
        @keyframes scrollPulse {
          0% { top: 6px; opacity: 1; }
          50% { top: 18px; opacity: 0.3; }
          100% { top: 6px; opacity: 1; }
        }
      `}</style>
    </header>
  )
}
