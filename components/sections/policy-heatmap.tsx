"use client"

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/use-in-view'
import heatmapData from '@/public/heatmap_data.json'
import type { HeatmapPayload, HeatmapCell } from '@/styles/heatmap'

const PAYLOAD = heatmapData as HeatmapPayload

// ── Color scale ─────────────────────────────────────────────────────────
// Diverging muted red → cream → muted green, designed to sit inside the
// warm cream aesthetic without screaming.
const COLORS = {
  betterStrong: [107, 132, 88],   // #6B8458 muted moss
  betterMid: [168, 184, 154],  // #A8B89A soft sage
  neutral: [239, 230, 214],  // #EFE6D6 cream
  worseMid: [198, 138, 122],  // #C68A7A soft rose
  worseStrong: [160, 72, 72],    // #A04848 dusty terracotta
} as const

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function lerpRgb(c1: readonly number[], c2: readonly number[], t: number) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]
}
function colorForRatio(r: number): string {
  const clamped = Math.max(0.7, Math.min(1.3, r))
  let rgb: number[]
  if (clamped <= 1.0) {
    const t = (clamped - 0.7) / 0.3
    rgb = t < 0.5
      ? lerpRgb(COLORS.betterStrong, COLORS.betterMid, t / 0.5)
      : lerpRgb(COLORS.betterMid, COLORS.neutral, (t - 0.5) / 0.5)
  } else {
    const t = (clamped - 1.0) / 0.3
    rgb = t < 0.5
      ? lerpRgb(COLORS.neutral, COLORS.worseMid, t / 0.5)
      : lerpRgb(COLORS.worseMid, COLORS.worseStrong, (t - 0.5) / 0.5)
  }
  return `rgb(${rgb[0] | 0}, ${rgb[1] | 0}, ${rgb[2] | 0})`
}

// ── Subcomponents ───────────────────────────────────────────────────────
type CellState = { cuisine: string; year: number } | null

function HeatmapCell({
  cuisine,
  year,
  cell,
  isCovid,
  isInView,
  rowIndex,
  colIndex,
  isHovered,
  onHover,
  cellRef,
}: {
  cuisine: string
  year: number
  cell: HeatmapCell | null
  isCovid: boolean
  isInView: boolean
  rowIndex: number
  colIndex: number
  isHovered: boolean
  onHover: (state: CellState, ev?: React.MouseEvent) => void
  cellRef?: (el: HTMLDivElement | null) => void
}) {
  const isGap = isCovid || cell === null

  return (
    <motion.div
      ref={cellRef}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{
        duration: 0.4,
        delay: rowIndex * 0.06 + colIndex * 0.03,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={(e) => !isGap && onHover({ cuisine, year }, e)}
      onMouseMove={(e) => !isGap && onHover({ cuisine, year }, e)}
      onMouseLeave={() => onHover(null)}
      className={`aspect-square min-h-[36px] relative transition-all duration-200 ${isGap
          ? 'cursor-not-allowed'
          : 'cursor-crosshair'
        } ${isHovered ? 'z-10 scale-110' : ''
        }`}
      style={{
        background: isGap
          ? 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 5px)'
          : colorForRatio(cell!.r),
        outline: isHovered ? '1.5px solid hsl(var(--foreground))' : '1px solid transparent',
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
      }}
    />
  )
}

function Tooltip({
  state,
  data,
  position,
}: {
  state: CellState
  data: HeatmapCell | null
  position: { x: number; y: number }
}) {
  if (!state || !data) return null
  const verdict =
    data.r > 1.05 ? 'worse than city avg'
      : data.r < 0.95 ? 'better than city avg'
        : 'near city avg'

  return (
    <div
      className="fixed pointer-events-none z-50 px-3 py-2.5 max-w-[220px]"
      style={{
        left: position.x,
        top: position.y,
        background: 'hsl(var(--foreground))',
        color: 'black',
        boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        lineHeight: 1.5,
      }}
    >
      <div
        className="mb-1 font-medium"
        style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem' }}
      >
        {state.cuisine} · {state.year}
      </div>
      <TooltipRow k="ratio" v={`${data.r.toFixed(2)}× ${verdict}`} />
      <TooltipRow k="mean score" v={data.s.toFixed(1)} />
      <TooltipRow k="city avg" v={data.c.toFixed(1)} />
      <TooltipRow k="inspections" v={data.n.toLocaleString()} />
    </div>
  )
}

function TooltipRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 ">
      <span style={{ color: 'rgba(0,0,0,0.55)' }}>{k}</span>
      <span>{v}</span>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────
export function CuisineHeatmap() {
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: true })
  const [hovered, setHovered] = useState<CellState>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [covidLabelLeft, setCovidLabelLeft] = useState<number | null>(null)

  const gridRef = useRef<HTMLDivElement>(null)
  const covidColRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const { years, cuisines, covid_years, data } = PAYLOAD
  const covidSet = new Set(covid_years)

  const handleHover = (state: CellState, ev?: React.MouseEvent) => {
    setHovered(state)
    if (state && ev) {
      const pad = 14
      const tw = 220
      const th = 110
      let x = ev.clientX + pad
      let y = ev.clientY + pad
      if (x + tw > window.innerWidth - 8) x = ev.clientX - tw - pad
      if (y + th > window.innerHeight - 8) y = ev.clientY - th - pad
      setTooltipPos({ x, y })
    }
  }

  // Position the COVID-pause label horizontally centered over the gap columns
  useLayoutEffect(() => {
    if (!isInView || !gridRef.current) return
    const sortedCovid = [...covid_years].sort((a, b) => a - b)
    const first = covidColRefs.current[sortedCovid[0]]
    const last = covidColRefs.current[sortedCovid[sortedCovid.length - 1]]
    if (!first || !last) return
    const gridRect = gridRef.current.getBoundingClientRect()
    const r1 = first.getBoundingClientRect()
    const r2 = last.getBoundingClientRect()
    setCovidLabelLeft(((r1.left + r2.right) / 2) - gridRect.left)
  }, [isInView, covid_years])

  return (
    <section
      ref={ref}
      className="py-24 border-t border-border"
      style={{ background: 'hsl(var(--background))' }}
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-2xl"
        >
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
            Cuisine View
          </span>
          <h2
            className="text-4xl sm:text-5xl font-medium text-foreground mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The system has a pattern too
          </h2>
          <p className="font-serif text-lg text-muted-foreground leading-relaxed">
            Each cell shows the average inspection score for a specific cuisine compared to the citywide average for that year.
            Warmer colors indicate below-average scores and cooler colors indicate above-average scores.
            The hatched columns represent the period from 2020 to 2021, during which grading was paused due to the pandemic.
          </p>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card border border-border p-6 sm:p-8 mb-6 relative"
        >
          <div
            ref={gridRef}
            className="relative"
            style={{
              display: 'grid',
              gridTemplateColumns: `130px repeat(${years.length}, 1fr)`,
              gap: '4px',
              alignItems: 'stretch',
            }}
          >
            {/* Top-left corner */}
            <div />

            {/* Year headers */}
            {years.map((year, colIndex) => (
              <motion.div
                key={year}
                ref={(el) => {
                  if (covidSet.has(year)) covidColRefs.current[year] = el
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, delay: colIndex * 0.04 }}
                className={`text-center pb-2 font-mono text-xs transition-colors duration-200 ${hovered?.year === year
                    ? 'text-foreground font-medium'
                    : covidSet.has(year)
                      ? 'text-muted-foreground/40'
                      : 'text-muted-foreground'
                  }`}
              >
                {year}
              </motion.div>
            ))}

            {/* Body rows */}
            {cuisines.map((cuisine, rowIndex) => (
              <RowFragment
                key={cuisine}
                cuisine={cuisine}
                rowIndex={rowIndex}
                years={years}
                covidSet={covidSet}
                rowData={data[cuisine] ?? {}}
                isInView={isInView}
                hovered={hovered}
                onHover={handleHover}
              />
            ))}

            {/* COVID-pause label, absolutely positioned over gap columns */}
            {covidLabelLeft !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.75 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute font-mono uppercase tracking-widest text-muted-foreground pointer-events-none whitespace-nowrap"
                style={{
                  left: covidLabelLeft,
                  top: '50%',
                  transform: 'translate(-50%, -50%) rotate(-90deg)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                }}
              >
                Grading paused · COVID-19
              </motion.div>
            )}
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center justify-center gap-3 mt-8 flex-wrap"
          >
            <span className="font-mono text-xs text-muted-foreground">
              0.7× better
            </span>
            <div
              className="h-2.5 w-72"
              style={{
                background: `linear-gradient(to right,
                  rgb(${COLORS.betterStrong.join(',')}) 0%,
                  rgb(${COLORS.betterMid.join(',')}) 25%,
                  rgb(${COLORS.neutral.join(',')}) 50%,
                  rgb(${COLORS.worseMid.join(',')}) 75%,
                  rgb(${COLORS.worseStrong.join(',')}) 100%)`,
              }}
            />
            <span className="font-mono text-xs text-muted-foreground">
              1.3× worse
            </span>
            <span className="font-sans text-xs text-muted-foreground/60 w-full text-center">
              Score relative to citywide average that year
            </span>
          </motion.div>
        </motion.div>

        {/* Readout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="bg-card border border-border p-6 sm:p-8"
        >
          {/* 
  <p className="font-serif text-base text-foreground leading-relaxed mb-3">
    <span className="text-primary font-medium">Reading the chart:</span>{' '}
    cuisines are ordered by how much their score shifted from before to
    after COVID-19. Rows that turn warmer in the post-2022 columns
    scored worse than the city average; cooler rows scored better.
  </p> 
*/}
          <p className="font-serif text-base text-muted-foreground leading-relaxed mb-3">
            The pattern for Asian cuisines is not random. A 2022 NYU study found that, during the pandemic,
            health inspectors gave Asian restaurants significantly higher violation scores, while scores for other cuisines remained stable.
            A peer-reviewed study in Nature Human Behavior corroborates this finding, linking the shift to rising anti-Asian sentiment during the pandemic.
            The heatmap reflects that exact time period.
          </p>

          <p className="font-serif text-base text-muted-foreground leading-relaxed mb-3">
            <span className="text-primary font-medium">What the data can't tell you:</span>{' '}
            whether individual inspectors acted intentionally. Bias in enforcement does not require intent;
            a pattern is sufficient.
            And a pattern is present here.
          </p>
        </motion.div>

      </div>

      <Tooltip
        state={hovered}
        data={hovered ? data[hovered.cuisine]?.[String(hovered.year)] ?? null : null}
        position={tooltipPos}
      />
    </section>
  )
}

