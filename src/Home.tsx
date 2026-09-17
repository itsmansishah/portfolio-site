import { useState } from "react";
import { ABOUT, CONTACT, PROJECTS, type Project } from "./content";
import { LABEL, Link, SlashRule, delay } from "./ui";

/* ── hero ────────────────────────────────────────────────────────────── */

function Hero() {
  const [failed, setFailed] = useState(false);

  return (
    <header
      id="top"
      className="mx-auto grid max-w-[1100px] items-end gap-8 px-[var(--gutter)] pt-[max(2rem,8vw)] dt:grid-cols-12 dt:gap-10 dt:pt-16"
    >
      {/* name, title, positioning line */}
      <div className="dt:col-span-7">
        <h1
          className="rise font-serif text-display leading-[1.02] tracking-[-0.03em]"
          style={delay(60)}
        >
          Mansi Shah
        </h1>
        {/* On a phone the title and line hug the right edge, playing against
            the left-set name — the desktop column stays left-aligned. */}
        <p
          className="rise mt-2 text-right font-serif text-display leading-[1.02] tracking-[-0.03em] dt:text-left dt:text-[clamp(1.6rem,7vw,3rem)] dt:leading-[1.08]"
          style={delay(120)}
        >
          Product Designer @ Qualtrics
        </p>
        {/* Wide letter-spacing reads as a wall of caps on a phone, so it
            tightens on mobile and opens back up on larger screens. */}
        <p
          className="rise ml-auto mt-5 max-w-[34rem] text-right font-mono text-tag font-medium uppercase leading-[1.7] tracking-[0.08em] dt:ml-0 dt:mt-6 dt:max-w-[34rem] dt:text-left dt:text-label dt:tracking-[0.18em]"
          style={delay(200)}
        >
          Senior UX designer that enjoys building the parts of software that quietly do the hard
          thinking for you, so using complex tools feels less like work and more like being
          understood.
        </p>
      </div>

      {/* arch portrait with a concentric outline arch behind it */}
      <div className="dt:col-span-5">
        {/* Phone: the arch fills the column. Desktop: inset from the right
            edge so the outline (which extends past the photo) can't scroll. */}
        <div className="relative mt-[max(1.5rem,6vw)] w-full dt:ml-auto dt:mr-7 dt:mt-0 dt:w-[min(88%,340px)]">
          <div
            aria-hidden="true"
            className="rise pointer-events-none absolute -inset-x-5 -top-5 bottom-0 hidden rounded-t-[999px] border border-b-0 border-ink/30 dt:-inset-x-7 dt:-top-7 dt:block"
            style={delay(240)}
          />
          <div className="rise relative overflow-hidden rounded-t-[999px]" style={delay(260)}>
            {!failed ? (
              <img
                src="/portrait.jpg"
                alt="Mansi Shah"
                className="aspect-[2/3] w-full object-cover dt:aspect-[3/4]"
                style={{ objectPosition: "50% 22%" }}
                onError={() => setFailed(true)}
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center bg-ink/5 dt:aspect-[3/4]">
                <span className={`${LABEL} text-ink/40`}>[ portrait.jpg ]</span>
              </div>
            )}
          </div>

          {/* Phone: pinned to the corner of the screen, always in reach.
              Desktop: tucked inside the portrait. */}
          <a
            href={`mailto:${CONTACT.email}`}
            className={`${LABEL} rise fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[var(--gutter)] z-40 whitespace-nowrap rounded-full bg-accent px-[max(1.25rem,5vw)] py-[max(0.75rem,3vw)] text-ink shadow-md transition hover:brightness-95 dt:absolute dt:bottom-5 dt:right-4 dt:z-auto dt:px-5 dt:py-3`}
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

/** Wraps the mock and the title so the whole card opens the project —
 *  internal case study, external prototype, or nothing at all. */
function ProjectLink({
  project,
  className,
  children,
}: {
  project: Project;
  className?: string;
  children: React.ReactNode;
}) {
  if (project.caseStudySlug) {
    return (
      <Link to={`/work/${project.caseStudySlug}`} className={className}>
        {children}
      </Link>
    );
  }
  if (project.caseStudyUrl) {
    return (
      <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return <>{children}</>;
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="border-t border-ink/15 py-[max(2rem,8vw)] dt:py-14">
      <div className="grid gap-5 dt:grid-cols-12 dt:gap-10">
        {/* Mobile: image first, like a card. Desktop: text left, mock right. */}
        <div className="dt:order-last dt:col-span-7">
          <ProjectLink project={project} className="block transition hover:opacity-90">
            <ProjectMock project={project} />
          </ProjectLink>
        </div>

        <div className="dt:col-span-5">
          {/* Phone: number left, name right on one line, as in the reference.
              Desktop: the serif title sits beside the number. */}
          <div className="flex items-baseline justify-between gap-4 dt:justify-start dt:gap-4">
            <span className={`${LABEL} text-ink/40`}>{project.num}</span>
            <h3 className="text-right font-mono text-tag font-medium uppercase tracking-[0.18em] dt:text-left dt:font-serif dt:text-[clamp(1.6rem,7vw,2.25rem)] dt:font-normal dt:normal-case dt:leading-tight dt:tracking-[-0.02em]">
              <ProjectLink project={project} className="hover:opacity-60">
                {project.name}
              </ProjectLink>
            </h3>
          </div>

          {/* Pills and the blurb are desktop detail; the phone card stays a
              picture and a name. */}
          <div className="mt-3 hidden flex-wrap items-center gap-2 dt:mt-4 dt:flex dt:gap-x-3">
            {project.meta.map((m) => (
              <span key={m} className={`${LABEL} rounded-full bg-ink/[0.07] px-2.5 py-1 text-ink/70`}>
                {m}
              </span>
            ))}
            <span className={`${LABEL} rounded-full border border-ink/25 px-2.5 py-1 text-ink/70`}>
              {project.role}
            </span>
          </div>

          <p className="mt-4 hidden max-w-[46ch] font-mono text-body leading-relaxed text-ink/70 dt:mt-6 dt:block">
            {project.blurb}
          </p>

          <div className="flex flex-col items-end dt:items-start">
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
            <ul className="flex flex-col items-end dt:items-start">
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
    <section id="work" className="mx-auto max-w-[1100px] px-[var(--gutter)]">
      <p className={`${LABEL} pb-[max(1.25rem,5vw)] text-center text-ink/50 dt:py-12`}>A sample of my work</p>
      {PROJECTS.map((p) => (
        <ProjectRow key={p.num} project={p} />
      ))}
    </section>
  );
}

/* ── about ───────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="mx-auto max-w-[1100px] px-[var(--gutter)] pb-14 pt-4 dt:py-20">
      <p className={`${LABEL} text-ink/50`}>About me</p>
      <div className="mt-5 grid gap-6 dt:mt-8 dt:grid-cols-12 dt:gap-8">
        <h2 className="font-serif text-heading leading-[1.1] tracking-[-0.02em] dt:col-span-5">
          {/* Kept on one line so it can't split as "mahn- / see)" */}
          {ABOUT.intro} <span className="whitespace-nowrap">{ABOUT.pronunciation}</span>
        </h2>
        <div className="space-y-5 font-mono text-body leading-relaxed text-ink/75 dt:col-span-7">
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

      <div className="rise py-[max(2rem,8vw)] dt:py-14" style={delay(480)}>
        <SlashRule />
      </div>

      <Work />

      <div className="py-[max(2rem,8vw)] dt:py-14">
        <SlashRule />
      </div>

      <About />
    </>
  );
}
