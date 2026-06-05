import { motion } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  HelpCircle,
  Layers,
  Package,
  Repeat2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'

const SYSTEMS = [
  {
    id: 'record',
    accent: 'pos',
    eyebrow: 'System of Record',
    title: 'Master Data Management',
    role: 'Owns identity. The keystone.',
    Icon: ShieldCheck,
    summary:
      'The single, signed source of truth for what every part, asset, and vendor actually is — across every plant and every ERP.',
    answers: [
      'What is this thing — exactly?',
      'How are these things related?',
      'Who approved this version?',
      'What is the audit trail?',
    ],
    produces: [
      { Icon: Sparkles,    label: 'Golden Records' },
      { Icon: Layers,      label: 'Hierarchies & relationships' },
      { Icon: ShieldCheck, label: 'Attestation & lineage' },
      { Icon: ArrowRight,  label: 'Syndication to ERPs' },
    ],
    cadence: 'Deliberate · Signed',
    owners:  'Stewards · Compliance · Plant ops',
  },
  {
    id: 'intel',
    accent: 'brand',
    eyebrow: 'System of Intelligence',
    title: 'Databricks Lakehouse',
    role: 'Owns scale. The engine.',
    Icon: Brain,
    summary:
      'The compute and ML platform that turns clean records into predictions, alerts, and decisions — at planet scale.',
    answers: [
      'What is about to happen?',
      'What pattern is in this data?',
      'What should we do next?',
      'Which factor matters most?',
    ],
    produces: [
      { Icon: Brain,      label: 'Predictive & ML models' },
      { Icon: Zap,        label: 'Real-time alerts' },
      { Icon: TrendingUp, label: 'Dashboards & BI' },
      { Icon: Sparkles,   label: 'AI · forecasting' },
    ],
    cadence: 'Continuous · Exploratory',
    owners:  'Data scientists · Analysts · ML engineers',
  },
]

const ACCENT = {
  pos:   { border: 'border-pos-line',   bg: 'bg-pos-soft',   chip: 'bg-pos-soft text-pos',     dot: 'bg-pos',   text: 'text-pos',   topLine: 'border-pos-line'   },
  brand: { border: 'border-brand-line', bg: 'bg-brand-soft', chip: 'bg-brand-soft text-brand', dot: 'bg-brand', text: 'text-brand', topLine: 'border-brand-line' },
}

function SystemCard({ system, index }) {
  const a = ACCENT[system.accent]
  const Icon = system.Icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className={`flex min-h-0 flex-col gap-4 rounded-xl border ${a.border} ${a.bg} p-5 sm:p-6`}
    >
      {/* Header */}
      <div className="flex items-start gap-3.5">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${a.chip}`}>
          <Icon size={22} />
        </span>
        <div>
          <p className={`eyebrow ${a.text}`}>{system.eyebrow}</p>
          <h3 className="fluid-h3 font-bold text-ink-1">{system.title}</h3>
          <p className="text-[12px] text-ink-3">{system.role}</p>
        </div>
      </div>

      {/* Summary */}
      <p className="fluid-small text-ink-2">{system.summary}</p>

      {/* Answers + Produces */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-2 flex items-center gap-1.5">
            <HelpCircle size={10} /> It answers
          </p>
          <ul className="space-y-1.5">
            {system.answers.map((q) => (
              <li key={q} className="flex items-start gap-2 text-[12px]">
                <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${a.dot}`} />
                <span className="font-mono text-ink-2">&ldquo;{q}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-2 flex items-center gap-1.5">
            <Package size={10} /> It produces
          </p>
          <ul className="space-y-1.5">
            {system.produces.map((p) => (
              <li key={p.label} className="flex items-center gap-2 rounded-md border hairline bg-surface-1 px-2 py-1.5">
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded ${a.chip}`}>
                  <p.Icon size={10} />
                </span>
                <span className="text-[12px] text-ink-2">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer band */}
      <div className={`mt-auto grid grid-cols-2 gap-3 border-t ${a.topLine} pt-3`}>
        <div>
          <p className="eyebrow mb-0.5 flex items-center gap-1.5">
            <Clock size={9} /> Cadence
          </p>
          <p className="text-[12px] font-semibold text-ink-1">{system.cadence}</p>
        </div>
        <div>
          <p className="eyebrow mb-0.5 flex items-center gap-1.5">
            <Users size={9} /> Owners
          </p>
          <p className="text-[12px] font-semibold text-ink-1">{system.owners}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function TwoSystems() {
  return (
    <section className="relative h-full w-full">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col px-6 pt-20 pb-20 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-6 max-w-3xl">
          <p className="eyebrow text-brand">04 · The two systems your stack actually needs</p>
          <h2 className="fluid-h2 mt-2 font-bold text-ink-1">
            One <span className="text-pos">system of record</span>. One <span className="text-brand">system of intelligence</span>. Both, at full power.
          </h2>
          <p className="fluid-small mt-3 text-ink-3">
            They aren&rsquo;t competing line items — they&rsquo;re complementary halves of the same architecture. Each does what the other can&rsquo;t.
          </p>
        </div>

        {/* Two systems side-by-side */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-2">
          {SYSTEMS.map((s, i) => (
            <SystemCard key={s.id} system={s} index={i} />
          ))}
        </div>

        {/* Symbiosis loop */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="surface mt-5 rounded-xl p-4 sm:p-5"
        >
          <p className="eyebrow mb-3 flex items-center gap-2">
            <Repeat2 size={11} /> How they work together · a continuous loop
          </p>
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <div className="rounded-md border border-pos-line bg-pos-soft px-3 py-2">
              <p className="text-[11px] font-semibold text-pos">MDM signs the data</p>
              <p className="text-[11px] text-ink-3">Golden Records flow into the Gold layer</p>
            </div>
            <ArrowRight size={14} className="hidden justify-self-center text-ink-4 sm:block" />
            <div className="rounded-md border border-brand-line bg-brand-soft px-3 py-2">
              <p className="text-[11px] font-semibold text-brand">Databricks finds patterns</p>
              <p className="text-[11px] text-ink-3">Models join on canonical IDs, not free text</p>
            </div>
            <ArrowRight size={14} className="hidden justify-self-center text-ink-4 sm:block" />
            <div className="surface-raised rounded-md px-3 py-2">
              <p className="text-[11px] font-semibold text-ink-1">Discoveries return to MDM</p>
              <p className="text-[11px] text-ink-3">New attributes route back as stewardship work</p>
            </div>
          </div>
        </motion.div>

        {/* Closing recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="surface mt-3 flex flex-col items-start gap-3 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:px-6"
        >
          <CheckCircle2 className="hidden h-8 w-8 shrink-0 text-pos sm:block" />
          <div className="flex-1">
            <p className="eyebrow">The recommendation</p>
            <p className="mt-0.5 fluid-h3 font-semibold leading-snug text-ink-1">
              Stand up MDM as the <span className="text-pos">system of record</span>. Keep Databricks as the <span className="text-brand">system of intelligence</span>.{' '}
              <span className="text-ink-2">That&rsquo;s the architecture.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
