import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Copy,
  Flame,
  Info,
  Layers,
  Loader2,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'

const RAW_BOM_DATA = [
  {
    role: 'Refractory Brick (Burning Zone)',
    qty: 1840,
    lead: '12 wks',
    rows: [
      { plant: 'US-Ravena',    sys: 'SAP-PM',  code: 'REF-MGO-72-A',     desc: 'Magnesia brick 72% MgO 250x150x65',     stock: 800,  uom: 'EA'  },
      { plant: 'EU-Lägerdorf', sys: 'Maximo',  code: 'Brick-MgO-Burning', desc: 'Mag-Spinel brick burning zone Type B',  stock: 1200, uom: 'PCS' },
      { plant: 'MX-Macuspana', sys: 'SAP-PM',  code: 'LADRILLO-MGO-A',   desc: 'Ladrillo refractario MgO zona quema',   stock: 600,  uom: 'EA'  },
    ],
    golden: { id: 'GR-PART-00482', desc: 'RHI Magnesita ANKRAL R3 Mag-Spinel Brick', oem: 'RHI', uom: 'EACH', regions: 3 },
    insight: '2,600 bricks already on hand · transfer 1,040 from EU avoids 12-wk wait',
  },
  {
    role: 'Main Drive Bearing',
    qty: 2,
    lead: '8 wks',
    rows: [
      { plant: 'US-Ravena',    sys: 'SAP-PM', code: 'BRG-6205-X',          desc: 'Bearing roller 6205 EA',                stock: 0, uom: 'EA'  },
      { plant: 'EU-Lägerdorf', sys: 'Maximo', code: 'Roller-Bearing-6205', desc: 'RB 6205 STD pcs',                       stock: 3, uom: 'PCS' },
      { plant: 'MX-Macuspana', sys: 'SAP-PM', code: 'BRG6205XHD',          desc: 'Rodamiento de rodillos 6205 reforzado', stock: 1, uom: 'EA'  },
    ],
    golden: { id: 'GR-PART-00481', desc: 'SKF 22312 EK Spherical Roller Bearing', oem: 'SKF', uom: 'EACH', regions: 3 },
    insight: '4 bearings already in stock globally',
  },
  {
    role: 'Burner Tip Nozzle',
    qty: 4,
    lead: '6 wks',
    rows: [
      { plant: 'US-Ravena',    sys: 'SAP-PM', code: 'BRN-NZL-DLT-A4',  desc: 'Pillard Delta burner nozzle A4',  stock: 1, uom: 'EA' },
      { plant: 'EU-Lägerdorf', sys: 'Maximo', code: 'Nozzle-Pillard-A', desc: 'Pillard nozzle revision A',       stock: 2, uom: 'EA' },
      { plant: 'MX-Macuspana', sys: 'SAP-PM', code: 'TOBERA-PIL-A4',   desc: 'Tobera quemador Pillard A revisión 4', stock: 0, uom: 'EA' },
    ],
    golden: { id: 'GR-PART-00483', desc: 'Pillard Rotaflam DELTA Burner Nozzle Rev. A4', oem: 'Pillard', uom: 'EACH', regions: 3 },
    insight: '3 in stock globally · plan needs 4 · order only 1, not 4',
  },
  {
    role: 'Kiln Drive Gearbox Seal Kit',
    qty: 1,
    lead: '10 wks',
    rows: [
      { plant: 'US-Ravena',    sys: 'SAP-PM', code: 'GBX-SEAL-KIT-12B', desc: 'Falk Drive seal kit 12B',           stock: 1, uom: 'KIT' },
      { plant: 'EU-Lägerdorf', sys: 'Maximo', code: 'Seal-Kit-Falk-12', desc: 'Falk drive sealing kit assy',       stock: 0, uom: 'KIT' },
      { plant: 'MX-Macuspana', sys: 'SAP-PM', code: 'KIT-SELLOS-FALK',  desc: 'Kit de sellos Falk transmisión 12B', stock: 1, uom: 'KIT' },
    ],
    golden: { id: 'GR-PART-00484', desc: 'Rexnord Falk Drive Seal Kit Size 12B', oem: 'Rexnord (Falk)', uom: 'KIT', regions: 3 },
    insight: '2 kits in stock · zero new buys required',
  },
  {
    role: 'Tyre Riding Pad Shim Set',
    qty: 36,
    lead: '14 wks',
    rows: [
      { plant: 'US-Ravena',    sys: 'SAP-PM', code: 'TYR-SHIM-SET-K101', desc: 'Tyre riding pad shim set K-101',  stock: 12, uom: 'SET' },
      { plant: 'EU-Lägerdorf', sys: 'Maximo', code: 'Shim-Set-Tyre-EU',  desc: 'Riding pad shims set heavy duty', stock: 24, uom: 'SET' },
      { plant: 'MX-Macuspana', sys: 'SAP-PM', code: 'CALZAS-TYRE-A',     desc: 'Calzas pista de rodadura juego',  stock: 18, uom: 'SET' },
    ],
    golden: { id: 'GR-PART-00485', desc: 'FLSmidth Tyre Riding Pad Shim Set HD', oem: 'FLSmidth', uom: 'SET', regions: 3 },
    insight: '54 sets globally · 18 more than required',
  },
]

