import { useState } from "react";
import { CASE_STUDIES, CONTACT, type CaseStudy as CaseStudyType } from "./content";
import { LABEL, Link, delay } from "./ui";

function Shot({ src, label }: { src?: string; label: string }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={label}
        className="w-full rounded-md border border-ink/15"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex aspect-[16/9] w-full items-center justify-center rounded-md border border-ink/15 bg-ink/[0.04]">
      <span className={`${LABEL} text-ink/35`}>[ {label} ]</span>
    </div>
  );
}

/** Bottom-of-page step to the neighbouring case study. */
function StepLink({ study, dir }: { study: CaseStudyType; dir: "prev" | "next" }) {
  const next = dir === "next";
  return (
    <Link
      to={`/work/${study.slug}`}
      className={`group py-2 ${next ? "text-right" : ""} hover:opacity-60`}
    >
      <span className={`${LABEL} block text-ink/40`}>
        {next ? (
          <>Next project <span aria-hidden="true">→</span></>
        ) : (
          <><span aria-hidden="true">←</span> Previous project</>
        )}
      </span>
      <span className="mt-2 block font-serif text-[clamp(1.25rem,5vw,1.75rem)] leading-tight tracking-[-0.02em]">
        {study.title}
      </span>
    </Link>
  );
}

export default function CaseStudy({ study }: { study: CaseStudyType }) {
  const i = CASE_STUDIES.findIndex((s) => s.slug === study.slug);
  const prev = i > 0 ? CASE_STUDIES[i - 1] : null;
  const next = i > -1 && i < CASE_STUDIES.length - 1 ? CASE_STUDIES[i + 1] : null;

  return (
    <article className="mx-auto max-w-[1100px] px-6 pb-16 pt-4 dt:pb-24 dt:pt-10">
      <h1
        className="rise font-serif text-[clamp(2.6rem,12vw,6rem)] leading-[0.98] tracking-[-0.035em]"
        style={delay(60)}
      >
        {study.title}
      </h1>

      <div className="mt-8 grid gap-8 dt:mt-14 dt:grid-cols-12 dt:gap-12">
        {/* Mobile: the facts come first as a scannable table, so the essentials
            are visible before the story. Desktop: story left, facts two-up right. */}
        <dl
          className="rise grid grid-cols-1 dt:order-last dt:col-span-5 dt:grid-cols-2 dt:gap-x-10 dt:gap-y-8"
          style={delay(140)}
        >
          {study.facts.map((fact) => (
            <div
              key={fact.label}
              className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-ink/15 py-3 dt:block dt:border-0 dt:py-0"
            >
              <dt className={`${LABEL} text-ink/40`}>{fact.label}</dt>
              <dd className={`${LABEL} space-y-0.5 dt:mt-1`}>
                {fact.values.map((v) => (
                  <div key={v}>{v}</div>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <div className="rise dt:col-span-7" style={delay(220)}>
          <div className="space-y-6">
            {study.intro.map((para) => (
              <p key={para.slice(0, 28)} className="font-mono text-[13px] leading-relaxed text-ink/80">
                {para}
              </p>
            ))}
          </div>

          {study.highlights?.length ? (
            <section aria-labelledby="highlights" className="mt-10 dt:mt-12">
              <h2 id="highlights" className={`${LABEL} text-ink/40`}>
                Highlights
              </h2>
              <ul className="mt-4 space-y-3 font-mono text-[13px] leading-relaxed text-ink/80">
                {study.highlights.map((text) => (
                  <li key={text} className="flex gap-3">
                    {/* One line-height tall, so the star centres on the first line */}
                    <span aria-hidden="true" className="flex h-[1.625em] shrink-0 items-center">
                      <svg viewBox="0 0 10 10" className="size-2.5 fill-current">
                        <path d="M5 0 6.1 3.9 10 5 6.1 6.1 5 10 3.9 6.1 0 5 3.9 3.9Z" />
                      </svg>
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* The deck itself isn't public — this opens a note asking for it. */}
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
              `Request to see the ${study.title} case study`,
            )}`}
            className={`${LABEL} mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 pt-3 hover:opacity-60 dt:mt-10`}
          >
            Request to see full case study <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="rise mt-10 space-y-4 dt:mt-16 dt:space-y-6" style={delay(300)}>
        {study.shots.map((shot) => (
          <Shot key={shot.label} src={shot.src} label={shot.label} />
        ))}
      </div>

      <Link to="/" className={`${LABEL} mt-7 inline-flex items-center gap-2 py-3 hover:opacity-60 dt:mt-14`}>
        <span aria-hidden="true">←</span> Back to work
      </Link>

      {prev || next ? (
        // Each side keeps its edge whether or not the other one exists.
        <nav className="mt-8 flex items-start justify-between gap-6 border-t border-ink/15 pt-6 dt:mt-12 dt:pt-8">
          {prev ? <StepLink study={prev} dir="prev" /> : <span />}
          {next ? <StepLink study={next} dir="next" /> : <span />}
        </nav>
      ) : null}
    </article>
  );
}
