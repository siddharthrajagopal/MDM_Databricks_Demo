import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowRightLeft,
  Brain,
  CheckCircle2,
  Clock,
  Database,
  GitMerge,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'

/*
 * Slide 3 · How MDM works — simply.
 *
 * Three stages, one person clicking "approve". The earlier 5-stage / 5-persona
 * version made MDM feel heavy; this version frames it as: software finds
 * matches, one person clicks once, the answer goes everywhere.
 *
 * After the three stages, a closing band shows what Databricks can NOW answer
 * because the foundation is finally clean.
 */

const STAGES = [
  {
    id: 'match',
    code: '01',
    label: 'Match',
    sub: 'Software finds the duplicates',
    cta: 'Automated',
    Icon: ArrowRightLeft,
    accent: 'brand',
    headline: 'Software proposes — the steward decides.',
    detail:
      'MDM scans every plant’s ERP and scores candidate matches. Pairs above a confidence threshold queue for review. The hard part — finding the duplicates — is now a one-time, configured search, not a 800-line glue script.',
    record: { label: 'Candidate matches · K-101 magnesia brick', lines: [
      { src: 'pair', text: 'REF-MGO-72-A  ↔  Brick-MgO-Burning   ·  score 0.94' },
      { src: 'pair', text: 'REF-MGO-72-A  ↔  LADRILLO-MGO-A      ·  score 0.91' },
      { src: 'pair', text: 'Brick-MgO-Burning  ↔  LADRILLO-MGO-A ·  score 0.89' },
    ]},
    effort: 'Hours of compute · zero human time',
  },
  {
    id: 'approve',
    code: '02',
    label: 'Approve',
    sub: 'One steward clicks once',
    cta: 'One click',
    Icon: UserCheck,
    accent: 'pos',
    headline: 'One person, one click — for the whole company.',
    detail:
      'A single steward — typically the regional reliability lead who already owns the part on the shop floor — reviews the match in a visual portal, confirms the OEM and UOM, and clicks approve. That signature is all MDM needs to commit. And as volume grows, data-stewardship AI agents handle the routine merges automatically; humans focus only on the edge cases.',
    record: { label: 'Steward verdict', lines: [
      { src: 'review', text: '✓ Same RHI Magnesita ANKRAL R3 · UOM = EACH' },
      { src: 'sign',   text: '✓ Approved · J. Müller (Reliability Lead, EU)' },
      { src: 'agent',  text: '⟳ Stewardship AI agent: 142 routine merges auto-resolved this week · 6 escalated to humans' },
      { src: 'mint',   text: '→ Golden Record GR-PART-00482 issued' },
    ]},
    effort: 'Humans on edge cases · AI agents on the rest',
  },
  {
    id: 'publish',
    code: '03',
    label: 'Publish',
    sub: 'The answer goes everywhere — automatically',
    cta: 'Automated',
    Icon: Send,
    accent: 'brand',
    headline: 'The answer reaches every system, automatically.',
    detail:
      'MDM publishes the Golden Record back to every source ERP and to the Databricks Gold layer. The buyer working in SAP GUI sees the canonical part. The data scientist querying the lakehouse joins on one ID. The cleanup actually reaches the people who need it.',
    record: { label: 'Outbound writes', lines: [
      { src: 'SAP-PM · US',     text: '→ MM03 updated · canonical desc & UOM' },
      { src: 'Maximo · EU',     text: '→ part record linked to GR-PART-00482' },
      { src: 'SAP-PM · MX',     text: '→ MM03 updated · descripción canónica' },
      { src: 'Databricks Gold', text: '→ feature_store.parts_v3 anchored on Golden ID' },
    ]},
    effort: 'Zero · happens on save',
  },
]

const ACCENT = {
  brand: { border: 'border-brand-line', bg: 'bg-brand-soft', chip: 'bg-brand-soft text-brand', text: 'text-brand', dot: 'bg-brand' },
  pos:   { border: 'border-pos-line',   bg: 'bg-pos-soft',   chip: 'bg-pos-soft text-pos',     text: 'text-pos',   dot: 'bg-pos'   },
}

const DATABRICKS_QUESTIONS = [
  { Icon: Brain,      q: 'When will the next K-101 bearing fail?',  ans: 'Predictive maintenance on canonical asset history.' },
  { Icon: TrendingUp, q: 'What is our true global spare-stock cost?', ans: 'Inventory roll-up across 3 plants on Golden IDs.' },
  { Icon: Zap,        q: 'Where are we paying duplicate vendor premiums?', ans: 'Spend tower on unified vendor master.' },
]

