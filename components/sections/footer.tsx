"use client"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Store, ShieldAlert, Table, Tag, LineChart, ExternalLink, Database } from 'lucide-react'

const caveats = [
  {
    icon: <Store size={14} />,
    title: "Survivorship bias in the 2026 file",
    desc: "The DOHMH only publishes inspections for restaurants active in the past three years. Closed establishments are removed entirely. The 2026-only datasets therefore overrepresent surviving restaurants. The merged dataset corrects for this by including 14,018 restaurants that only appear in the 2019 snapshot."
  },
  {
    icon: <ShieldAlert size={14} />,
    title: "COVID grading pause (Mar 2020 – Jul 2021)",
    desc: "Letter grading was suspended during this period per DOHMH policy. Rows from March 17, 2020 to July 19, 2021 are excluded in the _no_covid variants to prevent time-series distortion. Use those variants for any before/after comparison."
  },
  {
    icon: <Table size={14} />,
    title: "Rows ≠ inspections ≠ restaurants",
    desc: "Each row is a single violation. One inspection visit can generate multiple rows. Unique inspections are counted as distinct (CAMIS, date) pairs. The 2026 no-covid dataset has 120,310 rows but only 47,310 unique inspection visits across 24,104 restaurants."
  },
  {
    icon: <Tag size={14} />,
    title: "Cuisine label harmonization",
    desc: "DOHMH renamed several cuisine categories between snapshots. Eight labels were remapped (e.g. \"Café/Coffee/Tea\" → \"Coffee/Tea\", \"Steak\" → \"Steakhouse\") so the merged dataset is internally consistent."
  },
  {
    icon: <LineChart size={14} />,
    title: "Two charts bypass the cleaning pipeline",
    desc: "The initial-vs-reinspection slope chart and the cuisine EDA dot plot use the raw 2026 file (only placeholder dates and invalid boroughs removed). Applying the full pipeline would discard pending reinspections and collapse score distributions into the A-grade range, hiding the variation these charts are designed to show."
  },
]

const datasets = [
  // { name: "df_2026", desc: "Current state of NYC dining. 2011–2025, all periods.", tag: "cross-sectional" },
  { name: "df_2026_no_covid", desc: "Same, with COVID pause removed.", tag: "cross-sectional" },
  // { name: "df_merged", desc: "2019 + 2026 combined. Includes closed restaurants.", tag: "longitudinal" },
  { name: "df_merged_no_covid", desc: "Same, COVID pause removed. Use for before/after comparisons.", tag: "longitudinal" },
]

const sourceLinks = [
  { label: 'Notebook', url: 'https://github.com/your-repo/notebook.ipynb' },
  { label: 'Data', url: 'https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j' },
]

function CaveatRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border border-border rounded-lg px-4 py-3 hover:bg-muted/40 transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="font-sans text-sm font-medium text-foreground flex-1">{title}</span>
        <span className={`text-muted-foreground text-xs transition-transform duration-200 inline-block ${open ? 'rotate-180' : ''}`}>▾</span>
      </div>
      {open && (
        <p className="font-sans text-xs text-muted-foreground leading-relaxed mt-3 pl-7">
          {desc}
        </p>
      )}
    </button>
  )
}

