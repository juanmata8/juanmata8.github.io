"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const clusterSteps = [
  {
    id: 'clean-stable',
    count: '17,873',
    title: 'Clean & Stable',
    description: 'The majority. Restaurants that maintain consistent, good scores over time. They represent the baseline of the system working as intended.',
    color: 'var(--chart-3)'
  },
  {
    id: 'high-pressure',
    count: '1,869',
    title: 'High-Traffic Pressure',
    description: 'A smaller cluster in dense, high-traffic zones. More inspections, more scrutiny, but not necessarily worse outcomes—just more data points.',
    color: 'var(--chart-1)'
  },
  {
    id: 'improving',
    count: '7,791',
    title: 'Improving Trajectory',
    description: 'Restaurants with higher initial scores that trend downward over time. The system captures correction. These aren\'t failures—they\'re recoveries.',
    color: 'var(--chart-2)'
  }
]

function ClusterVisualization({ activeCluster }: { activeCluster: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="relative w-full max-w-md aspect-square">
        {/* Animated background */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-5"
          style={{
            background: 'conic-gradient(from 0deg, var(--chart-1), var(--chart-2), var(--chart-3), var(--chart-1))'
          }}
        />
        
        {/* Cluster circles */}
        {clusterSteps.map((cluster, index) => {
          const isActive = activeCluster === index
          const positions = [
            { top: '18%', left: '25%', size: '50%' },
            { top: '55%', left: '58%', size: '25%' },
            { top: '30%', left: '42%', size: '40%' }
          ]
          const pos = positions[index]
          
          return (
            <motion.div
              key={cluster.id}
              animate={{
                opacity: isActive ? 0.7 : 0.15,
                scale: isActive ? 1.08 : 1,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute rounded-full"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.size,
                height: pos.size,
                backgroundColor: cluster.color,
                boxShadow: isActive ? `0 0 40px ${cluster.color}40` : 'none'
              }}
            />
          )
        })}
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-sans text-xs text-muted-foreground/60 tracking-widest uppercase">
            PCA Space
          </span>
        </div>
      </div>
    </div>
  )
}

export function Clusters() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeCluster, setActiveCluster] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const section = sectionRef.current
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionHeight = rect.height
      const windowHeight = window.innerHeight
      
      const scrollProgress = (-sectionTop + windowHeight * 0.3) / (sectionHeight - windowHeight * 0.7)
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress))
      
      const clusterIndex = Math.min(
        Math.floor(clampedProgress * clusterSteps.length),
        clusterSteps.length - 1
      )
      setActiveCluster(clusterIndex)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <section ref={sectionRef} className="relative border-t border-border">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto px-6 py-16 text-center"
      >
        <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
          Profiles
        </span>
        <h2 
          className="text-4xl sm:text-5xl font-medium text-foreground"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          Clusters, Not Caricatures
        </h2>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row">
        {/* Sticky visualization */}
        <div className="lg:w-[55%] lg:sticky lg:top-0 lg:h-screen flex items-center justify-center bg-secondary/10">
          <ClusterVisualization activeCluster={activeCluster} />
        </div>
        
        {/* Scrolling narrative */}
        <div className="lg:w-[45%]">
          {clusterSteps.map((cluster, index) => (
            <motion.div 
              key={cluster.id}
              className="min-h-[80vh] flex items-center px-6 lg:px-12"
            >
              <motion.div 
                animate={{
                  opacity: activeCluster === index ? 1 : 0.3,
                  x: activeCluster === index ? 0 : 20
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-md"
              >
                <motion.div 
                  animate={{ scale: activeCluster === index ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-3 h-3 rounded-full mb-6"
                  style={{ backgroundColor: cluster.color }}
                />
                <p className="font-mono text-3xl sm:text-4xl mb-2 text-foreground tabular-nums">
                  {cluster.count}
                </p>
                <h3 
                  className="text-2xl sm:text-3xl font-medium mb-4 text-foreground"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  {cluster.title}
                </h3>
                <p className="font-serif text-base leading-[1.8] text-muted-foreground">
                  {cluster.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto px-6 py-16 text-center"
      >
        <p className="font-serif text-lg text-muted-foreground leading-relaxed italic">
          These aren&apos;t moral categories. They&apos;re ecosystem profiles—shaped by location, 
          inspection frequency, and operational history.
        </p>
        
        {/* Decorative divider */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-border" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
          <span className="w-8 h-px bg-border" />
        </div>
      </motion.div>
    </section>
  )
}
