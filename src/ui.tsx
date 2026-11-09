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

/** The hash doubles as the home page's view switch (#work / #about), so it
 *  needs the same subscription the path has. */
export function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    listeners.push(update);
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    return () => {
      listeners = listeners.filter((l) => l !== update);
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);

  return hash;
}

/** Switches the home page between its two views. It deliberately doesn't go
 *  through navigate(): there is no anchor to seek, the whole page changes, so
 *  it lands at the top rather than smooth-scrolling to an element. */
export function goToView(hash: string) {
  if (window.location.pathname !== "/") {
    navigate(`/${hash}`);
    return;
  }
  if (window.location.hash !== hash) {
    window.history.pushState({}, "", `/${hash}`);
    listeners.forEach((l) => l());
  }
  // Instant, not smooth: the view has already swapped, so animating the
  // scroll would be a trip through content nobody asked to see.
  window.scrollTo({ top: 0, behavior: "instant" });
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
      // m-auto because the reset zeroes the margin a <dialog> centres itself
      // with, which pins it to the top-left corner.
      className="m-auto max-h-[92vh] w-[min(1100px,94vw)] overflow-hidden rounded-2xl bg-paper p-0 text-ink backdrop:bg-ink/80"
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

/* ── clips ───────────────────────────────────────────────────────────── */

/** A silent looping clip that doesn't fetch until it is near the viewport,
 *  and stops once it leaves — a video nobody can see is just battery. */
export function LazyClip({
  src,
  title,
  className,
  onError,
}: {
  src: string;
  title: string;
  className?: string;
  onError?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: load a frame to look at, and leave it alone.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.preload = "metadata";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      // A codec the browser can't decode errors out, so the caller can fall
      // back rather than leaving an empty frame.
      onError={onError}
      aria-label={`${title} preview`}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
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
  const path = usePath();
  const hash = useHash();
  const home = path === "/" || path === "";
  const view = home && hash === "#about" ? "about" : home ? "work" : null;

  // py-3 on the links (not the bar) gives each one a thumb-sized hit area.
  const seg = (active: boolean) =>
    `${LABEL} whitespace-nowrap rounded-full px-3 py-2.5 transition dt:px-3.5 ${
      active ? "bg-ink text-paper" : "text-ink/55 hover:text-ink"
    }`;

  // No display utility here: each use picks its own, so `hidden` can't lose a
  // specificity tie to an `inline-flex` baked into the shared string.
  const hello = `${LABEL} items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-paper transition hover:opacity-80`;

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-[var(--gutter)] py-2 dt:py-3">
          <Link to="/" className="shrink-0 whitespace-nowrap font-serif text-[clamp(1.1rem,4.6vw,1.6rem)] leading-none tracking-[-0.02em] hover:opacity-60">
            Mansi Shah
          </Link>

          <div className="flex items-center gap-2 dt:gap-3">
            {/* One segmented control, the way the wireframe has it: the two
                views sit in a single pill so the active one is obvious. */}
            <div className="flex shrink-0 items-center rounded-full border border-ink/12 bg-ink/[0.04] p-1">
              <a
                href="/#work"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  goToView("#work");
                }}
                aria-current={view === "work" ? "page" : undefined}
                className={seg(view === "work")}
              >
                Work
              </a>
              <a
                href="/#about"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  goToView("#about");
                }}
                aria-current={view === "about" ? "page" : undefined}
                className={seg(view === "about")}
              >
                About Me
              </a>
            </div>

            {/* On a phone this sits in the corner of the screen instead, so
                the bar keeps room for the name and the toggle. */}
            <a href={`mailto:${CONTACT.email}`} className={`${hello} hidden dt:inline-flex`}>
              Say hello <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </nav>

      {home && (
        <a
          href={`mailto:${CONTACT.email}`}
          className={`${hello} inline-flex dt:hidden fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[var(--gutter)] z-40 shadow-md`}
        >
          Say hello <span aria-hidden="true">↗</span>
        </a>
      )}
    </>
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
