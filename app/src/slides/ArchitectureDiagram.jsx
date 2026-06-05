import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Boxes,
  Brain,
  Database,
  Factory,
  Gauge,
  GitMerge,
  Layers,
  Network,
  PackageCheck,
  Server,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Workflow,
  Zap,
} from 'lucide-react'

const NODES = {
  // L1 Sources — col 0
  sapUs:  { col: 0, row: 0, label: 'SAP-PM',   sub: 'US · Ravena',     Icon: Factory },
  maxEu:  { col: 0, row: 1, label: 'Maximo',   sub: 'EU · Lägerdorf',  Icon: Factory },
  sapMx:  { col: 0, row: 2, label: 'SAP-PM',   sub: 'MX · Macuspana',  Icon: Factory },
  ariba:  { col: 0, row: 3, label: 'Ariba',    sub: 'Vendor master',   Icon: Truck },
  iot:    { col: 0, row: 4, label: 'IoT / OT', sub: 'Telemetry · OPC', Icon: Activity },

  // L2 ODS — small satellite next to each source (per-source ODS, not shared)
  odsSapUs: { attachedTo: 'sapUs', satellite: true, label: 'ODS', Icon: Server },
  odsMaxEu: { attachedTo: 'maxEu', satellite: true, label: 'ODS', Icon: Server },
  odsSapMx: { attachedTo: 'sapMx', satellite: true, label: 'ODS', Icon: Server },
  odsAriba: { attachedTo: 'ariba', satellite: true, label: 'ODS', Icon: Server },
  odsIot:   { attachedTo: 'iot',   satellite: true, label: 'ODS', Icon: Server },

  // L3 — MDM Hub (top lane) and Bronze (bottom lane), parallel at col 2
  mdm:    { col: 2, row: 1, label: 'MDM Hub',           sub: 'Match · Steward · Govern',  Icon: ShieldCheck },
  bronze: { col: 2, row: 3, label: 'Databricks Bronze', sub: 'Raw ingest · operational',  Icon: Database },

  // L4 Gold — col 3
  gold:   { col: 3, row: 2, label: 'Databricks Gold', sub: 'Golden-Record anchored', Icon: Layers },

  // L5 Analytics — col 4
  pm:     { col: 4, row: 0, label: 'Predictive Maint.', sub: 'ML on clean inputs',    Icon: Brain },
  bom:    { col: 4, row: 1, label: 'Global BOM',        sub: 'Cross-plant rollups',   Icon: Boxes },
  spend:  { col: 4, row: 2, label: 'Spend Tower',       sub: 'Unified vendor view',   Icon: Gauge },
  reli:   { col: 4, row: 3, label: 'Reliability',       sub: 'MTBF · failure modes',  Icon: Zap },
  ai:     { col: 4, row: 4, label: 'AI · Forecasting',  sub: 'Demand · supplier risk', Icon: Sparkles },
}

const ODS_FOR = {
  sapUs: 'odsSapUs', maxEu: 'odsMaxEu', sapMx: 'odsSapMx', ariba: 'odsAriba', iot: 'odsIot',
}
const ODS_NODES = Object.values(ODS_FOR)

// Build edges programmatically since each source has its own ODS now
const EDGES = [
  // Each source → its own ODS satellite (very short)
  ...Object.entries(ODS_FOR).map(([src, ods]) => (
    { from: src, to: ods, tone: 'brand', layers: ['sources', 'ods'], short: true }
  )),

  // Each ODS → MDM (governed lane) AND Bronze (analytical lane), in parallel
  ...ODS_NODES.flatMap((ods) => [
    { from: ods, to: 'mdm',    tone: 'pos',   layers: ['ods', 'mdm']    },
    { from: ods, to: 'bronze', tone: 'brand', layers: ['ods', 'bronze'] },
  ]),

  // Both lanes write into Gold
  { from: 'mdm',    to: 'gold', tone: 'pos',   layers: ['mdm', 'gold']    },
  { from: 'bronze', to: 'gold', tone: 'brand', layers: ['bronze', 'gold'] },

  // Gold fans out to analytics
  { from: 'gold', to: 'pm',    tone: 'pos', layers: ['gold', 'analytics'] },
  { from: 'gold', to: 'bom',   tone: 'pos', layers: ['gold', 'analytics'] },
  { from: 'gold', to: 'spend', tone: 'pos', layers: ['gold', 'analytics'] },
  { from: 'gold', to: 'reli',  tone: 'pos', layers: ['gold', 'analytics'] },
  { from: 'gold', to: 'ai',    tone: 'pos', layers: ['gold', 'analytics'] },

  // Round-trip: MDM publishes canonical IDs back into source ERPs
  { from: 'mdm', to: 'sapUs', tone: 'warn', curve: 'top',    layers: ['mdm', 'sources'] },
  { from: 'mdm', to: 'maxEu', tone: 'warn', curve: 'top',    layers: ['mdm', 'sources'] },
  { from: 'mdm', to: 'sapMx', tone: 'warn', curve: 'bottom', layers: ['mdm', 'sources'] },
  { from: 'mdm', to: 'ariba', tone: 'warn', curve: 'bottom', layers: ['mdm', 'sources'] },
]

