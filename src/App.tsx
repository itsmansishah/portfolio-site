import FilingCabinet from "./components/FilingCabinet";

export default function App() {
  return (
    <div className="bg-[#EEEEE8] text-[#111111] min-h-screen">
      <header className="pt-16 pb-6 text-center px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/50 mb-4">
          // portfolio — v1.0
        </p>
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">MANSI SHAH</h1>
        <p className="mt-4 text-[15px] text-black/55">UX Designer — product, systems, research</p>
      </header>

      <FilingCabinet />

      <footer className="border-t border-black/10 py-20 px-6">
        <p className="max-w-xl mx-auto mb-4 font-mono text-[11px] tracking-[0.3em] uppercase text-black/50">
          say hello!
        </p>
        <div className="max-w-xl mx-auto bg-[#111111] text-[#F4F4F0] rounded-sm px-8 py-8">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="font-mono text-[11px] text-white/40 ml-2">~/say-hello</span>
          </div>
          <div className="space-y-2 font-mono text-[13px]">
            <a href="mailto:mansishah120@gmail.com" className="flex justify-between gap-4 hover:text-white/60">
              <span className="text-white/50">email</span>
              <span>mansishah120@gmail.com</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mansishah120/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between gap-4 hover:text-white/60"
            >
              <span className="text-white/50">linkedin</span>
              <span>/in/mansishah120/</span>
            </a>
            <a
              href="/Mansi_Shah_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between gap-4 hover:text-white/60"
            >
              <span className="text-white/50">resume</span>
              <span>Mansi_Shah_Resume.pdf</span>
            </a>
          </div>
        </div>
        <p className="mt-8 text-center font-mono text-[11px] text-black/40">
          © 2026 Mansi Shah. Built with React, Tailwind &amp; Framer Motion.
        </p>
      </footer>
    </div>
  );
}