// ── Row fragment ───────────────────────────────────────────────────────
function RowFragment({
  cuisine,
  rowIndex,
  years,
  covidSet,
  rowData,
  isInView,
  hovered,
  onHover,
}: {
  cuisine: string
  rowIndex: number
  years: number[]
  covidSet: Set<number>
  rowData: Record<string, HeatmapCell | null>
  isInView: boolean
  hovered: CellState
  onHover: (state: CellState, ev?: React.MouseEvent) => void
}) {
  return (
    <>
      {/* Row label */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.5, delay: rowIndex * 0.06 }}
        className={`pr-3 text-right self-center font-serif text-sm transition-colors duration-200 ${hovered?.cuisine === cuisine
            ? 'text-foreground font-medium'
            : 'text-muted-foreground'
          }`}
      >
        {cuisine}
      </motion.div>

      {/* Cells */}
      {years.map((year, colIndex) => (
        <HeatmapCell
          key={`${cuisine}-${year}`}
          cuisine={cuisine}
          year={year}
          cell={rowData[String(year)] ?? null}
          isCovid={covidSet.has(year)}
          isInView={isInView}
          rowIndex={rowIndex}
          colIndex={colIndex}
          isHovered={hovered?.cuisine === cuisine && hovered?.year === year}
          onHover={onHover}
        />
      ))}
    </>
  )
}