const LAYERS = [
  {
    id: 'sources', label: 'L1 · Source systems', eyebrow: 'Where the data lives today',
    description: 'Three regional ERPs (SAP-PM / Maximo / SAP-PM), corporate procurement (Ariba), and plant telemetry. Each speaks its own dialect of part code, UOM, and vendor name.',
    nodes: ['sapUs', 'maxEu', 'sapMx', 'ariba', 'iot'],
    accent: 'slate', metric: '5 systems · 3 regions · 0 shared identifiers', Icon: Workflow,
  },
  {
    id: 'ods', label: 'L2 · Per-source ODS', eyebrow: 'Operational data stores',
    description: 'Each source system has its own small ODS — a near-real-time replica that absorbs CDC streams and daily extracts. Keeps source impact minimal and lets MDM and Bronze each subscribe per-source, without the source ERPs owning that integration burden.',
    nodes: ODS_NODES, accent: 'brand', metric: 'One ODS per source · CDC + extracts · queryable replicas', Icon: Server,
  },
  {
    id: 'mdm', label: 'L3 · MDM Hub', eyebrow: 'The keystone — governed lane',
    description: 'Reads from the ODS. Match, approve, publish. A steward resolves naming conflicts in a visual portal — one click — and the Golden Record is signed, lineage-tracked, and ready to syndicate. Publishes to Databricks Gold and back to the source ERPs.',
    nodes: ['mdm'], accent: 'pos', metric: 'Match → Approve → Publish · audit trail · ERP round-trip', Icon: ShieldCheck,
  },
  {
    id: 'bronze', label: 'L3 · Databricks Bronze', eyebrow: 'The analytical lane — parallel to MDM',
    description: 'Reads from the same ODS. Pulls everything in unaltered for analytical workloads — operational signals, telemetry, raw transactions. No cleansing, no opinions. Massive, fast, reliable ingest, the way Databricks does it best.',
    nodes: ['bronze'], accent: 'brand', metric: '1.4M rows / hr · ELT · operational + raw', Icon: Database,
  },
  {
    id: 'gold', label: 'L4 · Databricks Gold', eyebrow: 'Where governed meets analytical',
    description: 'Curated layer that joins MDM-published Golden Records with the operational data flowing through Bronze. Keyed on canonical IDs. The data that analytics, ML, and dashboards consume — clean by construction, not by glue scripts.',
    nodes: ['gold'], accent: 'pos', metric: 'Golden-anchored · MDM + Bronze converge · feature-store-ready', Icon: Layers,
  },
  {
    id: 'analytics', label: 'L5 · Analytics & ML', eyebrow: 'What the business actually buys',
    description: 'With clean inputs, Databricks does what it is built for: predictive maintenance, global BOM rollups, unified spend, reliability insights, supplier-risk forecasting.',
    nodes: ['pm', 'bom', 'spend', 'reli', 'ai'],
    accent: 'pos', metric: '5 workloads unlocked · trustable, attributable', Icon: Brain,
  },
]

const LAYER_FOR_NODE = Object.fromEntries(LAYERS.flatMap((l) => l.nodes.map((n) => [n, l.id])))

const ACCENT = {
  pos:   { border: 'border-pos-line',   bg: 'bg-pos-soft',   chip: 'bg-pos-soft text-pos',     text: 'text-pos'   },
  brand: { border: 'border-brand-line', bg: 'bg-brand-soft', chip: 'bg-brand-soft text-brand', text: 'text-brand' },
  warn:  { border: 'border-warn-line',  bg: 'bg-warn-soft',  chip: 'bg-warn-soft text-warn',   text: 'text-warn'  },
  slate: { border: 'border-line-strong', bg: 'bg-surface-2',  chip: 'bg-surface-2 text-ink-2',  text: 'text-ink-3' },
}

