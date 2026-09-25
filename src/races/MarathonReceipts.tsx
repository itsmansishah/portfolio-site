import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "motion/react";
import { Footprints, Printer, Route, Timer, CircleCheck, type LucideIcon } from "lucide-react";
import { MARATHONS, LEDGER, type LedgerTotals, type Point, type Race } from "./marathons";

/* ───────────────────────── styles (tuned to the site's paper and mono) ───────────────────────── */

const CSS = `
.mr-root{
  --mr-bg:var(--color-paper,#f7f2ed); --mr-fg:#101010; --mr-muted:#7a736b; --mr-tile:#ede6de; --mr-line:#c9c0b5;
  --mr-paper:#fffdf9; --mr-panel:#f4efe9; --mr-ink:#101010; --mr-ink-2:#6f6a64; --mr-ink-3:#bdb6ad;
  --mr-slot:#141413;
  font-family:var(--font-mono,"Roboto Mono",ui-monospace,SFMono-Regular,Menlo,monospace);
  font-variant-numeric:tabular-nums;
  color:var(--mr-fg); background:var(--mr-bg);
}
.mr-c-fg{color:var(--mr-fg)} .mr-c-muted{color:var(--mr-muted)} .mr-c-bg{color:var(--mr-bg)}
.mr-c-ink{color:var(--mr-ink)} .mr-c-ink2{color:var(--mr-ink-2)} .mr-c-ink3{color:var(--mr-ink-3)} .mr-c-paper{color:var(--mr-paper)}
.mr-bg-paper{background:var(--mr-paper)} .mr-bg-panel{background:var(--mr-panel)} .mr-bg-ink{background:var(--mr-ink)}
.mr-bg-tile{background:var(--mr-tile)} .mr-bg-fg{background:var(--mr-fg)} .mr-bg-slot{background:var(--mr-slot)}
.mr-dash{height:1.5px;background:repeating-linear-gradient(90deg,var(--mr-ink-3) 0 7px,transparent 7px 12px)}
.mr-dash-page{height:1.5px;background:repeating-linear-gradient(90deg,var(--mr-line) 0 7px,transparent 7px 12px)}
.mr-leader{flex:1;min-width:12px;border-bottom:1.5px dotted currentColor;opacity:.35;transform:translateY(-4px)}
.mr-zz{height:12px;background:
  linear-gradient(135deg,var(--mr-paper) 50%,transparent 50%) 0 0/12px 12px repeat-x,
  linear-gradient(-135deg,var(--mr-paper) 50%,transparent 50%) 0 0/12px 12px repeat-x}
.mr-pending{background:repeating-linear-gradient(-45deg,transparent 0 7px,color-mix(in srgb,var(--mr-fg) 5%,transparent) 7px 8px);
  border:1.5px dashed var(--mr-line)}
.mr-noscroll{scrollbar-width:none} .mr-noscroll::-webkit-scrollbar{display:none}
@keyframes mr-blink{50%{opacity:0}} .mr-blink{animation:mr-blink 1s steps(1) infinite}
@keyframes mr-pulse{0%,100%{opacity:1}50%{opacity:.25}} .mr-pulse{animation:mr-pulse 1.6s ease-in-out infinite}
.mr-root button:focus-visible{outline:2px solid var(--mr-fg);outline-offset:3px}
@media (prefers-reduced-motion: reduce){.mr-blink,.mr-pulse{animation:none}}
`;

