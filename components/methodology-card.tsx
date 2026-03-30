"use client"

import { useState, useEffect, useRef } from "react"
import { Database, FileText, AlertTriangle } from "lucide-react"

export function MethodologyCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.3, rootMargin: '-30px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const methodologyItems = [
    {
      icon: Database,
      title: "Data Source",
      description: "SFPD incident reports from the SF Open Data Portal, spanning 2003–2025.",
    },
    {
      icon: FileText,
      title: "Classification",
      description: "Incidents categorized under 'Prostitution' in official police records.",
    },
    {
      icon: AlertTriangle,
      title: "Important Caveat",
      description: "This data only reflects reported and enforced activity. Therefore, it does not accurately depict the full scope of activity.",
    },
  ]

  // Helper for smooth scrolling to sections
  const scrollToMethodology = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('methodology-footer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="methodology-summary"
      ref={cardRef}
      className="py-16 scroll-mt-16"
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Subtle accent line */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
          style={{
            transform: isInView ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'top',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <p 
              className="text-primary font-sans text-[10px] tracking-[0.25em] uppercase mb-2"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateX(0)' : 'translateX(-10px)',
                transition: 'all 0.5s ease 0.2s',
              }}
            >
              About the Data
            </p>
            <h3 
              className="font-serif text-xl sm:text-2xl font-bold text-foreground"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateX(0)' : 'translateX(-10px)',
                transition: 'all 0.5s ease 0.3s',
              }}
            >
              Methodology
            </h3>
          </div>

          {/* Grid of items */}
          <div className="grid sm:grid-cols-3 gap-6">
            {methodologyItems.map((item, index) => (
              <div 
                key={item.title}
                className="group"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.1}s`,
                }}
              >
                <div 
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary mb-3 transition-all duration-300 group-hover:bg-primary/10"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h4 className="font-sans text-sm font-semibold text-foreground mb-1">
                  {item.title}
                </h4>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional note */}
          <div 
            className="mt-8 pt-6 border-t border-border"
            style={{
              opacity: isInView ? 1 : 0,
              transition: 'opacity 0.6s ease 0.8s',
            }}
          >
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              We analyzed <span className="text-foreground font-medium">22 years</span> of incident data, 
              geocoded to SF neighborhoods. Patterns shown may reflect changes in enforcement priorities, 
              reporting practices, or genuine shifts in activity.
            </p>
             <a
              href="#methodology-footer"
              onClick={scrollToMethodology}
              className="text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-4 transition-colors cursor-pointer"
            >
              Read more in the methodology.
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
