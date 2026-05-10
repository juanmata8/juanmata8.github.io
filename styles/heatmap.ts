export type HeatmapCell = {
  r: number  // ratio vs city average
  s: number  // mean score for the cuisine that year
  c: number  // city average score that year
  n: number  // number of inspections
}

export type HeatmapPayload = {
  years: number[]
  cuisines: string[]
  covid_years: number[]
  data: Record<string, Record<string, HeatmapCell | null>>
}