function StagePill({ stage, isActive, onClick }) {
  const a = ACCENT[stage.accent]
  return (
    <button
      onClick={onClick}
      className={`group flex h-full flex-col items-start gap-2 rounded-lg border px-4 py-3 text-left transition ${
        isActive ? `${a.border} ${a.bg}` : 'border-line bg-surface-1 hover:border-line-strong'
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <span className={`font-mono text-[11px] tabular-nums ${isActive ? a.text : 'text-ink-4'}`}>{stage.code}</span>
        <span className={`grid h-7 w-7 place-items-center rounded-md ${isActive ? a.chip : 'bg-surface-2 text-ink-3'}`}>
          <stage.Icon size={13} />
        </span>
      </div>
      <p className="text-[14px] font-semibold text-ink-1">{stage.label}</p>
      <p className="text-[11px] leading-snug text-ink-3">{stage.sub}</p>
      <span
        className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
          stage.cta === 'Automated' ? 'bg-surface-2 text-ink-3' : `${a.chip}`
        }`}
      >
        {stage.cta === 'Automated' ? <Sparkles size={9} /> : <UserCheck size={9} />}
        {stage.cta}
      </span>
    </button>
  )
}

export default function MdmFlow() {
  const [activeId, setActiveId] = useState('approve')
  const stage = STAGES.find((s) => s.id === activeId)
  const a = ACCENT[stage.accent]

  // Auto-walk through all 3 stages once on entry, then settle on Approve.
  useEffect(() => {
    const order = ['match', 'approve', 'publish', 'approve']
    let i = 0
    const id = setInterval(() => {
      i += 1
      if (i >= order.length) { clearInterval(id); return }
      setActiveId(order[i])
    }, 1300)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative h-full w-full">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col px-6 pt-20 pb-20 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-brand">03 · How MDM actually works</p>
            <h2 className="fluid-h2 mt-2 font-bold text-ink-1">
              Three stages. <span className="text-pos">One person clicks once</span>. The answer reaches everyone.
            </h2>
            <p className="fluid-small mt-3 max-w-2xl text-ink-3">
              Most of the work is automated. A single steward — typically the person who already owns the part on the shop floor — confirms the merge. And as volume grows, <span className="text-ink-2 font-semibold">data-stewardship AI agents</span> scale the routine work; humans focus on the edge cases.
            </p>
          </div>

          <div className="surface flex items-center gap-3 rounded-lg px-4 py-2.5">
            <Users size={15} className="text-ink-3" />
            <div>
              <p className="eyebrow">Who&rsquo;s involved</p>
              <p className="font-mono text-[12px] text-ink-2">2 stages automated · 1 stage = one click</p>
            </div>
          </div>
        </div>

        {/* Stage rail — only 3 now */}
        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {STAGES.map((s) => (
            <StagePill key={s.id} stage={s} isActive={s.id === activeId} onClick={() => setActiveId(s.id)} />
          ))}
        </div>

        {/* Active stage detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className={`mb-5 overflow-hidden rounded-xl border ${a.border} ${a.bg} p-5 sm:p-6`}
          >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-lg ${a.chip}`}>
                    <stage.Icon size={18} />
                  </span>
                  <div>
                    <p className="eyebrow">Stage {stage.code} of 03 · {stage.label}</p>
                    <h3 className="fluid-h3 font-semibold text-ink-1">{stage.headline}</h3>
                  </div>
                </div>
                <p className="fluid-small mt-3 text-ink-2">{stage.detail}</p>
                <div className={`mt-4 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold ${a.chip}`}>
                  <Clock size={11} />
                  {stage.effort}
                </div>
              </div>

              <div className="rounded-lg border hairline bg-surface-1 p-3.5">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
                  <p className="eyebrow">{stage.record.label}</p>
                </div>
                <div className="space-y-1.5">
                  {stage.record.lines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -3 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                      className="flex items-start gap-2.5 rounded-md border hairline bg-surface-2 px-3 py-2"
                    >
                      <span className="mt-0.5 inline-flex shrink-0 rounded bg-surface-1 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-4">
                        {line.src}
                      </span>
                      <span className="font-mono text-[12px] leading-relaxed text-ink-2">{line.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Closing the loop with Databricks */}
        <div className="surface rounded-xl p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
              <Brain size={16} />
            </span>
            <div>
              <p className="eyebrow text-brand">And here&rsquo;s the payoff</p>
              <h3 className="fluid-h3 font-semibold text-ink-1">
                Now Databricks can answer questions it <span className="text-pos">couldn&rsquo;t</span> answer before.
              </h3>
            </div>
          </div>
          <p className="fluid-small mb-4 text-ink-3">
            With every part, asset, and vendor anchored on a Golden ID, the analytical questions executives have been asking for years finally have honest answers — joined on one canonical key, not free-text.
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {DATABRICKS_QUESTIONS.map((d, i) => (
              <motion.div
                key={d.q}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="rounded-lg border hairline bg-surface-2 p-4"
              >
                <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-soft text-brand">
                  <d.Icon size={14} />
                </span>
                <p className="mt-3 font-mono text-[12px] text-ink-1">&ldquo;{d.q}&rdquo;</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-3">
                  <ArrowRight size={12} className="text-pos" />
                  <span>{d.ans}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-md border border-pos-line bg-pos-soft px-4 py-2.5 text-[13px]">
            <CheckCircle2 size={15} className="shrink-0 text-pos" />
            <p className="text-ink-2">
              <span className="font-semibold text-ink-1">MDM provides the foundation. Databricks provides the intelligence.</span>{' '}
              The next slide names the two systems your stack actually needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