function nodeCenter(col, row, cols, rows, w, h, padX, padY) {
  const innerW = w - padX * 2
  const innerH = h - padY * 2
  return { cx: padX + (innerW * col) / (cols - 1), cy: padY + (innerH * row) / (rows - 1) }
}

// Resolve current CSS-variable color for SVG strokes/fills
function resolveColor(varName) {
  if (typeof window === 'undefined') return '#000'
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

export default function ArchitectureDiagram() {
  const [activeLayer, setActiveLayer] = useState('mdm')
  const [tick, setTick] = useState(0) // forces re-resolve of CSS vars on theme change

  // Slightly wider canvas + tighter left padding so the source nodes have room
  // for their ODS satellites without colliding into the next column.
  const VB = { w: 1280, h: 620, padX: 90, padY: 60, cols: 5, rows: 5 }

  const nodes = useMemo(() => {
    // Pass 1 — place primary (gridded) nodes
    const placed = {}
    for (const [id, n] of Object.entries(NODES)) {
      if (n.satellite) continue
      const { cx, cy } = nodeCenter(n.col, n.row, VB.cols, VB.rows, VB.w, VB.h, VB.padX, VB.padY)
      placed[id] = { ...n, id, cx, cy }
    }
    // Pass 2 — place each ODS satellite to the right of its parent source
    const SOURCE_W = 168 // matches non-MDM card width
    const SAT_OFFSET = SOURCE_W / 2 + 36 // half source width + gap
    for (const [id, n] of Object.entries(NODES)) {
      if (!n.satellite) continue
      const parent = placed[n.attachedTo]
      if (!parent) continue
      placed[id] = { ...n, id, cx: parent.cx + SAT_OFFSET, cy: parent.cy }
    }
    return placed
  }, [])

  const focused = LAYERS.find((l) => l.id === activeLayer)
  const isNodeLit = (nodeId) => LAYER_FOR_NODE[nodeId] === activeLayer
  const isEdgeLit = (edge) => edge.layers.includes(activeLayer)

  // Re-render SVG when theme changes so stroke colors track the palette
  useEffect(() => {
    const obs = new MutationObserver(() => setTick((t) => t + 1))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  // Auto-rotate focus, then settle on MDM (the keystone)
  useEffect(() => {
    const order = ['sources', 'ods', 'bronze', 'mdm', 'gold', 'analytics']
    let i = 0
    const id = setInterval(() => {
      i += 1
      if (i >= order.length) {
        setActiveLayer('mdm')
        clearInterval(id)
        return
      }
      setActiveLayer(order[i])
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // SVG palette resolved from CSS vars (re-read on theme toggle)
  const TONE_COLOR = useMemo(() => {
    void tick
    return {
      brand: resolveColor('--brand') || '#ea580c',
      pos:   resolveColor('--pos')   || '#0d9488',
      warn:  resolveColor('--warn')  || '#ca8a04',
      slate: resolveColor('--ink-4') || '#64748b',
    }
  }, [tick])

  const surface1 = useMemo(() => { void tick; return resolveColor('--surface-1') || '#ffffff' }, [tick])
  const surface2 = useMemo(() => { void tick; return resolveColor('--surface-2') || '#f1f5f9' }, [tick])
  const inkMuted = useMemo(() => { void tick; return resolveColor('--ink-4') || '#94a3b8' }, [tick])
  const ink1Color = useMemo(() => { void tick; return resolveColor('--ink-1') || '#0f172a' }, [tick])
  const ink3Color = useMemo(() => { void tick; return resolveColor('--ink-3') || '#64748b' }, [tick])
  const lineColor = useMemo(() => { void tick; return resolveColor('--line') || '#e2e8f0' }, [tick])

  return (
    <section className="relative h-full w-full">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col px-6 pt-20 pb-20 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-brand">05 · The coexistence architecture</p>
            <h2 className="fluid-h2 mt-2 font-bold text-ink-1">
              <span className="text-pos">MDM</span> and <span className="text-brand">Databricks</span> as parallel lanes &mdash; both anchored on a shared ODS, both feeding Gold.
            </h2>
            <p className="fluid-small mt-3 max-w-2xl text-ink-3">
              Source ERPs land in an <span className="text-ink-1 font-semibold">ODS</span>. From there, two lanes run in parallel: <span className="text-pos font-semibold">MDM</span> governs the data and mints Golden Records; <span className="text-brand font-semibold">Bronze</span> ingests it raw for analytics. Both converge in <span className="text-ink-1 font-semibold">Databricks Gold</span>. MDM also publishes back to the source ERPs.
            </p>
          </div>

          {/* Legend */}
          <div className="surface flex items-center gap-4 rounded-lg px-4 py-2.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="h-1 w-5 rounded-full bg-brand" />
              <span className="text-ink-3">Raw</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-5 rounded-full bg-pos" />
              <span className="text-ink-3">Governed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-5 rounded-full bg-warn" />
              <span className="text-ink-3">Round-trip</span>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
          {/* Diagram */}
          <div className="surface relative min-h-0 overflow-hidden rounded-xl p-3.5 sm:p-4">
            <div className="mb-3 grid grid-cols-5 gap-1.5">
              {[
                { id: 'sources',   label: 'L1 · Sources',   accent: 'brand' },
                { id: 'ods',       label: 'L2 · ODS',       accent: 'brand' },
                { id: ['mdm','bronze'], label: 'L3 · MDM ‖ Bronze', accent: 'split' },
                { id: 'gold',      label: 'L4 · Gold',      accent: 'pos'   },
                { id: 'analytics', label: 'L5 · Analytics', accent: 'pos'   },
              ].map((l) => {
                const ids = Array.isArray(l.id) ? l.id : [l.id]
                const active = ids.includes(activeLayer)
                const onClick = () => setActiveLayer(ids.includes(activeLayer) ? ids[(ids.indexOf(activeLayer) + 1) % ids.length] : ids[0])
                const styles =
                  active
                    ? l.accent === 'pos'
                      ? 'bg-pos-soft text-pos ring-1 ring-pos-line'
                      : l.accent === 'split'
                      ? 'bg-surface-2 text-ink-1 ring-1 ring-line-strong'
                      : 'bg-brand-soft text-brand ring-1 ring-brand-line'
                    : 'text-ink-4 hover:text-ink-2'
                return (
                  <button
                    key={Array.isArray(l.id) ? l.id.join('-') : l.id}
                    onClick={onClick}
                    className={`rounded-md py-1.5 text-[11px] font-semibold transition ${styles}`}
                  >
                    {l.label}
                  </button>
                )
              })}
            </div>

            <div className="relative h-[calc(100%-40px)] w-full">
              <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
                <defs>
                  {Object.entries(TONE_COLOR).map(([k, c]) => (
                    <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M0,0 L10,5 L0,10 Z" fill={c} />
                    </marker>
                  ))}
                </defs>

                {EDGES.map((e, idx) => {
                  const a = nodes[e.from]; const b = nodes[e.to]
                  const lit = isEdgeLit(e); const color = TONE_COLOR[e.tone]
                  let d
                  if (e.curve === 'top') {
                    const k = (a.cy + b.cy) / 2 - 220
                    d = `M ${a.cx},${a.cy} Q ${(a.cx + b.cx) / 2},${k} ${b.cx},${b.cy}`
                  } else if (e.curve === 'bottom') {
                    const k = (a.cy + b.cy) / 2 + 220
                    d = `M ${a.cx},${a.cy} Q ${(a.cx + b.cx) / 2},${k} ${b.cx},${b.cy}`
                  } else {
                    d = `M ${a.cx},${a.cy} L ${b.cx},${b.cy}`
                  }
                  // Short source→ODS satellite edges: thin, no arrow, no animation
                  // (the ODS chip sits right next to its source so a long arrow looks oversized)
                  const isShort = e.short
                  return (
                    <g key={idx} style={{ opacity: lit ? 1 : 0.18, transition: 'opacity 0.4s ease' }}>
                      <path
                        d={d}
                        stroke={color}
                        strokeWidth={isShort ? 1 : (lit ? 1.4 : 0.8)}
                        fill="none"
                        strokeDasharray={e.tone === 'warn' ? '4 4' : '0'}
                        markerEnd={isShort ? undefined : `url(#arrow-${e.tone})`}
                      />
                      {lit && !isShort && (
                        <circle r="2.5" fill={color}>
                          <animateMotion dur={`${1.6 + (idx % 3) * 0.4}s`} repeatCount="indefinite" path={d} />
                        </circle>
                      )}
                    </g>
                  )
                })}

                {Object.values(nodes).map((n) => {
                  const lit = isNodeLit(n.id)
                  const isMdm = n.id === 'mdm'
                  // Lane tone: pos = governed (MDM/Gold), brand = analytical (ODS satellites/Bronze)
                  const lanes = {
                    mdm: 'pos', gold: 'pos',
                    bronze: 'brand',
                    odsSapUs: 'brand', odsMaxEu: 'brand', odsSapMx: 'brand', odsAriba: 'brand', odsIot: 'brand',
                  }
                  const laneTone = lanes[n.id]
                  const laneColor = laneTone ? TONE_COLOR[laneTone] : null
                  const iconColor = laneColor ?? ink3Color
                  const fill = surface1
                  const stroke = lit ? (laneColor ?? inkMuted) : lineColor

                  // Satellite (per-source ODS) renders as a small chip
                  if (n.satellite) {
                    const sw = 56, sh = 26
                    const sx = n.cx - sw / 2, sy = n.cy - sh / 2
                    return (
                      <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => setActiveLayer('ods')}>
                        <rect x={sx} y={sy} width={sw} height={sh} rx={6} ry={6} fill={fill} stroke={stroke} strokeWidth={lit ? 1.2 : 0.7} opacity={lit ? 1 : 0.85} />
                        <foreignObject x={sx} y={sy} width={sw} height={sh}>
                          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: lit ? 1 : 0.85 }}>
                            <n.Icon size={10} color={iconColor} />
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: ink1Color }}>ODS</div>
                          </div>
                        </foreignObject>
                      </g>
                    )
                  }

                  const w = isMdm ? 200 : 168; const h = isMdm ? 84 : 62
                  const x = n.cx - w / 2; const y = n.cy - h / 2
                  return (
                    <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => { const id = LAYER_FOR_NODE[n.id]; if (id) setActiveLayer(id) }}>
                      <rect x={x} y={y} width={w} height={h} rx={10} ry={10} fill={fill} stroke={stroke} strokeWidth={lit ? 1.4 : 0.8} opacity={lit ? 1 : 0.85} />
                      {isMdm && lit && (
                        <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={12} fill="none" stroke={TONE_COLOR.pos} strokeOpacity="0.22" strokeWidth="5" />
                      )}
                      <foreignObject x={x} y={y} width={w} height={h}>
                        <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', opacity: lit ? 1 : 0.8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 6,
                            display: 'grid', placeItems: 'center',
                            background: surface2,
                            color:      iconColor,
                            flexShrink: 0,
                          }}>
                            <n.Icon size={14} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: ink1Color, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.label}</div>
                            <div style={{ fontSize: 10, color: ink3Color, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{n.sub}</div>
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  )
                })}
              </svg>

              <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full border border-pos-line bg-surface-1/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-pos">
                Keystone · MDM Hub
              </div>
            </div>
          </div>

          {/* Right rail */}
          <aside className="flex min-h-0 flex-col gap-3.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={focused.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
                className={`rounded-xl border ${ACCENT[focused.accent].border} ${ACCENT[focused.accent].bg} p-5`}
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${ACCENT[focused.accent].chip}`}>
                    <focused.Icon size={16} />
                  </span>
                  <div>
                    <p className="eyebrow">{focused.eyebrow}</p>
                    <h3 className="text-[16px] font-semibold text-ink-1">{focused.label}</h3>
                  </div>
                </div>
                <p className="fluid-small mt-3 text-ink-2">{focused.description}</p>
                <div className={`mt-3.5 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold ${ACCENT[focused.accent].chip}`}>
                  <Sparkles size={11} />
                  {focused.metric}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="surface rounded-xl p-4">
              <p className="eyebrow mb-2.5 flex items-center gap-2 text-pos">
                <ShieldCheck size={11} /> What the MDM hub does
              </p>
              <ul className="space-y-2 text-[13px] text-ink-2">
                <li className="flex items-start gap-2">
                  <Network size={13} className="mt-0.5 shrink-0 text-pos" />
                  <span><span className="font-semibold text-ink-1">Match</span> — reconcile variants across SAP / Maximo / Ariba</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users size={13} className="mt-0.5 shrink-0 text-pos" />
                  <span><span className="font-semibold text-ink-1">Approve</span> — one steward signs off on the merge</span>
                </li>
                <li className="flex items-start gap-2">
                  <PackageCheck size={13} className="mt-0.5 shrink-0 text-pos" />
                  <span><span className="font-semibold text-ink-1">Govern</span> — lineage, attestation, and policy by default</span>
                </li>
                <li className="flex items-start gap-2">
                  <GitMerge size={13} className="mt-0.5 shrink-0 text-pos" />
                  <span><span className="font-semibold text-ink-1">Syndicate</span> — push canonical IDs back into every ERP</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
