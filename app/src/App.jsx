import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react'
import TitleSlide from './slides/TitleSlide'
import BomScenario from './slides/BomScenario'
import MdmFlow from './slides/MdmFlow'
import TwoSystems from './slides/TwoSystems'
import ArchitectureDiagram from './slides/ArchitectureDiagram'

const SLIDES = [
  { id: 1, label: 'Title',         component: TitleSlide },
  { id: 2, label: 'The BOM',       component: BomScenario },
  { id: 3, label: 'MDM at Work',   component: MdmFlow },
  { id: 4, label: 'Two Systems',   component: TwoSystems },
  { id: 5, label: 'Architecture',  component: ArchitectureDiagram },
]

function getInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function App() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('hf-theme', theme) } catch (_) {}
  }, [theme])

  const go = useCallback(
    (next) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, next))
      if (clamped === index) return
      setDirection(clamped > index ? 1 : -1)
      setIndex(clamped)
    },
    [index],
  )
  const next = useCallback(() => go(index + 1), [index, go])
  const prev = useCallback(() => go(index - 1), [index, go])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev()
      if (e.key === 'Home') go(0)
      if (e.key === 'End')  go(SLIDES.length - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go])

  const SlideComponent = SLIDES[index].component
  const isDark = theme === 'dark'

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-0 text-ink-2">
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b hairline px-5 py-3.5 sm:px-8 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-7 w-7 place-items-center rounded-md border hairline-strong bg-surface-1">
            <span className="block h-1.5 w-1.5 rounded-sm bg-brand" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-ink-1">Harmonizing the Foundation</p>
            <p className="hidden text-[11px] text-ink-4 sm:block">MDM × Databricks · Executive briefing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums text-ink-3">
            <span className="hidden sm:inline">Slide</span>
            <span className="text-ink-1">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-ink-4">/</span>
            <span>{String(SLIDES.length).padStart(2, '0')}</span>
          </div>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-ghost grid h-8 w-8 place-items-center rounded-md"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* Stage */}
      <main className="relative h-full w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={SLIDES[index].id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SlideComponent onAdvance={next} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Slide indicator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center sm:bottom-6">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border hairline-strong bg-surface-1/95 px-2 py-1.5 backdrop-blur">
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous slide"
            className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <div className="flex items-center gap-2 px-1">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => go(i)}
                className="group flex items-center"
                aria-label={`Go to slide ${i + 1}: ${slide.label}`}
              >
                <span
                  className={`block h-1 transition-all rounded-full ${
                    i === index ? 'w-7 bg-brand' : 'w-2.5 bg-line-strong group-hover:bg-ink-3'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            onClick={next}
            disabled={index === SLIDES.length - 1}
            aria-label="Next slide"
            className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
