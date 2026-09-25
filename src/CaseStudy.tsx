import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  CASE_STUDIES,
  CONTACT,
  type CaseStudy as CaseStudyType,
  type FactCard,
  type Panel as PanelType,
  type Preview as PreviewType,
  type Reflection as ReflectionType,
  type Section as SectionType,
  type Timeline as TimelineType,
  type Shot as ShotType,
} from "./content";
import { LABEL, Link, delay } from "./ui";

const WRAP = "mx-auto w-full max-w-[1100px] px-[var(--gutter)]";
const HEADING =
  "font-sans text-section font-semibold leading-[1.15] tracking-[-0.01em]";
// Measures cap the line length, and words wrap whole rather than hyphenating.
const COPY =
  "font-mono text-body leading-relaxed hyphens-none [overflow-wrap:normal]";
const MEASURE = "max-w-[70ch]";
const MEASURE_TIGHT = "max-w-[50ch]"; // the narrative copy

/** A mock. Until the export lands it holds its space as a labelled frame, so
 *  dropping the real image in never moves the layout. */
function Shot({
  shot,
  ratio = "aspect-[16/10]",
  dark = false,
}: {
  shot: ShotType;
  ratio?: string;
  dark?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (shot.src && !failed) {
    const img = (
      <img
        src={shot.src}
        alt={shot.label}
        className="w-full"
        onError={() => setFailed(true)}
      />
    );

    if (shot.frame === "card") {
      // The gradient edge and glow live in CSS so the mock can sit straight on
      // the dark band, the way the design has it.
      return (
        <div>
          <div className="rounded-[18px] bg-[linear-gradient(135deg,#34d399,#38bdf8,#6d28d9)] p-[2px] shadow-[0_0_90px_-12px_rgba(96,165,250,0.65)]">
            <div className="rounded-[16px] bg-white px-5 py-4 dt:px-7 dt:py-6">
              {img}
            </div>
          </div>
          {/* Built here rather than exported: Figma bakes the page colour in
              behind it, which shows as a pale square on the dark band. */}
          {shot.fab && <AssistButton />}
        </div>
      );
    }

    return img;
  }

  return (
    <div
      className={`flex ${ratio} w-full items-center justify-center rounded-xl border ${
        dark ? "border-paper/15 bg-paper/5" : "border-ink/15 bg-ink/[0.04]"
      }`}
    >
      <span className={`${LABEL} ${dark ? "text-paper/40" : "text-ink/35"}`}>
        [ {shot.label} ]
      </span>
    </div>
  );
}

/** The Assist button, which rolls in from the left of the band once it comes
 *  into view. */
function AssistButton() {
  const ref = useRef<HTMLSpanElement>(null);
  const [played, setPlayed] = useState(false);

  // How far it has to travel, and how many turns that is at its size. Measured
  // rather than hard-coded, since the band runs the full width of the window.
  // It starts half a button past the band's right edge, so it rolls in from
  // off-screen rather than popping into view.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || played) return;

    const measure = () => {
      // Clear the offset first so the rect reads the resting position.
      el.style.setProperty("--roll-x", "0px");
      const band = el.closest("section");
      if (!band) return;

      const rect = el.getBoundingClientRect();
      const distance =
        band.getBoundingClientRect().right - rect.left + rect.width / 2;
      el.style.setProperty("--roll-x", `${Math.round(distance)}px`);
      el.style.setProperty(
        "--roll-deg",
        `${Math.round((distance / (Math.PI * rect.width)) * 360)}deg`,
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [played]);

  useEffect(() => {
    const el = ref.current;
    if (!el || played) return;

    // Watch the card, not the button: the button waits off-screen, so it
    // never intersects the viewport and would never start.
    const card = el.previousElementSibling ?? el.parentElement ?? el;
    const band = el.closest("section");

    // Desktop fires as the card's top crosses 60% of the way down the screen,
    // so the roll is already underway when the card lands mid-screen.
    const wide = window.matchMedia(
      "(min-width: 1100px), (min-width: 768px) and (any-pointer: fine)",
    ).matches;

    // On a phone it waits for the whole band. Where the band is taller than
    // the screen it can never be 100% visible, so the bar becomes "as much of
    // it as the screen can hold" — otherwise the roll would never fire.
    const bandHeight = band?.getBoundingClientRect().height ?? 0;
    const fullyInView = bandHeight
      ? Math.min(0.95, (window.innerHeight / bandHeight) * 0.9)
      : 0.8;

    const target = wide ? card : (band ?? card);
    const options: IntersectionObserverInit = wide
      ? { rootMargin: "0px 0px -40% 0px" }
      : { threshold: fullyInView };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPlayed(true);
        io.disconnect();
      }
    }, options);
    io.observe(target);
    return () => io.disconnect();
  }, [played]);

  return (
    // The wrapper carries the travel and the glow; the inner span does the
    // turning, so the glow rolls along without rotating.
    <span
      ref={ref}
      data-played={played}
      className="assist-roll ml-auto mt-[18px] block aspect-square w-[17%] rounded-full shadow-[0_10px_30px_-8px_rgba(59,110,245,0.7)]"
    >
      <span className="assist-spin grid h-full w-full place-items-center rounded-full bg-[linear-gradient(135deg,#18a0fb_0%,#3b6ef5_45%,#6d28d9_100%)]">
        <img src="/sparkle.svg" alt="" className="w-[46%]" />
      </span>
    </span>
  );
}

