import CaseStudy from "./CaseStudy";
import Home from "./Home";
import { CASE_STUDIES } from "./content";
import { Footer, LABEL, Link, Nav, usePath } from "./ui";

function NotFound() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-32">
      <h1 className="font-serif text-[clamp(2.5rem,8vw,4rem)] leading-tight tracking-[-0.03em]">
        Page not found
      </h1>
      <Link to="/" className={`${LABEL} mt-8 inline-flex items-center gap-2 hover:opacity-60`}>
        <span aria-hidden="true">←</span> Back to work
      </Link>
    </div>
  );
}

export default function App() {
  const path = usePath();
  const slug = path.startsWith("/work/") ? path.slice("/work/".length).replace(/\/$/, "") : null;
  const study = slug ? CASE_STUDIES.find((s) => s.slug === slug) : null;

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <Nav />
      {path === "/" || path === "" ? <Home /> : study ? <CaseStudy study={study} /> : <NotFound />}
      <Footer />
    </div>
  );
}
