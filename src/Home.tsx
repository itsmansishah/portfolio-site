import { useState } from "react";
import { ABOUT, CONTACT, PROJECTS, type Project } from "./content";
import { LABEL, Link, SlashRule, delay } from "./ui";

/* ── hero ────────────────────────────────────────────────────────────── */

function Hero() {
  const [failed, setFailed] = useState(false);

  return (
    <header
      id="top"
      className="mx-auto grid max-w-[1100px] items-end gap-10 px-6 pt-10 sm:grid-cols-12 sm:pt-16"
    >
      {/* left: name, title, positioning line */}
      <div className="sm:col-span-7">
        <h1
          className="rise font-serif text-[clamp(2.5rem,8vw,3.75rem)] leading-[1.05] tracking-[-0.03em]"
          style={delay(60)}
        >
          Mansi Shah
        </h1>
        <p
          className="rise mt-2 font-serif text-[clamp(1.75rem,5vw,3rem)] leading-[1.05] tracking-[-0.03em]"
          style={delay(120)}
        >
          Product Designer @ Qualtrics
        </p>
        <p className={`${LABEL} rise mt-6 max-w-[34rem] leading-relaxed`} style={delay(200)}>
          UX designer focused on solving complex problems &amp; designing thoughtful experiences
          that make people feel seen
        </p>
      </div>

      {/* right: arch portrait, with a concentric outline arch behind it */}
      <div className="sm:col-span-5">
        <div className="relative ml-auto w-[min(88%,340px)]">
          <div
            aria-hidden="true"
            className="rise pointer-events-none absolute -inset-x-7 -top-7 bottom-0 rounded-t-[999px] border border-b-0 border-ink/30"
            style={delay(240)}
          />
          <div className="rise relative overflow-hidden rounded-t-[999px]" style={delay(260)}>
            {!failed ? (
              <img
                src="/portrait.jpg"
                alt="Mansi Shah"
                className="aspect-[3/4] w-full object-cover"
                style={{ objectPosition: "50% 22%" }}
                onError={() => setFailed(true)}
              />
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center bg-ink/5">
                <span className={`${LABEL} text-ink/40`}>[ portrait.jpg ]</span>
              </div>
            )}
          </div>

          {/* Say hello sits over the lower-right of the portrait */}
          <a
            href={`mailto:${CONTACT.email}`}
            className={`${LABEL} rise absolute bottom-5 right-4 rounded-full bg-accent px-5 py-3 text-ink shadow-md transition hover:brightness-95`}
            style={delay(420)}
          >
            Say hello
          </a>
        </div>
      </div>
    </header>
  );
}

/* ── work ────────────────────────────────────────────────────────────── */

function ProjectMock({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const fileName = `${project.name.replace(/[^A-Za-z0-9]+/g, "_").toUpperCase()}.PNG`;

  if (project.mockSrc && !failed) {
    return (
      <img
        src={project.mockSrc}
        alt={`${project.name} preview`}
        className="aspect-[16/10] w-full rounded-md border border-ink/15 object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex aspect-[16/10] w-full items-center justify-center rounded-md border border-ink/15 bg-ink/[0.04]">
      <span className={`${LABEL} text-ink/35`}>[ {fileName} ]</span>
    </div>
  );
}

const ACTION = `${LABEL} mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 hover:opacity-60`;

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="border-t border-ink/15 py-10 first:border-t-0 sm:py-14">
      <div className="grid gap-8 sm:grid-cols-12 sm:gap-10">
        {/* left: number, title, pills, blurb, action */}
        <div className="sm:col-span-5">
          <div className="flex items-baseline gap-4">
            <span className={`${LABEL} text-ink/40`}>{project.num}</span>
            <h3 className="font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight tracking-[-0.02em]">
              {project.name}
            </h3>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            {project.meta.map((m) => (
              <span key={m} className={`${LABEL} rounded-full bg-ink/[0.07] px-2.5 py-1 text-ink/70`}>
                {m}
              </span>
            ))}
            <span className={`${LABEL} rounded-full border border-ink/25 px-2.5 py-1 text-ink/70`}>
              {project.role}
            </span>
          </div>

          <p className="mt-6 max-w-[46ch] font-mono text-[13px] leading-relaxed text-ink/70">
            {project.blurb}
          </p>

          {project.caseStudySlug ? (
            <Link to={`/work/${project.caseStudySlug}`} className={ACTION}>
              Learn more <span aria-hidden="true">→</span>
            </Link>
          ) : project.caseStudyUrl ? (
            <a
              href={project.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={ACTION}
            >
              View case study <span aria-hidden="true">→</span>
            </a>
          ) : (
            <p className={`${LABEL} mt-6 text-ink/40`}>Case study coming soon</p>
          )}
        </div>

        {/* right: mock */}
        <div className="sm:col-span-7">
          <ProjectMock project={project} />
        </div>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1100px] px-6">
      <p className={`${LABEL} py-12 text-center text-ink/50`}>A sample of my work</p>
      {PROJECTS.map((p) => (
        <ProjectRow key={p.num} project={p} />
      ))}
    </section>
  );
}

/* ── about ───────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="mx-auto max-w-[1100px] px-6 py-20">
      <p className={`${LABEL} text-ink/50`}>About me</p>
      <div className="mt-8 grid gap-8 sm:grid-cols-12">
        <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[-0.02em] sm:col-span-5">
          {ABOUT.intro}
        </h2>
        <div className="space-y-5 font-mono text-[13px] leading-relaxed text-ink/75 sm:col-span-7">
          {ABOUT.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <div className="rise py-14" style={delay(480)}>
        <SlashRule />
      </div>

      <Work />

      <div className="py-14">
        <SlashRule />
      </div>

      <About />
    </>
  );
}
