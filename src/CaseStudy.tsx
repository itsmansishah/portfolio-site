import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CASE_STUDIES,
  CONTACT,
  type CaseStudy as CaseStudyType,
  type FactCard,
  type Section as SectionType,
  type Shot as ShotType,
} from "./content";
import { LABEL, Link, delay } from "./ui";

const WRAP = "mx-auto w-full max-w-[1100px] px-[var(--gutter)]";
const HEADING = "font-sans text-section font-semibold leading-[1.15] tracking-[-0.01em]";
const COPY = "font-mono text-body leading-relaxed";

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
            <div className="rounded-[16px] bg-white px-5 py-4 dt:px-7 dt:py-6">{img}</div>
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
      <span className={`${LABEL} ${dark ? "text-paper/40" : "text-ink/35"}`}>[ {shot.label} ]</span>
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
      const distance = band.getBoundingClientRect().right - rect.left + rect.width / 2;
      el.style.setProperty("--roll-x", `${Math.round(distance)}px`);
      el.style.setProperty("--roll-deg", `${Math.round((distance / (Math.PI * rect.width)) * 360)}deg`);
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
    const target = el.parentElement ?? el;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
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

function Card({ card }: { card: FactCard }) {
  return (
    <div className="rounded-xl bg-ink/[0.045] p-4 dt:p-5">
      <p className={`${LABEL} text-ink/40`}>{card.label}</p>

      {card.headline && (
        // Sized off the label step rather than with LABEL, so the two
        // font-size utilities can't fight over which one wins.
        <p className="mt-3 font-mono text-[calc(var(--text-label)*1.55)] font-medium uppercase leading-snug tracking-[0.08em]">
          {card.headline}
        </p>
      )}
      {card.meta && <p className={`${LABEL} mt-2 text-ink/40`}>{card.meta}</p>}

      {card.body && (
        <p className={`${COPY} mt-3 text-ink/70`}>
          {card.body}
          {card.emphasis && <strong className="font-medium text-ink">{card.emphasis}</strong>}
        </p>
      )}

      {card.items && (
        <ul className={`${COPY} mt-3 space-y-1 text-ink/70`}>
          {card.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-ink/35">
                ·
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Section({ section }: { section: SectionType }) {
  const copy = (
    <div>
      <h2 className={HEADING}>{section.title}</h2>
      <div className="mt-4 space-y-3">
        {section.body.map((para) => (
          <p key={para.slice(0, 24)} className={`${COPY} text-ink/70`}>
            {para}
          </p>
        ))}
      </div>
    </div>
  );

  if (section.layout === "wide") {
    return (
      <section className={`${WRAP} rise py-[max(3rem,10vw)] text-center dt:py-20`}>
        <div className="mx-auto max-w-[44rem]">{copy}</div>
        {section.shot && (
          <div className="mt-8 dt:mt-12">
            <Shot shot={section.shot} ratio="aspect-[16/9]" />
          </div>
        )}
      </section>
    );
  }

  const shotLeft = section.layout === "shot-left";

  return (
    <section className={`${WRAP} rise py-[max(3rem,10vw)] dt:py-20`}>
      <div className="grid items-center gap-8 dt:grid-cols-2 dt:gap-14">
        {/* The mock leads on a phone either way — a picture reads faster than
            a heading when the column is this narrow. */}
        <div className={shotLeft ? "" : "dt:order-last"}>
          {section.shot && <Shot shot={section.shot} />}
        </div>
        {copy}
      </div>
    </section>
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
    <Link to={to} className={`py-2 hover:opacity-60 ${align === "right" ? "text-right" : ""}`}>
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
  const next = i > -1 && i < CASE_STUDIES.length - 1 ? CASE_STUDIES[i + 1] : null;

  return (
    <article className="pb-[max(3rem,10vw)] dt:pb-16">
      <header className={`${WRAP} pt-[max(1rem,4vw)] dt:pt-10`}>
        <h1
          className="rise font-serif text-case leading-[0.98] tracking-[-0.035em]"
          style={delay(60)}
        >
          {study.title}
        </h1>
        <p className={`${COPY} rise mt-3 text-ink/60`} style={delay(140)}>
          {study.subtitle}
        </p>
      </header>

      <div
        className={`${WRAP} rise mt-8 grid gap-3 dt:mt-10 dt:grid-cols-4 dt:gap-4`}
        style={delay(200)}
      >
        {study.cards.map((card) => (
          <Card key={card.label} card={card} />
        ))}
      </div>

      {/* Full-bleed dark band: the one-paragraph version of the project. */}
      <section className="mt-[max(3rem,10vw)] bg-[linear-gradient(180deg,#23333f_0%,#151e25_45%,#06080b_100%)] py-[max(3rem,12vw)] text-paper dt:mt-20 dt:py-24">
        <div className={`${WRAP} grid items-center gap-10 dt:grid-cols-2 dt:gap-14`}>
          <p className={`${COPY} text-paper/75 [line-height:2]`}>{study.summary.body}</p>
          {study.summary.shot && <Shot shot={study.summary.shot} dark />}
        </div>
      </section>

      {study.sections?.map((section) => <Section key={section.title} section={section} />)}

      {study.outcome && (
        <section className="bg-[linear-gradient(180deg,#23333f_0%,#151e25_45%,#06080b_100%)] py-[max(3rem,12vw)] text-center text-paper dt:py-24">
          <div className={WRAP}>
            <p className="font-serif text-figure leading-none tracking-[-0.02em] text-spark">
              {study.outcome.figure}
            </p>
            <p className={`${COPY} mt-4 text-paper/70`}>{study.outcome.caption}</p>
            <p className={`${COPY} mx-auto mt-8 max-w-[44rem] text-paper/75`}>
              {study.outcome.body}
            </p>
          </div>
        </section>
      )}

      <div className={`${WRAP} py-[max(3rem,10vw)] text-center dt:py-20`}>
        <a
          href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
            `Request to see the ${study.title} case study`,
          )}`}
          className={`${LABEL} inline-flex items-center gap-2 rounded-full bg-accent px-[max(1.75rem,7vw)] py-[max(0.9rem,3.5vw)] text-ink transition hover:brightness-95 dt:px-9 dt:py-4`}
        >
          Request the full case study <span aria-hidden="true">→</span>
        </a>
      </div>

      <nav className={`${WRAP} flex items-start justify-between gap-6 border-t border-ink/15 pt-6 dt:pt-8`}>
        {prev ? (
          <StepLink to={`/work/${prev.slug}`} label="← Previous project" title={prev.title} align="left" />
        ) : (
          <StepLink to="/" label="Back to work" title="Home" align="left" />
        )}
        {next ? (
          <StepLink to={`/work/${next.slug}`} label="Next project →" title={next.title} align="right" />
        ) : (
          <StepLink to="/" label="Back to work" title="Home" align="right" />
        )}
      </nav>
    </article>
  );
}
