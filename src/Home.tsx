import { useState } from "react";
import { ABOUT, CATEGORIES, CONTACT, PROJECTS, type Category, type Project } from "./content";
import { EmbedModal, LABEL, Link, delay, toEmbed, useHash, type Embed } from "./ui";

const WRAP = "mx-auto w-full max-w-[1100px] px-[var(--gutter)]";

/* ── hero ────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <header id="top" className={`${WRAP} pt-[max(2.5rem,10vw)] dt:pt-20`}>
      <h1
        className="rise font-serif text-display leading-[0.98] tracking-[-0.03em]"
        style={delay(60)}
      >
        Mansi Shah
      </h1>
      <p
        className="rise mt-1 font-serif text-[clamp(1.6rem,8vw,5rem)] italic leading-[1.05] tracking-[-0.02em] text-ink/50 dt:mt-2 dt:text-[2.5rem]"
        style={delay(120)}
      >
        Senior Product Designer
      </p>

      <p
        className="rise mt-[max(1.5rem,6vw)] max-w-[46ch] font-mono text-[clamp(0.875rem,3.9vw,2.6rem)] leading-[1.75] text-ink/70 dt:mt-7 dt:text-[1rem]"
        style={delay(200)}
      >
        As a UX designer, I love transforming complicated tools into intuitive experiences. I
        believe everyday software should make life feel a little lighter, easier, and much more
        human
      </p>

      {/* The status line, set as the pill from the wireframe. */}
      <p
        className="rise mt-[max(1.25rem,5vw)] inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-ink/[0.04] px-4 py-2 dt:mt-7"
        style={delay(240)}
      >
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-accent" />
        <span className={`${LABEL} text-ink/60`}>Based in New York</span>
      </p>
    </header>
  );
}

/* ── work ────────────────────────────────────────────────────────────── */

