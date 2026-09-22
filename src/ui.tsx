import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { CONTACT } from "./content";

export const LABEL = "font-mono text-label font-medium uppercase tracking-[0.18em]";

export const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/* ── tiny router ─────────────────────────────────────────────────────────
   Three pages don't justify a routing dependency. This drives the History
   API directly and re-renders on pushState/popstate. */

let listeners: Array<() => void> = [];

export function navigate(to: string) {
  const [pathPart, hash] = to.split("#");
  const targetPath = pathPart || "/";
  if (to === window.location.pathname + window.location.hash) return;

  // Captured before pushState, which would otherwise make every jump look
  // same-page and always smooth-scroll.
  const samePage = targetPath === window.location.pathname;

  window.history.pushState({}, "", to);
  listeners.forEach((l) => l());

  if (hash) {
    // Wait for the destination page to render before seeking the anchor.
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: samePage ? "smooth" : "auto" });
      else window.scrollTo(0, 0);
    });
  } else {
    window.scrollTo(0, 0);
  }
}

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    listeners.push(update);
    window.addEventListener("popstate", update);
    return () => {
      listeners = listeners.filter((l) => l !== update);
      window.removeEventListener("popstate", update);
    };
  }, []);

  return path;
}

/** Internal link: keeps normal anchor semantics (real href, middle-click,
 *  cmd-click, right-click all work) but routes in-page on a plain click. */
export function Link({
  to,
  className,
  style,
  children,
}: {
  to: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to);
    },
    [to],
  );

  return (
    <a href={to} onClick={onClick} className={className} style={style}>
      {children}
    </a>
  );
}

/* ── embeds ──────────────────────────────────────────────────────────── */

export type Embed = { title: string; src: string; href: string; tall: boolean };

/** Turns a shared Drive or Figma link into something that can sit in an
 *  iframe. Anything else stays a plain link. */
export function toEmbed(title: string, href: string): Embed | null {
  const drive = href.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (drive) {
    return { title, href, src: `https://drive.google.com/file/d/${drive[1]}/preview`, tall: false };
  }

  if (href.includes("figma.com/proto/")) {
    const url = new URL(href);
    url.hostname = "embed.figma.com";
    url.searchParams.set("embed-host", "itsmemansii");
    return { title, href, src: url.toString(), tall: true };
  }

  return null;
}

/** A plain <dialog>, so Esc, the backdrop and focus handling come for free.
 *  The iframe mounts only while open, so nothing loads until asked for. */
export function EmbedModal({ embed, onClose }: { embed: Embed | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (embed && !dialog.open) dialog.showModal();
    if (!embed && dialog.open) dialog.close();
  }, [embed]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      // Clicks land on the dialog itself only when they miss the panel.
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className="w-[min(1100px,94vw)] rounded-2xl bg-paper p-0 text-ink backdrop:bg-ink/80"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <p className={`${LABEL} truncate text-ink/50`}>{embed?.title}</p>
        <div className="flex shrink-0 items-center gap-5">
          {embed && (
            <a href={embed.href} target="_blank" rel="noopener noreferrer" className={`${LABEL} hover:opacity-60`}>
              Open <span aria-hidden="true">↗</span>
            </a>
          )}
          <button type="button" onClick={() => ref.current?.close()} className={`${LABEL} hover:opacity-60`}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>

      {embed && (
        <iframe
          key={embed.src}
          src={embed.src}
          title={embed.title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className={`w-full border-0 bg-ink/[0.04] ${embed.tall ? "h-[min(72vh,760px)]" : "aspect-video"}`}
        />
      )}
    </dialog>
  );
}

/* ── shared chrome ───────────────────────────────────────────────────── */

export function SlashRule() {
  return (
    <div
      aria-hidden="true"
      className="select-none overflow-hidden whitespace-nowrap font-mono text-body leading-none text-ink/25"
    >
      {"/ ".repeat(220)}
    </div>
  );
}

export function Nav() {
  // py-3 on the links (not the bar) gives each one a thumb-sized hit area.
  const link = `${LABEL} inline-block py-3 hover:opacity-60`;

  return (
    <nav className="sticky top-0 z-30 bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-[var(--gutter)] dt:py-2">
        <Link to="/" className={link}>
          Mansi Shah
        </Link>
        <Link to="/#work" className={link}>
          Work
        </Link>
        <Link to="/#about" className={link}>
          About Me
        </Link>
      </div>
    </nav>
  );
}

function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    // Phone: label stacked over its link. Desktop: the two sit on one
    // right-aligned row, as in the reference.
    <div className="flex flex-col items-end gap-1 py-2 dt:flex-row dt:items-baseline dt:justify-end dt:gap-6 dt:py-0">
      <span className={`${LABEL} text-paper/40`}>{label}</span>
      {children}
    </div>
  );
}

export function Footer() {
  const linkClass =
    "block font-serif text-link leading-tight tracking-[-0.02em] [overflow-wrap:anywhere] hover:opacity-60 dt:inline";

  return (
    <footer className="px-[var(--gutter)] pb-6 dt:pb-10">
      <div className="mx-auto max-w-[1100px] rounded-2xl bg-ink px-[var(--gutter)] py-[max(2.5rem,10vw)] text-paper dt:px-12 dt:py-20">
        <h2 className="text-right font-serif text-heading leading-tight tracking-[-0.02em] dt:text-[clamp(1.9rem,8vw,3rem)]">
          Let&rsquo;s work together!
        </h2>

        <div className="mt-6 dt:mt-10 dt:space-y-3">
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

        <div className={`${LABEL} mt-10 space-y-1 text-right text-paper/45 dt:mt-20`}>
          <p>Designed by Mansi</p>
          <p>It&rsquo;s pronounced like monster</p>
          <p>&reg;{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
