
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  HeartPulse,
} from "lucide-react";

export default function RabiesAwarenessCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
            <ShieldCheck size={25} />
          </div>

          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Community awareness
            </span>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Help keep our streets rabies-safe.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Learn how to recognize warning signs, respond safely
              to dog bites, and support responsible vaccination.
            </p>
          </div>
        </div>

        <Link
          to="/user/rabies-awareness"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <HeartPulse size={17} />
          Learn more
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
