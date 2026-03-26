"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { InteractiveChoice } from "@/components/interactive-choice"
import { MapVisualization } from "@/components/map-visualization"
import { RhythmVisualization } from "@/components/rhythm-visualization"
import { CalendarVisualization } from "@/components/calendar-visualization"
import { Footer } from "@/components/footer"

export default function NightShiftStory() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveChoice 
          selected={selectedNeighborhood}
          onSelect={setSelectedNeighborhood}
        />
        
        <MapVisualization />


        <CalendarVisualization />
        
        <RhythmVisualization />
        
      </div>
      
      <Footer />
    </main>
  )
}