/* ───────────────────────── helpers ───────────────────────── */

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const pad = (n: number) => String(n).padStart(2, "0");
const parseDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
};
const fmtDate = (iso: string) => {
  const { y, m, d } = parseDate(iso);
  return `${MONTHS[m - 1]} ${pad(d)}, ${y}`;
};
const toSec = (hms: string) => hms.split(":").reduce((a, v) => a * 60 + Number(v), 0);
const DASH = "—";
const withUnit = (v: number | null | undefined, unit: string) => (v == null ? DASH : `${v}${unit}`);
const fmtKm = (km: number) => (Math.round(km * 100) / 100).toFixed(2);
const shortKm = (km: number) => (km > 40 ? "42.2" : km > 20 ? "21.1" : km.toFixed(1));
const hash = (str: string) => {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const raceStart = (race: Race) => new Date(race.startTime ?? `${race.date}T07:00:00`).getTime();

/* ───────────────────────── hooks ───────────────────────── */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

function useScrambleText(text: string, { duration = 700, fps = 30 } = {}) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let lastFrame = -1;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const frame = Math.floor(((now - start) / 1000) * fps);
      if (frame !== lastFrame || t === 1) {
        lastFrame = frame;
        const settled = Math.floor(t * t * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          s += i < settled || /[\s.,:'’-]/.test(c) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOut(s);
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, fps, reduce]);
  return reduce ? text : out;
}

function useNow(active = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

/* ───────────────────────── small pieces ───────────────────────── */

function Scramble({ text, className }: { text: string; className?: string }) {
  const out = useScrambleText(text);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

function RouteSketch({ points, dashed, className }: { points: Point[]; dashed?: boolean; className?: string }) {
  const d = useMemo(() => {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const w = Math.max(...xs) - minX || 1, h = Math.max(...ys) - minY || 1;
    const s = 84 / Math.max(w, h);
    const ox = (100 - w * s) / 2, oy = (100 - h * s) / 2;
    return "M" + points.map(([x, y]) => `${((x - minX) * s + ox).toFixed(1)} ${((y - minY) * s + oy).toFixed(1)}`).join("L");
  }, [points]);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"
        vectorEffect="non-scaling-stroke" strokeDasharray={dashed ? "3 4" : undefined} />
    </svg>
  );
}

function Pill({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className="mr-bg-paper mr-c-ink inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider">
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

function Barcode({ code, faded }: { code: string; faded?: boolean }) {
  const bars = useMemo(() => {
    const r = rng(hash(code));
    return Array.from({ length: 64 }, () => ({ w: 1 + Math.floor(r() * 3), gap: 1 + Math.floor(r() * 2) }));
  }, [code]);
  return (
    <div className={`flex flex-col items-center gap-2 ${faded ? "opacity-30" : ""}`}>
      <div className="flex h-12 max-w-full overflow-hidden" aria-hidden>
        {bars.map((b, i) => (
          <span key={i} className="mr-bg-ink shrink-0" style={{ width: b.w, marginRight: b.gap }} />
        ))}
      </div>
      <span className="text-[10px] tracking-[0.35em]">{code}</span>
    </div>
  );
}

function Line({ label, value, strong }: { label: string; value: string | number; strong?: boolean }) {
  return (
    <li className={`flex items-end gap-2 ${strong ? "text-[15px] font-extrabold" : ""}`}>
      <span className="shrink-0">{label}</span>
      <span className="mr-leader" />
      <span className="min-w-0 text-right">{value}</span>
    </li>
  );
}

/* ───────────────────────── receipt parts ───────────────────────── */

function RouteLine({ race, printing }: { race: Race; printing: boolean }) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const geo = useMemo(() => {
    const pts = race.route;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const w = Math.max(...xs) - minX || 1, h = Math.max(...ys) - minY || 1;
    const W = 400, PAD = 22;
    const H = Math.round(Math.min(340, Math.max(210, (W * h) / w)));
    const s = Math.min((W - PAD * 2) / w, (H - PAD * 2) / h);
    const ox = (W - w * s) / 2, oy = (H - h * s) / 2;
    const P = pts.map(([x, y]): Point => [(x - minX) * s + ox, (y - minY) * s + oy]);
    const cum = [0];
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const total = cum[cum.length - 1] || 1;
    const at = (f: number): Point => {
      const target = f * total;
      const i = cum.findIndex((c) => c >= target);
      if (i <= 0) return P[Math.max(0, i)];
      const t = (target - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return [P[i - 1][0] + (P[i][0] - P[i - 1][0]) * t, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * t];
    };
    const marks: { km: number; p: Point }[] = [];
    for (let km = 5; km < race.distanceKm; km += 5) marks.push({ km, p: at(km / race.distanceKm) });
    const d = "M" + P.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");
    return { P, cum, total, at, marks, d, W, H };
  }, [race.route, race.distanceKm]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || printing) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const { x, y } = pt.matrixTransform(ctm.inverse());
    const { P, cum, total } = geo;
    let best = Infinity, frac = 0;
    for (let i = 1; i < P.length; i++) {
      const [ax, ay] = P[i - 1], [bx, by] = P[i];
      const dx = bx - ax, dy = by - ay;
      const len2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2));
      const dd = (ax + dx * t - x) ** 2 + (ay + dy * t - y) ** 2;
      if (dd < best) {
        best = dd;
        frac = (cum[i - 1] + Math.sqrt(len2) * t) / total;
      }
    }
    setHover(best < 45 * 45 ? frac : null);
  };

  const start = geo.P[0];
  const finish = geo.P[geo.P.length - 1];
  const marker = hover == null ? null : geo.at(hover);

  return (
    <div className="mr-bg-panel mt-5 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <Pill icon={Route}>ROUTE</Pill>
        <span className="mr-c-ink2 text-[10px] tracking-wider">
          {printing ? (
            <>
              PRINTING IN PROGRESS<span className="mr-blink">█</span>
            </>
          ) : hover != null ? (
            `KM ${(hover * race.distanceKm).toFixed(1)} / ${fmtKm(race.distanceKm)}`
          ) : (
            "HOVER TO TRACE"
          )}
        </span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${geo.W} ${geo.H}`}
        className="mt-3 block h-auto w-full touch-pan-y select-none"
        role="img"
        aria-label={`Course map of the ${race.name.toLowerCase()}`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <pattern id={`mr-dots-${race.id}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="0.9" fill="var(--mr-ink-3)" />
          </pattern>
        </defs>
        <rect width={geo.W} height={geo.H} fill={`url(#mr-dots-${race.id})`} opacity="0.7" />

        {printing ? (
          <>
            <path d={geo.d} fill="none" stroke="var(--mr-ink-3)" strokeWidth="2" strokeDasharray="3 5"
              strokeLinecap="round" strokeLinejoin="round" />
            {!reduce && (
              <motion.path d={geo.d} fill="none" stroke="var(--mr-ink-2)" strokeWidth="2.4" strokeLinecap="round"
                strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 4.5, ease: "linear", repeat: Infinity, repeatDelay: 0.8 }} />
            )}
          </>
        ) : (
          <>
            <motion.path d={geo.d} fill="none" stroke={hover == null ? "var(--mr-ink)" : "var(--mr-ink-3)"}
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.6, ease: "easeInOut" }} />
            {hover != null && (
              <path d={geo.d} pathLength="1" fill="none" stroke="var(--mr-ink)" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${hover} 1`} />
            )}
          </>
        )}

        {geo.marks.map(({ km, p }) => (
          <circle key={km} cx={p[0]} cy={p[1]} r="2.6" fill="var(--mr-panel)" stroke="var(--mr-ink-2)" strokeWidth="1.2" />
        ))}
        <circle cx={finish[0]} cy={finish[1]} r="6.5" fill="var(--mr-panel)" stroke="var(--mr-ink)" strokeWidth="2" />
        <circle cx={finish[0]} cy={finish[1]} r="2.4" fill="var(--mr-ink)" />
        <circle cx={start[0]} cy={start[1]} r="4.5" fill="var(--mr-ink)" />
        {marker && (
          <>
            <circle cx={marker[0]} cy={marker[1]} r="9" fill="var(--mr-ink)" opacity="0.12" />
            <circle cx={marker[0]} cy={marker[1]} r="5" fill="var(--mr-paper)" stroke="var(--mr-ink)" strokeWidth="2.4" />
          </>
        )}
      </svg>
      <div className="mr-c-ink2 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-wider">
        <span className="flex items-center gap-1.5">
          <span className="mr-bg-ink inline-block h-2 w-2 rounded-full" /> START
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: "var(--mr-ink)" }} /> FINISH
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full border" style={{ borderColor: "var(--mr-ink-2)" }} /> EVERY 5 KM
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value, align }: { label: string; value: string; align: string }) {
  return (
    <div className={align}>
      <div className="mr-c-ink2 text-[10px] tracking-[0.12em] sm:text-[11px]">{label}</div>
      <div className="mt-1 text-[15px] font-extrabold sm:text-[17px]">
        <Scramble text={value} />
      </div>
    </div>
  );
}

function Countdown({ race }: { race: Race }) {
  const now = useNow(true);
  const left = Math.max(0, raceStart(race) - now);
  const parts: [number, string][] = [
    [Math.floor(left / 864e5), "DAYS"],
    [Math.floor((left % 864e5) / 36e5), "HRS"],
    [Math.floor((left % 36e5) / 6e4), "MIN"],
    [Math.floor((left % 6e4) / 1e3), "SEC"],
  ];
  if (left === 0) return <div className="py-2 text-center text-[20px] font-extrabold">RACE DAY · AWAITING RESULTS</div>;
  return (
    <div>
      <div className="mr-c-ink2 flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em]">
        <Timer size={12} strokeWidth={2.5} /> T-MINUS TO START
      </div>
      <div className="mt-2 grid grid-cols-4 text-center" suppressHydrationWarning>
        {parts.map(([v, unit]) => (
          <div key={unit}>
            <div className="text-[28px] font-extrabold leading-none sm:text-[34px]">{pad(v)}</div>
            <div className="mr-c-ink2 mt-1.5 text-[10px] tracking-[0.2em]">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── receipt ───────────────────────── */

function Receipt({ race, number, total }: { race: Race; number: number; total: number }) {
  const upcoming = race.status === "upcoming";
  const { y, m, d } = parseDate(race.date);
  const code = `${pad(number)}${pad(total)}-${race.short.replace(/\s/g, "").slice(0, 5)}-${y}${pad(m)}${pad(d)}`;

  const items: [string, string | number][] = [
    ["BIB NUMBER", race.bib ?? (upcoming ? "TBD" : DASH)],
    ["CORRAL / WAVE", race.corral ?? DASH],
    ["SHOES WORN", race.shoes ?? DASH],
    ["START TEMP / HUMIDITY", race.startWeather ?? DASH],
    ["SPECTATORS EN ROUTE", race.spectators ?? DASH],
    ...(race.extras ?? []),
    ["TOENAILS LOST", race.toenailsLost ?? DASH],
  ];

  const stats: [string, string][] = upcoming
    ? [
        ["DISTANCE", `${fmtKm(race.distanceKm)} KM`],
        ["TARGET PACE", race.targetPace ?? DASH],
        ["TARGET", race.targetTime ?? DASH],
      ]
    : [
        ["DISTANCE", `${fmtKm(race.distanceKm)} KM`],
        ["AVG PACE", race.avgPace ?? DASH],
        ["AVG HR", withUnit(race.avgHr, " BPM")],
        ["DURATION", race.duration ?? DASH],
        ["ELEVATION", withUnit(race.elevation, "m")],
        ["CALORIES", withUnit(race.calories, " KCAL")],
      ];
  const align = ["text-left", "text-center", "text-right"];

  return (
    <article className="mr-c-ink" style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,.13)) drop-shadow(0 2px 2px rgba(0,0,0,.06))" }}>
      <div className="mr-bg-paper px-5 pb-7 pt-8 sm:px-8">
        {/* header */}
        <div className="flex items-center justify-between">
          <Footprints size={26} strokeWidth={2.2} aria-hidden />
          <div className="text-right">
            <div className="text-[14px] font-bold">Race Receipt</div>
            <div className="mr-c-ink2 text-[10px] tracking-wider">
              No. {pad(number)}/{pad(total)}
            </div>
          </div>
        </div>
        <div className="mr-dash my-5" />

        {/* title */}
        {/* Phones: city and date sit under the race name, so a long name can't run into them. */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h2 className="text-[20px] font-extrabold leading-[1.1] sm:text-[24px]" style={{ textWrap: "balance" }}>
              <Scramble text={race.name} />
            </h2>
          </div>
          <div className="sm:shrink-0 sm:text-right">
            <p className="text-[13px] font-extrabold leading-[1.1] sm:text-[15px]">
              <Scramble text={race.location} />
            </p>
            <p className="mr-c-ink2 mt-1.5 text-[11px] tracking-wider sm:text-xs">{fmtDate(race.date)}</p>
          </div>
        </div>

        {/* status */}
        <div className="mt-4">
          {upcoming ? (
            <span className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-dashed px-3 py-1 text-[10px] font-bold tracking-[0.15em]" style={{ borderColor: "var(--mr-ink)" }}>
              <span className="mr-bg-ink mr-pulse h-1.5 w-1.5 rounded-full" /> STATUS: UPCOMING / IN PROGRESS
            </span>
          ) : (
            <span className="mr-bg-ink mr-c-paper inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em]">
              <CircleCheck size={12} strokeWidth={2.5} /> FINISHED{race.duration ? ` · ${race.duration}` : ""}
            </span>
          )}
        </div>

        <RouteLine race={race} printing={upcoming} />

        {/* stats */}
        {upcoming && (
          <div className="mt-6">
            <Countdown race={race} />
          </div>
        )}
        <div className="mt-6 grid grid-cols-3 gap-x-3 gap-y-5">
          {stats.map(([label, value], i) => (
            <Stat key={label} label={label} value={value} align={align[i % 3]} />
          ))}
        </div>

        <div className="mr-dash my-6" />

        {/* itemised */}
        <ul className="space-y-2 text-[12px]">
          {items.map(([k, v]) => (
            <Line key={k} label={k} value={String(v)} />
          ))}
        </ul>
        <div className="my-3 border-t-[3px] border-double" style={{ borderColor: "var(--mr-ink)" }} />
        <ul>
          <Line strong label={upcoming ? "GOAL" : "TOTAL"} value={(upcoming ? race.targetTime : race.duration) ?? DASH} />
        </ul>

        <p className="mt-7 text-center text-[12px] font-bold uppercase leading-relaxed tracking-wide">
          * * *<br />
          {race.quote}
          <br />* * *
        </p>

        <div className="mt-7">
          <Barcode code={code} faded={upcoming} />
        </div>
        <p className="mr-c-ink2 mt-4 text-center text-[10px] tracking-[0.2em]">
          {upcoming ? "RECEIPT PRINTS AT THE FINISH LINE" : "THANK YOU FOR RUNNING"}
        </p>
      </div>
      <div className="mr-zz" />
    </article>
  );
}

// Receipt printers spit paper out in a few hard shoves. Each of the PRINT_STEPS chunks
// shoots out in the first PRINT_BURST of its time slot (fast ease-out), then the paper
// sits still until the next shove.
const PRINT_SECONDS = 3.2;
const PRINT_STEPS = 6;
const PRINT_BURST = 0.28;
const printerFeed = (t: number) => {
  if (t >= 1) return 1;
  const x = t * PRINT_STEPS;
  const i = Math.floor(x);
  const p = Math.min(1, (x - i) / PRINT_BURST);
  return (i + (1 - (1 - p) ** 3)) / PRINT_STEPS;
};

function IntroReceipt({ races }: { races: Race[] }) {
  const km = races.filter((r) => r.status === "completed").reduce((a, r) => a + r.distanceKm, 0);
  const steps: [string, string, string][] = [
    ["01", "PICK A RACE", "IT PRINTS HERE"],
    ["02", "TRACE THE ROUTE", "KM BY KM"],
    ["03", "USE ← →", "FLIP RECEIPTS"],
  ];
  return (
    <article className="mr-c-ink" style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,.13)) drop-shadow(0 2px 2px rgba(0,0,0,.06))" }}>
      <div className="mr-bg-paper px-5 pb-7 pt-8 sm:px-8">
        <div className="flex items-center justify-between">
          <Footprints size={26} strokeWidth={2.2} aria-hidden />
          <div className="text-right">
            <div className="text-[14px] font-bold">Race Receipt</div>
            <div className="mr-c-ink2 text-[10px] tracking-wider">No. 00/{pad(races.length)}</div>
          </div>
        </div>
        <div className="mr-dash my-5" />

        <h2 className="text-[24px] font-extrabold leading-[1.1] sm:text-[28px]" style={{ textWrap: "balance" }}>
          <Scramble text="SELECT A RACE TO VIEW DETAILS!" />
        </h2>
        <p className="mr-c-ink2 mt-3 text-[11px] tracking-wider">
          <span className="lg:hidden">↑ TAP A RACE ABOVE</span>
          <span className="hidden lg:inline">← PICK A CARD ON THE LEFT</span>
        </p>

        <div className="mr-bg-panel mt-6 rounded-2xl p-4">
          <Pill>HOW IT WORKS</Pill>
          <ul className="mt-4 space-y-2.5 text-[12px]">
            {steps.map(([num, label, value]) => (
              // Arrow keys only mean something with a keyboard, so step 03 is desktop-only.
              <li key={num} className={`items-end gap-2 ${num === "03" ? "hidden lg:flex" : "flex"}`}>
                <span className="mr-c-ink2 shrink-0">{num}</span>
                <span className="shrink-0 font-bold">{label}</span>
                <span className="mr-leader" />
                <span className="min-w-0 text-right">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mr-dash my-6" />
        <ul className="space-y-2 text-[12px]">
          <Line label="RACES ON FILE" value={races.length} />
          <Line label="PRINTED" value={races.filter((r) => r.status === "completed").length} />
          <Line label="PENDING" value={races.filter((r) => r.status === "upcoming").length} />
        </ul>
        <div className="my-3 border-t-[3px] border-double" style={{ borderColor: "var(--mr-ink)" }} />
        <ul>
          <Line strong label="TOTAL" value={`${fmtKm(km)} KM`} />
        </ul>

        <div className="mt-7">
          <Barcode code={`00${pad(races.length)}-SELECT`} faded />
        </div>
        <p className="mr-c-ink2 mt-4 text-center text-[10px] tracking-[0.2em]">
          AWAITING SELECTION<span className="mr-blink">█</span>
        </p>
      </div>
      <div className="mr-zz" />
    </article>
  );
}

function ReceiptPrinter({
  race,
  races,
  number,
  total,
}: {
  race: Race | null;
  races: Race[];
  number: number;
  total: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="w-full max-w-[470px]">
      <div className="mr-bg-slot relative z-20 h-7 rounded-full shadow-[0_6px_14px_rgba(0,0,0,.25)]">
        <div className="absolute inset-x-6 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-black/70" />
      </div>
      <div className="relative -mt-3.5 mx-3" style={{ clipPath: "inset(0 -60px -120px -60px)" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={race?.id ?? "intro"}
            initial={reduce ? { opacity: 0 } : { y: "-100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0, transition: { duration: PRINT_SECONDS, ease: printerFeed } }}
            exit={reduce ? { opacity: 0 } : { y: 16, rotate: -1.2, opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }}
          >
            {race ? <Receipt race={race} number={number} total={total} /> : <IntroReceipt races={races} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────────────────── index (cards, chips, ledger) ───────────────────────── */

function RaceCard({ race, active, onSelect, now }: { race: Race; active: boolean; onSelect: () => void; now: number }) {
  const { y, m, d } = parseDate(race.date);
  const upcoming = race.status === "upcoming";
  const days = Math.max(0, Math.ceil((raceStart(race) - now) / 864e5));

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`relative rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5 ${
        upcoming ? "mr-pending col-span-2" : "mr-bg-tile"
      }`}
    >
      {active && (
        <motion.span
          layoutId="mr-card-ring"
          className="pointer-events-none absolute -inset-[3px] rounded-[19px] border-2"
          style={{ borderColor: "var(--mr-fg)" }}
          transition={{ type: "spring", stiffness: 520, damping: 42 }}
        />
      )}
      {upcoming ? (
        <div className="flex items-center gap-4">
          <RouteSketch points={race.route} dashed className="mr-c-muted h-24 w-24 shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="mr-bg-fg mr-c-bg inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.15em]">
              <Printer size={11} strokeWidth={2.5} /> PENDING
            </span>
            <div className="mt-2.5 text-[22px] font-extrabold leading-none">{race.short}</div>
            <div className="mr-c-muted mt-1.5 text-[10px] tracking-[0.15em]" suppressHydrationWarning>
              {shortKm(race.distanceKm)}KM · {MONTHS[m - 1]} {pad(d)} · T-{days} DAYS
              {race.targetTime ? ` · GOAL ${race.targetTime}` : ""}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mr-c-muted flex justify-between text-[11px] tracking-wider">
            <span>{y}</span>
            <span>
              {MONTHS[m - 1]} {pad(d)}
            </span>
          </div>
          <RouteSketch points={race.route} className="mx-auto my-3 h-24 w-24" />
          <div className="text-center text-[22px] font-extrabold leading-none">{race.short}</div>
          <div className="mr-c-muted mt-1.5 text-center text-[10px] tracking-[0.15em]">{shortKm(race.distanceKm)}KM</div>
        </>
      )}
    </button>
  );
}

function Chip({ race, active, onSelect }: { race: Race; active: boolean; onSelect: () => void }) {
  const upcoming = race.status === "upcoming";
  const { y, m, d } = parseDate(race.date);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!active || !el?.parentElement) return;
    const bar = el.parentElement;
    bar.scrollTo({ left: el.offsetLeft - bar.offsetLeft - (bar.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);
  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`relative shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold tracking-wider ${
        upcoming ? "border-[1.5px] border-dashed" : "mr-bg-tile"
      }`}
      style={upcoming ? { borderColor: "var(--mr-line)" } : undefined}
    >
      {active && (
        <motion.span layoutId="mr-chip" className="mr-bg-fg absolute inset-0 rounded-full" transition={{ type: "spring", stiffness: 520, damping: 42 }} />
      )}
      <span className={`relative flex items-center gap-1.5 ${active ? "mr-c-bg" : ""}`}>
        {upcoming && <span className={`mr-pulse h-1.5 w-1.5 rounded-full ${active ? "mr-bg-paper" : "mr-bg-fg"}`} />}
        {race.short} · {upcoming ? `${MONTHS[m - 1]} ${pad(d)}` : y}
      </span>
    </button>
  );
}

function Ledger({ races, totals = {}, className = "" }: { races: Race[]; totals?: LedgerTotals; className?: string }) {
  const done = races.filter((r) => r.status === "completed");
  const km = done.reduce((a, r) => a + r.distanceKm, 0);
  const timed = done.filter((r): r is Race & { duration: string } => Boolean(r.duration));
  const pr = (type: Race["type"]) => {
    const list = timed.filter((r) => r.type === type);
    if (!list.length) return "—";
    const best = list.reduce((a, b) => (toSec(b.duration) < toSec(a.duration) ? b : a));
    return `${best.duration} ${best.short}`;
  };
  const next = races.find((r) => r.status === "upcoming");
  const rows: [string, string | number][] = [
    ["RACE KM", fmtKm(km)],
    ["MARATHON PR", totals.marathonPr ?? pr("full")],
  ];
  if (done.some((r) => r.type === "half")) rows.push(["HALF PR", totals.halfPr ?? pr("half")]);
  if (totals.retiredShoes != null) rows.push(["RETIRED SHOES", totals.retiredShoes]);
  if (next) rows.push(["NEXT START", `${next.short} ${fmtDate(next.date)}`]);
  return (
    <section className={className}>
      <div className="mr-c-muted text-[10px] tracking-[0.25em]">LEDGER</div>
      <div className="mr-dash-page my-3" />
      <ul className="space-y-2 text-[12px]">
        {rows.map(([k, v]) => (
          <Line key={k} label={k} value={v} />
        ))}
      </ul>
      <div className="mr-dash-page my-3" />
    </section>
  );
}

/* ───────────────────────── main ───────────────────────── */

export default function MarathonReceipts({
  races = MARATHONS,
  ledger = LEDGER,
  defaultId,
}: {
  races?: Race[];
  ledger?: LedgerTotals;
  defaultId?: string;
}) {
  // Newest first on screen; receipt numbers still count up in the order the races were run.
  const sorted = useMemo(() => [...races].sort((a, b) => b.date.localeCompare(a.date)), [races]);
  const [activeId, setActiveId] = useState<string | null>(defaultId ?? null);
  const now = useNow(true);
  const index = sorted.findIndex((r) => r.id === activeId);
  const active = index === -1 ? null : sorted[index];
  const number = active ? races.filter((r) => r.date <= active.date).length : 0;
  const completed = races.filter((r) => r.status === "completed");
  const pending = races.length - completed.length;
  const km = completed.reduce((a, r) => a + r.distanceKm, 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input,textarea,select,[contenteditable]")) return;
      const n = sorted.length;
      if (e.key === "ArrowRight") setActiveId(sorted[(index + 1) % n].id);
      if (e.key === "ArrowLeft") setActiveId(sorted[index === -1 ? n - 1 : (index - 1 + n) % n].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, sorted]);

  if (!sorted.length) return null;

  return (
    <div className="mr-root">
      <style>{CSS}</style>
      <LayoutGroup>
        <div className="mx-auto max-w-[1100px] px-[var(--gutter)] pb-16 pt-8 lg:grid lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
          {/* index */}
          <aside className="lg:sticky lg:self-start" style={{ top: "calc(var(--mr-sticky-top, 0px) + 1.5rem)" }}>
            <p className="mr-c-muted text-[11px] tracking-[0.2em]">MARATHON RECEIPT ARCHIVE • {races.length} ISSUED</p>
            <h1 className="mt-3 font-serif text-[clamp(2.5rem,8vw,4rem)] leading-[1.05] tracking-[-0.03em]">Race Receipts</h1>
            <p className="mr-c-muted mt-4 text-[11px] tracking-wider">
              {completed.length} PRINTED · {pending} PENDING · {fmtKm(km)} KM RACED
            </p>

            <div className="mt-8 hidden grid-cols-2 gap-3 lg:grid">
              {sorted.map((r) => (
                <RaceCard key={r.id} race={r} active={r.id === activeId} onSelect={() => setActiveId(r.id)} now={now} />
              ))}
            </div>

            <Ledger races={races} totals={ledger} className="mt-8 hidden lg:block" />
            <p className="mr-c-muted mt-3 hidden text-[10px] tracking-[0.2em] lg:block">← → TO FLIP RECEIPTS</p>
          </aside>

          {/* mobile chips */}
          <nav
            aria-label="Races"
            className="sticky z-20 -mx-[var(--gutter)] mt-6 px-[var(--gutter)] py-3 lg:hidden"
            style={{ top: "var(--mr-sticky-top, 0px)", background: "color-mix(in srgb, var(--mr-bg) 90%, transparent)", backdropFilter: "blur(8px)" }}
          >
            <div className="mr-noscroll flex gap-2 overflow-x-auto">
              {sorted.map((r) => (
                <Chip key={r.id} race={r} active={r.id === activeId} onSelect={() => setActiveId(r.id)} />
              ))}
            </div>
          </nav>

          {/* active receipt */}
          <main className="mt-4 flex justify-center lg:mt-0">
            <ReceiptPrinter race={active} races={races} number={number} total={races.length} />
          </main>

          <Ledger races={races} totals={ledger} className="mt-12 lg:hidden" />
        </div>
      </LayoutGroup>
    </div>
  );
}
