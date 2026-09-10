import { useState } from "react";
import { ABOUT, CONTACT, PROJECTS, type Project } from "./content";

/* ── shared bits ─────────────────────────────────────────────────────── */

const LABEL = "font-mono text-[11px] font-medium uppercase tracking-[0.18em]";

// The repeating hairline rule used between sections on the reference site.
function SlashRule() {
  return (
    <div
      aria-hidden="true"
      className="select-none overflow-hidden whitespace-nowrap font-mono text-[13px] leading-none text-ink/25"
    >
      {"/ ".repeat(220)}
    </div>
  );
}

/* ── nav ─────────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <nav className="sticky top-0 z-30 bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
        <a href="#top" className={`${LABEL} hover:opacity-60`}>
          Mansi Shah
        </a>
        <a href="#work" className={`${LABEL} hidden hover:opacity-60 sm:block`}>
          Work
        </a>
        <a href="#about" className={`${LABEL} hover:opacity-60`}>
          About Me
        </a>
      </div>
    </nav>
  );
}

/* ── hero ────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <header id="top" className="mx-auto max-w-[1100px] px-6 pt-10 sm:pt-16">
      <h1 className="font-serif text-[clamp(2.5rem,8vw,3.75rem)] leading-[1.05] tracking-[-0.03em]">
        Mansi Shah
      </h1>
      <p className="mt-2 text-right font-serif text-[clamp(1.75rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.03em]">
        Product Designer @ Qualtrics
      </p>
      <p className={`${LABEL} ml-auto mt-6 max-w-[34rem] text-right leading-relaxed`}>
        UX designer focused on solving complex problems &amp; designing thoughtful experiences that
        make people feel seen
      </p>
    </header>
  );
}

/* ── arch portrait ───────────────────────────────────────────────────── */

function ArchPortrait() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mx-auto mt-14 max-w-[1100px] px-6">
      {/* the thin outline arch that sits behind and wider than the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-0 top-0 rounded-t-[999px] border border-ink/35 border-b-0"
      />
      <div className="relative mx-auto w-[min(52%,420px)] overflow-hidden rounded-t-[999px]">
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
    </div>
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

function ProjectRow({ project }: { project: Project }) {
  const hasCaseStudy = Boolean(project.caseStudyUrl);

  return (
    <article className="border-t border-ink/15 py-10 first:border-t-0 sm:py-14">
      <div className="grid gap-8 sm:grid-cols-12 sm:gap-10">
        {/* left: number + title + link */}
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

          {hasCaseStudy ? (
            <a
              href={project.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${LABEL} mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 hover:opacity-60`}
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

/* ── footer ──────────────────────────────────────────────────────────── */

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-end gap-6">
      <span className={`${LABEL} text-paper/40`}>{label}</span>
      {children}
    </div>
  );
}

function Footer() {
  const linkClass =
    "font-serif text-[clamp(1.5rem,4vw,2.5rem)] leading-tight tracking-[-0.02em] hover:opacity-60";

  return (
    <footer className="px-6 pb-10">
      <div className="mx-auto max-w-[1100px] rounded-2xl bg-ink px-6 py-14 text-paper sm:px-12 sm:py-20">
        <h2 className="text-right font-serif text-[clamp(1.75rem,5vw,3rem)] leading-tight tracking-[-0.02em]">
          Let&rsquo;s work together!
        </h2>

        <div className="mt-10 space-y-3">
          <ContactRow label="Mail">
            <a href={`mailto:${CONTACT.email}`} className={linkClass}>
              {CONTACT.email}
            </a>
          </ContactRow>
          <ContactRow label="Peek">
            <a href={CONTACT.resumeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Resume
            </a>
          </ContactRow>
          <ContactRow label="Connect">
            <a
              href={CONTACT.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {CONTACT.linkedinLabel}
            </a>
          </ContactRow>
        </div>

        <div className={`${LABEL} mt-20 space-y-1 text-right text-paper/45`}>
          <p>Designed by Mansi</p>
          <p>It&rsquo;s pronounced like monster</p>
          <p>&reg;{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}

/* ── page ────────────────────────────────────────────────────────────── */

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <Hero />
      <ArchPortrait />

      <div className="py-14">
        <SlashRule />
      </div>

      <Work />

      <div className="py-14">
        <SlashRule />
      </div>

      <About />
      <Footer />

      <a
        href={`mailto:${CONTACT.email}`}
        className={`${LABEL} fixed bottom-6 right-6 z-40 rounded-full bg-accent px-5 py-3 text-ink shadow-lg transition hover:brightness-95`}
      >
        Say hello
      </a>
    </div>
  );
}