const RAW_BOM = RAW_BOM_DATA.map((line, i) => ({ ...line, idx: i + 1 }))
const HERO_LINE = RAW_BOM[0]

const STOCK_TONE = (n) =>
  n === 0
    ? 'text-neg bg-neg-soft ring-neg-line'
    : n < 3
    ? 'text-warn bg-warn-soft ring-warn-line'
    : 'text-pos bg-pos-soft ring-pos-line'

const PLANT_FLAG = { 'US-Ravena': '🇺🇸', 'EU-Lägerdorf': '🇪🇺', 'MX-Macuspana': '🇲🇽' }

function ShutdownExplainer() {
  return (
    <div className="surface mb-4 rounded-lg p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
          <Info size={14} />
        </span>
        <div className="flex-1">
          <p className="eyebrow">First, a quick definition</p>
          <p className="mt-1 fluid-small text-ink-2">
            A <span className="font-semibold text-ink-1">kiln shutdown</span> is the planned 14-day window where the rotary kiln is taken offline for major maintenance — replacing refractory bricks, bearings, seals.
            <span className="text-ink-3"> Every part must be on-site before day one. </span>
            <span className="text-ink-1">A missing part = the kiln stays cold = ~$32k of lost production per day.</span>
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-md border hairline bg-surface-2 px-3 py-2 text-[12px]">
              <Wrench size={13} className="text-ink-3" />
              <span className="text-ink-2">14-day window. Every day idle costs ~$32k.</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border hairline bg-surface-2 px-3 py-2 text-[12px]">
              <PackageSearch size={13} className="text-ink-3" />
              <span className="text-ink-2">All parts must arrive <em>before</em> day one.</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border hairline bg-surface-2 px-3 py-2 text-[12px]">
              <AlertTriangle size={13} className="text-neg" />
              <span className="text-ink-2">A late part doesn&rsquo;t delay 1 day — it can delay weeks.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroFragmentedRow({ line }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neg-line bg-neg-soft">
      <div className="flex items-center justify-between border-b border-neg-line px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-neg-line bg-neg-soft text-neg">
            <Layers size={15} />
          </span>
          <div>
            <p className="eyebrow text-neg">The hero question</p>
            <p className="text-[15px] font-semibold text-ink-1">
              &ldquo;Do we have enough <span className="text-neg">{line.role}</span> for K-101?&rdquo;
            </p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-neg-line bg-neg-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neg md:inline-flex">
          <Copy size={11} /> 3 SKUs · same part
        </span>
      </div>
      <div className="grid grid-cols-1 divide-y divide-line bg-surface-1 md:grid-cols-3 md:divide-x md:divide-y-0">
        {line.rows.map((r) => (
          <div key={r.plant} className="px-5 py-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-ink-3">
                {PLANT_FLAG[r.plant]} {r.plant}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-ink-4">{r.sys}</span>
            </div>
            <div className="font-mono text-[13px] text-neg">{r.code}</div>
            <div className="mt-1 line-clamp-1 font-mono text-[11px] text-ink-4">&ldquo;{r.desc}&rdquo;</div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] ring-1 ${STOCK_TONE(r.stock)}`}>
                <PackageSearch size={11} /> {r.stock} {r.uom}
              </span>
              <span className="text-[10px] text-ink-4">on hand</span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-neg-line bg-surface-1 px-5 py-2.5 text-[12px] text-ink-2">
        <span className="font-semibold text-ink-1">What the asset manager sees:</span> three different parts in three plants. <span className="font-semibold text-neg">Same physical brick.</span> No system can prove it.
      </div>
    </div>
  )
}

function HeroGoldenRow({ line }) {
  const aggStock = line.rows.reduce((s, r) => s + r.stock, 0)
  const surplus = aggStock - line.qty
  return (
    <div className="overflow-hidden rounded-xl border border-pos-line bg-pos-soft">
      <div className="flex items-center justify-between border-b border-pos-line px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-pos-line bg-pos-soft text-pos">
            <CheckCircle2 size={15} />
          </span>
          <div>
            <p className="eyebrow text-pos">The hero answer</p>
            <p className="text-[15px] font-semibold text-ink-1">
              &ldquo;Yes — and we already own <span className="text-pos">{aggStock}</span> globally.&rdquo;
            </p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-pos-line bg-pos-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-pos md:inline-flex">
          <Sparkles size={11} /> 3 SKUs → 1 Golden Record
        </span>
      </div>

      <div className="grid grid-cols-1 divide-y divide-line bg-surface-1 lg:grid-cols-[1fr_auto] lg:divide-y-0 lg:divide-x">
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="rounded-md border border-pos-line bg-pos-soft px-2 py-0.5 font-mono text-pos">
              {line.golden.id}
            </span>
            <span className="rounded-md border hairline bg-surface-2 px-2 py-0.5 text-ink-3">OEM · {line.golden.oem}</span>
            <span className="rounded-md border hairline bg-surface-2 px-2 py-0.5 text-ink-3">UOM · {line.golden.uom}</span>
            <span className="rounded-md border hairline bg-surface-2 px-2 py-0.5 text-ink-3">3 stewards</span>
          </div>
          <p className="mt-2.5 text-[15px] font-semibold text-ink-1">{line.golden.desc}</p>
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-ink-3">
            <ChevronDown size={13} className="text-pos" />
            <span>Resolves to:</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            {line.rows.map((r) => (
              <span key={r.plant} className="inline-flex items-center gap-1.5 rounded-md border hairline bg-surface-2 px-2 py-0.5 text-ink-3">
                <span className="text-ink-4">{PLANT_FLAG[r.plant]}</span>
                <span className="line-through decoration-ink-4">{r.code}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-around gap-6 bg-surface-2 px-5 py-4 lg:flex-col lg:items-end">
          <div className="text-right">
            <p className="eyebrow">Required</p>
            <p className="font-mono text-[20px] font-semibold tabular-nums text-ink-1">{line.qty}</p>
          </div>
          <div className="text-right">
            <p className="eyebrow">On hand</p>
            <p className="font-mono text-[20px] font-semibold tabular-nums text-pos">{aggStock}</p>
          </div>
          <div className="text-right">
            <p className="eyebrow">Surplus</p>
            <p className={`font-mono text-[20px] font-semibold tabular-nums ${surplus >= 0 ? 'text-pos' : 'text-neg'}`}>
              {surplus >= 0 ? `+${surplus}` : surplus}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-pos-line bg-surface-1 px-5 py-2.5 text-[12px] text-ink-2">
        <span className="font-semibold text-ink-1">Decision:</span> redeploy <span className="font-mono text-pos">1,040</span> bricks from EU. Skip the 12-week order. <span className="font-semibold text-pos">Shutdown stays on schedule.</span>
      </div>
    </div>
  )
}

function CompactBomLine({ line }) {
  return (
    <div className="flex items-center justify-between rounded-md border hairline bg-surface-1 px-3.5 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-mono text-[10px] tabular-nums text-ink-4">{String(line.idx).padStart(2, '0')}</span>
        <p className="truncate text-[13px] text-ink-2">{line.role}</p>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-ink-4">
        <span>need <span className="font-mono text-ink-2">{line.qty}</span></span>
        <span className="hidden items-center gap-1 rounded-md border border-neg-line bg-neg-soft px-2 py-0.5 font-mono text-neg sm:inline-flex">
          <Copy size={10} /> 3 SKUs
        </span>
      </div>
    </div>
  )
}

function CompactGoldenLine({ line }) {
  const aggStock = line.rows.reduce((s, r) => s + r.stock, 0)
  const surplus = aggStock - line.qty
  return (
    <div className="flex items-center justify-between rounded-md border border-pos-line bg-pos-soft px-3.5 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <CheckCircle2 size={13} className="shrink-0 text-pos" />
        <p className="truncate text-[13px] text-ink-2">{line.role}</p>
      </div>
      <div className="flex items-center gap-3 text-[10px]">
        <span className="text-ink-4">on hand <span className="font-mono text-pos">{aggStock}</span></span>
        <span className={`font-mono ${surplus >= 0 ? 'text-pos' : 'text-neg'}`}>
          {surplus >= 0 ? `+${surplus}` : surplus}
        </span>
      </div>
    </div>
  )
}

export default function BomScenario() {
  const [step, setStep] = useState(1)
  const [searched, setSearched] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (step !== 1) return
    setSearched(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setSearched(true), 1100)
    return () => clearTimeout(timerRef.current)
  }, [step])

  const totals = useMemo(() => {
    const variantCount = RAW_BOM.length * 3
    const goldenCount = RAW_BOM.length
    const globallyOnHand = RAW_BOM.reduce((sum, l) => sum + l.rows.reduce((s, r) => s + r.stock, 0), 0)
    const required = RAW_BOM.reduce((sum, l) => sum + l.qty, 0)
    return { variantCount, goldenCount, globallyOnHand, required }
  }, [])

  const fragmentedBuy = '$268,400'
  const harmonizedBuy = '$31,800'

  return (
    <section className="relative h-full w-full">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col px-6 pt-20 pb-20 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-brand">02 · An asset manager&rsquo;s Monday morning</p>
            <h2 className="fluid-h2 mt-2 font-bold text-ink-1">
              Planning the <span className="text-brand">Kiln K-101 maintenance shutdown</span> &mdash; across three plants.
            </h2>
            <p className="fluid-small mt-3 max-w-2xl text-ink-3">
              The Bill of Materials lists 5 critical part roles. The same physical parts exist in every plant&rsquo;s ERP &mdash; under different codes, descriptions, and units of measure. <span className="text-ink-2">The system can&rsquo;t see itself.</span>
            </p>
          </div>

          <div className="surface flex items-center gap-3 rounded-lg px-4 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-md border hairline-strong bg-surface-2 text-brand">
              <Flame size={16} />
            </div>
            <div className="text-[12px]">
              <p className="eyebrow">Asset</p>
              <p className="font-mono text-[14px] font-semibold text-ink-1">Rotary Kiln K-101</p>
              <p className="text-[11px] text-ink-4">Planned 14-day shutdown · 3 plants in scope</p>
            </div>
          </div>
        </div>

        {/* Shutdown explainer — keeps the term concrete */}
        <ShutdownExplainer />

        {/* Step rail */}
        <div className="surface mb-5 grid grid-cols-1 gap-1.5 rounded-lg p-1.5 sm:grid-cols-3">
          {[
            { id: 1, label: 'Step 01 · The question', sub: '"Do we have enough bricks?"',          Icon: PackageSearch },
            { id: 2, label: 'Step 02 · The cost',     sub: 'What "buy everything" actually costs', Icon: AlertTriangle },
            { id: 3, label: 'Step 03 · The answer',   sub: 'MDM mints the Golden Record',          Icon: ShieldCheck },
          ].map((s) => {
            const active = s.id === step
            const isGood = s.id === 3
            const Icon = s.Icon
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-left transition ${
                  active
                    ? isGood
                      ? 'bg-pos-soft ring-1 ring-pos-line'
                      : 'bg-brand-soft ring-1 ring-brand-line'
                    : 'hover:bg-surface-2'
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${
                    active
                      ? isGood
                        ? 'bg-pos-soft text-pos'
                        : 'bg-brand-soft text-brand'
                      : 'bg-surface-2 text-ink-3'
                  }`}
                >
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className={`text-[11px] font-semibold ${active ? (isGood ? 'text-pos' : 'text-brand') : 'text-ink-3'}`}>
                    {s.label}
                  </p>
                  <p className="truncate text-[11px] text-ink-4">{s.sub}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="min-h-0 overflow-auto pr-1">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
                      {!searched && <Loader2 size={11} className="animate-spin" />}
                      {searched && <CheckCircle2 size={11} />}
                      Querying SAP-PM · Maximo · SAP-PM
                    </div>
                    <span className="hidden text-[11px] text-ink-4 sm:inline">
                      Asked: <span className="font-mono text-ink-2">"Do we have parts for K-101?"</span>
                    </span>
                  </div>

                  <HeroFragmentedRow line={HERO_LINE} />

                  <div className="rounded-lg border border-neg-line bg-neg-soft px-4 py-3.5">
                    <p className="eyebrow text-neg">The problem in one sentence</p>
                    <p className="fluid-small mt-1.5 text-ink-2">
                      The same brick lives in <span className="font-mono text-neg">3 systems</span>, under <span className="font-mono text-neg">3 codes</span>, in <span className="font-mono text-neg">3 languages</span>, with <span className="font-mono text-neg">2 different units of measure</span>.
                      <span className="ml-1 text-ink-3">Procurement can&rsquo;t prove they&rsquo;re the same — so they aren&rsquo;t.</span>
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="eyebrow">And it&rsquo;s every line of the BOM</p>
                      <span className="text-[10px] text-ink-4">{totals.variantCount} variants · {RAW_BOM.length} parts</span>
                    </div>
                    <div className="space-y-1.5">
                      {RAW_BOM.slice(1).map((line) => (
                        <CompactBomLine key={line.role} line={line} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <div className="rounded-lg border border-neg-line bg-neg-soft p-5">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neg-line bg-neg-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neg">
                      <AlertTriangle size={12} /> The damage · as filed today
                    </div>
                    <h3 className="fluid-h3 font-semibold text-ink-1">
                      Without a Golden Record, the planner orders <span className="text-neg">everything</span>.
                    </h3>
                    <p className="fluid-small mt-2 text-ink-3">
                      Each plant treats its line as standalone. Procurement can&rsquo;t prove the SKUs are the same. Default behavior: buy fresh.
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      <div className="surface-raised rounded-lg px-4 py-3.5">
                        <p className="eyebrow">New POs raised</p>
                        <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-neg">{totals.variantCount}</p>
                        <p className="text-[11px] text-ink-4">all 15 variants</p>
                      </div>
                      <div className="surface-raised rounded-lg px-4 py-3.5">
                        <p className="eyebrow">Net new spend</p>
                        <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-neg">{fragmentedBuy}</p>
                        <p className="text-[11px] text-ink-4">duplicate working capital</p>
                      </div>
                      <div className="surface-raised rounded-lg px-4 py-3.5">
                        <p className="eyebrow">Critical-path slip</p>
                        <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-neg">+14 d</p>
                        <p className="text-[11px] text-ink-4">refractory waits 12 wk</p>
                      </div>
                    </div>
                  </div>

                  <div className="surface rounded-lg p-5">
                    <p className="eyebrow mb-3">What the asset manager can&rsquo;t see</p>
                    <ul className="space-y-2.5 text-[13px] text-ink-2">
                      <li><span className="font-semibold text-ink-1">{totals.globallyOnHand} units</span> already sit on shelves across 3 plants — but live behind <span className="text-neg">{totals.variantCount} different SKUs</span>.</li>
                      <li>Lägerdorf holds <span className="font-mono text-ink-1">1,200</span> magnesia bricks idle. Ravena is buying 1,840 with a <span className="text-neg">12-week lead time</span>.</li>
                      <li>Pillard nozzles: 3 in global stock, only 4 needed. The system reports &ldquo;0 / 1 / 2&rdquo; per plant — never <span className="font-mono text-ink-1">3</span>.</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-pos-line bg-pos-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-pos">
                      <Sparkles size={11} /> MDM resolved · {totals.variantCount} SKUs → {totals.goldenCount} Golden Records
                    </div>
                    <span className="hidden text-[11px] text-ink-4 sm:inline">
                      Signed by: J. Müller · R. Carter · M. Reyes
                    </span>
                  </div>

                  <HeroGoldenRow line={HERO_LINE} />

                  <div className="rounded-lg border border-pos-line bg-pos-soft px-4 py-3.5">
                    <p className="eyebrow text-pos">The answer in one sentence</p>
                    <p className="fluid-small mt-1.5 text-ink-2">
                      The MDM hub <span className="text-pos">matched the 3 SKUs</span>, a steward in each region <span className="text-pos">approved the merge</span>, and the system now knows <span className="text-pos">they&rsquo;re the same brick</span>.
                      <span className="ml-1 text-ink-3">The shutdown plan rebuilds itself in seconds.</span>
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="eyebrow">Every other line collapses the same way</p>
                      <span className="text-[10px] text-ink-4">15 SKUs → 5 Golden Records</span>
                    </div>
                    <div className="space-y-1.5">
                      {RAW_BOM.slice(1).map((line) => (
                        <CompactGoldenLine key={line.role} line={line} />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <div className="surface-raised rounded-lg px-4 py-3.5 ring-1 ring-pos-line">
                      <p className="eyebrow">New POs raised</p>
                      <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-pos">2</p>
                      <p className="text-[11px] text-ink-4">vs 15 fragmented</p>
                    </div>
                    <div className="surface-raised rounded-lg px-4 py-3.5 ring-1 ring-pos-line">
                      <p className="eyebrow">Net new spend</p>
                      <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-pos">{harmonizedBuy}</p>
                      <p className="text-[11px] text-ink-4">−$236.6k recovered</p>
                    </div>
                    <div className="surface-raised rounded-lg px-4 py-3.5 ring-1 ring-pos-line">
                      <p className="eyebrow">Critical-path slip</p>
                      <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-pos">+0 d</p>
                      <p className="text-[11px] text-ink-4">EU→US transfer covers</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right rail */}
          <aside className="flex min-h-0 flex-col gap-3.5">
            <div className="surface rounded-lg p-4">
              <div className="flex items-center gap-2 text-ink-3">
                <ClipboardList size={13} />
                <p className="eyebrow">Shutdown ledger</p>
              </div>
              <p className="mt-2 text-[12px] text-ink-2">
                {step === 1 && 'Aggregating BOM lines from 3 plants…'}
                {step === 2 && 'Decision today: buy everything, blow the schedule.'}
                {step === 3 && "Decision with MDM: redeploy stock, buy what's actually missing."}
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-[12px]"><span className="text-ink-4">BOM lines</span><span className="font-mono text-ink-2">{RAW_BOM.length}</span></div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-ink-4">Variant SKUs</span>
                  <span className={`font-mono ${step === 3 ? 'text-pos' : 'text-neg'}`}>
                    {step === 3 ? `${totals.goldenCount} Golden` : `${totals.variantCount} fragmented`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px]"><span className="text-ink-4">Globally on hand</span><span className="font-mono text-ink-2">{totals.globallyOnHand}</span></div>
                <div className="flex items-center justify-between text-[12px]"><span className="text-ink-4">Required for K-101</span><span className="font-mono text-ink-2">{totals.required}</span></div>
              </div>
            </div>

            <div className="surface rounded-lg p-4">
              <p className="eyebrow">Working capital · this shutdown</p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <div className={`rounded-md px-3 py-2.5 ${step === 3 ? 'bg-surface-2' : 'border border-neg-line bg-neg-soft'}`}>
                  <p className="text-[10px] text-ink-4">Without MDM</p>
                  <p className="mt-0.5 font-mono text-[14px] font-semibold text-neg">{fragmentedBuy}</p>
                </div>
                <div className={`rounded-md px-3 py-2.5 ${step === 3 ? 'border border-pos-line bg-pos-soft' : 'bg-surface-2'}`}>
                  <p className="text-[10px] text-ink-4">With MDM</p>
                  <p className="mt-0.5 font-mono text-[14px] font-semibold text-pos">{harmonizedBuy}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-md border hairline bg-surface-2 px-3 py-2">
                <span className="text-[10px] text-ink-4">Recovered</span>
                <span className="font-mono text-[13px] font-semibold text-pos">+$236,600</span>
              </div>
            </div>

            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={step === 3}
              className="btn-brand group inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[12px] font-semibold"
            >
              {step === 3 ? 'Walkthrough complete' : `Advance to step 0${step + 1}`}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </aside>
        </div>
      </div>
    </section>
  )
}
