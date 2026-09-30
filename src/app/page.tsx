import Link from "next/link";
import { getAllTemplates } from "@/templates/registry";
import { samplePortfolioData } from "@/templates/sample-data";
import { buildHtmlDocument } from "@/lib/document";

export default function HomePage() {
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* ── Navigation Header ── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-white">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-mono text-sm">
              PB
            </span>
            <span>Portfolio Builder</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/edit"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Edit Portfolio
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm shadow-indigo-600/30"
            >
              Start Building
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pure Static HTML • Zero Accounts • Free ZIP Export</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Build your personal portfolio in{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
              minutes
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Pick a handcrafted template, fill in your details with instant live preview,
            and publish or download your static self-hosting bundle.
          </p>
        </section>

        {/* ── Template Cards Section ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Choose your design</h2>
              <p className="text-sm text-slate-400 mt-1">
                Both templates are responsive, accessible, and include dark mode.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {templates.map((tpl) => {
              const previewDoc = buildHtmlDocument(tpl, samplePortfolioData, {
                assetBase: "/uploads",
                title: `${tpl.name} Preview`,
              });

              return (
                <div
                  key={tpl.id}
                  className="group relative flex flex-col bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden hover:border-indigo-500/60 transition-all duration-300 shadow-xl shadow-black/20"
                >
                  {/* Scaled Preview Frame */}
                  <div className="relative w-full h-[340px] sm:h-[400px] bg-slate-950 overflow-hidden border-b border-slate-700/70">
                    <div className="absolute inset-0 pointer-events-none select-none">
                      <iframe
                        srcDoc={previewDoc}
                        title={`${tpl.name} live preview`}
                        sandbox="allow-scripts"
                        tabIndex={-1}
                        aria-hidden="true"
                        className="w-[1024px] h-[768px] origin-top-left transform scale-[0.38] sm:scale-[0.48] md:scale-[0.55] lg:scale-[0.45] xl:scale-[0.52] border-0"
                      />
                    </div>

                    {/* Subtle hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-900/90 text-slate-200 border border-slate-700 backdrop-blur shadow">
                        {tpl.id === "template-a" ? "Modern Clean" : "Neo-Pop Brutalist"}
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Action */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {tpl.name}
                      </h3>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <span className="text-xs font-medium text-slate-400">
                        {tpl.id === "template-a"
                          ? "Pill tags • Soft gradients • System font"
                          : "Hard drop shadows • Tape stickers • Dual theme"}
                      </span>
                      <Link
                        href={`/create?template=${tpl.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 group-hover:translate-x-0.5"
                      >
                        <span>Use Template</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Feature Highlights ── */}
        <section className="border-t border-slate-800 bg-slate-950/50 py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="text-base font-bold text-white mb-2">Instant Live Preview</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Watch your portfolio update as you type. Scoped CSS and sandboxed iframes ensure zero style leaking.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl mb-3">📦</div>
              <h3 className="text-base font-bold text-white mb-2">Self-Hostable Static ZIP</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Download your complete website with clean HTML, CSS, and optimized WebP assets. Host anywhere for free.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="text-base font-bold text-white mb-2">No Accounts or Trackers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                No sign-ups, subscriptions, or cookies. Edit anytime with a secure one-time secret token.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Portfolio Builder. Free and open source.</p>
          <div className="flex items-center gap-4">
            <Link href="/create" className="hover:text-slate-400 transition-colors">
              Create Portfolio
            </Link>
            <span>•</span>
            <Link href="/edit" className="hover:text-slate-400 transition-colors">
              Edit Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
