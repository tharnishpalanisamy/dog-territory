
import { useState } from "react";

const heroImage =
  "https://images.unsplash.com/photo-1774013825156-9c941be0a45c?auto=format&fit=crop&fm=jpg&q=85&w=1600";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="text-xl font-bold tracking-tight">
            🐾 Dog Territory
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#home" className="hover:text-indigo-600">
              Home
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600">
              How it works
            </a>
            <a href="#about" className="hover:text-indigo-600">
              About
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/signin"
              className="rounded-lg px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Sign in
            </a>

            <a
              href="/signup"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Get started
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-6 py-5 md:hidden">
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="/signin" onClick={closeMenu}>Sign in</a>
            <a
              href="/signup"
              onClick={closeMenu}
              className="rounded-lg bg-indigo-600 px-4 py-3 text-center font-semibold text-white"
            >
              Get started
            </a>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section
          id="home"
          className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24"
        >
          <div>
            <span className="mb-5 inline-block rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
              Community powered · Animal welfare
            </span>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Every street dog deserves to be{" "}
              <span className="text-indigo-600">seen.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-500">
              Discover, report and track street dogs in your community.
              Together, we can build safer streets and better lives for
              our four-legged neighbours.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/signup"
                className="rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Get started →
              </a>

              <a
                href="/signin"
                className="rounded-xl border border-slate-200 px-6 py-3.5 font-semibold transition hover:bg-slate-50"
              >
                Sign in
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              Made for communities. Built for every street dog. ❤️
            </p>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Indian street dog sitting on a neighbourhood street"
              className="h-[340px] w-full rounded-3xl object-cover shadow-xl sm:h-[460px]"
            />

            <div className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-sm font-bold text-slate-900">
                Every life matters.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                One community at a time.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="bg-slate-50 px-6 py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How Dog Territory works
              </h2>
              <p className="mt-4 text-slate-500">
                A simple way to turn community observations into
                meaningful action.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Report",
                  description:
                    "Spot a street dog? Submit its location, photo and details.",
                },
                {
                  number: "02",
                  title: "Verify",
                  description:
                    "Reports are reviewed to maintain reliable community records.",
                },
                {
                  number: "03",
                  title: "Take action",
                  description:
                    "Volunteers coordinate care, health checks and welfare activities.",
                },
              ].map((step) => (
                <article
                  key={step.number}
                  className="rounded-2xl border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-sm font-bold text-indigo-600">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* About / CTA */}
        <section id="about" className="px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-600 px-7 py-14 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Be part of their story.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-indigo-100">
              Whether you report a sighting or volunteer your time,
              every small action makes a difference.
            </p>

            <a
              href="/signup"
              className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-600 transition hover:bg-indigo-50"
            >
              Join the community →
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-slate-400 sm:flex-row">
          <p className="font-semibold text-slate-700">
            🐾 Dog Territory
          </p>

          <p>© 2026 Dog Territory. Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
