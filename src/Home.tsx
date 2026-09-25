import { useState } from "react";
import { ABOUT, CONTACT, PROJECTS, type Project } from "./content";
import { EmbedModal, LABEL, Link, SlashRule, delay, toEmbed, type Embed } from "./ui";

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
          Senior Product Designer
        </p>
        {/* Wide letter-spacing reads as a wall of caps on a phone, so it
            tightens on mobile and opens back up on larger screens. */}
        <p
          className="rise ml-auto mt-5 max-w-[34rem] text-right font-mono text-tag font-medium uppercase leading-[1.7] tracking-[0.08em] dt:ml-0 dt:mt-6 dt:max-w-[34rem] dt:text-left dt:text-label dt:tracking-[0.18em]"
          style={delay(200)}
        >
          As a UX designer, I love transforming complicated tools into intuitive experiences. I
          believe everyday software should make life feel a little lighter, easier, and much more
          human
        </p>

        <p
          className={`${LABEL} rise ml-auto mt-4 text-right text-ink/50 dt:ml-0 dt:text-left`}
          style={delay(230)}
        >
          {/* Its own line on a phone, one line on desktop. */}
          Currently @ Qualtrics. <span className="block dt:inline">Based in New York.</span>
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
  onEmbed,
  children,
}: {
  project: Project;
  className?: string;
  onEmbed: (embed: Embed) => void;
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
      <ExternalLink
        href={project.caseStudyUrl}
        title={`${project.name} — prototype`}
        className={className}
        onEmbed={onEmbed}
      >
        {children}
      </ExternalLink>
    );
  }
  return <>{children}</>;
}

/** Opens Drive and Figma links in the modal, but stays a real link: a
 *  modified click, or anything that can't be embedded, behaves normally. */
function ExternalLink({
  href,
  title,
  className,
  onEmbed,
  children,
}: {
  href: string;
  title: string;
  className?: string;
  onEmbed: (embed: Embed) => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const embed = toEmbed(title, href);
        if (!embed) return;
        e.preventDefault();
        onEmbed(embed);
      }}
    >
      {children}
    </a>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const [embed, setEmbed] = useState<Embed | null>(null);

  return (
    <article className="border-t border-ink/15 py-[max(2rem,8vw)] dt:py-14">
      <div className="grid gap-5 dt:grid-cols-12 dt:gap-10">
        {/* Mobile: image first, like a card. Desktop: text left, mock right. */}
        <div className="dt:order-last dt:col-span-7">
          <ProjectLink project={project} onEmbed={setEmbed} className="block transition hover:opacity-90">
            <ProjectMock project={project} />
          </ProjectLink>
        </div>

        <div className="dt:col-span-5">
          {/* The name sits beside the number at every size. */}
          <div className="flex items-baseline gap-3 dt:gap-4">
            <span className={`${LABEL} text-ink/40`}>{project.num}</span>
            <h3 className="font-mono text-tag font-medium uppercase tracking-[0.18em] dt:font-serif dt:text-[clamp(1.6rem,7vw,2.25rem)] dt:font-normal dt:normal-case dt:leading-tight dt:tracking-[-0.02em]">
              <ProjectLink project={project} onEmbed={setEmbed} className="hover:opacity-60">
                {project.name}
              </ProjectLink>
            </h3>
          </div>

          {/* Phone: a little extra air either side of the pills. */}
          <div className="mt-[max(1rem,4.27vw)] flex flex-wrap items-center gap-2 dt:mt-4 dt:gap-x-3">
            {project.meta.map((m) => (
              <span key={m} className={`${LABEL} rounded-full bg-ink/[0.07] px-2.5 py-1 text-ink/70`}>
                {m}
              </span>
            ))}
            <span className={`${LABEL} rounded-full border border-ink/25 px-2.5 py-1 text-ink/70`}>
              {project.role}
            </span>
          </div>

          <p className="mt-[max(1.25rem,5.3vw)] max-w-[46ch] font-mono text-body leading-relaxed text-ink/70 dt:mt-6">
            {project.blurb}
          </p>

          <div className="flex flex-col items-start">
            {project.caseStudySlug ? (
            <Link to={`/work/${project.caseStudySlug}`} className={ACTION}>
              Learn more <span aria-hidden="true">→</span>
            </Link>
          ) : project.caseStudyUrl ? (
            <ExternalLink
              href={project.caseStudyUrl}
              title={`${project.name} — prototype`}
              className={ACTION}
              onEmbed={setEmbed}
            >
              View case study <span aria-hidden="true">→</span>
            </ExternalLink>
          ) : (
              <p className={`${LABEL} mt-6 text-ink/40`}>Case study coming soon</p>
            )}
          </div>

          {project.links?.length ? (
            <ul className="flex flex-col items-start">
              {project.links.map((link) => (
                <li key={link.url}>
                  <ExternalLink
                    href={link.url}
                    title={link.label}
                    className={ACTION}
                    onEmbed={setEmbed}
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <EmbedModal embed={embed} onClose={() => setEmbed(null)} />
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
