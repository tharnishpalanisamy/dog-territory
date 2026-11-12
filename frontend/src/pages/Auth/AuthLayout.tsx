
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  children: React.ReactNode;
  mode: "signin" | "signup";
};

export default function AuthLayout({ children, mode }: AuthLayoutProps) {
  const isSignIn = mode === "signin";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="h-[76px] px-6 md:px-12 lg:px-24 flex items-center justify-between bg-white border-b border-slate-200">
        <Link to="/" className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white grid place-items-center text-2xl shadow-lg shadow-indigo-200">
            🐾
          </span>

          <span className="flex flex-col">
            <strong className="font-extrabold text-base tracking-tight">
              dog territory
            </strong>
            <small className="text-[9px] font-bold tracking-[1.5px] text-slate-400">
              EVERY DOG. EVERY LIFE.
            </small>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          {isSignIn ? "New to Dog Territory?" : "Already a member?"}
          <Link
            to={isSignIn ? "/signup" : "/signin"}
            className="font-bold text-indigo-600 hover:text-indigo-800"
          >
            {isSignIn ? "Create account" : "Sign in"}
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="w-full max-w-6xl flex-1 mx-auto px-3 sm:px-6 py-6 md:py-10">
        <div className="min-h-[620px] grid grid-cols-1 md:grid-cols-[1fr_0.9fr] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

          {/* Visual panel */}
          <aside className="relative min-h-[270px] md:min-h-[620px] overflow-hidden flex flex-col justify-between p-7 sm:p-10 lg:p-14 text-white">

            <img
              src="https://static.wixstatic.com/media/0cc78a_5febdcd482d94e97b14c2990d9603517~mv2.jpg/v1/fill/w_1200%2Ch_1200%2Cal_c%2Cq_85/0cc78a_5febdcd482d94e97b14c2990d9603517~mv2.jpg"
              alt="Indian Indie street dog sitting on an Indian city street"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/30 to-slate-950/90" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-[10px] font-bold tracking-widest">
                <span className="w-2 h-2 rounded-full bg-teal-300" />
                COMMUNITY · CARE · SAFER STREETS
              </div>
            </div>

            <div className="relative z-10 mt-12 md:mt-0 max-w-lg">
              <p className="text-teal-300 font-semibold text-2xl mb-3 italic">
                {isSignIn
                  ? "Every territory tells a story."
                  : "A little care goes a long way."}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
                {isSignIn ? (
                  <>
                    Good to have
                    <br />
                    you <span className="text-teal-300">back.</span>
                  </>
                ) : (
                  <>
                    Be part of
                    <br />
                    something <span className="text-teal-300">kind.</span>
                  </>
                )}
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-100">
                {isSignIn
                  ? "Sign in to help your community keep track of street dogs, follow welfare updates, and make every small act of care count."
                  : "Join people who care about the street dogs around them. Together, we can build a more informed and compassionate community."}
              </p>
            </div>

            <div className="relative z-10 hidden md:flex items-center gap-4 border-t border-white/20 pt-6 mt-10">
              <div className="flex -space-x-2">
                {["♥", "🐾", "✿"].map((item, index) => (
                  <span
                    key={index}
                    className="w-9 h-9 rounded-full bg-white text-teal-700 border-2 border-white flex items-center justify-center text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div>
                <p className="font-bold text-sm">
                  A kinder city starts with us.
                </p>
                <p className="text-xs text-slate-300">
                  Every dog. Every life.
                </p>
              </div>
            </div>
          </aside>

          {/* Form panel */}
          <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              {children}
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 pb-6 text-center text-xs text-slate-400">
        © 2026 Dog Territory · Built with{" "}
        <span className="text-red-400">♥</span> for a more compassionate world
      </footer>
    </div>
  );
}