/** The white options panel on the dark band. */
function Panel({ panel }: { panel: PanelType }) {
  return (
    // Same gradient edge and glow as the mocks on Describe to Design.
    <div className="rounded-[18px] bg-[linear-gradient(135deg,#34d399,#38bdf8,#6d28d9)] p-[2px] shadow-[0_0_90px_-12px_rgba(96,165,250,0.65)]">
      <div className="rounded-[16px] bg-white px-6 py-6 text-ink dt:px-8 dt:py-7">
        <h3 className="font-serif text-[calc(var(--text-body)*1.65)] leading-snug tracking-[-0.01em]">
          {panel.title}
        </h3>
        {panel.subtitle && (
          <p className={`${COPY} mt-2 text-ink/60`}>{panel.subtitle}</p>
        )}

        <dl className="mt-5">
          {panel.rows.map((row) => (
            <div
              key={row.title}
              className="border-b border-ink/10 pb-4 pt-4 first:pt-0"
            >
              <dt className="font-mono text-body font-medium">{row.title}</dt>
              <dd className={`${COPY} mt-1 text-ink/60`}>{row.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function Card({ card }: { card: FactCard }) {
  return (
    <div className="rounded-xl bg-ink/[0.045] pb-[max(18px,4.8vw)] pl-[max(18px,4.8vw)] pr-[max(16px,4.27vw)] pt-[max(18px,4.8vw)] dt:p-5">
      <p className={`${LABEL} text-ink/40`}>{card.label}</p>

      {card.headline && (
        // Sized off the label step rather than with LABEL, so the two
        // font-size utilities can't fight over which one wins.
        <p className="mt-3 font-mono text-[calc(var(--text-label)*1.9)] font-medium uppercase leading-snug tracking-[0.06em]">
          {card.headline}
        </p>
      )}
      {card.meta && <p className={`${LABEL} mt-2 text-ink/40`}>{card.meta}</p>}

      {card.body && (
        <p className={`${COPY} mt-3 text-ink/70`}>
          {card.body}
          {card.emphasis && (
            <strong className="font-medium text-ink">{card.emphasis}</strong>
          )}
        </p>
      )}

      {card.items && (
        <ul className={`${COPY} mt-3 space-y-1 text-ink/70`}>
          {card.items.map((item) => (
            <li key={item} className="flex gap-2.5">
              {/* A drawn dot rather than the mid-dot glyph, which all but
                  disappears at this size. */}
              <span
                aria-hidden="true"
                className="mt-[0.5em] size-[5px] shrink-0 rounded-full bg-ink/55"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The mocked data table for the live-preview beat. */
function PreviewTable({ preview }: { preview: PreviewType }) {
  return (
    // The gradient edge and glow the mocks carry.
    <div className="rounded-[18px] bg-[linear-gradient(135deg,#34d399,#38bdf8,#6d28d9)] p-[2px] shadow-[0_0_90px_-12px_rgba(96,165,250,0.65)]">
      <div className="rounded-[16px] bg-white px-5 py-5 dt:px-6 dt:py-6">
        <p className={`${LABEL} text-ink/35`}>{preview.label}</p>

        {/* Four columns of mono can't fit a phone, so the table scrolls inside
          the card rather than stretching the page. */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[26rem] border-collapse text-left font-mono text-[0.8em]">
            <thead>
              <tr className="text-ink/45">
                {preview.columns.map((column) => (
                  <th
                    key={column}
                    className="border-b border-ink/10 pb-2 pr-3 font-normal"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row) => (
                <tr key={row.join()} className="text-ink/75">
                  {row.map((cell) => (
                    <td key={cell} className="border-b border-ink/10 py-2 pr-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {preview.chip && (
          <p
            className={`${LABEL} mt-4 inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-ink/15 px-3 py-1.5 text-ink/55`}
          >
            {preview.chip}
          </p>
        )}
      </div>
    </div>
  );
}

/** The options panel as it appears on the paper background. */
function MethodCard({ panel }: { panel: PanelType }) {
  return (
    // The same gradient edge and glow the mocks carry.
    <div className="rounded-[18px] bg-[linear-gradient(135deg,#34d399,#38bdf8,#6d28d9)] p-[2px] shadow-[0_0_90px_-12px_rgba(96,165,250,0.65)]">
      <div className="rounded-[16px] bg-white px-6 py-8 text-center dt:px-10 dt:py-10">
        <h3 className="font-serif text-[calc(var(--text-body)*1.65)] leading-snug tracking-[-0.01em]">
          {panel.title}
        </h3>
        {panel.subtitle && (
          <p className={`${COPY} mt-2 text-ink/55`}>{panel.subtitle}</p>
        )}

        <div className="mt-6 grid gap-3 text-left dt:grid-cols-3">
          {panel.rows.map((row) => (
            <div
              key={row.title}
              className="rounded-xl bg-ink/[0.045] px-4 py-4"
            >
              <p className="font-mono text-body font-medium">{row.title}</p>
              <p className={`${COPY} mt-1.5 text-ink/55`}>{row.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ section }: { section: SectionType }) {
  const wide = section.layout === "wide";
  const heading = <h2 className={HEADING}>{section.title}</h2>;
  const body = section.body?.length ? (
    <div className="space-y-3">
      {section.body.map((para) => (
        <p
          key={para.slice(0, 24)}
          className={`${COPY} ${wide ? MEASURE : MEASURE_TIGHT} text-ink/70`}
        >
          {para}
        </p>
      ))}
    </div>
  ) : null;

  // A heading over numbered cards — the principles behind the work.
  if (section.cards?.length) {
    return (
      <section className={`${WRAP} rise py-[max(3rem,10vw)] dt:py-20`}>
        {heading}
        <div className="mt-6 grid gap-3 dt:mt-8 dt:grid-cols-4 dt:gap-4">
          {section.cards.map((card) => (
            <div key={card.num} className="rounded-xl bg-ink/[0.045] px-5 py-5">
              <p className={`${LABEL} text-[#6d28d9]`}>{card.num}</p>
              <p className="mt-3 font-serif text-[calc(var(--text-body)*1.45)] leading-snug tracking-[-0.01em]">
                {card.title}
              </p>
              <p className={`${COPY} mt-3 text-ink/60`}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // A centred heading over the entry-point panel.
  if (section.panel) {
    return (
      <section className={`${WRAP} rise py-[max(3rem,10vw)] dt:py-20`}>
        {heading}
        {section.subtitle && (
          <p className={`${COPY} mt-3 text-ink/60`}>{section.subtitle}</p>
        )}
        <div className="mt-6 dt:mt-8">
          <MethodCard panel={section.panel} />
        </div>
      </section>
    );
  }

  if (wide) {
    // Phone: heading, mock, then the copy — the picture carries the point and
    // the paragraph reads as its caption. Desktop keeps copy above the mock.
    return (
      <section
        className={`${WRAP} rise flex flex-col py-[max(3rem,10vw)] text-center dt:py-20`}
      >
        <div className={`mx-auto ${MEASURE}`}>{heading}</div>
        {section.shot && (
          <div className="order-2 mt-8 dt:order-3 dt:mt-12">
            <Shot shot={section.shot} ratio="aspect-[16/9]" />
          </div>
        )}
        <div
          className={`order-3 mx-auto mt-8 ${MEASURE} [&_p]:mx-auto dt:order-2 dt:mt-4`}
        >
          {body}
        </div>
      </section>
    );
  }

  const shotLeft = section.layout === "shot-left";

  return (
    <section className={`${WRAP} rise py-[max(3rem,10vw)] dt:py-20`}>
      <div className="grid items-center gap-8 dt:grid-cols-2 dt:gap-14">
        {/* The mock leads on a phone either way — a picture reads faster than
            a heading when the column is this narrow. min-w-0 keeps a grid item
            from stretching to its content, which the preview table would. */}
        <div className={`min-w-0 ${shotLeft ? "" : "dt:order-last"}`}>
          {section.preview ? (
            <PreviewTable preview={section.preview} />
          ) : (
            section.shot && <Shot shot={section.shot} />
          )}
        </div>
        <div>
          {section.kicker && (
            <p className={`${LABEL} mb-3 text-[#6d28d9]`}>{section.kicker}</p>
          )}
          {heading}
          <div className="mt-4">{body}</div>
        </div>
      </div>
    </section>
  );
}

/** The dark band of where the work stands, as a run of dated steps. */
function TimelineBand({ timeline }: { timeline: TimelineType }) {
  return (
    <section className="bg-[linear-gradient(180deg,#23333f_0%,#151e25_45%,#06080b_100%)] py-[max(3rem,12vw)] text-paper dt:py-24">
      <div className={WRAP}>
        <p className={`${LABEL} text-spark`}>{timeline.kicker}</p>
        <h2 className={`${HEADING} mt-4`}>{timeline.title}</h2>

        <ol className="mt-8 grid gap-6 dt:mt-10 dt:grid-cols-5 dt:gap-5">
          {timeline.steps.map((step) => (
            <li key={step.title} className="border-t border-spark/60 pt-4">
              <p className={`${LABEL} text-paper/50`}>{step.when}</p>
              <p className="mt-2 font-serif text-[calc(var(--text-body)*1.45)] leading-snug">
                {step.title}
              </p>
              <p className={`${COPY} mt-2 text-paper/60`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Closing notes on what the work taught. */
function ReflectionBlock({ reflection }: { reflection: ReflectionType }) {
  return (
    <section className={`${WRAP} rise py-[max(3rem,10vw)] dt:py-20`}>
      <p className={`${LABEL} text-[#6d28d9]`}>{reflection.kicker}</p>
      <h2 className={`${HEADING} mt-4`}>{reflection.title}</h2>

      <div className="mt-6 grid gap-3 dt:mt-8 dt:grid-cols-3 dt:gap-4">
        {reflection.cards.map((card) => (
          <div key={card.label} className="rounded-xl bg-ink/[0.045] px-5 py-5">
            <p className={`${LABEL} text-[#6d28d9]`}>{card.label}</p>
            <p className="mt-3 font-serif text-[calc(var(--text-body)*1.45)] leading-snug tracking-[-0.01em]">
              {card.title}
            </p>
            <p className={`${COPY} mt-3 text-ink/60`}>{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** The ask: opens a note requesting the deck for this project. */
function RequestLink({
  study,
  variant = "pill",
  className = "",
  style,
}: {
  study: CaseStudyType;
  variant?: "pill" | "link";
  className?: string;
  style?: CSSProperties;
}) {
  const chrome =
    variant === "pill"
      ? "rounded-full bg-accent px-[max(1.75rem,7vw)] py-[max(0.9rem,3.5vw)] text-ink hover:brightness-95 dt:px-9 dt:py-4"
      : "border-b border-ink pb-1 pt-3 hover:opacity-60";

  return (
    <a
      href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
        `Request to see the ${study.title} case study`,
      )}`}
      className={`${LABEL} inline-flex items-center gap-2 transition ${chrome} ${className}`}
      style={style}
    >
      Request the full case study <span aria-hidden="true">→</span>
    </a>
  );
}

/** Bottom-of-page step: the neighbouring case study, or home. */
function StepLink({
  to,
  label,
  title,
  align,
}: {
  to: string;
  label: string;
  title: string;
  align: "left" | "right";
}) {
  return (
    <Link
      to={to}
      className={`py-2 hover:opacity-60 ${align === "right" ? "text-right" : ""}`}
    >
      <span className={`${LABEL} block text-ink/40`}>{label}</span>
      <span className="mt-2 block font-serif text-[clamp(1.25rem,5vw,2.75rem)] leading-tight tracking-[-0.02em] dt:text-[clamp(1.25rem,5vw,1.75rem)]">
        {title}
      </span>
    </Link>
  );
}

export default function CaseStudy({ study }: { study: CaseStudyType }) {
  const i = CASE_STUDIES.findIndex((s) => s.slug === study.slug);
  const prev = i > 0 ? CASE_STUDIES[i - 1] : null;
  const next =
    i > -1 && i < CASE_STUDIES.length - 1 ? CASE_STUDIES[i + 1] : null;

  return (
    <article className="pb-[max(3rem,10vw)] dt:pb-16">
      <header className={`${WRAP} pt-[max(1rem,4vw)] dt:pt-10`}>
        <h1
          className="rise font-serif text-case leading-[0.98] tracking-[-0.035em]"
          style={delay(60)}
        >
          {study.title}
        </h1>
        <p
          className={`${COPY} ${MEASURE} rise mt-3 text-ink/60`}
          style={delay(140)}
        >
          {study.subtitle}
        </p>

        <RequestLink
          study={study}
          variant="link"
          className="rise mt-2"
          style={delay(180)}
        />
      </header>

      <div
        // Proportional like the rest of the phone layout, so the air holds up
        // when a phone renders the page on a wider canvas.
        className={`${WRAP} rise mt-[max(34px,9vw)] grid gap-[max(14px,3.7vw)] dt:mt-10 dt:grid-cols-4 dt:gap-4`}
        style={delay(200)}
      >
        {study.cards.map((card) => (
          <Card key={card.label} card={card} />
        ))}
      </div>

      {/* Full-bleed dark band: the one-paragraph version of the project. */}
      <section className="mt-[max(3rem,10vw)] bg-[linear-gradient(180deg,#23333f_0%,#151e25_45%,#06080b_100%)] py-[max(3rem,12vw)] text-paper dt:mt-20 dt:py-24">
        <div
          className={`${WRAP} grid items-center gap-[max(3.5rem,14vw)] dt:grid-cols-2 dt:gap-14`}
        >
          <div>
            {study.summary.kicker && (
              <p className={`${LABEL} mb-5 text-spark`}>
                {study.summary.kicker}
              </p>
            )}
            <p
              className={`${COPY} ${MEASURE_TIGHT} text-white [line-height:2]`}
            >
              {study.summary.body}
            </p>
            {study.summary.list && (
              <ol
                className={`${COPY} ${MEASURE_TIGHT} mt-2 space-y-1 text-white [line-height:2]`}
              >
                {study.summary.list.map((item, i) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-white/50">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {study.summary.panel ? (
            <Panel panel={study.summary.panel} />
          ) : (
            study.summary.shot && <Shot shot={study.summary.shot} dark />
          )}
        </div>
      </section>

      {study.sections?.map((section) => (
        <Section key={section.title} section={section} />
      ))}

      {study.timeline && <TimelineBand timeline={study.timeline} />}

      {study.reflection && <ReflectionBlock reflection={study.reflection} />}

      {study.outcome && (
        <section className="bg-[linear-gradient(180deg,#23333f_0%,#151e25_45%,#06080b_100%)] py-[max(3rem,12vw)] text-center text-paper dt:py-24">
          <div className={WRAP}>
            <p className="mx-auto max-w-[46rem] font-serif text-figure leading-[1.1] tracking-[-0.02em] text-spark">
              {study.outcome.figure} {study.outcome.caption}
            </p>
            <p className="mx-auto mt-8 max-w-[62ch] font-mono text-[clamp(0.95rem,4.2vw,2.6rem)] leading-relaxed text-white/80 hyphens-none dt:mt-10 dt:text-[1.15rem]">
              {study.outcome.body}
            </p>
          </div>
        </section>
      )}

      <div className={`${WRAP} py-[max(3rem,10vw)] text-center dt:py-20`}>
        <RequestLink study={study} />
      </div>

      <nav
        className={`${WRAP} flex items-start justify-between gap-6 border-t border-ink/15 pt-6 dt:pt-8`}
      >
        {prev ? (
          <StepLink
            to={`/work/${prev.slug}`}
            label="← Previous project"
            title={prev.title}
            align="left"
          />
        ) : (
          <StepLink to="/" label="Back to work" title="Home" align="left" />
        )}
        {next ? (
          <StepLink
            to={`/work/${next.slug}`}
            label="Next project →"
            title={next.title}
            align="right"
          />
        ) : (
          <StepLink to="/" label="Back to work" title="Home" align="right" />
        )}
      </nav>
    </article>
  );
}
