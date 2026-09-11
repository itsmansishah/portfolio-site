import { useState } from "react";
import type { CaseStudy as CaseStudyType } from "./content";
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

export default function CaseStudy({ study }: { study: CaseStudyType }) {
  return (
    <article className="mx-auto max-w-[1100px] px-6 pb-16 pt-4 md:pb-24 md:pt-10">
      <h1
        className="rise font-serif text-[clamp(2.6rem,12vw,6rem)] leading-[0.98] tracking-[-0.035em]"
        style={delay(60)}
      >
        {study.title}
      </h1>

      <div className="mt-8 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-12">
        {/* Mobile: the facts come first as a scannable table, so the essentials
            are visible before the story. Desktop: story left, facts two-up right. */}
        <dl
          className="rise grid grid-cols-1 md:order-last md:col-span-5 md:grid-cols-2 md:gap-x-10 md:gap-y-8"
          style={delay(140)}
        >
          {study.facts.map((fact) => (
            <div
              key={fact.label}
              className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-ink/15 py-3 md:block md:border-0 md:py-0"
            >
              <dt className={`${LABEL} text-ink/40`}>{fact.label}</dt>
              <dd className={`${LABEL} space-y-0.5 md:mt-1`}>
                {fact.values.map((v) => (
                  <div key={v}>{v}</div>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <div className="rise md:col-span-7" style={delay(220)}>
          <div className="space-y-6">
            {study.intro.map((para) => (
              <p key={para.slice(0, 28)} className="font-mono text-[13px] leading-relaxed text-ink/80">
                {para}
              </p>
            ))}
          </div>

          {study.highlights?.length ? (
            <section aria-labelledby="highlights" className="mt-10 md:mt-12">
              <h2 id="highlights" className={`${LABEL} text-ink/40`}>
                Highlights
              </h2>
              <ul className="mt-4 space-y-5">
                {study.highlights.map((h) => (
                  <li key={h.text} className="flex items-baseline gap-4 md:gap-6">
                    {h.value && (
                      <span className="shrink-0 font-serif text-[clamp(2.75rem,11vw,4rem)] leading-none tracking-[-0.03em]">
                        {h.value}
                      </span>
                    )}
                    <p className="font-mono text-[13px] leading-relaxed text-ink/80">{h.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <div className="rise mt-10 space-y-4 md:mt-16 md:space-y-6" style={delay(300)}>
        {study.shots.map((shot) => (
          <Shot key={shot.label} src={shot.src} label={shot.label} />
        ))}
      </div>

      <Link to="/" className={`${LABEL} mt-7 inline-flex items-center gap-2 py-3 hover:opacity-60 md:mt-14`}>
        <span aria-hidden="true">←</span> Back to work
      </Link>
    </article>
  );
}
