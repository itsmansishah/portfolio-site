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
    <article className="mx-auto max-w-[1100px] px-6 pb-24 pt-6 sm:pt-10">
      <h1
        className="rise font-serif text-[clamp(2.75rem,10vw,6rem)] leading-[0.95] tracking-[-0.035em]"
        style={delay(60)}
      >
        {study.title}
      </h1>

      <div className="mt-14 grid gap-10 sm:grid-cols-12 sm:gap-12">
        {/* intro copy */}
        <div className="rise space-y-6 sm:col-span-7" style={delay(140)}>
          {study.intro.map((para) => (
            <p key={para.slice(0, 28)} className="font-mono text-[13px] leading-relaxed text-ink/80">
              {para}
            </p>
          ))}
        </div>

        {/* facts, flowing two-up */}
        <dl className="rise grid grid-cols-2 gap-x-10 gap-y-8 sm:col-span-5" style={delay(220)}>
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <dt className={`${LABEL} text-ink/40`}>{fact.label}</dt>
              <dd className={`${LABEL} mt-1 space-y-0.5`}>
                {fact.values.map((v) => (
                  <div key={v}>{v}</div>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rise mt-16 space-y-6" style={delay(300)}>
        {study.shots.map((shot) => (
          <Shot key={shot.label} src={shot.src} label={shot.label} />
        ))}
      </div>

      <Link to="/" className={`${LABEL} mt-16 inline-flex items-center gap-2 hover:opacity-60`}>
        <span aria-hidden="true">←</span> Back to work
      </Link>
    </article>
  );
}
