import { useState } from "react";
import { ABOUT, CONTACT, PROJECTS, type Project } from "./content";
import { LABEL, Link, SlashRule, delay } from "./ui";

/* ── hero ────────────────────────────────────────────────────────────── */

function Hero() {
  const [failed, setFailed] = useState(false);

  return (
    <header
      id="top"
      className="mx-auto grid max-w-[1100px] items-end gap-8 px-6 pt-8 md:grid-cols-12 md:gap-10 md:pt-16"
    >
      {/* name, title, positioning line */}
      <div className="md:col-span-7">
        <h1
          className="rise font-serif text-[clamp(3.25rem,16vw,3.75rem)] leading-[1.02] tracking-[-0.03em]"
          style={delay(60)}
        >
          Mansi Shah
        </h1>
        {/* On a phone the title and line hug the right edge, playing against
            the left-set name — the desktop column stays left-aligned. */}
        <p
          className="rise mt-2 text-right font-serif text-[clamp(3.25rem,16vw,3.75rem)] leading-[1.02] tracking-[-0.03em] md:text-left md:text-[clamp(1.6rem,7vw,3rem)] md:leading-[1.08]"
          style={delay(120)}
        >
          Product Designer @ Qualtrics
        </p>
        {/* Wide letter-spacing reads as a wall of caps on a phone, so it
            tightens on mobile and opens back up on larger screens. */}
        <p
          className="rise ml-auto mt-5 max-w-[34rem] text-right font-mono text-[12px] font-medium uppercase leading-[1.7] tracking-[0.08em] md:ml-0 md:mt-6 md:text-left md:text-[11px] md:tracking-[0.18em]"
          style={delay(200)}
        >
          Senior UX designer that enjoys building the parts of software that quietly do the hard
          thinking for you, so using complex tools feels less like work and more like being
          understood.
        </p>
      </div>

      {/* arch portrait with a concentric outline arch behind it */}
      <div className="md:col-span-5">
        {/* Phone: the arch fills the column. Desktop: inset from the right
            edge so the outline (which extends past the photo) can't scroll. */}
        <div className="relative mt-6 w-full md:ml-auto md:mr-7 md:mt-0 md:w-[min(88%,340px)]">
          <div
            aria-hidden="true"
            className="rise pointer-events-none absolute -inset-x-5 -top-5 bottom-0 hidden rounded-t-[999px] border border-b-0 border-ink/30 md:-inset-x-7 md:-top-7 md:block"
            style={delay(240)}
          />
          <div className="rise relative overflow-hidden rounded-t-[999px]" style={delay(260)}>
            {!failed ? (
              <img
                src="/portrait.jpg"
                alt="Mansi Shah"
                className="aspect-[2/3] w-full object-cover md:aspect-[3/4]"
                style={{ objectPosition: "50% 22%" }}
                onError={() => setFailed(true)}
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center bg-ink/5 md:aspect-[3/4]">
                <span className={`${LABEL} text-ink/40`}>[ portrait.jpg ]</span>
              </div>
            )}
          </div>

          {/* Phone: pinned to the corner of the screen, always in reach.
              Desktop: tucked inside the portrait. */}
          <a
            href={`mailto:${CONTACT.email}`}
            className={`${LABEL} rise fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 whitespace-nowrap rounded-full bg-accent px-5 py-3 text-ink shadow-md transition hover:brightness-95 md:absolute md:bottom-5 md:right-4 md:z-auto`}
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
        // contain, not cover: these are UI mocks, so cropping the frame edges
        // (a toolbar, a button bar) does real damage.
        className="aspect-[16/10] w-full rounded-md border border-ink/15 bg-ink/[0.03] object-contain p-1.5"
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

// pt-3 enlarges the tap area upward without moving the underline.
const ACTION = `${LABEL} mt-3 inline-flex items-center gap-2 border-b border-ink pb-1 pt-3 hover:opacity-60`;

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="border-t border-ink/15 py-8 md:py-14">
      <div className="grid gap-5 md:grid-cols-12 md:gap-10">
        {/* Mobile: image first, like a card. Desktop: text left, mock right. */}
        <div className="md:order-last md:col-span-7">
          <ProjectMock project={project} />
        </div>

        <div className="md:col-span-5">
          {/* Phone: number left, name right on one line, as in the reference.
              Desktop: the serif title sits beside the number. */}
          <div className="flex items-baseline justify-between gap-4 md:justify-start md:gap-4">
            <span className={`${LABEL} text-ink/40`}>{project.num}</span>
            <h3 className="text-right font-mono text-[12px] font-medium uppercase tracking-[0.18em] md:text-left md:font-serif md:text-[clamp(1.6rem,7vw,2.25rem)] md:font-normal md:normal-case md:leading-tight md:tracking-[-0.02em]">
              {project.name}
            </h3>
          </div>

          {/* Pills and the blurb are desktop detail; the phone card stays a
              picture and a name. */}
          <div className="mt-3 hidden flex-wrap items-center gap-2 md:mt-4 md:flex md:gap-x-3">
            {project.meta.map((m) => (
              <span key={m} className={`${LABEL} rounded-full bg-ink/[0.07] px-2.5 py-1 text-ink/70`}>
                {m}
              </span>
            ))}
            <span className={`${LABEL} rounded-full border border-ink/25 px-2.5 py-1 text-ink/70`}>
              {project.role}
            </span>
          </div>

          <p className="mt-4 hidden max-w-[46ch] font-mono text-[13px] leading-relaxed text-ink/70 md:mt-6 md:block">
            {project.blurb}
          </p>

          <div className="flex flex-col items-end md:items-start">
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

          {project.links?.length ? (
            <ul className="flex flex-col items-end md:items-start">
              {project.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={ACTION}>
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1100px] px-6">
      <p className={`${LABEL} pb-5 text-center text-ink/50 md:py-12`}>A sample of my work</p>
      {PROJECTS.map((p) => (
        <ProjectRow key={p.num} project={p} />
      ))}
    </section>
  );
}

/* ── about ───────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="mx-auto max-w-[1100px] px-6 pb-14 pt-4 md:py-20">
      <p className={`${LABEL} text-ink/50`}>About me</p>
      <div className="mt-5 grid gap-6 md:mt-8 md:grid-cols-12 md:gap-8">
        <h2 className="font-serif text-[clamp(1.75rem,8vw,2.75rem)] leading-[1.1] tracking-[-0.02em] md:col-span-5">
          {/* Kept on one line so it can't split as "mahn- / see)" */}
          {ABOUT.intro} <span className="whitespace-nowrap">{ABOUT.pronunciation}</span>
        </h2>
        <div className="space-y-5 font-mono text-[13px] leading-relaxed text-ink/75 md:col-span-7">
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

      <div className="rise py-8 md:py-14" style={delay(480)}>
        <SlashRule />
      </div>

      <Work />

      <div className="py-8 md:py-14">
        <SlashRule />
      </div>

      <About />
    </>
  );
}
