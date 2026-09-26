import { useLayoutEffect, useState, type CSSProperties } from "react";
import { LABEL, Link } from "../ui";
import MarathonReceipts from "./MarathonReceipts";

/** /races — the Race Receipts side project, linked from About. */
export default function RacesPage() {
  // The race picker sticks under the site nav on phones, so it needs the nav's
  // height. The site nav is the first <nav> on the page.
  const [navHeight, setNavHeight] = useState(0);
  useLayoutEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    const observer = new ResizeObserver(() => setNavHeight(nav.getBoundingClientRect().height));
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ "--mr-sticky-top": `${navHeight}px` } as CSSProperties}>
      <MarathonReceipts />
      <div className="mx-auto max-w-[1100px] px-[var(--gutter)] pb-14 dt:pb-20">
        <Link to="/#about" className={`${LABEL} inline-flex items-center gap-2 hover:opacity-60`}>
          <span aria-hidden="true">←</span> Back to about
        </Link>
      </div>
    </div>
  );
}
