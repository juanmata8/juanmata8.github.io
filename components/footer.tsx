"use client"

import { ExternalLink, Database, FileText } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

export function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const sectionHeight = rect.height

    const scrolled = windowHeight - rect.top
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight))
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <footer ref={sectionRef} className="relative bg-gradient-to-b from-background to-card border-t border-border">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-20 sm:py-28">
        {/* Synthesis section header */}
        <div className="mb-12">
          <div className="overflow-hidden mb-2">
            <p
              className="text-primary font-sans text-xs tracking-[0.25em] uppercase"
              style={{
                transform: scrollProgress > 0.05 ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Conclusion
            </p>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            {['The', 'Story', 'the', 'Data', 'Tells'].map((word, i) => (
              <span key={word} className="inline-block overflow-hidden mr-[0.2em]">
                <span
                  className="inline-block"
                  style={{
                    transform: scrollProgress > 0.08 ? 'translateY(0)' : 'translateY(100%)',
                    transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Main narrative with scroll-based reveal animations */}
        <div className="space-y-6 mb-16">
          <p
            className="font-sans text-lg text-muted-foreground leading-relaxed"
            style={{
              opacity: scrollProgress > 0.12 ? 1 : 0,
              transform: scrollProgress > 0.12 ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            As seen, the Mission has always been a prostitution hotspot <a href="https://localnewsmatters.org/2023/08/17/sex-work-and-the-city-policing-prostitution-in-san-francisco-reflects-evolving-attitudes/" className="underline decoration-primary/50 hover:decoration-primary">[3]</a>. However, Our visualizations show a collapse in recorded data, but we must distinguish between 
      <strong> activity </strong> and <strong> enforcement</strong>. Last year's "empty map" does not prove that prostitution has disappeared. Rather, it shows that the way we record it has fundamentally changed for the following reasons:
          </p>


          <div className="space-y-4 pl-4 border-l-2 border-primary/20">
            <p
              className="font-sans text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: scrollProgress > 0.24 ? 1 : 0,
                transform: scrollProgress > 0.24 ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span className="text-primary font-medium">1. Legislative Change:</span> Implemented in early 2023, SB 357 (the Safer Streets for All Act) eliminated the most common basis for arrest. Previously, "loitering with intent" accounted for 65% of all prostitution-related citations. With this legal mechanism gone, the primary source of data on "activity" on the streets has disappeared from police records <a href="https://localnewsmatters.org/2023/08/17/sex-work-and-the-city-policing-prostitution-in-san-francisco-reflects-evolving-attitudes/" className="underline decoration-primary/50 hover:decoration-primary">[3]</a>.
            </p>

            <p
              className="font-sans text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: scrollProgress > 0.30 ? 1 : 0,
                transform: scrollProgress > 0.30 ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span className="text-primary font-medium">2. Digital Migration:</span> The lockdowns of 2020 disrupted the physical timeline. The nocturnal economy shifted online, and platforms like OnlyFans grew from 7.5 million to 85 million users in a matter of months. For many, the "street" was replaced by the "screen," a safer and more autonomous environment entirely outside local police incident maps. <a href="https://doi.org/10.3390/socsci12020062" className="underline decoration-primary/50 hover:decoration-primary">[4]</a>.
            </p>
          </div>

          <p
            className="font-sans text-xl text-foreground font-medium leading-relaxed mt-8"
            style={{
              opacity: scrollProgress > 0.36 ? 1 : 0,
              transform: scrollProgress > 0.36 ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Empty data doesn&apos;t mean the activity vanished. It just evolved and adapt.
          </p>
        </div>

        {/* Pull quote with dramatic reveal */}
        <blockquote
          className="relative my-16 py-8"
          style={{
            opacity: scrollProgress > 0.3 ? 1 : 0,
            transform: scrollProgress > 0.3 ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Animated left border */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"
            style={{
              transform: scrollProgress > 0.32 ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          <div className="pl-8">
            <p className="font-serif text-2xl sm:text-3xl text-foreground italic leading-snug">
              {'"The city changes. The law changes. The activity adapts. The data remembers."'.split(' ').map((word, i) => {
                const wordProgress = 0.35 + (i * 0.015)
                const isVisible = scrollProgress > wordProgress

                return (
                  <span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all 0.5s ease',
                    }}
                  >
                    {word}
                  </span>
                )
              })}
            </p>
          </div>
        </blockquote>

        {/* Methodology note */}
        <div
          id="methodology-footer"
          className="mb-12 p-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl"
          style={{
            opacity: scrollProgress > 0.45 ? 1 : 0,
            transform: scrollProgress > 0.45 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h3 className="font-sans text-foreground font-medium mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            Methodology Note
          </h3>

          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed text-left">
            <p>
              This project evaluates crime data from the San Francisco Open Data Portal, specifically police department incident reports from two time periods: historical (from 2003 to May 2018) and current (from May 2018 to the present). These datasets were merged using the Pandas library to facilitate a comprehensive study of long-term trends and analyze how crime patterns evolved. This integration also provides greater statistical power for our analysis. However, due to the evolution of crime classifications and naming conventions over time, there is a risk of <strong>dirty data</strong> (which includes technical inconsistencies like duplicates and formatting errors, but also systemic skews where the data may reflect historical policing patterns and biases rather than a complete record of all incidents).
            </p>

            <p>
              Regarding the data cleaning process, the following considerations were taken into account:
            </p>

            <ul className="list-disc pl-5 space-y-1">
              <li>Standardized the date format to ensure consistency across all records and allow accurate temporal analysis.</li>
              <li>Standardized the district names to avoid inconsistencies due to spelling variations or formatting differences.</li>
            </ul>

            <p>
              When analyzing potential duplicated records, we examined the incident number and code columns. However, we determined that these fields are not unique identifiers of individual records (rows), but rather identifiers of crimes <a href="https://data.sfgov.org/" className="underline decoration-primary/50 hover:decoration-primary">[0]</a>. A single crime can generate multiple records [0]. For example, an incident involving multiple offenses may be registered under several codes. To prevent duplicated records in the integrated dataset, we <em>removed crimes from the year 2018 in the historical dataset</em>, since the most recent dataset already begins on January 1, 2018. This ensured that overlapping periods did not introduce duplicated entries.
            </p>

            <div className="pt-4 border-t border-border/40">
              <p className="mb-3">
                This specific category was chosen for analysis because it provides intriguing insights into the diverse nature of public safety incidents:
              </p>
              <p className="text-foreground font-medium mb-2 uppercase tracking-wide">
                Focus Crime: &apos;PROSTITUTION&apos;
              </p>
              <p className="italic text-xs">
                Prostitution serves as a unique urban phenomenon for study because its geography is deeply tied to specific street corridors and nocturnal patterns. Unlike many property crimes, it offers a distinct window into how illicit trades adapt, relocate, and persist in response to shifting city-wide enforcement and neighborhood displacement.
              </p>
            </div>

            <p className="pt-4 text-xs italic opacity-70">
              Note: The methodology for all plots was inspired by the DAOST textbook and the data ink ratio principle, aimed at reducing non essential elements to prioritize the data itself. Refer to the references section at the end of the report for further details.
            </p>
          </div>
        </div>
        {/* References with staggered animation */}
        <div
          className="mb-16"
          style={{
            opacity: scrollProgress > 0.55 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <h3 className="font-sans text-foreground font-medium mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            Data Sources
          </h3>

          <ul className="space-y-4">
            {[
              {
                href: "https://www.wrtv.com/longform/dear-john-when-men-buy-sex-its-the-women-who-pay-for-it",
                text: "WRTV Investigative Series",
                subtitle: "Dear John: When men buy sex, it's the women who pay for it"
              },
              {
                href: 'https://doi.org/10.1038/s41562-021-01139-z',
                text: "Nature Human Behaviour",
                subtitle: "A global analysis of the impact of COVID-19 stay-at-home restrictions on crime"
              },
              {
                href: 'https://localnewsmatters.org/2023/08/17/sex-work-and-the-city-policing-prostitution-in-san-francisco-reflects-evolving-attitudes/',
                text: "Local News Matter",
                subtitle: "Sex work and the city: How the policing of prostitution in San Francisco has evolved"
              },
              {
                href: 'https://doi.org/10.3390/socsci12020062',
                text: "MDPI Social Sciences",
                subtitle: "‘Cam Girls and Adult Performers Are Enjoying a Boom in Business’: The Reportage on the Pandemic Impact on Virtual Sex Work"
              },
              { href: "https://data.sfgov.org/", text: "SF Open Data Portal", subtitle: "SFPD Incident Reports (2003-2025)" },
              { href: "https://doi.org/10.1109/TVCG.2010.179", text: "Segel & Heer", subtitle: "Narrative Visualization Framework" },
              { href: "https://pudding.cool/", text: "The Pudding", subtitle: "Visual essay inspiration" },
            ].map((link, index) => (
              <li
                key={link.href}
                style={{
                  opacity: scrollProgress > 0.58 + index * 0.03 ? 1 : 0,
                  transform: scrollProgress > 0.58 + index * 0.03 ? 'translateX(0)' : 'translateX(-30px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 -mx-4 rounded-xl hover:bg-card/50 transition-colors duration-300"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  <div>
                    <span className="text-foreground group-hover:text-primary transition-colors font-medium">
                      {link.text}
                    </span>
                    <span className="text-muted-foreground/60 text-sm ml-2">
                      — {link.subtitle}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer meta with fade */}
        <div
          className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60"
          style={{
            opacity: scrollProgress > 0.7 ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          <p>A data story exploring urban patterns through public records.</p>
          <p>Built with Next.js, Tailwind CSS & Recharts</p>
        </div>
      </div>
    </footer>
  )
}
