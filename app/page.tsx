import { ScrollProgress } from '@/components/scroll-progress'
import { Hero } from '@/components/sections/hero'
import { Intro } from '@/components/sections/Intro'
import { TheGuess } from '@/components/sections/the-guess'
import { BoxPlots } from '@/components/sections/box-plots'
import { ClevelandDotPlot } from '@/components/sections/cleveland-dot-plot'
import { StickyInvestigation } from '@/components/sections/sticky-investigation'
import { LogisticRegression } from '@/components/sections/logistic-regression'
import { CuisineHeatmap } from '@/components/sections/policy-heatmap'
import { ModelReveal } from '@/components/sections/model-reveal'
import { Exploration } from '@/components/sections/exploration'
import { Close } from '@/components/sections/close'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      
      {/* Section 1: Hero - Menu Cover that opens */}
      <Hero />

      <Intro />
      
      {/* Section 2: The Guess - Interactive questions */}
      <TheGuess />
      
      {/* Section 3: Box Plots - Visceral entry, test stereotypes */}
      <BoxPlots />
      
      {/* Section 4: Cleveland Dot Plot - Rank and compare cuisines */}
      <StickyInvestigation/>
      
      {/* Section 5: Logistic Regression - What predicts A/B/C? */}
      <LogisticRegression />
      
      {/* Section 6: Policy Heatmap - System-wide view over time */}
      <CuisineHeatmap />
      
      
      {/* Section 8: Exploration - Interactive map */}
      <Exploration />
      
      {/* Section 9: Close */}
      <Close />
      
      {/* Footer with Methodology */}
      <Footer />
    </main>
  )
}
