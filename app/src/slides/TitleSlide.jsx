import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Calendar, DollarSign, Flame } from 'lucide-react'

const STORY = [
  { n: '02', t: 'See the broken BOM' },
  { n: '03', t: 'How MDM works — simply' },
  { n: '04', t: 'Two systems, one stack' },
  { n: '05', t: 'The architecture that ties it together' },
]

export default function TitleSlide({ onAdvance }) {
  return (
    <section className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-0/0 via-surface-0/0 to-surface-0" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6 pt-20 pb-24 sm:px-10 lg:px-16">
        <div className="grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* LEFT: hero copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="eyebrow mb-5"
            >
              Executive briefing · Cement operations
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="fluid-h1 font-extrabold text-ink-1"
            >
              Harmonizing
              <br />
              <span className="text-brand">the foundation.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="fluid-body mt-6 max-w-xl text-ink-2"
            >
              An asset manager plans the <span className="font-semibold text-ink-1">Kiln K-101 maintenance shutdown</span> across three plants.
              The Bill of Materials returns <span className="font-semibold text-ink-1">15 different parts</span> &mdash; for what is actually <span className="font-semibold text-ink-1">5 parts</span>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              className="fluid-small mt-4 max-w-xl text-ink-3"
            >
              The next six slides show why fixing this isn&rsquo;t a Databricks job &mdash; it&rsquo;s an{' '}
              <span className="font-semibold text-ink-1">MDM</span> job.
              And why <span className="font-semibold text-ink-1">Databricks</span> only becomes truly powerful once it&rsquo;s done.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-9 flex flex-col items-start gap-3"
            >
              <button
                onClick={onAdvance}
                className="btn-brand group inline-flex items-center gap-2.5 rounded-md px-6 py-3 text-[13px] font-semibold tracking-wide"
              >
                Walk me through K-101
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <p className="text-[11px] text-ink-4">Use ← / → to navigate · Theme toggle in the header</p>
            </motion.div>
          </div>

          {/* RIGHT: anchor card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="surface relative overflow-hidden rounded-xl p-6 sm:p-7"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg border hairline-strong bg-surface-2 text-brand">
                <Flame size={20} />
              </div>
              <div>
                <p className="eyebrow">Anchor asset</p>
                <p className="font-mono text-[17px] font-semibold text-ink-1">Rotary Kiln K-101</p>
                <p className="text-[12px] text-ink-3">Ravena · Lägerdorf · Macuspana</p>
              </div>
            </div>

            <div className="my-6 h-px bg-line" />

            <p className="eyebrow mb-3">This Monday&rsquo;s decision</p>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-lg border hairline bg-surface-2 px-3 py-3">
                <Calendar size={13} className="text-ink-3" />
                <p className="mt-2 font-mono text-[18px] font-semibold tabular-nums text-ink-1">14 d</p>
                <p className="mt-0.5 text-[10px] text-ink-4">shutdown window</p>
              </div>
              <div className="rounded-lg border border-neg-line bg-neg-soft px-3 py-3">
                <DollarSign size={13} className="text-neg" />
                <p className="mt-2 font-mono text-[18px] font-semibold tabular-nums text-neg">$268k</p>
                <p className="mt-0.5 text-[10px] text-ink-4">at risk · today</p>
              </div>
              <div className="rounded-lg border border-neg-line bg-neg-soft px-3 py-3">
                <AlertTriangle size={13} className="text-neg" />
                <p className="mt-2 font-mono text-[18px] font-semibold tabular-nums text-neg">+14 d</p>
                <p className="mt-0.5 text-[10px] text-ink-4">critical-path slip</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="eyebrow mb-3">The story arc</p>
              <ul className="space-y-2">
                {STORY.map((s) => (
                  <li key={s.n} className="flex items-center gap-3 text-[13px]">
                    <span className="font-mono text-[10px] text-ink-4 tabular-nums">{s.n}</span>
                    <span className="h-1 w-1 rounded-full bg-ink-4" />
                    <span className="text-ink-2">{s.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t hairline bg-surface-0/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-2.5 text-[11px] text-ink-4 sm:px-10">
          <span>System status: fragmented</span>
          <span className="hidden md:block">3 plants · 3 ERPs · 1 asset · 0 Golden Records</span>
          <span className="text-ink-3">MDM × Databricks</span>
        </div>
      </div>
    </section>
  )
}
