"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

type GuessContextType = {
  boroughGuess: string | null
  cuisineGuess: string | null
  setBoroughGuess: (guess: string) => void
  setCuisineGuess: (guess: string) => void
  hasGuessed: boolean
}

const GuessContext = createContext<GuessContextType | null>(null)

export function GuessProvider({ children }: { children: ReactNode }) {
  const [boroughGuess, setBoroughGuess] = useState<string | null>(null)
  const [cuisineGuess, setCuisineGuess] = useState<string | null>(null)
  
  const hasGuessed = boroughGuess !== null && cuisineGuess !== null
  
  return (
    <GuessContext.Provider value={{ 
      boroughGuess, 
      cuisineGuess, 
      setBoroughGuess, 
      setCuisineGuess,
      hasGuessed 
    }}>
      {children}
    </GuessContext.Provider>
  )
}

export function useGuess() {
  const context = useContext(GuessContext)
  if (!context) {
    throw new Error('useGuess must be used within a GuessProvider')
  }
  return context
}
