"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

export interface ScrollytellingStep {
  id: string
  progress: number
  isActive: boolean
  hasEntered: boolean
}

export function useScrollytelling(stepCount: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [steps, setSteps] = useState<ScrollytellingStep[]>(
    Array.from({ length: stepCount }, (_, i) => ({
      id: `step-${i}`,
      progress: 0,
      isActive: false,
      hasEntered: false,
    }))
  )
  const [activeStepIndex, setActiveStepIndex] = useState(-1)
  const [overallProgress, setOverallProgress] = useState(0)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Overall progress through the container
    const containerTop = rect.top
    const containerHeight = rect.height
    const scrolled = windowHeight - containerTop
    const totalScrollable = containerHeight + windowHeight
    const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))
    setOverallProgress(progress)

    // Find step elements and calculate their progress
    const stepElements = container.querySelectorAll('[data-scrolly-step]')
    const newSteps: ScrollytellingStep[] = []
    let newActiveIndex = -1

    stepElements.forEach((el, index) => {
      const stepRect = el.getBoundingClientRect()
      const stepTop = stepRect.top
      const stepHeight = stepRect.height
      
      // Step is active when its center is in the viewport
      const stepCenter = stepTop + stepHeight / 2
      const viewportCenter = windowHeight / 2
      const distanceFromCenter = Math.abs(stepCenter - viewportCenter)
      const isActive = distanceFromCenter < stepHeight / 2
      
      // Progress through this step (0 to 1)
      const stepProgress = Math.max(0, Math.min(1, 
        (viewportCenter - stepTop) / stepHeight
      ))
      
      // Has the step ever been in view
      const hasEntered = stepTop < windowHeight

      if (isActive && newActiveIndex === -1) {
        newActiveIndex = index
      }

      newSteps.push({
        id: `step-${index}`,
        progress: stepProgress,
        isActive,
        hasEntered,
      })
    })

    setSteps(newSteps)
    setActiveStepIndex(newActiveIndex)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return {
    containerRef,
    steps,
    activeStepIndex,
    overallProgress,
  }
}

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - windowHeight / 2
      setOffset(distanceFromCenter * speed * -1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { ref, offset }
}

export function useStickyProgress() {
  const stickyRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRef.current || !contentRef.current) return

      const stickyRect = stickyRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      
      const isCurrentlySticky = stickyRect.top <= 0 && contentRect.bottom > window.innerHeight
      setIsSticky(isCurrentlySticky)

      // Progress through the sticky section
      const totalScroll = contentRect.height - window.innerHeight
      const currentScroll = -stickyRect.top
      const prog = Math.max(0, Math.min(1, currentScroll / totalScroll))
      setProgress(prog)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { stickyRef, contentRef, progress, isSticky }
}
