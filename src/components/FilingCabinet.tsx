import { motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 26 };

type Entry =
  | { id: number; kind: "panel"; label: string }
  | {
      id: number;
      kind: "project";
      code: string;
      label: string;
      title: string;
      meta?: string[]; // small filled pills (year, 0→1, …) shown before the role
      role: string;
      status?: string; // optional — omit to hide the second pill
      caseStudyUrl?: string; // optional — omit to hide the "View Case Study" link
      lines: string[];
      tabLeftPct: number;
    }
  | { id: number; kind: "about"; code: string; label: string; tabLeftPct: number };

// Back of the drawer (i = 0) to front (last item); the panel is the
// drawer's front wall.
const ENTRIES: Entry[] = [
  {
    id: 1,
    kind: "project",
    code: "[01]",
    label: "DESCRIBE TO DESIGN",
    title: "Describe to Design",
    meta: ["2026", "0→1"],
    role: "Lead Designer",
    lines: [
      "Describe to Design set out to let people describe what they wanted in plain language and have AI simply build and configure the workflow for them. This project was successfully launched in 2026.",
    ],
    tabLeftPct: 30,
  },
  {
    id: 2,
    kind: "project",
    code: "[02]",
    label: "UNIFIED TRANSFORM",
    title: "Unified Transform",
    role: "Lead Designer",
    lines: [
      "A redesign of how users transform data fields when ingesting information into Qualtrics — replacing two separate, unequal tools (Basic and Advanced Transform) with a single task that lets people move fluidly between AI-assisted, manual, and code-based transformation without ever hitting a dead end.",
      "Currently in development, targeting a Q4 2026 launch.",
    ],
    tabLeftPct: 58,
  },
  {
    id: 3,
    kind: "project",
    code: "[03]",
    label: "OXM NON VOICE",
    title: "OXM Non Voice",
    role: "Lead Designer",
    lines: [
      "Placeholder copy — a short framing of the problem and who it was for.",
      "Placeholder copy — the approach, the key decisions, and what shipped.",
      "Placeholder copy — outcomes, metrics, and what I would do differently.",
    ],
    tabLeftPct: 16,
  },
  {
    id: 4,
    kind: "project",
    code: "[04]",
    label: "PITCHBOOK PROJECTS",
    title: "Pitchbook Projects",
    role: "Lead Designer",
    status: "Lead Researcher",
    caseStudyUrl:
      "https://www.figma.com/proto/rZ1VDRfVbJ3xziSJcXC0K1/Case-Studies?node-id=101-8872&viewport=407%2C406%2C0.02&t=ZaXoOVmx3rNedutz-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=101%3A8872&page-id=101%3A8865",
    lines: [
      "I worked on the Market Intelligence team at PitchBook. I led the Emerging Markets space as well as features around custom fields and saved lists. The case studies highlight two projects launched in 2021.",
    ],
    tabLeftPct: 52,
  },
  { id: 5, kind: "about", code: "[05]", label: "ABOUT / MANSI", tabLeftPct: 36 },
  { id: 100, kind: "panel", label: "SELECTED WORK / 05 FILES" },
];

const N = ENTRIES.length;
const CONTAINER_W = 700;
const STEP = 54; // vertical distance between successive folder tops
const TAB_H = 26;
const PANEL_H = 170; // visible height of the front drawer wall
const W_BACK = 430; // narrowest (backmost) folder
const W_STEP = 44; // width gained per step toward the front
const TAB_MARGIN = 14; // keeps a tab from touching its folder's side edges

// The card is layered BEHIND its folder's front wall, so it becomes legible
// by rising until its body clears the folder's top line — leaving only this
// much tucked back behind the wall, like a document standing in a pocket.
const LIP_TUCK = 40;
const HOVER_LIFT = 20; // hover peeks in the same upward direction
const FRONT_DROP = 40; // the front lip drops away as the document comes up
const BEHIND_LIFT = -20; // folders behind lean back a touch

// Headroom above the stack apex. Normally the base value is enough for the
// tallest card to eject fully, but it is recomputed from the *measured*
// active card so an unexpectedly tall card pushes the stack down rather
// than climbing out of the container into the hero.
const BASE_HEADROOM = 174;
const BASE_POCKET_UP = 470; // clip-region travel room above each folder top
const TOP_MARGIN = 8; // smallest gap kept between an ejected card and the top