export function Footer() {
  return (
    <footer id="methodology" className="py-16 border-t border-border relative bg-background">
      <div className="max-w-xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className="w-12 h-px bg-border" />
          <span className="text-2xl text-foreground font-display">Methodology</span>
          <span className="w-12 h-px bg-border" />
        </motion.div>

        {/* Lead paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-muted-foreground leading-relaxed text-center mb-10 text-sm"
        >
          The DOHMH provided two public snapshots: one from 2019 and one from 2026. 
          These were cleaned and merged to create a dataset covering the period from 2011 to 2025. 
          The 2026 snapshot only includes active restaurants. 
          Combining the two snapshots restored information on approximately 14,000 closed establishments, thereby avoiding survivorship bias.
          <br></br>
          Unless noted otherwise, all plots use the 2026 snapshot restricted to active restaurants. The year-over-year inspection heat map is an exception. \
          It uses the merged dataset to recover closed establishments from the 2019 snapshot. 
          This allows for a fair comparison of inspection intensity before and after the pandemic. 
          This also enables us to evaluate whether the DOHMH increased inspection frequency in the post-pandemic period without conflating the decrease in pre-pandemic counts with restaurant closures.
        </motion.p>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { num: "24,104", label: "restaurants", sub: "2026 snapshot" },
            { num: "37,050", label: "restaurants", sub: "merged, incl. closed" },
            { num: "305,128", label: "inspections", sub: "merged dataset" },
          ].map(({ num, label, sub }) => (
            <div key={sub} className="bg-muted/40 rounded-lg p-3 text-center">
              <p className="font-sans text-lg font-medium text-foreground">{num}</p>
              <p className="font-sans text-xs text-foreground/70">{label}</p>
              <p className="font-sans text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Caveats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Key caveats
          </p>
          <div className="flex flex-col gap-2">
            {caveats.map(c => (
              <CaveatRow key={c.title} icon={c.icon} title={c.title} desc={c.desc} />
            ))}
          </div>
        </motion.div>

        {/* Datasets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-3">
            The two working datasets
          </p>
          <div className="grid grid-cols-2 gap-2">
            {datasets.map(({ name, desc, tag }) => (
              <div key={name} className="border border-border rounded-lg p-3">
                <p className="font-mono text-xs font-medium text-foreground mb-1">{name}</p>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-2">{desc}</p>
                <span className={`font-sans text-xs px-2 py-0.5 rounded ${
                  tag === 'longitudinal'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Credits divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="w-8 h-px bg-border" />
          <span className="text-lg text-foreground font-display">Credits</span>
          <span className="w-8 h-px bg-border" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row justify-between items-center gap-8 text-center sm:text-left"
        >
          <div>
            <p className="font-serif text-sm text-foreground">
              Data analysis and writing by Guillermo Quiroga Ocaña & Juan Manuel Rodriguez
            </p>
          </div>
          <div className="flex gap-6">
            {sourceLinks.map(({ label, url }) => (
              <a
                key={label}
                href={`#${url.toLowerCase()}`}
                className="font-sans text-sm text-primary hover:text-primary/70 underline underline-offset-4 decoration-primary/30 hover:decoration-primary/60 transition-all duration-300"
              >
                {label}
              </a>
            ))}
          </div>
        </motion.div>


        {/* Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 mb-12"
        >
          <h3 className="font-sans text-foreground font-medium mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            Data Sources & References
          </h3>

          <ul className="space-y-2">
            {[
              {
                href: "https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j",
                text: "NYC OpenData",
                subtitle: "DOHMH NYC Restaurant Inspection Results, 2011–2025"
              },
              {
                href: "https://www.nyu.edu/about/news-publications/news/2022/december/study-finds-nyc-health-inspectors-gave-only-asian-restaurants-hi.html",
                text: "NYU News (2022)",
                subtitle: "NYC inspectors gave only Asian restaurants higher scores during the pandemic"
              },
              {
                href: "https://www.nature.com/articles/s41562-022-01493-6",
                text: "Nature Human Behaviour (2022)",
                subtitle: "Anti-Asian sentiment and inspection outcomes during COVID-19"
              },
              {
                href: "https://www.sciencedirect.com/science/article/abs/pii/S0278431915000274",
                text: "Kim & Mattila (2015)",
                subtitle: "Consumer responses to restaurant grading — Int. J. Hospitality Management"
              },
              {
                href: "https://doi.org/10.1109/TVCG.2010.179",
                text: "Segel & Heer (2010)",
                subtitle: "Narrative Visualization Framework"
              },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 -mx-4 rounded-xl hover:bg-card/50 transition-colors duration-300"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
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
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border/50"
        >
          <p className="font-sans text-xs text-muted-foreground text-center tracking-wide">
            NYC Department of Health restaurant inspection data, 2011–2025
          </p>
        </motion.div>

      </div>
    </footer>
  )
}