function ProjectMock({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  // With no mock yet, the placeholder drops the extension: a filename that
  // doesn't exist anywhere reads as a broken image rather than a gap.
  const slug = project.name.replace(/[^A-Za-z0-9]+/g, "_").toUpperCase();
  const fileName = project.mockSrc ? `${slug}.PNG` : slug;

  if (project.mockSrc && !failed) {
    return (
      <img
        src={project.mockSrc}
        alt={`${project.name} preview`}
        // contain, not cover: these are UI mocks, so cropping the frame edges
        // (a toolbar, a button bar) does real damage.
        className="aspect-[16/10] w-full rounded-lg border border-ink/15 bg-ink/[0.03] object-contain p-1.5"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg border border-ink/15 bg-ink/[0.04]">
      <span className={`${LABEL} text-ink/35`}>[ {fileName} ]</span>
    </div>
  );
}

// pt-3 enlarges the tap area upward without moving the underline.
const ACTION = `${LABEL} mt-3 inline-flex items-center gap-2 border-b border-ink pb-1 pt-3 hover:opacity-60`;

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

/** Wraps the thumbnail and the title so the whole card opens the project —
 *  internal case study, another page, external prototype, or nothing. */
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
  if (project.href) {
    return (
      <Link to={project.href} className={className}>
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

function ProjectCard({ project, onEmbed }: { project: Project; onEmbed: (e: Embed) => void }) {
  const external = !project.caseStudySlug && !!project.caseStudyUrl;
  const number = project.num.replace(/\D/g, "");

  return (
    <article className="flex min-w-0 flex-col">
      <ProjectLink
        project={project}
        onEmbed={onEmbed}
        className="block transition hover:opacity-90"
      >
        <ProjectMock project={project} />
      </ProjectLink>

      {/* "01 / QUALTRICS · LEAD DESIGNER" on the left, the year on the right. */}
      <div className="mt-[max(0.875rem,3.7vw)] flex items-baseline justify-between gap-4 dt:mt-4">
        <p className={`${LABEL} min-w-0 truncate text-ink/45`}>
          {number} / {project.company} · {project.role}
        </p>
        <p className={`${LABEL} shrink-0 text-ink/35`}>{project.year}</p>
      </div>

      <h3 className="mt-2 font-serif text-[clamp(1.45rem,6.2vw,4rem)] leading-tight tracking-[-0.02em] dt:text-[1.75rem]">
        <ProjectLink project={project} onEmbed={onEmbed} className="hover:opacity-60">
          {project.name}
          {external ? <span aria-hidden="true"> ↗</span> : null}
        </ProjectLink>
      </h3>

      {/* Clamped so four cards keep a common rhythm; the full story is a
          click away on the case study. */}
      <p className="mt-2.5 line-clamp-3 font-mono text-body leading-relaxed text-ink/65">
        {project.blurb}
      </p>

      <div className="mt-[max(0.875rem,3.7vw)] flex flex-wrap items-center gap-2 dt:mt-4">
        {project.meta.map((m) => (
          <span key={m} className={`${LABEL} rounded-full bg-ink/[0.07] px-2.5 py-1 text-ink/70`}>
            {m}
          </span>
        ))}
      </div>

      {project.links?.length ? (
        <ul className="flex flex-col items-start">
          {project.links.map((link) => (
            <li key={link.url}>
              <ExternalLink href={link.url} title={link.label} className={ACTION} onEmbed={onEmbed}>
                {link.label} <span aria-hidden="true">↗</span>
              </ExternalLink>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function WorkView() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [embed, setEmbed] = useState<Embed | null>(null);

  const count = (c: Category | "All") =>
    c === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === c).length;
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <>
      <Hero />

      <section id="work" className={`${WRAP} pt-[max(3rem,12vw)] dt:pt-24`}>
        <p className={`${LABEL} text-ink/45`}>A sample of my work</p>

        <div className="mt-[max(1.25rem,5vw)] flex flex-wrap items-center gap-2 dt:mt-6">
          <span className={`${LABEL} hidden pr-1 text-ink/35 dt:inline`}>Filter:</span>
          {(["All", ...CATEGORIES] as const).map((c) => {
            const active = filter === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={active}
                className={`${LABEL} rounded-full px-3 py-2 transition ${
                  active
                    ? "bg-ink text-paper"
                    : "bg-ink/[0.05] text-ink/60 hover:bg-ink/[0.09] hover:text-ink"
                }`}
              >
                {c} ({count(c)})
              </button>
            );
          })}
        </div>

        <div className="mt-[max(1.75rem,7vw)] grid gap-[max(2.75rem,11vw)] border-t border-ink/12 pt-[max(1.75rem,7vw)] dt:mt-8 dt:grid-cols-2 dt:gap-x-10 dt:gap-y-16 dt:pt-10">
          {shown.map((p) => (
            <ProjectCard key={p.num} project={p} onEmbed={setEmbed} />
          ))}
        </div>
      </section>

      <EmbedModal embed={embed} onClose={() => setEmbed(null)} />
    </>
  );
}

/* ── about ───────────────────────────────────────────────────────────── */

// "(pronounced mon-see)" splits into "(pronounced" and "mon-see)" so the
// second half can hold together on its own line.
const splitAt = ABOUT.pronunciation.lastIndexOf(" ");
const pronunciationLead = ABOUT.pronunciation.slice(0, splitAt);
const pronunciationTail = ABOUT.pronunciation.slice(splitAt + 1);

function Portrait() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative w-full dt:w-[min(100%,340px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-5 -top-5 bottom-0 hidden rounded-t-[999px] border border-b-0 border-ink/30 dt:-inset-x-7 dt:-top-7 dt:block"
      />
      <div className="relative overflow-hidden rounded-t-[999px]">
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

      <p
        className={`${LABEL} mt-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.04] px-3 py-1.5 text-ink/55`}
      >
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
        {ABOUT.caption}
      </p>
    </div>
  );
}

/** A labelled link in the dossier's action row. */
function Action({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="flex flex-col gap-1">
      <span className={`${LABEL} text-ink/35`}>{label}</span>
      {children}
    </span>
  );
}

function AboutView() {
  const link = `${LABEL} inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 hover:opacity-60`;

  return (
    <section id="about" className={`${WRAP} pt-[max(2.5rem,10vw)] dt:pt-20`}>
      {/* A — portrait and the bio as written */}
      <p className={`${LABEL} text-ink/45`}>About me</p>

      <div className="mt-[max(1.75rem,7vw)] grid gap-[max(2.25rem,9vw)] dt:mt-10 dt:grid-cols-12 dt:gap-12">
        <div className="dt:col-span-5">
          <Portrait />
        </div>

        <div className="dt:col-span-7">
          <h2 className="font-serif text-heading leading-[1.1] tracking-[-0.02em]">
            {/* Only the last word is held together, so a narrow column breaks
                before it rather than splitting "mon- / see)". */}
            {ABOUT.intro} {pronunciationLead}{" "}
            <span className="whitespace-nowrap">{pronunciationTail}</span>
          </h2>

          <div className="mt-[max(1.5rem,6vw)] space-y-5 font-mono text-body leading-relaxed text-ink/75 dt:mt-7">
            {ABOUT.body.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          <div className="mt-[max(2rem,8vw)] flex flex-wrap gap-x-10 gap-y-5 dt:mt-9">
            <Action label="Side Quests">
              <Link to="/races" className={link}>
                Race Receipts <span aria-hidden="true">→</span>
              </Link>
            </Action>
            <Action label="Mail">
              <a href={`mailto:${CONTACT.email}`} className={`${link} [overflow-wrap:anywhere]`}>
                {CONTACT.email}
              </a>
            </Action>
            <Action label="Connect">
              <a
                href={CONTACT.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                {CONTACT.linkedinLabel} <span aria-hidden="true">↗</span>
              </a>
            </Action>
            <Action label="Peek">
              <a href={CONTACT.resumeUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Resume <span aria-hidden="true">↗</span>
              </a>
            </Action>
          </div>
        </div>
      </div>

      {/* B — the ledger of what happens away from the screen */}
      <div className="pt-[max(3.5rem,14vw)] dt:pt-24">
        <p className={`${LABEL} text-ink/45`}>{ABOUT.grounded.title}</p>
        <div className="mt-[max(1.25rem,5vw)] grid gap-[max(0.875rem,3.7vw)] dt:mt-6 dt:grid-cols-3 dt:gap-5">
          {ABOUT.grounded.cards.map((card) => (
            <article
              key={card.title}
              className="flex min-w-0 flex-col rounded-xl border border-ink/12 bg-white/55 p-[max(18px,4.8vw)] dt:p-6"
            >
              <p className={`${LABEL} text-ink/40`}>{card.eyebrow}</p>
              <h3 className="mt-3 font-serif text-[clamp(1.35rem,5.8vw,3.5rem)] leading-tight tracking-[-0.02em] dt:text-[1.5rem]">
                {card.title}
              </h3>
              <p className="mt-3 font-mono text-body leading-relaxed text-ink/65">{card.body}</p>
            </article>
          ))}
        </div>
      </div>

      {/* C — where the work happened */}
      <div className="pt-[max(3.5rem,14vw)] dt:pt-24">
        <p className={`${LABEL} text-ink/45`}>{ABOUT.timeline.title}</p>
        <ol className="mt-[max(1.5rem,6vw)] space-y-[max(2rem,8vw)] border-l border-ink/15 dt:mt-8 dt:space-y-12">
          {ABOUT.timeline.roles.map((role) => (
            <li
              key={role.company}
              className="relative pl-[max(1.25rem,5vw)] dt:grid dt:grid-cols-12 dt:gap-8 dt:pl-10"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.55em] size-2.5 -translate-x-1/2 rounded-full border border-ink/25 bg-paper"
              />
              <p className={`${LABEL} text-ink/45 dt:col-span-3 dt:pt-2`}>
                {role.when}
                {role.where ? ` · ${role.where}` : ""}
              </p>
              <div className="dt:col-span-9">
                <h3 className="font-serif text-[clamp(1.5rem,6.5vw,4rem)] leading-tight tracking-[-0.02em] dt:text-[1.875rem]">
                  {role.company}
                </h3>
                <p className={`${LABEL} mt-2 text-ink/55`}>{role.role}</p>
                <p className="mt-3 max-w-[52ch] font-mono text-body leading-relaxed text-ink/65">
                  {role.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── page ────────────────────────────────────────────────────────────── */

export default function Home() {
  const hash = useHash();
  const about = hash === "#about";

  // pb clears the fixed "Say hello" pill that sits in the corner on a phone.
  return (
    <main className="pb-[max(5rem,20vw)] dt:pb-24">{about ? <AboutView /> : <WorkView />}</main>
  );
}