// Trapezoidal file-divider tab: sides slope outward toward the base. The
// outer polygon is painted black (the outline); the inset inner polygon is
// painted with the fill, leaving a hairline of black showing as the border.
const TAB_OUTER = "polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%)";
const TAB_INNER =
  "polygon(14px 1.4px, calc(100% - 14px) 1.4px, calc(100% - 1.6px) 100%, 1.6px 100%)";

// Renders the portrait once public/portrait.jpg exists, and falls back to
// the wireframe placeholder until then — so dropping the file in is the
// only step needed.
function Portrait() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 border border-white/20 rounded-sm">
      {!failed ? (
        <img
          src="/portrait.jpg"
          alt="Mansi Shah"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 22%" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-white/25" aria-hidden="true">
            <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M20 2v10M20 28v10M2 20h10M28 20h10" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40">
            [ MANSI_PORTRAIT.JPG ]
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">[ 400×500 ]</span>
        </div>
      )}
    </div>
  );
}

function FolderPiece({
  entry,
  i,
  activeIndex,
  hoveredId,
  headroom,
  onEnter,
  onLeave,
  onSelect,
  onMeasure,
}: {
  entry: Entry;
  i: number;
  activeIndex: number;
  hoveredId: number | null;
  headroom: number;
  onEnter: (id: number) => void;
  onLeave: () => void;
  onSelect: (id: number) => void;
  onMeasure: (id: number, h: number) => void;
}) {
  const isInteractive = entry.kind === "project" || entry.kind === "about";
  const someActive = activeIndex >= 0;
  const isActive = isInteractive && i === activeIndex;
  const isHovered = isInteractive && hoveredId === entry.id && !isActive;
  const isDimmed = someActive && !isActive && !isHovered;

  const cardRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState(0);
  const [tabW, setTabW] = useState(0);

  // The ejection distance is driven entirely by the card's own rendered
  // height, so a short project summary and the long bio each rise exactly
  // as far as they need to.
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const report = () => {
      setCardH(el.offsetHeight);
      onMeasure(entry.id, el.offsetHeight);
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [entry.id, onMeasure]);

  // Tabs size to their own label, so a long one (e.g. UNIFIED TRANSFORM)
  // must be measured to know whether its slot would push it off the folder.
  useLayoutEffect(() => {
    const el = tabRef.current;
    if (!el) return;
    const report = () => setTabW(el.offsetWidth);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const width = W_BACK + i * W_STEP;
  const left = (CONTAINER_W - width) / 2;

  // Every folder's body reaches the same drawer floor (the front panel's
  // bottom edge), like real files standing in a drawer.
  const bodyH = (N - 1 - i) * STEP + PANEL_H;

  const gapShift = !someActive || isActive ? 0 : i < activeIndex ? BEHIND_LIFT : FRONT_DROP;
  const extraY = isActive ? -12 : isHovered ? -12 + gapShift : gapShift;
  const bodyTop = headroom + i * STEP + extraY;

  // Clip travel must always exceed this folder's own ejection distance,
  // otherwise a tall card gets its top sliced off as it rises.
  const ownLift = Math.max(0, cardH - LIP_TUCK);
  const pocketUp = Math.max(BASE_POCKET_UP, ownLift + 24);

  // Keep the tab inside its folder's top line: start from its slot, then
  // clamp so it can never overhang either edge.
  const tabLeft =
    entry.kind === "panel"
      ? 0
      : Math.min(
          Math.max((entry.tabLeftPct / 100) * width, TAB_MARGIN),
          Math.max(TAB_MARGIN, width - tabW - TAB_MARGIN),
        );

  // The open folder's whole container is escalated above every other item,
  // so nothing from a neighbouring folder can cross the open document.
  const wrapperZ = isActive ? 50 : 10 + i;

  // Both states extract upward; clicking simply pulls much further.
  const cardY = isActive ? -ownLift : isHovered ? -HOVER_LIFT : 0;

  // Real case-study links open in a new tab. The "#" placeholders must not —
  // target="_blank" on "#" spawns a useless blank tab.
  const caseStudyIsExternal =
    entry.kind === "project" && /^https?:\/\//.test(entry.caseStudyUrl ?? "");

  const handlers = isInteractive
    ? {
        onMouseEnter: () => onEnter(entry.id),
        onMouseLeave: onLeave,
        onClick: () => onSelect(entry.id),
      }
    : {};

  return (
    // One folder = one container. Everything (pocket, card, wall, tab) lives
    // inside it, so the whole item moves and layers as a single unit.
    <motion.div
      initial={false}
      className="folder-container absolute inset-0"
      style={{ pointerEvents: "none", zIndex: wrapperZ }}
      animate={{ opacity: isDimmed ? 0.4 : 1 }}
      transition={SPRING}
    >
      {isInteractive && (
        // Clipping pocket (z-40): bounds the card to the folder's width and
        // hides it below the folder's bottom edge at rest.
        <motion.div
          initial={false}
          className="absolute overflow-hidden pointer-events-none"
          style={{ left, width, zIndex: 40 }}
          animate={{ top: bodyTop - pocketUp, height: pocketUp + bodyH }}
          transition={SPRING}
        >
          <motion.div
            initial={false}
            ref={cardRef}
            className="@container absolute h-auto min-h-0 bg-[#111111] rounded-md px-6 pt-5 text-[#F4F4F0]"
            // The card's bottom LIP_TUCK px stay tucked behind the folder
            // wall, so reserve that much padding or the last line is cut off.
            style={{ left: 14, right: 14, top: pocketUp, paddingBottom: LIP_TUCK + 28 }}
            animate={{ y: cardY }}
            transition={SPRING}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
              <span className="font-mono text-[11px] tracking-[0.2em]">{entry.code}</span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/40">{entry.label}</span>
            </div>
            {entry.kind === "about" ? (
              // Container query, not a viewport breakpoint: the card is a
              // fixed ~600px element inside the folder, so its columns must
              // respond to its OWN width. On a narrow viewport a `md:` rule
              // collapses this to one column and triples the card's height,
              // over-ejecting it out of the drawer.
              <div className="grid grid-cols-1 @md:grid-cols-12 gap-6 items-center pb-2">
                <div className="@md:col-span-7 space-y-3 text-left font-mono text-[12px] leading-relaxed text-white/90">
                  <p>
                    I&rsquo;m Mansi <span className="text-white/50">(pronounced mahn-see)</span>.
                  </p>
                  <p>
                    By day, I&rsquo;m a UX designer at Qualtrics, where I get to untangle
                    complicated problems into experiences that feel simple. Outside of that,
                    I&rsquo;m equal parts restless tinkerer, designer, and random hobby
                    collector. I find so much joy in the process of making and exploring:
                    building interactive web experiments, knitting cozy sweaters, training
                    for my next marathon, and frequently googling &ldquo;ice cream near me.&rdquo;
                  </p>
                  <p>
                    I value living a life anchored in curiosity and quiet creativity &mdash;
                    and I&rsquo;m always up for talking design, sweaters, or good ice cream
                    spots. feel free to say hi!
                  </p>
                </div>
                <div className="@md:col-span-5">
                  <Portrait />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 font-mono text-[13px] leading-relaxed text-white/90">
                  {entry.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {entry.meta?.map((m) => (
                    <span
                      key={m}
                      className="font-mono text-[10px] tracking-[0.15em] uppercase bg-white/10 rounded-full px-2.5 py-1"
                    >
                      {m}
                    </span>
                  ))}
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase border border-white/20 rounded-full px-2.5 py-1">
                    {entry.role}
                  </span>
                  {entry.status && (
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase border border-white/20 rounded-full px-2.5 py-1">
                      {entry.status}
                    </span>
                  )}
                </div>
                {entry.caseStudyUrl ? (
                  <a
                    href={entry.caseStudyUrl}
                    target={caseStudyIsExternal ? "_blank" : undefined}
                    rel={caseStudyIsExternal ? "noopener noreferrer" : undefined}
                    // Closed cards sit hidden behind the folder wall, so their
                    // link must leave the tab order too — not just be unclickable.
                    tabIndex={isActive ? 0 : -1}
                    className="mt-3 inline-block font-mono text-sm tracking-wide underline underline-offset-4 decoration-white/40 hover:decoration-white"
                    // The clipping pocket sets pointer-events: none, so re-enable
                    // it just for this link, and only while the card is open.
                    style={{ pointerEvents: isActive ? "auto" : "none" }}
                  >
                    View Case Study
                  </a>
                ) : (
                  <p className="mt-3 font-mono text-sm tracking-wide text-white/40">
                    Case study coming soon
                  </p>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Folder front wall (z-45): sits above the card so the document
          reads as rising out from behind it. */}
      <motion.div
        initial={false}
        {...handlers}
        className={`absolute bg-[#F4F4F0] border border-black rounded-[10px] ${
          isInteractive ? "cursor-pointer" : ""
        }`}
        style={{ left, width, height: bodyH, zIndex: 45, pointerEvents: "auto" }}
        animate={{ top: bodyTop }}
        transition={SPRING}
      >
        {entry.kind === "panel" && (
          <span className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 bg-[#111111] border-2 border-black rounded-sm px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0] whitespace-nowrap">
            {entry.label}
          </span>
        )}

        {/* Tab — a CHILD of the folder wall, pinned to its top edge and
            pulled up by its own height. It inherits the wall's animated
            position, so it tracks the folder in exact lockstep with no
            animation of its own. */}
        {entry.kind !== "panel" && (
          <motion.div
            initial={false}
            ref={tabRef}
            // The tab is the keyboard control for its folder. Focus reuses the
            // hover treatment (inverted fill + card peek), which doubles as the
            // visible focus indicator — an outline would be clipped away by the
            // trapezoid clip-path.
            role="button"
            tabIndex={0}
            aria-expanded={isActive}
            aria-label={`${entry.code} ${entry.label}`}
            onFocus={() => onEnter(entry.id)}
            onBlur={onLeave}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault(); // Space would otherwise scroll the page
                onSelect(entry.id);
              }
            }}
            className="absolute top-0 -translate-y-full w-auto inline-flex items-center whitespace-nowrap px-4 py-1 cursor-pointer select-none outline-none"
            style={{
              left: tabLeft,
              height: TAB_H,
              zIndex: 46,
              clipPath: TAB_OUTER,
              backgroundColor: "#111111",
            }}
          >
            <motion.div
              initial={false}
              className="absolute inset-0"
              style={{ clipPath: TAB_INNER }}
              animate={{ backgroundColor: isHovered ? "#111111" : "#F4F4F0" }}
              transition={SPRING}
            />
            <motion.span
              initial={false}
              className="relative z-[1] flex h-full items-center justify-center pt-px font-mono text-[10px] tracking-[0.22em] uppercase"
              animate={{ color: isHovered ? "#F4F4F0" : "rgba(17,17,17,0.6)" }}
              transition={SPRING}
            >
              {`${entry.code} ${entry.label}`}
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function FilingCabinet() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [cardHeights, setCardHeights] = useState<Record<number, number>>({});
  const stackRef = useRef<HTMLDivElement>(null);

  const activeIndex = activeId === null ? -1 : ENTRIES.findIndex((e) => e.id === activeId);

  const onMeasure = useCallback((id: number, h: number) => {
    setCardHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }));
  }, []);

  // Give the open card exactly the headroom its measured height needs. The
  // base value normally covers it, so the stack usually doesn't move at all
  // — but an oversized card pushes the stack down instead of overflowing.
  const activeLift =
    activeId === null ? 0 : Math.max(0, (cardHeights[activeId] ?? 0) - LIP_TUCK);
  const headroom =
    activeIndex < 0
      ? BASE_HEADROOM
      : Math.max(BASE_HEADROOM, activeLift + 12 + TOP_MARGIN - activeIndex * STEP);
  const containerH = headroom + (N - 1) * STEP + PANEL_H + 40 + (activeIndex >= 0 ? FRONT_DROP : 0);

  // Click anywhere outside the stack dismisses the open folder.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (stackRef.current && !stackRef.current.contains(e.target as Node)) {
        setActiveId(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <section className="pb-24 px-6">
      <motion.div
        initial={false}
        ref={stackRef}
        className="relative mx-auto max-w-full"
        style={{ width: CONTAINER_W }}
        animate={{ height: containerH }}
        transition={SPRING}
      >
        {ENTRIES.map((entry, i) => (
          <FolderPiece
            key={entry.id}
            entry={entry}
            i={i}
            activeIndex={activeIndex}
            hoveredId={hoveredId}
            headroom={headroom}
            onEnter={setHoveredId}
            onLeave={() => setHoveredId(null)}
            onSelect={(id) => setActiveId((cur) => (cur === id ? null : id))}
            onMeasure={onMeasure}
          />
        ))}
      </motion.div>
    </section>
  );
}
